from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class EmotionResult(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    mood = models.CharField(max_length=50, blank=True)
    image = models.ImageField(upload_to='emotion_images/', blank=True, null=True)
    confidence = models.FloatField(default=0.0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"EmotionResult for {self.user.username} on {self.created_at.date()}"
