import VoiceRouter from "../../components/VoiceRouter";
import React, { useState, useEffect } from "react";
import { useVendorAuth } from "../../context/VendorAuthContext";
import { useTheme } from "../../context/ThemeContext";
import toast from "react-hot-toast";
import { format } from "date-fns";
import {
  FaCalendarAlt,
  FaLeaf,
  FaCheckCircle,
  FaTimesCircle,
  FaStar,
  FaFire,
  FaPlus,
  FaTimes,
  FaMinus,
  FaUtensils
} from "react-icons/fa";
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
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [createLoading, setCreateLoading] = useState(false);

  // Create Menu Form State
  const [newMenuData, setNewMenuData] = useState({
    name: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    full_dabba_price: '',
    max_dabbas: '',
    is_veg_only: false,
    cooking_style: '',
    todays_special: '',
    main_items: [],
    side_items: [],
    extras: [],
    is_active: true
  });

  const getAuthHeaders = () => {
    const token = localStorage.getItem("vendor_token");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  const fetchMenuItems = async () => {
    try {
      console.log('Fetching menu items...');
      const response = await fetch(`${API_URL}/api/vendor/menu-items`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch menu items`);
      }

      const data = await response.json();
      console.log('Menu items response:', data);
      
      if (data.success) {
        setMenuItems(data.menu_items || []);
        console.log('Menu items loaded:', data.menu_items?.length || 0);
      } else {
        throw new Error(data.error || "Failed to fetch menu items");
      }
    } catch (err) {
      console.error("Fetch menu items error:", err);
      toast.error("Failed to load menu items");
    }
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
      const response = await fetch(
        `${API_URL}/api/vendor/daily-menus/${menuId}`,
        {
          method: "PATCH",
          headers: getAuthHeaders(),
          body: JSON.stringify(updates),
        }
      );

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

  const createDailyMenu = async () => {
    if (!newMenuData.name || !newMenuData.full_dabba_price || !newMenuData.max_dabbas) {
      toast.error("Please fill in all required fields");
      return;
    }

    setCreateLoading(true);
    try {
      console.log('Creating menu with data:', newMenuData);
      
      const response = await fetch(`${API_URL}/api/vendor/daily-menus`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          ...newMenuData,
          full_dabba_price: parseFloat(newMenuData.full_dabba_price),
          max_dabbas: parseInt(newMenuData.max_dabbas),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP ${response.status}: Failed to create menu`
        );
      }

      const data = await response.json();
      if (data.success) {
        toast.success("Daily menu created successfully!");
        setShowCreateModal(false);
        resetCreateForm();
        fetchDailyMenus();
      } else {
        throw new Error(data.error || "Failed to create menu");
      }
    } catch (err) {
      console.error("Create menu error:", err);
      toast.error(err.message);
    } finally {
      setCreateLoading(false);
    }
  };

  const resetCreateForm = () => {
    setNewMenuData({
      name: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
      full_dabba_price: "",
      max_dabbas: "",
      is_veg_only: false,
      cooking_style: "",
      todays_special: "",
      main_items: [],
      side_items: [],
      extras: [],
      is_active: true,
    });
  };

  const handleItemSelection = (itemId, category) => {
    setNewMenuData((prev) => {
      const currentItems = prev[category] || [];
      const isSelected = currentItems.includes(itemId);

      return {
        ...prev,
        [category]: isSelected
          ? currentItems.filter((id) => id !== itemId)
          : [...currentItems, itemId],
      };
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewMenuData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const openCreateModal = () => {
    setShowCreateModal(true);
    fetchMenuItems();
  };

  useEffect(() => {
    fetchDailyMenus();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
            style={{ borderColor: theme.primary }}
          ></div>
          <div className="text-lg" style={{ color: theme.text }}>
            Loading daily menus...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div
          className="text-center p-8 rounded-2xl"
          style={{ backgroundColor: theme.panels }}
        >
          <p className="text-lg mb-4" style={{ color: theme.error }}>
            {error}
          </p>
          <button
            onClick={fetchDailyMenus}
            className="px-6 py-2.5 rounded-lg font-medium transition-all duration-200 hover:transform hover:scale-105"
            style={{ backgroundColor: theme.primary, color: "#fff" }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div
        className="rounded-2xl border p-6"
        style={{ backgroundColor: theme.panels, borderColor: theme.border }}
      >
        <div className="flex justify-between items-center">
          <div>
            <h2
              className="text-2xl font-bold flex items-center gap-3"
              style={{ color: theme.text }}
            >
              <FaCalendarAlt style={{ color: theme.primary }} /> Daily Tiffin Plans
            </h2>
            <p className="text-lg mt-1" style={{ color: theme.textSecondary }}>
              Manage your daily menu schedules
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:transform hover:scale-105 hover:shadow-lg"
            style={{ backgroundColor: theme.primary, color: "#fff" }}
          >
            <FaPlus size={16} /> Create New Menu
          </button>
        </div>
      </div>

      {/* Create Menu Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" style={{ backgroundColor: theme.panels }}>
            <div className="sticky top-0 p-6 border-b" style={{ backgroundColor: theme.panels, borderColor: theme.border }}>
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold" style={{ color: theme.primary }}>Create New Daily Menu</h2>
                <button onClick={() => setShowCreateModal(false)} className="text-2xl hover:opacity-70" style={{ color: theme.error }}>
                  <FaTimes />
                </button>
              </div>
              {/* Debug Info */}
              <div className="mt-2 text-sm" style={{ color: theme.textSecondary }}>
                Menu Items Available: {menuItems.length}
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: theme.text }}>Menu Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={newMenuData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg"
                    style={{ backgroundColor: theme.background, borderColor: theme.border, color: theme.text }}
                    placeholder="e.g., North Indian Thali"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: theme.text }}>Date *</label>
                  <input
                    type="date"
                    name="date"
                    value={newMenuData.date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg"
                    style={{ backgroundColor: theme.background, borderColor: theme.border, color: theme.text }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: theme.text }}>Full Dabba Price *</label>
                  <input
                    type="number"
                    name="full_dabba_price"
                    value={newMenuData.full_dabba_price}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg"
                    style={{ backgroundColor: theme.background, borderColor: theme.border, color: theme.text }}
                    placeholder="120"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: theme.text }}>Max Dabbas *</label>
                  <input
                    type="number"
                    name="max_dabbas"
                    value={newMenuData.max_dabbas}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg"
                    style={{ backgroundColor: theme.background, borderColor: theme.border, color: theme.text }}
                    placeholder="50"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: theme.text }}>Description</label>
                <textarea
                  name="description"
                  value={newMenuData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg h-20"
                  style={{ backgroundColor: theme.background, borderColor: theme.border, color: theme.text }}
                  placeholder="Brief description of today's menu..."
                />
              </div>

              {/* Additional Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: theme.text }}>Cooking Style</label>
                  <select
                    name="cooking_style"
                    value={newMenuData.cooking_style}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg"
                    style={{ backgroundColor: theme.background, borderColor: theme.border, color: theme.text }}
                  >
                    <option value="">Select Style</option>
                    <option value="Traditional">Traditional</option>
                    <option value="Homestyle">Homestyle</option>
                    <option value="Street Style">Street Style</option>
                    <option value="Regional">Regional</option>
                  </select>
                </div>
                <div className="flex items-center space-x-4 pt-6">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="is_veg_only"
                      checked={newMenuData.is_veg_only}
                      onChange={handleInputChange}
                      className="rounded"
                    />
                    <span style={{ color: theme.text }}>Veg Only</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={newMenuData.is_active}
                      onChange={handleInputChange}
                      className="rounded"
                    />
                    <span style={{ color: theme.text }}>Active</span>
                  </label>
                </div>
              </div>

              {/* Today's Special */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: theme.text }}>Today's Special</label>
                <input
                  type="text"
                  name="todays_special"
                  value={newMenuData.todays_special}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  style={{ backgroundColor: theme.background, borderColor: theme.border, color: theme.text }}
                  placeholder="What's special about today's menu?"
                />
              </div>

              {/* Menu Items Selection */}
              {menuItems.length > 0 ? (
                <div>
                  <h3 className="text-lg font-semibold mb-4" style={{ color: theme.primary }}>Select Menu Items</h3>
                  
                  {/* Main Items */}
                  <div className="mb-6">
                    <h4 className="font-medium mb-3" style={{ color: theme.text }}>
                      Main Items ({newMenuData.main_items.length} selected)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {menuItems.map(item => (
                        <label 
                          key={item._id} 
                          className="flex items-center space-x-2 p-2 rounded border cursor-pointer hover:opacity-80" 
                          style={{ 
                            backgroundColor: newMenuData.main_items.includes(item._id) ? `${theme.primary}20` : theme.background, 
                            borderColor: theme.border 
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={newMenuData.main_items.includes(item._id)}
                            onChange={() => handleItemSelection(item._id, 'main_items')}
                            className="rounded"
                          />
                          <div className="flex-1">
                            <span className="text-sm font-medium" style={{ color: theme.text }}>
                              {item.name}
                            </span>
                            <div className="flex items-center justify-between">
                              <span className="text-xs" style={{ color: theme.textSecondary }}>
                                ₹{item.price}
                              </span>
                              {item.is_vegetarian && <FaLeaf className="text-green-500 text-xs" />}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Side Items */}
                  <div className="mb-6">
                    <h4 className="font-medium mb-3" style={{ color: theme.text }}>
                      Side Items ({newMenuData.side_items.length} selected)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {menuItems.map(item => (
                        <label 
                          key={item._id} 
                          className="flex items-center space-x-2 p-2 rounded border cursor-pointer hover:opacity-80" 
                          style={{ 
                            backgroundColor: newMenuData.side_items.includes(item._id) ? `${theme.primary}20` : theme.background, 
                            borderColor: theme.border 
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={newMenuData.side_items.includes(item._id)}
                            onChange={() => handleItemSelection(item._id, 'side_items')}
                            className="rounded"
                          />
                          <div className="flex-1">
                            <span className="text-sm font-medium" style={{ color: theme.text }}>
                              {item.name}
                            </span>
                            <div className="flex items-center justify-between">
                              <span className="text-xs" style={{ color: theme.textSecondary }}>
                                ₹{item.price}
                              </span>
                              {item.is_vegetarian && <FaLeaf className="text-green-500 text-xs" />}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Extras */}
                  <div className="mb-6">
                    <h4 className="font-medium mb-3" style={{ color: theme.text }}>
                      Extras ({newMenuData.extras.length} selected)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {menuItems.map(item => (
                        <label 
                          key={item._id} 
                          className="flex items-center space-x-2 p-2 rounded border cursor-pointer hover:opacity-80" 
                          style={{ 
                            backgroundColor: newMenuData.extras.includes(item._id) ? `${theme.primary}20` : theme.background, 
                            borderColor: theme.border 
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={newMenuData.extras.includes(item._id)}
                            onChange={() => handleItemSelection(item._id, 'extras')}
                            className="rounded"
                          />
                          <div className="flex-1">
                            <span className="text-sm font-medium" style={{ color: theme.text }}>
                              {item.name}
                            </span>
                            <div className="flex items-center justify-between">
                              <span className="text-xs" style={{ color: theme.textSecondary }}>
                                ₹{item.price}
                              </span>
                              {item.is_vegetarian && <FaLeaf className="text-green-500 text-xs" />}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8" style={{ color: theme.textSecondary }}>
                  <FaUtensils className="text-4xl mx-auto mb-4 opacity-30" />
                  <p>No menu items found. Please create some menu items first.</p>
                  <p className="text-sm mt-2">Go to Menu Items tab to add food items.</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end space-x-4 pt-6 border-t" style={{ borderColor: theme.border }}>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-2 rounded-lg font-medium border"
                  style={{ borderColor: theme.border, color: theme.textSecondary }}
                  disabled={createLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={createDailyMenu}
                  disabled={createLoading}
                  className="px-6 py-2 rounded-lg font-semibold flex items-center space-x-2"
                  style={{ backgroundColor: theme.primary, color: "white" }}
                >
                  {createLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <FaPlus />
                      <span>Create Menu</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Menus Grid */}
      {menus.length === 0 ? (
        <div
          className="rounded-2xl border p-12 text-center"
          style={{ backgroundColor: theme.panels, borderColor: theme.border }}
        >
          <MdFoodBank
            className="text-6xl mx-auto mb-4 opacity-30"
            style={{ color: theme.primary }}
          />
          <p className="text-lg mb-6" style={{ color: theme.textSecondary }}>
            No daily menus found. Create your first daily menu to get started.
          </p>
          <button
            onClick={openCreateModal}
            className="px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:transform hover:scale-105"
            style={{ backgroundColor: theme.primary, color: "#fff" }}
          >
            Create First Menu
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menus.map((menu) => (
            <div
              key={menu.id || menu._id}
              className="rounded-2xl border p-6 transition-all duration-200 hover:transform hover:scale-105 hover:shadow-lg"
              style={{
                backgroundColor: theme.panels,
                borderColor: theme.border,
                borderLeft: `5px solid ${
                  menu.is_active ? theme.success : theme.warning
                }`,
              }}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3
                    className="text-xl font-semibold"
                    style={{ color: theme.text }}
                  >
                    {menu.name}
                  </h3>
                  <p className="text-sm" style={{ color: theme.textSecondary }}>
                    {format(new Date(menu.date), "PPP")}
                  </p>
                </div>
                <span
                  className="px-3 py-1 rounded-full text-xs font-semibold flex items-center"
                  style={{
                    backgroundColor: menu.is_active
                      ? `${theme.success}15`
                      : `${theme.error}15`,
                    color: menu.is_active ? theme.success : theme.error,
                  }}
                >
                  {menu.is_active ? (
                    <>
                      <FaCheckCircle className="mr-1" /> Active
                    </>
                  ) : (
                    <>
                      <FaTimesCircle className="mr-1" /> Inactive
                    </>
                  )}
                </span>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <span
                  className="text-3xl font-bold"
                  style={{ color: theme.primary }}
                >
                  ₹{menu.full_dabba_price}
                </span>
                <FiTrendingUp size={16} style={{ color: theme.success }} />
              </div>

              {/* Dabba Progress */}
              <div
                className="mb-4 p-4 rounded-xl"
                style={{ backgroundColor: theme.background }}
              >
                <div className="flex justify-between items-center mb-2">
                  <span
                    className="text-sm font-medium"
                    style={{ color: theme.textSecondary }}
                  >
                    Dabbas Sold
                  </span>
                  <span className="font-bold" style={{ color: theme.text }}>
                    {menu.dabbas_sold || 0}/{menu.max_dabbas}
                  </span>
                </div>
                <div
                  className="w-full rounded-full h-2 overflow-hidden"
                  style={{ backgroundColor: theme.border }}
                >
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      backgroundColor: theme.primary,
                      width: `${Math.min(
                        ((menu.dabbas_sold || 0) / menu.max_dabbas) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {menu.is_veg_only && (
                  <span
                    className="px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1"
                    style={{
                      backgroundColor: `${theme.success}15`,
                      color: theme.success,
                    }}
                  >
                    <FaLeaf /> Pure Veg
                  </span>
                )}
                {menu.todays_special && (
                  <span
                    className="px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1"
                    style={{
                      backgroundColor: `${theme.warning}15`,
                      color: theme.warning,
                    }}
                  >
                    <FaFire /> Special
                  </span>
                )}
              </div>

              {/* Today's Special */}
              {menu.todays_special && (
                <div
                  className="border rounded-xl p-4 mb-4 transition-all hover:bg-opacity-50"
                  style={{
                    backgroundColor: theme.background,
                    borderColor: theme.border,
                  }}
                >
                  <div className="flex items-start gap-2">
                    <FaStar style={{ color: theme.warning }} />
                    <p className="text-sm" style={{ color: theme.text }}>
                      {menu.todays_special}
                    </p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div
                className="flex justify-between items-center pt-4"
                style={{ borderTop: `1px solid ${theme.border}` }}
              >
                <p className="text-xs" style={{ color: theme.textSecondary }}>
                  Items:{" "}
                  {(menu.main_items?.length || 0) +
                    (menu.side_items?.length || 0) +
                    (menu.extras?.length || 0)}
                </p>
                <div className="flex gap-2">
                  <button
                    className="px-4 py-1.5 text-sm rounded-lg hover:opacity-80 transition-all duration-200 hover:transform hover:scale-105"
                    style={{
                      backgroundColor: `${theme.primary}15`,
                      color: theme.primary,
                    }}
                    onClick={() =>
                      toast.info("Edit functionality coming soon!")
                    }
                  >
                    Edit
                  </button>
                  <button
                    className="px-4 py-1.5 text-sm rounded-lg hover:opacity-80 transition-all duration-200 hover:transform hover:scale-105"
                    style={{
                      backgroundColor: menu.is_active
                        ? `${theme.error}15`
                        : `${theme.success}15`,
                      color: menu.is_active ? theme.error : theme.success,
                    }}
                    onClick={() => {
                      const newStatus = !menu.is_active;
                      updateDailyMenu(menu.id || menu._id, {
                        is_active: newStatus,
                      });
                    }}
                  >
                    {menu.is_active ? "Deactivate" : "Activate"}
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