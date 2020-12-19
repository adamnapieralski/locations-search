from django.shortcuts import render
import os
import folium
import overpass
import json
from django.http import HttpResponse, HttpResponseNotFound

default_location = [51.782065, 19.459279]

def index(request):

    location = None

    if 'location' in request.COOKIES:
        loc = [str(x) for x in request.COOKIES['location'].split('_')]
        if len(loc) == 2:
            location = loc

    if location is None:
        location = default_location

    print('cookies', request.COOKIES)    
    print('index requested', location)

    
    # shp_dir = os.path.join(os.getcwd(),'media','shp')

    # location = get_client_location(request)

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

def ajax(request, ajax_request):    
    return HttpResponseNotFound('Cannot handle ajax request')