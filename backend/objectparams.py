object_params = [
    {
        'id': 0,
        'name': 'amenity',
        'values': [
            { 'id': 0, 'name': 'parking' },
            { 'id': 1, 'name': 'school' },
            { 'id': 2, 'name': 'restaurant' },
            { 'id': 3, 'name': 'fuel' },
            { 'id': 4, 'name': 'cafe' },
            { 'id': 5, 'name': 'fast_food' },
            { 'id': 6, 'name': 'toilets' },
            { 'id': 7, 'name': 'pharmacy' },
            { 'id': 8, 'name': 'hospital' },
            { 'id': 9, 'name': 'post_office' },
            { 'id': 10, 'name': 'pub' },
            { 'id': 11, 'name': 'police' },
            { 'id': 12, 'name': 'fire_station' },
            { 'id': 13, 'name': 'library' },
            { 'id': 14, 'name': 'university' },
            { 'id': 15, 'name': 'theatre' },
            { 'id': 16, 'name': 'cinema' },
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
    },
    {
        'id': 2,
        'name': 'tourism',
        'values': [
            { 'id': 0, 'name': 'information' },
            { 'id': 1, 'name': 'hotel' },
            { 'id': 2, 'name': 'attraction' },
            { 'id': 3, 'name': 'viewpoint' },
            { 'id': 4, 'name': 'artwork' },
            { 'id': 5, 'name': 'guest_house' },
            { 'id': 6, 'name': 'museum' },
            { 'id': 7, 'name': 'apartment' },
            { 'id': 8, 'name': 'hostel' },
            { 'id': 9, 'name': 'motel' },
            { 'id': 10, 'name': 'camp_site' },
            { 'id': 11, 'name': 'gallery' },
            { 'id': 12, 'name': 'zoo' },
            { 'id': 13, 'name': 'camping' },
            { 'id': 14, 'name': 'tower' },
            { 'id': 15, 'name': 'landmark' },
            { 'id': 16, 'name': 'castle' },
        ]
    },
    {
        'id': 3,
        'name': 'natural',
        'values': [
            { 'id': 0, 'name': 'water' },
            { 'id': 1, 'name': 'wood' },
            { 'id': 2, 'name': 'peak' },
            { 'id': 3, 'name': 'beach' },
            { 'id': 4, 'name': 'sand' },
        ]
    },
    {
        'id': 4,
        'name': 'waterway',
        'values': [
            { 'id': 0, 'name': 'river' },
            { 'id': 1, 'name': 'stream' },
            { 'id': 2, 'name': 'waterfall' },
            { 'id': 3, 'name': 'canal' },
            { 'id': 4, 'name': 'dam' },
        ]
    },
    {
        'id': 5,
        'name': 'water',
        'values': [
            { 'id': 0, 'name': 'lake' },
            { 'id': 1, 'name': 'pond' },
            { 'id': 2, 'name': 'river' },
            { 'id': 3, 'name': 'salt' },
        ]
    },
    {
        'id': 6,
        'name': 'shop',
        'values': [
            { 'id': 0, 'name': 'convenience' },
            { 'id': 1, 'name': 'supermarket' },
            { 'id': 2, 'name': 'clothes' },
            { 'id': 3, 'name': 'hair_dresser' },
            { 'id': 4, 'name': 'bakery' },
            { 'id': 5, 'name': 'butcher' },
            { 'id': 6, 'name': 'beauty' },
            { 'id': 7, 'name': 'florist' },
            { 'id': 8, 'name': 'electronics' },
            { 'id': 9, 'name': 'alcohol' },
            { 'id': 10, 'name': 'mall' },
            { 'id': 11, 'name': 'jewelry' },
            { 'id': 12, 'name': 'books' },
            { 'id': 13, 'name': 'laundry' },
            { 'id': 14, 'name': 'toys' },
            { 'id': 15, 'name': 'ticket' },
        ]
    },
    {
        'id': 7,
        'name': 'highway',
        'values': [
            { 'id': 0, 'name': 'residential' },
            { 'id': 1, 'name': 'service' },
            { 'id': 2, 'name': 'track' },
            { 'id': 3, 'name': 'footway' },
            { 'id': 4, 'name': 'path' },
            { 'id': 5, 'name': 'tertiary' },
            { 'id': 6, 'name': 'crossing' },
            { 'id': 7, 'name': 'pedestrian' },
            { 'id': 8, 'name': 'cycleway' },
        ]
    },
    {
        'id': 8,
        'name': 'surface',
        'values': [
            { 'id': 0, 'name': 'asphalt' },
            { 'id': 1, 'name': 'unpaved' },
            { 'id': 2, 'name': 'paved' },
            { 'id': 3, 'name': 'ground' },
            { 'id': 4, 'name': 'gravel' },
            { 'id': 5, 'name': 'concrete' },
            { 'id': 6, 'name': 'paving_stones' },
            { 'id': 7, 'name': 'dirt' },
            { 'id': 8, 'name': 'grass' },
        ]
    }

]

def get_key_name(key_id):
    return next((k for k in object_params if k['id'] == key_id))['name']

def get_value_name(key_id, value_id):
    key_obj = next((k for k in object_params if k['id'] == key_id))
    return next((v for v in key_obj['values'] if v['id'] == value_id))['name']