from django.views.decorators.csrf import csrf_exempt
from django.views.generic.base import TemplateView
from django.shortcuts import redirect, reverse
from .functions import loginIU
import json

browser = None
username = None
password = None
# Create your views here.
class LoginView(TemplateView):
    template_name = "login.html"

    def post(self,request):
        username = request.POST.get("username")
        password = request.POST.get("password")
        return redirect('verify/')

class VerifyView(TemplateView):
    template_name = "verify.html"

    @csrf_exempt
    def dispatch(self, request, *args, **kwargs):
        return super(VerifyView, self).dispatch(request, *args, **kwargs)
    
    def post(self,request):
        selection = request.POST.get("selection")
        loginIU(username, password, selection)
        return redirect("../message/")

class MessageView(TemplateView):
    template_name = "message.html"