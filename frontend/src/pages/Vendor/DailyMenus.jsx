import VoiceRouter from '../../components/VoiceRouter';
import React, { useState, useEffect } from "react";
import { useVendorAuth } from "../../context/VendorAuthContext";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { FaCalendarAlt, FaLeaf, FaCheckCircle, FaTimesCircle, FaStar, FaFire } from "react-icons/fa";
import { MdFoodBank } from "react-icons/md";
import { GiCookingPot } from "react-icons/gi";

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
  const API_URL = import.meta.env.VITE_API_URL;

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
        fetchDailyMenus();
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
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" 
            style={{ borderColor: theme.primary }}></div>
          <div className="text-lg" style={{ color: theme.text }}>Loading daily menus...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center p-8 rounded-sm" style={{ background: theme.panels }}>
          <p className="text-lg mb-4" style={{ color: theme.error }}>{error}</p>
          <button onClick={fetchDailyMenus} className="px-6 py-2 rounded-sm font-medium"
            style={{ background: theme.primary, color: '#fff' }}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen transition-all duration-300" style={{ backgroundColor: theme?.background, fontFamily: 'Merriweather, serif' }}>
      {/* Header */}
      <header className="sticky top-0 z-40 border-b backdrop-blur-md" style={{ backgroundColor: `${theme?.panels}95`, borderColor: theme?.border }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
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
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-2">
                    <FaUtensils className="text-2xl" style={{ color: theme?.primary }} />
                    <h3 className="text-xl font-semibold" style={{ color: theme?.text, fontFamily: 'Playfair Display, serif' }}>{menu.name}</h3>
                  </div>
                  <div className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: menu.is_active ? `${theme?.success}20` : `${theme?.error}20`, color: menu.is_active ? theme?.success : theme?.error }}>
                    {menu.is_active ? <FaCheckCircle style={{ marginRight: 4 }} /> : <FaTimesCircle style={{ marginRight: 4 }} />}
                    {menu.is_active ? "Active" : "Inactive"}
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span style={{ color: theme?.textSecondary }}>Date:</span>
                    <span className="font-medium" style={{ color: theme?.text }}>{format(new Date(menu.date), "PPP")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: theme?.textSecondary }}>Price:</span>
                    <span className="font-semibold text-lg" style={{ color: theme?.success }}>₹{menu.full_dabba_price}</span>
                  </div>
                </div>

                {/* Menu Items Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span style={{ color: theme?.textSecondary }}>Main Items:</span>
                    <span className="font-medium">{menu.main_items?.length || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: theme?.textSecondary }}>Side Items:</span>
                    <span className="font-medium">{menu.side_items?.length || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: theme?.textSecondary }}>Extras:</span>
                    <span className="font-medium">{menu.extras?.length || 0}</span>
                  </div>
                </div>

                {/* Dabba Stats */}
                <div className="rounded-lg p-3 mb-4" style={{ backgroundColor: theme?.background }}>
                  <div className="flex justify-between items-center">
                    <span className="text-sm" style={{ color: theme?.textSecondary }}>Dabbas Sold</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold" style={{ color: theme?.primary }}>{menu.dabbas_sold || 0}</span>
                      <span style={{ color: theme?.textSecondary }}>/</span>
                      <span className="font-bold" style={{ color: theme?.text }}>{menu.max_dabbas}</span>
                    </div>
                  </div>
                  <div className="w-full rounded-full h-2 mt-2" style={{ backgroundColor: theme?.border }}>
                    <div className="h-2 rounded-full transition-all duration-300" style={{ backgroundColor: theme?.primary, width: `${Math.min(((menu.dabbas_sold || 0) / menu.max_dabbas) * 100, 100)}%` }}></div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {menu.is_veg_only && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: `${theme?.success}20`, color: theme?.success }}>
                      <FaLeaf style={{ marginRight: 4 }} /> Veg Only
                    </span>
                  )}
                  {menu.cooking_style && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: `${theme?.primary}20`, color: theme?.primary }}>
                      <FaFireAlt style={{ marginRight: 4 }} /> {menu.cooking_style}
                    </span>
                  )}
                </div>

                {/* Today's Special */}
                {menu.todays_special && (
                  <div className="border rounded-lg p-3 mb-4" style={{ backgroundColor: theme?.panels, borderColor: theme?.primary }}>
                    <div className="flex items-start space-x-2">
                      <FaStar style={{ color: theme?.secondary, marginRight: 4 }} />
                      <div>
                        <h4 className="font-medium" style={{ color: theme?.secondary }}>Today's Special</h4>
                        <p className="text-sm mt-1" style={{ color: theme?.textSecondary }}>{menu.todays_special}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-between items-center pt-4 border-t" style={{ borderColor: theme?.border }}>
                  <p className="text-sm" style={{ color: theme?.textSecondary }}>
                    Created: {format(new Date(menu.created_at || Date.now()), "MMM d")}
                  </p>
                  <div className="space-x-2">
                    <button className="text-sm hover:opacity-80 transition-opacity" style={{ color: theme?.primary }} onClick={() => toast.info("Edit functionality coming soon!")}>Edit</button>
                    <button className="text-sm hover:opacity-80 transition-opacity" style={{ color: theme?.error }} onClick={() => { const newStatus = !menu.is_active; updateDailyMenu(menu.id || menu._id, { is_active: newStatus }); }}>{menu.is_active ? 'Deactivate' : 'Activate'}</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default DailyMenus;