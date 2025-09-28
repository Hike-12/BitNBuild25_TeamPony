import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../constants/app_constants.dart';
import '../models/user_model.dart';

class StorageService {
  static SharedPreferences? _prefs;

  // Initialize shared preferences
  static Future<void> init() async {
    _prefs = await SharedPreferences.getInstance();
  }

  // Ensure preferences are initialized
  static Future<SharedPreferences> get _instance async {
    return _prefs ?? await SharedPreferences.getInstance();
  }

  // Authentication Token Storage
  static Future<void> saveAuthToken(String token) async {
    final prefs = await _instance;
    await prefs.setString(AppConstants.authTokenKey, token);
  }

  static Future<String?> getAuthToken() async {
    final prefs = await _instance;
    return prefs.getString(AppConstants.authTokenKey);
  }

  static Future<void> removeAuthToken() async {
    final prefs = await _instance;
    await prefs.remove(AppConstants.authTokenKey);
  }

  // User Data Storage
  static Future<void> saveUserData(User user) async {
    final prefs = await _instance;
    final userJson = jsonEncode(user.toJson());
    await prefs.setString(AppConstants.userDataKey, userJson);
  }

  static Future<User?> getUserData() async {
    final prefs = await _instance;
    final userJson = prefs.getString(AppConstants.userDataKey);

    if (userJson != null) {
      try {
        final userMap = jsonDecode(userJson) as Map<String, dynamic>;
        return User.fromJson(userMap);
      } catch (e) {
        print('Error parsing user data: $e');
        return null;
      }
    }

    return null;
  }

  static Future<void> removeUserData() async {
    final prefs = await _instance;
    await prefs.remove(AppConstants.userDataKey);
  }

  // Theme Storage
  static Future<void> saveThemeMode(bool isDarkMode) async {
    final prefs = await _instance;
    await prefs.setBool(AppConstants.themeKey, isDarkMode);
  }

  static Future<bool> getThemeMode() async {
    final prefs = await _instance;
    return prefs.getBool(AppConstants.themeKey) ??
        false; // Default to light mode
  }

  // Generic storage methods
  static Future<void> saveString(String key, String value) async {
    final prefs = await _instance;
    await prefs.setString(key, value);
  }

  static Future<String?> getString(String key) async {
    final prefs = await _instance;
    return prefs.getString(key);
  }

  static Future<void> saveBool(String key, bool value) async {
    final prefs = await _instance;
    await prefs.setBool(key, value);
  }

  static Future<bool> getBool(String key, {bool defaultValue = false}) async {
    final prefs = await _instance;
    return prefs.getBool(key) ?? defaultValue;
  }

  static Future<void> saveInt(String key, int value) async {
    final prefs = await _instance;
    await prefs.setInt(key, value);
  }

  static Future<int> getInt(String key, {int defaultValue = 0}) async {
    final prefs = await _instance;
    return prefs.getInt(key) ?? defaultValue;
  }

  static Future<void> saveDouble(String key, double value) async {
    final prefs = await _instance;
    await prefs.setDouble(key, value);
  }

  static Future<double> getDouble(
    String key, {
    double defaultValue = 0.0,
  }) async {
    final prefs = await _instance;
    return prefs.getDouble(key) ?? defaultValue;
  }

  static Future<void> saveStringList(String key, List<String> value) async {
    final prefs = await _instance;
    await prefs.setStringList(key, value);
  }

  static Future<List<String>> getStringList(String key) async {
    final prefs = await _instance;
    return prefs.getStringList(key) ?? [];
  }

  static Future<void> remove(String key) async {
    final prefs = await _instance;
    await prefs.remove(key);
  }

  static Future<void> clear() async {
    final prefs = await _instance;
    await prefs.clear();
  }

  static Future<bool> containsKey(String key) async {
    final prefs = await _instance;
    return prefs.containsKey(key);
  }

  // Auth helper methods
  static Future<bool> isLoggedIn() async {
    final token = await getAuthToken();
    return token != null && token.isNotEmpty;
  }

  static Future<void> logout() async {
    await removeAuthToken();
    await removeUserData();
    // Keep theme preference and other app settings
  }
}
