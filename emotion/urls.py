from django.urls import path
from . import views
from .api_views import detect_emotion, delete_emotion_result

urlpatterns = [
    path('', views.emotion, name='emotion'),
    path('api/detect/', detect_emotion, name='detect_emotion'),
    path('api/results/<int:pk>/', delete_emotion_result, name='delete_emotion_result'),
]
