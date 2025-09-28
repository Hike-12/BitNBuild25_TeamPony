import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import OrderForm from '../../components/OrderForm';
import SubscriptionForm from '../../components/SuscriptionForm';
import Footer from '../../components/Footer';
import toast from 'react-hot-toast';
import { 
  FiSearch,
  FiFilter,
  FiArrowLeft,
  FiBell,
  FiSun,
  FiMoon,
  FiUser,
  FiLogOut,
  FiMapPin,
  FiHeart,
  FiStar,
  FiClock,
  FiShoppingCart
} from 'react-icons/fi';
import { 
  MdRestaurant, 
  MdLocalDining,
  MdFastfood,
  MdSetMeal
} from 'react-icons/md';

// Mock JSON Data
const MOCK_MENUS = [
  {
    _id: 'menu_1',
    name: 'Premium North Indian Thali',
    vendor: {
      _id: 'vendor_1',
      business_name: 'Sharma Kitchen',
      address: 'Sector 14, Gurgaon',
      phone_number: '+91 9876543210'
    },
    main_items: [
      { _id: 'item_1', name: 'Dal Makhani', price: 80, category: 'dal', is_vegetarian: true },
      { _id: 'item_2', name: 'Paneer Butter Masala', price: 120, category: 'sabzi', is_vegetarian: true },
      { _id: 'item_3', name: 'Jeera Rice', price: 60, category: 'rice_item', is_vegetarian: true }
    ],
    side_items: [
      { _id: 'item_4', name: 'Butter Roti', price: 15, category: 'roti_bread', is_vegetarian: true },
      { _id: 'item_5', name: 'Mixed Raita', price: 30, category: 'raita_salad', is_vegetarian: true }
    ],
    extras: [
      { _id: 'item_6', name: 'Gulab Jamun', price: 25, category: 'sweet', is_vegetarian: true },
      { _id: 'item_7', name: 'Pickle', price: 10, category: 'pickle_papad', is_vegetarian: true }
    ],
    full_dabba_price: 250,
    max_dabbas: 50,
    dabbas_sold: 15,
    date: new Date().toISOString(),
    is_active: true,
    is_veg_only: true,
    cooking_style: 'Traditional',
    todays_special: 'Fresh homemade paneer with special masala',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&h=400&fit=crop'
  },
  {
    _id: 'menu_2',
    name: 'South Indian Combo',
    vendor: {
      _id: 'vendor_2',
      business_name: 'Chennai Express Kitchen',
      address: 'DLF Phase 1, Gurgaon',
      phone_number: '+91 9876543211'
    },
    main_items: [
      { _id: 'item_8', name: 'Sambar', price: 60, category: 'dal', is_vegetarian: true },
      { _id: 'item_9', name: 'Rasam', price: 40, category: 'dal', is_vegetarian: true },
      { _id: 'item_10', name: 'Coconut Rice', price: 70, category: 'rice_item', is_vegetarian: true }
    ],
    side_items: [
      { _id: 'item_11', name: 'Dosa', price: 50, category: 'roti_bread', is_vegetarian: true },
      { _id: 'item_12', name: 'Coconut Chutney', price: 20, category: 'raita_salad', is_vegetarian: true }
    ],
    extras: [
      { _id: 'item_13', name: 'Filter Coffee', price: 15, category: 'drink', is_vegetarian: true },
      { _id: 'item_14', name: 'Papad', price: 8, category: 'pickle_papad', is_vegetarian: true }
    ],
    full_dabba_price: 180,
    max_dabbas: 30,
    dabbas_sold: 8,
    date: new Date().toISOString(),
    is_active: true,
    is_veg_only: true,
    cooking_style: 'Regional',
    todays_special: 'Authentic filter coffee and fresh sambar',
    image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=600&h=400&fit=crop'
  },
  {
    _id: 'menu_3',
    name: 'Punjabi Power Meal',
    vendor: {
      _id: 'vendor_3',
      business_name: 'Delhi Darbar',
      address: 'Cyber City, Gurgaon',
      phone_number: '+91 9876543212'
    },
    main_items: [
      { _id: 'item_15', name: 'Butter Chicken', price: 150, category: 'non_veg', is_vegetarian: false },
      { _id: 'item_16', name: 'Dal Tadka', price: 70, category: 'dal', is_vegetarian: true },
      { _id: 'item_17', name: 'Basmati Rice', price: 50, category: 'rice_item', is_vegetarian: true }
    ],
    side_items: [
      { _id: 'item_18', name: 'Naan', price: 25, category: 'roti_bread', is_vegetarian: true },
      { _id: 'item_19', name: 'Onion Salad', price: 15, category: 'raita_salad', is_vegetarian: true }
    ],
    extras: [
      { _id: 'item_20', name: 'Lassi', price: 30, category: 'drink', is_vegetarian: true },
      { _id: 'item_21', name: 'Achar', price: 12, category: 'pickle_papad', is_vegetarian: true }
    ],
    full_dabba_price: 320,
    max_dabbas: 40,
    dabbas_sold: 25,
    date: new Date().toISOString(),
    is_active: true,
    is_veg_only: false,
    cooking_style: 'Homestyle',
    todays_special: 'Tender butter chicken with aromatic basmati rice',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&h=400&fit=crop'
  },
  {
    _id: 'menu_4',
    name: 'Gujarati Thali Special',
    vendor: {
      _id: 'vendor_4',
      business_name: 'Rajkot Kitchen',
      address: 'Golf Course Road, Gurgaon',
      phone_number: '+91 9876543213'
    },
    main_items: [
      { _id: 'item_22', name: 'Gujarati Dal', price: 60, category: 'dal', is_vegetarian: true },
      { _id: 'item_23', name: 'Aloo Gobi', price: 80, category: 'sabzi', is_vegetarian: true },
      { _id: 'item_24', name: 'Khichdi', price: 70, category: 'rice_item', is_vegetarian: true }
    ],
    side_items: [
      { _id: 'item_25', name: 'Gujarati Rotli', price: 12, category: 'roti_bread', is_vegetarian: true },
      { _id: 'item_26', name: 'Buttermilk', price: 20, category: 'drink', is_vegetarian: true }
    ],
    extras: [
      { _id: 'item_27', name: 'Jalebi', price: 35, category: 'sweet', is_vegetarian: true },
      { _id: 'item_28', name: 'Khakhra', price: 15, category: 'pickle_papad', is_vegetarian: true }
    ],
    full_dabba_price: 220,
    max_dabbas: 35,
    dabbas_sold: 12,
    date: new Date().toISOString(),
    is_active: true,
    is_veg_only: true,
    cooking_style: 'Traditional',
    todays_special: 'Authentic Gujarati flavors with fresh jalebi',
    image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600&h=400&fit=crop'
  },
  {
    _id: 'menu_5',
    name: 'Bengali Fish Curry Combo',
    vendor: {
      _id: 'vendor_5',
      business_name: 'Kolkata Kitchen',
      address: 'MG Road, Gurgaon',
      phone_number: '+91 9876543214'
    },
    main_items: [
      { _id: 'item_29', name: 'Fish Curry', price: 180, category: 'non_veg', is_vegetarian: false },
      { _id: 'item_30', name: 'Dal Posto', price: 90, category: 'dal', is_vegetarian: true },
      { _id: 'item_31', name: 'Steamed Rice', price: 40, category: 'rice_item', is_vegetarian: true }
    ],
    side_items: [
      { _id: 'item_32', name: 'Luchi', price: 20, category: 'roti_bread', is_vegetarian: true },
      { _id: 'item_33', name: 'Begun Bhaja', price: 60, category: 'sabzi', is_vegetarian: true }
    ],
    extras: [
      { _id: 'item_34', name: 'Mishti Doi', price: 40, category: 'sweet', is_vegetarian: true },
      { _id: 'item_35', name: 'Kasundi', price: 15, category: 'pickle_papad', is_vegetarian: true }
    ],
    full_dabba_price: 350,
    max_dabbas: 25,
    dabbas_sold: 20,
    date: new Date().toISOString(),
    is_active: true,
    is_veg_only: false,
    cooking_style: 'Regional',
    todays_special: 'Fresh fish curry with authentic Bengali spices',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&h=400&fit=crop'
  },
  {
    _id: 'menu_6',
    name: 'Rajasthani Royal Thali',
    vendor: {
      _id: 'vendor_6',
      business_name: 'Jaipur Spice Kitchen',
      address: 'Sohna Road, Gurgaon',
      phone_number: '+91 9876543215'
    },
    main_items: [
      { _id: 'item_36', name: 'Laal Maas', price: 200, category: 'non_veg', is_vegetarian: false },
      { _id: 'item_37', name: 'Dal Baati', price: 120, category: 'dal', is_vegetarian: true },
      { _id: 'item_38', name: 'Jeera Rice', price: 60, category: 'rice_item', is_vegetarian: true }
    ],
    side_items: [
      { _id: 'item_39', name: 'Churma', price: 50, category: 'sweet', is_vegetarian: true },
      { _id: 'item_40', name: 'Ker Sangri', price: 80, category: 'sabzi', is_vegetarian: true }
    ],
    extras: [
      { _id: 'item_41', name: 'Malpua', price: 45, category: 'sweet', is_vegetarian: true },
      { _id: 'item_42', name: 'Rajasthani Pickle', price: 20, category: 'pickle_papad', is_vegetarian: true }
    ],
    full_dabba_price: 400,
    max_dabbas: 20,
    dabbas_sold: 18,
    date: new Date().toISOString(),
    is_active: false, // Sold out
    is_veg_only: false,
    cooking_style: 'Royal',
    todays_special: 'Royal Rajasthani flavors with traditional spices',
    image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600&h=400&fit=crop'
  }
];

const Menu = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme, theme } = useTheme();
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal states
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [showSubscriptionForm, setShowSubscriptionForm] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [selectedVendor, setSelectedVendor] = useState(null);

  // Simulate API call with mock data
  const fetchMenus = async () => {
    try {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMenus(MOCK_MENUS);
      setError('');
    } catch (err) {
      console.error('Fetch menus error:', err);
      setError('Failed to load menus. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  // Filter menus based on search and category
  const filteredMenus = menus.filter(menu => {
    const matchesSearch = menu.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         menu.vendor?.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         menu.todays_special?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || 
                           (selectedCategory === 'veg' && menu.is_veg_only) ||
                           (selectedCategory === 'non_veg' && !menu.is_veg_only);
    
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { value: 'all', label: 'All Categories', icon: <MdSetMeal /> },
    { value: 'veg', label: 'Vegetarian', icon: <MdLocalDining /> },
    { value: 'non_veg', label: 'Non-Vegetarian', icon: <MdFastfood /> }
  ];

  // Handle Order Click
  const handleOrderClick = (menu) => {
    console.log('Order clicked for menu:', menu);
    
    if (!menu.is_active || (menu.max_dabbas - (menu.dabbas_sold || 0)) === 0) {
      toast.error('Sorry, this menu is currently unavailable or sold out!');
      return;
    }
    
    // Check if user is logged in
    if (!user) {
      toast.error('Please login to place an order');
      return;
    }
    
    setSelectedMenu(menu);
    setSelectedVendor(menu.vendor);
    setShowOrderForm(true);
    console.log('Order form should open now');
  };

  // Handle Subscription Click
  const handleSubscriptionClick = (vendor) => {
    console.log('Subscribe clicked for vendor:', vendor);
    
    // Check if user is logged in
    if (!user) {
      toast.error('Please login to subscribe');
      return;
    }
    
    setSelectedVendor(vendor);
    setShowSubscriptionForm(true);
    console.log('Subscription form should open now');
  };

  // Close modals
  const closeModals = () => {
    setShowOrderForm(false);
    setShowSubscriptionForm(false);
    setSelectedMenu(null);
    setSelectedVendor(null);
  };

  // Update menu after successful order (simulate sold count increase)
  const updateMenuAfterOrder = (menuId, quantity) => {
    setMenus(prevMenus => 
      prevMenus.map(menu => 
        menu._id === menuId 
          ? { ...menu, dabbas_sold: (menu.dabbas_sold || 0) + quantity }
          : menu
      )
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.background }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: theme.primary }}></div>
          <div className="text-xl font-semibold" style={{ color: theme.text }}>Loading menus...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen transition-all duration-300" style={{ backgroundColor: theme.background }}>
      {/* Header */}
      <header className="border-b sticky top-0 z-40 backdrop-blur-md"
              style={{ backgroundColor: `${theme.panels}95`, borderColor: theme.border }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="p-2 rounded-lg hover:opacity-80 transition-opacity"
                    style={{ backgroundColor: theme.panels, color: theme.textSecondary }}>
                <FiArrowLeft size={20} />
              </Link>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                   style={{ backgroundColor: theme.primary }}>
                <MdRestaurant size={24} color="white" />
              </div>
              <h1 className="text-2xl font-bold" style={{ color: theme.text }}>NourishNet</h1>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-lg hover:opacity-80 transition-opacity relative"
                      style={{ backgroundColor: theme.panels, color: theme.textSecondary }}>
                <FiBell size={20} />
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
                      style={{ backgroundColor: theme.primary }}></span>
              </button>

              <button onClick={toggleTheme} className="p-2 rounded-lg hover:opacity-80 transition-opacity"
                      style={{ backgroundColor: theme.panels, color: theme.textSecondary }}>
                {isDarkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
              </button>

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center"
                     style={{ backgroundColor: theme.secondary }}>
                  <FiUser size={16} color="white" />
                </div>
                <span className="font-medium" style={{ color: theme.text }}>
                  {user?.first_name || user?.username || 'Guest'}
                </span>
              </div>

              {user ? (
                <button onClick={() => logout()} 
                        className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:transform hover:scale-105"
                        style={{ backgroundColor: theme.error, color: 'white' }}>
                  <FiLogOut size={16} />
                  <span>Logout</span>
                </button>
              ) : (
                <Link to="/login"
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:transform hover:scale-105"
                      style={{ backgroundColor: theme.primary, color: 'white' }}>
                  <FiUser size={16} />
                  <span>Login</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: theme.text }}>
            Available Tiffin Menus
          </h1>
          <p className="text-lg" style={{ color: theme.textSecondary }}>
            Discover delicious home-cooked meals from verified vendors in your area
          </p>
          <div className="mt-4 text-sm" style={{ color: theme.textSecondary }}>
            Found {filteredMenus.length} menu{filteredMenus.length !== 1 ? 's' : ''} • {filteredMenus.filter(m => m.is_active).length} available now
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="p-6 rounded-2xl border mb-8"
             style={{ backgroundColor: theme.panels, borderColor: theme.border }}>
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2"
                        style={{ color: theme.textSecondary }} size={20} />
              <input
                type="text"
                placeholder="Search menus, vendors, or specialties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-opacity-50 transition-all duration-300"
                style={{
                  backgroundColor: theme.background,
                  borderColor: theme.border,
                  color: theme.text
                }}
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <FiFilter style={{ color: theme.textSecondary }} size={20} />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border rounded-xl focus:ring-2 focus:ring-opacity-50 transition-all duration-300"
                style={{
                  backgroundColor: theme.background,
                  borderColor: theme.border,
                  color: theme.text
                }}
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">😞</div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: theme.text }}>
              {error}
            </h3>
            <button 
              onClick={fetchMenus}
              className="px-6 py-3 rounded-lg font-medium transition-all duration-300"
              style={{ backgroundColor: theme.primary, color: 'white' }}
            >
              Try Again
            </button>
          </div>
        ) : filteredMenus.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: theme.text }}>
              No menus found
            </h3>
            <p style={{ color: theme.textSecondary }}>
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          /* Menus Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMenus.map((menu) => (
              <div
                key={menu._id}
                className="rounded-3xl border overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105"
                style={{ backgroundColor: theme.panels, borderColor: theme.border }}
              >
                {/* Menu Image */}
                {menu.image && (
                  <div className="h-48 bg-cover bg-center relative"
                       style={{ backgroundImage: `url(${menu.image})` }}>
                    <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        menu.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {menu.is_active ? 'Available' : 'Sold Out'}
                      </span>
                    </div>
                  </div>
                )}

                <div className="p-6">
                  {/* Menu Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold mb-1" style={{ color: theme.text }}>
                        {menu.name}
                      </h3>
                      <p className="flex items-center space-x-1" style={{ color: theme.textSecondary }}>
                        <FiMapPin size={16} />
                        <span>{menu.vendor?.business_name || 'Vendor Name'}</span>
                      </p>
                    </div>
                    <button className="p-2 hover:opacity-80 transition-opacity">
                      <FiHeart size={20} style={{ color: theme.textSecondary }} />
                    </button>
                  </div>

                  {/* Menu Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {menu.is_veg_only && (
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        Vegetarian
                      </span>
                    )}
                    {menu.cooking_style && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {menu.cooking_style}
                      </span>
                    )}
                  </div>

                  {/* Today's Special */}
                  {menu.todays_special && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                      <div className="flex items-start space-x-2">
                        <FiStar className="text-yellow-600 mt-0.5" size={16} />
                        <div>
                          <h4 className="font-medium text-yellow-800 text-sm">Today's Special</h4>
                          <p className="text-yellow-700 text-sm mt-1">{menu.todays_special}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Menu Items Count */}
                  <div className="flex justify-between text-sm mb-4" style={{ color: theme.textSecondary }}>
                    <span>Main: {menu.main_items?.length || 0}</span>
                    <span>Sides: {menu.side_items?.length || 0}</span>
                    <span>Extras: {menu.extras?.length || 0}</span>
                  </div>

                  {/* Availability */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <FiClock size={16} style={{ color: theme.textSecondary }} />
                      <span className="text-sm" style={{ color: theme.textSecondary }}>
                        Available today
                      </span>
                    </div>
                    <div className="text-sm" style={{ color: theme.textSecondary }}>
                      {Math.max(0, menu.max_dabbas - (menu.dabbas_sold || 0))} left
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div 
                      className="h-2 rounded-full transition-all duration-300"
                      style={{ 
                        backgroundColor: menu.is_active ? theme.success : theme.error,
                        width: `${Math.min(((menu.dabbas_sold || 0) / menu.max_dabbas) * 100, 100)}%`
                      }}
                    ></div>
                  </div>

                  {/* Menu Footer */}
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-2xl font-bold" style={{ color: theme.success }}>
                        ₹{menu.full_dabba_price}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleSubscriptionClick(menu.vendor);
                        }}
                        className="px-4 py-2 border rounded-lg font-medium transition-all duration-300 hover:scale-105 text-sm"
                        style={{ 
                          borderColor: theme.primary,
                          color: theme.primary,
                          backgroundColor: `${theme.primary}10`
                        }}
                      >
                        Subscribe
                      </button>
                      
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleOrderClick(menu);
                        }}
                        disabled={!menu.is_active || (menu.max_dabbas - (menu.dabbas_sold || 0)) === 0}
                        className="px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center space-x-2"
                        style={{ 
                          backgroundColor: theme.primary,
                          color: 'white'
                        }}
                      >
                        <FiShoppingCart size={16} />
                        <span>Order</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Order Form Modal */}
      {showOrderForm && selectedMenu && selectedVendor && (
        <OrderForm
          menu={selectedMenu}
          vendor={selectedVendor}
          onClose={closeModals}
          onSuccess={(order) => {
            toast.success('Order placed successfully! 🎉');
            updateMenuAfterOrder(selectedMenu._id, order.quantity || 1);
            closeModals();
          }}
        />
      )}

      {/* Subscription Form Modal */}
      {showSubscriptionForm && selectedVendor && (
        <SubscriptionForm
          vendor={selectedVendor}
          menus={menus.filter(menu => menu.vendor._id === selectedVendor._id)} // Pass all vendor menus
          onClose={closeModals}
          onSuccess={(subscription) => {
            toast.success('Subscription created successfully! 🎉');
            closeModals();
          }}
        />
      )}

      <Footer />
    </div>
  );
};

export default Menu;