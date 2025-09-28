import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'dart:async';
import '../providers/theme_provider.dart';
import '../theme/app_colors.dart';

class RestaurantCarousel extends StatefulWidget {
  const RestaurantCarousel({super.key});

  @override
  State<RestaurantCarousel> createState() => _RestaurantCarouselState();
}

class _RestaurantCarouselState extends State<RestaurantCarousel> {
  int _currentIndex = 0;
  late PageController _pageController;
  Timer? _timer;

  final List<RestaurantData> _restaurants = [
    RestaurantData(
      title: "Le Jardin Royal",
      cuisine: "Fine French Cuisine",
      description: "Exquisite French culinary artistry in an elegant setting with premium ingredients",
      imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=3387&auto=format&fit=crop",
      rating: 4.9,
      price: "\$\$\$",
      time: "45-60 min",
    ),
    RestaurantData(
      title: "Sakura Premium",
      cuisine: "Authentic Japanese",
      description: "Traditional Japanese flavors with modern presentation and fresh seasonal ingredients",
      imageUrl: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?q=80&w=3456&auto=format&fit=crop",
      rating: 4.8,
      price: "\$\$\$",
      time: "35-50 min",
    ),
    RestaurantData(
      title: "Villa Mediterranea",
      cuisine: "Italian Fine Dining",
      description: "Authentic Italian cuisine with imported ingredients and traditional family recipes",
      imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?q=80&w=3540&auto=format&fit=crop",
      rating: 4.9,
      price: "\$\$\$\$",
      time: "40-55 min",
    ),
    RestaurantData(
      title: "Golden Spice",
      cuisine: "Contemporary Indian",
      description: "Modern Indian cuisine with aromatic spices and innovative cooking techniques",
      imageUrl: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=3387&auto=format&fit=crop",
      rating: 4.7,
      price: "\$\$",
      time: "30-45 min",
    ),
    RestaurantData(
      title: "Ocean's Bounty",
      cuisine: "Fresh Seafood",
      description: "Daily fresh catch prepared to perfection with coastal spices and Mediterranean influences",
      imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=3456&auto=format&fit=crop",
      rating: 4.8,
      price: "\$\$\$",
      time: "25-40 min",
    ),
  ];

  @override
  void initState() {
    super.initState();
    _pageController = PageController(initialPage: _currentIndex);
    _startAutoSlide();
  }

  @override
  void dispose() {
    _timer?.cancel();
    _pageController.dispose();
    super.dispose();
  }

  void _startAutoSlide() {
    _timer = Timer.periodic(const Duration(seconds: 5), (timer) {
      if (_currentIndex < _restaurants.length - 1) {
        _currentIndex++;
      } else {
        _currentIndex = 0;
      }
      
      if (_pageController.hasClients) {
        _pageController.animateToPage(
          _currentIndex,
          duration: const Duration(milliseconds: 700),
          curve: Curves.easeInOut,
        );
      }
    });
  }

  void _onPageChanged(int index) {
    setState(() {
      _currentIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    final themeProvider = Provider.of<ThemeProvider>(context);
    
    return Container(
      width: double.infinity,
      constraints: const BoxConstraints(maxWidth: 1200),
      child: Column(
        children: [
          // Main Carousel
          Container(
            height: 340,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(24),
              boxShadow: [
                BoxShadow(
                  color: themeProvider.primaryColor.withOpacity(0.2),
                  blurRadius: 20,
                  offset: const Offset(0, 8),
                ),
              ],
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(24),
              child: PageView.builder(
                controller: _pageController,
                onPageChanged: _onPageChanged,
                itemCount: _restaurants.length,
                itemBuilder: (context, index) {
                  return _buildCarouselItem(_restaurants[index], themeProvider);
                },
              ),
            ),
          ),
          
          const SizedBox(height: 24),
          
          // Dots Indicator
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: _restaurants.asMap().entries.map((entry) {
              int index = entry.key;
              return AnimatedContainer(
                duration: const Duration(milliseconds: 300),
                width: _currentIndex == index ? 40 : 12,
                height: 12,
                margin: const EdgeInsets.symmetric(horizontal: 6),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(6),
                  color: _currentIndex == index 
                      ? themeProvider.primaryColor
                      : themeProvider.textSecondaryColor.withOpacity(0.3),
                  boxShadow: _currentIndex == index ? [
                    BoxShadow(
                      color: themeProvider.primaryColor.withOpacity(0.4),
                      blurRadius: 8,
                      offset: const Offset(0, 2),
                    ),
                  ] : null,
                ),
              );
            }).toList(),
          ),
        ],
      ),
    );
  }

  Widget _buildCarouselItem(RestaurantData restaurant, ThemeProvider themeProvider) {
    return Stack(
      children: [
        // Background Image
        Container(
          width: double.infinity,
          height: double.infinity,
          decoration: BoxDecoration(
            image: DecorationImage(
              image: NetworkImage(restaurant.imageUrl),
              fit: BoxFit.cover,
            ),
          ),
        ),
        
        // Gradient Overlays
        Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.centerLeft,
              end: Alignment.centerRight,
              colors: [
                Colors.black.withOpacity(0.85),
                Colors.black.withOpacity(0.5),
                Colors.black.withOpacity(0.2),
              ],
            ),
          ),
        ),
        
        Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.bottomCenter,
              end: Alignment.topCenter,
              colors: [
                Colors.black.withOpacity(0.6),
                Colors.transparent,
              ],
            ),
          ),
        ),
        
        // Content
        Positioned(
          left: 24,
          top: 0,
          bottom: 0,
          right: 120,
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Cuisine Badge
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                decoration: BoxDecoration(
                  color: themeProvider.primaryColor.withOpacity(0.9),
                  borderRadius: BorderRadius.circular(20),
                  boxShadow: [
                    BoxShadow(
                      color: themeProvider.primaryColor.withOpacity(0.3),
                      blurRadius: 8,
                      offset: const Offset(0, 2),
                    ),
                  ],
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      restaurant.cuisine,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(Icons.star, color: Colors.amber, size: 16),
                        const SizedBox(width: 4),
                        Text(
                          restaurant.rating.toString(),
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 14,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              
              const SizedBox(height: 16),
              
              // Title
              Text(
                restaurant.title,
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 28,
                  fontWeight: FontWeight.w700,
                  fontFamily: AppColors.fontFamilyPrimary,
                ),
              ),
              
              const SizedBox(height: 12),
              
              // Description
              Text(
                restaurant.description,
                style: TextStyle(
                  color: Colors.white.withOpacity(0.9),
                  fontSize: 16,
                  height: 1.5,
                ),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
              
              const SizedBox(height: 20),
              
              // Details Row
              Row(
                children: [
                  _buildDetailItem(Icons.access_time, restaurant.time),
                  const SizedBox(width: 24),
                  _buildDetailItem(Icons.restaurant_menu, restaurant.price),
                ],
              ),
              
              const SizedBox(height: 24),
              
              // CTA Button
              Container(
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(16),
                  gradient: LinearGradient(
                    colors: themeProvider.primaryGradient,
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: themeProvider.primaryColor.withOpacity(0.4),
                      blurRadius: 16,
                      offset: const Offset(0, 8),
                    ),
                  ],
                ),
                child: Material(
                  color: Colors.transparent,
                  child: InkWell(
                    borderRadius: BorderRadius.circular(16),
                    onTap: () {
                      // Navigate to menu or restaurant details
                    },
                    child: const Padding(
                      padding: EdgeInsets.symmetric(horizontal: 32, vertical: 16),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text(
                            'Explore Menu',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 16,
                              fontWeight: FontWeight.w600,
                              fontFamily: AppColors.fontFamilyPrimary,
                            ),
                          ),
                          SizedBox(width: 8),
                          Icon(Icons.arrow_forward, color: Colors.white, size: 18),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildDetailItem(IconData icon, String text) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(icon, color: Colors.white70, size: 18),
        const SizedBox(width: 6),
        Text(
          text,
          style: const TextStyle(
            color: Colors.white70,
            fontSize: 14,
          ),
        ),
      ],
    );
  }
}

class RestaurantData {
  final String title;
  final String cuisine;
  final String description;
  final String imageUrl;
  final double rating;
  final String price;
  final String time;

  RestaurantData({
    required this.title,
    required this.cuisine,
    required this.description,
    required this.imageUrl,
    required this.rating,
    required this.price,
    required this.time,
  });
}