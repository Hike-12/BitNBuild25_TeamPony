
import React, { useState, useEffect } from "react";
import MenuItems from "./MenuItems";
import DailyMenus from "./DailyMenus";
import { useTheme } from "../../context/ThemeContext";
import { FaCrown, FaSun, FaMoon, FaGem, FaChevronRight, FaClipboardList, FaUtensils, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
// Google Fonts for premium typography
if (!document.querySelector('link[href*="Playfair+Display"]')) {
  const link = document.createElement('link');
  link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Merriweather:wght@300;400;700&display=swap';
  link.rel = 'stylesheet';
  document.head.appendChild(link);
}


const VendorMenuManager = () => {
  const [activeTab, setActiveTab] = useState("menu-items");
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isDarkMode, toggleTheme, theme } = useTheme();

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

  // Premium background overlays
  const bgImage = 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80';

  if (loading) return <div className="min-h-screen flex items-center justify-center text-xl font-bold" style={{ color: theme.primary, background: theme.background }}>Loading vendor menu data...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-xl font-bold" style={{ color: theme.primary, background: theme.background }}>Error: {error}</div>;

  return (
    <div
      className="min-h-screen w-full flex flex-col justify-between relative"
      style={{
        fontFamily: 'Merriweather, serif',
        minHeight: '100vh',
        background: theme.background,
        position: 'relative',
      }}
    >
      {/* Premium Background Image Overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('${bgImage}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          opacity: isDarkMode ? 0.13 : 0.06,
        }}
      />
      {/* Elegant Gradient Overlay */}
      <div 
        className="absolute inset-0 z-1"
        style={{
          background: `linear-gradient(135deg, 
            ${isDarkMode ? 'rgba(3,3,3,0.95)' : 'rgba(253,253,247,0.95)'} 0%, 
            ${isDarkMode ? 'rgba(23,41,34,0.90)' : 'rgba(245,248,242,0.90)'} 50%, 
            ${isDarkMode ? 'rgba(3,3,3,0.95)' : 'rgba(253,253,247,0.95)'} 100%)`,
        }}
      />
      {/* Luxury Texture Pattern */}
      <div 
        className="absolute inset-0 z-2 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, ${theme.primary}08 0%, transparent 50%), 
                           radial-gradient(circle at 75% 75%, ${theme.secondary}06 0%, transparent 50%)`,
        }}
      />

      {/* Elegant Header */}
      <header className="w-full flex justify-between items-center px-12 py-8 relative z-10">
        <div className="flex items-center gap-3">
          <FaCrown style={{ color: theme.primary, fontSize: '28px' }} />
          <span 
            className="text-2xl font-bold" 
            style={{ 
              fontFamily: 'Playfair Display, serif', 
              color: theme.primary,
              letterSpacing: '1px'
            }}
          >
            Vendor Menu Manager
          </span>
        </div>
        <button
          onClick={toggleTheme}
          className="p-4 rounded-full backdrop-blur-sm border transition-all duration-500 hover:scale-110"
          style={{
            backgroundColor: `${theme.panels}95`,
            color: theme.primary,
            border: `2px solid ${theme.primary}30`,
            boxShadow: `0 8px 32px ${theme.primary}20`,
          }}
        >
          {isDarkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
        </button>
      </header>

      {/* Dashboard Overview */}
      <section className="flex flex-col items-center justify-center py-8 px-4 relative z-10">
        <div className="max-w-5xl w-full mx-auto">
          <div className="mb-8">
            <div 
              className="inline-flex items-center gap-2 px-6 py-2 rounded-full border shadow"
              style={{
                backgroundColor: `${theme.primary}10`,
                borderColor: `${theme.primary}30`,
                color: theme.primary,
                fontFamily: 'Playfair Display, serif',
                textAlign: 'center',
              }}
            >
              <FaGem className="text-base" />
              <span className="text-xs font-semibold tracking-wide uppercase">Vendor Dashboard</span>
            </div>
          </div>
          <div className="rounded-3xl border-2 shadow-xl p-10 mb-8" style={{ background: theme.panels, borderColor: theme.primary, fontFamily: 'Merriweather, serif' }}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
              <div className="flex flex-col items-center justify-center">
                <FaClipboardList style={{ color: theme.primary, fontSize: '2rem', marginBottom: '0.5rem' }} />
                <h3 className="text-lg font-bold mb-1" style={{ color: theme.text, fontFamily: 'Playfair Display, serif' }}>{dashboardData.statistics.total_menu_items}</h3>
                <p className="font-medium text-xs" style={{ color: theme.textSecondary }}>Total Menu Items</p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <FaUtensils style={{ color: theme.primary, fontSize: '2rem', marginBottom: '0.5rem' }} />
                <h3 className="text-lg font-bold mb-1" style={{ color: theme.text, fontFamily: 'Playfair Display, serif' }}>{dashboardData.statistics.active_menu_items}</h3>
                <p className="font-medium text-xs" style={{ color: theme.textSecondary }}>Active Menu Items</p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <FaCheckCircle style={{ color: theme.primary, fontSize: '2rem', marginBottom: '0.5rem' }} />
                <h3 className="text-lg font-bold mb-1" style={{ color: theme.text, fontFamily: 'Playfair Display, serif' }}>{dashboardData.statistics.total_menus}</h3>
                <p className="font-medium text-xs" style={{ color: theme.textSecondary }}>Total Menus</p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <FaCheckCircle style={{ color: theme.primary, fontSize: '2rem', marginBottom: '0.5rem' }} />
                <h3 className="text-lg font-bold mb-1" style={{ color: theme.text, fontFamily: 'Playfair Display, serif' }}>{dashboardData.statistics.active_menus}</h3>
                <p className="font-medium text-xs" style={{ color: theme.textSecondary }}>Active Daily Menus</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="rounded-xl border shadow-md p-6 text-left flex flex-col justify-center" style={{ backgroundColor: `${theme.panels}90`, borderColor: `${theme.primary}30`, fontFamily: 'Merriweather, serif' }}>
                <h3 className="font-bold mb-2" style={{ color: theme.primary, fontFamily: 'Playfair Display, serif' }}>Kitchen Information</h3>
                <p style={{ marginBottom: 4 }}><strong>Business Name:</strong> <span style={{ color: theme.text }}>{dashboardData.vendor_info.business_name || "Not Available"}</span></p>
                <p style={{ marginBottom: 4 }}><strong>Verification Status:</strong> <span style={{ color: dashboardData.vendor_info.is_verified ? theme.primary : theme.secondary }}>{dashboardData.vendor_info.is_verified ? "Verified" : "Pending Verification"}</span></p>
                <p><strong>Status:</strong> <span style={{ color: dashboardData.vendor_info.is_active ? theme.primary : theme.secondary }}>{dashboardData.vendor_info.is_active ? "Active" : "Inactive"}</span></p>
              </div>
              <div className="rounded-xl border shadow-md p-6 text-left flex flex-col justify-center" style={{ backgroundColor: `${theme.panels}90`, borderColor: `${theme.primary}30`, fontFamily: 'Merriweather, serif' }}>
                <h3 className="font-bold mb-2" style={{ color: theme.primary, fontFamily: 'Playfair Display, serif' }}>Recent Menus</h3>
                {dashboardData.recent_menus.length > 0 ? (
                  <div className="flex flex-col gap-3">
                    {dashboardData.recent_menus.map((menu) => (
                      <div key={menu.id} className="rounded-lg border p-3 shadow-sm" style={{ backgroundColor: theme.background, borderColor: theme.primary }}>
                        <strong style={{ color: theme.primary }}>{menu.name}</strong> - {new Date(menu.date).toLocaleDateString()}
                        <br />
                        <small style={{ color: theme.textSecondary }}>
                          Items: {menu.items_count} | Price: ₹{menu.full_dabba_price} | Dabbas Sold: {menu.dabbas_sold}/{menu.max_dabbas} |
                          {menu.is_veg_only && <span style={{ color: theme.primary }}> Veg Only |</span>}
                          <span style={{ color: menu.is_active ? theme.primary : theme.secondary }}>
                            {menu.is_active ? "Active" : "Inactive"}
                          </span>
                        </small>
                        {menu.todays_special && (
                          <div style={{ marginTop: "5px", fontStyle: "italic", color: theme.secondary }}>
                            Today's Special: {menu.todays_special}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: theme.textSecondary }}>No menus created yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="w-full flex justify-center items-center relative z-10 mb-2">
        <div className="flex gap-2 border-b-2 pb-2" style={{ borderColor: `${theme.primary}30` }}>
          <button
            className={`px-8 py-3 rounded-t-xl font-bold text-base transition-all duration-500 hover:scale-105 backdrop-blur-sm border flex items-center gap-2 ${activeTab === "menu-items" ? "shadow-lg" : "hover:shadow-md"}`}
            style={{
              backgroundColor: activeTab === "menu-items" ? theme.primary : `${theme.panels}90`,
              borderColor: theme.primary,
              color: activeTab === "menu-items" ? '#fff' : theme.primary,
              fontFamily: 'Playfair Display, serif',
              letterSpacing: '1px',
              boxShadow: activeTab === "menu-items" ? `0 6px 20px ${theme.primary}30` : 'none',
            }}
            onClick={() => setActiveTab("menu-items")}
          >
            <FaUtensils /> Menu Items
          </button>
          <button
            className={`px-8 py-3 rounded-t-xl font-bold text-base transition-all duration-500 hover:scale-105 backdrop-blur-sm border flex items-center gap-2 ${activeTab === "daily-menus" ? "shadow-lg" : "hover:shadow-md"}`}
            style={{
              backgroundColor: activeTab === "daily-menus" ? theme.primary : `${theme.panels}90`,
              borderColor: theme.primary,
              color: activeTab === "daily-menus" ? '#fff' : theme.primary,
              fontFamily: 'Playfair Display, serif',
              letterSpacing: '1px',
              boxShadow: activeTab === "daily-menus" ? `0 6px 20px ${theme.primary}30` : 'none',
            }}
            onClick={() => setActiveTab("daily-menus")}
          >
            <FaClipboardList /> Daily Menus
          </button>
        </div>
      </section>

      {/* Tab Content */}
      <section className="relative z-10 max-w-5xl mx-auto w-full mb-12">
        {activeTab === "menu-items" && <MenuItems />}
        {activeTab === "daily-menus" && <DailyMenus />}
      </section>

      {/* Elegant Footer */}
      <footer className="w-full py-8 px-6 text-center relative z-10" style={{ backgroundColor: `${theme.panels}95` }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <FaCrown style={{ color: theme.primary, fontSize: '24px' }} />
            <span 
              style={{ 
                color: theme.textSecondary,
                fontFamily: 'Playfair Display, serif'
              }} 
              className="text-sm"
            >
              &copy; {new Date().getFullYear()} Vendor Menu Manager. Crafted with excellence.
            </span>
          </div>
          <div className="flex gap-8 justify-center md:justify-end">
            <a 
              href="#" 
              style={{ color: theme.primary }} 
              className="hover:underline transition-all duration-300 text-sm font-medium"
            >
              Instagram
            </a>
            <a 
              href="#" 
              style={{ color: theme.primary }} 
              className="hover:underline transition-all duration-300 text-sm font-medium"
            >
              Twitter
            </a>
            <a 
              href="#" 
              style={{ color: theme.primary }} 
              className="hover:underline transition-all duration-300 text-sm font-medium"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default VendorMenuManager;