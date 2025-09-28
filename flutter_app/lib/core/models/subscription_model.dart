import 'user_model.dart';
import 'vendor_model.dart';

enum SubscriptionPlanType { weekly, monthly, custom }

enum SpiceLevel { low, medium, high }

enum SubscriptionStatus { active, paused, cancelled, completed }

enum PaymentStatus { pending, paid, partial, failed }

class MealPreferences {
  final bool isVegOnly;
  final SpiceLevel spiceLevel;
  final List<String> avoidIngredients;

  MealPreferences({
    this.isVegOnly = false,
    this.spiceLevel = SpiceLevel.medium,
    this.avoidIngredients = const [],
  });

  factory MealPreferences.fromJson(Map<String, dynamic> json) {
    return MealPreferences(
      isVegOnly: json['is_veg_only'] ?? json['isVegOnly'] ?? false,
      spiceLevel: _parseSpiceLevel(json['spice_level'] ?? json['spiceLevel']),
      avoidIngredients: json['avoid_ingredients'] != null
          ? List<String>.from(json['avoid_ingredients'])
          : const [],
    );
  }

  static SpiceLevel _parseSpiceLevel(dynamic value) {
    switch (value?.toString()) {
      case 'low':
        return SpiceLevel.low;
      case 'high':
        return SpiceLevel.high;
      case 'medium':
      default:
        return SpiceLevel.medium;
    }
  }

  Map<String, dynamic> toJson() {
    return {
      'is_veg_only': isVegOnly,
      'spice_level': _spiceLevelToString(spiceLevel),
      'avoid_ingredients': avoidIngredients,
    };
  }

  String _spiceLevelToString(SpiceLevel level) {
    switch (level) {
      case SpiceLevel.low:
        return 'low';
      case SpiceLevel.high:
        return 'high';
      case SpiceLevel.medium:
        return 'medium';
    }
  }

  String get spiceLevelDisplayName {
    switch (spiceLevel) {
      case SpiceLevel.low:
        return 'Low Spice';
      case SpiceLevel.high:
        return 'High Spice';
      case SpiceLevel.medium:
        return 'Medium Spice';
    }
  }
}

class Subscription {
  final String? id;
  final User? customer;
  final Vendor? vendor;
  final SubscriptionPlanType planType;
  final MealPreferences mealPreferences;
  final String deliveryAddress;
  final String deliveryTimeSlot;
  final List<String> deliveryDays;
  final DateTime startDate;
  final DateTime endDate;
  final double pricePerMeal;
  final int totalMeals;
  final double totalAmount;
  final int mealsDelivered;
  final PaymentStatus paymentStatus;
  final SubscriptionStatus subscriptionStatus;
  final bool autoRenewal;
  final String? specialInstructions;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  Subscription({
    this.id,
    this.customer,
    this.vendor,
    required this.planType,
    required this.mealPreferences,
    required this.deliveryAddress,
    required this.deliveryTimeSlot,
    required this.deliveryDays,
    required this.startDate,
    required this.endDate,
    required this.pricePerMeal,
    required this.totalMeals,
    required this.totalAmount,
    this.mealsDelivered = 0,
    this.paymentStatus = PaymentStatus.pending,
    this.subscriptionStatus = SubscriptionStatus.active,
    this.autoRenewal = false,
    this.specialInstructions,
    this.createdAt,
    this.updatedAt,
  });

  factory Subscription.fromJson(Map<String, dynamic> json) {
    return Subscription(
      id: json['_id'] ?? json['id'],
      customer: json['customer'] != null
          ? User.fromJson(json['customer'])
          : null,
      vendor: json['vendor'] != null ? Vendor.fromJson(json['vendor']) : null,
      planType: _parsePlanType(json['plan_type'] ?? json['planType']),
      mealPreferences: json['meal_preferences'] != null
          ? MealPreferences.fromJson(json['meal_preferences'])
          : MealPreferences(),
      deliveryAddress:
          json['delivery_address'] ?? json['deliveryAddress'] ?? '',
      deliveryTimeSlot:
          json['delivery_time_slot'] ?? json['deliveryTimeSlot'] ?? '',
      deliveryDays: json['delivery_days'] != null
          ? List<String>.from(json['delivery_days'])
          : [],
      startDate: json['start_date'] != null
          ? DateTime.parse(json['start_date'])
          : DateTime.now(),
      endDate: json['end_date'] != null
          ? DateTime.parse(json['end_date'])
          : DateTime.now().add(const Duration(days: 30)),
      pricePerMeal: (json['price_per_meal'] ?? json['pricePerMeal'] ?? 0)
          .toDouble(),
      totalMeals: json['total_meals'] ?? json['totalMeals'] ?? 0,
      totalAmount: (json['total_amount'] ?? json['totalAmount'] ?? 0)
          .toDouble(),
      mealsDelivered: json['meals_delivered'] ?? json['mealsDelivered'] ?? 0,
      paymentStatus: _parsePaymentStatus(
        json['payment_status'] ?? json['paymentStatus'],
      ),
      subscriptionStatus: _parseSubscriptionStatus(
        json['subscription_status'] ?? json['subscriptionStatus'],
      ),
      autoRenewal: json['auto_renewal'] ?? json['autoRenewal'] ?? false,
      specialInstructions:
          json['special_instructions'] ?? json['specialInstructions'],
      createdAt: json['createdAt'] != null
          ? DateTime.parse(json['createdAt'])
          : null,
      updatedAt: json['updatedAt'] != null
          ? DateTime.parse(json['updatedAt'])
          : null,
    );
  }

  static SubscriptionPlanType _parsePlanType(dynamic value) {
    switch (value?.toString()) {
      case 'weekly':
        return SubscriptionPlanType.weekly;
      case 'monthly':
        return SubscriptionPlanType.monthly;
      case 'custom':
        return SubscriptionPlanType.custom;
      default:
        return SubscriptionPlanType.weekly;
    }
  }

  static PaymentStatus _parsePaymentStatus(dynamic value) {
    switch (value?.toString()) {
      case 'paid':
        return PaymentStatus.paid;
      case 'partial':
        return PaymentStatus.partial;
      case 'failed':
        return PaymentStatus.failed;
      case 'pending':
      default:
        return PaymentStatus.pending;
    }
  }

  static SubscriptionStatus _parseSubscriptionStatus(dynamic value) {
    switch (value?.toString()) {
      case 'paused':
        return SubscriptionStatus.paused;
      case 'cancelled':
        return SubscriptionStatus.cancelled;
      case 'completed':
        return SubscriptionStatus.completed;
      case 'active':
      default:
        return SubscriptionStatus.active;
    }
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'customer': customer?.toJson(),
      'vendor': vendor?.toJson(),
      'plan_type': _planTypeToString(planType),
      'meal_preferences': mealPreferences.toJson(),
      'delivery_address': deliveryAddress,
      'delivery_time_slot': deliveryTimeSlot,
      'delivery_days': deliveryDays,
      'start_date': startDate.toIso8601String(),
      'end_date': endDate.toIso8601String(),
      'price_per_meal': pricePerMeal,
      'total_meals': totalMeals,
      'total_amount': totalAmount,
      'meals_delivered': mealsDelivered,
      'payment_status': _paymentStatusToString(paymentStatus),
      'subscription_status': _subscriptionStatusToString(subscriptionStatus),
      'auto_renewal': autoRenewal,
      'special_instructions': specialInstructions,
      'createdAt': createdAt?.toIso8601String(),
      'updatedAt': updatedAt?.toIso8601String(),
    };
  }

  String _planTypeToString(SubscriptionPlanType type) {
    switch (type) {
      case SubscriptionPlanType.weekly:
        return 'weekly';
      case SubscriptionPlanType.monthly:
        return 'monthly';
      case SubscriptionPlanType.custom:
        return 'custom';
    }
  }

  String _paymentStatusToString(PaymentStatus status) {
    switch (status) {
      case PaymentStatus.paid:
        return 'paid';
      case PaymentStatus.partial:
        return 'partial';
      case PaymentStatus.failed:
        return 'failed';
      case PaymentStatus.pending:
        return 'pending';
    }
  }

  String _subscriptionStatusToString(SubscriptionStatus status) {
    switch (status) {
      case SubscriptionStatus.paused:
        return 'paused';
      case SubscriptionStatus.cancelled:
        return 'cancelled';
      case SubscriptionStatus.completed:
        return 'completed';
      case SubscriptionStatus.active:
        return 'active';
    }
  }

  String get planTypeDisplayName {
    switch (planType) {
      case SubscriptionPlanType.weekly:
        return 'Weekly Plan';
      case SubscriptionPlanType.monthly:
        return 'Monthly Plan';
      case SubscriptionPlanType.custom:
        return 'Custom Plan';
    }
  }

  String get paymentStatusDisplayName {
    switch (paymentStatus) {
      case PaymentStatus.paid:
        return 'Paid';
      case PaymentStatus.partial:
        return 'Partial';
      case PaymentStatus.failed:
        return 'Failed';
      case PaymentStatus.pending:
        return 'Pending';
    }
  }

  String get subscriptionStatusDisplayName {
    switch (subscriptionStatus) {
      case SubscriptionStatus.paused:
        return 'Paused';
      case SubscriptionStatus.cancelled:
        return 'Cancelled';
      case SubscriptionStatus.completed:
        return 'Completed';
      case SubscriptionStatus.active:
        return 'Active';
    }
  }

  int get remainingMeals => totalMeals - mealsDelivered;

  double get remainingAmount => (remainingMeals * pricePerMeal);

  bool get isActive => subscriptionStatus == SubscriptionStatus.active;

  bool get canPause => subscriptionStatus == SubscriptionStatus.active;

  bool get canResume => subscriptionStatus == SubscriptionStatus.paused;

  Subscription copyWith({
    String? id,
    User? customer,
    Vendor? vendor,
    SubscriptionPlanType? planType,
    MealPreferences? mealPreferences,
    String? deliveryAddress,
    String? deliveryTimeSlot,
    List<String>? deliveryDays,
    DateTime? startDate,
    DateTime? endDate,
    double? pricePerMeal,
    int? totalMeals,
    double? totalAmount,
    int? mealsDelivered,
    PaymentStatus? paymentStatus,
    SubscriptionStatus? subscriptionStatus,
    bool? autoRenewal,
    String? specialInstructions,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return Subscription(
      id: id ?? this.id,
      customer: customer ?? this.customer,
      vendor: vendor ?? this.vendor,
      planType: planType ?? this.planType,
      mealPreferences: mealPreferences ?? this.mealPreferences,
      deliveryAddress: deliveryAddress ?? this.deliveryAddress,
      deliveryTimeSlot: deliveryTimeSlot ?? this.deliveryTimeSlot,
      deliveryDays: deliveryDays ?? this.deliveryDays,
      startDate: startDate ?? this.startDate,
      endDate: endDate ?? this.endDate,
      pricePerMeal: pricePerMeal ?? this.pricePerMeal,
      totalMeals: totalMeals ?? this.totalMeals,
      totalAmount: totalAmount ?? this.totalAmount,
      mealsDelivered: mealsDelivered ?? this.mealsDelivered,
      paymentStatus: paymentStatus ?? this.paymentStatus,
      subscriptionStatus: subscriptionStatus ?? this.subscriptionStatus,
      autoRenewal: autoRenewal ?? this.autoRenewal,
      specialInstructions: specialInstructions ?? this.specialInstructions,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }

  @override
  String toString() {
    return 'Subscription(id: $id, planType: $planTypeDisplayName, totalAmount: $totalAmount, status: $subscriptionStatusDisplayName)';
  }
}
