from django.contrib import admin
from .models import TiffinVendor, MenuItem, Menu

@admin.register(TiffinVendor)
class TiffinVendorAdmin(admin.ModelAdmin):
    list_display = ['kitchen_name', 'user', 'phone_number', 'is_verified', 'is_active', 'created_at']
    list_filter = ['is_verified', 'is_active', 'created_at']
    search_fields = ['kitchen_name', 'user__username', 'user__email', 'license_number']
    readonly_fields = ['created_at', 'updated_at']

@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
    list_display = ['name', 'vendor', 'category', 'price', 'is_vegetarian', 'is_available', 'created_at']
    list_filter = ['category', 'is_vegetarian', 'is_vegan', 'is_spicy', 'is_available', 'created_at']
    search_fields = ['name', 'vendor__kitchen_name', 'description']
    readonly_fields = ['created_at', 'updated_at']

@admin.register(Menu)
class MenuAdmin(admin.ModelAdmin):
    list_display = ['name', 'vendor', 'date', 'is_active', 'total_price', 'orders_count', 'max_orders']
    list_filter = ['is_active', 'date', 'created_at']
    search_fields = ['name', 'vendor__kitchen_name']
    readonly_fields = ['created_at', 'updated_at']
    filter_horizontal = ['menu_items']