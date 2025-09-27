from rest_framework import serializers
from .models import UserHealthProfile, WorkoutPlan, Workout

class UserHealthProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserHealthProfile
        fields = '__all__'
        read_only_fields = ['user']

class WorkoutPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkoutPlan
        fields = '__all__'

class WorkoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workout
        fields = '__all__'
        read_only_fields = ['user', 'created_at']
