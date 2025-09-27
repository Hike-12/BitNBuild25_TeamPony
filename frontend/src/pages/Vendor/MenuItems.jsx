import React, { useState, useEffect } from "react";
import { useVendorAuth } from "../../context/VendorAuthContext";
import { useTheme } from "../../context/ThemeContext";
import toast from "react-hot-toast";

const MenuItems = () => {
  const { vendor } = useVendorAuth();
  const { isDarkMode, theme } = useTheme();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Create Modal States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: "",
    category: "sabzi",
    price: "",
    is_vegetarian: true,
    is_spicy: false,
    is_available_today: true,
  });
  const [createLoading, setCreateLoading] = useState(false);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('vendor_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    };
  };

  const handleApiError = (error) => {
    console.error("API Error:", error);
    if (error.message.includes('401')) {
      toast.error("Please login again");
    } else {
      toast.error("An error occurred");
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/vendor/menu-items`,
        {
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setMenuItems(data.menu_items);
      }
    } catch (error) {
      handleApiError(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCreateForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCreateMenuItem = async (e) => {
    e.preventDefault();

    if (!createForm.name || !createForm.price) {
      toast.error("Please fill in all required fields");
      return;
    }

    setCreateLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/vendor/menu-items`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(createForm),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setShowCreateModal(false);
        setCreateForm({
          name: "",
          category: "sabzi",
          price: "",
          is_vegetarian: true,
          is_spicy: false,
          is_available_today: true,
        });
        fetchMenuItems(); // Refresh the list
        toast.success("Food item created successfully!");
      } else {
        toast.error(data.error || "Failed to create food item");
      }
    } catch (err) {
      console.error("Error creating menu item:", err);
      toast.error("Error creating food item");
    } finally {
      setCreateLoading(false);
    }
  };

  const categories = [
    { value: "roti_bread", label: "Roti/Bread" },
    { value: "sabzi", label: "Sabzi" },
    { value: "dal", label: "Dal" },
    { value: "rice_item", label: "Rice Items" },
    { value: "non_veg", label: "Non-Veg" },
    { value: "pickle_papad", label: "Pickle/Papad" },
    { value: "sweet", label: "Sweet" },
    { value: "drink", label: "Drink" },
    { value: "raita_salad", label: "Raita/Salad" },
  ];

  const getCategoryEmoji = (category) => {
    const emojiMap = {
      roti_bread: "🍞",
      sabzi: "🥬",
      dal: "🍲",
      rice_item: "🍚",
      non_veg: "🍖",
      pickle_papad: "🥒",
      sweet: "🍮",
      drink: "🥤",
      raita_salad: "🥗",
    };
    return emojiMap[category] || "🍽️";
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center transition-all duration-300"
        style={{ backgroundColor: theme?.background || '#ffffff' }}
      >
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-16 w-16 border-4 border-t-transparent mx-auto mb-4"
            style={{
              borderColor: `${theme?.primary || '#007bff'} transparent transparent transparent`,
            }}
          ></div>
          <div className="text-xl font-semibold" style={{ color: theme?.text || '#000000' }}>
            Loading food items...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center transition-all duration-300"
        style={{ backgroundColor: theme?.background || '#ffffff' }}
      >
        <div className="text-center">
          <p className="text-xl mb-4" style={{ color: theme?.error || '#dc3545' }}>
            {error}
          </p>
          <button
            onClick={fetchMenuItems}
            className="px-6 py-2 rounded-lg font-semibold transition-all duration-300"
            style={{
              backgroundColor: theme?.primary || '#007bff',
              color: "white",
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen transition-all duration-300"
      style={{ backgroundColor: theme?.background || '#ffffff' }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-40 border-b backdrop-blur-md"
        style={{
          backgroundColor: `${theme?.panels || '#f8f9fa'}95`,
          borderColor: theme?.border || '#dee2e6',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold" style={{ color: theme?.primary || '#007bff' }}>
              🍽️ Food Items Management
            </h1>
            <a
              href="/vendor/dashboard"
              className="transition-colors hover:opacity-80"
              style={{ color: theme?.textSecondary || '#6c757d' }}
            >
              ← Back to Dashboard
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div
          className="rounded-2xl border p-6 mb-6 backdrop-blur-sm"
          style={{
            backgroundColor: theme?.panels || '#f8f9fa',
            borderColor: theme?.border || '#dee2e6',
          }}
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2
                className="text-xl font-semibold mb-2"
                style={{ color: theme?.text || '#000000' }}
              >
                Your Food Items
              </h2>
              <p style={{ color: theme?.textSecondary || '#6c757d' }}>
                Total Items:{" "}
                <span className="font-semibold" style={{ color: theme?.text || '#000000' }}>
                  {menuItems.length}
                </span>
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: theme?.success || '#28a745',
                color: "white",
              }}
            >
              + Add New Food Item
            </button>
          </div>
        </div>

        {/* Menu Items Grid */}
        {menuItems.length === 0 ? (
          <div
            className="rounded-2xl border p-8 text-center"
            style={{
              backgroundColor: theme?.panels || '#f8f9fa',
              borderColor: theme?.border || '#dee2e6',
            }}
          >
            <div className="text-6xl mb-4">🍽️</div>
            <p className="text-lg mb-4" style={{ color: theme?.textSecondary || '#6c757d' }}>
              No food items found. Create your first food item to get started.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 rounded-lg font-semibold transition-all duration-300"
              style={{
                backgroundColor: theme?.primary || '#007bff',
                color: "white",
              }}
            >
              Create First Item
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <div
                key={item.id || item._id}
                className="rounded-2xl border p-6 hover:shadow-lg transition-all duration-300"
                style={{
                  backgroundColor: theme?.panels || '#f8f9fa',
                  borderColor: theme?.border || '#dee2e6',
                }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">
                      {getCategoryEmoji(item.category)}
                    </span>
                    <h3
                      className="text-xl font-semibold"
                      style={{ color: theme?.text || '#000000' }}
                    >
                      {item.name}
                    </h3>
                  </div>
                  <div
                    className="px-3 py-1 rounded-full text-sm font-medium"
                    style={{
                      backgroundColor: item.is_available_today
                        ? `${theme?.success || '#28a745'}20`
                        : `${theme?.error || '#dc3545'}20`,
                      color: item.is_available_today
                        ? theme?.success || '#28a745'
                        : theme?.error || '#dc3545',
                    }}
                  >
                    {item.is_available_today ? "Available" : "Not Available"}
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span style={{ color: theme?.textSecondary || '#6c757d' }}>
                      Category:
                    </span>
                    <span
                      className="font-medium capitalize"
                      style={{ color: theme?.text || '#000000' }}
                    >
                      {item.category.replace("_", " ")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: theme?.textSecondary || '#6c757d' }}>Price:</span>
                    <span
                      className="font-semibold text-lg"
                      style={{ color: theme?.success || '#28a745' }}
                    >
                      ₹{item.price}
                    </span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {item.is_vegetarian ? (
                    <span
                      className="px-2 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: `${theme?.success || '#28a745'}20`,
                        color: theme?.success || '#28a745',
                      }}
                    >
                      🌱 Veg
                    </span>
                  ) : (
                    <span
                      className="px-2 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: `${theme?.error || '#dc3545'}20`,
                        color: theme?.error || '#dc3545',
                      }}
                    >
                      🍖 Non-Veg
                    </span>
                  )}
                  {item.is_spicy && (
                    <span
                      className="px-2 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: `${theme?.warning || '#ffc107'}20`,
                        color: theme?.warning || '#ffc107',
                      }}
                    >
                      🌶️ Spicy
                    </span>
                  )}
                </div>

                <div
                  className="flex justify-between items-center pt-4 border-t"
                  style={{ borderColor: theme?.border || '#dee2e6' }}
                >
                  <p className="text-sm" style={{ color: theme?.textSecondary || '#6c757d' }}>
                    Created: {new Date(item.created_at).toLocaleDateString()}
                  </p>
                  <div className="space-x-2">
                    <button
                      className="text-sm hover:opacity-80 transition-opacity"
                      style={{ color: theme?.primary || '#007bff' }}
                    >
                      Edit
                    </button>
                    <button
                      className="text-sm hover:opacity-80 transition-opacity"
                      style={{ color: theme?.error || '#dc3545' }}
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

      {/* Create Menu Item Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div
            className="rounded-2xl border p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            style={{
              backgroundColor: theme?.panels || '#f8f9fa',
              borderColor: theme?.border || '#dee2e6',
            }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold" style={{ color: theme?.text || '#000000' }}>
                🍽️ Add New Food Item
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-2xl hover:opacity-80 transition-opacity"
                style={{ color: theme?.textSecondary || '#6c757d' }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateMenuItem} className="space-y-4">
              {/* Item Name */}
              <div>
                <label
                  className="block mb-2 font-medium"
                  style={{ color: theme?.textSecondary || '#6c757d' }}
                >
                  Food Item Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={createForm.name}
                  onChange={handleCreateFormChange}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-300"
                  style={{
                    backgroundColor: theme?.background || '#ffffff',
                    borderColor: theme?.border || '#dee2e6',
                    color: theme?.text || '#000000',
                  }}
                  placeholder="e.g., Aloo Gobi, Chicken Curry, Jeera Rice"
                  required
                />
              </div>

              {/* Category and Price */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    className="block mb-2 font-medium"
                    style={{ color: theme?.textSecondary || '#6c757d' }}
                  >
                    Category *
                  </label>
                  <select
                    name="category"
                    value={createForm.category}
                    onChange={handleCreateFormChange}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-300"
                    style={{
                      backgroundColor: theme?.background || '#ffffff',
                      borderColor: theme?.border || '#dee2e6',
                      color: theme?.text || '#000000',
                    }}
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    className="block mb-2 font-medium"
                    style={{ color: theme?.textSecondary || '#6c757d' }}
                  >
                    Price per portion (₹) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={createForm.price}
                    onChange={handleCreateFormChange}
                    min="0"
                    step="0.01"
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-300"
                    style={{
                      backgroundColor: theme?.background || '#ffffff',
                      borderColor: theme?.border || '#dee2e6',
                      color: theme?.text || '#000000',
                    }}
                    placeholder="e.g., 25, 30, 40"
                    required
                  />
                </div>
              </div>

              {/* Checkboxes */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_vegetarian"
                    checked={createForm.is_vegetarian}
                    onChange={handleCreateFormChange}
                    className="mr-2"
                    style={{ accentColor: theme?.primary || '#007bff' }}
                  />
                  <span style={{ color: theme?.textSecondary || '#6c757d' }}>
                    🌱 Vegetarian
                  </span>
                </label>

                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_spicy"
                    checked={createForm.is_spicy}
                    onChange={handleCreateFormChange}
                    className="mr-2"
                    style={{ accentColor: theme?.primary || '#007bff' }}
                  />
                  <span style={{ color: theme?.textSecondary || '#6c757d' }}>🌶️ Spicy</span>
                </label>

                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_available_today"
                    checked={createForm.is_available_today}
                    onChange={handleCreateFormChange}
                    className="mr-2"
                    style={{ accentColor: theme?.primary || '#007bff' }}
                  />
                  <span style={{ color: theme?.textSecondary || '#6c757d' }}>
                    Available Today
                  </span>
                </label>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 transition-colors hover:opacity-80"
                  style={{ color: theme?.textSecondary || '#6c757d' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className="px-6 py-2 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: theme?.success || '#28a745',
                    color: "white",
                  }}
                >
                  {createLoading ? "Creating..." : "Create Food Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuItems;