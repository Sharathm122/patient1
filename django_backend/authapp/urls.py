from django.urls import re_path
from . import views

urlpatterns = [
    re_path(r'^register/?$', views.register),
    re_path(r'^login/?$', views.login),
    re_path(r'^me/?$', views.get_me),
    re_path(r'^profile/?$', views.update_profile),
    re_path(r'^change-password/?$', views.change_password),
]
