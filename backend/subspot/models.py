from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    name = models.CharField(max_length=100,blank=True)
    phone_no = models.CharField(max_length=15,blank=True)

    def  __str__(self):
        return str(self.id) + self.name
    
