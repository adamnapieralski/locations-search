import os
import json
from django.http import HttpResponse, HttpResponseNotFound, JsonResponse
import objectparams, locationsearch

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
