import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import 'dart:async';
import '../../../shared/providers/auth_provider.dart';
import '../../../shared/providers/theme_provider.dart';
import '../../../l10n/app_localizations.dart';
import '../../../core/constants/app_constants.dart';
import '../../../shared/theme/app_colors.dart';
import '../../../core/data/dummy_data.dart';
import '../../../core/models/subscription_model.dart' as subscription_models;
import '../../../core/models/order_model.dart' as order_models;
import '../../menu/screens/menu_screen.dart';
import '../../subscription/screens/subscription_screen.dart';
import '../../profile/screens/profile_screen.dart';
import '../../../shared/widgets/restaurant_carousel.dart';
import '../../../shared/widgets/premium_cards.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen>
    with TickerProviderStateMixin {
  List<subscription_models.Subscription> _subscriptions = [];
  List<order_models.Order> _recentOrders = [];
  bool _isLoading = true;
  int _gameScore = 0;
  int _activeFeature = 0;
  late AnimationController _fadeController;
  late AnimationController _slideController;
  late Animation<double> _fadeAnimation;
  late Animation<Offset> _slideAnimation;
  Timer? _typewriterTimer;

  List<String> _getHeroTexts(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    return [
      l10n.curatedCulinaryExcellence,
      l10n.sophisticatedDiningExperience,
      l10n.premiumLocalGastronomy,
    ];
  }

  List<String> _getHeroSubtitles(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    return [
      l10n.discoverArtisanalFlavors,
      l10n.exceptionalTasteService,
      l10n.elevatingNeighborhoodDining,
    ];
  }

  int _currentHeroIndex = 0;

  @override
  void initState() {
    super.initState();
    _fadeController = AnimationController(
      duration: const Duration(milliseconds: 800),
      vsync: this,
    );
    _slideController = AnimationController(
      duration: const Duration(milliseconds: 600),
      vsync: this,
    );

    _fadeAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(parent: _fadeController, curve: Curves.easeOut));

    _slideAnimation = Tween<Offset>(
      begin: const Offset(0, 0.3),
      end: Offset.zero,
    ).animate(CurvedAnimation(parent: _slideController, curve: Curves.easeOut));

    _loadDashboardData();
    _startHeroRotation();
    _startTypewriterEffect();
  }

  @override
  void dispose() {
    _fadeController.dispose();
    _slideController.dispose();
    _typewriterTimer?.cancel();
    super.dispose();
  }

  void _startHeroRotation() {
    Timer.periodic(const Duration(seconds: 4), (timer) {
      if (mounted) {
        setState(() {
          _currentHeroIndex = (_currentHeroIndex + 1) % 3; // 3 hero texts
        });
        _startTypewriterEffect();
      }
    });
  }

  void _startTypewriterEffect() {
    _typewriterTimer?.cancel();

    // We'll update this in the widget to use context
    if (mounted) {
      setState(() {});
    }
  }

  Future<void> _loadDashboardData() async {
    setState(() {
      _isLoading = true;
    });

    // Simulate API delay
    await Future.delayed(const Duration(milliseconds: 500));

    // Load data (using fallback data for now)
    _subscriptions = DummyData.getActiveSubscriptions();
    _recentOrders = DummyData.getRecentOrders();

    setState(() {
      _isLoading = false;
    });

    // Start animations after data loads
    _fadeController.forward();
    _slideController.forward();
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final themeProvider = Provider.of<ThemeProvider>(context);
    final user = authProvider.user;

    return Scaffold(
      backgroundColor: themeProvider.backgroundColor,
      body: SafeArea(
        child: RefreshIndicator(
          onRefresh: _loadDashboardData,
          color: themeProvider.primaryColor,
          child: _isLoading
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Container(
                        width: 60,
                        height: 60,
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            colors: themeProvider.primaryGradient,
                          ),
                          borderRadius: BorderRadius.circular(30),
                        ),
                        child: const Padding(
                          padding: EdgeInsets.all(16),
                          child: CircularProgressIndicator(
                            valueColor: AlwaysStoppedAnimation<Color>(
                              Colors.white,
                            ),
                            strokeWidth: 3,
                          ),
                        ),
                      ),
                      const SizedBox(height: 16),
                      Text(
                        'Curating your experience...',
                        style: TextStyle(
                          color: themeProvider.textSecondaryColor,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                )
              : FadeTransition(
                  opacity: _fadeAnimation,
                  child: SlideTransition(
                    position: _slideAnimation,
                    child: SingleChildScrollView(
                      physics: const AlwaysScrollableScrollPhysics(),
                      padding: const EdgeInsets.symmetric(horizontal: 20),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const SizedBox(height: 20),

                          // Premium Header
                          _buildPremiumHeader(user, themeProvider),
                          const SizedBox(height: 32),

                          // Hero Section with Typewriter
                          _buildHeroSection(themeProvider),
                          const SizedBox(height: 32),

                          // Restaurant Carousel
                          const RestaurantCarousel(),
                          const SizedBox(height: 32),

                          // Quick Stats with Premium Design
                          _buildPremiumStats(themeProvider),
                          const SizedBox(height: 32),

                          // Game Features Section
                          _buildGameFeatures(themeProvider),
                          const SizedBox(height: 32),

                          // Active Subscription with Premium Design
                          _buildPremiumSubscription(themeProvider),
                          const SizedBox(height: 32),

                          // Today's Curated Menu
                          _buildCuratedMenu(themeProvider),
                          const SizedBox(height: 32),

                          // Recent Orders with Timeline
                          _buildPremiumOrders(themeProvider),
                          const SizedBox(height: 32),

                          // Premium Actions
                          _buildPremiumActions(themeProvider),
                          const SizedBox(height: 40),
                        ],
                      ),
                    ),
                  ),
                ),
        ),
      ),
    );
  }

  Widget _buildPremiumHeader(user, ThemeProvider themeProvider) {
    return Row(
      children: [
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                AppLocalizations.of(context)!.welcome,
                style: TextStyle(
                  fontSize: 16,
                  color: themeProvider.textSecondaryColor,
                  fontWeight: FontWeight.w500,
                ),
              ),
              const SizedBox(height: 8),
              ShaderMask(
                shaderCallback: (bounds) => LinearGradient(
                  colors: themeProvider.primaryGradient,
                ).createShader(bounds),
                child: Text(
                  user?.fullName ?? 'Guest User',
                  style: const TextStyle(
                    fontSize: 28,
                    fontWeight: FontWeight.w700,
                    color: Colors.white,
                    fontFamily: AppColors.fontFamilyPrimary,
                  ),
                ),
              ),
            ],
          ),
        ),

        // Profile Avatar with Premium Design
        GestureDetector(
          onTap: () {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => const ProfileScreen()),
            );
          },
          child: Container(
            padding: const EdgeInsets.all(3),
            decoration: BoxDecoration(
              gradient: LinearGradient(colors: themeProvider.primaryGradient),
              borderRadius: BorderRadius.circular(25),
              boxShadow: [
                BoxShadow(
                  color: themeProvider.primaryColor.withOpacity(0.3),
                  blurRadius: 12,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: CircleAvatar(
              radius: 22,
              backgroundColor: themeProvider.panelsColor,
              child: Text(
                user?.fullName.substring(0, 1).toUpperCase() ?? 'G',
                style: TextStyle(
                  color: themeProvider.primaryColor,
                  fontWeight: FontWeight.w700,
                  fontSize: 18,
                ),
              ),
            ),
          ),
        ),

        const SizedBox(width: 16),

        // Theme Toggle with Premium Design
        Container(
          decoration: BoxDecoration(
            color: themeProvider.panelsColor,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(
              color: themeProvider.borderColor.withOpacity(0.3),
              width: 1,
            ),
            boxShadow: [
              BoxShadow(
                color: themeProvider.isDarkMode
                    ? Colors.black.withOpacity(0.3)
                    : Colors.black.withOpacity(0.1),
                blurRadius: 8,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: Material(
            color: Colors.transparent,
            child: InkWell(
              onTap: () => themeProvider.toggleTheme(),
              borderRadius: BorderRadius.circular(20),
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: AnimatedSwitcher(
                  duration: const Duration(milliseconds: 300),
                  child: Icon(
                    themeProvider.isDarkMode
                        ? Icons.light_mode_rounded
                        : Icons.dark_mode_rounded,
                    key: ValueKey(themeProvider.isDarkMode),
                    color: themeProvider.primaryColor,
                    size: 20,
                  ),
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildHeroSection(ThemeProvider themeProvider) {
    final heroTexts = _getHeroTexts(context);
    final heroSubtitles = _getHeroSubtitles(context);

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(32),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: themeProvider.primaryGradient,
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: themeProvider.primaryColor.withOpacity(0.3),
            blurRadius: 20,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            heroTexts[_currentHeroIndex],
            style: const TextStyle(
              fontSize: 32,
              fontWeight: FontWeight.w700,
              color: Colors.white,
              fontFamily: AppColors.fontFamilyPrimary,
              height: 1.2,
            ),
          ),
          const SizedBox(height: 12),
          AnimatedSwitcher(
            duration: const Duration(milliseconds: 500),
            child: Text(
              heroSubtitles[_currentHeroIndex],
              key: ValueKey(_currentHeroIndex),
              style: TextStyle(
                fontSize: 16,
                color: Colors.white.withOpacity(0.9),
                height: 1.5,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPremiumStats(ThemeProvider themeProvider) {
    final activeSubscriptions = _subscriptions
        .where(
          (sub) =>
              sub.subscriptionStatus ==
              subscription_models.SubscriptionStatus.active,
        )
        .length;
    final totalOrders = _recentOrders.length;
    final todaysMenus = DummyData.getTodaysMenus().length;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Your Culinary Journey',
          style: TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.w700,
            color: themeProvider.textColor,
            fontFamily: AppColors.fontFamilyPrimary,
          ),
        ),
        const SizedBox(height: 16),
        Row(
          children: [
            Expanded(
              child: StatCard(
                title: 'Active\nSubscriptions',
                value: activeSubscriptions.toString(),
                icon: Icons.subscriptions_rounded,
                iconColor: themeProvider.primaryColor,
                isDarkMode: themeProvider.isDarkMode,
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => const SubscriptionScreen(),
                    ),
                  );
                },
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: StatCard(
                title: 'Total\nOrders',
                value: totalOrders.toString(),
                icon: Icons.receipt_long_rounded,
                iconColor: themeProvider.secondaryColor,
                isDarkMode: themeProvider.isDarkMode,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: StatCard(
                title: 'Today\'s\nMenus',
                value: todaysMenus.toString(),
                icon: Icons.restaurant_menu_rounded,
                iconColor: themeProvider.warningColor,
                isDarkMode: themeProvider.isDarkMode,
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => const MenuScreen()),
                  );
                },
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildGameFeatures(ThemeProvider themeProvider) {
    final gameFeatures = [
      {
        'icon': Icons.emoji_events_rounded,
        'title': 'Elite Rewards',
        'description':
            'Exclusive privileges and premium benefits with every curated experience',
        'points': 50,
        'color': themeProvider.primaryColor,
      },
      {
        'icon': Icons.military_tech_rounded,
        'title': 'Culinary Achievements',
        'description':
            'Unlock prestigious badges as you explore refined dining experiences',
        'points': 25,
        'color': themeProvider.secondaryColor,
      },
      {
        'icon': Icons.stars_rounded,
        'title': 'VIP Recognition',
        'description':
            'Distinguished status and personalized recommendations for connoisseurs',
        'points': 75,
        'color': themeProvider.warningColor,
      },
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Expanded(
              child: Text(
                'Unlock Premium Experiences',
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.w700,
                  color: themeProvider.textColor,
                  fontFamily: AppColors.fontFamilyPrimary,
                ),
              ),
            ),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: themeProvider.secondaryGradient,
                ),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(Icons.star, color: Colors.white, size: 16),
                  const SizedBox(width: 4),
                  Text(
                    '$_gameScore pts',
                    style: const TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.w600,
                      fontSize: 14,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
        const SizedBox(height: 16),
        SizedBox(
          height: 200,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            itemCount: gameFeatures.length,
            itemBuilder: (context, index) {
              final feature = gameFeatures[index];
              return SizedBox(
                width: 280,
                child: FeatureCard(
                  title: feature['title'] as String,
                  description: feature['description'] as String,
                  icon: feature['icon'] as IconData,
                  iconColor: feature['color'] as Color,
                  isDarkMode: themeProvider.isDarkMode,
                  points: feature['points'] as int,
                  onTap: () {
                    setState(() {
                      _gameScore += (feature['points'] as int);
                      _activeFeature = index;
                    });
                  },
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _buildPremiumSubscription(ThemeProvider themeProvider) {
    if (_subscriptions.isEmpty) {
      return PremiumCard(
        isDarkMode: themeProvider.isDarkMode,
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => const SubscriptionScreen()),
          );
        },
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: themeProvider.primaryColor.withOpacity(0.1),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Icon(
                Icons.subscriptions_rounded,
                size: 48,
                color: themeProvider.primaryColor,
              ),
            ),
            const SizedBox(height: 16),
            Text(
              'Start Your Culinary Journey',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.w700,
                color: themeProvider.textColor,
                fontFamily: AppColors.fontFamilyPrimary,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Subscribe to premium dining experiences and unlock exclusive benefits',
              textAlign: TextAlign.center,
              style: TextStyle(
                color: themeProvider.textSecondaryColor,
                height: 1.4,
              ),
            ),
            const SizedBox(height: 20),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
              decoration: BoxDecoration(
                gradient: LinearGradient(colors: themeProvider.primaryGradient),
                borderRadius: BorderRadius.circular(16),
              ),
              child: const Text(
                'Explore Plans',
                style: TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
          ],
        ),
      );
    }

    final subscription = _subscriptions.first;

    return PremiumCard(
      isDarkMode: themeProvider.isDarkMode,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: themeProvider.primaryGradient,
                  ),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: const Icon(
                  Icons.subscriptions_rounded,
                  color: Colors.white,
                  size: 24,
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Premium Subscription',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w700,
                        color: themeProvider.textColor,
                        fontFamily: AppColors.fontFamilyPrimary,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      subscription.vendor?.businessName ?? 'Unknown Vendor',
                      style: TextStyle(
                        fontSize: 14,
                        color: themeProvider.textSecondaryColor,
                      ),
                    ),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 6,
                ),
                decoration: BoxDecoration(
                  color: themeProvider.successColor.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: themeProvider.successColor.withOpacity(0.3),
                    width: 1,
                  ),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(
                      Icons.check_circle,
                      color: themeProvider.successColor,
                      size: 16,
                    ),
                    const SizedBox(width: 4),
                    Text(
                      'ACTIVE',
                      style: TextStyle(
                        fontSize: 12,
                        color: themeProvider.successColor,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: themeProvider.isDarkMode
                  ? Colors.white.withOpacity(0.05)
                  : Colors.black.withOpacity(0.03),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Meals Remaining',
                        style: TextStyle(
                          fontSize: 12,
                          color: themeProvider.textSecondaryColor,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        '${subscription.remainingMeals}',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.w700,
                          color: themeProvider.primaryColor,
                        ),
                      ),
                    ],
                  ),
                ),
                Container(
                  width: 1,
                  height: 40,
                  color: themeProvider.borderColor.withOpacity(0.3),
                ),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Text(
                        'Next Delivery',
                        style: TextStyle(
                          fontSize: 12,
                          color: themeProvider.textSecondaryColor,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        subscription.deliveryTimeSlot,
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                          color: themeProvider.textColor,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCuratedMenu(ThemeProvider themeProvider) {
    final todaysMenus = DummyData.getTodaysMenus();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Today\'s Curated Selection',
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.w700,
                      color: themeProvider.textColor,
                      fontFamily: AppColors.fontFamilyPrimary,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Handpicked by our culinary experts',
                    style: TextStyle(
                      fontSize: 14,
                      color: themeProvider.textSecondaryColor,
                    ),
                  ),
                ],
              ),
            ),
            Container(
              decoration: BoxDecoration(
                color: themeProvider.panelsColor,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: themeProvider.primaryColor.withOpacity(0.3),
                  width: 1,
                ),
              ),
              child: Material(
                color: Colors.transparent,
                child: InkWell(
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => const MenuScreen(),
                      ),
                    );
                  },
                  borderRadius: BorderRadius.circular(16),
                  child: Padding(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 8,
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text(
                          'View All',
                          style: TextStyle(
                            color: themeProvider.primaryColor,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        const SizedBox(width: 4),
                        Icon(
                          Icons.arrow_forward_ios,
                          color: themeProvider.primaryColor,
                          size: 14,
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 20),
        if (todaysMenus.isEmpty)
          PremiumCard(
            isDarkMode: themeProvider.isDarkMode,
            child: Column(
              children: [
                Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: themeProvider.primaryColor.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Icon(
                    Icons.restaurant_menu_rounded,
                    size: 48,
                    color: themeProvider.primaryColor,
                  ),
                ),
                const SizedBox(height: 16),
                Text(
                  'No Curated Menus Yet',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                    color: themeProvider.textColor,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Our culinary team is crafting today\'s selection. Check back soon!',
                  textAlign: TextAlign.center,
                  style: TextStyle(color: themeProvider.textSecondaryColor),
                ),
              ],
            ),
          )
        else
          SizedBox(
            height: 280,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              itemCount: todaysMenus.length,
              itemBuilder: (context, index) {
                final menu = todaysMenus[index];
                return Container(
                  width: 200,
                  margin: EdgeInsets.only(
                    right: index < todaysMenus.length - 1 ? 16 : 0,
                  ),
                  child: PremiumCard(
                    isDarkMode: themeProvider.isDarkMode,
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          height: 120,
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              colors: themeProvider.primaryGradient,
                              begin: Alignment.topLeft,
                              end: Alignment.bottomRight,
                            ),
                            borderRadius: BorderRadius.circular(16),
                          ),
                          child: Center(
                            child: Icon(
                              Icons.restaurant_rounded,
                              size: 40,
                              color: Colors.white,
                            ),
                          ),
                        ),
                        const SizedBox(height: 16),
                        Text(
                          menu.name,
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w700,
                            color: themeProvider.textColor,
                            fontFamily: AppColors.fontFamilyPrimary,
                          ),
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                        const SizedBox(height: 8),
                        Text(
                          menu.vendor?.businessName ?? '',
                          style: TextStyle(
                            fontSize: 12,
                            color: themeProvider.textSecondaryColor,
                            fontWeight: FontWeight.w500,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                        const Spacer(),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              '₹${menu.fullDabbaPrice.toInt()}',
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.w700,
                                color: themeProvider.primaryColor,
                              ),
                            ),
                            Container(
                              padding: const EdgeInsets.all(8),
                              decoration: BoxDecoration(
                                color: themeProvider.primaryColor.withOpacity(
                                  0.1,
                                ),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Icon(
                                Icons.add_rounded,
                                color: themeProvider.primaryColor,
                                size: 16,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
      ],
    );
  }

  Widget _buildPremiumOrders(ThemeProvider themeProvider) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Recent Culinary Experiences',
          style: TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.w700,
            color: themeProvider.textColor,
            fontFamily: AppColors.fontFamilyPrimary,
          ),
        ),
        const SizedBox(height: 16),
        if (_recentOrders.isEmpty)
          PremiumCard(
            isDarkMode: themeProvider.isDarkMode,
            child: Column(
              children: [
                Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: themeProvider.primaryColor.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Icon(
                    Icons.receipt_long_rounded,
                    size: 48,
                    color: themeProvider.primaryColor,
                  ),
                ),
                const SizedBox(height: 16),
                Text(
                  'Your Culinary Journey Begins',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                    color: themeProvider.textColor,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Your order history and dining experiences will appear here',
                  textAlign: TextAlign.center,
                  style: TextStyle(color: themeProvider.textSecondaryColor),
                ),
              ],
            ),
          )
        else
          Column(
            children: _recentOrders.take(3).map((order) {
              final index = _recentOrders.indexOf(order);
              return Container(
                margin: const EdgeInsets.only(bottom: 12),
                child: PremiumCard(
                  isDarkMode: themeProvider.isDarkMode,
                  padding: const EdgeInsets.all(20),
                  child: Row(
                    children: [
                      // Status Timeline
                      Container(
                        width: 60,
                        height: 60,
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            colors: [
                              _getOrderStatusColor(order.orderStatus),
                              _getOrderStatusColor(
                                order.orderStatus,
                              ).withOpacity(0.7),
                            ],
                          ),
                          borderRadius: BorderRadius.circular(20),
                          boxShadow: [
                            BoxShadow(
                              color: _getOrderStatusColor(
                                order.orderStatus,
                              ).withOpacity(0.3),
                              blurRadius: 12,
                              offset: const Offset(0, 4),
                            ),
                          ],
                        ),
                        child: Icon(
                          _getOrderStatusIcon(order.orderStatus),
                          color: Colors.white,
                          size: 28,
                        ),
                      ),

                      const SizedBox(width: 16),

                      // Order Details
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              order.menu?.name ?? 'Unknown Menu',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w700,
                                color: themeProvider.textColor,
                                fontFamily: AppColors.fontFamilyPrimary,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              order.vendor?.businessName ?? 'Unknown Vendor',
                              style: TextStyle(
                                fontSize: 14,
                                color: themeProvider.textSecondaryColor,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                            const SizedBox(height: 8),
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 12,
                                vertical: 6,
                              ),
                              decoration: BoxDecoration(
                                color: _getOrderStatusColor(
                                  order.orderStatus,
                                ).withOpacity(0.1),
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(
                                  color: _getOrderStatusColor(
                                    order.orderStatus,
                                  ).withOpacity(0.3),
                                  width: 1,
                                ),
                              ),
                              child: Text(
                                order.orderStatusDisplayName,
                                style: TextStyle(
                                  fontSize: 12,
                                  color: _getOrderStatusColor(
                                    order.orderStatus,
                                  ),
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),

                      // Price and Date
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          Text(
                            '₹${order.totalAmount.toInt()}',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.w700,
                              color: themeProvider.primaryColor,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            DateFormat(
                              'MMM dd, yyyy',
                            ).format(order.deliveryDate),
                            style: TextStyle(
                              fontSize: 12,
                              color: themeProvider.textSecondaryColor,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              );
            }).toList(),
          ),
      ],
    );
  }

  Widget _buildPremiumActions(ThemeProvider themeProvider) {
    final actions = [
      {
        'title': 'Curated Menus',
        'subtitle': 'Explore handpicked selections',
        'icon': Icons.restaurant_menu_rounded,
        'color': themeProvider.primaryColor,
        'onTap': () => Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => const MenuScreen()),
        ),
      },
      {
        'title': 'Premium Plans',
        'subtitle': 'Unlock exclusive benefits',
        'icon': Icons.subscriptions_rounded,
        'color': themeProvider.secondaryColor,
        'onTap': () => Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => const SubscriptionScreen()),
        ),
      },
      {
        'title': 'Profile & Settings',
        'subtitle': 'Personalize your experience',
        'icon': Icons.person_rounded,
        'color': themeProvider.warningColor,
        'onTap': () => Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => const ProfileScreen()),
        ),
      },
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Discover More',
          style: TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.w700,
            color: themeProvider.textColor,
            fontFamily: AppColors.fontFamilyPrimary,
          ),
        ),
        const SizedBox(height: 16),
        ...actions.map((action) {
          return Container(
            margin: const EdgeInsets.only(bottom: 12),
            child: PremiumCard(
              isDarkMode: themeProvider.isDarkMode,
              onTap: action['onTap'] as VoidCallback,
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [
                          action['color'] as Color,
                          (action['color'] as Color).withOpacity(0.7),
                        ],
                      ),
                      borderRadius: BorderRadius.circular(20),
                      boxShadow: [
                        BoxShadow(
                          color: (action['color'] as Color).withOpacity(0.3),
                          blurRadius: 12,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: Icon(
                      action['icon'] as IconData,
                      color: Colors.white,
                      size: 32,
                    ),
                  ),
                  const SizedBox(width: 20),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          action['title'] as String,
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w700,
                            color: themeProvider.textColor,
                            fontFamily: AppColors.fontFamilyPrimary,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          action['subtitle'] as String,
                          style: TextStyle(
                            fontSize: 14,
                            color: themeProvider.textSecondaryColor,
                          ),
                        ),
                      ],
                    ),
                  ),
                  Icon(
                    Icons.arrow_forward_ios_rounded,
                    color: themeProvider.textSecondaryColor,
                    size: 16,
                  ),
                ],
              ),
            ),
          );
        }),
      ],
    );
  }

  Color _getOrderStatusColor(order_models.OrderStatus status) {
    switch (status) {
      case order_models.OrderStatus.placed:
        return AppColors.info;
      case order_models.OrderStatus.confirmed:
        return AppColors.primary;
      case order_models.OrderStatus.preparing:
        return AppColors.warning;
      case order_models.OrderStatus.outForDelivery:
        return AppColors.secondary;
      case order_models.OrderStatus.delivered:
        return AppColors.success;
      case order_models.OrderStatus.cancelled:
        return AppColors.error;
    }
  }

  IconData _getOrderStatusIcon(order_models.OrderStatus status) {
    switch (status) {
      case order_models.OrderStatus.placed:
        return Icons.receipt_outlined;
      case order_models.OrderStatus.confirmed:
        return Icons.check_circle_outline;
      case order_models.OrderStatus.preparing:
        return Icons.restaurant_outlined;
      case order_models.OrderStatus.outForDelivery:
        return Icons.delivery_dining_outlined;
      case order_models.OrderStatus.delivered:
        return Icons.check_circle;
      case order_models.OrderStatus.cancelled:
        return Icons.cancel_outlined;
    }
  }
}
