from django.shortcuts import render, redirect

# Create your views here.
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from django.urls import reverse_lazy
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import TemplateView
from django.views import generic


class HomePageView(LoginRequiredMixin, TemplateView):
    template_name = 'home.html'

    def get(self, request):
        form = RegisterForm()
        userInfo = Profile.objects.all()
        args = {'form':form, 'userInfo':userInfo}
        return render(request, self.template_name, args)

    def post(self, request):
        profile = Profile.objects.get(username=request.user)
        form = RegisterForm(instance=profile)
            
        if form.is_valid():
            submission = form.save(commit=False)
            submission.user = request.user
            submission.save()
            user = form['user']
            name = form['name']
            age = form['age']
            bio = form['bio']
            form = ProfileForm()
            return redirect('meet')

                
        args = {'form': form, 'user': user, 'name': name, 'age': age, 'bio':bio}
        return render(request, self.template_name, args)

class AboutPageView(TemplateView):
    template_name = 'about.html'

class MeetPageView(LoginRequiredMixin, TemplateView):
    template_name = 'meet.html'
    
    def get(self, request):
        userInfo = User.objects.all()
        args = {'userInfo':userInfo}
        return render(request, self.template_name, args)

class FirstPageView(TemplateView):
    template_name = 'first.html'

from django.contrib.auth.forms import UserCreationForm
from django.urls import reverse_lazy
from django.views import generic


class SignUp(generic.CreateView):
    form_class = UserCreationForm
    success_url = reverse_lazy('meet')
    template_name = 'signup.html'


        

