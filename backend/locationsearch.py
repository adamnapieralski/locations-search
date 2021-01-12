import json
import copy
import logging

import geojson
from openrouteservice import client
from itertools import groupby
import objectparams as opms
import transportmeans as trmns
import osm2geojson as o2g

logger = logging.getLogger('locationsearch')

opr_api_key = '5b3ce3597851110001cf62480279a95227aa4e5f9ccf7cfa946e69f3'

opr_client = client.Client(key=opr_api_key)

timeout = 180

def process_request(payload):
    coords = payload['coords']
    main_object = payload['mainObject']
    relative_object = payload['relativeObject']

    poly_coords = None

    query = ""

    # search considering time reach distance
    if main_object['timeReachOn']:
        poly_coords = get_opr_isochrone_poly_coords(coords, main_object['maxDistance'], main_object['transportMean'])

    # search considering also relative object
    if relative_object['applicable']:
        query = get_ovp_main_relative_object_search_query(main_object, relative_object, coords, poly_coords)

    # search only by main object
    else:
        query = get_ovp_main_object_search_query(main_object, coords, poly_coords)

    query += "(._;>;);out body;"
    logger.info(query)

    try:
        return process_overpass_data(o2g.xml2geojson(o2g.overpass_call(query), filter_used_refs=True, log_level='INFO'))
    except Exception as e:
        msg = 'Error processing request. Try again.'
        logger.error(msg)

    return { 'error': msg }

def get_opr_isochrone_poly_coords(coords, max_distance, transport_mean_id):
    params = {
        'locations': [(coords['longitude'], coords['latitude'])],
        'profile': trmns.get_key_name(int(transport_mean_id)),
        'range_type': 'time',
        'range': [max_distance],
        'smoothing': 1.
    }
    response = opr_client.isochrones(**params)

    return response['features'][0]['geometry']['coordinates'][0]

def make_poly_str(poly_coords):
    coord_str = '"'
    for coord in poly_coords:
        coord_str += str(coord[1]) + ' ' + str(coord[0]) + ' '
    coord_str = coord_str.rstrip(' ')
    coord_str += '"'
    return '(poly:{})'.format(coord_str)

def make_around_line_str(poly_coords, distance):
    coord_str = ''
    for coord in poly_coords:
        coord_str += ',' + str(coord[1]) + ',' + str(coord[0])
    return '(around:{}{})'.format(distance, coord_str)

def make_params_query_part(params):
    q = ""
    params_sorted = sorted(params, key=lambda k: int(k['key']))
    groups = groupby(params_sorted, key=lambda k: k['key'])
    params_grouped = []

    for k, viter in groups:
        params_grouped.append(dict(
            key=opms.get_key_name(int(k)),
            values=list(opms.get_value_name(int(k), int(v['value'])) for v in viter))
        )
    
    for g in params_grouped:
        key = g['key']
        if len(g['values']) > 1:
            q += '["{}"~"'.format(key)
            for v in g['values']:
                q += '{}|'.format(v)
            q = q[:-1] + '"]'
        else:
            q += '["{}"="{}"]'.format(key, g['values'][0])

    return q

def get_ovp_main_object_search_query(main_object_data, coords, poly_coords=None):
    query = ''
    query += '[timeout:{}];'.format(timeout)
    query += 'nwr'

    query += make_params_query_part(main_object_data['params'])

    # search by physical distance
    if poly_coords == None:
        query += '(around:{}, {}, {});'.format(main_object_data['maxDistance'], coords['latitude'], coords['longitude'])
    # search by isochrone poly coords
    else:
        query += make_poly_str(poly_coords) + ';'

    return query

def get_ovp_main_relative_object_search_query(main_object_data, relative_object_data, coords, poly_coords):
    query = ''
    query += '[timeout:{}];'.format(timeout)
    query += 'nwr'

    query += make_params_query_part(main_object_data['params'])

    if poly_coords == None:
        query += '(around:{}, {}, {})->.main;'.format(main_object_data['maxDistance'], coords['latitude'], coords['longitude'])
        query += 'nwr{}(around:{}, {}, {})->.relative;'.format(
            make_params_query_part(relative_object_data['params']),
            int(main_object_data['maxDistance']) + int(relative_object_data['maxDistance']),
            coords['latitude'],
            coords['longitude']
        )
    else:
        query += make_poly_str(poly_coords) + '->.main;'
        relative_params_query = make_params_query_part(relative_object_data['params'])
        query += '(nwr{}{};nwr{}{};)->.relative;'.format(
            relative_params_query,
            make_poly_str(poly_coords),
            relative_params_query,
            make_around_line_str(poly_coords, relative_object_data['maxDistance'])
        )

    query += 'nwr.main(around.relative:{});'.format(relative_object_data['maxDistance'])
    return query

def process_overpass_data(data):
    for item in data.items():
        if item[0] == 'features':
            for feature in item[1]:
                prop_type = feature['properties']['type']
                geom_type = feature['geometry']['type']

                if prop_type != 'way' and prop_type != 'relation':
                    continue

                coords = feature['geometry']['coordinates']
                
                if prop_type == 'way':
                    if geom_type == 'LineString':
                        append_new_feature(item[1], feature, center_coordinates(coords, depth=0))
                    elif geom_type == 'Polygon':
                        append_new_feature(item[1], feature, center_coordinates(coords, depth=1))
                else:
                    if geom_type == 'MultiLineString':
                        append_new_feature(item[1], feature, center_coordinates(coords, depth=1))
                    elif geom_type == 'MultiPolygon':
                        append_new_feature(item[1], feature, center_coordinates(coords, depth=2))
    return data

def append_new_feature(collection, original_feature, coords):
    new_feature = copy.deepcopy(original_feature)
    new_feature['geometry']['type'] = 'Point'
    new_feature['properties']['type'] = 'node'
    new_feature['geometry']['coordinates'] = coords
    collection.append(new_feature)

def center_coordinates(coordinates, depth=0):
    x, y = 0, 0
    flat_coords = []

    if depth == 0:
        flat_coords = coordinates
    elif depth == 1:
        for cc in coordinates:
            for c in cc:
                flat_coords.append(c)
    elif depth == 2:
        for ccc in coordinates:
            for cc in ccc:
                for c in cc:
                    flat_coords.append(c)

    for c in flat_coords:
        x += c[0]
        y += c[1]
    return [x / len(flat_coords), y / (len(flat_coords))]