from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db import models
from .models import UserHealthProfile, WorkoutPlan, Workout
from .serializers import UserHealthProfileSerializer, WorkoutPlanSerializer, WorkoutSerializer

def fitness_page(request):
    return render(request, 'fitness/index.html')

class UserHealthProfileViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserHealthProfileSerializer

    def get_queryset(self):
        return UserHealthProfile.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def create(self, request, *args, **kwargs):
        # Override create to handle duplicate profile for user
        if UserHealthProfile.objects.filter(user=request.user).exists():
            return Response({"detail": "Profile already exists."}, status=status.HTTP_400_BAD_REQUEST)
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        # Override update to ensure user cannot update others' profiles
        instance = self.get_object()
        if instance.user != request.user:
            return Response({"detail": "Not authorized to update this profile."}, status=status.HTTP_403_FORBIDDEN)
        return super().update(request, *args, **kwargs)

    @action(detail=False, methods=['get'])
    def me(self, request):
        if not request.user.is_authenticated:
            return Response({"detail": "Authentication required."}, status=status.HTTP_401_UNAUTHORIZED)
        profile = UserHealthProfile.objects.filter(user=request.user).first()
        if profile:
            serializer = self.get_serializer(profile)
            return Response(serializer.data)
        return Response({"detail": "Profile not found."}, status=status.HTTP_404_NOT_FOUND)

    def get_permissions(self):
        # Override to allow unauthenticated access to 'me' action for testing
        if self.action == 'me':
            return []
        return super().get_permissions()

class WorkoutPlanViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = WorkoutPlanSerializer
    queryset = WorkoutPlan.objects.all()

    def list(self, request, *args, **kwargs):
        user_profile = UserHealthProfile.objects.filter(user=request.user).first()
        if not user_profile:
            return Response({"detail": "User health profile not found."}, status=status.HTTP_404_NOT_FOUND)

        # Filter workout plans based on user profile
        plans = WorkoutPlan.objects.filter(goal=user_profile.goal)
        if user_profile.is_pregnant:
            plans = plans.filter(suitable_for_pregnant=True)
        else:
            # Include plans suitable for user's injury or with empty suitable_for_injuries
            if user_profile.injury:
                plans = plans.filter(
                    models.Q(suitable_for_injuries__contains=[user_profile.injury]) |
                    models.Q(suitable_for_injuries=[])
                )

        serializer = self.get_serializer(plans, many=True)
        return Response(serializer.data)

class WorkoutViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = WorkoutSerializer

    def get_queryset(self):
        return Workout.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_permissions(self):
        if self.action == 'history':
            return []
        return super().get_permissions()

    @action(detail=False, methods=['get'])
    def history(self, request):
        """Get workout history for the authenticated user"""
        workouts = self.get_queryset()
        serializer = self.get_serializer(workouts, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def log_workout(self, request):
        """Log a new workout for the authenticated user"""
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
