from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserHealthProfileViewSet, WorkoutPlanViewSet, WorkoutViewSet, fitness_page

router = DefaultRouter()
router.register(r'user-health-profile', UserHealthProfileViewSet, basename='userhealthprofile')
router.register(r'workout-plans', WorkoutPlanViewSet, basename='workoutplan')
router.register(r'workouts', WorkoutViewSet, basename='workout')

urlpatterns = [
    path('', fitness_page, name='fitness_page'),
    path('api/', include(router.urls)),
    # Legacy endpoints for frontend compatibility
    path('api/log-workout/', WorkoutViewSet.as_view({'post': 'log_workout'}), name='log-workout'),
    path('api/history/', WorkoutViewSet.as_view({'get': 'history'}), name='workout-history'),
]
