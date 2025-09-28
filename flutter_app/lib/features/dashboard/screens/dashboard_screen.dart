import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../../../shared/providers/auth_provider.dart';
import '../../../shared/providers/theme_provider.dart';
import '../../../core/constants/app_constants.dart';
import '../../../shared/theme/app_colors.dart';
import '../../../core/data/dummy_data.dart';
import '../../../core/models/subscription_model.dart' as subscription_models;
import '../../../core/models/order_model.dart' as order_models;
import '../../menu/screens/menu_screen.dart';
import '../../subscription/screens/subscription_screen.dart';
import '../../profile/screens/profile_screen.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  List<subscription_models.Subscription> _subscriptions = [];
  List<order_models.Order> _recentOrders = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadDashboardData();
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
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final themeProvider = Provider.of<ThemeProvider>(context);
    final user = authProvider.user;

    return Scaffold(
      body: SafeArea(
        child: RefreshIndicator(
          onRefresh: _loadDashboardData,
          child: _isLoading
              ? const Center(child: CircularProgressIndicator())
              : SingleChildScrollView(
                  physics: const AlwaysScrollableScrollPhysics(),
                  padding: const EdgeInsets.all(AppConstants.defaultPadding),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Header
                      _buildHeader(user, themeProvider),
                      const SizedBox(height: 24),

                      // Quick Stats
                      _buildQuickStats(themeProvider),
                      const SizedBox(height: 24),

                      // Active Subscription
                      _buildActiveSubscription(themeProvider),
                      const SizedBox(height: 24),

                      // Today's Menu Preview
                      _buildTodaysMenuPreview(themeProvider),
                      const SizedBox(height: 24),

                      // Recent Orders
                      _buildRecentOrders(themeProvider),
                      const SizedBox(height: 24),

                      // Quick Actions
                      _buildQuickActions(themeProvider),
                    ],
                  ),
                ),
        ),
      ),
    );
  }

  Widget _buildHeader(user, ThemeProvider themeProvider) {
    return Row(
      children: [
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Welcome back,',
                style: TextStyle(
                  fontSize: 16,
                  color: themeProvider.subtitleColor,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                user?.fullName ?? 'Guest User',
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: themeProvider.textColor,
                ),
              ),
            ],
          ),
        ),
        IconButton(
          onPressed: () {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => const ProfileScreen()),
            );
          },
          icon: CircleAvatar(
            backgroundColor: themeProvider.primaryColor,
            child: Text(
              user?.fullName.substring(0, 1).toUpperCase() ?? 'G',
              style: const TextStyle(
                color: AppColors.white,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        ),
        IconButton(
          onPressed: () => themeProvider.toggleTheme(),
          icon: Icon(
            themeProvider.isDarkMode
                ? Icons.light_mode_outlined
                : Icons.dark_mode_outlined,
            color: themeProvider.subtitleColor,
          ),
        ),
      ],
    );
  }

  Widget _buildQuickStats(ThemeProvider themeProvider) {
    final activeSubscriptions = _subscriptions
        .where(
          (sub) =>
              sub.subscriptionStatus ==
              subscription_models.SubscriptionStatus.active,
        )
        .length;
    final totalOrders = _recentOrders.length;
    final todaysMenus = DummyData.getTodaysMenus().length;

    return Row(
      children: [
        Expanded(
          child: _buildStatCard(
            'Active\nSubscriptions',
            activeSubscriptions.toString(),
            Icons.subscriptions_outlined,
            AppColors.primary,
            themeProvider,
          ),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: _buildStatCard(
            'Total\nOrders',
            totalOrders.toString(),
            Icons.receipt_long_outlined,
            AppColors.secondary,
            themeProvider,
          ),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: _buildStatCard(
            'Today\'s\nMenus',
            todaysMenus.toString(),
            Icons.restaurant_menu_outlined,
            AppColors.warning,
            themeProvider,
          ),
        ),
      ],
    );
  }

  Widget _buildStatCard(
    String title,
    String value,
    IconData icon,
    Color color,
    ThemeProvider themeProvider,
  ) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: themeProvider.surfaceColor,
        borderRadius: BorderRadius.circular(AppConstants.borderRadius),
        border: Border.all(color: color.withOpacity(0.2), width: 1),
      ),
      child: Column(
        children: [
          Icon(icon, color: color, size: 24),
          const SizedBox(height: 8),
          Text(
            value,
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: themeProvider.textColor,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            title,
            style: TextStyle(fontSize: 12, color: themeProvider.subtitleColor),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildActiveSubscription(ThemeProvider themeProvider) {
    if (_subscriptions.isEmpty) {
      return _buildEmptyCard(
        'No Active Subscriptions',
        'Start a subscription to get regular meals delivered',
        Icons.subscriptions_outlined,
        themeProvider,
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => const SubscriptionScreen()),
          );
        },
      );
    }

    final subscription = _subscriptions.first;

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(Icons.subscriptions, color: AppColors.primary),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    'Active Subscription',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w600,
                      color: themeProvider.textColor,
                    ),
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 4,
                  ),
                  decoration: BoxDecoration(
                    color: AppColors.success.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    subscription.subscriptionStatusDisplayName,
                    style: const TextStyle(
                      fontSize: 12,
                      color: AppColors.success,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Text(
              subscription.vendor?.businessName ?? 'Unknown Vendor',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w500,
                color: themeProvider.textColor,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              subscription.planTypeDisplayName,
              style: TextStyle(
                fontSize: 14,
                color: themeProvider.subtitleColor,
              ),
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Meals Remaining',
                        style: TextStyle(
                          fontSize: 12,
                          color: themeProvider.subtitleColor,
                        ),
                      ),
                      Text(
                        '${subscription.remainingMeals}',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                          color: themeProvider.textColor,
                        ),
                      ),
                    ],
                  ),
                ),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Next Delivery',
                        style: TextStyle(
                          fontSize: 12,
                          color: themeProvider.subtitleColor,
                        ),
                      ),
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
          ],
        ),
      ),
    );
  }

  Widget _buildTodaysMenuPreview(ThemeProvider themeProvider) {
    final todaysMenus = DummyData.getTodaysMenus();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Expanded(
              child: Text(
                'Today\'s Menus',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w600,
                  color: themeProvider.textColor,
                ),
              ),
            ),
            TextButton(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const MenuScreen()),
                );
              },
              child: const Text('View All'),
            ),
          ],
        ),
        const SizedBox(height: 12),
        if (todaysMenus.isEmpty)
          _buildEmptyCard(
            'No Menus Available',
            'Check back later for today\'s menu options',
            Icons.restaurant_menu_outlined,
            themeProvider,
          )
        else
          SizedBox(
            height: 200,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              itemCount: todaysMenus.length,
              itemBuilder: (context, index) {
                final menu = todaysMenus[index];
                return Container(
                  width: 160,
                  margin: EdgeInsets.only(
                    right: index < todaysMenus.length - 1 ? 16 : 0,
                  ),
                  child: Card(
                    child: Padding(
                      padding: const EdgeInsets.all(12),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Container(
                            height: 80,
                            decoration: BoxDecoration(
                              color: AppColors.primary.withOpacity(0.1),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: const Center(
                              child: Icon(
                                Icons.restaurant,
                                size: 32,
                                color: AppColors.primary,
                              ),
                            ),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            menu.name,
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w600,
                              color: themeProvider.textColor,
                            ),
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                          ),
                          const SizedBox(height: 4),
                          Text(
                            menu.vendor?.businessName ?? '',
                            style: TextStyle(
                              fontSize: 12,
                              color: themeProvider.subtitleColor,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                          const Spacer(),
                          Text(
                            '₹${menu.fullDabbaPrice.toInt()}',
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                              color: AppColors.primary,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
      ],
    );
  }

  Widget _buildRecentOrders(ThemeProvider themeProvider) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Recent Orders',
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w600,
            color: themeProvider.textColor,
          ),
        ),
        const SizedBox(height: 12),
        if (_recentOrders.isEmpty)
          _buildEmptyCard(
            'No Recent Orders',
            'Your order history will appear here',
            Icons.receipt_long_outlined,
            themeProvider,
          )
        else
          ListView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: _recentOrders.take(3).length,
            itemBuilder: (context, index) {
              final order = _recentOrders[index];
              return Card(
                margin: const EdgeInsets.only(bottom: 8),
                child: ListTile(
                  leading: CircleAvatar(
                    backgroundColor: _getOrderStatusColor(
                      order.orderStatus,
                    ).withOpacity(0.1),
                    child: Icon(
                      _getOrderStatusIcon(order.orderStatus),
                      color: _getOrderStatusColor(order.orderStatus),
                    ),
                  ),
                  title: Text(
                    order.menu?.name ?? 'Unknown Menu',
                    style: TextStyle(
                      fontWeight: FontWeight.w500,
                      color: themeProvider.textColor,
                    ),
                  ),
                  subtitle: Text(
                    '${order.vendor?.businessName ?? 'Unknown Vendor'} • ${order.orderStatusDisplayName}',
                    style: TextStyle(color: themeProvider.subtitleColor),
                  ),
                  trailing: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Text(
                        '₹${order.totalAmount.toInt()}',
                        style: TextStyle(
                          fontWeight: FontWeight.w600,
                          color: themeProvider.textColor,
                        ),
                      ),
                      Text(
                        DateFormat('MMM dd').format(order.deliveryDate),
                        style: TextStyle(
                          fontSize: 12,
                          color: themeProvider.subtitleColor,
                        ),
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
      ],
    );
  }

  Widget _buildQuickActions(ThemeProvider themeProvider) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Quick Actions',
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w600,
            color: themeProvider.textColor,
          ),
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(
              child: _buildActionButton(
                'Browse Menus',
                Icons.restaurant_menu_outlined,
                AppColors.primary,
                () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => const MenuScreen()),
                  );
                },
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: _buildActionButton(
                'My Subscriptions',
                Icons.subscriptions_outlined,
                AppColors.secondary,
                () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => const SubscriptionScreen(),
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildActionButton(
    String title,
    IconData icon,
    Color color,
    VoidCallback onTap,
  ) {
    return Material(
      color: color.withOpacity(0.1),
      borderRadius: BorderRadius.circular(AppConstants.borderRadius),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(AppConstants.borderRadius),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            children: [
              Icon(icon, color: color, size: 32),
              const SizedBox(height: 8),
              Text(
                title,
                style: TextStyle(color: color, fontWeight: FontWeight.w600),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildEmptyCard(
    String title,
    String subtitle,
    IconData icon,
    ThemeProvider themeProvider, {
    VoidCallback? onTap,
  }) {
    return Card(
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(AppConstants.borderRadius),
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            children: [
              Icon(icon, size: 48, color: themeProvider.subtitleColor),
              const SizedBox(height: 12),
              Text(
                title,
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: themeProvider.textColor,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                subtitle,
                style: TextStyle(color: themeProvider.subtitleColor),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
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
