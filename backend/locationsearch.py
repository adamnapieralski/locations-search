import json
import folium
import overpass
from openrouteservice import client
from itertools import groupby
import objectparams as opms
import logging

logger = logging.getLogger('locationsearch')

opr_api_key = '5b3ce3597851110001cf62480279a95227aa4e5f9ccf7cfa946e69f3'

ovp_api = overpass.API(timeout=600)
opr_client = client.Client(key=opr_api_key)

def get_location_search_results(coordinates, main_object_params, relative_object_params):
    pass

def process_request(payload):
    coords = payload['coords']
    main_object = payload['mainObject']
    relative_object = payload['relativeObject']

    poly_coords = None

    query = ""

    # search considering time reach distance
    if main_object['timeReachOn']:
        # pass
        poly_coords = get_opr_isochrone_poly_coords(coords, main_object['maxDistance'])

    # search considering also relative object
    if relative_object['applicable']:
        query = get_ovp_main_relative_object_search_query(main_object, relative_object, coords, poly_coords)

    # search only by main object
    else:
        query = get_ovp_main_object_search_query(main_object, coords, poly_coords)

    logger.info(query)
    return ovp_api.get(query)

def get_opr_isochrone_poly_coords(coords, maxDistance):
    params = {
        'locations': [(coords['longitude'], coords['latitude'])],
        'profile': 'foot-walking',
        'range_type': 'time',
        'range': [maxDistance],
        'smoothing': 1.
    }
    response = opr_client.isochrones(**params)

    # TODO handle error responses
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

    query = 'nwr'

    query += make_params_query_part(main_object_data['params'])

    # search by physical distance
    if poly_coords == None:
        query += '(around:{}, {}, {});'.format(main_object_data['maxDistance'], coords['latitude'], coords['longitude'])
    # search by isochrone poly coords
    else:
        query += make_poly_str(poly_coords) + ';'
    query += '(._;>;);out;'

    return query

def get_ovp_main_relative_object_search_query(main_object_data, relative_object_data, coords, poly_coords):
    query = 'nwr'
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

    query += 'nwr.main(around.relative:{});(._;>;);out;'.format(relative_object_data['maxDistance'])
    return query