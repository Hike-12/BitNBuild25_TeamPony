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
    main_items: [],
    side_items: [],
    extras: [],
    full_dabba_price: '',
    max_dabbas: 30,
    todays_special: '',
    cooking_style: ''
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
        setMenus(data.menus || []);
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

  const handleCreateFormChange = (e) => {
    const { name, value } = e.target;
    setCreateForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleItemToggle = (itemId, category) => {
    setCreateForm(prev => ({
      ...prev,
      [category]: prev[category].includes(itemId)
        ? prev[category].filter(id => id !== itemId)
        : [...prev[category], itemId]
    }));
  };

  const handleCreateMenu = async (e) => {
    e.preventDefault();
    
    if (!createForm.name || !createForm.date || !createForm.full_dabba_price) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (createForm.main_items.length === 0) {
      toast.error('Please select at least one main item for the dabba');
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
          main_items: [],
          side_items: [],
          extras: [],
          full_dabba_price: '',
          max_dabbas: 30,
          todays_special: '',
          cooking_style: ''
        });
        fetchMenus();
        toast.success('Dabba menu created successfully! 🍱');
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

  const getCategoryEmoji = (category) => {
    const emojiMap = {
      'roti_bread': '🍞',
      'sabzi': '🥬',
      'dal': '🍲',
      'rice_item': '🍚',
      'non_veg': '🍗',
      'pickle_papad': '🥒',
      'sweet': '🍮',
      'drink': '🥤',
      'raita_salad': '🥗'
    };
    return emojiMap[category] || '🍽️';
  };

  const getItemsByCategory = (category) => {
    const categoryMap = {
      'main_items': ['roti_bread', 'sabzi', 'dal', 'rice_item', 'non_veg'],
      'side_items': ['pickle_papad', 'raita_salad'],
      'extras': ['sweet', 'drink']
    };
    
    return menuItems.filter(item => 
      categoryMap[category].includes(item.category)
    );
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
            Loading daily dabbas...
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
              className="text-2xl font-bold flex items-center"
              style={{ color: theme.primary }}
            >
              🍱 Daily Dabba Management
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
                📅 Filter by date:
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
              className="px-6 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105 flex items-center space-x-2"
              style={{ 
                backgroundColor: theme.success,
                color: 'white'
              }}
            >
              <span>🍱</span>
              <span>Create Today's Dabba</span>
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
            Total Dabba Menus: <span className="font-semibold" style={{ color: theme.text }}>{menus.length}</span>
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
            <div className="text-6xl mb-4">🍱</div>
            <p style={{ color: theme.textSecondary }}>No dabba menus found. Create your first daily dabba!</p>
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
                {/* Menu Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 
                      className="text-xl font-semibold flex items-center space-x-2"
                      style={{ color: theme.text }}
                    >
                      <span>🍱</span>
                      <span>{menu.name}</span>
                    </h3>
                    <p style={{ color: theme.textSecondary }}>
                      {new Date(menu.date).toLocaleDateString('en-IN', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <div
                      className="px-3 py-1 rounded-full text-sm font-medium mb-2"
                      style={{
                        backgroundColor: menu.is_active 
                          ? `${theme.success}20` 
                          : `${theme.error}20`,
                        color: menu.is_active ? theme.success : theme.error
                      }}
                    >
                      {menu.is_active ? "🟢 Active" : "🔴 Inactive"}
                    </div>
                    <div
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: menu.is_veg_only 
                          ? `${theme.success}15` 
                          : `${theme.warning}15`,
                        color: menu.is_veg_only ? theme.success : theme.warning
                      }}
                    >
                      {menu.is_veg_only ? "🌱 Pure Veg" : "🍗 Contains Non-Veg"}
                    </div>
                  </div>
                </div>

                {/* Menu Image */}
                {menu.image && (
                  <div className="mb-4">
                    <img 
                      src={menu.image} 
                      alt={menu.name}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  </div>
                )}

                {/* Dabba Details */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div 
                    className="p-3 rounded-lg text-center"
                    style={{ backgroundColor: theme.background }}
                  >
                    <p 
                      className="text-2xl font-bold"
                      style={{ color: theme.success }}
                    >
                      ₹{menu.full_dabba_price}
                    </p>
                    <p 
                      className="text-sm"
                      style={{ color: theme.textSecondary }}
                    >
                      Per Dabba
                    </p>
                  </div>
                  <div 
                    className="p-3 rounded-lg text-center"
                    style={{ backgroundColor: theme.background }}
                  >
                    <p 
                      className="text-2xl font-bold"
                      style={{ color: theme.text }}
                    >
                      {menu.dabbas_remaining}
                    </p>
                    <p 
                      className="text-sm"
                      style={{ color: theme.textSecondary }}
                    >
                      Dabbas Left
                    </p>
                  </div>
                </div>

                {/* Today's Special */}
                {menu.todays_special && (
                  <div 
                    className="mb-4 p-3 rounded-lg border-l-4"
                    style={{ 
                      backgroundColor: `${theme.warning}10`,
                      borderLeftColor: theme.warning 
                    }}
                  >
                    <p 
                      className="text-sm font-medium"
                      style={{ color: theme.text }}
                    >
                      ⭐ Today's Special: {menu.todays_special}
                    </p>
                  </div>
                )}

                {/* Cooking Style */}
                {menu.cooking_style && (
                  <div className="mb-4">
                    <span 
                      className="px-3 py-1 rounded-full text-sm"
                      style={{ 
                        backgroundColor: `${theme.primary}15`,
                        color: theme.primary 
                      }}
                    >
                      👨‍🍳 {menu.cooking_style}
                    </span>
                  </div>
                )}

                {/* Dabba Contents */}
                <div 
                  className="border-t pt-4"
                  style={{ borderColor: theme.border }}
                >
                  <h4 
                    className="font-medium mb-3"
                    style={{ color: theme.text }}
                  >
                    🍽️ What's in today's dabba:
                  </h4>

                  {/* Main Items */}
                  {menu.main_items.length > 0 && (
                    <div className="mb-3">
                      <p 
                        className="text-sm font-medium mb-2"
                        style={{ color: theme.textSecondary }}
                      >
                        Main Items:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {menu.main_items.map((item) => (
                          <span 
                            key={item.id}
                            className="px-2 py-1 rounded-full text-sm flex items-center space-x-1"
                            style={{ 
                              backgroundColor: theme.background,
                              border: `1px solid ${theme.border}`
                            }}
                          >
                            <span>{getCategoryEmoji(item.category)}</span>
                            <span style={{ color: theme.text }}>{item.name}</span>
                            {!item.is_vegetarian && <span>🔥</span>}
                            {item.is_spicy && <span>🌶️</span>}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Side Items */}
                  {menu.side_items.length > 0 && (
                    <div className="mb-3">
                      <p 
                        className="text-sm font-medium mb-2"
                        style={{ color: theme.textSecondary }}
                      >
                        Side Items:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {menu.side_items.map((item) => (
                          <span 
                            key={item.id}
                            className="px-2 py-1 rounded-full text-sm flex items-center space-x-1"
                            style={{ 
                              backgroundColor: `${theme.success}15`,
                              color: theme.success
                            }}
                          >
                            <span>{getCategoryEmoji(item.category)}</span>
                            <span>{item.name}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Extras */}
                  {menu.extras.length > 0 && (
                    <div className="mb-3">
                      <p 
                        className="text-sm font-medium mb-2"
                        style={{ color: theme.textSecondary }}
                      >
                        Extras:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {menu.extras.map((item) => (
                          <span 
                            key={item.id}
                            className="px-2 py-1 rounded-full text-sm flex items-center space-x-1"
                            style={{ 
                              backgroundColor: `${theme.warning}15`,
                              color: theme.warning
                            }}
                          >
                            <span>{getCategoryEmoji(item.category)}</span>
                            <span>{item.name}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Footer */}
                <div 
                  className="flex justify-between items-center mt-4 pt-4 border-t"
                  style={{ borderColor: theme.border }}
                >
                  <p 
                    className="text-sm"
                    style={{ color: theme.textSecondary }}
                  >
                    Sold: {menu.dabbas_sold} / {menu.max_dabbas}
                  </p>
                  <div className="space-x-2">
                    <button 
                      className="text-sm hover:opacity-80 transition-opacity"
                      style={{ color: theme.primary }}
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      className="text-sm hover:opacity-80 transition-opacity"
                      style={{ color: theme.error }}
                    >
                      🗑️ Delete
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
            className="rounded-2xl border p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            style={{ 
              backgroundColor: theme.panels,
              borderColor: theme.border 
            }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 
                className="text-2xl font-bold flex items-center space-x-2"
                style={{ color: theme.text }}
              >
                <span>🍱</span>
                <span>Create Today's Dabba Menu</span>
              </h2>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="text-2xl hover:opacity-80 transition-opacity"
                style={{ color: theme.textSecondary }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateMenu} className="space-y-6">
              {/* Basic Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                    style={{
                      backgroundColor: theme.background,
                      borderColor: theme.border,
                      color: theme.text
                    }}
                    placeholder="e.g., Monday Special, Gujarati Thali"
                    required
                  />
                </div>

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
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                    style={{
                      backgroundColor: theme.background,
                      borderColor: theme.border,
                      color: theme.text
                    }}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label 
                    className="block mb-2 font-medium"
                    style={{ color: theme.textSecondary }}
                  >
                    Full Dabba Price (₹) *
                  </label>
                  <input
                    type="number"
                    name="full_dabba_price"
                    value={createForm.full_dabba_price}
                    onChange={handleCreateFormChange}
                    min="1"
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                    style={{
                      backgroundColor: theme.background,
                      borderColor: theme.border,
                      color: theme.text
                    }}
                    placeholder="e.g., 80, 120, 150"
                    required
                  />
                </div>

                <div>
                  <label 
                    className="block mb-2 font-medium"
                    style={{ color: theme.textSecondary }}
                  >
                    Max Dabbas
                  </label>
                  <input
                    type="number"
                    name="max_dabbas"
                    value={createForm.max_dabbas}
                    onChange={handleCreateFormChange}
                    min="1"
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                    style={{
                      backgroundColor: theme.background,
                      borderColor: theme.border,
                      color: theme.text
                    }}
                    placeholder="e.g., 30, 50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label 
                    className="block mb-2 font-medium"
                    style={{ color: theme.textSecondary }}
                  >
                    Today's Special
                  </label>
                  <input
                    type="text"
                    name="todays_special"
                    value={createForm.todays_special}
                    onChange={handleCreateFormChange}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                    style={{
                      backgroundColor: theme.background,
                      borderColor: theme.border,
                      color: theme.text
                    }}
                    placeholder="e.g., Fresh Palak Paneer, Hot Phulkas"
                  />
                </div>

                <div>
                  <label 
                    className="block mb-2 font-medium"
                    style={{ color: theme.textSecondary }}
                  >
                    Cooking Style
                  </label>
                  <input
                    type="text"
                    name="cooking_style"
                    value={createForm.cooking_style}
                    onChange={handleCreateFormChange}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                    style={{
                      backgroundColor: theme.background,
                      borderColor: theme.border,
                      color: theme.text
                    }}
                    placeholder="e.g., Punjabi Style, Gujarati Thali"
                  />
                </div>
              </div>

              {/* Main Items */}
              <div>
                <label 
                  className="block mb-3 font-medium"
                  style={{ color: theme.textSecondary }}
                >
                  🍽️ Main Items * ({createForm.main_items.length} selected)
                </label>
                <div 
                  className="max-h-48 overflow-y-auto border rounded-lg p-3"
                  style={{ borderColor: theme.border, backgroundColor: theme.background }}
                >
                  {getItemsByCategory('main_items').length === 0 ? (
                    <p 
                      className="text-center text-sm"
                      style={{ color: theme.textSecondary }}
                    >
                      No main items available. Create some first!
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {getItemsByCategory('main_items').map((item) => (
                        <label key={item.id} className="flex items-center cursor-pointer p-2 rounded hover:opacity-80" style={{ backgroundColor: theme.panels }}>
                          <input
                            type="checkbox"
                            checked={createForm.main_items.includes(item.id)}
                            onChange={() => handleItemToggle(item.id, 'main_items')}
                            className="mr-3"
                            style={{ accentColor: theme.primary }}
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <span>{getCategoryEmoji(item.category)}</span>
                                <span 
                                  className="font-medium"
                                  style={{ color: theme.text }}
                                >
                                  {item.name}
                                </span>
                                {!item.is_vegetarian && <span>🔥</span>}
                                {item.is_spicy && <span>🌶️</span>}
                              </div>
                              <span 
                                className="text-sm font-medium"
                                style={{ color: theme.success }}
                              >
                                ₹{item.price}
                              </span>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Side Items */}
              <div>
                <label 
                  className="block mb-3 font-medium"
                  style={{ color: theme.textSecondary }}
                >
                  🥗 Side Items ({createForm.side_items.length} selected)
                </label>
                <div 
                  className="max-h-32 overflow-y-auto border rounded-lg p-3"
                  style={{ borderColor: theme.border, backgroundColor: theme.background }}
                >
                  {getItemsByCategory('side_items').length === 0 ? (
                    <p 
                      className="text-center text-sm"
                      style={{ color: theme.textSecondary }}
                    >
                      No side items available.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {getItemsByCategory('side_items').map((item) => (
                        <label key={item.id} className="flex items-center cursor-pointer p-2 rounded hover:opacity-80" style={{ backgroundColor: theme.panels }}>
                          <input
                            type="checkbox"
                            checked={createForm.side_items.includes(item.id)}
                            onChange={() => handleItemToggle(item.id, 'side_items')}
                            className="mr-3"
                            style={{ accentColor: theme.success }}
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <span>{getCategoryEmoji(item.category)}</span>
                                <span 
                                  className="font-medium"
                                  style={{ color: theme.text }}
                                >
                                  {item.name}
                                </span>
                                {item.is_spicy && <span>🌶️</span>}
                              </div>
                              <span 
                                className="text-sm font-medium"
                                style={{ color: theme.success }}
                              >
                                ₹{item.price}
                              </span>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Extras */}
              <div>
                <label 
                  className="block mb-3 font-medium"
                  style={{ color: theme.textSecondary }}
                >
                  🍮 Extras ({createForm.extras.length} selected)
                </label>
                <div 
                  className="max-h-32 overflow-y-auto border rounded-lg p-3"
                  style={{ borderColor: theme.border, backgroundColor: theme.background }}
                >
                  {getItemsByCategory('extras').length === 0 ? (
                    <p 
                      className="text-center text-sm"
                      style={{ color: theme.textSecondary }}
                    >
                      No extras available.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {getItemsByCategory('extras').map((item) => (
                        <label key={item.id} className="flex items-center cursor-pointer p-2 rounded hover:opacity-80" style={{ backgroundColor: theme.panels }}>
                          <input
                            type="checkbox"
                            checked={createForm.extras.includes(item.id)}
                            onChange={() => handleItemToggle(item.id, 'extras')}
                            className="mr-3"
                            style={{ accentColor: theme.warning }}
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <span>{getCategoryEmoji(item.category)}</span>
                                <span 
                                  className="font-medium"
                                  style={{ color: theme.text }}
                                >
                                  {item.name}
                                </span>
                              </div>
                              <span 
                                className="text-sm font-medium"
                                style={{ color: theme.success }}
                              >
                                ₹{item.price}
                              </span>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-4 pt-4 border-t" style={{ borderColor: theme.border }}>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-2 transition-colors hover:opacity-80"
                  style={{ color: theme.textSecondary }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className="px-8 py-2 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  style={{ 
                    backgroundColor: theme.success,
                    color: 'white'
                  }}
                >
                  {createLoading ? (
                    <>
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <span>🍱</span>
                      <span>Create Dabba Menu</span>
                    </>
                  )}
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