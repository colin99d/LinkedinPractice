# Generated by Django 3.0.7 on 2020-07-19 20:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pages', '0009_auto_20200622_2217'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='followers',
            field=models.ManyToManyField(related_name='followees', to='pages.Profile'),
        ),
    ]