import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../shared/providers/theme_provider.dart';
import '../../../core/constants/app_constants.dart';
import '../../../shared/theme/app_colors.dart';
import '../../../core/data/dummy_data.dart';
import '../../../core/models/menu_model.dart';
import '../../../core/services/api_service.dart';

class MenuScreen extends StatefulWidget {
  const MenuScreen({super.key});

  @override
  State<MenuScreen> createState() => _MenuScreenState();
}

class _MenuScreenState extends State<MenuScreen> {
  List<Menu> _menus = [];
  List<Menu> _filteredMenus = [];
  bool _isLoading = true;
  String _searchQuery = '';
  String _selectedFilter = 'all';

  final TextEditingController _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _loadMenus();
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _loadMenus() async {
    setState(() {
      _isLoading = true;
    });

    try {
      final response = await ApiService.getMenus();
      if (response.success && response.data != null) {
        _menus = response.data!;
      } else {
        // Fallback to dummy data
        _menus = DummyData.getTodaysMenus();
      }
    } catch (e) {
      // Use fallback data on error
      _menus = DummyData.getTodaysMenus();
    }

    _filterMenus();
    setState(() {
      _isLoading = false;
    });
  }

  void _filterMenus() {
    _filteredMenus = _menus.where((menu) {
      final matchesSearch =
          menu.name.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          (menu.vendor?.businessName ?? '').toLowerCase().contains(
            _searchQuery.toLowerCase(),
          );

      final matchesFilter =
          _selectedFilter == 'all' ||
          (_selectedFilter == 'veg' && menu.isVegOnly) ||
          (_selectedFilter == 'non_veg' && !menu.isVegOnly) ||
          (_selectedFilter == 'available' && menu.isAvailable);

      return matchesSearch && matchesFilter;
    }).toList();
  }

  void _onSearchChanged(String query) {
    setState(() {
      _searchQuery = query;
      _filterMenus();
    });
  }

  void _onFilterChanged(String filter) {
    setState(() {
      _selectedFilter = filter;
      _filterMenus();
    });
  }

  @override
  Widget build(BuildContext context) {
    final themeProvider = Provider.of<ThemeProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Today\'s Menus'),
        actions: [
          IconButton(onPressed: _loadMenus, icon: const Icon(Icons.refresh)),
        ],
      ),
      body: Column(
        children: [
          // Search and Filter Section
          Container(
            padding: const EdgeInsets.all(AppConstants.defaultPadding),
            color: themeProvider.surfaceColor,
            child: Column(
              children: [
                // Search Bar
                TextField(
                  controller: _searchController,
                  onChanged: _onSearchChanged,
                  decoration: const InputDecoration(
                    hintText: 'Search menus or vendors...',
                    prefixIcon: Icon(Icons.search),
                    suffixIcon: null,
                  ),
                ),
                const SizedBox(height: 16),

                // Filter Chips
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: [
                      _buildFilterChip('All', 'all', themeProvider),
                      const SizedBox(width: 8),
                      _buildFilterChip('Vegetarian', 'veg', themeProvider),
                      const SizedBox(width: 8),
                      _buildFilterChip('Non-Veg', 'non_veg', themeProvider),
                      const SizedBox(width: 8),
                      _buildFilterChip('Available', 'available', themeProvider),
                    ],
                  ),
                ),
              ],
            ),
          ),

          // Menu List
          Expanded(
            child: _isLoading
                ? const Center(child: CircularProgressIndicator())
                : _filteredMenus.isEmpty
                ? _buildEmptyState(themeProvider)
                : RefreshIndicator(
                    onRefresh: _loadMenus,
                    child: ListView.builder(
                      padding: const EdgeInsets.all(
                        AppConstants.defaultPadding,
                      ),
                      itemCount: _filteredMenus.length,
                      itemBuilder: (context, index) {
                        final menu = _filteredMenus[index];
                        return _buildMenuCard(menu, themeProvider);
                      },
                    ),
                  ),
          ),
        ],
      ),
    );
  }

  Widget _buildFilterChip(
    String label,
    String value,
    ThemeProvider themeProvider,
  ) {
    final isSelected = _selectedFilter == value;

    return FilterChip(
      label: Text(label),
      selected: isSelected,
      onSelected: (_) => _onFilterChanged(value),
      selectedColor: themeProvider.primaryColor.withOpacity(0.2),
      checkmarkColor: themeProvider.primaryColor,
    );
  }

  Widget _buildMenuCard(Menu menu, ThemeProvider themeProvider) {
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
                        menu.name,
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w600,
                          color: themeProvider.textColor,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        menu.vendor?.businessName ?? 'Unknown Vendor',
                        style: TextStyle(
                          fontSize: 14,
                          color: themeProvider.subtitleColor,
                        ),
                      ),
                    ],
                  ),
                ),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Text(
                      '₹${menu.fullDabbaPrice.toInt()}',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: AppColors.primary,
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 8,
                        vertical: 4,
                      ),
                      decoration: BoxDecoration(
                        color: menu.isVegOnly
                            ? AppColors.vegetarian.withOpacity(0.1)
                            : AppColors.nonVegetarian.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        menu.isVegOnly ? 'VEG' : 'NON-VEG',
                        style: TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.w600,
                          color: menu.isVegOnly
                              ? AppColors.vegetarian
                              : AppColors.nonVegetarian,
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),

            const SizedBox(height: 12),

            // Special Note
            if (menu.todaysSpecial?.isNotEmpty == true)
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: AppColors.warning.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Row(
                  children: [
                    Icon(Icons.star, size: 16, color: AppColors.warning),
                    const SizedBox(width: 4),
                    Expanded(
                      child: Text(
                        menu.todaysSpecial!,
                        style: TextStyle(
                          fontSize: 12,
                          color: themeProvider.textColor,
                        ),
                      ),
                    ),
                  ],
                ),
              ),

            if (menu.todaysSpecial?.isNotEmpty == true)
              const SizedBox(height: 12),

            // Items Preview
            if (menu.mainItems.isNotEmpty) ...[
              Text(
                'Main Items:',
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                  color: themeProvider.textColor,
                ),
              ),
              const SizedBox(height: 4),
              Wrap(
                spacing: 8,
                runSpacing: 4,
                children: menu.mainItems.take(3).map((item) {
                  return Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8,
                      vertical: 4,
                    ),
                    decoration: BoxDecoration(
                      color: themeProvider.surfaceColor,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                        color: themeProvider.subtitleColor.withOpacity(0.2),
                      ),
                    ),
                    child: Text(
                      item.name,
                      style: TextStyle(
                        fontSize: 12,
                        color: themeProvider.textColor,
                      ),
                    ),
                  );
                }).toList(),
              ),
              if (menu.mainItems.length > 3)
                Padding(
                  padding: const EdgeInsets.only(top: 4),
                  child: Text(
                    '+${menu.mainItems.length - 3} more items',
                    style: TextStyle(
                      fontSize: 12,
                      color: themeProvider.subtitleColor,
                    ),
                  ),
                ),
            ],

            const SizedBox(height: 16),

            // Bottom Row
            Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Available: ${menu.availableDabbas}/${menu.maxDabbas}',
                        style: TextStyle(
                          fontSize: 12,
                          color: themeProvider.subtitleColor,
                        ),
                      ),
                      const SizedBox(height: 2),
                      LinearProgressIndicator(
                        value: menu.availableDabbas / menu.maxDabbas,
                        backgroundColor: themeProvider.subtitleColor
                            .withOpacity(0.2),
                        valueColor: AlwaysStoppedAnimation<Color>(
                          menu.availableDabbas > menu.maxDabbas * 0.2
                              ? AppColors.success
                              : AppColors.warning,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 16),
                ElevatedButton(
                  onPressed: menu.isAvailable
                      ? () => _showOrderDialog(menu)
                      : null,
                  child: Text(menu.isAvailable ? 'Order Now' : 'Sold Out'),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildEmptyState(ThemeProvider themeProvider) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.restaurant_menu_outlined,
            size: 64,
            color: themeProvider.subtitleColor,
          ),
          const SizedBox(height: 16),
          Text(
            'No Menus Found',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w600,
              color: themeProvider.textColor,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Try adjusting your search or filters',
            style: TextStyle(color: themeProvider.subtitleColor),
          ),
          const SizedBox(height: 24),
          ElevatedButton(onPressed: _loadMenus, child: const Text('Refresh')),
        ],
      ),
    );
  }

  void _showOrderDialog(Menu menu) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Order ${menu.name}'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Vendor: ${menu.vendor?.businessName ?? 'Unknown'}'),
            Text('Price: ₹${menu.fullDabbaPrice.toInt()}'),
            const SizedBox(height: 16),
            const Text('This feature is coming soon!'),
            const Text('For now, you can use the demo order functionality.'),
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
                  content: Text('Demo order placed successfully!'),
                  backgroundColor: AppColors.success,
                ),
              );
            },
            child: const Text('Demo Order'),
          ),
        ],
      ),
    );
  }
}
