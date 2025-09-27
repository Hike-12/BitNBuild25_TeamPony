import json
from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.contrib.auth.decorators import login_required
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from .models import Vendor

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
        if Vendor.objects.filter(license_number=license_number).exists():
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

        # Create vendor profile
        vendor = Vendor.objects.create(
            user=user,
            business_name=business_name,
            business_address=business_address,
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
                'business_name': vendor.business_name,
                'business_address': vendor.business_address,
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
            # Check if user has vendor profile
            try:
                vendor = Vendor.objects.get(user=user)
            except Vendor.DoesNotExist:
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
                        'business_name': vendor.business_name,
                        'business_address': vendor.business_address,
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
        vendor = Vendor.objects.get(user=request.user)
        return JsonResponse({
            'success': True,
            'user': {
                'id': request.user.id,
                'username': request.user.username,
                'email': request.user.email,
                'first_name': request.user.first_name,
                'last_name': request.user.last_name,
                'business_name': vendor.business_name,
                'business_address': vendor.business_address,
                'phone_number': vendor.phone_number,
                'license_number': vendor.license_number,
                'is_verified': vendor.is_verified,
                'date_joined': request.user.date_joined.isoformat(),
                'is_staff': request.user.is_staff,
            }
        })
    except Vendor.DoesNotExist:
        return JsonResponse({
            'success': False,
            'error': 'Vendor profile not found'
        }, status=404)

def check_vendor_auth(request):
    """Check if vendor is authenticated"""
    if request.user.is_authenticated:
        try:
            vendor = Vendor.objects.get(user=request.user)
            return JsonResponse({
                'success': True,
                'authenticated': True,
                'user': {
                    'id': request.user.id,
                    'username': request.user.username,
                    'email': request.user.email,
                    'first_name': request.user.first_name,
                    'last_name': request.user.last_name,
                    'business_name': vendor.business_name,
                    'business_address': vendor.business_address,
                    'phone_number': vendor.phone_number,
                    'license_number': vendor.license_number,
                    'is_verified': vendor.is_verified,
                }
            })
        except Vendor.DoesNotExist:
            return JsonResponse({
                'success': True,
                'authenticated': False
            })
    else:
        return JsonResponse({
            'success': True,
            'authenticated': False
        })