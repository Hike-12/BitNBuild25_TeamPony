from django.db import models
from django.contrib.auth.models import User

class Vendor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    business_name = models.CharField(max_length=200)
    business_address = models.TextField()
    phone_number = models.CharField(max_length=15)
    license_number = models.CharField(max_length=100, unique=True)
    is_verified = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.business_name} - {self.user.username}"

    class Meta:
        db_table = 'vendors_vendor'