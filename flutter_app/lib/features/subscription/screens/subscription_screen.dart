import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../../../shared/providers/theme_provider.dart';
import '../../../core/constants/app_constants.dart';
import '../../../shared/theme/app_colors.dart';
import '../../../core/data/dummy_data.dart';
import '../../../core/models/subscription_model.dart' as subscription_models;

class SubscriptionScreen extends StatefulWidget {
  const SubscriptionScreen({super.key});

  @override
  State<SubscriptionScreen> createState() => _SubscriptionScreenState();
}

class _SubscriptionScreenState extends State<SubscriptionScreen> {
  List<subscription_models.Subscription> _subscriptions = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadSubscriptions();
  }

  Future<void> _loadSubscriptions() async {
    setState(() {
      _isLoading = true;
    });

    // Simulate API delay
    await Future.delayed(const Duration(milliseconds: 500));

    // Load subscriptions (using fallback data for now)
    _subscriptions = DummyData.subscriptions;

    setState(() {
      _isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    final themeProvider = Provider.of<ThemeProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('My Subscriptions'),
        actions: [
          IconButton(
            onPressed: _loadSubscriptions,
            icon: const Icon(Icons.refresh),
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _subscriptions.isEmpty
          ? _buildEmptyState(themeProvider)
          : RefreshIndicator(
              onRefresh: _loadSubscriptions,
              child: ListView.builder(
                padding: const EdgeInsets.all(AppConstants.defaultPadding),
                itemCount: _subscriptions.length,
                itemBuilder: (context, index) {
                  final subscription = _subscriptions[index];
                  return _buildSubscriptionCard(subscription, themeProvider);
                },
              ),
            ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _showCreateSubscriptionDialog(),
        child: const Icon(Icons.add),
      ),
    );
  }

  Widget _buildSubscriptionCard(
    subscription_models.Subscription subscription,
    ThemeProvider themeProvider,
  ) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header
            Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        subscription.vendor?.businessName ?? 'Unknown Vendor',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w600,
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
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 4,
                  ),
                  decoration: BoxDecoration(
                    color: _getStatusColor(
                      subscription.subscriptionStatus,
                    ).withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    subscription.subscriptionStatusDisplayName,
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w500,
                      color: _getStatusColor(subscription.subscriptionStatus),
                    ),
                  ),
                ),
              ],
            ),

            const SizedBox(height: 12),

            // Progress Bar
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Meals Progress',
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w500,
                        color: themeProvider.textColor,
                      ),
                    ),
                    Text(
                      '${subscription.mealsDelivered}/${subscription.totalMeals}',
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w500,
                        color: themeProvider.textColor,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                LinearProgressIndicator(
                  value: subscription.totalMeals > 0
                      ? subscription.mealsDelivered / subscription.totalMeals
                      : 0,
                  backgroundColor: themeProvider.subtitleColor.withOpacity(0.2),
                  valueColor: AlwaysStoppedAnimation<Color>(
                    _getStatusColor(subscription.subscriptionStatus),
                  ),
                ),
              ],
            ),

            const SizedBox(height: 16),

            // Details Grid
            Row(
              children: [
                Expanded(
                  child: _buildDetailItem(
                    'Price per Meal',
                    '₹${subscription.pricePerMeal.toInt()}',
                    themeProvider,
                  ),
                ),
                Expanded(
                  child: _buildDetailItem(
                    'Remaining',
                    '${subscription.remainingMeals} meals',
                    themeProvider,
                  ),
                ),
              ],
            ),

            const SizedBox(height: 12),

            Row(
              children: [
                Expanded(
                  child: _buildDetailItem(
                    'Start Date',
                    DateFormat('MMM dd, yyyy').format(subscription.startDate),
                    themeProvider,
                  ),
                ),
                Expanded(
                  child: _buildDetailItem(
                    'End Date',
                    DateFormat('MMM dd, yyyy').format(subscription.endDate),
                    themeProvider,
                  ),
                ),
              ],
            ),

            const SizedBox(height: 12),

            // Delivery Info
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: themeProvider.surfaceColor.withOpacity(0.5),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Delivery Details',
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                      color: themeProvider.textColor,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Time: ${subscription.deliveryTimeSlot}',
                    style: TextStyle(
                      fontSize: 12,
                      color: themeProvider.subtitleColor,
                    ),
                  ),
                  Text(
                    'Days: ${subscription.deliveryDays.join(', ')}',
                    style: TextStyle(
                      fontSize: 12,
                      color: themeProvider.subtitleColor,
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 16),

            // Action Buttons
            Row(
              children: [
                if (subscription.canPause)
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () => _pauseSubscription(subscription),
                      child: const Text('Pause'),
                    ),
                  ),
                if (subscription.canResume)
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () => _resumeSubscription(subscription),
                      child: const Text('Resume'),
                    ),
                  ),
                if (subscription.canPause && subscription.canResume)
                  const SizedBox(width: 12),
                Expanded(
                  child: ElevatedButton(
                    onPressed: () => _showSubscriptionDetails(subscription),
                    child: const Text('View Details'),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDetailItem(
    String label,
    String value,
    ThemeProvider themeProvider,
  ) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: TextStyle(fontSize: 12, color: themeProvider.subtitleColor),
        ),
        const SizedBox(height: 2),
        Text(
          value,
          style: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w500,
            color: themeProvider.textColor,
          ),
        ),
      ],
    );
  }

  Widget _buildEmptyState(ThemeProvider themeProvider) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.subscriptions_outlined,
            size: 64,
            color: themeProvider.subtitleColor,
          ),
          const SizedBox(height: 16),
          Text(
            'No Subscriptions Yet',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w600,
              color: themeProvider.textColor,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Create your first subscription to get regular meals',
            style: TextStyle(color: themeProvider.subtitleColor),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 24),
          ElevatedButton(
            onPressed: () => _showCreateSubscriptionDialog(),
            child: const Text('Create Subscription'),
          ),
        ],
      ),
    );
  }

  Color _getStatusColor(subscription_models.SubscriptionStatus status) {
    switch (status) {
      case subscription_models.SubscriptionStatus.active:
        return AppColors.success;
      case subscription_models.SubscriptionStatus.paused:
        return AppColors.warning;
      case subscription_models.SubscriptionStatus.cancelled:
        return AppColors.error;
      case subscription_models.SubscriptionStatus.completed:
        return AppColors.info;
    }
  }

  void _pauseSubscription(subscription_models.Subscription subscription) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Pause Subscription'),
        content: Text(
          'Are you sure you want to pause your subscription with ${subscription.vendor?.businessName}?',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Subscription paused successfully!'),
                  backgroundColor: AppColors.success,
                ),
              );
              // Here you would call the API to pause the subscription
            },
            child: const Text('Pause'),
          ),
        ],
      ),
    );
  }

  void _resumeSubscription(subscription_models.Subscription subscription) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Resume Subscription'),
        content: Text(
          'Resume your subscription with ${subscription.vendor?.businessName}?',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Subscription resumed successfully!'),
                  backgroundColor: AppColors.success,
                ),
              );
              // Here you would call the API to resume the subscription
            },
            child: const Text('Resume'),
          ),
        ],
      ),
    );
  }

  void _showSubscriptionDetails(subscription_models.Subscription subscription) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('${subscription.vendor?.businessName}'),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Plan: ${subscription.planTypeDisplayName}'),
              Text('Status: ${subscription.subscriptionStatusDisplayName}'),
              Text('Total Amount: ₹${subscription.totalAmount.toInt()}'),
              Text('Price per Meal: ₹${subscription.pricePerMeal.toInt()}'),
              Text('Total Meals: ${subscription.totalMeals}'),
              Text('Delivered: ${subscription.mealsDelivered}'),
              Text('Remaining: ${subscription.remainingMeals}'),
              const SizedBox(height: 8),
              const Text(
                'Meal Preferences:',
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
              Text(
                'Veg Only: ${subscription.mealPreferences.isVegOnly ? "Yes" : "No"}',
              ),
              Text(
                'Spice Level: ${subscription.mealPreferences.spiceLevelDisplayName}',
              ),
              if (subscription.mealPreferences.avoidIngredients.isNotEmpty)
                Text(
                  'Avoid: ${subscription.mealPreferences.avoidIngredients.join(", ")}',
                ),
              if (subscription.specialInstructions?.isNotEmpty == true) ...[
                const SizedBox(height: 8),
                const Text(
                  'Special Instructions:',
                  style: TextStyle(fontWeight: FontWeight.bold),
                ),
                Text(subscription.specialInstructions!),
              ],
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Close'),
          ),
        ],
      ),
    );
  }

  void _showCreateSubscriptionDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Create Subscription'),
        content: const Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text('Subscription creation feature is coming soon!'),
            SizedBox(height: 8),
            Text('For now, you can browse menus and place individual orders.'),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Demo subscription created!'),
                  backgroundColor: AppColors.success,
                ),
              );
            },
            child: const Text('Demo Create'),
          ),
        ],
      ),
    );
  }
}
