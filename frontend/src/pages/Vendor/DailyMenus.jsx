import React, { useState, useEffect } from "react";
import { useVendorAuth } from "../../context/VendorAuthContext";
import toast from "react-hot-toast";
import { format } from "date-fns";

const DailyMenus = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { vendor } = useVendorAuth();
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-lg">Loading daily menus...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-center p-8 bg-red-50 rounded-lg border border-red-200">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <p className="text-red-800 mb-4 text-lg">{error}</p>
          <button 
            onClick={fetchDailyMenus} 
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Daily Menus</h1>
          <p className="text-gray-600 mt-2">Manage your daily menu offerings</p>
        </div>
        <button
          className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
          onClick={() => {
            toast.info("Create menu modal coming soon!");
          }}
        >
          + Create New Menu
        </button>
      </div>

      {/* Menus Grid */}
      {menus.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menus.map((menu) => (
            <div key={menu.id || menu._id} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow">
              <div className="p-6">
                {/* Menu Header */}
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold text-gray-800">{menu.name}</h2>
                  <span 
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      menu.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {menu.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {/* Date */}
                <p className="text-gray-600 mb-3">
                  📅 {format(new Date(menu.date), "PPP")}
                </p>

                {/* Price */}
                <div className="text-2xl font-bold text-green-600 mb-4">
                  ₹{menu.full_dabba_price}
                </div>

                {/* Menu Items Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Main Items:</span>
                    <span className="font-medium">{menu.main_items?.length || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Side Items:</span>
                    <span className="font-medium">{menu.side_items?.length || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Extras:</span>
                    <span className="font-medium">{menu.extras?.length || 0}</span>
                  </div>
                </div>

                {/* Dabba Stats */}
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Dabbas Sold</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-blue-600">
                        {menu.dabbas_sold || 0}
                      </span>
                      <span className="text-gray-500">/</span>
                      <span className="font-bold text-gray-700">
                        {menu.max_dabbas}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${Math.min(((menu.dabbas_sold || 0) / menu.max_dabbas) * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {menu.is_veg_only && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                      🌱 Veg Only
                    </span>
                  )}
                  {menu.cooking_style && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {menu.cooking_style}
                    </span>
                  )}
                </div>

                {/* Today's Special */}
                {menu.todays_special && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                    <div className="flex items-start space-x-2">
                      <span className="text-yellow-600">⭐</span>
                      <div>
                        <h4 className="font-medium text-yellow-800">Today's Special</h4>
                        <p className="text-yellow-700 text-sm mt-1">{menu.todays_special}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <span className="text-xs text-gray-500">
                    Created: {format(new Date(menu.created_at || Date.now()), "MMM d")}
                  </span>
                  <div className="space-x-2">
                    <button
                      className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                      onClick={() => {
                        toast.info("Edit functionality coming soon!");
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      onClick={() => {
                        const newStatus = !menu.is_active;
                        updateDailyMenu(menu.id || menu._id, { is_active: newStatus });
                      }}
                    >
                      {menu.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🍽️</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No menus created yet</h3>
          <p className="text-gray-600 mb-6">
            Start by creating your first daily menu to offer customers.
          </p>
          <button
            className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            onClick={() => {
              toast.info("Create menu modal coming soon!");
            }}
          >
            Create Your First Menu
          </button>
        </div>
      )}
    </div>
  );
};

export default DailyMenus;