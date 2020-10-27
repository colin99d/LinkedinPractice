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

class Lover(models.Model):
    users = models.ManyToManyField(User)
    current_user = models.ForeignKey(User, related_name="owner", null=True, on_delete=models.CASCADE, default=None)

    @classmethod
    def make_match(cls, current_user, new_lover):
        lover, created = cls.objects.get_or_create(current_user=current_user)
        lover.users.add(new_lover)

    @classmethod
    def lose_match(cls, current_user, new_lover):
        lover, created = cls.objects.get_or_create(current_user=current_user)
        lover.users.remove(new_lover)

class Hater(models.Model):
    users = models.ManyToManyField(User)
    current_user = models.ForeignKey(User, related_name="owner1", null=True, on_delete=models.CASCADE, default=None)

    @classmethod
    def make_hater(cls, current_user, new_hater):
        hater, created = cls.objects.get_or_create(current_user=current_user)
        hater.users.add(new_hater)

    @classmethod
    def lose_hater(cls, current_user, new_hater):
        hater, created = cls.objects.get_or_create(current_user=current_user)
        hater.users.remove(new_hater)


    
    

