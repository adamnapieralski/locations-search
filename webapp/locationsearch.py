import json
import overpass
from openrouteservice import client

opr_api_key = '5b3ce3597851110001cf62480279a95227aa4e5f9ccf7cfa946e69f3'

ovp_api = overpass.API(timeout=600)
opr_client = client.Client(key=opr_api_key)

def get_location_search_results(coordinates, main_object_params, relative_object_params):
    pass
