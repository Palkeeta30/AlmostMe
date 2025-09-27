from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class GameScore(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    game = models.CharField(max_length=100)
    score = models.PositiveIntegerField()
    level = models.PositiveIntegerField()
    duration = models.PositiveIntegerField(help_text='Duration in seconds')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.game} score for {self.user.username}"
