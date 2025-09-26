from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone

User = get_user_model()

class UserHealthProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    body_weight = models.FloatField(help_text="Weight in kilograms")
    height = models.FloatField(help_text="Height in centimeters")
    age = models.PositiveIntegerField()
    goal_choices = [
        ('muscle_gain', 'Muscle Gain'),
        ('fat_loss', 'Fat Loss'),
        ('weight_loss', 'Weight Loss'),
        ('maintenance', 'Maintenance'),
        ('other', 'Other'),
    ]
    goal = models.CharField(max_length=20, choices=goal_choices, default='maintenance')
    injury = models.CharField(max_length=100, blank=True, null=True, help_text="Physical injury or condition")
    is_pregnant = models.BooleanField(default=False)

    def __str__(self):
        return f"Health Profile for {self.user.username}"

class WorkoutPlan(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    warmup_exercises = models.JSONField(default=list, blank=True)
    exercises = models.JSONField(default=list, blank=True)  # List of dicts with name, sets, reps, duration
    suitable_for_injuries = models.JSONField(default=list, blank=True)  # List of injury keywords this plan is safe for
    suitable_for_pregnant = models.BooleanField(default=False)
    goal = models.CharField(max_length=20, choices=UserHealthProfile.goal_choices, default='maintenance')

    def __str__(self):
        return self.name

class Workout(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    workout_type = models.CharField(max_length=50, choices=[
        ('cardio', 'Cardio'),
        ('strength', 'Strength Training'),
        ('yoga', 'Yoga'),
        ('swimming', 'Swimming'),
        ('cycling', 'Cycling'),
        ('running', 'Running'),
        ('walking', 'Walking'),
    ])
    duration = models.PositiveIntegerField(help_text="Duration in minutes")
    intensity = models.CharField(max_length=20, choices=[
        ('low', 'Low'),
        ('moderate', 'Moderate'),
        ('high', 'High'),
    ], default='moderate')
    calories_burned = models.PositiveIntegerField()
    notes = models.TextField(blank=True, null=True)
    date = models.DateField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.workout_type} on {self.date}"

    class Meta:
        ordering = ['-date', '-created_at']
