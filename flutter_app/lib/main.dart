import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:provider/provider.dart';
import 'shared/providers/auth_provider.dart';
import 'shared/providers/theme_provider.dart';
import 'shared/providers/locale_provider.dart';
import 'shared/theme/app_theme.dart';
import 'shared/theme/app_colors.dart';
import 'l10n/app_localizations.dart';
import 'features/auth/screens/login_screen.dart';
import 'features/dashboard/screens/dashboard_screen.dart';
import 'features/menu/screens/menu_screen.dart';
import 'features/profile/screens/profile_screen.dart';
import 'features/subscription/screens/subscription_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const NourishNetApp());
}

class NourishNetApp extends StatefulWidget {
  const NourishNetApp({super.key});

  @override
  State<NourishNetApp> createState() => _NourishNetAppState();
}

class _NourishNetAppState extends State<NourishNetApp> {
  late LocaleProvider localeProvider;

  @override
  void initState() {
    super.initState();
    localeProvider = LocaleProvider();
    // Load saved locale
    localeProvider.loadLocale();
  }

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => ThemeProvider()),
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider.value(value: localeProvider),
      ],
      child: Consumer2<ThemeProvider, LocaleProvider>(
        builder: (context, themeProvider, localeProvider, child) {
          return MaterialApp(
            title: 'NourishNet - Tiffin Service',
            debugShowCheckedModeBanner: false,
            theme: AppTheme.lightTheme,
            darkTheme: AppTheme.darkTheme,
            themeMode: themeProvider.themeMode,

            // Localization configuration
            localizationsDelegates: const [
              AppLocalizations.delegate,
              GlobalMaterialLocalizations.delegate,
              GlobalWidgetsLocalizations.delegate,
              GlobalCupertinoLocalizations.delegate,
            ],
            supportedLocales: const [
              Locale('en'), // English
              Locale('hi'), // Hindi
            ],
            locale: localeProvider.locale,

            home: const AuthWrapper(),
          );
        },
      ),
    );
  }
}

class AuthWrapper extends StatelessWidget {
  const AuthWrapper({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<AuthProvider>(
      builder: (context, authProvider, child) {
        switch (authProvider.status) {
          case AuthStatus.unknown:
            return const Scaffold(
              body: Center(child: CircularProgressIndicator()),
            );
          case AuthStatus.unauthenticated:
            return const LoginScreen();
          case AuthStatus.authenticated:
            return const MainNavigationScreen();
        }
      },
    );
  }
}

class MainNavigationScreen extends StatefulWidget {
  const MainNavigationScreen({super.key});

  @override
  State<MainNavigationScreen> createState() => _MainNavigationScreenState();
}

class _MainNavigationScreenState extends State<MainNavigationScreen>
    with TickerProviderStateMixin {
  int _currentIndex = 0;
  late PageController _pageController;
  late AnimationController _navAnimationController;

  final List<Widget> _screens = [
    const DashboardScreen(),
    const MenuScreen(),
    const SubscriptionScreen(),
    const ProfileScreen(),
  ];

  List<NavigationItem> _getNavigationItems(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    return [
      NavigationItem(
        icon: Icons.dashboard_outlined,
        selectedIcon: Icons.dashboard_rounded,
        label: l10n.dashboard,
        activeColor: AppColors.lightPrimary,
      ),
      NavigationItem(
        icon: Icons.restaurant_menu_outlined,
        selectedIcon: Icons.restaurant_menu_rounded,
        label: l10n.menu,
        activeColor: AppColors.lightSecondary,
      ),
      NavigationItem(
        icon: Icons.subscriptions_outlined,
        selectedIcon: Icons.subscriptions_rounded,
        label: l10n.premium,
        activeColor: AppColors.lightWarning,
      ),
      NavigationItem(
        icon: Icons.person_outlined,
        selectedIcon: Icons.person_rounded,
        label: l10n.profile,
        activeColor: AppColors.info,
      ),
    ];
  }

  @override
  void initState() {
    super.initState();
    _pageController = PageController(initialPage: _currentIndex);
    _navAnimationController = AnimationController(
      duration: const Duration(milliseconds: 300),
      vsync: this,
    );
  }

  @override
  void dispose() {
    _pageController.dispose();
    _navAnimationController.dispose();
    super.dispose();
  }

  void _onPageChanged(int index) {
    setState(() {
      _currentIndex = index;
    });
    _navAnimationController.forward().then((_) {
      _navAnimationController.reverse();
    });
  }

  void _onNavigationTap(int index) {
    _pageController.animateToPage(
      index,
      duration: const Duration(milliseconds: 300),
      curve: Curves.easeInOut,
    );
  }

  @override
  Widget build(BuildContext context) {
    final themeProvider = Provider.of<ThemeProvider>(context);

    return Scaffold(
      backgroundColor: themeProvider.backgroundColor,
      body: PageView(
        controller: _pageController,
        onPageChanged: _onPageChanged,
        children: _screens,
      ),
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: themeProvider.panelsColor,
          boxShadow: [
            BoxShadow(
              color: themeProvider.isDarkMode
                  ? Colors.black.withOpacity(0.3)
                  : Colors.black.withOpacity(0.1),
              blurRadius: 20,
              offset: const Offset(0, -4),
            ),
          ],
        ),
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: _getNavigationItems(context).asMap().entries.map((
                entry,
              ) {
                final index = entry.key;
                final item = entry.value;
                final isSelected = index == _currentIndex;

                return GestureDetector(
                  onTap: () => _onNavigationTap(index),
                  child: AnimatedBuilder(
                    animation: _navAnimationController,
                    builder: (context, child) {
                      final scale = isSelected
                          ? 1.0 + (_navAnimationController.value * 0.1)
                          : 1.0;

                      return Transform.scale(
                        scale: scale,
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 20,
                            vertical: 12,
                          ),
                          decoration: BoxDecoration(
                            gradient: isSelected
                                ? LinearGradient(
                                    colors: [
                                      item.activeColor,
                                      item.activeColor.withOpacity(0.7),
                                    ],
                                  )
                                : null,
                            borderRadius: BorderRadius.circular(20),
                            boxShadow: isSelected
                                ? [
                                    BoxShadow(
                                      color: item.activeColor.withOpacity(0.3),
                                      blurRadius: 12,
                                      offset: const Offset(0, 4),
                                    ),
                                  ]
                                : null,
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(
                                isSelected ? item.selectedIcon : item.icon,
                                color: isSelected
                                    ? Colors.white
                                    : themeProvider.textSecondaryColor,
                                size: 24,
                              ),
                              if (isSelected) ...[
                                const SizedBox(width: 8),
                                Text(
                                  item.label,
                                  style: const TextStyle(
                                    color: Colors.white,
                                    fontWeight: FontWeight.w600,
                                    fontSize: 14,
                                  ),
                                ),
                              ],
                            ],
                          ),
                        ),
                      );
                    },
                  ),
                );
              }).toList(),
            ),
          ),
        ),
      ),
    );
  }
}

class NavigationItem {
  final IconData icon;
  final IconData selectedIcon;
  final String label;
  final Color activeColor;

  NavigationItem({
    required this.icon,
    required this.selectedIcon,
    required this.label,
    required this.activeColor,
  });
}
