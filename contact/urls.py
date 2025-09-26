from django.urls import path
from . import views

urlpatterns = [
    path('', views.contact, name='contact'),
    path('api/send/', views.contact_api_send, name='contact_api_send'),
]
