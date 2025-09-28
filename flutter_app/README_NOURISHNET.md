# NourishNet Flutter App

A comprehensive Flutter application for the NourishNet tiffin service, providing customers with an intuitive interface to browse menus, manage subscriptions, and place orders.

## Overview

This Flutter app serves as the customer-facing mobile application for NourishNet, a tiffin service platform. The app replicates the existing React web frontend's design and user experience while ensuring robust functionality through a comprehensive fallback mechanism.

## Key Features

### 🔐 Authentication System
- **Login/Register screens** with form validation
- **Demo login functionality** for testing
- **JWT token management** with automatic storage
- **Session persistence** across app restarts

### 📱 Main Application Screens
- **Dashboard**: User stats, active subscriptions, recent orders, quick actions
- **Menu Browser**: Search, filter (veg/non-veg/available), detailed menu cards
- **Subscription Management**: View, pause, resume subscriptions with progress tracking
- **User Profile**: Edit personal details, app settings, theme toggle

### 🎨 Design & Theme
- **Material 3 design** system implementation
- **Light/Dark mode** support with system preference detection
- **Consistent theming** matching React frontend's deepPurple color scheme
- **Responsive UI** optimized for mobile devices

### 🔄 Robust Fallback Mechanism
- **API-first approach** with comprehensive error handling
- **Automatic fallback** to static data when API calls fail
- **Seamless user experience** regardless of network conditions
- **Demo functionality** available even without backend connection

## Technical Architecture

### Dependencies
```yaml
dependencies:
  flutter: ^3.9.2
  http: ^1.1.0           # HTTP client for API calls
  dio: ^5.3.2            # Alternative HTTP client with interceptors
  provider: ^6.1.1       # State management
  shared_preferences: ^2.2.2  # Local storage
  cached_network_image: ^3.3.0  # Image caching
  shimmer: ^3.0.0        # Loading animations
  intl: ^0.19.0          # Date formatting
```

### Project Structure
```
lib/
├── main.dart                    # App entry point and navigation
├── core/
│   ├── constants/
│   │   └── app_constants.dart   # API endpoints, UI constants
│   ├── data/
│   │   └── dummy_data.dart      # Static fallback data
│   ├── models/                  # Data models
│   │   ├── user_model.dart
│   │   ├── vendor_model.dart
│   │   ├── menu_model.dart
│   │   ├── order_model.dart
│   │   └── subscription_model.dart
│   └── services/
│       ├── api_service.dart     # HTTP client with fallback
│       └── storage_service.dart # Local data persistence
├── shared/
│   ├── providers/               # State management
│   │   ├── auth_provider.dart
│   │   └── theme_provider.dart
│   └── theme/                   # App theming
│       ├── app_theme.dart
│       └── app_colors.dart
└── features/
    ├── auth/screens/            # Authentication screens
    ├── dashboard/screens/       # Main dashboard
    ├── menu/screens/           # Menu browsing
    ├── profile/screens/        # User profile
    └── subscription/screens/   # Subscription management
```

## API Integration

### Backend Compatibility
The app is designed to work with the existing Node.js/Express backend:

**Base URL**: `http://localhost:8000`

### API Endpoints
| Feature | Endpoint | Status |
|---------|----------|--------|
| User Authentication | `POST /api/user/register` | ✅ Integrated with fallback |
| User Login | `POST /api/user/login` | ✅ Integrated with fallback |
| Auth Check | `GET /api/user/profile` | ✅ Integrated with fallback |
| Daily Menus | `GET /api/vendor/public/daily-menus` | ✅ Integrated with fallback |
| Place Order | `POST /api/orders` | ✅ Integrated with fallback |
| User Orders | `GET /api/orders/user/:userId` | ✅ Integrated with fallback |
| Subscriptions | `GET /api/subscriptions/user/:userId` | ✅ Integrated with fallback |
| Update Profile | `PUT /api/user/profile` | ✅ Integrated with fallback |

### Fallback Mechanism
When live API calls fail, the app automatically switches to comprehensive static data:
- **Sample users** for authentication testing
- **Demo vendors** with varied menu offerings
- **Realistic menu items** with pricing and availability
- **Mock orders** showing different statuses
- **Sample subscriptions** with various plans and states

## Features Status

### ✅ Completed Features
- **Authentication system** with login/register screens
- **Main navigation** with bottom navigation bar
- **Dashboard screen** with user stats and quick actions
- **Menu browsing** with search and filtering
- **Subscription management** with pause/resume functionality
- **User profile** with editable fields and settings
- **Theme system** with light/dark mode toggle
- **API service** with comprehensive fallback mechanism
- **Local storage** for user data and preferences
- **Error handling** with user-friendly messages

### 🟡 Partially Implemented
- **Order placement** (UI complete, API integration with demo functionality)
- **Push notifications** (placeholder settings, implementation pending)
- **Order history** (navigation placeholder, detailed view pending)

### ❌ Future Enhancements
- **Real-time order tracking**
- **Payment gateway integration**
- **In-app chat support**
- **Delivery address management**
- **Referral system**
- **Rating and review system**

## Getting Started

### Prerequisites
- Flutter SDK 3.9.2 or higher
- Dart SDK
- Android Studio / VS Code with Flutter extension
- Android/iOS device or emulator

### Installation
1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd flutter_app
   ```

2. **Install dependencies**
   ```bash
   flutter pub get
   ```

3. **Run the app**
   ```bash
   flutter run
   ```

### Demo Credentials
For testing the authentication system:
- **Username**: `demo_user`
- **Password**: `demo123`

Or create a new account using the registration screen.

## Configuration

### API Configuration
Update the base URL in `lib/core/constants/app_constants.dart`:
```dart
class AppConstants {
  static const String baseUrl = 'http://your-api-server:port';
  // ... other constants
}
```

### Theme Customization
Modify colors in `lib/shared/theme/app_colors.dart`:
```dart
class AppColors {
  static const Color primary = Color(0xFF673AB7);  // Deep Purple
  // ... other colors
}
```

## Testing

### Demo Mode
The app includes comprehensive demo functionality:
- **Works offline** using static data
- **Realistic interactions** with mock API responses
- **Complete user flows** from registration to order placement
- **Error simulation** for testing error handling

### Authentication Testing
- Use demo credentials or create new accounts
- Test password validation and form handling
- Verify session persistence across app restarts

### Feature Testing
- Browse menus with search and filtering
- View subscription details and management options
- Test profile editing and theme switching
- Verify navigation between all screens

## Development Notes

### State Management
The app uses Provider pattern for state management:
- **AuthProvider**: Manages user authentication state
- **ThemeProvider**: Handles theme switching and persistence

### Error Handling
Comprehensive error handling throughout the app:
- **Network errors**: Automatic fallback to static data
- **Validation errors**: Real-time form validation
- **User feedback**: Contextual error messages and success notifications

### Performance
- **Image caching** for vendor logos and menu images
- **Lazy loading** for menu items and order history
- **Optimized builds** with const constructors where possible

## Contributing

### Code Style
- Follow Flutter/Dart style guidelines
- Use meaningful variable and function names
- Add comments for complex business logic
- Maintain consistent indentation and formatting

### Adding New Features
1. Create feature-specific folders under `lib/features/`
2. Add corresponding models in `lib/core/models/`
3. Update API service with new endpoints
4. Add static fallback data for testing
5. Update navigation and routing as needed

## Support

For technical issues or questions:
- Check the existing code documentation
- Review error logs in debug console
- Test with demo data before reporting API issues
- Ensure Flutter SDK is up to date

---

**NourishNet Flutter App** - Delivering delicious meals with a delightful mobile experience! 🍽️📱