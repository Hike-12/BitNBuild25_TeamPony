from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register_vendor, name='vendor_register'),
    path('login/', views.login_vendor, name='vendor_login'),
    path('logout/', views.logout_vendor, name='vendor_logout'),
    path('profile/', views.get_vendor_profile, name='vendor_profile'),
    path('check-auth/', views.check_vendor_auth, name='vendor_check_auth'),
]