import React, { useState, useEffect } from "react";
import MenuItems from "./MenuItems";
import DailyMenus from "./DailyMenus";

const VendorMenuManager = () => {
  const [activeTab, setActiveTab] = useState("menu-items");
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getVendorAuthHeaders = () => {
    const token = localStorage.getItem('vendor_token');
    console.log("Vendor Token:", token ? "exists" : "missing");
    return token ? { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    } : {};
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/vendor/dashboard`,
        { headers: getVendorAuthHeaders() }
      );
      
      console.log("Dashboard response status:", response.status);
      
      if (response.status === 401) {
        setError("Please login to access the dashboard");
        return;
      }
      
      if (response.ok) {
        const data = await response.json();
        console.log("Dashboard data:", data);
        if (data.success) {
          setDashboardData(data.dashboard_data);
        } else {
          setError(data.error || "Failed to fetch dashboard data");
        }
      } else {
        setError("Failed to fetch dashboard data");
      }
    } catch (err) {
      setError("Error fetching dashboard data");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Tab styles using theme
  const tabStyle = {
    display: "inline-block",
    padding: "14px 32px",
    margin: "0 8px",
    backgroundColor: theme.panels,
    border: `2px solid ${theme.border}`,
    cursor: "pointer",
    borderRadius: "18px 18px 0 0",
    color: theme.textSecondary,
    fontWeight: 600,
    fontSize: "1.1rem",
    boxShadow: "0 2px 8px 0 rgba(0,0,0,0.04)",
    transition: "all 0.2s",
  };

  const activeTabStyle = {
    ...tabStyle,
    backgroundColor: theme.primary,
    color: theme.background,
    borderColor: theme.primary,
    boxShadow: `0 4px 16px 0 ${theme.primary}22`,
    fontWeight: 700,
    fontSize: "1.15rem",
    letterSpacing: "0.02em",
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${theme.background} 60%, ${theme.panels} 100%)` }}>
      <div className="text-center">
        <div className="animate-spin rounded-full h-20 w-20 border-8 border-t-transparent mx-auto mb-6 shadow-lg" style={{ borderColor: `${theme.primary} transparent transparent transparent` }}></div>
        <div className="text-2xl font-bold tracking-wide" style={{ color: theme.primary }}>
          Loading vendor menu data...
        </div>
      </div>
    </div>
  );
  if (error) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${theme.background} 60%, ${theme.panels} 100%)` }}>
      <div className="text-center rounded-2xl shadow-xl p-8" style={{ backgroundColor: theme.panels }}>
        <p className="text-2xl mb-6 font-semibold" style={{ color: theme.error }}>
          Error: {error}
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen relative" style={{ minHeight: "100vh", overflow: "hidden" }}>
      {/* Background Image + Overlay */}
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        background: `url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1500&q=80') center/cover no-repeat`,
        filter: isDarkMode ? "brightness(0.5) blur(1px)" : "brightness(0.8) blur(1px)",
      }} />
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 1,
        background: isDarkMode ? `linear-gradient(135deg, ${theme.background}ee 60%, ${theme.panels}ee 100%)` : `linear-gradient(135deg, ${theme.background}cc 60%, ${theme.panels}cc 100%)`,
        pointerEvents: "none",
      }} />

      {/* Light/Dark Mode Toggle Floating Button */}
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        style={{
          position: "fixed",
          top: 32,
          right: 32,
          zIndex: 100,
          background: theme.panels,
          color: theme.text,
          border: `2px solid ${theme.border}`,
          borderRadius: "50%",
          width: "52px",
          height: "52px",
          boxShadow: "0 4px 16px 0 rgba(0,0,0,0.10)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "background 0.2s, color 0.2s",
        }}
        aria-label="Toggle light/dark mode"
      >
        {isDarkMode ? <FaSun style={{ fontSize: "1.5rem", color: theme.primary }} /> : <FaMoon style={{ fontSize: "1.5rem", color: theme.primary }} />}
      </button>

      <div className="relative" style={{ zIndex: 10, minHeight: "100vh", padding: "48px 0" }}>
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-8 lg:px-12">
          {/* Header Section */}
          <div className="flex items-center gap-6 mb-12 justify-center">
            <div className="rounded-2xl p-5 flex items-center justify-center shadow-lg" style={{ backgroundColor: theme.panels }}>
              <FaUtensils style={{ color: theme.primary, fontSize: "3rem" }} />
            </div>
            <div>
              <h1 className="text-5xl font-extrabold tracking-tight" style={{ color: theme.primary, letterSpacing: "0.03em" }}>
                Vendor Menu Management
              </h1>
              <p className="text-xl font-medium mt-3" style={{ color: theme.textSecondary }}>
                Manage your kitchen, menu items, and daily menus in style.
              </p>
            </div>
          </div>

          <div style={{ marginTop: "20px" }}>
            <h3>Kitchen Information</h3>
            <p>
              <strong>Business Name:</strong>{" "}
              {dashboardData.vendor_info.business_name}
            </p>
            <p>
              <strong>Verification Status:</strong>
              <span
                style={{
                  color: dashboardData.vendor_info.is_verified
                    ? "green"
                    : "orange",
                }}
              >
                {dashboardData.vendor_info.is_verified
                  ? " Verified"
                  : " Pending Verification"}
              </span>
            </p>
            <p>
              <strong>Status:</strong>
              <span
                style={{
                  color: dashboardData.vendor_info.is_active ? "green" : "red",
                }}
              >
                {dashboardData.vendor_info.is_active ? " Active" : " Inactive"}
              </span>
            </p>
          </div>

              {/* Recent Menus Card */}
              <div className="rounded-3xl border shadow-xl p-10 flex flex-col gap-6" style={{ background: theme.panels, borderColor: theme.border }}>
                <h2 className="text-xl font-bold mb-2 flex items-center gap-2" style={{ color: theme.text }}>
                  <FaClipboardList style={{ color: theme.primary }} /> Recent Menus
                </h2>
                {dashboardData.recent_menus.length > 0 ? (
                  <div className="flex flex-col gap-4">
                    {dashboardData.recent_menus.map((menu) => (
                      <div
                        key={menu.id}
                        className="rounded-xl border p-4 flex flex-col gap-2 shadow"
                        style={{ backgroundColor: theme.background, borderColor: theme.border }}
                      >
                        <div className="flex items-center gap-2">
                          <strong className="text-lg font-bold" style={{ color: theme.primary }}>{menu.name}</strong>
                          <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: menu.is_active ? theme.success : theme.error, color: theme.background }}>
                            {menu.is_active ? "Active" : "Inactive"}
                          </span>
                          {menu.is_veg_only ? <FaLeaf style={{ color: theme.success }} title="Veg Only" /> : <FaDrumstickBite style={{ color: theme.error }} title="Non-Veg" />}
                          {menu.todays_special && <FaFireAlt style={{ color: theme.warning }} title="Special" />}
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm" style={{ color: theme.textSecondary }}>
                          <span>Items: {menu.items_count}</span>
                          <span>Price: ₹{menu.full_dabba_price}</span>
                          <span>Dabbas Sold: {menu.dabbas_sold}/{menu.max_dabbas}</span>
                          {menu.todays_special && (
                            <span className="italic" style={{ color: theme.warning }}>
                              Today's Special: {menu.todays_special}
                            </span>
                          )}
                        </div>
                        <span className="text-xs" style={{ color: theme.textSecondary }}>{new Date(menu.date).toLocaleDateString()}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-base" style={{ color: theme.textSecondary }}>No menus created yet.</p>
                )}
              </div>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="flex items-end mb-10" style={{ borderBottom: `2px solid ${theme.border}` }}>
            <div
              style={activeTab === "menu-items" ? activeTabStyle : tabStyle}
              onClick={() => setActiveTab("menu-items")}
            >
              <FaUtensils style={{ marginRight: "8px" }} /> Menu Items
            </div>
            <div
              style={activeTab === "daily-menus" ? activeTabStyle : tabStyle}
              onClick={() => setActiveTab("daily-menus")}
            >
              <FaCalendarAlt style={{ marginRight: "8px" }} /> Daily Menus
            </div>
          </div>

      {/* Tab Content */}
      <div>
        {activeTab === "menu-items" && <MenuItems />}
        {activeTab === "daily-menus" && <DailyMenus />}
      </div>
    </div>
  );
};

export default VendorMenuManager;