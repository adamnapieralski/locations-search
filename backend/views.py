import os
import json
import folium
import overpass
from django.shortcuts import render
from django.http import HttpResponse, HttpResponseNotFound, JsonResponse
import objectparams, locationsearch
import time

default_location = [51.782065, 19.459279]

def index(request):

    location = None

    if 'location' in request.COOKIES:
        loc = [str(x) for x in request.COOKIES['location'].split('_')]
        if len(loc) == 2:
            location = loc

    if location is None:
        location = default_location

    # folium
    m = folium.Map(location=location,zoom_start=13)

    api = overpass.API()
    resp = api.get('node["shop"="supermarket"](around:2000.0, {}, {});'.format(*location))

    ## style
    style_shops = { 'color': 'blue'}

    ## adding to view
    folium.GeoJson(resp,name='shops',style_function=lambda x:style_shops).add_to(m)
    folium.LayerControl().add_to(m)

    ## exporting
    m=m._repr_html_()
    context = {'my_map': m}

    ## rendering
    return render(request, 'index.html', context)

def location_search(request):
    print('got request')
    if request.method == 'POST':
        body = json.loads(request.body)
        print(body)
        geo_response = locationsearch.process_request(body)
        # context = { 'my_map': result_map }
        # print(context)
        # return render(request, 'index.html', context)
        return JsonResponse(geo_response, safe=False)
    else:
        return HttpResponseNotFound('Invalid request')
    return render(request, 'index.html')

def get_object_params(request):
    if request.method == 'GET':
        return JsonResponse(objectparams.object_params, safe=False)
    else:
        return HttpResponseNotFound('Invalid request')

# def ajax(request, ajax_request):    
#     return HttpResponseNotFound('Cannot handle ajax request')
