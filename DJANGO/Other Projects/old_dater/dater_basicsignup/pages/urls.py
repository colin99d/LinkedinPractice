from django.urls import path, include
from .views import HomePageView, AboutPageView, MeetPageView, FirstPageView, SignUp
from django.contrib.auth.views import LoginView
from . import views


urlpatterns = [
    path('about/', AboutPageView.as_view(), name='about'),
    path('meet/', MeetPageView.as_view(), name='meet'),
    path('home/', HomePageView.as_view(), name='home'),
    path('signup/', views.SignUp.as_view(), name='signup'),
    path('accounts/', include('django.contrib.auth.urls')),
    path('', FirstPageView.as_view(), name='first'),
    path('login/', LoginView.as_view(template_name='login.html'), name='login'),
    ]
