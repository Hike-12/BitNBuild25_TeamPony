import 'package:flutter/foundation.dart';
import '../../core/models/user_model.dart';
import '../../core/services/api_service.dart';
import '../../core/services/storage_service.dart';
import '../../core/data/dummy_data.dart';

enum AuthStatus { unknown, authenticated, unauthenticated }

class AuthProvider with ChangeNotifier {
  AuthStatus _status = AuthStatus.unknown;
  User? _user;
  String? _token;
  bool _isLoading = false;
  String? _error;

  // Getters
  AuthStatus get status => _status;
  User? get user => _user;
  String? get token => _token;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get isAuthenticated => _status == AuthStatus.authenticated;

  AuthProvider() {
    _initializeAuth();
  }

  // Initialize authentication state from storage
  Future<void> _initializeAuth() async {
    try {
      _setLoading(true);
      _clearError();

      final savedToken = await StorageService.getAuthToken();
      final savedUser = await StorageService.getUserData();

      if (savedToken != null && savedUser != null) {
        _token = savedToken;
        _user = savedUser;
        ApiService.setAuthToken(savedToken);
        _status = AuthStatus.authenticated;

        // Verify token is still valid
        final response = await ApiService.checkAuth();
        if (!response.success) {
          // Token is invalid, logout
          await logout();
        } else if (response.data != null && response.data!['user'] != null) {
          // Update user data if available from API
          if (!response.isFromCache) {
            _user = User.fromJson(response.data!['user']);
            await StorageService.saveUserData(_user!);
          }
        }
      } else {
        _status = AuthStatus.unauthenticated;
      }
    } catch (e) {
      print('Error initializing auth: $e');
      _status = AuthStatus.unauthenticated;
    } finally {
      _setLoading(false);
    }
  }

  // Login
  Future<bool> login({
    required String username,
    required String password,
  }) async {
    try {
      _setLoading(true);
      _clearError();

      final response = await ApiService.login(
        username: username,
        password: password,
      );

      if (response.success && response.data != null) {
        final token = response.data!['token'] as String?;
        final userData = response.data!['user'] as Map<String, dynamic>?;

        if (token != null && userData != null) {
          _token = token;
          _user = User.fromJson(userData);
          _status = AuthStatus.authenticated;

          // Save to storage
          await StorageService.saveAuthToken(token);
          await StorageService.saveUserData(_user!);

          // Set API service token
          ApiService.setAuthToken(token);

          notifyListeners();
          return true;
        }
      }

      _setError(response.error ?? 'Login failed');
      return false;
    } catch (e) {
      _setError('Network error occurred');
      return false;
    } finally {
      _setLoading(false);
    }
  }

  // Register
  Future<bool> register({
    required String username,
    required String email,
    required String password,
    String? firstName,
    String? lastName,
  }) async {
    try {
      _setLoading(true);
      _clearError();

      final response = await ApiService.register(
        username: username,
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
      );

      if (response.success && response.data != null) {
        final token = response.data!['token'] as String?;
        final userData = response.data!['user'] as Map<String, dynamic>?;

        if (token != null && userData != null) {
          _token = token;
          _user = User.fromJson(userData);
          _status = AuthStatus.authenticated;

          // Save to storage
          await StorageService.saveAuthToken(token);
          await StorageService.saveUserData(_user!);

          // Set API service token
          ApiService.setAuthToken(token);

          notifyListeners();
          return true;
        }
      }

      _setError(response.error ?? 'Registration failed');
      return false;
    } catch (e) {
      _setError('Network error occurred');
      return false;
    } finally {
      _setLoading(false);
    }
  }

  // Logout
  Future<void> logout() async {
    try {
      _setLoading(true);
      _clearError();

      // Call logout API (even if it fails, we still logout locally)
      await ApiService.logout();

      // Clear local data
      await StorageService.logout();
      ApiService.clearAuthToken();

      _token = null;
      _user = null;
      _status = AuthStatus.unauthenticated;

      notifyListeners();
    } catch (e) {
      print('Error during logout: $e');
      // Still logout locally even if API call fails
      await StorageService.logout();
      ApiService.clearAuthToken();
      _token = null;
      _user = null;
      _status = AuthStatus.unauthenticated;
      notifyListeners();
    } finally {
      _setLoading(false);
    }
  }

  // Update user profile
  Future<bool> updateProfile(User updatedUser) async {
    try {
      _setLoading(true);
      _clearError();

      // For now, just update locally since we don't have update profile API
      _user = updatedUser;
      await StorageService.saveUserData(_user!);

      notifyListeners();
      return true;
    } catch (e) {
      _setError('Failed to update profile');
      return false;
    } finally {
      _setLoading(false);
    }
  }

  // Demo login (for testing without backend)
  Future<void> loginAsDemo() async {
    try {
      _setLoading(true);
      _clearError();

      // Use dummy user data
      final demoUser = DummyData.getCurrentUser();
      const demoToken = 'demo_token_12345';

      _token = demoToken;
      _user = demoUser;
      _status = AuthStatus.authenticated;

      // Save to storage
      await StorageService.saveAuthToken(demoToken);
      await StorageService.saveUserData(demoUser);

      // Set API service token
      ApiService.setAuthToken(demoToken);

      notifyListeners();
    } catch (e) {
      _setError('Demo login failed');
    } finally {
      _setLoading(false);
    }
  }

  // Private helper methods
  void _setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }

  void _setError(String error) {
    _error = error;
    notifyListeners();
  }

  void _clearError() {
    _error = null;
  }

  // Clear error manually
  void clearError() {
    _clearError();
    notifyListeners();
  }
}
