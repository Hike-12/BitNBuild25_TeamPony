from django.db import models
from django.contrib.auth.models import User

class TiffinVendor(models.Model):
    """
    TiffinVendor model for storing tiffin service owner profile information.
    This is renamed from Vendor to better reflect the tiffin delivery business.
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    kitchen_name = models.CharField(max_length=200, help_text="Name of the kitchen/tiffin service")
    address = models.TextField(help_text="Complete address of the kitchen")
    phone_number = models.CharField(max_length=15)
    license_number = models.CharField(max_length=100, unique=True)
    is_verified = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True, help_text="Indicates if the vendor's profile is live")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.kitchen_name} - {self.user.username}"

    class Meta:
        db_table = 'vendors_tiffin_vendor'
        verbose_name = "Tiffin Vendor"
        verbose_name_plural = "Tiffin Vendors"


class MenuItem(models.Model):
    """
    MenuItem model represents an individual dish that a vendor can create.
    This is like a master list of all possible food items the vendor can cook.
    """
    CATEGORY_CHOICES = [
        ('main_course', 'Main Course'),
        ('side_dish', 'Side Dish'),
        ('bread', 'Bread'),
        ('dessert', 'Dessert'),
        ('beverage', 'Beverage'),
        ('snack', 'Snack'),
    ]

    vendor = models.ForeignKey(TiffinVendor, on_delete=models.CASCADE, related_name='menu_items')
    name = models.CharField(max_length=200, help_text="Name of the dish")
    description = models.TextField(help_text="Detailed description of the dish")
    image = models.ImageField(upload_to='menu_items/', blank=True, null=True, help_text="Image of the dish")
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='main_course')
    price = models.DecimalField(max_digits=8, decimal_places=2, help_text="Price of the item")
    is_vegetarian = models.BooleanField(default=True, help_text="Is this item vegetarian?")
    is_vegan = models.BooleanField(default=False, help_text="Is this item vegan?")
    is_spicy = models.BooleanField(default=False, help_text="Is this item spicy?")
    preparation_time = models.PositiveIntegerField(help_text="Preparation time in minutes", default=30)
    is_available = models.BooleanField(default=True, help_text="Is this item currently available?")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.vendor.kitchen_name}"

    class Meta:
        unique_together = ['vendor', 'name']
        ordering = ['category', 'name']
        verbose_name = "Menu Item"
        verbose_name_plural = "Menu Items"


class Menu(models.Model):
    """
    Menu model represents the actual menu for a specific day.
    A vendor creates a new Menu instance for each day they operate
    and populates it with items from their MenuItem list.
    """
    vendor = models.ForeignKey(TiffinVendor, on_delete=models.CASCADE, related_name='menus')
    name = models.CharField(max_length=200, help_text="Name of the menu (e.g., 'Monday Special', 'Weekend Feast')")
    date = models.DateField(help_text="Date for which this menu is created")
    menu_items = models.ManyToManyField(MenuItem, related_name='daily_menus', help_text="Items included in this menu")
    is_active = models.BooleanField(default=True, help_text="Is this menu currently active?")
    special_instructions = models.TextField(blank=True, null=True, help_text="Any special instructions for this menu")
    total_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True, help_text="Total price for complete menu")
    max_orders = models.PositiveIntegerField(default=50, help_text="Maximum number of orders for this menu")
    orders_count = models.PositiveIntegerField(default=0, help_text="Current number of orders")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.date} - {self.vendor.kitchen_name}"

    @property
    def is_available(self):
        """Check if menu is still available for orders"""
        return self.is_active and self.orders_count < self.max_orders

    def save(self, *args, **kwargs):
        # Auto-calculate total price if not set
        if not self.total_price and self.pk:
            total = sum(item.price for item in self.menu_items.all())
            self.total_price = total
        super().save(*args, **kwargs)

    class Meta:
        unique_together = ['vendor', 'date', 'name']
        ordering = ['-date', 'name']
        verbose_name = "Daily Menu"
        verbose_name_plural = "Daily Menus"