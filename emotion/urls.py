from django.urls import path
from . import views

urlpatterns = [
    path('', views.emotion, name='emotion'),
]
