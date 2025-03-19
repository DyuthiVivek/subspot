from django.views import View
from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout
from .models import User
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import json

@method_decorator(csrf_exempt, name='dispatch')
class Login(View):
     def post(self, request):
        try:
            # Attempt to parse JSON
            data = json.loads(request.body)
        except json.JSONDecodeError:
            # Fallback: use form data if JSON parsing fails
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
        print("Raw request body:", request.body)
        # Parse raw JSON
        data = json.loads(request.body)

        name = data.get("name")
        username = data.get("username")
        password = data.get("password")
        email = data.get("email")
        phone_no = data.get("phone_no")

        # Check if user already exists
        if User.objects.filter(username=username).exists():
            return JsonResponse({"message": "user already exists"}, status=400)
        
        # Create user
        user = User.objects.create_user(
            username=username, 
            password=password, 
            email=email, 
            name=name, 
            phone_no=phone_no
        )

        # Log the user in
        login(request, user)
        return JsonResponse({"message": "signup successful"})
