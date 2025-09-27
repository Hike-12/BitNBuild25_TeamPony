import VoiceRouter from '../../components/VoiceRouter';
import React, { useState, useEffect } from "react";
import { useVendorAuth } from "../../context/VendorAuthContext";
import { useTheme } from "../../context/ThemeContext";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { FaCalendarAlt, FaLeaf, FaUtensils, FaCheckCircle, FaTimesCircle, FaStar, FaFireAlt } from "react-icons/fa";
// Google Fonts for premium typography
if (!document.querySelector('link[href*="Playfair+Display"]')) {
  const link = document.createElement('link');
  link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Merriweather:wght@300;400;700&display=swap';
  link.rel = 'stylesheet';
  document.head.appendChild(link);
}

const DailyMenus = () => {
  const voiceRoutes = [
    { keyword: 'menu', path: '/vendor/menu' },
    { keyword: 'dashboard', path: '/vendor/dashboard' },
    { keyword: 'login', path: '/vendor/login' },
  ];
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { vendor } = useVendorAuth();
  const { theme } = useTheme();
  const API_URL = import.meta.env.VITE_API_URL;

  const getAuthHeaders = () => {
    const token = localStorage.getItem("vendor_token");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  const fetchDailyMenus = async () => {
    try {
      const response = await fetch(`${API_URL}/api/vendor/daily-menus`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch menus`);
      }

      const data = await response.json();
      if (data.success) {
        setMenus(data.menus);
      } else {
        throw new Error(data.error || "Failed to fetch menus");
      }
    } catch (err) {
      console.error("Fetch menus error:", err);
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createDailyMenu = async (menuData) => {
    try {
      const response = await fetch(`${API_URL}/api/vendor/daily-menus`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(menuData),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to create menu`);
      }

      const data = await response.json();
      if (data.success) {
        toast.success("Menu created successfully!");
        fetchDailyMenus(); // Refresh the list
        return true;
      } else {
        throw new Error(data.error || "Failed to create menu");
      }
    } catch (err) {
      console.error("Create menu error:", err);
      toast.error(err.message);
      return false;
    }
  };

  const updateDailyMenu = async (menuId, updates) => {
    try {
      const response = await fetch(`${API_URL}/api/vendor/daily-menus/${menuId}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to update menu`);
      }

      const data = await response.json();
      if (data.success) {
        toast.success("Menu updated successfully!");
        fetchDailyMenus(); // Refresh the list
        return true;
      } else {
        throw new Error(data.error || "Failed to update menu");
      }
    } catch (err) {
      console.error("Update menu error:", err);
      toast.error(err.message);
      return false;
    }
  };

  useEffect(() => {
    fetchDailyMenus();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center transition-all duration-300" style={{ backgroundColor: theme?.background }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-transparent mx-auto mb-4" style={{ borderColor: `${theme?.primary} transparent transparent transparent` }}></div>
          <div className="text-xl font-semibold" style={{ color: theme?.text }}>Loading daily menus...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center transition-all duration-300" style={{ backgroundColor: theme?.background }}>
        <div className="text-center">
          <p className="text-xl mb-4" style={{ color: theme?.error }}>{error}</p>
          <button onClick={fetchDailyMenus} className="px-6 py-2 rounded-lg font-semibold transition-all duration-300" style={{ backgroundColor: theme?.primary, color: "white" }}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen transition-all duration-300" style={{ backgroundColor: theme?.background, fontFamily: 'Merriweather, serif' }}>
        {/* Header */}
        <header className="sticky top-0 z-40 border-b backdrop-blur-md" style={{ backgroundColor: `${theme?.panels}95`, borderColor: theme?.border }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <>
                <VoiceRouter routes={voiceRoutes} />
                <div>
                  <h1 className="text-2xl font-bold" style={{ color: theme?.primary, fontFamily: 'Playfair Display, serif' }}>
                    <FaCalendarAlt style={{ marginRight: 8 }} /> Daily Menus
                  </h1>
                  <p style={{ color: theme?.textSecondary }}>
                    {vendor?.business_name ? (
                      <span style={{ fontWeight: 600, color: theme?.primary }}>Business: {vendor.business_name}</span>
                    ) : (
                      <span style={{ color: theme?.error }}>Business name not found</span>
                    )}
                  </p>
                </div>
                <button
                  onClick={() => toast.info("Create menu modal coming soon!")}
                  className="px-6 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                  style={{ backgroundColor: theme?.success, color: "white" }}
                >
                  + Create New Menu
                </button>
              </>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {/* Menus Grid */}
          {menus.length === 0 ? (
            <div className="rounded-2xl border p-8 text-center" style={{ backgroundColor: theme?.panels, borderColor: theme?.border }}>
              <div className="text-5xl mb-4" style={{ color: theme?.primary }}><FaUtensils /></div>
              <p className="text-lg mb-4" style={{ color: theme?.textSecondary }}>
                No daily menus found. Create your first daily menu to get started.
              </p>
              <button
                onClick={() => toast.info("Create menu modal coming soon!")}
                className="px-6 py-3 rounded-lg font-semibold transition-all duration-300"
                style={{ backgroundColor: theme?.primary, color: "white" }}
              >
                Create First Menu
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menus.map((menu) => (
                <div key={menu.id || menu._id} className="rounded-2xl border p-6 hover:shadow-lg transition-all duration-300" style={{ backgroundColor: theme?.panels, borderColor: theme?.border }}>
                  {/* ...existing code... */}
                </div>
              ))}
            </div>
          )}
        </main>

        {/* Page Overview & Voice Commands */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
          <div className="p-4 rounded-xl border flex flex-col lg:flex-row items-center justify-between gap-4 bg-white border-gray-200">
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Page Overview</h3>
              <ul className="list-disc ml-6 text-sm text-gray-600">
                <li>Create and manage daily menu offerings</li>
                <li>Set menu availability and portion limits</li>
                <li>Track daily sales and customer orders</li>
                <li>Use voice commands for quick navigation</li>
              </ul>
            </div>
            <div className="flex flex-col items-center">
              <h4 className="text-sm font-semibold mb-1 text-blue-600">Voice Commands</h4>
              <ul className="text-xs mb-2 text-gray-600">
                <li><b>"Go to dashboard"</b> – Back to Dashboard</li>
                <li><b>"Go to menu"</b> – Menu Items</li>
                <li><b>"Go to login"</b> – Login Page</li>
              </ul>
              <div className="mt-2">
                <VoiceRouter routes={voiceRoutes} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DailyMenus;