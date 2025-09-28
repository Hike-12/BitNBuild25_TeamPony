import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import '../../core/services/storage_service.dart';
import '../theme/app_colors.dart';

class ThemeProvider with ChangeNotifier {
  bool _isDarkMode = true; // Default to dark mode like React app
  bool _isLoading = false;

  // Getters
  bool get isDarkMode => _isDarkMode;
  bool get isLoading => _isLoading;
  ThemeMode get themeMode => _isDarkMode ? ThemeMode.dark : ThemeMode.light;

  ThemeProvider() {
    _loadThemeFromStorage();
  }

  // Load theme preference from storage
  Future<void> _loadThemeFromStorage() async {
    try {
      _isLoading = true;
      notifyListeners();

      _isDarkMode = await StorageService.getThemeMode();
    } catch (e) {
      print('Error loading theme from storage: $e');
      _isDarkMode = false; // Default to light mode
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Toggle theme
  Future<void> toggleTheme() async {
    try {
      _isDarkMode = !_isDarkMode;
      notifyListeners();

      // Save to storage
      await StorageService.saveThemeMode(_isDarkMode);
    } catch (e) {
      print('Error saving theme to storage: $e');
      // Revert the change if saving fails
      _isDarkMode = !_isDarkMode;
      notifyListeners();
    }
  }

  // Set theme explicitly
  Future<void> setTheme(bool isDarkMode) async {
    if (_isDarkMode == isDarkMode) return;

    try {
      _isDarkMode = isDarkMode;
      notifyListeners();

      // Save to storage
      await StorageService.saveThemeMode(_isDarkMode);
    } catch (e) {
      print('Error saving theme to storage: $e');
      // Revert the change if saving fails
      _isDarkMode = !_isDarkMode;
      notifyListeners();
    }
  }

  // Set light theme
  Future<void> setLightTheme() async {
    await setTheme(false);
  }

  // Set dark theme
  Future<void> setDarkTheme() async {
    await setTheme(true);
  }

  // Get current theme colors based on mode - matching React ThemeContext
  Color get primaryColor => AppColors.getPrimaryColor(_isDarkMode);
  Color get secondaryColor => AppColors.getSecondaryColor(_isDarkMode);
  Color get backgroundColor => AppColors.getBackgroundColor(_isDarkMode);
  Color get panelsColor => AppColors.getPanelsColor(_isDarkMode);
  Color get surfaceColor => AppColors.getPanelsColor(_isDarkMode);
  Color get textColor => AppColors.getTextColor(_isDarkMode);
  Color get textSecondaryColor => AppColors.getTextSecondaryColor(_isDarkMode);
  Color get subtitleColor => AppColors.getTextSecondaryColor(_isDarkMode);
  Color get borderColor => AppColors.getBorderColor(_isDarkMode);
  
  Color get errorColor => _isDarkMode ? AppColors.darkError : AppColors.lightError;
  Color get successColor => _isDarkMode ? AppColors.darkSuccess : AppColors.lightSuccess;
  Color get warningColor => _isDarkMode ? AppColors.darkWarning : AppColors.lightWarning;

  // Gradient getters
  List<Color> get primaryGradient => AppColors.getPrimaryGradient(_isDarkMode);
  List<Color> get secondaryGradient => AppColors.getSecondaryGradient(_isDarkMode);

  // Helper method to get appropriate color based on current theme
  Color getColorForCurrentTheme({
    required Color lightColor,
    required Color darkColor,
  }) {
    return _isDarkMode ? darkColor : lightColor;
  }
  
  // Premium theme data for sophisticated styling
  ThemeData get currentThemeData {
    return _isDarkMode ? _darkThemeData : _lightThemeData;
  }
  
  ThemeData get _lightThemeData => ThemeData(
    useMaterial3: true,
    brightness: Brightness.light,
    colorScheme: ColorScheme.light(
      primary: AppColors.lightPrimary,
      secondary: AppColors.lightSecondary,
      surface: AppColors.lightPanels,
      background: AppColors.lightBackground,
      error: AppColors.lightError,
      onPrimary: AppColors.white,
      onSecondary: AppColors.white,
      onSurface: AppColors.lightText,
      onBackground: AppColors.lightText,
      onError: AppColors.white,
    ),
    scaffoldBackgroundColor: AppColors.lightBackground,
    fontFamily: 'SF Pro Display',
  );
  
  ThemeData get _darkThemeData => ThemeData(
    useMaterial3: true,
    brightness: Brightness.dark,
    colorScheme: ColorScheme.dark(
      primary: AppColors.darkPrimary,
      secondary: AppColors.darkSecondary,
      surface: AppColors.darkPanels,
      background: AppColors.darkBackground,
      error: AppColors.darkError,
      onPrimary: AppColors.black,
      onSecondary: AppColors.black,
      onSurface: AppColors.darkText,
      onBackground: AppColors.darkText,
      onError: AppColors.white,
    ),
    scaffoldBackgroundColor: AppColors.darkBackground,
    fontFamily: 'SF Pro Display',
  );
}
