from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.
class CustomUser(AbstractUser):
    username = models.CharField(max_length=20, unique=True, blank=False)
    email = models.EmailField(max_length=100, unique=True, blank=False)

    def __str__(self):
        return self.username