class AppConstants {
  // API Configuration
  static const String baseUrl = 'http://localhost:8000/api';
  static const String fallbackBaseUrl = 'http://127.0.0.1:8000/api';

  // API Endpoints
  static const String userRegisterEndpoint = '/user/register';
  static const String userLoginEndpoint = '/user/login';
  static const String userCheckAuthEndpoint = '/user/check-auth';
  static const String userLogoutEndpoint = '/user/logout';
  static const String menuPublicEndpoint = '/vendor/public/daily-menus';
  static const String ordersEndpoint = '/orders';
  static const String subscriptionsEndpoint = '/subscriptions';

  // Storage Keys
  static const String authTokenKey = 'auth_token';
  static const String userDataKey = 'user_data';
  static const String themeKey = 'theme_mode';

  // App Configuration
  static const String appName = 'NourishNet';
  static const String appVersion = '1.0.0';

  // UI Constants
  static const double defaultPadding = 16.0;
  static const double smallPadding = 8.0;
  static const double largePadding = 24.0;
  static const double borderRadius = 12.0;
  static const double cardElevation = 4.0;

  // Animation Durations
  static const Duration shortDuration = Duration(milliseconds: 300);
  static const Duration mediumDuration = Duration(milliseconds: 500);
  static const Duration longDuration = Duration(milliseconds: 800);

  // Delivery Time Slots
  static const List<String> deliveryTimeSlots = [
    '12:00-13:00',
    '13:00-14:00',
    '19:00-20:00',
    '20:00-21:00',
  ];

  // Subscription Types
  static const List<String> subscriptionTypes = ['weekly', 'monthly', 'custom'];

  // Payment Methods
  static const List<String> paymentMethods = ['cod', 'upi', 'card', 'wallet'];

  // Order Status Options
  static const List<String> orderStatuses = [
    'placed',
    'confirmed',
    'preparing',
    'out_for_delivery',
    'delivered',
    'cancelled',
  ];
}
