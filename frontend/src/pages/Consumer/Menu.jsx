import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Link } from 'react-router-dom';
import OrderForm from '../../components/OrderForm';
import SubscriptionForm from '../../components/SuscriptionForm';
import toast from 'react-hot-toast'; // ADD THIS IMPORT
import Footer from '../../components/Footer';
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
  FiStar,
  FiHeart,
  FiBell,
  FiUser,
  FiLogOut
} from 'react-icons/fi';
import { 
  MdRestaurant, 
  MdLocalDining,
  MdFastfood,
  MdCake,
  MdLocalBar,
  MdSetMeal  // ADD THIS IMPORT
} from 'react-icons/md';

const Menu = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme, theme } = useTheme();
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  // console.log('User in Menu component:', user); // DEBUG LOG

  // Modal states
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [showSubscriptionForm, setShowSubscriptionForm] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [selectedVendor, setSelectedVendor] = useState(null);

  // Fetch all vendor daily menus (public route)
  const fetchMenus = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/vendor/public/daily-menus`);
      const data = await response.json();
      console.log('Fetched menus:', data); // DEBUG LOG

      if (data.success) {
        setMenus(data.menus || []);
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
    console.log('Order clicked for menu:', menu); // DEBUG LOG
    
    if (!menu.is_active || (menu.max_dabbas - (menu.dabbas_sold || 0)) === 0) {
      toast.error('This menu is not available for ordering');
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
    console.log('Order form should open now'); // DEBUG LOG
  };

  // Handle Subscription Click
  const handleSubscriptionClick = (vendor) => {
    console.log('Subscribe clicked for vendor:', vendor); // DEBUG LOG
    
    // Check if user is logged in
    if (!user) {
      toast.error('Please login to create a subscription');
      return;
    }
    
    setSelectedVendor(vendor);
    setShowSubscriptionForm(true);
    console.log('Subscription form should open now'); // DEBUG LOG
  };

  // Close modals
  const closeModals = () => {
    setShowOrderForm(false);
    setShowSubscriptionForm(false);
    setSelectedMenu(null);
    setSelectedVendor(null);
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
      {/* Header - same as before */}
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
            toast.success('Order placed successfully!');
            fetchMenus(); // Refresh to update availability
            closeModals();
          }}
        />
      )}

      {/* Subscription Form Modal */}
      {showSubscriptionForm && selectedVendor && (
        <SubscriptionForm
          vendor={selectedVendor}
          onClose={closeModals}
          onSuccess={(subscription) => {
            toast.success('Subscription created successfully!');
            closeModals();
          }}
        />
      )}
      {/* Premium Footer */}
      <Footer />
    </div>
  );
};

export default Menu;