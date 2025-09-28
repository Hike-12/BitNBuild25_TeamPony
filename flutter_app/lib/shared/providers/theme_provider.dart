import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import '../../core/services/storage_service.dart';

class ThemeProvider with ChangeNotifier {
  bool _isDarkMode = false;
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

  // Get current theme colors based on mode
  Color get primaryColor => _isDarkMode
      ? const Color(0xFF818CF8) // Indigo-400 for dark mode
      : const Color(0xFF6366F1); // Indigo-500 for light mode

  Color get backgroundColor => _isDarkMode
      ? const Color(0xFF0F172A) // Slate-900 for dark mode
      : const Color(0xFFF8FAFC); // Slate-50 for light mode

  Color get surfaceColor => _isDarkMode
      ? const Color(0xFF1E293B) // Slate-800 for dark mode
      : const Color(0xFFFFFFFF); // White for light mode

  Color get textColor => _isDarkMode
      ? const Color(0xFFF1F5F9) // Slate-100 for dark mode
      : const Color(0xFF1E293B); // Slate-800 for light mode

  Color get subtitleColor => _isDarkMode
      ? const Color(0xFF94A3B8) // Slate-400 for dark mode
      : const Color(0xFF64748B); // Slate-500 for light mode

  // Helper method to get appropriate color based on current theme
  Color getColorForCurrentTheme({
    required Color lightColor,
    required Color darkColor,
  }) {
    return _isDarkMode ? darkColor : lightColor;
  }
}
