import 'vendor_model.dart';

class MenuItem {
  final String? id;
  final String name;
  final double price;
  final String? category;
  final bool isVegetarian;
  final String? description;
  final String? imageUrl;

  MenuItem({
    this.id,
    required this.name,
    required this.price,
    this.category,
    this.isVegetarian = true,
    this.description,
    this.imageUrl,
  });

  factory MenuItem.fromJson(Map<String, dynamic> json) {
    return MenuItem(
      id: json['_id'] ?? json['id'],
      name: json['name'] ?? '',
      price: (json['price'] ?? 0).toDouble(),
      category: json['category'],
      isVegetarian: json['is_vegetarian'] ?? json['isVegetarian'] ?? true,
      description: json['description'],
      imageUrl: json['image_url'] ?? json['imageUrl'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'price': price,
      'category': category,
      'is_vegetarian': isVegetarian,
      'description': description,
      'image_url': imageUrl,
    };
  }
}

class Menu {
  final String? id;
  final Vendor? vendor;
  final String name;
  final DateTime date;
  final String? imageUrl;
  final List<MenuItem> mainItems;
  final List<MenuItem> sideItems;
  final List<MenuItem> extras;
  final bool isVegOnly;
  final double fullDabbaPrice;
  final int maxDabbas;
  final int dabbasSold;
  final String? todaysSpecial;
  final String? cookingStyle;
  final bool isActive;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  Menu({
    this.id,
    this.vendor,
    required this.name,
    required this.date,
    this.imageUrl,
    this.mainItems = const [],
    this.sideItems = const [],
    this.extras = const [],
    this.isVegOnly = true,
    required this.fullDabbaPrice,
    this.maxDabbas = 30,
    this.dabbasSold = 0,
    this.todaysSpecial,
    this.cookingStyle,
    this.isActive = true,
    this.createdAt,
    this.updatedAt,
  });

  factory Menu.fromJson(Map<String, dynamic> json) {
    return Menu(
      id: json['_id'] ?? json['id'],
      vendor: json['vendor'] != null ? Vendor.fromJson(json['vendor']) : null,
      name: json['name'] ?? '',
      date: json['date'] != null
          ? DateTime.parse(json['date'])
          : DateTime.now(),
      imageUrl: json['image'] ?? json['imageUrl'],
      mainItems: json['main_items'] != null
          ? (json['main_items'] as List)
                .map((item) => MenuItem.fromJson(item))
                .toList()
          : [],
      sideItems: json['side_items'] != null
          ? (json['side_items'] as List)
                .map((item) => MenuItem.fromJson(item))
                .toList()
          : [],
      extras: json['extras'] != null
          ? (json['extras'] as List)
                .map((item) => MenuItem.fromJson(item))
                .toList()
          : [],
      isVegOnly: json['is_veg_only'] ?? json['isVegOnly'] ?? true,
      fullDabbaPrice: (json['full_dabba_price'] ?? json['fullDabbaPrice'] ?? 0)
          .toDouble(),
      maxDabbas: json['max_dabbas'] ?? json['maxDabbas'] ?? 30,
      dabbasSold: json['dabbas_sold'] ?? json['dabbasSold'] ?? 0,
      todaysSpecial: json['todays_special'] ?? json['todaysSpecial'],
      cookingStyle: json['cooking_style'] ?? json['cookingStyle'],
      isActive: json['is_active'] ?? json['isActive'] ?? true,
      createdAt: json['createdAt'] != null
          ? DateTime.parse(json['createdAt'])
          : null,
      updatedAt: json['updatedAt'] != null
          ? DateTime.parse(json['updatedAt'])
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'vendor': vendor?.toJson(),
      'name': name,
      'date': date.toIso8601String(),
      'image': imageUrl,
      'main_items': mainItems.map((item) => item.toJson()).toList(),
      'side_items': sideItems.map((item) => item.toJson()).toList(),
      'extras': extras.map((item) => item.toJson()).toList(),
      'is_veg_only': isVegOnly,
      'full_dabba_price': fullDabbaPrice,
      'max_dabbas': maxDabbas,
      'dabbas_sold': dabbasSold,
      'todays_special': todaysSpecial,
      'cooking_style': cookingStyle,
      'is_active': isActive,
      'createdAt': createdAt?.toIso8601String(),
      'updatedAt': updatedAt?.toIso8601String(),
    };
  }

  int get availableDabbas => maxDabbas - dabbasSold;

  bool get isAvailable => isActive && availableDabbas > 0;

  Menu copyWith({
    String? id,
    Vendor? vendor,
    String? name,
    DateTime? date,
    String? imageUrl,
    List<MenuItem>? mainItems,
    List<MenuItem>? sideItems,
    List<MenuItem>? extras,
    bool? isVegOnly,
    double? fullDabbaPrice,
    int? maxDabbas,
    int? dabbasSold,
    String? todaysSpecial,
    String? cookingStyle,
    bool? isActive,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return Menu(
      id: id ?? this.id,
      vendor: vendor ?? this.vendor,
      name: name ?? this.name,
      date: date ?? this.date,
      imageUrl: imageUrl ?? this.imageUrl,
      mainItems: mainItems ?? this.mainItems,
      sideItems: sideItems ?? this.sideItems,
      extras: extras ?? this.extras,
      isVegOnly: isVegOnly ?? this.isVegOnly,
      fullDabbaPrice: fullDabbaPrice ?? this.fullDabbaPrice,
      maxDabbas: maxDabbas ?? this.maxDabbas,
      dabbasSold: dabbasSold ?? this.dabbasSold,
      todaysSpecial: todaysSpecial ?? this.todaysSpecial,
      cookingStyle: cookingStyle ?? this.cookingStyle,
      isActive: isActive ?? this.isActive,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }

  @override
  String toString() {
    return 'Menu(id: $id, name: $name, vendor: ${vendor?.businessName}, price: $fullDabbaPrice)';
  }
}
