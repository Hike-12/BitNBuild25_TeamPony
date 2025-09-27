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

@require_http_methods(["POST"])
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
        # Get TiffinVendor
        try:
            tiffin_vendor = TiffinVendor.objects.get(user=request.user)
        except TiffinVendor.DoesNotExist:
            return JsonResponse({
                'success': False,
                'error': 'Tiffin vendor profile not found'
            }, status=404)

        if request.method == 'GET':
            # Get all menu items for this vendor
            menu_items = MenuItem.objects.filter(vendor=tiffin_vendor)
            
            items_data = []
            for item in menu_items:
                items_data.append({
                    'id': item.id,
                    'name': item.name,
                    'description': item.description,
                    'category': item.category,
                    'price': str(item.price),
                    'is_vegetarian': item.is_vegetarian,
                    'is_vegan': item.is_vegan,
                    'is_spicy': item.is_spicy,
                    'preparation_time': item.preparation_time,
                    'is_available': item.is_available,
                    'image': item.image.url if item.image else None,
                    'created_at': item.created_at.isoformat(),
                })

            return JsonResponse({
                'success': True,
                'menu_items': items_data,
                'total_count': len(items_data)
            })

        elif request.method == 'POST':
            # Create new menu item
            data = json.loads(request.body)
            
            required_fields = ['name', 'description', 'category', 'price']
            for field in required_fields:
                if not data.get(field):
                    return JsonResponse({
                        'success': False,
                        'error': f'{field} is required'
                    }, status=400)

            # Check if menu item with same name exists for this vendor
            if MenuItem.objects.filter(vendor=tiffin_vendor, name=data['name']).exists():
                return JsonResponse({
                    'success': False,
                    'error': 'Menu item with this name already exists'
                }, status=400)

            menu_item = MenuItem.objects.create(
                vendor=tiffin_vendor,
                name=data['name'],
                description=data['description'],
                category=data['category'],
                price=data['price'],
                is_vegetarian=data.get('is_vegetarian', True),
                is_vegan=data.get('is_vegan', False),
                is_spicy=data.get('is_spicy', False),
                preparation_time=data.get('preparation_time', 30),
                is_available=data.get('is_available', True)
            )

            return JsonResponse({
                'success': True,
                'message': 'Menu item created successfully',
                'menu_item': {
                    'id': menu_item.id,
                    'name': menu_item.name,
                    'description': menu_item.description,
                    'category': menu_item.category,
                    'price': str(menu_item.price),
                    'is_vegetarian': menu_item.is_vegetarian,
                    'is_vegan': menu_item.is_vegan,
                    'is_spicy': menu_item.is_spicy,
                    'preparation_time': menu_item.preparation_time,
                    'is_available': menu_item.is_available,
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


@login_required
@csrf_exempt
@require_http_methods(["GET", "POST"])
def daily_menus(request):
    """Get all daily menus for a vendor or create a new daily menu"""
    try:
        # Get TiffinVendor
        try:
            tiffin_vendor = TiffinVendor.objects.get(user=request.user)
        except TiffinVendor.DoesNotExist:
            return JsonResponse({
                'success': False,
                'error': 'Tiffin vendor profile not found'
            }, status=404)

        if request.method == 'GET':
            # Get date filter from query params
            date_filter = request.GET.get('date')
            
            menus = Menu.objects.filter(vendor=tiffin_vendor)
            
            if date_filter:
                try:
                    filter_date = datetime.strptime(date_filter, '%Y-%m-%d').date()
                    menus = menus.filter(date=filter_date)
                except ValueError:
                    return JsonResponse({
                        'success': False,
                        'error': 'Invalid date format. Use YYYY-MM-DD'
                    }, status=400)

            menus_data = []
            for menu in menus:
                menu_items = []
                for item in menu.menu_items.all():
                    menu_items.append({
                        'id': item.id,
                        'name': item.name,
                        'description': item.description,
                        'category': item.category,
                        'price': str(item.price),
                        'is_vegetarian': item.is_vegetarian,
                        'is_vegan': item.is_vegan,
                        'is_spicy': item.is_spicy,
                    })

                menus_data.append({
                    'id': menu.id,
                    'name': menu.name,
                    'date': menu.date.isoformat(),
                    'menu_items': menu_items,
                    'is_active': menu.is_active,
                    'is_available': menu.is_available,
                    'special_instructions': menu.special_instructions,
                    'total_price': str(menu.total_price) if menu.total_price else None,
                    'max_orders': menu.max_orders,
                    'orders_count': menu.orders_count,
                    'created_at': menu.created_at.isoformat(),
                })

            return JsonResponse({
                'success': True,
                'menus': menus_data,
                'total_count': len(menus_data)
            })

        elif request.method == 'POST':
            # Create new daily menu
            data = json.loads(request.body)
            
            required_fields = ['name', 'date', 'menu_items']
            for field in required_fields:
                if not data.get(field):
                    return JsonResponse({
                        'success': False,
                        'error': f'{field} is required'
                    }, status=400)

            # Parse and validate date
            try:
                menu_date = datetime.strptime(data['date'], '%Y-%m-%d').date()
            except ValueError:
                return JsonResponse({
                    'success': False,
                    'error': 'Invalid date format. Use YYYY-MM-DD'
                }, status=400)

            # Check if menu with same name and date exists
            if Menu.objects.filter(vendor=tiffin_vendor, name=data['name'], date=menu_date).exists():
                return JsonResponse({
                    'success': False,
                    'error': 'Menu with this name and date already exists'
                }, status=400)

            # Validate menu items exist and belong to this vendor
            menu_item_ids = data['menu_items']
            menu_items = MenuItem.objects.filter(
                id__in=menu_item_ids,
                vendor=tiffin_vendor
            )
            
            if len(menu_items) != len(menu_item_ids):
                return JsonResponse({
                    'success': False,
                    'error': 'Some menu items do not exist or do not belong to this vendor'
                }, status=400)

            # Create menu
            menu = Menu.objects.create(
                vendor=tiffin_vendor,
                name=data['name'],
                date=menu_date,
                is_active=data.get('is_active', True),
                special_instructions=data.get('special_instructions', ''),
                max_orders=data.get('max_orders', 50)
            )

            # Add menu items
            menu.menu_items.set(menu_items)

            # Calculate total price
            total_price = sum(item.price for item in menu_items)
            menu.total_price = total_price
            menu.save()

            return JsonResponse({
                'success': True,
                'message': 'Daily menu created successfully',
                'menu': {
                    'id': menu.id,
                    'name': menu.name,
                    'date': menu.date.isoformat(),
                    'total_price': str(menu.total_price),
                    'is_active': menu.is_active,
                    'max_orders': menu.max_orders,
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

        # Get statistics
        total_menu_items = MenuItem.objects.filter(vendor=tiffin_vendor).count()
        active_menu_items = MenuItem.objects.filter(vendor=tiffin_vendor, is_available=True).count()
        total_menus = Menu.objects.filter(vendor=tiffin_vendor).count()
        active_menus = Menu.objects.filter(vendor=tiffin_vendor, is_active=True).count()

        # Get recent menus
        recent_menus = Menu.objects.filter(vendor=tiffin_vendor).order_by('-date')[:5]
        recent_menus_data = []
        for menu in recent_menus:
            recent_menus_data.append({
                'id': menu.id,
                'name': menu.name,
                'date': menu.date.isoformat(),
                'items_count': menu.menu_items.count(),
                'total_price': str(menu.total_price) if menu.total_price else '0',
                'orders_count': menu.orders_count,
                'is_active': menu.is_active,
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