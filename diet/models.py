from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class DietLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    breakfast = models.JSONField(default=list)
    lunch = models.JSONField(default=list)
    dinner = models.JSONField(default=list)
    snack = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"DietLog for {self.user.username} on {self.created_at.date()}"
