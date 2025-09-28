import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'app_colors.dart';
import '../../core/constants/app_constants.dart';

class AppTheme {
  // Premium Google Fonts integration
  static const String primaryFont = 'SF Pro Display';
  static const String displayFont = 'Playfair Display';
  static const String bodyFont = 'Inter';

  static ThemeData lightTheme = ThemeData(
    useMaterial3: true,
    brightness: Brightness.light,
    fontFamily: primaryFont,

    // Color Scheme - Sophisticated light theme
    colorScheme: const ColorScheme.light(
      primary: AppColors.lightPrimary,
      onPrimary: AppColors.white,
      secondary: AppColors.lightSecondary,
      onSecondary: AppColors.white,
      surface: AppColors.lightPanels,
      onSurface: AppColors.lightText,
      background: AppColors.lightBackground,
      onBackground: AppColors.lightText,
      error: AppColors.lightError,
      onError: AppColors.white,
      outline: AppColors.lightBorder,
    ),

    // Scaffold - Premium background
    scaffoldBackgroundColor: AppColors.lightBackground,

    // App Bar - Premium styling
    appBarTheme: const AppBarTheme(
      backgroundColor: AppColors.lightPanels,
      foregroundColor: AppColors.lightText,
      elevation: 0,
      scrolledUnderElevation: 4,
      systemOverlayStyle: SystemUiOverlayStyle.dark,
      titleTextStyle: TextStyle(
        color: AppColors.lightText,
        fontSize: 22,
        fontWeight: FontWeight.w600,
        fontFamily: displayFont,
      ),
      centerTitle: true,
    ),

    // Card - Sophisticated styling
    cardTheme: CardThemeData(
      color: AppColors.lightPanels,
      elevation: 8,
      shadowColor: AppColors.lightPrimary.withOpacity(0.15),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(20),
        side: BorderSide(
          color: AppColors.lightBorder.withOpacity(0.3),
          width: 1,
        ),
      ),
      margin: const EdgeInsets.symmetric(
        horizontal: 16,
        vertical: 8,
      ),
    ),

    // Elevated Button - Premium design
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: AppColors.lightPrimary,
        foregroundColor: AppColors.white,
        elevation: 8,
        shadowColor: AppColors.lightPrimary.withOpacity(0.3),
        padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
        textStyle: const TextStyle(
          fontSize: 16, 
          fontWeight: FontWeight.w600,
          fontFamily: primaryFont,
        ),
      ),
    ),

    // Outlined Button
    outlinedButtonTheme: OutlinedButtonThemeData(
      style: OutlinedButton.styleFrom(
        foregroundColor: AppColors.primary,
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppConstants.borderRadius),
        ),
        side: const BorderSide(color: AppColors.primary, width: 1.5),
        textStyle: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
      ),
    ),

    // Text Button
    textButtonTheme: TextButtonThemeData(
      style: TextButton.styleFrom(
        foregroundColor: AppColors.primary,
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppConstants.borderRadius),
        ),
        textStyle: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
      ),
    ),

    // Input Decoration
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: AppColors.inputFillLight,
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(AppConstants.borderRadius),
        borderSide: const BorderSide(color: AppColors.inputBorderLight),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(AppConstants.borderRadius),
        borderSide: const BorderSide(color: AppColors.inputBorderLight),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(AppConstants.borderRadius),
        borderSide: const BorderSide(color: AppColors.primary, width: 2),
      ),
      errorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(AppConstants.borderRadius),
        borderSide: const BorderSide(color: AppColors.error),
      ),
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      labelStyle: const TextStyle(color: AppColors.lightOnSurfaceVariant),
      hintStyle: const TextStyle(color: AppColors.lightOnSurfaceVariant),
    ),

    // Bottom Navigation Bar
    bottomNavigationBarTheme: const BottomNavigationBarThemeData(
      backgroundColor: AppColors.lightSurface,
      selectedItemColor: AppColors.primary,
      unselectedItemColor: AppColors.lightOnSurfaceVariant,
      type: BottomNavigationBarType.fixed,
      elevation: 8,
    ),

    // Divider
    dividerTheme: const DividerThemeData(
      color: AppColors.lightDivider,
      thickness: 1,
    ),

    // Icon
    iconTheme: const IconThemeData(
      color: AppColors.lightOnSurfaceVariant,
      size: 24,
    ),

    // List Tile
    listTileTheme: const ListTileThemeData(
      contentPadding: EdgeInsets.symmetric(
        horizontal: AppConstants.defaultPadding,
      ),
      iconColor: AppColors.lightOnSurfaceVariant,
      textColor: AppColors.lightOnSurface,
    ),
  );

  static ThemeData darkTheme = ThemeData(
    useMaterial3: true,
    brightness: Brightness.dark,
    fontFamily: primaryFont,

    // Color Scheme - Sophisticated dark theme
    colorScheme: const ColorScheme.dark(
      primary: AppColors.darkPrimary,
      onPrimary: AppColors.black,
      secondary: AppColors.darkSecondary,
      onSecondary: AppColors.black,
      surface: AppColors.darkPanels,
      onSurface: AppColors.darkText,
      background: AppColors.darkBackground,
      onBackground: AppColors.darkText,
      error: AppColors.darkError,
      onError: AppColors.white,
      outline: AppColors.darkBorder,
    ),

    // Scaffold - Deep sophisticated background
    scaffoldBackgroundColor: AppColors.darkBackground,

    // App Bar - Premium dark styling
    appBarTheme: const AppBarTheme(
      backgroundColor: AppColors.darkPanels,
      foregroundColor: AppColors.darkText,
      elevation: 0,
      scrolledUnderElevation: 4,
      systemOverlayStyle: SystemUiOverlayStyle.light,
      titleTextStyle: TextStyle(
        color: AppColors.darkText,
        fontSize: 22,
        fontWeight: FontWeight.w600,
        fontFamily: displayFont,
      ),
      centerTitle: true,
    ),

    // Card - Sophisticated dark styling
    cardTheme: CardThemeData(
      color: AppColors.darkPanels,
      elevation: 12,
      shadowColor: AppColors.black.withOpacity(0.3),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(20),
        side: BorderSide(
          color: AppColors.darkBorder.withOpacity(0.5),
          width: 1,
        ),
      ),
      margin: const EdgeInsets.symmetric(
        horizontal: 16,
        vertical: 8,
      ),
    ),

    // Elevated Button - Premium dark design
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: AppColors.darkPrimary,
        foregroundColor: AppColors.black,
        elevation: 12,
        shadowColor: AppColors.darkPrimary.withOpacity(0.3),
        padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
        textStyle: const TextStyle(
          fontSize: 16, 
          fontWeight: FontWeight.w600,
          fontFamily: primaryFont,
        ),
      ),
    ),

    // Outlined Button
    outlinedButtonTheme: OutlinedButtonThemeData(
      style: OutlinedButton.styleFrom(
        foregroundColor: AppColors.primaryLight,
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppConstants.borderRadius),
        ),
        side: const BorderSide(color: AppColors.primaryLight, width: 1.5),
        textStyle: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
      ),
    ),

    // Text Button
    textButtonTheme: TextButtonThemeData(
      style: TextButton.styleFrom(
        foregroundColor: AppColors.primaryLight,
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppConstants.borderRadius),
        ),
        textStyle: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
      ),
    ),

    // Input Decoration
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: AppColors.inputFillDark,
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(AppConstants.borderRadius),
        borderSide: const BorderSide(color: AppColors.inputBorderDark),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(AppConstants.borderRadius),
        borderSide: const BorderSide(color: AppColors.inputBorderDark),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(AppConstants.borderRadius),
        borderSide: const BorderSide(color: AppColors.primaryLight, width: 2),
      ),
      errorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(AppConstants.borderRadius),
        borderSide: const BorderSide(color: AppColors.error),
      ),
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      labelStyle: const TextStyle(color: AppColors.darkOnSurfaceVariant),
      hintStyle: const TextStyle(color: AppColors.darkOnSurfaceVariant),
    ),

    // Bottom Navigation Bar
    bottomNavigationBarTheme: const BottomNavigationBarThemeData(
      backgroundColor: AppColors.darkSurface,
      selectedItemColor: AppColors.primaryLight,
      unselectedItemColor: AppColors.darkOnSurfaceVariant,
      type: BottomNavigationBarType.fixed,
      elevation: 8,
    ),

    // Divider
    dividerTheme: const DividerThemeData(
      color: AppColors.darkDivider,
      thickness: 1,
    ),

    // Icon
    iconTheme: const IconThemeData(
      color: AppColors.darkOnSurfaceVariant,
      size: 24,
    ),

    // List Tile
    listTileTheme: const ListTileThemeData(
      contentPadding: EdgeInsets.symmetric(
        horizontal: AppConstants.defaultPadding,
      ),
      iconColor: AppColors.darkOnSurfaceVariant,
      textColor: AppColors.darkOnSurface,
    ),
  );
}
