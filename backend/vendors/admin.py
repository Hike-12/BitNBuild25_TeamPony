from django.contrib import admin
from .models import TiffinVendor, MenuItem, Menu

@admin.register(TiffinVendor)
class TiffinVendorAdmin(admin.ModelAdmin):
    list_display = ['kitchen_name', 'user', 'phone_number', 'is_verified', 'is_active', 'created_at']
    list_filter = ['is_verified', 'is_active', 'created_at']
    search_fields = ['kitchen_name', 'user__username', 'phone_number', 'license_number']
    readonly_fields = ['created_at', 'updated_at']

@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
    list_display = ['name', 'vendor', 'category', 'price', 'is_vegetarian', 'is_available_today', 'created_at']
    list_filter = ['category', 'is_vegetarian', 'is_spicy', 'is_available_today', 'created_at']
    search_fields = ['name', 'vendor__kitchen_name']
    readonly_fields = ['created_at', 'updated_at']
    
    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "vendor":
            kwargs["queryset"] = TiffinVendor.objects.filter(is_active=True)
        return super().formfield_for_foreignkey(db_field, request, **kwargs)

@admin.register(Menu)
class MenuAdmin(admin.ModelAdmin):
    list_display = ['name', 'vendor', 'date', 'full_dabba_price', 'dabbas_sold', 'max_dabbas', 'is_veg_only', 'is_active']
    list_filter = ['date', 'is_veg_only', 'is_active', 'cooking_style', 'created_at']
    search_fields = ['name', 'vendor__kitchen_name', 'todays_special']
    readonly_fields = ['created_at', 'updated_at', 'is_veg_only']
    
    # Updated filter_horizontal for new field names
    filter_horizontal = ['main_items', 'side_items', 'extras']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('vendor', 'name', 'date', 'image')
        }),
        ('Dabba Contents', {
            'fields': ('main_items', 'side_items', 'extras'),
            'description': 'Select items for different categories in the dabba'
        }),
        ('Pricing & Capacity', {
            'fields': ('full_dabba_price', 'max_dabbas', 'dabbas_sold')
        }),
        ('Special Details', {
            'fields': ('todays_special', 'cooking_style', 'is_active'),
            'classes': ('collapse',)
        }),
        ('Auto Fields', {
            'fields': ('is_veg_only', 'created_at', 'updated_at'),
            'classes': ('collapse',),
            'description': 'These fields are automatically calculated'
        })
    )
    
    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "vendor":
            kwargs["queryset"] = TiffinVendor.objects.filter(is_active=True)
        return super().formfield_for_foreignkey(db_field, request, **kwargs)
    
    def formfield_for_manytomany(self, db_field, request, **kwargs):
        if db_field.name in ['main_items', 'side_items', 'extras']:
            # Only show items from the same vendor (you can add this logic if needed)
            kwargs["queryset"] = MenuItem.objects.filter(is_available_today=True)
        return super().formfield_for_manytomany(db_field, request, **kwargs)

    # Custom admin methods for better display
    def get_main_items_display(self, obj):
        return ", ".join([item.name for item in obj.main_items.all()[:3]]) + ("..." if obj.main_items.count() > 3 else "")
    get_main_items_display.short_description = "Main Items"
    
    def dabbas_remaining_display(self, obj):
        return obj.dabbas_remaining
    dabbas_remaining_display.short_description = "Remaining"
    dabbas_remaining_display.admin_order_field = 'max_dabbas'