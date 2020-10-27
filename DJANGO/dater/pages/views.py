from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm
from .forms import ProfileForm
from .models import Profile, Lover, Hater
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
            form = ProfileForm(request.POST, request.FILES, instance=profile)
            if form.is_valid():
                profile.save(force_update=True)
                return redirect('meet')
            
            args = {'form': form, 'gender': form.cleaned_data['gender'],'birthdate':form.cleaned_data['birthdate'] ,'bio':form.cleaned_data['bio'], 'userImg':form['userImg'].url}
            return render(request, self.template_name, args)
            
        except:
            form = ProfileForm(request.POST, request.FILES)
            if form.is_valid():
                submission = form.save(commit=False)
                submission.user = request.user
                submission.save()
                form = ProfileForm()
                return redirect('meet')
    
            args = {'form': form, 'gender': form.cleaned_data['gender'],'birthdate':form.cleaned_data['birthdate'] ,'bio':form.cleaned_data['bio'], 'userImg':form['userImg'].url}
            return render(request, self.template_name, args)

class AboutPageView(TemplateView):
    template_name = 'about.html'

class MeetPageView(LoginRequiredMixin, TemplateView):
    template_name = 'meet.html'
    
    def get(self, request):
        userInfo = Profile.objects.all()
        current_user = request.user
        profile = Profile.objects.get(user_id=current_user.id)
        lover, created = Lover.objects.get_or_create(current_user = current_user)
        if not created:
            loverInfo = lover.users.all()
            user_ids = [x.id for x in loverInfo]
        else:
            loverInfo = None
            user_ids = None 
            
        hater, created = Hater.objects.get_or_create(current_user = current_user)
        if not created:
            haterInfo = hater.users.all()
            hater_ids = [x.id for x in haterInfo]
        else:
            haterInfo = None
            hater_ids = None
        redirect('meet')

    
        args = {'userInfo':userInfo, 'currgen':profile.gender, 'loverInfo':loverInfo,'user_ids':user_ids, 'haterInfo':haterInfo, 'hater_ids':hater_ids}
        return render(request, self.template_name, args)

    def post(self, request):
        if 'like' in request.POST:
            key = request.POST['like']
            new_lover = User.objects.get(pk=key)
            Lover.make_match(request.user, new_lover)
        else:
            key = request.POST['dislike']
            new_hater = User.objects.get(pk=key)
            Hater.make_hater(request.user, new_hater)
            
        userInfo = Profile.objects.all()
        current_user = request.user
        profile = Profile.objects.get(user_id=current_user.id)
        redirect('home')
        currgen = profile.gender
        args = {'userInfo':userInfo, 'currgen':currgen}
        return render(request, self.template_name, args)

class FirstPageView(TemplateView):
    template_name = 'first.html'

class SignUp(CreateView):
    form_class = UserCreationForm
    success_url = reverse_lazy('home')
    template_name = 'signup.html'

class ChatView(TemplateView):
    template_name= 'chat.html'

    def get(self,request):
        profile = request.user
        lover = Lover.objects.get(current_user = profile.id)
        matchInfo = lover.users.all()
        args = {'matchInfo': matchInfo, 'profile':profile}
        return render(request, self.template_name, args)
        


        

