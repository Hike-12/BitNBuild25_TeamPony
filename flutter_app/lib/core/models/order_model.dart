import 'user_model.dart';
import 'vendor_model.dart';
import 'menu_model.dart';

enum OrderType { oneTime, subscription }

enum PaymentMethod { cod, upi, card, wallet }

enum PaymentStatus { pending, paid, failed, refunded }

enum OrderStatus {
  placed,
  confirmed,
  preparing,
  outForDelivery,
  delivered,
  cancelled,
}

class Order {
  final String? id;
  final User? customer;
  final Vendor? vendor;
  final Menu? menu;
  final OrderType orderType;
  final int quantity;
  final double totalAmount;
  final String deliveryAddress;
  final DateTime deliveryDate;
  final String deliveryTimeSlot;
  final String? specialInstructions;
  final PaymentMethod paymentMethod;
  final PaymentStatus paymentStatus;
  final OrderStatus orderStatus;
  final bool isActive;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  Order({
    this.id,
    this.customer,
    this.vendor,
    this.menu,
    this.orderType = OrderType.oneTime,
    this.quantity = 1,
    required this.totalAmount,
    required this.deliveryAddress,
    required this.deliveryDate,
    required this.deliveryTimeSlot,
    this.specialInstructions,
    this.paymentMethod = PaymentMethod.cod,
    this.paymentStatus = PaymentStatus.pending,
    this.orderStatus = OrderStatus.placed,
    this.isActive = true,
    this.createdAt,
    this.updatedAt,
  });

  factory Order.fromJson(Map<String, dynamic> json) {
    return Order(
      id: json['_id'] ?? json['id'],
      customer: json['customer'] != null
          ? User.fromJson(json['customer'])
          : null,
      vendor: json['vendor'] != null ? Vendor.fromJson(json['vendor']) : null,
      menu: json['menu'] != null ? Menu.fromJson(json['menu']) : null,
      orderType: _parseOrderType(json['order_type'] ?? json['orderType']),
      quantity: json['quantity'] ?? 1,
      totalAmount: (json['total_amount'] ?? json['totalAmount'] ?? 0)
          .toDouble(),
      deliveryAddress:
          json['delivery_address'] ?? json['deliveryAddress'] ?? '',
      deliveryDate: json['delivery_date'] != null
          ? DateTime.parse(json['delivery_date'])
          : DateTime.now(),
      deliveryTimeSlot:
          json['delivery_time_slot'] ?? json['deliveryTimeSlot'] ?? '',
      specialInstructions:
          json['special_instructions'] ?? json['specialInstructions'],
      paymentMethod: _parsePaymentMethod(
        json['payment_method'] ?? json['paymentMethod'],
      ),
      paymentStatus: _parsePaymentStatus(
        json['payment_status'] ?? json['paymentStatus'],
      ),
      orderStatus: _parseOrderStatus(
        json['order_status'] ?? json['orderStatus'],
      ),
      isActive: json['is_active'] ?? json['isActive'] ?? true,
      createdAt: json['createdAt'] != null
          ? DateTime.parse(json['createdAt'])
          : null,
      updatedAt: json['updatedAt'] != null
          ? DateTime.parse(json['updatedAt'])
          : null,
    );
  }

  static OrderType _parseOrderType(dynamic value) {
    switch (value?.toString()) {
      case 'subscription':
        return OrderType.subscription;
      case 'one_time':
      default:
        return OrderType.oneTime;
    }
  }

  static PaymentMethod _parsePaymentMethod(dynamic value) {
    switch (value?.toString()) {
      case 'upi':
        return PaymentMethod.upi;
      case 'card':
        return PaymentMethod.card;
      case 'wallet':
        return PaymentMethod.wallet;
      case 'cod':
      default:
        return PaymentMethod.cod;
    }
  }

  static PaymentStatus _parsePaymentStatus(dynamic value) {
    switch (value?.toString()) {
      case 'paid':
        return PaymentStatus.paid;
      case 'failed':
        return PaymentStatus.failed;
      case 'refunded':
        return PaymentStatus.refunded;
      case 'pending':
      default:
        return PaymentStatus.pending;
    }
  }

  static OrderStatus _parseOrderStatus(dynamic value) {
    switch (value?.toString()) {
      case 'confirmed':
        return OrderStatus.confirmed;
      case 'preparing':
        return OrderStatus.preparing;
      case 'out_for_delivery':
        return OrderStatus.outForDelivery;
      case 'delivered':
        return OrderStatus.delivered;
      case 'cancelled':
        return OrderStatus.cancelled;
      case 'placed':
      default:
        return OrderStatus.placed;
    }
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'customer': customer?.toJson(),
      'vendor': vendor?.toJson(),
      'menu': menu?.toJson(),
      'order_type': _orderTypeToString(orderType),
      'quantity': quantity,
      'total_amount': totalAmount,
      'delivery_address': deliveryAddress,
      'delivery_date': deliveryDate.toIso8601String(),
      'delivery_time_slot': deliveryTimeSlot,
      'special_instructions': specialInstructions,
      'payment_method': _paymentMethodToString(paymentMethod),
      'payment_status': _paymentStatusToString(paymentStatus),
      'order_status': _orderStatusToString(orderStatus),
      'is_active': isActive,
      'createdAt': createdAt?.toIso8601String(),
      'updatedAt': updatedAt?.toIso8601String(),
    };
  }

  String _orderTypeToString(OrderType type) {
    switch (type) {
      case OrderType.subscription:
        return 'subscription';
      case OrderType.oneTime:
        return 'one_time';
    }
  }

  String _paymentMethodToString(PaymentMethod method) {
    switch (method) {
      case PaymentMethod.upi:
        return 'upi';
      case PaymentMethod.card:
        return 'card';
      case PaymentMethod.wallet:
        return 'wallet';
      case PaymentMethod.cod:
        return 'cod';
    }
  }

  String _paymentStatusToString(PaymentStatus status) {
    switch (status) {
      case PaymentStatus.paid:
        return 'paid';
      case PaymentStatus.failed:
        return 'failed';
      case PaymentStatus.refunded:
        return 'refunded';
      case PaymentStatus.pending:
        return 'pending';
    }
  }

  String _orderStatusToString(OrderStatus status) {
    switch (status) {
      case OrderStatus.confirmed:
        return 'confirmed';
      case OrderStatus.preparing:
        return 'preparing';
      case OrderStatus.outForDelivery:
        return 'out_for_delivery';
      case OrderStatus.delivered:
        return 'delivered';
      case OrderStatus.cancelled:
        return 'cancelled';
      case OrderStatus.placed:
        return 'placed';
    }
  }

  String get orderTypeDisplayName {
    switch (orderType) {
      case OrderType.subscription:
        return 'Subscription Order';
      case OrderType.oneTime:
        return 'One-time Order';
    }
  }

  String get paymentStatusDisplayName {
    switch (paymentStatus) {
      case PaymentStatus.paid:
        return 'Paid';
      case PaymentStatus.failed:
        return 'Failed';
      case PaymentStatus.refunded:
        return 'Refunded';
      case PaymentStatus.pending:
        return 'Pending';
    }
  }

  String get orderStatusDisplayName {
    switch (orderStatus) {
      case OrderStatus.confirmed:
        return 'Confirmed';
      case OrderStatus.preparing:
        return 'Preparing';
      case OrderStatus.outForDelivery:
        return 'Out for Delivery';
      case OrderStatus.delivered:
        return 'Delivered';
      case OrderStatus.cancelled:
        return 'Cancelled';
      case OrderStatus.placed:
        return 'Placed';
    }
  }

  Order copyWith({
    String? id,
    User? customer,
    Vendor? vendor,
    Menu? menu,
    OrderType? orderType,
    int? quantity,
    double? totalAmount,
    String? deliveryAddress,
    DateTime? deliveryDate,
    String? deliveryTimeSlot,
    String? specialInstructions,
    PaymentMethod? paymentMethod,
    PaymentStatus? paymentStatus,
    OrderStatus? orderStatus,
    bool? isActive,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return Order(
      id: id ?? this.id,
      customer: customer ?? this.customer,
      vendor: vendor ?? this.vendor,
      menu: menu ?? this.menu,
      orderType: orderType ?? this.orderType,
      quantity: quantity ?? this.quantity,
      totalAmount: totalAmount ?? this.totalAmount,
      deliveryAddress: deliveryAddress ?? this.deliveryAddress,
      deliveryDate: deliveryDate ?? this.deliveryDate,
      deliveryTimeSlot: deliveryTimeSlot ?? this.deliveryTimeSlot,
      specialInstructions: specialInstructions ?? this.specialInstructions,
      paymentMethod: paymentMethod ?? this.paymentMethod,
      paymentStatus: paymentStatus ?? this.paymentStatus,
      orderStatus: orderStatus ?? this.orderStatus,
      isActive: isActive ?? this.isActive,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }

  @override
  String toString() {
    return 'Order(id: $id, totalAmount: $totalAmount, status: $orderStatusDisplayName)';
  }
}
