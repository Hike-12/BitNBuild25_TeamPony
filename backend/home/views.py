import json
from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.contrib.auth.decorators import login_required
from django.core.validators import validate_email
from django.core.exceptions import ValidationError

@csrf_exempt
@require_http_methods(["POST"])
def register_user(request):
    """Register a new user"""
    try:
        data = json.loads(request.body)
        username = data.get('username', '').strip()
        email = data.get('email', '').strip()
        password = data.get('password', '')
        first_name = data.get('first_name', '').strip()
        last_name = data.get('last_name', '').strip()

        # Validation
        if not username or len(username) < 3:
            return JsonResponse({
                'success': False,
                'error': 'Username must be at least 3 characters long'
            }, status=400)

        if not email:
            return JsonResponse({
                'success': False,
                'error': 'Email is required'
            }, status=400)

        try:
            validate_email(email)
        except ValidationError:
            return JsonResponse({
                'success': False,
                'error': 'Invalid email format'
            }, status=400)

        if not password or len(password) < 8:
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

        # Create user
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name
        )

        # Auto login after registration
        login(request, user)

        return JsonResponse({
            'success': True,
            'message': 'User registered successfully',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
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
def login_user(request):
    """Login user - only for consumers, not vendors"""
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
            # Check if user is a vendor - prevent vendor login through consumer portal
            from vendors.models import Vendor
            try:
                vendor = Vendor.objects.get(user=user)
                return JsonResponse({
                    'success': False,
                    'error': 'This is a vendor account. Please use the vendor login portal.'
                }, status=401)
            except Vendor.DoesNotExist:
                # User is not a vendor, proceed with normal login
                pass

            if user.is_active:
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
def logout_user(request):
    """Logout user"""
    logout(request)
    return JsonResponse({
        'success': True,
        'message': 'Logged out successfully'
    })

@login_required
def get_profile(request):
    """Get user profile - protected route"""
    user = request.user
    return JsonResponse({
        'success': True,
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'date_joined': user.date_joined.isoformat(),
            'is_staff': user.is_staff,
        }
    })

def check_auth(request):
    """Check if user is authenticated - only for consumers"""
    if request.user.is_authenticated:
        # Check if user is a vendor - prevent vendor access through consumer portal
        from vendors.models import Vendor
        try:
            vendor = Vendor.objects.get(user=request.user)
            return JsonResponse({
                'success': True,
                'authenticated': False
            })
        except Vendor.DoesNotExist:
            # User is not a vendor, return user info
            return JsonResponse({
                'success': True,
                'authenticated': True,
                'user': {
                    'id': request.user.id,
                    'username': request.user.username,
                    'email': request.user.email,
                    'first_name': request.user.first_name,
                    'last_name': request.user.last_name,
                }
            })
    else:
        return JsonResponse({
            'success': True,
            'authenticated': False
        })

def hello_world(request):
    return JsonResponse({'message': 'Hello Guys!'})