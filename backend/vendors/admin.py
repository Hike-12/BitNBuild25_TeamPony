from django.contrib import admin
from .models import Vendor

@admin.register(Vendor)
class VendorAdmin(admin.ModelAdmin):
    list_display = ['business_name', 'user', 'phone_number', 'is_verified', 'is_active', 'created_at']
    list_filter = ['is_verified', 'is_active', 'created_at']
    search_fields = ['business_name', 'user__username', 'user__email', 'license_number']
    readonly_fields = ['created_at', 'updated_at']