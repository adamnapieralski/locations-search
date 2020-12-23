object_params = [
    {
        'id': 0,
        'name': 'amenity',
        'values': [
            { 'id': 0, 'name': 'parking' },
            { 'id': 1, 'name': 'school' },
            { 'id': 2, 'name': 'restaurant' },
            { 'id': 3, 'name': 'fuel' },
            { 'id': 4, 'name': 'cage' },
        ]
    },
    {
        'id': 1,
        'name': 'leisure',
        'values': [
            { 'id': 0, 'name': 'pitch' },
            { 'id': 1, 'name': 'park' },
            { 'id': 2, 'name': 'garden' },
            { 'id': 3, 'name': 'playground' },
            { 'id': 4, 'name': 'swimming_pool' },
        ]
    }
]

def get_key_name(key_id):
    return next((k for k in object_params if k['id'] == key_id))['name']

def get_value_name(key_id, value_id):
    key_obj = next((k for k in object_params if k['id'] == key_id))
    return next((v for v in key_obj['values'] if v['id'] == value_id))['name']