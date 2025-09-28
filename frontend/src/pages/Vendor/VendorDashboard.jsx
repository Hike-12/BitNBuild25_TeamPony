import React, { useState, useEffect, useContext } from "react";
import { useVendorAuth } from "../../context/VendorAuthContext";
import { useTheme } from "../../context/ThemeContext";
import MenuItems from "./MenuItems";
import DailyMenus from "./DailyMenus";
import { 
  FaSun, 
  FaMoon, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaLeaf, 
  FaFire, 
  FaClock, 
  FaRupeeSign,
  FaUsers,
  FaShoppingBag,
  FaUtensils,
  FaChartLine,
  FaHome,
  FaBoxes,
  FaCalendarAlt,
  FaCog,
  FaSignOutAlt,
  FaBell
} from "react-icons/fa";
import { 
  MdDeliveryDining, 
  MdRestaurant, 
  MdFoodBank,
  MdDashboard 
} from "react-icons/md";
import { 
  GiIndianPalace, 
  GiHotMeal, 
  GiCookingPot 
} from "react-icons/gi";
import { IoFastFood } from "react-icons/io5";
import { FiUser, FiStar, FiTrendingUp } from "react-icons/fi";
import { BsBoxSeam } from "react-icons/bs";
import Footer from "../../components/Footer";

// Dashboard Overview Component
const DashboardOverview = ({ theme, dashboardData, vendorInfo }) => {
  const quickStats = [
    {
      title: 'Total Orders',
      value: dashboardData?.totalOrders || 0,
      change: '+12%',
      icon: FaShoppingBag,
      color: theme.primary,
      bg: `${theme.primary}15`
    },
    {
      title: 'Active Customers',
      value: dashboardData?.activeCustomers || 0,
      change: '+8%',
      icon: FaUsers,
      color: theme.success,
      bg: `${theme.success}15`
    },
    {
      title: 'Revenue',
      value: `₹${dashboardData?.revenue?.toLocaleString() || 0}`,
      change: '+15%',
      icon: FaRupeeSign,
      color: theme.warning,
      bg: `${theme.warning}15`
    },
    {
      title: 'Menu Items',
      value: dashboardData?.totalMenuItems || 0,
      change: `${dashboardData?.outOfStockItems || 0} out`,
      icon: FaUtensils,
      color: theme.secondary,
      bg: `${theme.secondary}15`
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h2 className="text-3xl font-bold mb-2" style={{ color: theme.text }}>
          Welcome back, {vendorInfo?.first_name || vendorInfo?.username}! 👨‍🍳
        </h2>
        <p className="text-lg" style={{ color: theme.textSecondary }}>
          Here's your kitchen overview for today
        </p>
      </div>

      {/* Stats Cards */}
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

      {/* Business Info and Recent Orders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kitchen Info */}
        <div className="rounded-2xl border p-6" 
          style={{ backgroundColor: theme.panels, borderColor: theme.border }}>
          <h3 className="text-xl font-bold mb-6 flex items-center" style={{ color: theme.text }}>
            <MdRestaurant className="mr-3" style={{ color: theme.primary }} /> 
            Your Kitchen
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 rounded-xl transition-all duration-200" 
              style={{ backgroundColor: theme.background }}>
              <span className="font-medium" style={{ color: theme.textSecondary }}>Business</span>
              <span className="font-semibold" style={{ color: theme.text }}>
                {vendorInfo?.kitchen_name || "Not Set"}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 rounded-xl transition-all duration-200" 
              style={{ backgroundColor: theme.background }}>
              <span className="font-medium" style={{ color: theme.textSecondary }}>Owner</span>
              <span className="font-semibold" style={{ color: theme.text }}>
                {vendorInfo?.first_name} {vendorInfo?.last_name}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 rounded-xl transition-all duration-200" 
              style={{ backgroundColor: theme.background }}>
              <span className="font-medium" style={{ color: theme.textSecondary }}>Verification</span>
              <div className="flex items-center gap-2">
                {vendorInfo?.is_verified ? (
                  <>
                    <FaCheckCircle style={{ color: theme.success }} />
                    <span style={{ color: theme.success }}>Verified</span>
                  </>
                ) : (
                  <>
                    <FaClock style={{ color: theme.warning }} />
                    <span style={{ color: theme.warning }}>Pending</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="rounded-2xl border p-6"
          style={{ backgroundColor: theme.panels, borderColor: theme.border }}>
          <h3 className="text-xl font-bold mb-6 flex items-center" style={{ color: theme.text }}>
            <BsBoxSeam className="mr-3" style={{ color: theme.primary }} /> 
            Recent Orders
          </h3>
          <div className="space-y-4 max-h-64 overflow-y-auto">
            {dashboardData?.recentOrders?.length > 0 ? (
              dashboardData.recentOrders.map((order) => (
                <div key={order.id} 
                  className="flex items-center space-x-4 p-4 rounded-xl transition-all duration-200 hover:transform hover:scale-102"
                  style={{ backgroundColor: theme.background }}>
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${theme.primary}15` }}
                  >
                    <IoFastFood size={20} style={{ color: theme.primary }} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold" style={{ color: theme.text }}>
                      {order.customer_name}
                    </h4>
                    <p className="text-sm" style={{ color: theme.textSecondary }}>
                      Order #{order.id}
                    </p>
                    <p className="text-xs" style={{ color: theme.textSecondary }}>
                      {new Date(order.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold" style={{ color: theme.success }}>
                      ₹{order.total_amount}
                    </p>
                    <span className="text-xs px-2 py-1 rounded-full"
                      style={{
                        backgroundColor: `${theme.warning}15`,
                        color: theme.warning
                      }}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8" style={{ color: theme.textSecondary }}>
                No recent orders found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Orders Component (placeholder)
const OrdersComponent = ({ theme }) => (
  <div className="p-6 rounded-2xl border" style={{ backgroundColor: theme.panels, borderColor: theme.border }}>
    <h2 style={{ color: theme.text }}>Orders Management</h2>
    <p style={{ color: theme.textSecondary }}>This is where you'll manage all your orders. Coming soon!</p>
  </div>
);

// Analytics Component (placeholder)
const AnalyticsComponent = ({ theme }) => (
  <div className="p-6 rounded-2xl border" style={{ backgroundColor: theme.panels, borderColor: theme.border }}>
    <h2 style={{ color: theme.text }}>Analytics Dashboard</h2>
    <p style={{ color: theme.textSecondary }}>View your business analytics and insights here. Coming soon!</p>
  </div>
);

// Settings Component (placeholder)
const SettingsComponent = ({ theme }) => (
  <div className="p-6 rounded-2xl border" style={{ backgroundColor: theme.panels, borderColor: theme.border }}>
    <h2 style={{ color: theme.text }}>Vendor Settings</h2>
    <p style={{ color: theme.textSecondary }}>Manage your vendor settings and preferences. Coming soon!</p>
  </div>
);

// Main Vendor Dashboard Component
const VendorDashboard = () => {
  const { vendor, logout } = useVendorAuth();
  const { theme, isDarkMode, toggleTheme } = useContext(ThemeContext);
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const getVendorAuthHeaders = () => {
    const token = localStorage.getItem('vendor_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/vendor/dashboard/`,
        { headers: getVendorAuthHeaders() }
      );

      const data = await response.json();
      if (data.success) {
        setDashboardData(data);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

const sidebarItems = [
  { id: 'overview', label: 'Dashboard', icon: FaHome, component: <DashboardOverview theme={theme} dashboardData={dashboardData} vendorInfo={vendor} /> },
  { id: 'menu-items', label: 'Manage Dishes', icon: IoFastFood, component: <MenuItems /> },
  { id: 'daily-menus', label: 'Daily Tiffins', icon: MdFoodBank, component: <DailyMenus /> },
  { id: 'orders', label: 'Order Tracking', icon: FaBoxes, component: (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl border" style={{ backgroundColor: theme.panels, borderColor: theme.border }}>
        <h2 className="text-2xl font-bold mb-4" style={{ color: theme.text }}>Order Tracking Dashboard</h2>
        <p className="mb-4" style={{ color: theme.textSecondary }}>Monitor and track all your orders in real-time</p>
      </div>
      <div className="h-96 rounded-2xl border overflow-hidden" style={{ borderColor: theme.border }}>
        <OrderTracker userType="vendor" />
      </div>
    </div>
  ) },
  { id: 'analytics', label: 'Analytics', icon: FaChartLine, component: <AnalyticsComponent theme={theme} /> },
  { id: 'settings', label: 'Settings', icon: FaCog, component: <SettingsComponent theme={theme} /> },
];
  const activeItem = sidebarItems.find(item => item.id === activeTab);
  const ActiveComponent = activeItem?.component || <div>Component not found</div>;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.background }}>
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: theme.primary }}></div>
          <div className="text-xl font-semibold" style={{ color: theme.text }}>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen transition-all duration-300 relative" style={{ backgroundColor: theme.background }}>
      {/* Premium Background Image/Pattern */}
      <div className="absolute inset-0 z-0" style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'),
          linear-gradient(135deg, ${theme.background} 80%, ${theme.panels} 100%)`,
        backgroundSize: 'cover, 100% 100%',
        backgroundPosition: 'center, center',
        opacity: isDarkMode ? 0.18 : 0.12,
        pointerEvents: 'none'
      }} />
      <header className="border-b sticky top-0 z-50 backdrop-blur-xl shadow-lg"
        style={{ 
          background: isDarkMode
            ? `linear-gradient(90deg, ${theme.panels} 80%, ${theme.primary}10 100%)`
            : `linear-gradient(90deg, ${theme.panels} 80%, ${theme.primary}05 100%)`,
          borderColor: theme.border
        }}>
        <div className="flex items-center justify-between px-8 py-4">
          <div className="flex items-center gap-4">
            {/* Sidebar Toggle Button */}
            <button
              className="p-2 rounded-full bg-white/20 hover:bg-white/40 transition-all shadow-lg"
              onClick={() => setSidebarOpen((open) => !open)}
              style={{ border: `1px solid ${theme.border}` }}
              aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                {sidebarOpen ? (
                  <polyline points="6 9 12 15 18 9" />
                ) : (
                  <polyline points="18 15 12 9 6 15" />
                )}
              </svg>
            </button>
            <h1 className="text-3xl font-extrabold tracking-tight" style={{ fontFamily: 'Playfair Display, serif', color: theme.text }}>
              Vendor Dashboard
            </h1>
          </div>
          <button
            className="px-4 py-2 rounded-xl font-semibold shadow-md"
            style={{
              background: `linear-gradient(90deg, ${theme.primary} 0%, ${theme.secondary} 100%)`,
              color: 'white',
              fontFamily: 'Playfair Display, serif',
              border: `1px solid ${theme.border}`
            }}
            onClick={toggleTheme}
          >
            {isDarkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </header>
      <div className="flex relative z-10">
        {/* Sidebar */}
        <aside
          className={`min-h-screen border-r shadow-xl transition-all duration-300 ${sidebarOpen ? 'w-72' : 'w-20'} flex flex-col items-center justify-between`}
          style={{
            background: `linear-gradient(135deg, ${theme.primary}cc 60%, ${theme.panels}ee 100%)`,
            borderColor: theme.border,
            backdropFilter: 'blur(16px)',
            boxShadow: `0 8px 32px 0 ${theme.primary}40`,
            opacity: 0.92
          }}
        >
          <nav className={`p-6 space-y-3 w-full ${sidebarOpen ? '' : 'px-2'}`}>
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-semibold transition-all duration-200 w-full ${
                    isActive ? 'bg-gradient-to-r from-primary to-secondary scale-105 shadow-lg' : 'hover:bg-gradient-to-r hover:from-primary/10 hover:to-secondary/10 hover:scale-102'
                  }`}
                  style={{
                    background: isActive ? `linear-gradient(90deg, ${theme.primary} 0%, ${theme.secondary} 100%)` : 'transparent',
                    color: isActive ? 'white' : theme.textSecondary,
                    border: isActive ? `2px solid ${theme.primary}` : 'none',
                    boxShadow: isActive ? `0 4px 24px ${theme.primary}30` : 'none',
                    fontFamily: 'Playfair Display, serif',
                    justifyContent: sidebarOpen ? 'flex-start' : 'center'
                  }}
                >
                  <Icon size={22} />
                  {sidebarOpen && <span>{item.label}</span>}
                </button>
              );
            })}
          </nav>
          {/* Sidebar collapse/expand label */}
          <div className="mb-6">
            <span className="text-xs text-white/60 font-semibold" style={{ fontFamily: 'Playfair Display, serif' }}>
              {sidebarOpen ? "Collapse" : "Expand"}
            </span>
          </div>
        </aside>
        {/* Main Content */}
        <main className="flex-1 p-8 bg-transparent">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Crisp Card Layout for Active Component */}
            <div className="rounded-3xl shadow-2xl bg-white/80 dark:bg-black/60 backdrop-blur-xl border border-gray-200 dark:border-gray-700 p-8 transition-all duration-300" style={{ boxShadow: `0 8px 32px 0 ${theme.primary}20` }}>
              {ActiveComponent}
            </div>
            {/* Quick Stats Card Example */}
            <div className="rounded-3xl shadow-2xl bg-gradient-to-br from-primary/30 to-secondary/20 backdrop-blur-xl border border-gray-200 dark:border-gray-700 p-8 flex flex-col gap-6 justify-center items-center transition-all duration-300">
              <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif', color: theme.text }}>
                Quick Stats
              </h2>
              <div className="grid grid-cols-2 gap-6 w-full">
                {quickStats.map((stat) => (
                  <div key={stat.label} className="rounded-xl bg-white/60 dark:bg-black/40 p-4 shadow-md flex flex-col items-center justify-center border border-gray-100 dark:border-gray-800">
                    <span className="text-lg font-semibold" style={{ color: theme.primary }}>{stat.value}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-300 mt-1">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
      {/* Premium Footer with spacing */}
      <Footer variant="simple" style={{ marginTop: '40px' }} />
    </div>
  );
};

export default VendorDashboard;