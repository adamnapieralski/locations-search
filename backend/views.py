import os
import json
from django.http import HttpResponse, HttpResponseNotFound, JsonResponse
import objectparams, transportmeans, locationsearch

def location_search(request):
    if request.method == 'POST':
        body = json.loads(request.body)
        geo_response = locationsearch.process_request(body)
        return JsonResponse(geo_response, safe=False)
    else:
        return HttpResponseNotFound('Invalid request')

def get_object_params(request):
    if request.method == 'GET':
        return JsonResponse(objectparams.object_params, safe=False)
    else:
        return HttpResponseNotFound('Invalid request')

def get_transport_means(request):
    if request.method == 'GET':
        return JsonResponse(transportmeans.transport_means, safe=False)
    else:
        return HttpResponseNotFound('Invalid request')
