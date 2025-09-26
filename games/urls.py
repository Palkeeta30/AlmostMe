from django.urls import path
from . import views

urlpatterns = [
    path('', views.games, name='games'),
    path('memory-game/', views.memory_game, name='memory_game'),
]
