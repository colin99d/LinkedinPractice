from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm
from .forms import ProfileForm
from .models import Profile
from django.contrib.auth.models import User
from django.urls import reverse_lazy
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import TemplateView, CreateView
# Create your views here.


class HomePageView(LoginRequiredMixin, TemplateView):
    template_name = 'home.html'

    def get(self, request):
        form = ProfileForm()
        userInfo = Profile.objects.all()
        args = {'form':form, 'userInfo':userInfo}
        return render(request, self.template_name, args)

    def post(self, request):
        try:
            profile = request.user.profile
            form = ProfileForm(request.POST, instance=profile)
            if form.is_valid():
                profile.gender = form.cleaned_data['gender']
                profile.birthdate = form.cleaned_data['birthdate']
                profile.bio = form.cleaned_data['bio']
                profile.save(force_update=True)
                return redirect('meet')
            
        except:
            #profile = Profile.objects.get(user_id=User.id)
            form = ProfileForm(request.POST)
            
            if form.is_valid():
                submission = form.save(commit=False)
                submission.user = request.user
                submission.save()
                gender = form.cleaned_data['gender']
                birthdate = form.cleaned_data['birthdate']
                bio = form.cleaned_data['bio']
                form = ProfileForm()
                return redirect('meet')

                
        args = {'form': form, 'gender': gender,'birthday':birthday ,'bio':bio}
        return render(request, self.template_name, args)

class AboutPageView(TemplateView):
    template_name = 'about.html'

class MeetPageView(LoginRequiredMixin, TemplateView):
    template_name = 'meet.html'
    
    def get(self, request):
        userInfo = Profile.objects.all()
        current_user = request.user
        profile = Profile.objects.get(user_id=current_user.id)
        currgen = profile.gender
        args = {'userInfo':userInfo, 'currgen':currgen}
        return render(request, self.template_name, args)

class FirstPageView(TemplateView):
    template_name = 'first.html'

class SignUp(CreateView):
    form_class = UserCreationForm
    success_url = reverse_lazy('meet')
    template_name = 'signup.html'


        

