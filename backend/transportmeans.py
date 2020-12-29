transport_means = [
    {
        'id': 0,
        'name': 'foot-walking'
    },
    {
        'id': 1,
        'name': 'driving-car'
    },
    {
        'id': 2,
        'name': 'cycling-regular'
    }
]

def get_key_name(key_id):
    return next((k for k in transport_means if k['id'] == key_id))['name']