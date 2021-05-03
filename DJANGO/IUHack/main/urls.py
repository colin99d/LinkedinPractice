from django.urls import path
from .views import *

urlpatterns = [
    path('', LoginView.as_view(), name= "login"),
    path('verify/', VerifyView.as_view(), name="verify"),
    path('message/', MessageView.as_view(), name="message")
]