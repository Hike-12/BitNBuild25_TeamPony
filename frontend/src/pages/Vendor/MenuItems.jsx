import React, { useState, useEffect } from "react";
import { useVendorAuth } from "../../context/VendorAuthContext";
import toast from "react-hot-toast";
import { FaUtensils, FaLeaf, FaFire, FaPepperHot, FaEdit, FaTrash } from "react-icons/fa";
import { MdRestaurant } from "react-icons/md";
import Footer from "../../components/Footer";

const MenuItems = () => {
  const { vendor } = useVendorAuth();
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
        <div className="text-center p-8 rounded-sm" style={{ background: theme.panels }}>
          <p className="text-lg mb-4" style={{ color: theme.error }}>{error}</p>
          <button onClick={fetchMenuItems} className="px-6 py-2 rounded-sm font-medium"
            style={{ background: theme.primary, color: '#fff' }}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <><div>
      {/* Header Section */}
      <div className="rounded-sm shadow-md p-6 mb-6"
        style={{ background: theme.panels, border: `1px solid ${theme.border}` }}>
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: theme.text }}>
              <FaUtensils style={{ color: theme.primary }} /> Your Menu Items
            </h2>
            <p className="mt-1" style={{ color: theme.textSecondary }}>
              Total Items: <span className="font-bold" style={{ color: theme.text }}>{menuItems.length}</span>
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-2.5 rounded-sm font-semibold transition-all hover:scale-105"
            style={{ background: theme.primary, color: '#fff' }}
          >
            + Add New Item
          </button>
        </div>
      </div>

      {/* Menu Items Grid */}
      {menuItems.length === 0 ? (
        <div className="rounded-sm shadow-md p-12 text-center"
          style={{ background: theme.panels, border: `1px solid ${theme.border}` }}>
          <MdRestaurant className="text-6xl mx-auto mb-4 opacity-30" style={{ color: theme.primary }} />
          <p className="text-lg mb-4" style={{ color: theme.textSecondary }}>
            No food items found. Create your first food item to get started.
          </p>
          <button onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 rounded-sm font-semibold"
            style={{ background: theme.primary, color: '#fff' }}>
            Create First Item
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <div key={item.id || item._id} className="rounded-sm shadow-md p-6 hover:scale-[1.02] transition-all"
              style={{
                background: theme.panels, border: `1px solid ${theme.border}`,
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
                    background: item.is_available_today ? `${theme.success}15` : `${theme.error}15`,
                    color: item.is_available_today ? theme.success : theme.error
                  }}>
                  {item.is_available_today ? "Available" : "Unavailable"}
                </span>
              </div>

              <div className="text-2xl font-bold mb-4" style={{ color: theme.primary }}>
                ₹{item.price}
              </div>

              <div className="flex gap-2 mb-4">
                {item.is_vegetarian ? (
                  <span className="px-2 py-1 rounded text-xs font-medium flex items-center gap-1"
                    style={{ background: `${theme.success}20`, color: theme.success }}>
                    <FaLeaf /> Veg
                  </span>
                ) : (
                  <span className="px-2 py-1 rounded text-xs font-medium"
                    style={{ background: `${theme.error}20`, color: theme.error }}>
                    Non-Veg
                  </span>
                )}
                {item.is_spicy && (
                  <span className="px-2 py-1 rounded text-xs font-medium flex items-center gap-1"
                    style={{ background: `${theme.warning}20`, color: theme.warning }}>
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
                  <button className="p-1.5 hover:opacity-70 transition-opacity">
                    <FaEdit style={{ color: theme.primary }} />
                  </button>
                  <button className="p-1.5 hover:opacity-70 transition-opacity">
                    <FaTrash style={{ color: theme.error }} />
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
          <div className="rounded-sm p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            style={{ background: theme.panels, border: `1px solid ${theme.border}` }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold" style={{ color: theme.text }}>
                Add New Food Item
              </h2>
              <button onClick={() => setShowCreateModal(false)}
                className="text-3xl hover:opacity-70" style={{ color: theme.textSecondary }}>
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
                  className="w-full border rounded-sm px-4 py-2.5 focus:outline-none"
                  style={{ background: theme.background, borderColor: theme.border, color: theme.text }}
                  placeholder="e.g., Aloo Gobi" required />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 font-medium" style={{ color: theme.textSecondary }}>
                    Category *
                  </label>
                  <select name="category" value={createForm.category}
                    onChange={handleCreateFormChange}
                    className="w-full border rounded-sm px-4 py-2.5 focus:outline-none"
                    style={{ background: theme.background, borderColor: theme.border, color: theme.text }}>
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
                    className="w-full border rounded-sm px-4 py-2.5 focus:outline-none"
                    style={{ background: theme.background, borderColor: theme.border, color: theme.text }}
                    placeholder="30" required />
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" name="is_vegetarian" checked={createForm.is_vegetarian}
                    onChange={handleCreateFormChange} className="mr-3" />
                  <span style={{ color: theme.text }}>Vegetarian</span>
                </label>

                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" name="is_spicy" checked={createForm.is_spicy}
                    onChange={handleCreateFormChange} className="mr-3" />
                  <span style={{ color: theme.text }}>Spicy</span>
                </label>

                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" name="is_available_today" checked={createForm.is_available_today}
                    onChange={handleCreateFormChange} className="mr-3" />
                  <span style={{ color: theme.text }}>Available Today</span>
                </label>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={() => setShowCreateModal(false)}
                  className="px-6 py-2.5 rounded-sm font-medium transition-opacity hover:opacity-70"
                  style={{ color: theme.textSecondary }}>
                  Cancel
                </button>
                <button type="submit" disabled={createLoading}
                  className="px-6 py-2.5 rounded-sm font-semibold disabled:opacity-50"
                  style={{ background: theme.primary, color: '#fff' }}>
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