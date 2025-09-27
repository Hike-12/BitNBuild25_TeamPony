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
    name: '',
    description: '',
    category: 'main_course',
    price: '',
    is_vegetarian: true,
    is_vegan: false,
    is_spicy: false,
    preparation_time: 30,
    is_available: true
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
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        setMenuItems(data.menu_items);
      } else {
        setError("Failed to fetch menu items");
      }
    } catch (err) {
      setError("Error fetching menu items");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCreateForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCreateMenuItem = async (e) => {
    e.preventDefault();
    
    if (!createForm.name || !createForm.description || !createForm.price) {
      toast.error('Please fill in all required fields');
      return;
    }

    setCreateLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/vendor/menu-items/`, {
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
          description: '',
          category: 'main_course',
          price: '',
          is_vegetarian: true,
          is_vegan: false,
          is_spicy: false,
          preparation_time: 30,
          is_available: true
        });
        fetchMenuItems(); // Refresh the list
        toast.success('Menu item created successfully!');
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to create menu item');
      }
    } catch (err) {
      console.error("Error creating menu item:", err);
      toast.error('Error creating menu item');
    } finally {
      setCreateLoading(false);
    }
  };

  const categories = [
    { value: 'main_course', label: 'Main Course' },
    { value: 'side_dish', label: 'Side Dish' },
    { value: 'bread', label: 'Bread' },
    { value: 'dessert', label: 'Dessert' },
    { value: 'beverage', label: 'Beverage' },
    { value: 'snack', label: 'Snack' }
  ];

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
            Loading menu items...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center transition-all duration-300"
        style={{ backgroundColor: theme.background }}
      >
        <div className="text-center">
          <p 
            className="text-xl mb-4"
            style={{ color: theme.error }}
          >
            {error}
          </p>
          <button 
            onClick={fetchMenuItems}
            className="px-6 py-2 rounded-lg font-semibold transition-all duration-300"
            style={{ 
              backgroundColor: theme.primary,
              color: 'white'
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
              Menu Items Management
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
        {/* Header Section */}
        <div 
          className="rounded-2xl border p-6 mb-6 backdrop-blur-sm"
          style={{ 
            backgroundColor: theme.panels,
            borderColor: theme.border 
          }}
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 
                className="text-xl font-semibold mb-2"
                style={{ color: theme.text }}
              >
                Your Menu Items
              </h2>
              <p 
                style={{ color: theme.textSecondary }}
              >
                Total Items: <span className="font-semibold" style={{ color: theme.text }}>{menuItems.length}</span>
              </p>
            </div>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
              style={{ 
                backgroundColor: theme.success,
                color: 'white'
              }}
            >
              + Add New Item
            </button>
          </div>
        </div>

        {/* Menu Items Grid */}
        {menuItems.length === 0 ? (
          <div 
            className="rounded-2xl border p-8 text-center"
            style={{ 
              backgroundColor: theme.panels,
              borderColor: theme.border 
            }}
          >
            <p 
              className="text-lg mb-4"
              style={{ color: theme.textSecondary }}
            >
              No menu items found. Create your first menu item to get started.
            </p>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 rounded-lg font-semibold transition-all duration-300"
              style={{ 
                backgroundColor: theme.primary,
                color: 'white'
              }}
            >
              Create First Item
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <div
                key={item.id}
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
                    {item.name}
                  </h3>
                  <div
                    className="px-3 py-1 rounded-full text-sm font-medium"
                    style={{
                      backgroundColor: item.is_available 
                        ? `${theme.success}20` 
                        : `${theme.error}20`,
                      color: item.is_available ? theme.success : theme.error
                    }}
                  >
                    {item.is_available ? "Available" : "Unavailable"}
                  </div>
                </div>

                <p 
                  className="mb-4 text-sm"
                  style={{ color: theme.textSecondary }}
                >
                  {item.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span style={{ color: theme.textSecondary }}>Category:</span>
                    <span 
                      className="font-medium capitalize"
                      style={{ color: theme.text }}
                    >
                      {item.category.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: theme.textSecondary }}>Price:</span>
                    <span 
                      className="font-semibold"
                      style={{ color: theme.success }}
                    >
                      ₹{item.price}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: theme.textSecondary }}>Prep Time:</span>
                    <span style={{ color: theme.text }}>{item.preparation_time} mins</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {item.is_vegetarian && (
                    <span 
                      className="px-2 py-1 rounded-full text-xs font-medium"
                      style={{ 
                        backgroundColor: `${theme.success}20`,
                        color: theme.success 
                      }}
                    >
                      Vegetarian
                    </span>
                  )}
                  {item.is_vegan && (
                    <span 
                      className="px-2 py-1 rounded-full text-xs font-medium"
                      style={{ 
                        backgroundColor: `${theme.success}20`,
                        color: theme.success 
                      }}
                    >
                      Vegan
                    </span>
                  )}
                  {item.is_spicy && (
                    <span 
                      className="px-2 py-1 rounded-full text-xs font-medium"
                      style={{ 
                        backgroundColor: `${theme.warning}20`,
                        color: theme.warning 
                      }}
                    >
                      Spicy
                    </span>
                  )}
                </div>

                <div 
                  className="flex justify-between items-center pt-4 border-t"
                  style={{ borderColor: theme.border }}
                >
                  <p 
                    className="text-sm"
                    style={{ color: theme.textSecondary }}
                  >
                    Created: {new Date(item.created_at).toLocaleDateString()}
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

      {/* Create Menu Item Modal */}
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
                Add New Menu Item
              </h2>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="text-2xl hover:opacity-80 transition-opacity"
                style={{ color: theme.textSecondary }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateMenuItem} className="space-y-4">
              {/* Item Name */}
              <div>
                <label 
                  className="block mb-2 font-medium"
                  style={{ color: theme.textSecondary }}
                >
                  Item Name *
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
                  placeholder="e.g., Butter Chicken, Biryani"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label 
                  className="block mb-2 font-medium"
                  style={{ color: theme.textSecondary }}
                >
                  Description *
                </label>
                <textarea
                  name="description"
                  value={createForm.description}
                  onChange={handleCreateFormChange}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-300"
                  style={{
                    backgroundColor: theme.background,
                    borderColor: theme.border,
                    color: theme.text,
                    focusRingColor: theme.primary
                  }}
                  rows="3"
                  placeholder="Describe your dish..."
                  required
                />
              </div>

              {/* Category and Price */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label 
                    className="block mb-2 font-medium"
                    style={{ color: theme.textSecondary }}
                  >
                    Category *
                  </label>
                  <select
                    name="category"
                    value={createForm.category}
                    onChange={handleCreateFormChange}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-300"
                    style={{
                      backgroundColor: theme.background,
                      borderColor: theme.border,
                      color: theme.text,
                      focusRingColor: theme.primary
                    }}
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label 
                    className="block mb-2 font-medium"
                    style={{ color: theme.textSecondary }}
                  >
                    Price (₹) *
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
                      backgroundColor: theme.background,
                      borderColor: theme.border,
                      color: theme.text,
                      focusRingColor: theme.primary
                    }}
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              {/* Preparation Time */}
              <div>
                <label 
                  className="block mb-2 font-medium"
                  style={{ color: theme.textSecondary }}
                >
                  Preparation Time (minutes)
                </label>
                <input
                  type="number"
                  name="preparation_time"
                  value={createForm.preparation_time}
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

              {/* Checkboxes */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_vegetarian"
                    checked={createForm.is_vegetarian}
                    onChange={handleCreateFormChange}
                    className="mr-2"
                    style={{ accentColor: theme.primary }}
                  />
                  <span style={{ color: theme.textSecondary }}>Vegetarian</span>
                </label>

                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_vegan"
                    checked={createForm.is_vegan}
                    onChange={handleCreateFormChange}
                    className="mr-2"
                    style={{ accentColor: theme.primary }}
                  />
                  <span style={{ color: theme.textSecondary }}>Vegan</span>
                </label>

                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_spicy"
                    checked={createForm.is_spicy}
                    onChange={handleCreateFormChange}
                    className="mr-2"
                    style={{ accentColor: theme.primary }}
                  />
                  <span style={{ color: theme.textSecondary }}>Spicy</span>
                </label>

                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_available"
                    checked={createForm.is_available}
                    onChange={handleCreateFormChange}
                    className="mr-2"
                    style={{ accentColor: theme.primary }}
                  />
                  <span style={{ color: theme.textSecondary }}>Available</span>
                </label>
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
                  disabled={createLoading}
                  className="px-6 py-2 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ 
                    backgroundColor: theme.success,
                    color: 'white'
                  }}
                >
                  {createLoading ? 'Creating...' : 'Create Item'}
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