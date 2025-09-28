import '../models/user_model.dart';
import '../models/vendor_model.dart';
import '../models/menu_model.dart';
import '../models/order_model.dart' as order_models;
import '../models/subscription_model.dart' as subscription_models;

class DummyData {
  // Sample Users
  static final List<User> users = [
    User(
      id: '1',
      username: 'john_doe',
      email: 'john@example.com',
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '+91-9876543210',
      address: '123 Main Street, Pune, Maharashtra',
      createdAt: DateTime.now().subtract(const Duration(days: 30)),
    ),
    User(
      id: '2',
      username: 'jane_smith',
      email: 'jane@example.com',
      firstName: 'Jane',
      lastName: 'Smith',
      phoneNumber: '+91-9876543211',
      address: '456 Oak Avenue, Mumbai, Maharashtra',
      createdAt: DateTime.now().subtract(const Duration(days: 20)),
    ),
  ];

  // Sample Vendors
  static final List<Vendor> vendors = [
    Vendor(
      id: 'v1',
      businessName: 'Maharashtrian Delights',
      address: '789 Food Street, Pune, Maharashtra',
      phoneNumber: '+91-9876543300',
      email: 'maharashtrian@delights.com',
      description:
          'Authentic Maharashtrian home-style cooking with traditional flavors',
      rating: 4.5,
      cuisineTypes: ['Maharashtrian', 'Vegetarian', 'Traditional'],
      isActive: true,
      createdAt: DateTime.now().subtract(const Duration(days: 60)),
    ),
    Vendor(
      id: 'v2',
      businessName: 'Punjabi Tadka',
      address: '321 Spice Lane, Mumbai, Maharashtra',
      phoneNumber: '+91-9876543301',
      email: 'punjabi@tadka.com',
      description: 'Rich and flavorful Punjabi cuisine with authentic spices',
      rating: 4.7,
      cuisineTypes: ['Punjabi', 'North Indian', 'Vegetarian'],
      isActive: true,
      createdAt: DateTime.now().subtract(const Duration(days: 45)),
    ),
    Vendor(
      id: 'v3',
      businessName: 'South Indian Express',
      address: '654 Temple Road, Bangalore, Karnataka',
      phoneNumber: '+91-9876543302',
      email: 'south@express.com',
      description:
          'Traditional South Indian meals with sambhar, rasam and fresh chutneys',
      rating: 4.3,
      cuisineTypes: ['South Indian', 'Vegetarian', 'Traditional'],
      isActive: true,
      createdAt: DateTime.now().subtract(const Duration(days: 35)),
    ),
  ];

  // Sample Menu Items
  static final List<MenuItem> mainItems = [
    MenuItem(
      id: 'm1',
      name: 'Dal Tadka',
      price: 80.0,
      category: 'Main Course',
      isVegetarian: true,
      description: 'Yellow lentils cooked with spices and tempered with cumin',
    ),
    MenuItem(
      id: 'm2',
      name: 'Paneer Butter Masala',
      price: 120.0,
      category: 'Main Course',
      isVegetarian: true,
      description: 'Cottage cheese in rich tomato and butter gravy',
    ),
    MenuItem(
      id: 'm3',
      name: 'Aloo Gobi',
      price: 90.0,
      category: 'Main Course',
      isVegetarian: true,
      description: 'Potatoes and cauliflower cooked with Indian spices',
    ),
    MenuItem(
      id: 'm4',
      name: 'Bhindi Masala',
      price: 85.0,
      category: 'Main Course',
      isVegetarian: true,
      description: 'Okra cooked with onions, tomatoes and spices',
    ),
  ];

  static final List<MenuItem> sideItems = [
    MenuItem(
      id: 's1',
      name: 'Jeera Rice',
      price: 60.0,
      category: 'Rice',
      isVegetarian: true,
      description: 'Basmati rice cooked with cumin seeds',
    ),
    MenuItem(
      id: 's2',
      name: 'Roti (2 pieces)',
      price: 40.0,
      category: 'Bread',
      isVegetarian: true,
      description: 'Fresh wheat flatbreads',
    ),
    MenuItem(
      id: 's3',
      name: 'Pickle & Papad',
      price: 20.0,
      category: 'Accompaniments',
      isVegetarian: true,
      description: 'Traditional Indian pickle and crispy papad',
    ),
    MenuItem(
      id: 's4',
      name: 'Raita',
      price: 30.0,
      category: 'Accompaniments',
      isVegetarian: true,
      description: 'Fresh yogurt with cucumber and spices',
    ),
  ];

  static final List<MenuItem> extras = [
    MenuItem(
      id: 'e1',
      name: 'Gulab Jamun (2 pieces)',
      price: 50.0,
      category: 'Dessert',
      isVegetarian: true,
      description: 'Sweet milk dumplings in sugar syrup',
    ),
    MenuItem(
      id: 'e2',
      name: 'Masala Chai',
      price: 25.0,
      category: 'Beverage',
      isVegetarian: true,
      description: 'Traditional Indian spiced tea',
    ),
    MenuItem(
      id: 'e3',
      name: 'Lassi',
      price: 40.0,
      category: 'Beverage',
      isVegetarian: true,
      description: 'Sweet yogurt drink',
    ),
  ];

  // Sample Menus
  static final List<Menu> menus = [
    Menu(
      id: 'menu1',
      vendor: vendors[0],
      name: 'Traditional Maharashtrian Thali',
      date: DateTime.now(),
      imageUrl: 'https://example.com/images/maharashtrian-thali.jpg',
      mainItems: [mainItems[0], mainItems[2]],
      sideItems: [sideItems[0], sideItems[1], sideItems[3]],
      extras: [extras[0], extras[1]],
      isVegOnly: true,
      fullDabbaPrice: 180.0,
      maxDabbas: 50,
      dabbasSold: 12,
      todaysSpecial: 'Fresh Puran Poli with the meal!',
      cookingStyle: 'Traditional home-style cooking with minimal oil',
      isActive: true,
      createdAt: DateTime.now().subtract(const Duration(hours: 2)),
    ),
    Menu(
      id: 'menu2',
      vendor: vendors[1],
      name: 'Punjabi Power Meal',
      date: DateTime.now(),
      imageUrl: 'https://example.com/images/punjabi-thali.jpg',
      mainItems: [mainItems[1], mainItems[3]],
      sideItems: [sideItems[0], sideItems[1], sideItems[2]],
      extras: [extras[0], extras[2]],
      isVegOnly: true,
      fullDabbaPrice: 220.0,
      maxDabbas: 40,
      dabbasSold: 8,
      todaysSpecial: 'Extra butter naan with every order!',
      cookingStyle: 'Rich and creamy preparation with authentic spices',
      isActive: true,
      createdAt: DateTime.now().subtract(const Duration(hours: 1)),
    ),
    Menu(
      id: 'menu3',
      vendor: vendors[2],
      name: 'South Indian Combo',
      date: DateTime.now(),
      imageUrl: 'https://example.com/images/south-indian-meal.jpg',
      mainItems: [
        MenuItem(
          id: 'm5',
          name: 'Sambar',
          price: 70.0,
          category: 'Main Course',
          isVegetarian: true,
          description: 'Lentil curry with vegetables and tamarind',
        ),
        MenuItem(
          id: 'm6',
          name: 'Rasam',
          price: 60.0,
          category: 'Main Course',
          isVegetarian: true,
          description: 'Tangy tamarind soup with spices',
        ),
      ],
      sideItems: [
        MenuItem(
          id: 's5',
          name: 'Steamed Rice',
          price: 50.0,
          category: 'Rice',
          isVegetarian: true,
          description: 'Plain steamed basmati rice',
        ),
        MenuItem(
          id: 's6',
          name: 'Coconut Chutney',
          price: 25.0,
          category: 'Accompaniments',
          isVegetarian: true,
          description: 'Fresh coconut chutney with curry leaves',
        ),
      ],
      extras: [
        MenuItem(
          id: 'e4',
          name: 'Payasam',
          price: 45.0,
          category: 'Dessert',
          isVegetarian: true,
          description: 'Traditional South Indian sweet pudding',
        ),
      ],
      isVegOnly: true,
      fullDabbaPrice: 160.0,
      maxDabbas: 35,
      dabbasSold: 15,
      todaysSpecial: 'Complimentary appalam (papad) with every meal',
      cookingStyle: 'Traditional South Indian preparation with coconut oil',
      isActive: true,
      createdAt: DateTime.now().subtract(const Duration(minutes: 30)),
    ),
  ];

  // Sample Orders
  static final List<order_models.Order> orders = [
    order_models.Order(
      id: 'order1',
      customer: users[0],
      vendor: vendors[0],
      menu: menus[0],
      orderType: order_models.OrderType.oneTime,
      quantity: 2,
      totalAmount: 360.0,
      deliveryAddress: users[0].address!,
      deliveryDate: DateTime.now().add(const Duration(hours: 2)),
      deliveryTimeSlot: '12:00-13:00',
      specialInstructions: 'Please make it less spicy',
      paymentMethod: order_models.PaymentMethod.upi,
      paymentStatus: order_models.PaymentStatus.paid,
      orderStatus: order_models.OrderStatus.confirmed,
      isActive: true,
      createdAt: DateTime.now().subtract(const Duration(hours: 1)),
    ),
    order_models.Order(
      id: 'order2',
      customer: users[1],
      vendor: vendors[1],
      menu: menus[1],
      orderType: order_models.OrderType.oneTime,
      quantity: 1,
      totalAmount: 220.0,
      deliveryAddress: users[1].address!,
      deliveryDate: DateTime.now().add(const Duration(hours: 1)),
      deliveryTimeSlot: '13:00-14:00',
      paymentMethod: order_models.PaymentMethod.cod,
      paymentStatus: order_models.PaymentStatus.pending,
      orderStatus: order_models.OrderStatus.preparing,
      isActive: true,
      createdAt: DateTime.now().subtract(const Duration(minutes: 30)),
    ),
  ];

  // Sample Subscriptions
  static final List<subscription_models.Subscription> subscriptions = [
    subscription_models.Subscription(
      id: 'sub1',
      customer: users[0],
      vendor: vendors[0],
      planType: subscription_models.SubscriptionPlanType.weekly,
      mealPreferences: subscription_models.MealPreferences(
        isVegOnly: true,
        spiceLevel: subscription_models.SpiceLevel.medium,
        avoidIngredients: ['peanuts', 'dairy'],
      ),
      deliveryAddress: users[0].address!,
      deliveryTimeSlot: '12:00-13:00',
      deliveryDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      startDate: DateTime.now(),
      endDate: DateTime.now().add(const Duration(days: 7)),
      pricePerMeal: 180.0,
      totalMeals: 5,
      totalAmount: 900.0,
      mealsDelivered: 2,
      paymentStatus: subscription_models.PaymentStatus.paid,
      subscriptionStatus: subscription_models.SubscriptionStatus.active,
      autoRenewal: true,
      specialInstructions:
          'Please deliver between 12-1 PM. Ring the bell twice.',
      createdAt: DateTime.now().subtract(const Duration(days: 2)),
    ),
    subscription_models.Subscription(
      id: 'sub2',
      customer: users[1],
      vendor: vendors[1],
      planType: subscription_models.SubscriptionPlanType.monthly,
      mealPreferences: subscription_models.MealPreferences(
        isVegOnly: true,
        spiceLevel: subscription_models.SpiceLevel.low,
        avoidIngredients: ['onions', 'garlic'],
      ),
      deliveryAddress: users[1].address!,
      deliveryTimeSlot: '19:00-20:00',
      deliveryDays: ['monday', 'wednesday', 'friday'],
      startDate: DateTime.now().subtract(const Duration(days: 5)),
      endDate: DateTime.now().add(const Duration(days: 25)),
      pricePerMeal: 220.0,
      totalMeals: 12,
      totalAmount: 2640.0,
      mealsDelivered: 1,
      paymentStatus: subscription_models.PaymentStatus.paid,
      subscriptionStatus: subscription_models.SubscriptionStatus.active,
      autoRenewal: false,
      specialInstructions: 'Jain food - no root vegetables please',
      createdAt: DateTime.now().subtract(const Duration(days: 5)),
    ),
  ];

  // API Response Formats
  static Map<String, dynamic> loginSuccessResponse = {
    'success': true,
    'token': 'dummy_jwt_token_12345',
    'user': users[0].toJson(),
  };

  static Map<String, dynamic> loginFailureResponse = {
    'success': false,
    'error': 'Invalid credentials',
  };

  static Map<String, dynamic> registerSuccessResponse = {
    'success': true,
    'token': 'dummy_jwt_token_67890',
    'user': users[1].toJson(),
  };

  static Map<String, dynamic> menusSuccessResponse = {
    'success': true,
    'menus': menus.map((menu) => menu.toJson()).toList(),
  };

  static Map<String, dynamic> ordersSuccessResponse = {
    'success': true,
    'orders': orders.map((order) => order.toJson()).toList(),
  };

  static Map<String, dynamic> subscriptionsSuccessResponse = {
    'success': true,
    'subscriptions': subscriptions
        .map((subscription) => subscription.toJson())
        .toList(),
  };

  static Map<String, dynamic> createOrderSuccessResponse = {
    'success': true,
    'message': 'Order placed successfully',
    'order': orders[0].toJson(),
  };

  static Map<String, dynamic> createSubscriptionSuccessResponse = {
    'success': true,
    'message': 'Subscription created successfully',
    'subscription': subscriptions[0].toJson(),
  };

  // Helper method to get current user
  static User getCurrentUser() => users[0];

  // Helper method to get active subscriptions for current user
  static List<subscription_models.Subscription> getActiveSubscriptions() {
    return subscriptions
        .where(
          (sub) =>
              sub.subscriptionStatus ==
              subscription_models.SubscriptionStatus.active,
        )
        .toList();
  }

  // Helper method to get recent orders for current user
  static List<order_models.Order> getRecentOrders() {
    return orders
        .where((order) => order.customer?.id == getCurrentUser().id)
        .toList();
  }

  // Helper method to get today's menus
  static List<Menu> getTodaysMenus() {
    final today = DateTime.now();
    return menus
        .where(
          (menu) =>
              menu.date.year == today.year &&
              menu.date.month == today.month &&
              menu.date.day == today.day &&
              menu.isActive,
        )
        .toList();
  }
}
