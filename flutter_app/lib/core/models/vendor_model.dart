class Vendor {
  final String? id;
  final String businessName;
  final String address;
  final String? phoneNumber;
  final String? email;
  final String? description;
  final double? rating;
  final List<String>? cuisineTypes;
  final bool isActive;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  Vendor({
    this.id,
    required this.businessName,
    required this.address,
    this.phoneNumber,
    this.email,
    this.description,
    this.rating,
    this.cuisineTypes,
    this.isActive = true,
    this.createdAt,
    this.updatedAt,
  });

  factory Vendor.fromJson(Map<String, dynamic> json) {
    return Vendor(
      id: json['_id'] ?? json['id'],
      businessName: json['business_name'] ?? json['businessName'] ?? '',
      address: json['address'] ?? '',
      phoneNumber: json['phone_number'] ?? json['phoneNumber'],
      email: json['email'],
      description: json['description'],
      rating: json['rating']?.toDouble(),
      cuisineTypes: json['cuisine_types'] != null
          ? List<String>.from(json['cuisine_types'])
          : null,
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
      'business_name': businessName,
      'address': address,
      'phone_number': phoneNumber,
      'email': email,
      'description': description,
      'rating': rating,
      'cuisine_types': cuisineTypes,
      'is_active': isActive,
      'createdAt': createdAt?.toIso8601String(),
      'updatedAt': updatedAt?.toIso8601String(),
    };
  }

  Vendor copyWith({
    String? id,
    String? businessName,
    String? address,
    String? phoneNumber,
    String? email,
    String? description,
    double? rating,
    List<String>? cuisineTypes,
    bool? isActive,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return Vendor(
      id: id ?? this.id,
      businessName: businessName ?? this.businessName,
      address: address ?? this.address,
      phoneNumber: phoneNumber ?? this.phoneNumber,
      email: email ?? this.email,
      description: description ?? this.description,
      rating: rating ?? this.rating,
      cuisineTypes: cuisineTypes ?? this.cuisineTypes,
      isActive: isActive ?? this.isActive,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }

  @override
  String toString() {
    return 'Vendor(id: $id, businessName: $businessName, address: $address, rating: $rating)';
  }
}
