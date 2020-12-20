from django.urls import path
from . import views
from django.views.decorators.csrf import csrf_exempt

urlpatterns = [
    path('', views.index, name='index'),
    path('location-search', views.location_search, name='location_search'),
    path('api/object-params', views.get_object_params, name='get_object_params')
]
