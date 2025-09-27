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
    Simplified for tiffin/dabba system - removed fancy restaurant features.
    """
    CATEGORY_CHOICES = [
        ('roti_bread', 'Roti/Bread'),
        ('sabzi', 'Sabzi (Vegetable)'),
        ('dal', 'Dal'),
        ('rice_item', 'Rice Item (Biryani/Pulao)'),
        ('non_veg', 'Non-Veg (Chicken/Mutton/Fish)'),
        ('pickle_papad', 'Pickle/Papad'),
        ('sweet', 'Sweet/Dessert'),
        ('drink', 'Drink/Lassi'),
        ('raita_salad', 'Raita/Salad'),
    ]

    vendor = models.ForeignKey(TiffinVendor, on_delete=models.CASCADE, related_name='menu_items')
    name = models.CharField(max_length=200, help_text="Name of the dish (e.g., Aloo Sabzi, Chicken Curry)")
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='sabzi')
    price = models.DecimalField(max_digits=6, decimal_places=2, default=0.00, help_text="Price per portion/serving")
    is_vegetarian = models.BooleanField(default=True, help_text="Veg or Non-veg?")
    is_spicy = models.BooleanField(default=False, help_text="Is this item spicy?")
    is_available_today = models.BooleanField(default=True, help_text="Available for today's dabba?")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - ₹{self.price} - {self.vendor.kitchen_name}"

    def save(self, *args, **kwargs):
        # Auto-set vegetarian to False for non-veg category
        if self.category == 'non_veg':
            self.is_vegetarian = False
        super().save(*args, **kwargs)

    class Meta:
        unique_together = ['vendor', 'name']
        ordering = ['category', 'name']
        verbose_name = "Food Item"
        verbose_name_plural = "Food Items"


class Menu(models.Model):
    """
    Menu model represents today's dabba/tiffin menu.
    A vendor creates a new Menu for each day they operate.
    Image is at menu level - shows the complete prepared dabba.
    """
    vendor = models.ForeignKey(TiffinVendor, on_delete=models.CASCADE, related_name='daily_menus')
    name = models.CharField(max_length=200, default="Today's Special", help_text="Name of today's menu (e.g., 'Monday Special', 'Non-Veg Combo')")
    date = models.DateField(help_text="Date for which this dabba menu is created")
    
    # Image moved here - shows the complete prepared dabba
    image = models.ImageField(upload_to='dabba_images/', blank=True, null=True, help_text="Photo of today's prepared dabba")
    
    # Different categories of items in the dabba
    main_items = models.ManyToManyField(
        MenuItem, 
        related_name='main_menus', 
        blank=True,
        help_text="Main items (roti, sabzi, dal, rice, non-veg)",
        limit_choices_to={'category__in': ['roti_bread', 'sabzi', 'dal', 'rice_item', 'non_veg']}
    )
    
    side_items = models.ManyToManyField(
        MenuItem, 
        related_name='side_menus', 
        blank=True,
        help_text="Side items (pickle, papad, raita, salad)",
        limit_choices_to={'category__in': ['pickle_papad', 'raita_salad']}
    )
    
    extras = models.ManyToManyField(
        MenuItem, 
        related_name='extra_menus', 
        blank=True,
        help_text="Extra items (sweet, drink)",
        limit_choices_to={'category__in': ['sweet', 'drink']}
    )
    
    # Dabba specific details
    is_veg_only = models.BooleanField(default=True, help_text="Is this a pure veg dabba?")
    full_dabba_price = models.DecimalField(max_digits=8, decimal_places=2, default=100.00, help_text="Total price for complete dabba")
    max_dabbas = models.PositiveIntegerField(default=30, help_text="Maximum number of dabbas you can prepare")
    dabbas_sold = models.PositiveIntegerField(default=0, help_text="Number of dabbas already sold")
    
    # Special notes
    todays_special = models.CharField(max_length=300, blank=True, default='', help_text="What's special about today's dabba?")
    cooking_style = models.CharField(
        max_length=100, 
        blank=True,
        default='',
        help_text="Cooking style (e.g., 'Punjabi Style', 'Gujarati Thali', 'South Indian')"
    )
    
    is_active = models.BooleanField(default=True, help_text="Is this menu currently active?")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.date} - {self.vendor.kitchen_name}"

    @property
    def is_available(self):
        """Check if dabba is still available for orders"""
        return self.is_active and self.dabbas_sold < self.max_dabbas

    @property
    def dabbas_remaining(self):
        """How many dabbas are still available"""
        return max(0, self.max_dabbas - self.dabbas_sold)

    def save(self, *args, **kwargs):
        # Auto-determine if veg only based on items
        if self.pk:
            has_non_veg = (
                self.main_items.filter(is_vegetarian=False).exists() or
                self.side_items.filter(is_vegetarian=False).exists() or
                self.extras.filter(is_vegetarian=False).exists()
            )
            self.is_veg_only = not has_non_veg
        super().save(*args, **kwargs)

    def get_all_items(self):
        """Get all items in this dabba"""
        all_items = []
        all_items.extend(self.main_items.all())
        all_items.extend(self.side_items.all())
        all_items.extend(self.extras.all())
        return all_items

    def calculate_individual_total(self):
        """Calculate total if buying items individually (for reference)"""
        total = 0
        for item in self.get_all_items():
            total += item.price
        return total

    class Meta:
        unique_together = ['vendor', 'date', 'name']
        ordering = ['-date', 'name']
        verbose_name = "Daily Dabba Menu"
        verbose_name_plural = "Daily Dabba Menus"