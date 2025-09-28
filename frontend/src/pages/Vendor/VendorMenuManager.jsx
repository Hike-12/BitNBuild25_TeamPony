import React, { useState, useEffect } from "react";
import MenuItems from "./MenuItems";
import DailyMenus from "./DailyMenus";
import { FaSun, FaMoon, FaCheckCircle, FaTimesCircle, FaLeaf, FaFire, FaClock, FaRupeeSign } from "react-icons/fa";
import { MdDeliveryDining, MdRestaurant, MdFoodBank } from "react-icons/md";
import { GiIndianPalace, GiHotMeal, GiCookingPot } from "react-icons/gi";
import { IoFastFood } from "react-icons/io5";
import Footer from "../../components/Footer";

const VendorMenuManager = () => {
  const [activeTab, setActiveTab] = useState("menu-items");
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Theme state and toggle
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem("darkMode", JSON.stringify(!isDarkMode));
  };

  // Your exact theme configuration
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
      if (response.status === 401) {
        setError("Please login to access the dashboard");
        return;
      }
      if (response.ok) {
        const data = await response.json();
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
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: theme.background }}>
      <div className="text-center">
        <GiHotMeal className="text-6xl animate-pulse mx-auto mb-4" style={{ color: theme.primary }} />
        <div className="text-xl" style={{ color: theme.text }}>Preparing your kitchen dashboard...</div>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: theme.background }}>
      <div className="text-center p-8 rounded-sm shadow-lg" style={{ background: theme.panels }}>
        <div className="text-xl mb-4" style={{ color: theme.error }}>{error}</div>
        <button onClick={() => window.location.reload()} className="px-6 py-2 rounded-sm font-medium transition-all hover:opacity-90" style={{ background: theme.primary, color: '#fff' }}>
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen font-sans antialiased" style={{ background: theme.background }}>
      {/* Subtle Background Pattern */}
      <div 
        className="fixed inset-0 opacity-[0.03] pointer-events-none z-0" // Reduced opacity
        style={{
          backgroundImage: `radial-gradient(${theme.border} 0.5px, transparent 0.5px), radial-gradient(${theme.border} 0.5px, ${theme.background} 0.5px)`, // More subtle dot pattern
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 10px 10px',
        }}
      />
      
      {/* Header - More elegant design */}
      <header className="relative z-10 shadow-sm" style={{ 
        background: theme.panels,
        borderBottom: `1px solid ${theme.border}`
      }}>
        <div className="px-6 py-5">
          <div className="flex justify-between items-center max-w-7xl mx-auto">
            <div className="flex items-center gap-4">
              <div className="p-2.5 rounded-full" style={{ 
                background: `${theme.primary}15`, // Use primary with opacity
              }}>
                <GiCookingPot className="text-2xl" style={{ color: theme.primary }} />
              </div>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight" style={{ color: theme.text }}>
                  NourishNet
                </h1>
                <p className="text-sm mt-0.5" style={{ color: theme.textSecondary }}>
                  Tiffin Service Management Platform
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-right hidden md:block">
                <p className="text-xs uppercase tracking-wider font-medium" style={{ color: theme.textSecondary }}>
                  Today's Dabbas
                </p>
                <p className="text-xl font-bold" style={{ color: theme.text }}>45</p>
              </div>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full border hover:scale-110 transition-transform duration-200"
                style={{ 
                  background: theme.background,
                  borderColor: theme.border,
                  color: theme.text 
                }}
              >
                {isDarkMode ? <FaSun size={18} /> : <FaMoon size={18} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Kitchen Status Bar - Simplified and elegant */}
      <div className="relative z-10 shadow-sm" style={{ background: theme.panels, borderBottom: `2px solid ${theme.border}` }}>
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${dashboardData?.vendor_info?.is_active ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
                <span className="font-medium" style={{ color: theme.text }}>Kitchen Status: <strong style={{ color: dashboardData?.vendor_info?.is_active ? theme.success : theme.error }}>{dashboardData?.vendor_info?.is_active ? 'Open' : 'Closed'}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <MdDeliveryDining className="text-xl" style={{ color: theme.primary }} />
                <span className="font-medium" style={{ color: theme.text }}>Delivery: <strong style={{ color: theme.primary }}>Active</strong></span>
              </div>
            </div>
            <div className="flex items-center gap-2" style={{ color: theme.textSecondary }}>
              <FaClock />
              <span>{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard - Posh and clean layout */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Stats Cards - Posh Tiffin Style with subtle borders */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Total Dishes */}
          <div className="rounded-sm p-6 shadow-md transition-all duration-300 hover:scale-105" style={{ 
            background: theme.panels,
            borderLeft: `5px solid ${theme.primary}`,
            borderTop: `1px solid ${theme.border}`, // Subtle top border
            borderRight: `1px solid ${theme.border}`, // Subtle right border
            borderBottom: `1px solid ${theme.border}`, // Subtle bottom border
          }}>
            <IoFastFood className="text-4xl mb-3" style={{ color: theme.primary }} />
            <h3 className="text-3xl font-bold mb-1" style={{ color: theme.text }}>{dashboardData?.statistics?.total_menu_items || 0}</h3>
            <p className="text-sm font-medium uppercase tracking-wide" style={{ color: theme.textSecondary }}>Total Dishes</p>
          </div>

          {/* Available Today */}
          <div className="rounded-sm p-6 shadow-md transition-all duration-300 hover:scale-105" style={{ 
            background: theme.panels,
            borderLeft: `5px solid ${theme.success}`,
            borderTop: `1px solid ${theme.border}`,
            borderRight: `1px solid ${theme.border}`,
            borderBottom: `1px solid ${theme.border}`,
          }}>
            <GiHotMeal className="text-4xl mb-3" style={{ color: theme.success }} />
            <h3 className="text-3xl font-bold mb-1" style={{ color: theme.text }}>{dashboardData?.statistics?.active_menu_items || 0}</h3>
            <p className="text-sm font-medium uppercase tracking-wide" style={{ color: theme.textSecondary }}>Available Today</p>
          </div>

          {/* Menu Plans */}
          <div className="rounded-sm p-6 shadow-md transition-all duration-300 hover:scale-105" style={{ 
            background: theme.panels,
            borderLeft: `5px solid ${theme.warning}`,
            borderTop: `1px solid ${theme.border}`,
            borderRight: `1px solid ${theme.border}`,
            borderBottom: `1px solid ${theme.border}`,
          }}>
            <MdFoodBank className="text-4xl mb-3" style={{ color: theme.warning }} />
            <h3 className="text-3xl font-bold mb-1" style={{ color: theme.text }}>{dashboardData?.statistics?.total_menus || 0}</h3>
            <p className="text-sm font-medium uppercase tracking-wide" style={{ color: theme.textSecondary }}>Menu Plans</p>
          </div>

          {/* Active Deliveries */}
          <div className="rounded-sm p-6 shadow-md transition-all duration-300 hover:scale-105" style={{ 
            background: theme.panels,
            borderLeft: `5px solid ${theme.secondary}`,
            borderTop: `1px solid ${theme.border}`,
            borderRight: `1px solid ${theme.border}`,
            borderBottom: `1px solid ${theme.border}`,
          }}>
            <MdDeliveryDining className="text-4xl mb-3" style={{ color: theme.secondary }} />
            <h3 className="text-3xl font-bold mb-1" style={{ color: theme.text }}>{dashboardData?.statistics?.active_menus || 0}</h3>
            <p className="text-sm font-medium uppercase tracking-wide" style={{ color: theme.textSecondary }}>Active Deliveries</p>
          </div>
        </div>

        {/* Kitchen Info & Recent Menus - Elegant layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {/* Kitchen Card */}
          <div className="rounded-sm shadow-md p-8" style={{ background: theme.panels, border: `1px solid ${theme.border}` }}>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: theme.text }}>
              <MdRestaurant style={{ color: theme.primary }} /> Your Kitchen
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 rounded-sm" style={{ background: theme.background, border: `1px solid ${theme.border}` }}>
                <span className="font-medium" style={{ color: theme.textSecondary }}>Business</span>
                <span className="font-semibold" style={{ color: theme.text }}>
                  {dashboardData?.vendor_info?.business_name || "Not Set"}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 rounded-sm" style={{ background: theme.background, border: `1px solid ${theme.border}` }}>
                <span className="font-medium" style={{ color: theme.textSecondary }}>Verification</span>
                <div className="flex items-center gap-2">
                  {dashboardData?.vendor_info?.is_verified ? (
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
              <div className="flex justify-between items-center p-4 rounded-sm" style={{ background: theme.background, border: `1px solid ${theme.border}` }}>
                <span className="font-medium" style={{ color: theme.textSecondary }}>Status</span>
                <div className="flex items-center gap-2">
                  {dashboardData?.vendor_info?.is_active ? (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold" style={{background: `${theme.success}15`, color: theme.success}}>
                      Taking Orders
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold" style={{background: `${theme.error}15`, color: theme.error}}>
                      Closed
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Today's Menus - Clean and well-structured */}
          <div className="rounded-sm shadow-md p-8" style={{ background: theme.panels, border: `1px solid ${theme.border}` }}>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: theme.text }}>
              <GiCookingPot style={{ color: theme.primary }} /> Today's Tiffins
            </h3>
            <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
              {dashboardData?.recent_menus?.length > 0 ? (
                dashboardData.recent_menus.map((menu) => (
                  <div key={menu.id} className="p-4 rounded-sm border-l-4 transition-all duration-300 hover:scale-[1.02]" style={{ 
                    background: theme.background,
                    borderColor: theme.primary, // Using primary for emphasis
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                  }}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-lg" style={{ color: theme.text }}>{menu.name}</h4>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-sm font-medium" style={{ color: theme.textSecondary }}>
                            <FaRupeeSign className="inline mr-1" />{menu.full_dabba_price}
                          </span>
                          {menu.is_veg_only && (
                            <span className="text-sm flex items-center gap-1 font-medium" style={{ color: theme.success }}>
                              <FaLeaf /> Pure Veg
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold" style={{ color: theme.primary }}>
                          {menu.dabbas_sold}/{menu.max_dabbas}
                        </div>
                        <div className="text-xs font-medium" style={{ color: theme.textSecondary }}>Dabbas Sold</div>
                      </div>
                    </div>
                    {menu.todays_special && (
                      <div className="text-sm font-medium p-2 rounded" style={{ 
                        background: `${theme.warning}20`, // Warning with opacity
                        color: theme.warning
                      }}>
                        <FaFire className="inline mr-1" /> Today's Special: {menu.todays_special}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8" style={{ color: theme.textSecondary }}>
                  <GiCookingPot className="text-5xl mx-auto mb-2 opacity-30" />
                  <p className="font-medium">No menus created yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tab Navigation - Sophisticated and clean */}
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <button
            onClick={() => setActiveTab("menu-items")}
            className={`flex-1 py-4 px-6 rounded-sm font-semibold transition-all duration-300 ${
              activeTab === "menu-items" ? "shadow-md scale-[1.01]" : "hover:shadow-sm"
            }`}
            style={{
              background: activeTab === "menu-items" ? theme.primary : theme.panels,
              color: activeTab === "menu-items" ? '#fff' : theme.text,
              border: `1px solid ${activeTab === "menu-items" ? theme.primary : theme.border}`
            }}
          >
            <IoFastFood className="inline mr-2 text-xl" />
            Manage Dishes
          </button>
          <button
            onClick={() => setActiveTab("daily-menus")}
            className={`flex-1 py-4 px-6 rounded-sm font-semibold transition-all duration-300 ${
              activeTab === "daily-menus" ? "shadow-md scale-[1.01]" : "hover:shadow-sm"
            }`}
            style={{
              background: activeTab === "daily-menus" ? theme.primary : theme.panels,
              color: activeTab === "daily-menus" ? '#fff' : theme.text,
              border: `1px solid ${activeTab === "daily-menus" ? theme.primary : theme.border}`
            }}
          >
            <MdFoodBank className="inline mr-2 text-xl" />
            Daily Tiffin Plans
          </button>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === "menu-items" && <MenuItems />}
          {activeTab === "daily-menus" && <DailyMenus />}
        </div>
      </div>

      {/* Premium Footer */}
      <Footer variant="simple" />
    </div>
  );
};

export default VendorMenuManager;