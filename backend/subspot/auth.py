from django.views import View
from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout
from .models import User
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator


@method_decorator(csrf_exempt, name='dispatch')
class Login(View):
    def post(self, request):
        username=request.POST.get("username")
        password=request.POST.get("password")
        user = authenticate(username=request.POST.get("username"), password=request.POST.get("password"))
        if user is not None:
            login(request, user)
            return JsonResponse({"message": "login successful"})
        else:
            return JsonResponse({"message": "login failed", "username": username, "password": password}, status=400)
        
@method_decorator(csrf_exempt, name='dispatch')
class Logout(View):
    def post(self, request):
        logout(request)
        return JsonResponse({"message": "logout successful"})
    
@method_decorator(csrf_exempt, name='dispatch')
class SignUp(View):
    def post(self, request):
        name = request.POST.get("name")
        username = request.POST.get("username")
        password = request.POST.get("password")
        email = request.POST.get("email")
        phone_no = request.POST.get("phone_no")
        # print(name, username, password, email)
        user = User.objects.filter(username=username).first()
        if user is not None:
            return JsonResponse({"message": "user already exists"}, status=400)
        else:
            user = User.objects.create_user(username=username, password=password, email=email, name=name, phone_no=phone_no)

        user = User.objects.filter(username=username).first()
        if user is not None:
            login(request, user)
            return JsonResponse({"message": "signup successful"})
        else:
            return JsonResponse({"message": "signup failed"}, status=400)

