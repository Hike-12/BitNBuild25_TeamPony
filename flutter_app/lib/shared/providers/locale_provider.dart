import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class LocaleProvider extends ChangeNotifier {
  static const String _localeKey = 'selected_locale';

  // Default to English
  Locale _locale = const Locale('en');

  // Supported locales
  static const List<Locale> supportedLocales = [
    Locale('en'), // English
    Locale('hi'), // Hindi
  ];

  Locale get locale => _locale;

  /// Initialize the locale from shared preferences
  Future<void> loadLocale() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final savedLocale = prefs.getString(_localeKey);

      if (savedLocale != null) {
        _locale = Locale(savedLocale);
        notifyListeners();
      }
    } catch (e) {
      // Use default locale if there's any error
      _locale = const Locale('en');
    }
  }

  /// Set new locale and save to preferences
  Future<void> setLocale(Locale newLocale) async {
    if (_locale == newLocale) return;

    // Verify the locale is supported
    if (!supportedLocales.contains(newLocale)) {
      throw ArgumentError('Locale ${newLocale.languageCode} is not supported');
    }

    _locale = newLocale;
    notifyListeners();

    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(_localeKey, newLocale.languageCode);
    } catch (e) {
      // Log error but don't throw - the UI change has already been applied
      debugPrint('Failed to save locale preference: $e');
    }
  }

  /// Check if the given locale is currently selected
  bool isLocaleSelected(Locale locale) {
    return _locale.languageCode == locale.languageCode;
  }

  /// Get the display name for a locale
  String getLocaleName(Locale locale) {
    switch (locale.languageCode) {
      case 'en':
        return 'English';
      case 'hi':
        return 'हिंदी';
      default:
        return locale.languageCode.toUpperCase();
    }
  }

  /// Get all supported locales with their display names
  Map<Locale, String> get supportedLocalesWithNames {
    return {for (var locale in supportedLocales) locale: getLocaleName(locale)};
  }
}
