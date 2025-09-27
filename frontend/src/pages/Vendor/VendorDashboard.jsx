import React, { useState, useEffect } from "react";
import { useVendorAuth } from "../../context/VendorAuthContext";
import { FaUsers, FaRupeeSign, FaShoppingBag, FaUtensils, FaChartLine } from "react-icons/fa";
import { MdDashboard, MdRestaurant } from "react-icons/md";

const VendorDashboard = () => {
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
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" 
            style={{ borderColor: theme.primary }}></div>
          <div className="text-lg" style={{ color: theme.text }}>Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: theme.background }}>
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