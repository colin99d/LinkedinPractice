# Generated by Django 3.0.7 on 2020-06-21 23:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pages', '0003_auto_20200621_1926'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='userImg',
            field=models.ImageField(null=True, upload_to='uploads/'),
        ),
    ]