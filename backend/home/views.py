from django.http import JsonResponse
from django.shortcuts import render

# Create your views here.
def hello_world(request):
    return JsonResponse({'message': 'Rohan Shiggy'})