
from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('boat', views.boat, name='boat'),
]
