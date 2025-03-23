from django.views import View
from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout
from ..models import User
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

@method_decorator(csrf_exempt, name='dispatch')
class Login(View):
    def post(self, request):
        data = request.POST
        
        username = data.get("username")
        password = data.get("password")
        
        if not username or not password:
            return JsonResponse({"message": "username and password required"}, status=400)
        
        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            return JsonResponse({"message": "login successful"})
        else:
            return JsonResponse({"message": "login failed"}, status=400)
        
@method_decorator(csrf_exempt, name='dispatch')
class Logout(View):
    def post(self, request):
        logout(request)
        return JsonResponse({"message": "logout successful"})
    
@method_decorator(csrf_exempt, name='dispatch')
class SignUp(View):
    def post(self, request):
        data = request.POST

        name = data.get("name")
        username = data.get("username")
        password = data.get("password")
        email = data.get("email")
        phone_no = data.get("phone_no")
        age = data.get("age")

        if User.objects.filter(username=username).exists():
            return JsonResponse({"message": "username taken"}, status=400)
    
        user = User.objects.create_user(
            username=username, 
            password=password, 
            email=email, 
            name=name, 
            phone_no=phone_no,
            age=age
        )
        if user:
            login(request, user)
            return JsonResponse({"message": "signup successful"})
        else:
            return JsonResponse({"message": "signup failed"}, status=400)
