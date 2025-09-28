import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import OrderForm from '../../components/OrderForm';
import SubscriptionManagement from '../../components/SuscriptionForm';
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
  FiRotateCcw
} from 'react-icons/fi';
import { FaMicrophone } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ConsumerChatbot from '../../components/ConsumerChatbot';
import { 
  MdRestaurant, 
  MdDeliveryDining,
  MdFastfood,
  MdLocationOn
} from 'react-icons/md';
import { 
  BsBoxSeam,
  BsCreditCard,
  BsPiggyBank
} from 'react-icons/bs';

// Dummy Components - Replace these with your actual components
const OverviewComponent = ({ profile, user, theme }) => {
  const quickStats = [
    {
      title: 'Active Orders',
      value: '3',
      change: '+2 from yesterday',
      icon: BsBoxSeam,
      color: theme.secondary,
      bg: `${theme.secondary}15`
    },
    {
      title: 'This Month',
      value: '₹2,450',
      change: '+15% from last month',
      icon: FiDollarSign,
      color: theme.primary,
      bg: `${theme.primary}15`
    },
    {
      title: 'Total Saved',
      value: '₹8,200',
      change: 'Compared to dining out',
      icon: BsPiggyBank,
      color: theme.success,
      bg: `${theme.success}15`
    },
    {
      title: 'Favorite Meals',
      value: '12',
      change: 'Most ordered items',
      icon: FiHeart,
      color: '#E91E63',
      bg: '#E91E6315'
    }
  ];

  const recentOrders = [
    {
      id: '#ORD001',
      meal: 'Dal Rice Combo',
      vendor: 'Sharma Tiffin Service',
      time: 'Today, 12:30 PM',
      price: '₹85',
      status: 'Delivered',
      icon: MdFastfood
    },
    {
      id: '#ORD002',
      meal: 'Roti Sabji Combo',
      vendor: 'Homely Kitchen',
      time: 'Yesterday, 1:00 PM',
      price: '₹75',
      status: 'Delivered',
      icon: MdRestaurant
    },
    {
      id: '#ORD003',
      meal: 'Biryani Special',
      vendor: 'Spice Garden',
      time: '2 days ago, 12:45 PM',
      price: '₹120',
      status: 'Delivered',
      icon: MdFastfood
    }
  ];

  const upcomingDeliveries = [
    {
      meal: 'Punjabi Thali',
      vendor: 'Delhi Darbar',
      time: '1:00 PM Today',
      status: 'Preparing'
    },
    {
      meal: 'South Indian Combo',
      vendor: 'Chennai Express',
      time: '7:30 PM Today',
      status: 'Scheduled'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h2 
          className="text-3xl font-bold mb-2"
          style={{ color: theme.text }}
        >
          Welcome back, {profile?.first_name || user?.username}! 🍽️
        </h2>
        <p 
          className="text-lg"
          style={{ color: theme.textSecondary }}
        >
          Here's what's happening with your tiffin subscriptions today.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => {
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
          <h3 
            className="text-xl font-bold mb-6 flex items-center"
            style={{ color: theme.text }}
          >
            <BsBoxSeam className="mr-3" style={{ color: theme.primary }} />
            Recent Orders
          </h3>
          <div className="space-y-4">
            {recentOrders.map((order, index) => {
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
                      {order.time}
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
                        backgroundColor: `${theme.success}15`,
                        color: theme.success 
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

        {/* Upcoming Deliveries */}
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
            <MdDeliveryDining className="mr-3" style={{ color: theme.secondary }} />
            Today's Schedule
          </h3>
          <div className="space-y-4">
            {upcomingDeliveries.map((delivery, index) => (
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
                    {delivery.time}
                  </p>
                </div>
                <span 
                  className="text-xs px-3 py-1 rounded-full font-medium"
                  style={{ 
                    backgroundColor: delivery.status === 'Preparing' ? `${theme.warning}15` : `${theme.primary}15`,
                    color: delivery.status === 'Preparing' ? theme.warning : theme.primary
                  }}
                >
                  {delivery.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const OrdersComponent = () => (
  <div style={{ padding: '20px', backgroundColor: '#e8f5e9', borderRadius: '8px' }}>
    <h2>Orders Component</h2>
    <p>This is a dummy orders component. Replace with actual orders list.</p>
  </div>
);

const SubscriptionsComponent = () => (
  <div style={{ padding: '20px', backgroundColor: '#e3f2fd', borderRadius: '8px' }}>
    <h2>Subscriptions Component</h2>
    <p>This is a dummy subscriptions component. Replace with actual subscriptions.</p>
  </div>
);

const PaymentsComponent = () => (
  <div style={{ padding: '20px', backgroundColor: '#fce4ec', borderRadius: '8px' }}>
    <h2>Payments Component</h2>
    <p>This is a dummy payments component. Replace with actual payment history.</p>
  </div>
);

const ProfileComponent = ({ profile, theme }) => {
  if (!profile) {
    return (
      <div className="space-y-6">
        <h2 
          className="text-3xl font-bold"
          style={{ color: theme.text }}
        >
          Profile Information
        </h2>
        <p style={{ color: theme.textSecondary }}>Loading profile information...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 
        className="text-3xl font-bold"
        style={{ color: theme.text }}
      >
        Profile Information
      </h2>
      
      <div 
        className="p-8 rounded-2xl border max-w-2xl"
        style={{ 
          backgroundColor: theme.panels,
          borderColor: theme.border
        }}
      >
        <div className="flex items-center space-x-6 mb-8">
          <div 
            className="w-20 h-20 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: theme.primary }}
          >
            <FiUser size={32} color="white" />
          </div>
          <div>
            <h3 
              className="text-2xl font-bold"
              style={{ color: theme.text }}
            >
              {profile.first_name} {profile.last_name}
            </h3>
            <p 
              className="text-lg"
              style={{ color: theme.textSecondary }}
            >
              @{profile.username}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <FiUser size={20} style={{ color: theme.textSecondary }} />
              <div>
                <p 
                  className="text-sm font-medium"
                  style={{ color: theme.textSecondary }}
                >
                  Username
                </p>
                <p 
                  className="font-semibold"
                  style={{ color: theme.text }}
                >
                  {profile.username}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <FiMail size={20} style={{ color: theme.textSecondary }} />
              <div>
                <p 
                  className="text-sm font-medium"
                  style={{ color: theme.textSecondary }}
                >
                  Email
                </p>
                <p 
                  className="font-semibold"
                  style={{ color: theme.text }}
                >
                  {profile.email}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <FiCalendar size={20} style={{ color: theme.textSecondary }} />
              <div>
                <p 
                  className="text-sm font-medium"
                  style={{ color: theme.textSecondary }}
                >
                  Member Since
                </p>
                <p 
                  className="font-semibold"
                  style={{ color: theme.text }}
                >
                  {new Date(profile.date_joined).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <FiStar size={20} style={{ color: theme.textSecondary }} />
              <div>
                <p 
                  className="text-sm font-medium"
                  style={{ color: theme.textSecondary }}
                >
                  Account Status
                </p>
                <span 
                  className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium"
                  style={{ 
                    backgroundColor: `${theme.success}15`,
                    color: theme.success 
                  }}
                >
                  Active Premium
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SettingsComponent = () => (
  <div style={{ padding: '20px', backgroundColor: '#fff3e0', borderRadius: '8px' }}>
    <h2>Settings Component</h2>
    <p>This is a dummy settings component. Replace with actual settings.</p>
  </div>
);

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme, theme } = useTheme();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchProfile();
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
    } finally {
      setLoading(false);
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
          <div className="text-xl font-semibold" style={{ color: theme.text }}>Loading...</div>
        </div>
      </div>
    );
  }

 const sidebarItems = [
  { id: 'overview', label: 'Overview', icon: FiHome, component: <OverviewComponent profile={profile} user={user} theme={theme} /> },
  { id: 'orders', label: 'My Orders', icon: BsBoxSeam, component: <OrderForm user={user} theme={theme} /> },
  { id: 'subscriptions', label: 'Subscriptions', icon: MdRestaurant, component: <SubscriptionManagement user={user} theme={theme} /> },
  { id: 'payments', label: 'Payments', icon: BsCreditCard, component: <PaymentsComponent /> },
  { id: 'profile', label: 'Profile', icon: FiUser, component: <ProfileComponent profile={profile} theme={theme} /> },
  { id: 'settings', label: 'Settings', icon: FiSettings, component: <SettingsComponent /> },
];

  // Get the active component
  const activeItem = sidebarItems.find(item => item.id === activeTab);
  const ActiveComponent = activeItem?.component || <div>Component not found</div>;

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
                  {user?.first_name || user?.username}
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
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {ActiveComponent}
        </main>
      </div>

      {/* Fixed Voice Router Icon at Bottom */}
      <button
        onClick={handleVoiceStart}
        className={`fixed bottom-8 left-8 z-40 p-4 rounded-full shadow-lg border-2 flex items-center justify-center backdrop-blur-md transition-all duration-200 ${
          listening ? 'animate-pulse scale-110' : 'hover:scale-110'
        }`}
        style={{ 
          backgroundColor: listening ? theme.secondary : `${theme.panels}95`, 
          borderColor: listening ? theme.secondary : theme.primary, 
          color: listening ? 'white' : theme.primary 
        }}
        title={listening ? 'Listening...' : 'Voice Navigation'}
        aria-label="Voice Navigation"
      >
        <FaMicrophone size={24} />
      </button>

      {/* Chatbot Component */}
      <ConsumerChatbot />
    </div>
    
    {/* Premium Footer */}
    <Footer />
    </>
  );
};

export default Dashboard;