import time

import locationsearch
import transportmeans
import objectparams

_sleep_time = 60 # s

_lodz_coords = {
        'latitude': 51.7820,
        'longitude': 19.4592
}

_warsaw_coords = {
        'latitude': 52.2246,
        'longitude': 21.0209
}

_params = [
    { # 0
        'key': 0, # amenity
        'value': 0 # school
    },
    { # 1
        'key': 0, # amenity
        'value': 10 # police
    },
    { # 2
        'key': 0, # amenity
        'value': 6 # pharmacy
    },
    { # 3
        'key': 1, # leisure
        'value': 1 # park
    },
    { # 4
        'key': 1, # leisure
        'value': 4 # swimming pool
    },
    { # 5
        'key': 2, # tourism
        'value': 1 # hotel
    },
    { # 6
        'key': 2, # tourism
        'value': 11 # gallery
    },
    { # 7
        'key': 5, # water
        'value': 0 # lake
    }
]

def run_single_object_query(distance, parameters):
    payload = {
        'coords': _lodz_coords,
        'mainObject': {
            'maxDistance': distance,
            'params': parameters,
            'timeReachOn': False
        },
        'relativeObject': {
            'applicable': False
        }
    }

    return locationsearch.process_request(payload)

def run_double_object_query(distance, main_obj_parameters, relative_object_parameters, relative_distance):
    payload = {
        'coords': _warsaw_coords,
        'mainObject': {
            'maxDistance': distance,
            'params': main_obj_parameters,
            'timeReachOn': False
        },
        'relativeObject': {
            'applicable': True,
            'params': relative_object_parameters,
            'maxDistance': relative_distance
        }
    }

    return locationsearch.process_request(payload)

def run_single_object_time_query(distance, parameters, transport_mean):
    payload = {
        'coords': _lodz_coords,
        'mainObject': {
            'maxDistance': distance,
            'transportMean': transport_mean,
            'params': parameters,
            'timeReachOn': True
        },
        'relativeObject': {
            'applicable': False
        }
    }

    return locationsearch.process_request(payload)

def params_string(params):
    res = ''
    for p in params:
        res += objectparams.get_value_name(p['key'], p['value'])
        res += '; '

    if len(res) > 2:
        return res[:-2]

    return res

def append_out_file(fname, distance, params, time, results_number):
    with open(fname, 'a') as f:
        f.write(
            str(distance) + ',' +
            params_string(params) + ',' +
            str(time) + ',' +
            str(results_number) + '\n'
        )

def append_out_file(fname, distance, params, rel_distance, rel_params, time, results_number):
    with open(fname, 'a') as f:
        f.write(
            str(distance) + ',' +
            params_string(params) + ',' +
            str(rel_distance) + ',' +
            params_string(rel_params) + ',' +
            str(time) + ',' +
            str(results_number) + '\n'
        )

def append_out_file_time(fname, distance, params, transport, time, results_number):
    with open(fname, 'a') as f:
        f.write(
            str(distance) + ',' +
            params_string(params) + ',' +
            transportmeans.get_key_name(transport) + ',' +
            str(time) + ',' +
            str(results_number) + '\n'
        )

def run_distance_performance_tests(out_file):

    distances = [1000, 5000, 10000, 50000, 100000, 200000]
    parameters = [[_params[5], _params[6]]]

    for param in parameters:
        for distance in distances:
            start = time.time()
            res = run_single_object_query(distance, param)
            dt = time.time() - start

            results_num = len(res['geojson']['features'])

            append_out_file(out_file, distance, param, dt, results_num)
            time.sleep(_sleep_time)

def run_double_distance_performance_tests(out_file):

    distances = [5000, 10000, 50000, 100000, 200000]
    main_object_parameters = [_params[1]]

    relative_distances = [500, 1000, 5000]
    relative_object_parameters = [_params[5]]

    for distance in distances:
        for rel_distance in relative_distances:
            start = time.time()
            res = run_double_object_query(distance, main_object_parameters, relative_object_parameters, rel_distance)
            dt = time.time() - start

            results_num = len(res['geojson']['features'])

            append_out_file(out_file, distance, main_object_parameters, rel_distance, relative_object_parameters, dt, results_num)
            time.sleep(_sleep_time)

def run_time_distance_performance_tests(out_file):

    # car limit - 60
    # bike limit - 300
    # walk limit - 1200

    distances = [10, 30, 60]

    transport_mean = 1

    parameters = [_params[0]]

    for distance in distances:
        start = time.time()
        res = run_single_object_time_query(distance, parameters, transport_mean)
        dt = time.time() - start

        results_num = len(res['geojson']['features'])

        append_out_file_time(out_file, distance, parameters, transport_mean, dt, results_num)
        time.sleep(_sleep_time)


if __name__ == "__main__":
    # run_distance_performance_tests('distance_perf_two_objects.csv')
    # run_double_distance_performance_tests('distance_perf_rel_objects.csv')
    run_time_distance_performance_tests('distance_perf_time.csv')
