from django.db import models
from django.contrib.auth.models import User

class Task(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tasks')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.user.username})"


class Category(models.Model):
    name = models.CharField(max_length=100)
    # Linking it to a user so they only see their own categories
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.name
