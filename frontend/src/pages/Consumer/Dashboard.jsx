import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  FiSun, 
  FiMoon, 
  FiUser, 
  FiMail, 
  FiCalendar, 
  FiShoppingBag, 
  FiTrendingUp, 
  FiDollarSign,
  FiClock,
  FiLogOut,
  FiHome,
  FiSettings,
  FiHeart,
  FiMapPin,
  FiBell,
  FiStar,
  FiMenu,
  FiEye,
  FiRefreshCw
} from 'react-icons/fi';
import { 
  MdRestaurant, 
  MdDeliveryDining,
  MdFastfood,
  MdLocalDining
} from 'react-icons/md';
import { 
  BsBoxSeam,
  BsCreditCard,
  BsPiggyBank
} from 'react-icons/bs';

// Import the Menu component
import MenuComponent from './Menu';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme, theme } = useTheme();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock realistic data (keep your existing data)
  const [dashboardData, setDashboardData] = useState({
    quickStats: [
      {
        title: 'Active Orders',
        value: '2',
        change: '+1 from yesterday',
        icon: BsBoxSeam,
        color: theme.secondary,
        bg: `${theme.secondary}15`
      },
      {
        title: 'This Month Spent',
        value: '₹3,240',
        change: '+12% from last month',
        icon: FiDollarSign,
        color: theme.primary,
        bg: `${theme.primary}15`
      },
      {
        title: 'Total Saved',
        value: '₹12,450',
        change: 'Compared to dining out',
        icon: BsPiggyBank,
        color: theme.success,
        bg: `${theme.success}15`
      },
      {
        title: 'Favorite Vendors',
        value: '8',
        change: 'Most ordered from',
        icon: FiHeart,
        color: '#E91E63',
        bg: '#E91E6315'
      }
    ],
    recentOrders: [
      {
        id: '#ORD2024001',
        meal: 'North Indian Thali',
        vendor: 'Sharma Kitchen',
        time: 'Today, 1:15 PM',
        price: '₹250',
        status: 'Out for Delivery',
        statusColor: theme.warning,
        icon: MdLocalDining
      },
      {
        id: '#ORD2024002',
        meal: 'South Indian Combo',
        vendor: 'Chennai Express Kitchen',
        time: 'Today, 12:30 PM',
        price: '₹180',
        status: 'Delivered',
        statusColor: theme.success,
        icon: MdFastfood
      },
      {
        id: '#ORD2024003',
        meal: 'Punjabi Power Meal',
        vendor: 'Delhi Darbar',
        time: 'Yesterday, 7:45 PM',
        price: '₹320',
        status: 'Delivered',
        statusColor: theme.success,
        icon: MdRestaurant
      },
      {
        id: '#ORD2024004',
        meal: 'Bengali Fish Curry',
        vendor: 'Kolkata Kitchen',
        time: 'Yesterday, 1:00 PM',
        price: '₹350',
        status: 'Delivered',
        statusColor: theme.success,
        icon: MdLocalDining
      }
    ],
    upcomingDeliveries: [
      {
        meal: 'Gujarati Thali Special',
        vendor: 'Rajkot Kitchen',
        time: '7:30 PM Today',
        status: 'Preparing',
        estimatedTime: '45 mins',
        statusColor: theme.warning
      },
      {
        meal: 'Rajasthani Royal Thali',
        vendor: 'Jaipur Spice Kitchen',
        time: '1:00 PM Tomorrow',
        status: 'Scheduled',
        estimatedTime: 'On time',
        statusColor: theme.primary
      }
    ],
    subscriptions: [
      {
        id: 'SUB001',
        vendor: 'Sharma Kitchen',
        plan: 'Weekly Plan',
        daysLeft: 4,
        totalDays: 7,
        nextDelivery: 'Tomorrow 1:00 PM',
        status: 'Active'
      },
      {
        id: 'SUB002',
        vendor: 'Chennai Express Kitchen',
        plan: 'Monthly Plan',
        daysLeft: 18,
        totalDays: 30,
        nextDelivery: 'Dec 30, 12:30 PM',
        status: 'Active'
      }
    ],
    monthlySpending: [
      { month: 'Aug', amount: 2100 },
      { month: 'Sep', amount: 2850 },
      { month: 'Oct', amount: 2650 },
      { month: 'Nov', amount: 3100 },
      { month: 'Dec', amount: 3240 }
    ]
  });

  useEffect(() => {
    fetchProfile();
    // Simulate loading
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/profile/`, {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setProfile(data.user);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      // Set mock profile data
      setProfile({
        first_name: 'Rajesh',
        last_name: 'Kumar',
        username: 'rajesh_kumar',
        email: 'rajesh.kumar@gmail.com',
        date_joined: '2024-01-15T10:30:00Z'
      });
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: theme.background }}
      >
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: theme.primary }}></div>
          <div className="text-xl font-semibold" style={{ color: theme.text }}>Loading your dashboard...</div>
        </div>
      </div>
    );
  }

  // Updated sidebar items to include Browse Menus
  const sidebarItems = [
    { id: 'overview', label: 'Dashboard', icon: FiHome },
    { id: 'browse_menus', label: 'Browse Menus', icon: MdRestaurant }, // NEW
    { id: 'orders', label: 'My Orders', icon: BsBoxSeam },
    { id: 'subscriptions', label: 'Subscriptions', icon: MdRestaurant },
    { id: 'payments', label: 'Payments', icon: BsCreditCard },
    { id: 'favorites', label: 'Favorites', icon: FiHeart },
    { id: 'profile', label: 'Profile', icon: FiUser },
    { id: 'settings', label: 'Settings', icon: FiSettings },
  ];

  // Function to render the active component
  const renderActiveComponent = () => {
    switch(activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Welcome Section */}
            <div>
              <h2 
                className="text-3xl font-bold mb-2"
                style={{ color: theme.text }}
              >
                Welcome back, {profile?.first_name || user?.username || 'Friend'}! 🍽️
              </h2>
              <p 
                className="text-lg"
                style={{ color: theme.textSecondary }}
              >
                Here's what's happening with your tiffin orders and subscriptions today.
              </p>
              <div className="mt-2 text-sm" style={{ color: theme.textSecondary }}>
                Last updated: {new Date().toLocaleString('en-IN', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {dashboardData.quickStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={index}
                    className="p-6 rounded-2xl border transition-all duration-200 hover:transform hover:scale-105 hover:shadow-lg"
                    style={{ 
                      backgroundColor: theme.panels,
                      borderColor: theme.border
                    }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: stat.bg }}
                      >
                        <Icon size={24} style={{ color: stat.color }} />
                      </div>
                      <FiTrendingUp 
                        size={16} 
                        style={{ color: theme.success }}
                      />
                    </div>
                    <h3 
                      className="text-sm font-medium mb-1"
                      style={{ color: theme.textSecondary }}
                    >
                      {stat.title}
                    </h3>
                    <p 
                      className="text-2xl font-bold mb-1"
                      style={{ color: theme.text }}
                    >
                      {stat.value}
                    </p>
                    <p 
                      className="text-xs"
                      style={{ color: theme.success }}
                    >
                      {stat.change}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Orders */}
              <div 
                className="p-6 rounded-2xl border"
                style={{ 
                  backgroundColor: theme.panels,
                  borderColor: theme.border
                }}
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 
                    className="text-xl font-bold flex items-center"
                    style={{ color: theme.text }}
                  >
                    <BsBoxSeam className="mr-3" style={{ color: theme.primary }} />
                    Recent Orders
                  </h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-sm px-3 py-1 rounded-lg transition-all duration-200 hover:scale-105"
                    style={{ 
                      backgroundColor: `${theme.primary}15`,
                      color: theme.primary 
                    }}
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-4 max-h-80 overflow-y-auto">
                  {dashboardData.recentOrders.map((order, index) => {
                    const Icon = order.icon;
                    return (
                      <div
                        key={index}
                        className="flex items-center space-x-4 p-4 rounded-xl transition-all duration-200 hover:transform hover:scale-102"
                        style={{ backgroundColor: theme.background }}
                      >
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: `${theme.primary}15` }}
                        >
                          <Icon size={20} style={{ color: theme.primary }} />
                        </div>
                        <div className="flex-1">
                          <h4 
                            className="font-semibold"
                            style={{ color: theme.text }}
                          >
                            {order.meal}
                          </h4>
                          <p 
                            className="text-sm"
                            style={{ color: theme.textSecondary }}
                          >
                            {order.vendor}
                          </p>
                          <p 
                            className="text-xs"
                            style={{ color: theme.textSecondary }}
                          >
                            {order.time} • {order.id}
                          </p>
                        </div>
                        <div className="text-right">
                          <p 
                            className="font-bold"
                            style={{ color: theme.success }}
                          >
                            {order.price}
                          </p>
                          <span 
                            className="text-xs px-2 py-1 rounded-full"
                            style={{ 
                              backgroundColor: `${order.statusColor}15`,
                              color: order.statusColor 
                            }}
                          >
                            {order.status}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Today's Schedule */}
              <div 
                className="p-6 rounded-2xl border"
                style={{ 
                  backgroundColor: theme.panels,
                  borderColor: theme.border
                }}
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 
                    className="text-xl font-bold flex items-center"
                    style={{ color: theme.text }}
                  >
                    <MdDeliveryDining className="mr-3" style={{ color: theme.secondary }} />
                    Upcoming Deliveries
                  </h3>
                  <button className="text-sm px-3 py-1 rounded-lg transition-all duration-200 hover:scale-105"
                    style={{ 
                      backgroundColor: `${theme.secondary}15`,
                      color: theme.secondary 
                    }}
                  >
                    <FiRefreshCw size={12} className="inline mr-1" />
                    Refresh
                  </button>
                </div>
                <div className="space-y-4">
                  {dashboardData.upcomingDeliveries.map((delivery, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-4 p-4 rounded-xl transition-all duration-200 hover:transform hover:scale-102"
                      style={{ backgroundColor: theme.background }}
                    >
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${theme.secondary}15` }}
                      >
                        <FiClock size={20} style={{ color: theme.secondary }} />
                      </div>
                      <div className="flex-1">
                        <h4 
                          className="font-semibold"
                          style={{ color: theme.text }}
                        >
                          {delivery.meal}
                        </h4>
                        <p 
                          className="text-sm"
                          style={{ color: theme.textSecondary }}
                        >
                          {delivery.vendor}
                        </p>
                        <p 
                          className="text-xs"
                          style={{ color: theme.textSecondary }}
                        >
                          {delivery.time} • ETA: {delivery.estimatedTime}
                        </p>
                      </div>
                      <span 
                        className="text-xs px-3 py-1 rounded-full font-medium"
                        style={{ 
                          backgroundColor: `${delivery.statusColor}15`,
                          color: delivery.statusColor
                        }}
                      >
                        {delivery.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Active Subscriptions */}
            <div 
              className="p-6 rounded-2xl border"
              style={{ 
                backgroundColor: theme.panels,
                borderColor: theme.border
              }}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 
                  className="text-xl font-bold flex items-center"
                  style={{ color: theme.text }}
                >
                  <MdRestaurant className="mr-3" style={{ color: theme.warning }} />
                  Active Subscriptions
                </h3>
                <button
                  onClick={() => setActiveTab('subscriptions')}
                  className="text-sm px-3 py-1 rounded-lg transition-all duration-200 hover:scale-105"
                  style={{ 
                    backgroundColor: `${theme.warning}15`,
                    color: theme.warning 
                  }}
                >
                  Manage All
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dashboardData.subscriptions.map((sub, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-xl border transition-all duration-200 hover:transform hover:scale-102"
                    style={{ 
                      backgroundColor: theme.background,
                      borderColor: theme.border 
                    }}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 
                          className="font-semibold"
                          style={{ color: theme.text }}
                        >
                          {sub.vendor}
                        </h4>
                        <p 
                          className="text-sm"
                          style={{ color: theme.textSecondary }}
                        >
                          {sub.plan} • {sub.id}
                        </p>
                      </div>
                      <span 
                        className="text-xs px-2 py-1 rounded-full"
                        style={{ 
                          backgroundColor: `${theme.success}15`,
                          color: theme.success 
                        }}
                      >
                        {sub.status}
                      </span>
                    </div>
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1" style={{ color: theme.textSecondary }}>
                        <span>Progress</span>
                        <span>{sub.daysLeft} days left</span>
                      </div>
                      <div 
                        className="w-full rounded-full h-2"
                        style={{ backgroundColor: `${theme.primary}20` }}
                      >
                        <div 
                          className="h-2 rounded-full transition-all duration-300"
                          style={{ 
                            backgroundColor: theme.primary,
                            width: `${((sub.totalDays - sub.daysLeft) / sub.totalDays) * 100}%`
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center text-xs" style={{ color: theme.textSecondary }}>
                      <FiClock className="mr-1" />
                      Next: {sub.nextDelivery}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Monthly Spending Chart */}
            <div 
              className="p-6 rounded-2xl border"
              style={{ 
                backgroundColor: theme.panels,
                borderColor: theme.border
              }}
            >
              <h3 
                className="text-xl font-bold mb-6 flex items-center"
                style={{ color: theme.text }}
              >
                <FiDollarSign className="mr-3" style={{ color: theme.success }} />
                Monthly Spending Overview
              </h3>
              <div className="grid grid-cols-5 gap-4">
                {dashboardData.monthlySpending.map((data, index) => (
                  <div key={index} className="text-center">
                    <div 
                      className="h-24 rounded-lg flex items-end justify-center mb-2"
                      style={{ backgroundColor: theme.background }}
                    >
                      <div 
                        className="w-8 rounded-t-lg transition-all duration-500"
                        style={{ 
                          backgroundColor: theme.primary,
                          height: `${(data.amount / 4000) * 100}%`,
                          minHeight: '20px'
                        }}
                      />
                    </div>
                    <p className="text-xs font-medium" style={{ color: theme.text }}>{data.month}</p>
                    <p className="text-xs" style={{ color: theme.textSecondary }}>₹{data.amount}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm" style={{ color: theme.textSecondary }}>
                  Average monthly spending: ₹2,768 • 
                  <span style={{ color: theme.success }}> ₹12,450 saved this year</span>
                </p>
              </div>
            </div>
          </div>
        );
      
      case 'browse_menus':
        return <MenuComponent />;
      
      case 'orders':
        return (
          <div className="p-6 rounded-2xl border" style={{ backgroundColor: theme.panels, borderColor: theme.border }}>
            <h2 className="text-2xl font-bold mb-4" style={{ color: theme.text }}>My Orders</h2>
            <p style={{ color: theme.textSecondary }}>Your order history and tracking will appear here.</p>
          </div>
        );
      
      case 'subscriptions':
        return (
          <div className="p-6 rounded-2xl border" style={{ backgroundColor: theme.panels, borderColor: theme.border }}>
            <h2 className="text-2xl font-bold mb-4" style={{ color: theme.text }}>My Subscriptions</h2>
            <p style={{ color: theme.textSecondary }}>Manage your meal subscriptions here.</p>
          </div>
        );
      
      case 'payments':
        return (
          <div className="p-6 rounded-2xl border" style={{ backgroundColor: theme.panels, borderColor: theme.border }}>
            <h2 className="text-2xl font-bold mb-4" style={{ color: theme.text }}>Payment History</h2>
            <p style={{ color: theme.textSecondary }}>Your payment history and methods will appear here.</p>
          </div>
        );
      
      case 'favorites':
        return (
          <div className="p-6 rounded-2xl border" style={{ backgroundColor: theme.panels, borderColor: theme.border }}>
            <h2 className="text-2xl font-bold mb-4" style={{ color: theme.text }}>Favorite Vendors</h2>
            <p style={{ color: theme.textSecondary }}>Your favorite vendors and dishes will appear here.</p>
          </div>
        );
      
      case 'profile':
        return (
          <div className="p-6 rounded-2xl border" style={{ backgroundColor: theme.panels, borderColor: theme.border }}>
            <h2 className="text-2xl font-bold mb-4" style={{ color: theme.text }}>My Profile</h2>
            <p style={{ color: theme.textSecondary }}>Manage your profile information here.</p>
          </div>
        );
      
      case 'settings':
        return (
          <div className="p-6 rounded-2xl border" style={{ backgroundColor: theme.panels, borderColor: theme.border }}>
            <h2 className="text-2xl font-bold mb-4" style={{ color: theme.text }}>Settings</h2>
            <p style={{ color: theme.textSecondary }}>App settings and preferences will appear here.</p>
          </div>
        );
      
      default:
        return (
          <div className="p-6 rounded-2xl border" style={{ backgroundColor: theme.panels, borderColor: theme.border }}>
            <h2 className="text-2xl font-bold mb-4" style={{ color: theme.text }}>Page Not Found</h2>
            <p style={{ color: theme.textSecondary }}>The requested page could not be found.</p>
          </div>
        );
    }
  };

  return (
    <div 
      className="min-h-screen transition-all duration-300"
      style={{ backgroundColor: theme.background }}
    >
      {/* Header */}
      <header 
        className="border-b sticky top-0 z-40 backdrop-blur-md"
        style={{ 
          backgroundColor: `${theme.panels}95`,
          borderColor: theme.border 
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: theme.primary }}
              >
                <MdRestaurant size={24} color="white" />
              </div>
              <h1 
                className="text-2xl font-bold"
                style={{ color: theme.text }}
              >
                NourishNet
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button 
                className="p-2 rounded-lg hover:opacity-80 transition-opacity relative"
                style={{ 
                  backgroundColor: theme.panels,
                  color: theme.textSecondary 
                }}
              >
                <FiBell size={20} />
                <span 
                  className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
                  style={{ backgroundColor: theme.primary }}
                ></span>
              </button>

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
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: theme.secondary }}
                >
                  <FiUser size={16} color="white" />
                </div>
                <span 
                  className="font-medium"
                  style={{ color: theme.text }}
                >
                  {profile?.first_name || user?.username || 'User'}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:transform hover:scale-105"
                style={{ 
                  backgroundColor: theme.error,
                  color: 'white'
                }}
              >
                <FiLogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside 
          className="w-64 min-h-screen border-r"
          style={{ 
            backgroundColor: theme.panels,
            borderColor: theme.border 
          }}
        >
          <nav className="p-4 space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    isActive ? 'transform scale-105' : 'hover:transform hover:scale-102'
                  }`}
                  style={{
                    backgroundColor: isActive ? theme.primary : 'transparent',
                    color: isActive ? 'white' : theme.textSecondary
                  }}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Sidebar Footer - Quick Stats */}
          <div className="p-4 border-t" style={{ borderColor: theme.border }}>
            <div className="space-y-3">
              <div className="text-center">
                <div className="text-lg font-bold" style={{ color: theme.success }}>₹12,450</div>
                <div className="text-xs" style={{ color: theme.textSecondary }}>Total Saved</div>
              </div>
              <div className="flex justify-between text-xs" style={{ color: theme.textSecondary }}>
                <span>This Month: ₹3,240</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {renderActiveComponent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;