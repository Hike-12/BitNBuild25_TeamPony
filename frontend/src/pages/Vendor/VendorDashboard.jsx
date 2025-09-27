import React, { useState, useEffect } from "react";
import { FaGem } from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";
import { useVendorAuth } from "../../context/VendorAuthContext";
import { FaUsers, FaRupeeSign, FaShoppingBag, FaUtensils, FaChartLine } from "react-icons/fa";
import { MdDashboard, MdRestaurant } from "react-icons/md";

const VendorDashboard = () => {
  const { isDarkMode, theme } = useTheme();
  const [showOverview, setShowOverview] = useState(false);
  const { vendor, logout } = useVendorAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  // Theme matching VendorMenuManager
  const [isDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

  const theme = isDarkMode ? {
    background: "#121212",
    panels: "#1D1D1D",
    primary: "#00BCD4",
    secondary: "#64FFDA",
    text: "#E0E0E0",
    textSecondary: "#BDBDBD",
    border: "#333333",
    error: "#FF5555",
    success: "#69F0AE",
    warning: "#FFEA00",
  } : {
    background: "#FFFFFF",
    panels: "#F2F4F7",
    primary: "#144640",
    secondary: "#607D8B",
    text: "#212121",
    textSecondary: "#757575",
    border: "#E0E0E0",
    error: "#D32F2F",
    success: "#144640",
    warning: "#FBC02D",
  };

  const getVendorAuthHeaders = () => {
    const token = localStorage.getItem('vendor_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    fetchProfile();
    fetchDashboardData();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/vendor/profile/`,
        { headers: getVendorAuthHeaders() }
      );
      if (response.ok) {
        const data = await response.json();
        setProfile(data.user);
      }
    } catch (error) {
      console.error("Failed to fetch vendor profile:", error);
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: theme.background }}>
        <div className="text-xl" style={{ color: theme.text }}>Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: theme.background }}>
      {/* Floating Info Icon */}
      <button
        onClick={() => setShowOverview(true)}
        className="fixed bottom-8 right-8 z-50 p-4 rounded-full shadow-lg border-2 flex items-center justify-center backdrop-blur-md hover:scale-110 transition-all"
        style={{
          backgroundColor: `${theme.panels}95`,
          borderColor: theme.primary,
          color: theme.primary,
        }}
        aria-label="Show Page Overview"
      >
        <FaGem style={{ fontSize: '2rem' }} />
      </button>

      {/* Page Overview Modal */}
      {showOverview && (
        <div
          id="overview-modal-bg"
          className="fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-lg"
          style={{
            background: isDarkMode
              ? 'rgba(20, 20, 20, 0.25)'
              : 'rgba(255, 255, 255, 0.25)',
            transition: 'background 0.3s',
          }}
          onClick={e => { if (e.target.id === 'overview-modal-bg') setShowOverview(false); }}
        >
          <div
            className="relative max-w-lg w-full mx-4 rounded-2xl border-2 shadow-2xl overflow-hidden"
            style={{
              borderColor: theme.primary,
              fontFamily: 'Merriweather, serif',
              background: isDarkMode
                ? 'linear-gradient(135deg, #18181b 0%, #23272f 100%)'
                : 'linear-gradient(135deg, #f8fafc 0%, #f3f4f6 100%)',
              boxShadow: isDarkMode
                ? `0 0 32px 0 ${theme.primary}40, 0 0 0 4px ${theme.primary}30`
                : `0 0 32px 0 ${theme.primary}40, 0 0 0 4px ${theme.primary}60`,
              transition: 'background 0.3s, box-shadow 0.3s',
            }}
            onMouseMove={e => {
              const card = e.currentTarget;
              const rect = card.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              const centerX = rect.width / 2;
              const centerY = rect.height / 2;
              const rotateX = ((y - centerY) / centerY) * 10;
              const rotateY = ((x - centerX) / centerX) * -10;
              card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
              card.style.boxShadow = isDarkMode
                ? `0 0 32px 0 ${theme.primary}40, 0 0 0 4px ${theme.primary}30, 0 0 32px 8px ${theme.primary}60`
                : `0 0 32px 0 ${theme.primary}40, 0 0 0 4px ${theme.primary}60, 0 0 32px 8px ${theme.primary}80`;
            }}
            onMouseLeave={e => {
              const card = e.currentTarget;
              card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
              card.style.boxShadow = isDarkMode
                ? `0 0 32px 0 ${theme.primary}40, 0 0 0 4px ${theme.primary}30`
                : `0 0 32px 0 ${theme.primary}40, 0 0 0 4px ${theme.primary}60`;
            }}
          >
            <div style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              zIndex: 0,
              background: isDarkMode
                ? `radial-gradient(circle at 80% 20%, ${theme.primary}30 0%, transparent 60%), radial-gradient(circle at 20% 80%, ${theme.secondary}20 0%, transparent 60%)`
                : `radial-gradient(circle at 80% 20%, ${theme.primary}40 0%, transparent 60%), radial-gradient(circle at 20% 80%, ${theme.secondary}30 0%, transparent 60%)`
            }} />
            <button
              onClick={() => setShowOverview(false)}
              className="absolute top-4 right-4 text-2xl p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all z-10"
              style={{ color: theme.primary }}
              aria-label="Close Overview"
            >
              &times;
            </button>
            <div className="flex items-center gap-3 mb-2 pt-8 px-8 z-10">
              <FaGem style={{ color: theme.primary, fontSize: '1.5rem' }} />
              <h2 className="text-2xl font-bold" style={{ color: theme.primary, fontFamily: 'Playfair Display, serif', letterSpacing: '0.5px' }}>Page Overview</h2>
            </div>
            <div className="px-8 pb-8 z-10">
              <p className="text-base mb-2" style={{ color: theme.text, fontFamily: 'Merriweather, serif' }}>
                Welcome to your Vendor Dashboard! Here you can view business stats, manage menu items, track orders, and access quick actions. All features are designed for a premium, efficient vendor experience.
              </p>
              <ul className="list-disc pl-6" style={{ color: theme.textSecondary, fontFamily: 'Merriweather, serif' }}>
                <li>Monitor orders, customers, and revenue at a glance</li>
                <li>Access business information and recent orders</li>
                <li>Use quick actions for fast management</li>
                <li>Enjoy a premium UI in both light and dark mode</li>
              </ul>
            </div>
            {/* Glowing border effect */}
            <div style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '1.25rem',
              pointerEvents: 'none',
              zIndex: 1,
              boxShadow: isDarkMode
                ? `0 0 32px 8px ${theme.primary}60`
                : `0 0 32px 8px ${theme.primary}80`,
              border: `2px solid ${theme.primary}`,
              opacity: 0.7,
            }} />
          </div>
        </div>
      )}
      {/* Header */}
      <header className="shadow-sm" style={{ background: theme.panels, borderBottom: `1px solid ${theme.border}` }}>
        <div className="px-6 py-5">
          <div className="flex justify-between items-center max-w-7xl mx-auto">
            <div className="flex items-center gap-4">
              <div className="p-2.5 rounded-full" style={{ background: `${theme.primary}15` }}>
                <MdDashboard className="text-2xl" style={{ color: theme.primary }} />
              </div>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight" style={{ color: theme.text }}>
                  NourishNet Vendor
                </h1>
                <p className="text-sm mt-0.5" style={{ color: theme.textSecondary }}>
                  Welcome back, {vendor?.first_name || vendor?.username}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="px-3 py-1 rounded-full text-xs font-semibold"
                style={{
                  background: vendor?.is_verified ? `${theme.success}15` : `${theme.warning}15`,
                  color: vendor?.is_verified ? theme.success : theme.warning
                }}>
                {vendor?.is_verified ? "Verified" : "Pending Verification"}
              </span>
              <button onClick={logout}
                className="px-4 py-2 rounded-sm font-medium transition-all hover:opacity-90"
                style={{ background: theme.error, color: '#fff' }}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="rounded-sm shadow-md p-6 transition-all hover:scale-105"
            style={{ background: theme.panels, borderLeft: `5px solid ${theme.primary}`,
              border: `1px solid ${theme.border}` }}>
            <div className="flex items-center justify-between mb-3">
              <FaShoppingBag className="text-3xl" style={{ color: theme.primary }} />
              <span className="text-xs font-medium" style={{ color: theme.success }}>
                {dashboardData?.orderChange || '+12%'}
              </span>
            </div>
            <h3 className="text-2xl font-bold mb-1" style={{ color: theme.text }}>
              {dashboardData?.totalOrders || 0}
            </h3>
            <p className="text-sm uppercase tracking-wide" style={{ color: theme.textSecondary }}>
              Total Orders
            </p>
          </div>

          <div className="rounded-sm shadow-md p-6 transition-all hover:scale-105"
            style={{ background: theme.panels, borderLeft: `5px solid ${theme.success}`,
              border: `1px solid ${theme.border}` }}>
            <div className="flex items-center justify-between mb-3">
              <FaUsers className="text-3xl" style={{ color: theme.success }} />
              <span className="text-xs font-medium" style={{ color: theme.success }}>
                {dashboardData?.customerChange || '+8%'}
              </span>
            </div>
            <h3 className="text-2xl font-bold mb-1" style={{ color: theme.text }}>
              {dashboardData?.activeCustomers || 0}
            </h3>
            <p className="text-sm uppercase tracking-wide" style={{ color: theme.textSecondary }}>
              Active Customers
            </p>
          </div>

          <div className="rounded-sm shadow-md p-6 transition-all hover:scale-105"
            style={{ background: theme.panels, borderLeft: `5px solid ${theme.warning}`,
              border: `1px solid ${theme.border}` }}>
            <div className="flex items-center justify-between mb-3">
              <FaRupeeSign className="text-3xl" style={{ color: theme.warning }} />
              <span className="text-xs font-medium" style={{ color: theme.success }}>
                {dashboardData?.revenueChange || '+15%'}
              </span>
            </div>
            <h3 className="text-2xl font-bold mb-1" style={{ color: theme.text }}>
              ₹{dashboardData?.revenue?.toLocaleString() || 0}
            </h3>
            <p className="text-sm uppercase tracking-wide" style={{ color: theme.textSecondary }}>
              Revenue
            </p>
          </div>

          <div className="rounded-sm shadow-md p-6 transition-all hover:scale-105"
            style={{ background: theme.panels, borderLeft: `5px solid ${theme.secondary}`,
              border: `1px solid ${theme.border}` }}>
            <div className="flex items-center justify-between mb-3">
              <FaUtensils className="text-3xl" style={{ color: theme.secondary }} />
              <span className="text-xs font-medium" style={{ color: theme.warning }}>
                {dashboardData?.outOfStockItems || 0} out
              </span>
            </div>
            <h3 className="text-2xl font-bold mb-1" style={{ color: theme.text }}>
              {dashboardData?.totalMenuItems || 0}
            </h3>
            <p className="text-sm uppercase tracking-wide" style={{ color: theme.textSecondary }}>
              Menu Items
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Business Details */}
          <div className="rounded-sm shadow-md p-8"
            style={{ background: theme.panels, border: `1px solid ${theme.border}` }}>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: theme.text }}>
              <MdRestaurant style={{ color: theme.primary }} /> Business Information
            </h2>
            <div className="space-y-4">
              {[
                { label: "Kitchen Name", value: vendor?.kitchen_name },
                { label: "Owner", value: `${vendor?.first_name} ${vendor?.last_name}` },
                { label: "Phone", value: vendor?.phone_number },
                { label: "License", value: vendor?.license_number },
                { label: "Address", value: vendor?.address }
              ].map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 rounded"
                  style={{ background: theme.background, border: `1px solid ${theme.border}` }}>
                  <span className="font-medium" style={{ color: theme.textSecondary }}>{item.label}</span>
                  <span className="font-semibold text-right" style={{ color: theme.text }}>
                    {item.value || "Not Set"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Orders */}
          <div className="rounded-sm shadow-md p-8"
            style={{ background: theme.panels, border: `1px solid ${theme.border}` }}>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: theme.text }}>
              <FaChartLine style={{ color: theme.primary }} /> Recent Orders
            </h2>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {dashboardData?.recentOrders?.length > 0 ? (
                dashboardData.recentOrders.map((order) => (
                  <div key={order.id} className="p-3 rounded border-l-4 transition-all hover:scale-[1.01]"
                    style={{ 
                      background: theme.background,
                      borderColor: theme.primary,
                      borderRight: `1px solid ${theme.border}`,
                      borderTop: `1px solid ${theme.border}`,
                      borderBottom: `1px solid ${theme.border}`
                    }}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold" style={{ color: theme.text }}>
                          {order.customer_name}
                        </p>
                        <p className="text-xs" style={{ color: theme.textSecondary }}>
                          {new Date(order.created_at).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold" style={{ color: theme.success }}>
                          ₹{order.total_amount}
                        </p>
                        <span className="text-xs px-2 py-1 rounded"
                          style={{
                            background: `${theme.warning}20`,
                            color: theme.warning
                          }}>
                          {order.status}
                        </span>
                      </div>
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

        {/* Quick Actions */}
        <div className="mt-8 rounded-sm shadow-md p-8"
          style={{ background: theme.panels, border: `1px solid ${theme.border}` }}>
          <h2 className="text-xl font-bold mb-6" style={{ color: theme.text }}>
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button className="px-6 py-3 rounded-sm font-semibold transition-all hover:opacity-90"
              style={{ background: theme.primary, color: '#fff' }}>
              Add Menu Item
            </button>
            <button className="px-6 py-3 rounded-sm font-semibold transition-all hover:opacity-90"
              style={{ background: theme.success, color: '#fff' }}>
              View Orders
            </button>
            <button className="px-6 py-3 rounded-sm font-semibold transition-all hover:opacity-90"
              style={{ background: theme.secondary, color: '#fff' }}>
              Manage Customers
            </button>
            <button className="px-6 py-3 rounded-sm font-semibold transition-all hover:opacity-90"
              style={{ background: theme.warning, color: isDarkMode ? '#000' : '#fff' }}>
              View Analytics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;