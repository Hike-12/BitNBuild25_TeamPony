import 'package:flutter/material.dart';

class AppColors {
  // Premium Theme Colors - Matching React ThemeContext.jsx
  
  // Dark Theme Colors (matching the sophisticated palette)
  static const Color darkBackground = Color(0xFF030303);    // deeper black as requested
  static const Color darkPanels = Color(0xFF172922);        // darker green slate for cards/panels
  static const Color darkPrimary = Color(0xFFE5A64A);       // warm gold accent
  static const Color darkSecondary = Color(0xFF38B174);     // fresh but muted green
  static const Color darkText = Color(0xFFECEFF1);          // soft off-white
  static const Color darkTextSecondary = Color(0xFFA3B1A3);
  static const Color darkBorder = Color(0xFF22352A);
  static const Color darkError = Color(0xFFFF5C5C);
  static const Color darkSuccess = Color(0xFF38B174);
  static const Color darkWarning = Color(0xFFE5A64A);

  // Light Theme Colors (matching the sophisticated palette)
  static const Color lightBackground = Color(0xFFFDFDF7);   // very slight off-white, soft on eyes
  static const Color lightPanels = Color(0xFFF5F8F2);       // subtle green-white card background
  static const Color lightPrimary = Color(0xFFFF8C4B);      // muted coral/orange accent
  static const Color lightSecondary = Color(0xFF2F9E63);    // natural leafy green
  static const Color lightText = Color(0xFF1A1A1A);
  static const Color lightTextSecondary = Color(0xFF555F55);
  static const Color lightBorder = Color(0xFFE0E7DE);
  static const Color lightError = Color(0xFFE53935);
  static const Color lightSuccess = Color(0xFF2F9E63);
  static const Color lightWarning = Color(0xFFFF8C4B);

  // Neutral Colors
  static const Color white = Color(0xFFFFFFFF);
  static const Color black = Color(0xFF000000);
  
  // Legacy Colors for backward compatibility
  static const Color primary = lightPrimary;
  static const Color primaryLight = Color(0xFFFFB084);
  static const Color primaryDark = Color(0xFFE6753B);
  
  static const Color secondary = lightSecondary;
  static const Color secondaryLight = Color(0xFF4FB682);
  static const Color secondaryDark = Color(0xFF238A54);

  // Surface Colors
  static const Color lightSurface = lightPanels;
  static const Color darkSurface = darkPanels;
  static const Color lightSurfaceVariant = Color(0xFFF0F3EF);
  static const Color darkSurfaceVariant = Color(0xFF1F312A);
  
  // Text Colors
  static const Color lightOnBackground = lightText;
  static const Color lightOnSurface = lightText;
  static const Color lightOnSurfaceVariant = lightTextSecondary;
  
  static const Color darkOnBackground = darkText;
  static const Color darkOnSurface = darkText;
  static const Color darkOnSurfaceVariant = darkTextSecondary;

  // Status Colors using theme-specific colors
  static const Color success = lightSuccess;
  static const Color warning = lightWarning;
  static const Color error = lightError;
  static const Color info = Color(0xFF4A90E2); // Premium blue

  // Status Light Variants
  static const Color successLight = Color(0xFFE8F5F0);
  static const Color warningLight = Color(0xFFFFF4E6);
  static const Color errorLight = Color(0xFFFFEBEE);
  static const Color infoLight = Color(0xFFE3F2FD);

  // Food Category Colors
  static const Color vegetarian = lightSuccess;
  static const Color nonVegetarian = lightError;
  static const Color vegan = Color(0xFF4CAF50);

  // Divider Colors
  static const Color lightDivider = lightBorder;
  static const Color darkDivider = darkBorder;

  // Shimmer Colors
  static const Color shimmerBase = Color(0xFFE2E8F0);
  static const Color shimmerHighlight = Color(0xFFF1F5F9);

  // Gradient Colors - Premium styled
  static const List<Color> primaryGradientLight = [
    lightPrimary,
    Color(0xFFFFB084),
  ];

  static const List<Color> primaryGradientDark = [
    darkPrimary,
    Color(0xFFF2C373),
  ];

  static const List<Color> secondaryGradientLight = [
    lightSecondary,
    Color(0xFF4FB682),
  ];

  static const List<Color> secondaryGradientDark = [
    darkSecondary,
    Color(0xFF5CC98A),
  ];

  // Card Colors
  static const Color lightCardBackground = lightPanels;
  static const Color darkCardBackground = darkPanels;

  // Input Field Colors
  static const Color inputFillLight = Color(0xFFF8FBF6);
  static const Color inputFillDark = Color(0xFF1F312A);
  static const Color inputBorderLight = lightBorder;
  static const Color inputBorderDark = darkBorder;

  // Premium Typography Colors
  static const String fontFamilyPrimary = 'Playfair Display';
  static const String fontFamilySecondary = 'Merriweather';
  
  // Helper methods for theme-aware colors
  static Color getBackgroundColor(bool isDarkMode) {
    return isDarkMode ? darkBackground : lightBackground;
  }
  
  static Color getPanelsColor(bool isDarkMode) {
    return isDarkMode ? darkPanels : lightPanels;
  }
  
  static Color getPrimaryColor(bool isDarkMode) {
    return isDarkMode ? darkPrimary : lightPrimary;
  }
  
  static Color getSecondaryColor(bool isDarkMode) {
    return isDarkMode ? darkSecondary : lightSecondary;
  }
  
  static Color getTextColor(bool isDarkMode) {
    return isDarkMode ? darkText : lightText;
  }
  
  static Color getTextSecondaryColor(bool isDarkMode) {
    return isDarkMode ? darkTextSecondary : lightTextSecondary;
  }
  
  static Color getBorderColor(bool isDarkMode) {
    return isDarkMode ? darkBorder : lightBorder;
  }
  
  static List<Color> getPrimaryGradient(bool isDarkMode) {
    return isDarkMode ? primaryGradientDark : primaryGradientLight;
  }
  
  static List<Color> getSecondaryGradient(bool isDarkMode) {
    return isDarkMode ? secondaryGradientDark : secondaryGradientLight;
  }
  
  // Helper method to get color based on theme mode
  static Color getColorForTheme(
    bool isDarkMode,
    Color lightColor,
    Color darkColor,
  ) {
    return isDarkMode ? darkColor : lightColor;
  }
}
