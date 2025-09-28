import 'package:flutter/material.dart';

class AppColors {
  // Primary Colors (matching the React frontend's deepPurple theme)
  static const Color primary = Color(0xFF6366F1); // Indigo-500
  static const Color primaryLight = Color(0xFF818CF8); // Indigo-400
  static const Color primaryDark = Color(0xFF4F46E5); // Indigo-600

  // Secondary Colors
  static const Color secondary = Color(0xFF10B981); // Emerald-500
  static const Color secondaryLight = Color(0xFF34D399); // Emerald-400
  static const Color secondaryDark = Color(0xFF059669); // Emerald-600

  // Neutral Colors
  static const Color white = Color(0xFFFFFFFF);
  static const Color black = Color(0xFF000000);

  // Light Theme Colors
  static const Color lightBackground = Color(0xFFF8FAFC); // Slate-50
  static const Color lightSurface = Color(0xFFFFFFFF);
  static const Color lightSurfaceVariant = Color(0xFFF1F5F9); // Slate-100
  static const Color lightOnBackground = Color(0xFF1E293B); // Slate-800
  static const Color lightOnSurface = Color(0xFF334155); // Slate-700
  static const Color lightOnSurfaceVariant = Color(0xFF64748B); // Slate-500

  // Dark Theme Colors
  static const Color darkBackground = Color(0xFF0F172A); // Slate-900
  static const Color darkSurface = Color(0xFF1E293B); // Slate-800
  static const Color darkSurfaceVariant = Color(0xFF334155); // Slate-700
  static const Color darkOnBackground = Color(0xFFF1F5F9); // Slate-100
  static const Color darkOnSurface = Color(0xFFE2E8F0); // Slate-200
  static const Color darkOnSurfaceVariant = Color(0xFF94A3B8); // Slate-400

  // Status Colors
  static const Color success = Color(0xFF10B981); // Emerald-500
  static const Color warning = Color(0xFFF59E0B); // Amber-500
  static const Color error = Color(0xFFEF4444); // Red-500
  static const Color info = Color(0xFF3B82F6); // Blue-500

  // Status Light Variants
  static const Color successLight = Color(0xFFD1FAE5); // Emerald-100
  static const Color warningLight = Color(0xFFFEF3C7); // Amber-100
  static const Color errorLight = Color(0xFFFEE2E2); // Red-100
  static const Color infoLight = Color(0xFFDBEAFE); // Blue-100

  // Food Category Colors
  static const Color vegetarian = Color(0xFF10B981); // Emerald-500
  static const Color nonVegetarian = Color(0xFFEF4444); // Red-500
  static const Color vegan = Color(0xFF22C55E); // Green-500

  // Border and Divider Colors
  static const Color lightBorder = Color(0xFFE2E8F0); // Slate-200
  static const Color darkBorder = Color(0xFF475569); // Slate-600
  static const Color lightDivider = Color(0xFFF1F5F9); // Slate-100
  static const Color darkDivider = Color(0xFF374151); // Gray-700

  // Shimmer Colors
  static const Color shimmerBase = Color(0xFFE2E8F0);
  static const Color shimmerHighlight = Color(0xFFF1F5F9);

  // Gradient Colors
  static const List<Color> primaryGradient = [
    Color(0xFF6366F1), // Indigo-500
    Color(0xFF8B5CF6), // Violet-500
  ];

  static const List<Color> secondaryGradient = [
    Color(0xFF10B981), // Emerald-500
    Color(0xFF06B6D4), // Cyan-500
  ];

  // Card Colors
  static const Color lightCardBackground = Color(0xFFFFFFFF);
  static const Color darkCardBackground = Color(0xFF1E293B); // Slate-800

  // Input Field Colors
  static const Color inputFillLight = Color(0xFFF8FAFC); // Slate-50
  static const Color inputFillDark = Color(0xFF334155); // Slate-700
  static const Color inputBorderLight = Color(0xFFD1D5DB); // Gray-300
  static const Color inputBorderDark = Color(0xFF6B7280); // Gray-500

  // Helper method to get color based on theme mode
  static Color getColorForTheme(
    bool isDarkMode,
    Color lightColor,
    Color darkColor,
  ) {
    return isDarkMode ? darkColor : lightColor;
  }
}
