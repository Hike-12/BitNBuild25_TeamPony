import React, { useState, useEffect } from "react";
import { FaGem } from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";
import { useVendorAuth } from "../../context/VendorAuthContext";
import { getAuthHeaders, handleApiError } from "../../utils/api";

const VendorDashboard = () => {
  const { isDarkMode, theme } = useTheme();
  const [showOverview, setShowOverview] = useState(false);
  const { vendor, logout } = useVendorAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
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
  {
    headers: getVendorAuthHeaders(),
  }
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
        {
          headers: getVendorAuthHeaders(),
        }
      );

      const data = await response.json();
      if (data.success) {
        setDashboardData(data);
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
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
      <header className="bg-[#161B22] border-b border-[#21262D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-[#F97316]">
                NourishNet Vendor
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-[#8B949E]">
                Welcome, {vendor?.first_name || vendor?.username}!
              </span>
              <span className="text-[#10B981] text-sm px-2 py-1 rounded-full bg-[#10B981] bg-opacity-10">
                {vendor?.is_verified ? "Verified" : "Pending Verification"}
              </span>
              <button
                onClick={handleLogout}
                className="bg-[#EF4444] text-white px-4 py-2 rounded-md hover:bg-[#DC2626] transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#161B22] border border-[#21262D] rounded-lg p-6">
            <h3 className="text-sm font-medium text-[#8B949E] mb-2">
              Total Orders
            </h3>
            <p className="text-3xl font-bold text-[#F0F6FC]">
              {dashboardData?.totalOrders || 0}
            </p>
            <p className="text-sm text-[#10B981] mt-1">
              {dashboardData?.orderChange} from last month
            </p>
          </div>

          <div className="bg-[#161B22] border border-[#21262D] rounded-lg p-6">
            <h3 className="text-sm font-medium text-[#8B949E] mb-2">
              Active Customers
            </h3>
            <p className="text-3xl font-bold text-[#F0F6FC]">
              {dashboardData?.activeCustomers || 0}
            </p>
            <p className="text-sm text-[#10B981] mt-1">
              {dashboardData?.customerChange} from last month
            </p>
          </div>

          <div className="bg-[#161B22] border border-[#21262D] rounded-lg p-6">
            <h3 className="text-sm font-medium text-[#8B949E] mb-2">Revenue</h3>
            <p className="text-3xl font-bold text-[#F0F6FC]">
              ₹{dashboardData?.revenue?.toLocaleString() || 0}
            </p>
            <p className="text-sm text-[#10B981] mt-1">
              {dashboardData?.revenueChange} from last month
            </p>
          </div>

          <div className="bg-[#161B22] border border-[#21262D] rounded-lg p-6">
            <h3 className="text-sm font-medium text-[#8B949E] mb-2">
              Menu Items
            </h3>
            <p className="text-3xl font-bold text-[#F0F6FC]">
              {dashboardData?.totalMenuItems || 0}
            </p>
            <p className="text-sm text-[#F97316] mt-1">
              {dashboardData?.outOfStockItems} out of stock
            </p>
          </div>
        </div>

        {/* Business Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Business Details */}
          <div className="bg-[#161B22] border border-[#21262D] rounded-lg p-6">
            <h2 className="text-xl font-semibold text-[#F0F6FC] mb-4">
              Business Information
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[#8B949E]">Kitchen Name</span>
                <span className="text-[#F0F6FC] font-medium">
                  {vendor?.kitchen_name}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8B949E]">Owner</span>
                <span className="text-[#F0F6FC] font-medium">
                  {vendor?.first_name} {vendor?.last_name}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8B949E]">Phone</span>
                <span className="text-[#F0F6FC] font-medium">
                  {vendor?.phone_number}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8B949E]">License</span>
                <span className="text-[#F0F6FC] font-medium">
                  {vendor?.license_number}
                </span>
              </div>
              <div className="flex items-start justify-between">
                <span className="text-[#8B949E]">Address</span>
                <span className="text-[#F0F6FC] text-right max-w-xs">
                  {vendor?.address}
                </span>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-[#161B22] border border-[#21262D] rounded-lg p-6">
            <h2 className="text-xl font-semibold text-[#F0F6FC] mb-4">
              Recent Orders
            </h2>
            <div className="space-y-3">
              {dashboardData?.recentOrders?.length > 0 ? (
                dashboardData.recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between py-2 border-b border-[#21262D]"
                  >
                    <div>
                      <p className="text-[#F0F6FC] text-sm">
                        {order.order_id} - {order.customer_name}
                      </p>
                      <p className="text-[#8B949E] text-xs">
                        {new Date(order.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[#10B981] text-sm">
                        ₹{order.total_amount}
                      </span>
                      <p className="text-[#F97316] text-xs">{order.status}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-4 text-center text-[#8B949E]">
                  No recent orders found.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-[#161B22] border border-[#21262D] rounded-lg p-6">
          <h2 className="text-xl font-semibold text-[#F0F6FC] mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="bg-[#F97316] text-white px-6 py-3 rounded-md hover:bg-[#EA580C] transition-colors">
              Add Menu Item
            </button>
            <button className="bg-[#10B981] text-white px-6 py-3 rounded-md hover:bg-[#059669] transition-colors">
              View Orders
            </button>
            <button className="bg-[#3B82F6] text-white px-6 py-3 rounded-md hover:bg-[#2563EB] transition-colors">
              Manage Customers
            </button>
            <button className="bg-[#8B5CF6] text-white px-6 py-3 rounded-md hover:bg-[#7C3AED] transition-colors">
              View Analytics
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VendorDashboard;
