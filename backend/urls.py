from django.urls import path
import views

urlpatterns = [
    path('api/location-search', views.location_search, name='location_search'),
    path('api/object-params', views.get_object_params, name='get_object_params')
]
