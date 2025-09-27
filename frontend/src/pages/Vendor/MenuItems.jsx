import React, { useState, useEffect } from "react";
import { FaLeaf, FaFireAlt, FaDrumstickBite, FaBreadSlice, FaUtensils, FaGlassWhiskey, FaIceCream, FaCarrot, FaSeedling, FaCheckCircle, FaTimesCircle, FaEdit, FaTrash } from "react-icons/fa";
import { useVendorAuth } from "../../context/VendorAuthContext";
import { useTheme } from "../../context/ThemeContext";
import toast from "react-hot-toast";
import { getAuthHeaders, handleApiError } from "../../utils/api";

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

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/vendor/menu-items/`,
        {
          headers: getAuthHeaders(),
        }
      );

      const data = await response.json();
      if (data.success) {
        setMenuItems(data.menu_items);
      }
    } catch (error) {
      handleApiError(error);
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
        `${import.meta.env.VITE_API_URL}/api/vendor/menu-items/`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(createForm),
        }
      );

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
    { value: "roti_bread", label: "Roti/Bread", icon: <FaBreadSlice /> },
    { value: "sabzi", label: "Sabzi", icon: <FaCarrot /> },
    { value: "dal", label: "Dal", icon: <FaUtensils /> },
    { value: "rice_item", label: "Rice Items", icon: <FaSeedling /> },
    { value: "non_veg", label: "Non-Veg", icon: <FaDrumstickBite /> },
    { value: "pickle_papad", label: "Pickle/Papad", icon: <FaLeaf /> },
    { value: "sweet", label: "Sweet", icon: <FaIceCream /> },
    { value: "drink", label: "Drink", icon: <FaGlassWhiskey /> },
    { value: "raita_salad", label: "Raita/Salad", icon: <FaSeedling /> },
  ];

  const getCategoryIcon = (category) => {
    const found = categories.find((cat) => cat.value === category);
    return found ? found.icon : <FaUtensils />;
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center transition-all duration-300"
        style={{ background: `linear-gradient(135deg, ${theme.background} 60%, ${theme.panels} 100%)` }}
      >
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-20 w-20 border-8 border-t-transparent mx-auto mb-6 shadow-lg"
            style={{
              borderColor: `${theme.primary} transparent transparent transparent`,
            }}
          ></div>
          <div className="text-2xl font-bold tracking-wide" style={{ color: theme.primary }}>
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
        style={{ background: `linear-gradient(135deg, ${theme.background} 60%, ${theme.panels} 100%)` }}
      >
        <div className="text-center rounded-2xl shadow-xl p-8" style={{ backgroundColor: theme.panels }}>
          <p className="text-2xl mb-6 font-semibold" style={{ color: theme.error }}>
            {error}
          </p>
          <button
            onClick={fetchMenuItems}
            className="px-8 py-3 rounded-xl font-bold transition-all duration-300 shadow-md hover:scale-105"
            style={{
              backgroundColor: theme.primary,
              color: theme.background,
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
      style={{ background: `linear-gradient(135deg, ${theme.background} 60%, ${theme.panels} 100%)` }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-40 border-b backdrop-blur-md shadow-xl"
        style={{
          background: theme.background,
          borderColor: theme.border,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3" style={{ color: theme.primary, letterSpacing: "0.03em" }}>
              <FaUtensils style={{ color: theme.primary, fontSize: "2rem" }} />
              Food Items Management
            </h1>
            <a
              href="/vendor/dashboard"
              className="transition-colors hover:opacity-80 text-lg font-medium"
              style={{ color: theme.textSecondary }}
            >
              ← Back to Dashboard
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
  <main className="max-w-7xl mx-auto py-10 px-4 sm:px-8 lg:px-12">
        {/* Header Section */}
        <div
          className="rounded-3xl border p-8 mb-10 backdrop-blur-sm shadow-xl"
          style={{
            background: `linear-gradient(120deg, ${theme.panels} 90%, ${theme.background} 100%)`,
            borderColor: theme.border,
          }}
        >
          <div className="flex items-center justify-between flex-wrap gap-6">
            <div>
              <h2
                className="text-2xl font-bold mb-2 tracking-wide"
                style={{ color: theme.text }}
              >
                Your Food Items
              </h2>
              <p style={{ color: theme.textSecondary, fontSize: "1.1rem" }}>
                Total Items: {" "}
                <span className="font-bold" style={{ color: theme.primary }}>
                  {menuItems.length}
                </span>
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-8 py-3 rounded-xl font-bold transition-all duration-300 shadow-md hover:scale-105"
              style={{
                backgroundColor: theme.success,
                color: theme.background,
              }}
            >
              + Add New Food Item
            </button>
          </div>
        </div>

        {/* Menu Items Grid */}
        {menuItems.length === 0 ? (
          <div
            className="rounded-3xl border p-12 text-center shadow-xl flex flex-col items-center justify-center"
            style={{
              background: theme.panels,
              borderColor: theme.border,
            }}
          >
            <FaUtensils className="mb-6" style={{ fontSize: "4rem", color: theme.primary }} />
            <p className="text-xl mb-6 font-medium" style={{ color: theme.textSecondary }}>
              No food items found. Create your first food item to get started.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-8 py-3 rounded-xl font-bold transition-all duration-300 shadow-md hover:scale-105"
              style={{
                backgroundColor: theme.primary,
                color: theme.background,
              }}
            >
              Create First Item
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {menuItems.map((item) => (
              <div
                key={item.id}
                className="rounded-3xl border p-0 overflow-hidden shadow-xl flex flex-col"
                style={{
                  background: theme.panels,
                  borderColor: theme.border,
                }}
              >
                {/* Card Top Section */}
                <div className="flex items-center gap-4 px-8 pt-8 pb-4 border-b" style={{ borderColor: theme.border }}>
                  <div className="flex items-center justify-center w-14 h-14 rounded-xl" style={{ backgroundColor: theme.background }}>
                    {getCategoryIcon(item.category)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold tracking-wide" style={{ color: theme.text }}>
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-bold capitalize text-base" style={{ color: theme.primary }}>{categories.find(c => c.value === item.category)?.label || item.category.replace("_", " ")}</span>
                      {item.is_vegetarian ? <FaLeaf style={{ color: theme.success, fontSize: "1.1rem" }} title="Vegetarian" /> : <FaDrumstickBite style={{ color: theme.error, fontSize: "1.1rem" }} title="Non-Veg" />}
                      {item.is_spicy && <FaFireAlt style={{ color: theme.warning, fontSize: "1.1rem" }} title="Spicy" />}
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-extrabold text-xl" style={{ color: theme.success }}>₹{item.price}</span>
                    <span className="mt-2 flex items-center gap-1 text-sm font-bold" style={{ color: item.is_available_today ? theme.success : theme.error }}>
                      {item.is_available_today ? <FaCheckCircle /> : <FaTimesCircle />} {item.is_available_today ? "Available" : "Not Available"}
                    </span>
                  </div>
                </div>

                {/* Card Bottom Section */}
                <div className="flex-1 flex flex-col justify-between px-8 py-6">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-base font-medium" style={{ color: theme.textSecondary }}>
                      Created: {new Date(item.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 justify-end">
                    <button
                      className="rounded-lg px-4 py-2 font-bold flex items-center gap-2 transition hover:bg-opacity-80"
                      style={{ backgroundColor: theme.primary, color: theme.background }}
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      className="rounded-lg px-4 py-2 font-bold flex items-center gap-2 transition hover:bg-opacity-80"
                      style={{ backgroundColor: theme.error, color: theme.background }}
                    >
                      <FaTrash /> Delete
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
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
          <div
            className="rounded-3xl border p-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
            style={{
              background: `linear-gradient(120deg, ${theme.panels} 90%, ${theme.background} 100%)`,
              borderColor: theme.border,
            }}
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-extrabold" style={{ color: theme.primary }}>
                🍽️ Add New Food Item
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-3xl hover:opacity-80 transition-opacity font-bold"
                style={{ color: theme.textSecondary }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateMenuItem} className="space-y-6">
              {/* Item Name */}
              <div>
                <label
                  className="block mb-2 font-bold text-lg"
                  style={{ color: theme.textSecondary }}
                >
                  Food Item Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={createForm.name}
                  onChange={handleCreateFormChange}
                  className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-300 text-lg shadow"
                  style={{
                    backgroundColor: theme.background,
                    borderColor: theme.border,
                    color: theme.text,
                  }}
                  placeholder="e.g., Aloo Gobi, Chicken Curry, Jeera Rice"
                  required
                />
              </div>

              {/* Category and Price */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    className="block mb-2 font-bold text-lg"
                    style={{ color: theme.textSecondary }}
                  >
                    Category *
                  </label>
                  <select
                    name="category"
                    value={createForm.category}
                    onChange={handleCreateFormChange}
                    className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-300 text-lg shadow"
                    style={{
                      backgroundColor: theme.background,
                      borderColor: theme.border,
                      color: theme.text,
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
                    className="block mb-2 font-bold text-lg"
                    style={{ color: theme.textSecondary }}
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
                    className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-300 text-lg shadow"
                    style={{
                      backgroundColor: theme.background,
                      borderColor: theme.border,
                      color: theme.text,
                    }}
                    placeholder="e.g., 25, 30, 40"
                    required
                  />
                </div>
              </div>

              {/* Checkboxes */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <label className="flex items-center cursor-pointer text-lg font-bold">
                  <input
                    type="checkbox"
                    name="is_vegetarian"
                    checked={createForm.is_vegetarian}
                    onChange={handleCreateFormChange}
                    className="mr-3 scale-125"
                    style={{ accentColor: theme.primary }}
                  />
                  <span style={{ color: theme.textSecondary }}>
                    🌱 Vegetarian
                  </span>
                </label>

                <label className="flex items-center cursor-pointer text-lg font-bold">
                  <input
                    type="checkbox"
                    name="is_spicy"
                    checked={createForm.is_spicy}
                    onChange={handleCreateFormChange}
                    className="mr-3 scale-125"
                    style={{ accentColor: theme.primary }}
                  />
                  <span style={{ color: theme.textSecondary }}>🌶️ Spicy</span>
                </label>

                <label className="flex items-center cursor-pointer text-lg font-bold">
                  <input
                    type="checkbox"
                    name="is_available_today"
                    checked={createForm.is_available_today}
                    onChange={handleCreateFormChange}
                    className="mr-3 scale-125"
                    style={{ accentColor: theme.primary }}
                  />
                  <span style={{ color: theme.textSecondary }}>
                    Available Today
                  </span>
                </label>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-6 pt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-2 transition-colors hover:opacity-80 font-bold text-lg"
                  style={{ color: theme.textSecondary }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className="px-8 py-3 rounded-xl font-bold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                  style={{
                    backgroundColor: theme.success,
                    color: theme.background,
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
