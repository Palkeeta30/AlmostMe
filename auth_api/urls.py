from django.urls import path
from . import views

urlpatterns = [
    path('csrf/', views.api_csrf, name='api_csrf'),
    path('login/', views.api_login, name='api_login'),
    path('signup/', views.api_signup, name='api_signup'),
    path('logout/', views.api_logout, name='api_logout'),
    path('current_user/', views.api_current_user, name='api_current_user'),
    path('refresh_session/', views.api_refresh_session, name='api_refresh_session'),
    path('update_profile/', views.api_update_profile, name='api_update_profile'),
    path('delete_account/', views.api_delete_account, name='api_delete_account'),
    path('change_password/', views.api_change_password, name='api_change_password'),
]
