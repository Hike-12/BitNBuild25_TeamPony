import json
from datetime import datetime, date
from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.contrib.auth.decorators import login_required
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from django.core.serializers import serialize
from django.core.paginator import Paginator
from .models import TiffinVendor, MenuItem, Menu

@csrf_exempt
@require_http_methods(["POST"])
def register_vendor(request):
    """Register a new vendor"""
    try:
        data = json.loads(request.body)
        username = data.get('username', '').strip()
        email = data.get('email', '').strip()
        password = data.get('password', '')
        first_name = data.get('first_name', '').strip()
        last_name = data.get('last_name', '').strip()
        business_name = data.get('business_name', '').strip()
        business_address = data.get('business_address', '').strip()
        phone_number = data.get('phone_number', '').strip()
        license_number = data.get('license_number', '').strip()

        # Validation
        if not all([username, email, password, first_name, last_name, business_name, business_address, phone_number, license_number]):
            return JsonResponse({
                'success': False,
                'error': 'All fields are required'
            }, status=400)

        # Validate email
        try:
            validate_email(email)
        except ValidationError:
            return JsonResponse({
                'success': False,
                'error': 'Invalid email format'
            }, status=400)

        # Password validation
        if len(password) < 8:
            return JsonResponse({
                'success': False,
                'error': 'Password must be at least 8 characters long'
            }, status=400)

        # Check if user already exists
        if User.objects.filter(username=username).exists():
            return JsonResponse({
                'success': False,
                'error': 'Username already exists'
            }, status=400)

        if User.objects.filter(email=email).exists():
            return JsonResponse({
                'success': False,
                'error': 'Email already registered'
            }, status=400)

        # Check if license number already exists
        if TiffinVendor.objects.filter(license_number=license_number).exists():
            return JsonResponse({
                'success': False,
                'error': 'License number already registered'
            }, status=400)

        # Create user
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name
        )

        # Create tiffin vendor profile
        vendor = TiffinVendor.objects.create(
            user=user,
            kitchen_name=business_name,
            address=business_address,
            phone_number=phone_number,
            license_number=license_number
        )

        # Auto login after registration
        login(request, user)

        return JsonResponse({
            'success': True,
            'message': 'Vendor registered successfully',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'kitchen_name': vendor.kitchen_name,
                'address': vendor.address,
                'phone_number': vendor.phone_number,
                'license_number': vendor.license_number,
                'is_verified': vendor.is_verified,
            }
        }, status=201)

    except json.JSONDecodeError:
        return JsonResponse({
            'success': False,
            'error': 'Invalid JSON data'
        }, status=400)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def login_vendor(request):
    """Login vendor"""
    try:
        data = json.loads(request.body)
        username = data.get('username', '').strip()
        password = data.get('password', '')

        if not username or not password:
            return JsonResponse({
                'success': False,
                'error': 'Username and password are required'
            }, status=400)

        # Authenticate user
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            # Check if user has tiffin vendor profile
            try:
                vendor = TiffinVendor.objects.get(user=user)
            except TiffinVendor.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'error': 'Not a vendor account'
                }, status=401)

            if user.is_active and vendor.is_active:
                login(request, user)
                return JsonResponse({
                    'success': True,
                    'message': 'Login successful',
                    'user': {
                        'id': user.id,
                        'username': user.username,
                        'email': user.email,
                        'first_name': user.first_name,
                        'last_name': user.last_name,
                        'kitchen_name': vendor.kitchen_name,
                        'address': vendor.address,
                        'phone_number': vendor.phone_number,
                        'license_number': vendor.license_number,
                        'is_verified': vendor.is_verified,
                    }
                })
            else:
                return JsonResponse({
                    'success': False,
                    'error': 'Account is disabled'
                }, status=401)
        else:
            return JsonResponse({
                'success': False,
                'error': 'Invalid username or password'
            }, status=401)

    except json.JSONDecodeError:
        return JsonResponse({
            'success': False,
            'error': 'Invalid JSON data'
        }, status=400)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)

@require_http_methods(["GET", "POST"])
def logout_vendor(request):
    """Logout vendor"""
    logout(request)
    return JsonResponse({
        'success': True,
        'message': 'Logged out successfully'
    })

@login_required
def get_vendor_profile(request):
    """Get vendor profile - protected route"""
    try:
        vendor = TiffinVendor.objects.get(user=request.user)
        return JsonResponse({
            'success': True,
            'user': {
                'id': request.user.id,
                'username': request.user.username,
                'email': request.user.email,
                'first_name': request.user.first_name,
                'last_name': request.user.last_name,
                'kitchen_name': vendor.kitchen_name,
                'address': vendor.address,
                'phone_number': vendor.phone_number,
                'license_number': vendor.license_number,
                'is_verified': vendor.is_verified,
                'date_joined': request.user.date_joined.isoformat(),
                'is_staff': request.user.is_staff,
            }
        })
    except TiffinVendor.DoesNotExist:
        return JsonResponse({
            'success': False,
            'error': 'Vendor profile not found'
        }, status=404)

def check_vendor_auth(request):
    """Check if vendor is authenticated"""
    if request.user.is_authenticated:
        try:
            vendor = TiffinVendor.objects.get(user=request.user)
            return JsonResponse({
                'success': True,
                'authenticated': True,
                'user': {
                    'id': request.user.id,
                    'username': request.user.username,
                    'email': request.user.email,
                    'first_name': request.user.first_name,
                    'last_name': request.user.last_name,
                    'kitchen_name': vendor.kitchen_name,
                    'address': vendor.address,
                    'phone_number': vendor.phone_number,
                    'license_number': vendor.license_number,
                    'is_verified': vendor.is_verified,
                }
            })
        except TiffinVendor.DoesNotExist:
            return JsonResponse({
                'success': True,
                'authenticated': False
            })
    else:
        return JsonResponse({
            'success': True,
            'authenticated': False
        })


# Menu Item Views
@login_required
@csrf_exempt
@require_http_methods(["GET", "POST"])
def menu_items(request):
    """Get all menu items for a vendor or create a new menu item"""
    try:
        tiffin_vendor = TiffinVendor.objects.get(user=request.user)
    except TiffinVendor.DoesNotExist:
        return JsonResponse({
            'success': False,
            'error': 'Vendor profile not found'
        }, status=404)

    if request.method == 'GET':
        items = MenuItem.objects.filter(vendor=tiffin_vendor).order_by('category', 'name')
        
        items_data = []
        for item in items:
            items_data.append({
                'id': item.id,
                'name': item.name,
                'category': item.category,
                'category_display': item.get_category_display(),
                'price': str(item.price),
                'is_vegetarian': item.is_vegetarian,
                'is_spicy': item.is_spicy,
                'is_available_today': item.is_available_today,
                'created_at': item.created_at.isoformat(),
                'updated_at': item.updated_at.isoformat(),
            })

        return JsonResponse({
            'success': True,
            'menu_items': items_data
        })
        
    elif request.method == 'POST':
        data = json.loads(request.body)
        
        required_fields = ['name', 'category', 'price']
        for field in required_fields:
            if not data.get(field):
                return JsonResponse({
                    'success': False,
                    'error': f'{field} is required'
                }, status=400)

        # Check if item already exists for this vendor
        if MenuItem.objects.filter(vendor=tiffin_vendor, name=data['name']).exists():
            return JsonResponse({
                'success': False,
                'error': 'Item with this name already exists'
            }, status=400)

        try:
            item = MenuItem.objects.create(
                vendor=tiffin_vendor,
                name=data['name'],
                category=data['category'],
                price=float(data['price']),
                is_vegetarian=data.get('is_vegetarian', True),
                is_spicy=data.get('is_spicy', False),
                is_available_today=data.get('is_available_today', True)
            )

            return JsonResponse({
                'success': True,
                'message': 'Menu item created successfully',
                'item_id': item.id
            }, status=201)
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            }, status=500)
            


@login_required
@csrf_exempt  
@require_http_methods(["GET", "POST"])
def daily_menus(request):
    """Get all daily menus for a vendor or create a new daily menu"""
    try:
        tiffin_vendor = TiffinVendor.objects.get(user=request.user)
    except TiffinVendor.DoesNotExist:
        return JsonResponse({
            'success': False,
            'error': 'Vendor profile not found'
        }, status=404)

    if request.method == 'GET':
        # Get menus with optional date filter
        date_filter = request.GET.get('date')
        menus = Menu.objects.filter(vendor=tiffin_vendor)
        
        if date_filter:
            menus = menus.filter(date=date_filter)
            
        menus = menus.order_by('-date')
        
        menus_data = []
        for menu in menus:
            # Get all items by category
            main_items = []
            for item in menu.main_items.all():
                main_items.append({
                    'id': item.id,
                    'name': item.name,
                    'category': item.category,
                    'category_display': item.get_category_display(),
                    'price': str(item.price),
                    'is_vegetarian': item.is_vegetarian,
                    'is_spicy': item.is_spicy,
                })
            
            side_items = []
            for item in menu.side_items.all():
                side_items.append({
                    'id': item.id,
                    'name': item.name,
                    'category': item.category,
                    'category_display': item.get_category_display(),
                    'price': str(item.price),
                    'is_vegetarian': item.is_vegetarian,
                    'is_spicy': item.is_spicy,
                })
            
            extras = []
            for item in menu.extras.all():
                extras.append({
                    'id': item.id,
                    'name': item.name,
                    'category': item.category,
                    'category_display': item.get_category_display(),
                    'price': str(item.price),
                    'is_vegetarian': item.is_vegetarian,
                    'is_spicy': item.is_spicy,
                })
            
            menus_data.append({
                'id': menu.id,
                'name': menu.name,
                'date': menu.date.isoformat(),
                'image': menu.image.url if menu.image else None,
                'main_items': main_items,
                'side_items': side_items,
                'extras': extras,
                'is_veg_only': menu.is_veg_only,
                'full_dabba_price': str(menu.full_dabba_price),
                'max_dabbas': menu.max_dabbas,
                'dabbas_sold': menu.dabbas_sold,
                'dabbas_remaining': menu.dabbas_remaining,
                'todays_special': menu.todays_special,
                'cooking_style': menu.cooking_style,
                'is_active': menu.is_active,
                'is_available': menu.is_available,
                'created_at': menu.created_at.isoformat(),
            })

        return JsonResponse({
            'success': True,
            'menus': menus_data
        })
        
    elif request.method == 'POST':
        # Create new daily menu
        data = json.loads(request.body)
        
        required_fields = ['name', 'date', 'full_dabba_price']
        for field in required_fields:
            if not data.get(field):
                return JsonResponse({
                    'success': False,
                    'error': f'{field} is required'
                }, status=400)

        # Check if menu already exists for this date and name
        if Menu.objects.filter(vendor=tiffin_vendor, date=data['date'], name=data['name']).exists():
            return JsonResponse({
                'success': False,
                'error': 'A menu with this name already exists for this date'
            }, status=400)

        try:
            # Create the menu
            menu = Menu.objects.create(
                vendor=tiffin_vendor,
                name=data['name'],
                date=data['date'],
                full_dabba_price=float(data['full_dabba_price']),
                max_dabbas=data.get('max_dabbas', 30),
                todays_special=data.get('todays_special', ''),
                cooking_style=data.get('cooking_style', '')
            )
            
            # Add main items
            if data.get('main_items'):
                main_items = MenuItem.objects.filter(
                    vendor=tiffin_vendor,
                    id__in=data['main_items']
                )
                menu.main_items.set(main_items)
            
            # Add side items
            if data.get('side_items'):
                side_items = MenuItem.objects.filter(
                    vendor=tiffin_vendor,
                    id__in=data['side_items']
                )
                menu.side_items.set(side_items)
            
            # Add extras
            if data.get('extras'):
                extras = MenuItem.objects.filter(
                    vendor=tiffin_vendor,
                    id__in=data['extras']
                )
                menu.extras.set(extras)
            
            menu.save()  # This will trigger the is_veg_only calculation

            return JsonResponse({
                'success': True,
                'message': 'Daily menu created successfully',
                'menu_id': menu.id
            }, status=201)
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            }, status=500)
        


@login_required
def vendor_dashboard_data(request):
    """Get dashboard data for vendor"""
    try:
        # Get TiffinVendor
        try:
            tiffin_vendor = TiffinVendor.objects.get(user=request.user)
        except TiffinVendor.DoesNotExist:
            return JsonResponse({
                'success': False,
                'error': 'Tiffin vendor profile not found'
            }, status=404)

        # Get statistics - FIXED field names
        total_menu_items = MenuItem.objects.filter(vendor=tiffin_vendor).count()
        active_menu_items = MenuItem.objects.filter(vendor=tiffin_vendor, is_available_today=True).count()  # Changed from is_available
        total_menus = Menu.objects.filter(vendor=tiffin_vendor).count()
        active_menus = Menu.objects.filter(vendor=tiffin_vendor, is_active=True).count()

        # Get recent menus - FIXED field references
        recent_menus = Menu.objects.filter(vendor=tiffin_vendor).order_by('-date')[:5]
        recent_menus_data = []
        for menu in recent_menus:
            # Calculate total items across all categories
            total_items = (
                menu.main_items.count() + 
                menu.side_items.count() + 
                menu.extras.count()
            )
            
            recent_menus_data.append({
                'id': menu.id,
                'name': menu.name,
                'date': menu.date.isoformat(),
                'items_count': total_items,  # Fixed - now counts all item categories
                'full_dabba_price': str(menu.full_dabba_price),  # Changed from total_price
                'dabbas_sold': menu.dabbas_sold,  # Changed from orders_count
                'max_dabbas': menu.max_dabbas,  # New field
                'dabbas_remaining': menu.dabbas_remaining,  # New property
                'is_active': menu.is_active,
                'is_veg_only': menu.is_veg_only,  # New field
                'todays_special': menu.todays_special or '',  # New field
            })

        return JsonResponse({
            'success': True,
            'dashboard_data': {
                'vendor_info': {
                    'kitchen_name': tiffin_vendor.kitchen_name,
                    'is_verified': tiffin_vendor.is_verified,
                    'is_active': tiffin_vendor.is_active,
                },
                'statistics': {
                    'total_menu_items': total_menu_items,
                    'active_menu_items': active_menu_items,
                    'total_menus': total_menus,
                    'active_menus': active_menus,
                },
                'recent_menus': recent_menus_data,
            }
        })

    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)