from django.conf.urls import url
from . import views
from django.views.decorators.csrf import csrf_exempt

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^ajax/(?P<ajax_request>\w+)/$', csrf_exempt(views.ajax), name='ajax')
]
