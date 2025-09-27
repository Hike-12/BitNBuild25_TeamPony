import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Link } from 'react-router-dom';
import { 
  FiSun, 
  FiMoon, 
  FiSearch,
  FiFilter,
  FiMapPin,
  FiPhone,
  FiClock,
  FiShoppingCart,
  FiArrowLeft,
  FiStar
} from 'react-icons/fi';
import { 
  MdRestaurant, 
  MdLocalDining,
  MdFastfood,
  MdCake,
  MdLocalBar,
  MdSetMeal
} from 'react-icons/md';
import toast from 'react-hot-toast';

const Menu = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme, theme } = useTheme();
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch all vendor menus
  const fetchMenus = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/menus/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data = await response.json();

      if (data.success) {
        setMenus(data.menus);
        setError('');
      } else {
        setError(data.error || 'Failed to fetch menus');
        toast.error('Failed to load menus');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      toast.error('Network error occurred');
      console.error('Error fetching menus:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  // Filter menus based on search and category
  const filteredMenus = menus.filter(menu => {
    const matchesSearch = menu.vendor.kitchen_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         menu.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedCategory === 'all') {
      return matchesSearch;
    }
    
    return matchesSearch && menu.menu_items.some(item => item.category === selectedCategory);
  });

  const categories = [
    { value: 'all', label: 'All Categories', icon: <MdSetMeal /> },
    { value: 'main_course', label: 'Main Course', icon: <MdRestaurant /> },
    { value: 'side_dish', label: 'Side Dish', icon: <MdLocalDining /> },
    { value: 'bread', label: 'Bread', icon: <MdFastfood /> },
    { value: 'dessert', label: 'Dessert', icon: <MdCake /> },
    { value: 'beverage', label: 'Beverage', icon: <MdLocalBar /> },
    { value: 'snack', label: 'Snack', icon: <MdFastfood /> }
  ];

  const getCategoryIcon = (category) => {
    const categoryMap = {
      'main_course': <MdRestaurant />,
      'side_dish': <MdLocalDining />,
      'bread': <MdFastfood />,
      'dessert': <MdCake />,
      'beverage': <MdLocalBar />,
      'snack': <MdFastfood />
    };
    return categoryMap[category] || <MdRestaurant />;
  };

  if (loading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center transition-all duration-300"
        style={{ backgroundColor: theme.background }}
      >
        <div className="text-center">
          <div 
            className="animate-spin rounded-full h-16 w-16 border-4 border-t-transparent mx-auto mb-4"
            style={{ borderColor: `${theme.primary} transparent transparent transparent` }}
          ></div>
          <div className="text-xl font-semibold" style={{ color: theme.text }}>Loading delicious menus...</div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen transition-all duration-300"
      style={{ backgroundColor: theme.background }}
    >
      {/* Header */}
      <header 
        className="sticky top-0 z-50 transition-all duration-300 border-b backdrop-blur-md"
        style={{ 
          backgroundColor: `${theme.panels}95`,
          borderColor: theme.border 
        }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              {/* Back to Dashboard */}
              <Link
                to="/dashboard"
                className="p-2 rounded-lg hover:opacity-80 transition-opacity"
                style={{ 
                  backgroundColor: theme.panels,
                  color: theme.textSecondary 
                }}
              >
                <FiArrowLeft size={20} />
              </Link>
              
              {/* Logo */}
              <div className="flex items-center space-x-2">
                <MdRestaurant 
                  size={28} 
                  style={{ color: theme.primary }} 
                />
                <span 
                  className="text-2xl font-bold"
                  style={{ color: theme.primary }}
                >
                  NourishNet
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:opacity-80 transition-opacity"
                style={{ 
                  backgroundColor: theme.panels,
                  color: theme.textSecondary 
                }}
              >
                {isDarkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
              </button>

              {/* User Info */}
              <div className="flex items-center space-x-3">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{ 
                    backgroundColor: theme.secondary,
                    color: 'white'
                  }}
                >
                  {user?.first_name?.charAt(0) || user?.username?.charAt(0) || 'U'}
                </div>
                <span style={{ color: theme.text }}>
                  {user?.first_name || user?.username}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 
            className="text-4xl font-bold mb-2"
            style={{ color: theme.text }}
          >
            Available Tiffin Menus
          </h1>
          <p 
            className="text-lg"
            style={{ color: theme.textSecondary }}
          >
            Discover delicious home-cooked meals from verified vendors in your area
          </p>
        </div>

        {/* Search and Filter Controls */}
        <div 
          className="p-6 rounded-2xl border mb-8"
          style={{ 
            backgroundColor: theme.panels,
            borderColor: theme.border 
          }}
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Box */}
            <div className="flex-1 relative">
              <FiSearch 
                className="absolute left-3 top-1/2 transform -translate-y-1/2" 
                style={{ color: theme.textSecondary }}
                size={20}
              />
              <input
                type="text"
                placeholder="Search by kitchen name or menu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border focus:ring-2 focus:ring-opacity-50 transition-all duration-300"
                style={{
                  backgroundColor: theme.background,
                  borderColor: theme.border,
                  color: theme.text,
                  focusRingColor: theme.primary
                }}
              />
            </div>
            
            {/* Category Filter */}
            <div className="relative min-w-48">
              <FiFilter 
                className="absolute left-3 top-1/2 transform -translate-y-1/2" 
                style={{ color: theme.textSecondary }}
                size={20}
              />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border focus:ring-2 focus:ring-opacity-50 transition-all duration-300 appearance-none cursor-pointer"
                style={{
                  backgroundColor: theme.background,
                  borderColor: theme.border,
                  color: theme.text
                }}
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Results Count */}
          <div className="mt-4 pt-4 border-t" style={{ borderColor: theme.border }}>
            <p style={{ color: theme.textSecondary }}>
              Found <span style={{ color: theme.primary, fontWeight: 'bold' }}>{filteredMenus.length}</span> available menus
              {searchTerm && ` for "${searchTerm}"`}
            </p>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div 
            className="p-6 rounded-2xl border text-center mb-8"
            style={{ 
              backgroundColor: `${theme.error}10`,
              borderColor: theme.error,
              color: theme.error 
            }}
          >
            <p className="mb-4">{error}</p>
            <button 
              onClick={fetchMenus}
              className="px-6 py-2 rounded-lg font-semibold transition-all duration-300"
              style={{ 
                backgroundColor: theme.primary,
                color: 'white'
              }}
            >
              Try Again
            </button>
          </div>
        )}

        {/* Menus Grid */}
        {filteredMenus.length === 0 && !loading && !error ? (
          <div 
            className="text-center py-16 rounded-2xl border"
            style={{ 
              backgroundColor: theme.panels,
              borderColor: theme.border 
            }}
          >
            <MdRestaurant 
              size={64} 
              className="mx-auto mb-4 opacity-50"
              style={{ color: theme.textSecondary }}
            />
            <h3 
              className="text-xl font-semibold mb-2"
              style={{ color: theme.text }}
            >
              No menus found
            </h3>
            <p style={{ color: theme.textSecondary }}>
              {searchTerm ? 'Try adjusting your search terms' : 'No menus are currently available'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredMenus.map(menu => (
              <div
                key={menu.id}
                className="rounded-2xl border shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                style={{
                  backgroundColor: theme.panels,
                  borderColor: theme.border
                }}
              >
                {/* Menu Card Header */}
                <div className="p-6 border-b" style={{ borderColor: theme.border }}>
                  <div className="flex justify-between items-start mb-3">
                    <h3 
                      className="text-xl font-bold"
                      style={{ color: theme.text }}
                    >
                      {menu.name}
                    </h3>
                    <div 
                      className="px-3 py-1 rounded-full text-sm font-semibold"
                      style={{ 
                        backgroundColor: `${theme.success}20`,
                        color: theme.success 
                      }}
                    >
                      Available
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <MdRestaurant style={{ color: theme.primary }} />
                      <span 
                        className="font-semibold"
                        style={{ color: theme.primary }}
                      >
                        {menu.vendor.kitchen_name}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <FiMapPin style={{ color: theme.textSecondary }} />
                      <span 
                        className="text-sm"
                        style={{ color: theme.textSecondary }}
                      >
                        {menu.vendor.address}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <FiPhone style={{ color: theme.textSecondary }} />
                      <span 
                        className="text-sm"
                        style={{ color: theme.textSecondary }}
                      >
                        {menu.vendor.phone_number}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="p-6">
                  <h4 
                    className="font-semibold mb-4 flex items-center space-x-2"
                    style={{ color: theme.text }}
                  >
                    <MdLocalDining />
                    <span>Today's Menu ({new Date(menu.date).toLocaleDateString()})</span>
                  </h4>
                  
                  <div className="space-y-3 mb-6">
                    {menu.menu_items.slice(0, 3).map(item => (
                      <div 
                        key={item.id}
                        className="flex justify-between items-start p-3 rounded-lg border"
                        style={{ 
                          backgroundColor: theme.background,
                          borderColor: theme.border 
                        }}
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span style={{ color: theme.primary }}>
                              {getCategoryIcon(item.category)}
                            </span>
                            <span 
                              className="font-medium"
                              style={{ color: theme.text }}
                            >
                              {item.name}
                            </span>
                          </div>
                          
                          <p 
                            className="text-sm mb-2"
                            style={{ color: theme.textSecondary }}
                          >
                            {item.description}
                          </p>
                          
                          <div className="flex items-center space-x-2 text-xs">
                            {item.is_vegetarian && (
                              <span 
                                className="px-2 py-1 rounded-full"
                                style={{ 
                                  backgroundColor: `${theme.success}20`,
                                  color: theme.success 
                                }}
                              >
                                Veg
                              </span>
                            )}
                            {item.is_spicy && (
                              <span 
                                className="px-2 py-1 rounded-full"
                                style={{ 
                                  backgroundColor: `${theme.error}20`,
                                  color: theme.error 
                                }}
                              >
                                Spicy
                              </span>
                            )}
                            <div className="flex items-center space-x-1">
                              <FiClock style={{ color: theme.textSecondary }} />
                              <span style={{ color: theme.textSecondary }}>
                                {item.preparation_time}m
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div 
                          className="text-lg font-bold ml-4"
                          style={{ color: theme.success }}
                        >
                          ₹{item.price}
                        </div>
                      </div>
                    ))}
                    
                    {menu.menu_items.length > 3 && (
                      <div 
                        className="text-center text-sm"
                        style={{ color: theme.textSecondary }}
                      >
                        +{menu.menu_items.length - 3} more items
                      </div>
                    )}
                  </div>

                  {/* Special Instructions */}
                  {menu.special_instructions && (
                    <div 
                      className="p-3 rounded-lg mb-4 border-l-4"
                      style={{ 
                        backgroundColor: `${theme.primary}10`,
                        borderColor: theme.primary 
                      }}
                    >
                      <p 
                        className="text-sm font-medium mb-1"
                        style={{ color: theme.text }}
                      >
                        Special Instructions:
                      </p>
                      <p 
                        className="text-sm"
                        style={{ color: theme.textSecondary }}
                      >
                        {menu.special_instructions}
                      </p>
                    </div>
                  )}

                  {/* Menu Footer */}
                  <div className="flex justify-between items-center">
                    <div>
                      <div 
                        className="text-2xl font-bold"
                        style={{ color: theme.success }}
                      >
                        ₹{menu.total_price}
                      </div>
                      <div 
                        className="text-sm"
                        style={{ color: theme.textSecondary }}
                      >
                        {menu.available_slots} slots remaining
                      </div>
                    </div>
                    
                    <button 
                      className="px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      style={{ 
                        backgroundColor: menu.available_slots > 0 ? theme.primary : theme.textSecondary,
                        color: 'white'
                      }}
                      disabled={menu.available_slots === 0}
                      onClick={() => {
                        if (menu.available_slots > 0) {
                          toast.success('Order feature coming soon!');
                        }
                      }}
                    >
                      <FiShoppingCart />
                      <span>
                        {menu.available_slots === 0 ? 'Sold Out' : 'Order Now'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;