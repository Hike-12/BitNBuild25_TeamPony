import React, { useState, useEffect } from "react";
import { useVendorAuth } from "../../context/VendorAuthContext";
import { useTheme } from "../../context/ThemeContext";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { FaCalendarAlt, FaLeaf, FaCheckCircle, FaTimesCircle, FaStar, FaFire, FaPlus } from "react-icons/fa";
import { MdFoodBank } from "react-icons/md";
import { GiCookingPot } from "react-icons/gi";
import { FiTrendingUp } from "react-icons/fi";

const DailyMenus = () => {
  const { vendor } = useVendorAuth();
  const { theme } = useTheme();
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
        <div className="text-center p-8 rounded-2xl" style={{ backgroundColor: theme.panels }}>
          <p className="text-lg mb-4" style={{ color: theme.error }}>{error}</p>
          <button onClick={fetchDailyMenus} className="px-6 py-2.5 rounded-lg font-medium transition-all duration-200 hover:transform hover:scale-105"
            style={{ backgroundColor: theme.primary, color: '#fff' }}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border p-6" 
        style={{ backgroundColor: theme.panels, borderColor: theme.border }}>
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-3" style={{ color: theme.text }}>
              <FaCalendarAlt style={{ color: theme.primary }} /> Daily Tiffin Plans
            </h2>
            <p className="text-lg mt-1" style={{ color: theme.textSecondary }}>
              Manage your daily menu schedules
            </p>
          </div>
          <button
            onClick={() => toast.info("Create menu modal coming soon!")}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:transform hover:scale-105 hover:shadow-lg"
            style={{ backgroundColor: theme.primary, color: '#fff' }}
          >
            <FaPlus size={16} /> Create New Menu
          </button>
        </div>
      </div>

      {/* Menus Grid */}
      {menus.length === 0 ? (
        <div className="rounded-2xl border p-12 text-center" 
          style={{ backgroundColor: theme.panels, borderColor: theme.border }}>
          <MdFoodBank className="text-6xl mx-auto mb-4 opacity-30" style={{ color: theme.primary }} />
          <p className="text-lg mb-6" style={{ color: theme.textSecondary }}>
            No daily menus found. Create your first daily menu to get started.
          </p>
          <button onClick={() => toast.info("Create menu modal coming soon!")}
            className="px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:transform hover:scale-105"
            style={{ backgroundColor: theme.primary, color: '#fff' }}>
            Create First Menu
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menus.map((menu) => (
            <div key={menu.id || menu._id} className="rounded-2xl border p-6 transition-all duration-200 hover:transform hover:scale-105 hover:shadow-lg"
              style={{ 
                backgroundColor: theme.panels, 
                borderColor: theme.border,
                borderLeft: `5px solid ${menu.is_active ? theme.success : theme.warning}` 
              }}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold" style={{ color: theme.text }}>{menu.name}</h3>
                  <p className="text-sm" style={{ color: theme.textSecondary }}>
                    {format(new Date(menu.date), "PPP")}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold flex items-center"
                  style={{
                    backgroundColor: menu.is_active ? `${theme.success}15` : `${theme.error}15`,
                    color: menu.is_active ? theme.success : theme.error
                  }}>
                  {menu.is_active ? <><FaCheckCircle className="mr-1" /> Active</> : <><FaTimesCircle className="mr-1" /> Inactive</>}
                </span>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <span className="text-3xl font-bold" style={{ color: theme.primary }}>
                  ₹{menu.full_dabba_price}
                </span>
                <FiTrendingUp size={16} style={{ color: theme.success }} />
              </div>

              {/* Dabba Progress */}
              <div className="mb-4 p-4 rounded-xl" style={{ backgroundColor: theme.background }}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium" style={{ color: theme.textSecondary }}>Dabbas Sold</span>
                  <span className="font-bold" style={{ color: theme.text }}>
                    {menu.dabbas_sold || 0}/{menu.max_dabbas}
                  </span>
                </div>
                <div className="w-full rounded-full h-2 overflow-hidden" style={{ backgroundColor: theme.border }}>
                  <div className="h-2 rounded-full transition-all duration-300"
                    style={{
                      backgroundColor: theme.primary,
                      width: `${Math.min(((menu.dabbas_sold || 0) / menu.max_dabbas) * 100, 100)}%`
                    }} />
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {menu.is_veg_only && (
                  <span className="px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1"
                    style={{ backgroundColor: `${theme.success}15`, color: theme.success }}>
                    <FaLeaf /> Pure Veg
                  </span>
                )}
                {menu.todays_special && (
                  <span className="px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1"
                    style={{ backgroundColor: `${theme.warning}15`, color: theme.warning }}>
                    <FaFire /> Special
                  </span>
                )}
              </div>

              {/* Today's Special */}
              {menu.todays_special && (
                <div className="border rounded-xl p-4 mb-4 transition-all hover:bg-opacity-50"
                  style={{ 
                    backgroundColor: theme.background, 
                    borderColor: theme.border 
                  }}>
                  <div className="flex items-start gap-2">
                    <FaStar style={{ color: theme.warning }} />
                    <p className="text-sm" style={{ color: theme.text }}>
                      {menu.todays_special}
                    </p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-between items-center pt-4"
                style={{ borderTop: `1px solid ${theme.border}` }}>
                <p className="text-xs" style={{ color: theme.textSecondary }}>
                  Items: {(menu.main_items?.length || 0) + (menu.side_items?.length || 0) + (menu.extras?.length || 0)}
                </p>
                <div className="flex gap-2">
                  <button className="px-4 py-1.5 text-sm rounded-lg hover:opacity-80 transition-all duration-200 hover:transform hover:scale-105"
                    style={{ 
                      backgroundColor: `${theme.primary}15`,
                      color: theme.primary 
                    }}
                    onClick={() => toast.info("Edit functionality coming soon!")}>
                    Edit
                  </button>
                  <button className="px-4 py-1.5 text-sm rounded-lg hover:opacity-80 transition-all duration-200 hover:transform hover:scale-105"
                    style={{ 
                      backgroundColor: menu.is_active ? `${theme.error}15` : `${theme.success}15`,
                      color: menu.is_active ? theme.error : theme.success
                    }}
                    onClick={() => {
                      const newStatus = !menu.is_active;
                      updateDailyMenu(menu.id || menu._id, { is_active: newStatus });
                    }}>
                    {menu.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DailyMenus;