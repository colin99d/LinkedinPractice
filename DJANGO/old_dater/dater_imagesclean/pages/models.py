from django.contrib.auth.models import User
from django.db import models

# Create your models here.
SEX = ((1, 'Male'),(0, 'Female'))

class Profile(models.Model):     
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    gender = models.IntegerField(choices=SEX, default=1)
    birthdate = models.DateField()
    bio = models.CharField(max_length=100)
    userImg = models.ImageField(default="default.png",null=True, blank=True)
    

