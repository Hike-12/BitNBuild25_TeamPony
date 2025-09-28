import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import '../constants/app_constants.dart';
import '../data/dummy_data.dart';

import '../models/menu_model.dart';
import '../models/order_model.dart' as order_models;
import '../models/subscription_model.dart' as subscription_models;

class ApiResponse<T> {
  final bool success;
  final T? data;
  final String? error;
  final bool isFromCache;

  ApiResponse({
    required this.success,
    this.data,
    this.error,
    this.isFromCache = false,
  });

  factory ApiResponse.success(T data, {bool isFromCache = false}) {
    return ApiResponse(success: true, data: data, isFromCache: isFromCache);
  }

  factory ApiResponse.error(String error) {
    return ApiResponse(success: false, error: error);
  }
}

class ApiService {
  static const int _timeoutSeconds = 10;
  static String? _authToken;

  // Set authentication token
  static void setAuthToken(String token) {
    _authToken = token;
  }

  // Clear authentication token
  static void clearAuthToken() {
    _authToken = null;
  }

  // Get headers with auth token if available
  static Map<String, String> get _headers {
    final headers = {'Content-Type': 'application/json'};

    if (_authToken != null) {
      headers['Authorization'] = 'Bearer $_authToken';
    }

    return headers;
  }

  // Generic method to make HTTP requests with fallback
  static Future<ApiResponse<Map<String, dynamic>>> _makeRequest(
    String method,
    String endpoint,
    Map<String, dynamic> fallbackData, {
    Map<String, dynamic>? body,
  }) async {
    try {
      final uri = Uri.parse('${AppConstants.baseUrl}$endpoint');
      http.Response response;

      switch (method.toUpperCase()) {
        case 'GET':
          response = await http
              .get(uri, headers: _headers)
              .timeout(const Duration(seconds: _timeoutSeconds));
          break;
        case 'POST':
          response = await http
              .post(
                uri,
                headers: _headers,
                body: body != null ? jsonEncode(body) : null,
              )
              .timeout(const Duration(seconds: _timeoutSeconds));
          break;
        case 'PUT':
          response = await http
              .put(
                uri,
                headers: _headers,
                body: body != null ? jsonEncode(body) : null,
              )
              .timeout(const Duration(seconds: _timeoutSeconds));
          break;
        case 'PATCH':
          response = await http
              .patch(
                uri,
                headers: _headers,
                body: body != null ? jsonEncode(body) : null,
              )
              .timeout(const Duration(seconds: _timeoutSeconds));
          break;
        case 'DELETE':
          response = await http
              .delete(uri, headers: _headers)
              .timeout(const Duration(seconds: _timeoutSeconds));
          break;
        default:
          throw Exception('Unsupported HTTP method: $method');
      }

      if (response.statusCode >= 200 && response.statusCode < 300) {
        final data = jsonDecode(response.body) as Map<String, dynamic>;
        return ApiResponse.success(data);
      } else {
        // API call failed, use fallback data
        print(
          'API call failed with status ${response.statusCode}, using fallback data',
        );
        return ApiResponse.success(fallbackData, isFromCache: true);
      }
    } catch (e) {
      // Network error or timeout, use fallback data
      print('API call failed with error: $e, using fallback data');
      return ApiResponse.success(fallbackData, isFromCache: true);
    }
  }

  // Authentication APIs
  static Future<ApiResponse<Map<String, dynamic>>> login({
    required String username,
    required String password,
  }) async {
    return await _makeRequest(
      'POST',
      AppConstants.userLoginEndpoint,
      DummyData.loginSuccessResponse,
      body: {'username': username, 'password': password},
    );
  }

  static Future<ApiResponse<Map<String, dynamic>>> register({
    required String username,
    required String email,
    required String password,
    String? firstName,
    String? lastName,
  }) async {
    return await _makeRequest(
      'POST',
      AppConstants.userRegisterEndpoint,
      DummyData.registerSuccessResponse,
      body: {
        'username': username,
        'email': email,
        'password': password,
        'first_name': firstName,
        'last_name': lastName,
      },
    );
  }

  static Future<ApiResponse<Map<String, dynamic>>> checkAuth() async {
    return await _makeRequest('GET', AppConstants.userCheckAuthEndpoint, {
      'success': true,
      'authenticated': true,
      'user': DummyData.getCurrentUser().toJson(),
    });
  }

  static Future<ApiResponse<Map<String, dynamic>>> logout() async {
    return await _makeRequest('GET', AppConstants.userLogoutEndpoint, {
      'success': true,
      'message': 'Logged out successfully',
    });
  }

  // Menu APIs
  static Future<ApiResponse<List<Menu>>> getMenus() async {
    final response = await _makeRequest(
      'GET',
      AppConstants.menuPublicEndpoint,
      DummyData.menusSuccessResponse,
    );

    if (response.success && response.data != null) {
      try {
        final menusData = response.data!['menus'] as List;
        final menus = menusData
            .map((menuJson) => Menu.fromJson(menuJson))
            .toList();
        return ApiResponse.success(menus, isFromCache: response.isFromCache);
      } catch (e) {
        // If parsing fails, return dummy data
        return ApiResponse.success(
          DummyData.getTodaysMenus(),
          isFromCache: true,
        );
      }
    }

    return ApiResponse.error('Failed to fetch menus');
  }

  // Order APIs
  static Future<ApiResponse<List<order_models.Order>>> getOrders() async {
    final response = await _makeRequest(
      'GET',
      AppConstants.ordersEndpoint,
      DummyData.ordersSuccessResponse,
    );

    if (response.success && response.data != null) {
      try {
        final ordersData = response.data!['orders'] as List;
        final orders = ordersData
            .map((orderJson) => order_models.Order.fromJson(orderJson))
            .toList();
        return ApiResponse.success(orders, isFromCache: response.isFromCache);
      } catch (e) {
        // If parsing fails, return dummy data
        return ApiResponse.success(
          DummyData.getRecentOrders(),
          isFromCache: true,
        );
      }
    }

    return ApiResponse.error('Failed to fetch orders');
  }

  static Future<ApiResponse<order_models.Order>> createOrder({
    required String menuId,
    required String vendorId,
    required int quantity,
    required double totalAmount,
    required String deliveryAddress,
    required DateTime deliveryDate,
    required String deliveryTimeSlot,
    String? specialInstructions,
    String paymentMethod = 'cod',
  }) async {
    final response = await _makeRequest(
      'POST',
      AppConstants.ordersEndpoint,
      DummyData.createOrderSuccessResponse,
      body: {
        'menu': menuId,
        'vendor': vendorId,
        'quantity': quantity,
        'total_amount': totalAmount,
        'delivery_address': deliveryAddress,
        'delivery_date': deliveryDate.toIso8601String(),
        'delivery_time_slot': deliveryTimeSlot,
        'special_instructions': specialInstructions,
        'payment_method': paymentMethod,
      },
    );

    if (response.success && response.data != null) {
      try {
        final orderData = response.data!['order'] as Map<String, dynamic>;
        final order = order_models.Order.fromJson(orderData);
        return ApiResponse.success(order, isFromCache: response.isFromCache);
      } catch (e) {
        // If parsing fails, return dummy order
        return ApiResponse.success(DummyData.orders.first, isFromCache: true);
      }
    }

    return ApiResponse.error('Failed to create order');
  }

  // Subscription APIs
  static Future<ApiResponse<List<subscription_models.Subscription>>>
  getSubscriptions() async {
    final response = await _makeRequest(
      'GET',
      AppConstants.subscriptionsEndpoint,
      DummyData.subscriptionsSuccessResponse,
    );

    if (response.success && response.data != null) {
      try {
        final subscriptionsData = response.data!['subscriptions'] as List;
        final subscriptions = subscriptionsData
            .map(
              (subJson) => subscription_models.Subscription.fromJson(subJson),
            )
            .toList();
        return ApiResponse.success(
          subscriptions,
          isFromCache: response.isFromCache,
        );
      } catch (e) {
        // If parsing fails, return dummy data
        return ApiResponse.success(
          DummyData.getActiveSubscriptions(),
          isFromCache: true,
        );
      }
    }

    return ApiResponse.error('Failed to fetch subscriptions');
  }

  static Future<ApiResponse<subscription_models.Subscription>>
  createSubscription({
    required String vendorId,
    required String planType,
    required Map<String, dynamic> mealPreferences,
    required String deliveryAddress,
    required String deliveryTimeSlot,
    required List<String> deliveryDays,
    required DateTime startDate,
    required DateTime endDate,
    required double pricePerMeal,
    required int totalMeals,
    String? specialInstructions,
  }) async {
    final response = await _makeRequest(
      'POST',
      AppConstants.subscriptionsEndpoint,
      DummyData.createSubscriptionSuccessResponse,
      body: {
        'vendor': vendorId,
        'plan_type': planType,
        'meal_preferences': mealPreferences,
        'delivery_address': deliveryAddress,
        'delivery_time_slot': deliveryTimeSlot,
        'delivery_days': deliveryDays,
        'start_date': startDate.toIso8601String(),
        'end_date': endDate.toIso8601String(),
        'price_per_meal': pricePerMeal,
        'total_meals': totalMeals,
        'total_amount': pricePerMeal * totalMeals,
        'special_instructions': specialInstructions,
      },
    );

    if (response.success && response.data != null) {
      try {
        final subscriptionData =
            response.data!['subscription'] as Map<String, dynamic>;
        final subscription = subscription_models.Subscription.fromJson(
          subscriptionData,
        );
        return ApiResponse.success(
          subscription,
          isFromCache: response.isFromCache,
        );
      } catch (e) {
        // If parsing fails, return dummy subscription
        return ApiResponse.success(
          DummyData.subscriptions.first,
          isFromCache: true,
        );
      }
    }

    return ApiResponse.error('Failed to create subscription');
  }

  static Future<ApiResponse<subscription_models.Subscription>>
  updateSubscriptionStatus({
    required String subscriptionId,
    required String status,
  }) async {
    final response = await _makeRequest(
      'PATCH',
      '${AppConstants.subscriptionsEndpoint}/$subscriptionId/status',
      {
        'success': true,
        'message': 'Subscription status updated successfully',
        'subscription': DummyData.subscriptions.first
            .copyWith(
              subscriptionStatus: status == 'paused'
                  ? subscription_models.SubscriptionStatus.paused
                  : subscription_models.SubscriptionStatus.active,
            )
            .toJson(),
      },
      body: {'subscription_status': status},
    );

    if (response.success && response.data != null) {
      try {
        final subscriptionData =
            response.data!['subscription'] as Map<String, dynamic>;
        final subscription = subscription_models.Subscription.fromJson(
          subscriptionData,
        );
        return ApiResponse.success(
          subscription,
          isFromCache: response.isFromCache,
        );
      } catch (e) {
        // If parsing fails, return updated dummy subscription
        return ApiResponse.success(
          DummyData.subscriptions.first.copyWith(
            subscriptionStatus: status == 'paused'
                ? subscription_models.SubscriptionStatus.paused
                : subscription_models.SubscriptionStatus.active,
          ),
          isFromCache: true,
        );
      }
    }

    return ApiResponse.error('Failed to update subscription status');
  }

  // Helper method to check if device is online (simplified)
  static Future<bool> isOnline() async {
    try {
      final result = await InternetAddress.lookup(
        'google.com',
      ).timeout(const Duration(seconds: 3));
      return result.isNotEmpty && result[0].rawAddress.isNotEmpty;
    } catch (e) {
      return false;
    }
  }
}
