import React, { useState, useEffect } from "react";
import { useVendorAuth } from "../../context/VendorAuthContext";
import { useTheme } from "../../context/ThemeContext";
import MenuItems from "./MenuItems";
import DailyMenus from "./DailyMenus";
import Orders from './Orders';
import Analytics from './Analytics';
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
const DashboardOverview = ({ theme, dashboardData }) => {
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
      change: `${dashboardData?.activeMenuItems || 0} active`,
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
          Welcome back, {dashboardData?.vendorInfo?.kitchen_name || 'Chef'}! 👨‍🍳
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
                {dashboardData?.vendorInfo?.kitchen_name || "Not Set"}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 rounded-xl transition-all duration-200" 
              style={{ backgroundColor: theme.background }}>
              <span className="font-medium" style={{ color: theme.textSecondary }}>Active Menus</span>
              <span className="font-semibold" style={{ color: theme.text }}>
                {dashboardData?.activeMenus || 0}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 rounded-xl transition-all duration-200" 
              style={{ backgroundColor: theme.background }}>
              <span className="font-medium" style={{ color: theme.textSecondary }}>Verification</span>
              <div className="flex items-center gap-2">
                {dashboardData?.vendorInfo?.is_verified ? (
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
                      Order #{order.id.slice(-6)}
                    </p>
                    <p className="text-xs" style={{ color: theme.textSecondary }}>
                      {new Date(order.created_at).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold" style={{ color: theme.success }}>
                      ₹{order.total_amount}
                    </p>
                    <span className="text-xs px-2 py-1 rounded-full"
                      style={{
                        backgroundColor: order.status === 'delivered' ? `${theme.success}15` : `${theme.warning}15`,
                        color: order.status === 'delivered' ? theme.success : theme.warning
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

      {/* Recent Menus */}
      <div className="rounded-2xl border p-6"
        style={{ backgroundColor: theme.panels, borderColor: theme.border }}>
        <h3 className="text-xl font-bold mb-6 flex items-center" style={{ color: theme.text }}>
          <MdFoodBank className="mr-3" style={{ color: theme.primary }} /> 
          Recent Menus
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dashboardData?.recentMenus?.length > 0 ? (
            dashboardData.recentMenus.map((menu) => (
              <div key={menu._id} 
                className="p-4 rounded-xl border transition-all duration-200 hover:transform hover:scale-102"
                style={{ 
                  backgroundColor: theme.background,
                  borderColor: theme.border 
                }}>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold" style={{ color: theme.text }}>
                    {menu.name}
                  </h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium`}
                    style={{
                      backgroundColor: menu.is_active ? `${theme.success}15` : `${theme.error}15`,
                      color: menu.is_active ? theme.success : theme.error
                    }}>
                    {menu.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-sm mb-2" style={{ color: theme.textSecondary }}>
                  {menu.date}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm" style={{ color: theme.textSecondary }}>
                    Price: ₹{menu.full_dabba_price}
                  </span>
                  <span className="text-sm font-medium" style={{ color: theme.primary }}>
                    {menu.dabbas_sold}/{menu.max_dabbas}
                  </span>
                </div>
                {menu.dabbas_remaining > 0 && (
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="h-2 rounded-full" 
                      style={{
                        backgroundColor: theme.primary,
                        width: `${(menu.dabbas_sold / menu.max_dabbas) * 100}%`
                      }}></div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-8" style={{ color: theme.textSecondary }}>
              No menus found. Create your first menu!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

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
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;

  const getVendorAuthHeaders = () => {
    const token = localStorage.getItem('vendor_token');
    return { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      console.log('Fetching dashboard data...');
      const response = await fetch(
        `${API_URL}/api/vendor/dashboard`,
        { headers: getVendorAuthHeaders() }
      );

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (data.success && data.dashboard_data) {
        const dashboard = data.dashboard_data;
        const processedData = {
          totalOrders: dashboard.statistics?.total_orders || 0,
          activeCustomers: dashboard.statistics?.active_customers || 0,
          revenue: dashboard.statistics?.total_revenue || 0,
          totalMenuItems: dashboard.statistics?.total_menu_items || 0,
          activeMenuItems: dashboard.statistics?.active_menu_items || 0,
          activeMenus: dashboard.statistics?.active_menus || 0,
          vendorInfo: dashboard.vendor_info || {},
          recentOrders: dashboard.recent_orders || [],
          recentMenus: dashboard.recent_menus || []
        };
        console.log('Processed data:', processedData);
        setDashboardData(processedData);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const sidebarItems = [
    { id: 'overview', label: 'Dashboard', icon: FaHome, component: <DashboardOverview theme={theme} dashboardData={dashboardData} /> },
    { id: 'menu-items', label: 'Manage Dishes', icon: IoFastFood, component: <MenuItems /> },
    { id: 'daily-menus', label: 'Daily Tiffins', icon: MdFoodBank, component: <DailyMenus /> },
    { id: 'orders', label: 'Orders', icon: FaBoxes, component: <Orders /> },
    { id: 'analytics', label: 'Analytics', icon: FaChartLine, component: <Analytics /> },
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
                NourishNet Vendor
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* Vendor Status */}
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
                style={{
                  backgroundColor: dashboardData?.vendorInfo?.is_verified ? `${theme.success}15` : `${theme.warning}15`,
                  color: dashboardData?.vendorInfo?.is_verified ? theme.success : theme.warning
                }}>
                {dashboardData?.vendorInfo?.is_verified ? "Verified" : "Pending Verification"}
              </span>

              {/* Notifications */}
              <button 
                className="p-2 rounded-lg hover:opacity-80 transition-opacity relative"
                style={{ 
                  backgroundColor: theme.panels,
                  color: theme.textSecondary 
                }}
              >
                <FaBell size={20} />
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
                {isDarkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
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
                  {vendor?.business_name || 'Vendor'}
                </span>
              </div>

              <button
                onClick={logout}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:transform hover:scale-105"
                style={{ 
                  backgroundColor: theme.error,
                  color: 'white'
                }}
              >
                <FaSignOutAlt size={16} />
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

      <Footer variant="simple" style={{ marginTop: '40px' }} />
    </div>
  );
};

export default VendorDashboard;