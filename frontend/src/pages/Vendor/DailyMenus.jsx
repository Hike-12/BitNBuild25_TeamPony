import React, { useState, useEffect } from "react";
import { useVendorAuth } from "../../context/VendorAuthContext";
import { useTheme } from "../../context/ThemeContext";
import toast from "react-hot-toast";

const DailyMenus = () => {
  const { vendor } = useVendorAuth();
  const { isDarkMode, theme } = useTheme();
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");

  // Create Menu Modal States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [createForm, setCreateForm] = useState({
    name: '',
    date: '',
    menu_items: [],
    special_instructions: '',
    max_orders: 50
  });
  const [createLoading, setCreateLoading] = useState(false);

  useEffect(() => {
    fetchMenus();
  }, [selectedDate]);

  const fetchMenus = async () => {
    try {
      let url = `${import.meta.env.VITE_API_URL}/api/vendor/daily-menus/`;
      if (selectedDate) {
        url += `?date=${selectedDate}`;
      }
      
      const response = await fetch(url, {
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setMenus(data.menus || data.results || data || []);
        setError(null);
      } else {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        setError(`Failed to fetch daily menus: ${response.status}`);
      }
    } catch (err) {
      setError("Error fetching daily menus");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMenuItems = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/vendor/menu-items/`, {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setMenuItems(data.menu_items || []);
      }
    } catch (err) {
      console.error("Error fetching menu items:", err);
    }
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setLoading(true);
    setError(null);
  };

  const toggleMenuStatus = async (menuId, currentStatus) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/vendor/daily-menus/${menuId}/`,
        {
          method: 'PATCH',
          credentials: "include",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            is_active: !currentStatus
          })
        }
      );
      
      if (response.ok) {
        fetchMenus();
        toast.success('Menu status updated successfully');
      } else {
        toast.error('Failed to update menu status');
      }
    } catch (err) {
      console.error("Error updating menu:", err);
      toast.error('Error updating menu status');
    }
  };

  const handleCreateFormChange = (e) => {
    const { name, value } = e.target;
    setCreateForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMenuItemToggle = (itemId) => {
    setCreateForm(prev => ({
      ...prev,
      menu_items: prev.menu_items.includes(itemId)
        ? prev.menu_items.filter(id => id !== itemId)
        : [...prev.menu_items, itemId]
    }));
  };

  const handleCreateMenu = async (e) => {
    e.preventDefault();
    
    if (!createForm.name || !createForm.date || createForm.menu_items.length === 0) {
      toast.error('Please fill in all required fields and select at least one menu item');
      return;
    }

    setCreateLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/vendor/daily-menus/`, {
        method: 'POST',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createForm)
      });

      if (response.ok) {
        setShowCreateModal(false);
        setCreateForm({
          name: '',
          date: '',
          menu_items: [],
          special_instructions: '',
          max_orders: 50
        });
        fetchMenus();
        toast.success('Menu created successfully!');
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to create menu');
      }
    } catch (err) {
      console.error("Error creating menu:", err);
      toast.error('Error creating menu');
    } finally {
      setCreateLoading(false);
    }
  };

  const openCreateModal = () => {
    setShowCreateModal(true);
    fetchMenuItems();
  };

  if (loading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center transition-all duration-300"
        style={{ backgroundColor: theme.background }}
      >
        <div className="text-center">
          <div 
            className="animate-spin rounded-full h-16 w-16 border-4 border-t-transparent mx-auto mb-4"
            style={{ borderColor: `${theme.primary} transparent transparent transparent` }}
          ></div>
          <div 
            className="text-xl font-semibold" 
            style={{ color: theme.text }}
          >
            Loading daily menus...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen transition-all duration-300"
      style={{ backgroundColor: theme.background }}
    >
      {/* Header */}
      <header 
        className="sticky top-0 z-40 border-b backdrop-blur-md"
        style={{ 
          backgroundColor: `${theme.panels}95`,
          borderColor: theme.border 
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 
              className="text-2xl font-bold"
              style={{ color: theme.primary }}
            >
              Daily Menus Management
            </h1>
            <a
              href="/vendor/dashboard"
              className="transition-colors hover:opacity-80"
              style={{ color: theme.textSecondary }}
            >
              ← Back to Dashboard
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Filter Section */}
        <div 
          className="rounded-2xl border p-6 mb-6 backdrop-blur-sm"
          style={{ 
            backgroundColor: theme.panels,
            borderColor: theme.border 
          }}
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              <label 
                className="font-medium"
                style={{ color: theme.textSecondary }}
              >
                Filter by date:
              </label>
              <input 
                type="date" 
                value={selectedDate} 
                onChange={handleDateChange}
                className="rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-300"
                style={{
                  backgroundColor: theme.background,
                  borderColor: theme.border,
                  color: theme.text,
                  focusRingColor: theme.primary
                }}
              />
              {selectedDate && (
                <button 
                  onClick={() => {
                    setSelectedDate("");
                    setLoading(true);
                  }} 
                  className="transition-colors hover:opacity-80"
                  style={{ color: theme.textSecondary }}
                >
                  Clear Filter
                </button>
              )}
            </div>
            <button 
              onClick={openCreateModal}
              className="px-6 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
              style={{ 
                backgroundColor: theme.success,
                color: 'white'
              }}
            >
              + Create New Menu
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div 
            className="rounded-2xl border p-4 mb-6"
            style={{ 
              backgroundColor: `${theme.error}10`,
              borderColor: theme.error 
            }}
          >
            <p style={{ color: theme.error }}>{error}</p>
          </div>
        )}

        {/* Menus Count */}
        <div className="mb-4">
          <p style={{ color: theme.textSecondary }}>
            Total Menus: <span className="font-semibold" style={{ color: theme.text }}>{menus.length}</span>
          </p>
        </div>

        {/* Menus Grid */}
        {menus.length === 0 ? (
          <div 
            className="rounded-2xl border p-8 text-center"
            style={{ 
              backgroundColor: theme.panels,
              borderColor: theme.border 
            }}
          >
            <p style={{ color: theme.textSecondary }}>No menus found for the selected criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {menus.map((menu) => (
              <div 
                key={menu.id} 
                className="rounded-2xl border p-6 hover:shadow-lg transition-all duration-300"
                style={{ 
                  backgroundColor: theme.panels,
                  borderColor: theme.border 
                }}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 
                    className="text-xl font-semibold"
                    style={{ color: theme.text }}
                  >
                    {menu.name}
                  </h3>
                  <button
                    onClick={() => toggleMenuStatus(menu.id, menu.is_active)}
                    className="px-3 py-1 rounded-full text-sm font-medium transition-colors"
                    style={{
                      backgroundColor: menu.is_active 
                        ? `${theme.success}20` 
                        : `${theme.error}20`,
                      color: menu.is_active ? theme.success : theme.error
                    }}
                  >
                    {menu.is_active ? "Active" : "Inactive"}
                  </button>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span style={{ color: theme.textSecondary }}>Date:</span>
                    <span style={{ color: theme.text }}>
                      {new Date(menu.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: theme.textSecondary }}>Total Price:</span>
                    <span 
                      className="font-semibold"
                      style={{ color: theme.success }}
                    >
                      ₹{menu.total_price || "Not set"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: theme.textSecondary }}>Available:</span>
                    <span style={{ color: menu.is_available ? theme.success : theme.error }}>
                      {menu.is_available ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: theme.textSecondary }}>Orders:</span>
                    <span style={{ color: theme.text }}>
                      {menu.orders_count} / {menu.max_orders}
                      {menu.orders_count >= menu.max_orders && (
                        <span className="ml-2" style={{ color: theme.error }}>(Sold Out)</span>
                      )}
                    </span>
                  </div>
                </div>
                
                {menu.special_instructions && (
                  <div 
                    className="mb-4 p-3 rounded-lg"
                    style={{ backgroundColor: theme.background }}
                  >
                    <p 
                      className="text-sm"
                      style={{ color: theme.textSecondary }}
                    >
                      <span className="font-medium">Special Instructions:</span> {menu.special_instructions}
                    </p>
                  </div>
                )}

                <div 
                  className="border-t pt-4"
                  style={{ borderColor: theme.border }}
                >
                  <h4 
                    className="font-medium mb-3"
                    style={{ color: theme.text }}
                  >
                    Menu Items ({menu.menu_items?.length || 0}):
                  </h4>
                  <div className="space-y-2">
                    {menu.menu_items?.map((item) => (
                      <div 
                        key={item.id} 
                        className="p-3 rounded-lg"
                        style={{ backgroundColor: theme.background }}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p 
                              className="font-medium"
                              style={{ color: theme.text }}
                            >
                              {item.name}
                            </p>
                            {item.description && (
                              <p 
                                className="text-sm mt-1"
                                style={{ color: theme.textSecondary }}
                              >
                                {item.description}
                              </p>
                            )}
                            <div className="flex items-center space-x-2 mt-2 text-xs">
                              <span style={{ color: theme.textSecondary }}>{item.category}</span>
                              {item.is_vegetarian && (
                                <span style={{ color: theme.success }}>• Veg</span>
                              )}
                              {!item.is_vegetarian && (
                                <span style={{ color: theme.error }}>• Non-Veg</span>
                              )}
                              {item.is_vegan && (
                                <span style={{ color: theme.success }}>• Vegan</span>
                              )}
                              {item.is_spicy && (
                                <span style={{ color: theme.warning }}>• Spicy</span>
                              )}
                            </div>
                          </div>
                          <span 
                            className="font-semibold ml-4"
                            style={{ color: theme.success }}
                          >
                            ₹{item.price}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div 
                  className="flex justify-between items-center mt-4 pt-4 border-t"
                  style={{ borderColor: theme.border }}
                >
                  <p 
                    className="text-sm"
                    style={{ color: theme.textSecondary }}
                  >
                    Created: {new Date(menu.created_at).toLocaleDateString()}
                  </p>
                  <div className="space-x-2">
                    <button 
                      className="text-sm hover:opacity-80 transition-opacity"
                      style={{ color: theme.primary }}
                    >
                      Edit
                    </button>
                    <button 
                      className="text-sm hover:opacity-80 transition-opacity"
                      style={{ color: theme.error }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create Menu Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div 
            className="rounded-2xl border p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            style={{ 
              backgroundColor: theme.panels,
              borderColor: theme.border 
            }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 
                className="text-2xl font-bold"
                style={{ color: theme.text }}
              >
                Create New Daily Menu
              </h2>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="text-2xl hover:opacity-80 transition-opacity"
                style={{ color: theme.textSecondary }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateMenu} className="space-y-4">
              {/* Menu Name */}
              <div>
                <label 
                  className="block mb-2 font-medium"
                  style={{ color: theme.textSecondary }}
                >
                  Menu Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={createForm.name}
                  onChange={handleCreateFormChange}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-300"
                  style={{
                    backgroundColor: theme.background,
                    borderColor: theme.border,
                    color: theme.text,
                    focusRingColor: theme.primary
                  }}
                  placeholder="e.g., Today's Special, Weekend Feast"
                  required
                />
              </div>

              {/* Date */}
              <div>
                <label 
                  className="block mb-2 font-medium"
                  style={{ color: theme.textSecondary }}
                >
                  Date *
                </label>
                <input
                  type="date"
                  name="date"
                  value={createForm.date}
                  onChange={handleCreateFormChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-300"
                  style={{
                    backgroundColor: theme.background,
                    borderColor: theme.border,
                    color: theme.text,
                    focusRingColor: theme.primary
                  }}
                  required
                />
              </div>

              {/* Max Orders */}
              <div>
                <label 
                  className="block mb-2 font-medium"
                  style={{ color: theme.textSecondary }}
                >
                  Maximum Orders
                </label>
                <input
                  type="number"
                  name="max_orders"
                  value={createForm.max_orders}
                  onChange={handleCreateFormChange}
                  min="1"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-300"
                  style={{
                    backgroundColor: theme.background,
                    borderColor: theme.border,
                    color: theme.text,
                    focusRingColor: theme.primary
                  }}
                />
              </div>

              {/* Special Instructions */}
              <div>
                <label 
                  className="block mb-2 font-medium"
                  style={{ color: theme.textSecondary }}
                >
                  Special Instructions
                </label>
                <textarea
                  name="special_instructions"
                  value={createForm.special_instructions}
                  onChange={handleCreateFormChange}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-300"
                  style={{
                    backgroundColor: theme.background,
                    borderColor: theme.border,
                    color: theme.text,
                    focusRingColor: theme.primary
                  }}
                  rows="3"
                  placeholder="Any special notes for customers..."
                />
              </div>

              {/* Menu Items Selection */}
              <div>
                <label 
                  className="block mb-2 font-medium"
                  style={{ color: theme.textSecondary }}
                >
                  Select Menu Items * ({createForm.menu_items.length} selected)
                </label>
                <div 
                  className="max-h-60 overflow-y-auto border rounded-lg"
                  style={{ borderColor: theme.border }}
                >
                  {menuItems.length === 0 ? (
                    <div 
                      className="p-4 text-center"
                      style={{ color: theme.textSecondary }}
                    >
                      No menu items available. Please create menu items first.
                    </div>
                  ) : (
                    menuItems.map((item) => (
                      <div 
                        key={item.id} 
                        className="p-3 border-b last:border-b-0"
                        style={{ borderColor: theme.border }}
                      >
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={createForm.menu_items.includes(item.id)}
                            onChange={() => handleMenuItemToggle(item.id)}
                            className="mr-3"
                            style={{ accentColor: theme.primary }}
                          />
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <p 
                                  className="font-medium"
                                  style={{ color: theme.text }}
                                >
                                  {item.name}
                                </p>
                                <p 
                                  className="text-sm"
                                  style={{ color: theme.textSecondary }}
                                >
                                  {item.description}
                                </p>
                                <div className="flex items-center space-x-2 mt-1 text-xs">
                                  <span style={{ color: theme.textSecondary }}>{item.category}</span>
                                  {item.is_vegetarian && <span style={{ color: theme.success }}>• Veg</span>}
                                  {item.is_spicy && <span style={{ color: theme.warning }}>• Spicy</span>}
                                </div>
                              </div>
                              <span 
                                className="font-semibold"
                                style={{ color: theme.success }}
                              >
                                ₹{item.price}
                              </span>
                            </div>
                          </div>
                        </label>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 transition-colors hover:opacity-80"
                  style={{ color: theme.textSecondary }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createLoading || menuItems.length === 0}
                  className="px-6 py-2 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ 
                    backgroundColor: theme.success,
                    color: 'white'
                  }}
                >
                  {createLoading ? 'Creating...' : 'Create Menu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyMenus;