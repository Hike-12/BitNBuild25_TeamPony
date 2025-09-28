import React, { useState, useEffect } from "react";
import { useVendorAuth } from "../../context/VendorAuthContext";
import { useTheme } from "../../context/ThemeContext";
import toast from "react-hot-toast";
import { FaUtensils, FaLeaf, FaFire, FaPepperHot, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { MdRestaurant } from "react-icons/md";
import { FiTrendingUp } from "react-icons/fi";

const MenuItems = () => {
  const { vendor } = useVendorAuth();
  const { theme } = useTheme();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
        { headers: getAuthHeaders() }
      );

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      if (data.success) setMenuItems(data.menu_items);
    } catch (error) {
      handleApiError(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCreateForm(prev => ({
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

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

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
        fetchMenuItems();
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

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" 
            style={{ borderColor: theme.primary }}></div>
          <div className="text-lg" style={{ color: theme.text }}>Loading menu items...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center p-8 rounded-2xl" style={{ backgroundColor: theme.panels }}>
          <p className="text-lg mb-4" style={{ color: theme.error }}>{error}</p>
          <button onClick={fetchMenuItems} className="px-6 py-2.5 rounded-lg font-medium transition-all duration-200 hover:transform hover:scale-105"
            style={{ backgroundColor: theme.primary, color: '#fff' }}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="rounded-2xl border p-6" 
        style={{ backgroundColor: theme.panels, borderColor: theme.border }}>
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-3" style={{ color: theme.text }}>
              <FaUtensils style={{ color: theme.primary }} /> Your Menu Items
            </h2>
            <p className="text-lg mt-1" style={{ color: theme.textSecondary }}>
              Total Items: <span className="font-bold" style={{ color: theme.text }}>{menuItems.length}</span>
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:transform hover:scale-105 hover:shadow-lg"
            style={{ backgroundColor: theme.primary, color: '#fff' }}
          >
            <FaPlus size={16} /> Add New Item
          </button>
        </div>
      </div>

      {/* Menu Items Grid */}
      {menuItems.length === 0 ? (
        <div className="rounded-2xl border p-12 text-center" 
          style={{ backgroundColor: theme.panels, borderColor: theme.border }}>
          <MdRestaurant className="text-6xl mx-auto mb-4 opacity-30" style={{ color: theme.primary }} />
          <p className="text-lg mb-6" style={{ color: theme.textSecondary }}>
            No food items found. Create your first food item to get started.
          </p>
          <button onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:transform hover:scale-105"
            style={{ backgroundColor: theme.primary, color: '#fff' }}>
            Create First Item
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <div key={item.id || item._id} className="rounded-2xl border p-6 transition-all duration-200 hover:transform hover:scale-105 hover:shadow-lg"
              style={{ 
                backgroundColor: theme.panels, 
                borderColor: theme.border,
                borderLeft: `5px solid ${item.is_available_today ? theme.success : theme.error}` 
              }}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold" style={{ color: theme.text }}>{item.name}</h3>
                  <p className="text-sm capitalize" style={{ color: theme.textSecondary }}>
                    {item.category.replace("_", " ")}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold"
                  style={{
                    backgroundColor: item.is_available_today ? `${theme.success}15` : `${theme.error}15`,
                    color: item.is_available_today ? theme.success : theme.error
                  }}>
                  {item.is_available_today ? "Available" : "Unavailable"}
                </span>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <span className="text-3xl font-bold" style={{ color: theme.primary }}>
                  ₹{item.price}
                </span>
                <FiTrendingUp size={16} style={{ color: theme.success }} />
              </div>

              <div className="flex gap-2 mb-4">
                {item.is_vegetarian ? (
                  <span className="px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1"
                    style={{ backgroundColor: `${theme.success}15`, color: theme.success }}>
                    <FaLeaf /> Veg
                  </span>
                ) : (
                  <span className="px-3 py-1.5 rounded-full text-xs font-medium"
                    style={{ backgroundColor: `${theme.error}15`, color: theme.error }}>
                    Non-Veg
                  </span>
                )}
                {item.is_spicy && (
                  <span className="px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1"
                    style={{ backgroundColor: `${theme.warning}15`, color: theme.warning }}>
                    <FaPepperHot /> Spicy
                  </span>
                )}
              </div>

              <div className="flex justify-between items-center pt-4"
                style={{ borderTop: `1px solid ${theme.border}` }}>
                <p className="text-xs" style={{ color: theme.textSecondary }}>
                  Added: {new Date(item.created_at).toLocaleDateString()}
                </p>
                <div className="flex gap-2">
                  <button className="p-2 rounded-lg hover:opacity-70 transition-all duration-200 hover:transform hover:scale-110"
                    style={{ backgroundColor: `${theme.primary}15` }}>
                    <FaEdit size={16} style={{ color: theme.primary }} />
                  </button>
                  <button className="p-2 rounded-lg hover:opacity-70 transition-all duration-200 hover:transform hover:scale-110"
                    style={{ backgroundColor: `${theme.error}15` }}>
                    <FaTrash size={16} style={{ color: theme.error }} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            style={{ backgroundColor: theme.panels, border: `1px solid ${theme.border}` }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold" style={{ color: theme.text }}>
                Add New Food Item
              </h2>
              <button onClick={() => setShowCreateModal(false)}
                className="text-3xl hover:opacity-70 transition-opacity" style={{ color: theme.textSecondary }}>
                ×
              </button>
            </div>

            <form onSubmit={handleCreateMenuItem} className="space-y-6">
              <div>
                <label className="block mb-2 font-medium" style={{ color: theme.textSecondary }}>
                  Food Item Name *
                </label>
                <input type="text" name="name" value={createForm.name}
                  onChange={handleCreateFormChange}
                  className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:border-2 transition-all"
                  style={{ 
                    backgroundColor: theme.background, 
                    borderColor: theme.border, 
                    color: theme.text,
                    focusBorderColor: theme.primary 
                  }}
                  placeholder="e.g., Aloo Gobi" required />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 font-medium" style={{ color: theme.textSecondary }}>
                    Category *
                  </label>
                  <select name="category" value={createForm.category}
                    onChange={handleCreateFormChange}
                    className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:border-2 transition-all"
                    style={{ 
                      backgroundColor: theme.background, 
                      borderColor: theme.border, 
                      color: theme.text,
                      focusBorderColor: theme.primary 
                    }}>
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-2 font-medium" style={{ color: theme.textSecondary }}>
                    Price (₹) *
                  </label>
                  <input type="number" name="price" value={createForm.price}
                    onChange={handleCreateFormChange} min="0" step="0.01"
                    className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:border-2 transition-all"
                    style={{ 
                      backgroundColor: theme.background, 
                      borderColor: theme.border, 
                      color: theme.text,
                      focusBorderColor: theme.primary 
                    }}
                    placeholder="30" required />
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-center cursor-pointer p-3 rounded-xl transition-all hover:bg-opacity-50"
                  style={{ backgroundColor: theme.background }}>
                  <input type="checkbox" name="is_vegetarian" checked={createForm.is_vegetarian}
                    onChange={handleCreateFormChange} className="mr-3 w-4 h-4" />
                  <span style={{ color: theme.text }}>Vegetarian</span>
                </label>

                <label className="flex items-center cursor-pointer p-3 rounded-xl transition-all hover:bg-opacity-50"
                  style={{ backgroundColor: theme.background }}>
                  <input type="checkbox" name="is_spicy" checked={createForm.is_spicy}
                    onChange={handleCreateFormChange} className="mr-3 w-4 h-4" />
                  <span style={{ color: theme.text }}>Spicy</span>
                </label>

                <label className="flex items-center cursor-pointer p-3 rounded-xl transition-all hover:bg-opacity-50"
                  style={{ backgroundColor: theme.background }}>
                  <input type="checkbox" name="is_available_today" checked={createForm.is_available_today}
                    onChange={handleCreateFormChange} className="mr-3 w-4 h-4" />
                  <span style={{ color: theme.text }}>Available Today</span>
                </label>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={() => setShowCreateModal(false)}
                  className="px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:opacity-70"
                  style={{ color: theme.textSecondary }}>
                  Cancel
                </button>
                <button type="submit" disabled={createLoading}
                  className="px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:transform hover:scale-105 disabled:opacity-50"
                  style={{ backgroundColor: theme.primary, color: '#fff' }}>
                  {createLoading ? "Creating..." : "Create Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Premium Footer */}
    </div><Footer variant="simple" /></>
  );
};

export default MenuItems;