from django.urls import path
from . import views

urlpatterns = [
    path('hello/', views.hello_world, name='hello_world'),
    path('register/', views.register_user, name='register'),
    path('login/', views.login_user, name='login'),
    path('logout/', views.logout_user, name='logout'),
    path('profile/', views.get_profile, name='profile'),
    path('check-auth/', views.check_auth, name='check_auth'),
    path('menus/', views.get_all_vendor_menus, name='consumer_menus'),
    path('vendor/<int:vendor_id>/menus/', views.get_vendor_menu_by_id, name='vendor_menus'),
]