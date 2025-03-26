import os
from django.shortcuts import render
from django.conf import settings

def index(request):
    # This will render the index.html in your frontend_build folder
    return render(request, 'index.html')
