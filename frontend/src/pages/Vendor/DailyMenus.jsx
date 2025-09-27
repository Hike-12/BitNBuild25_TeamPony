import React, { useState, useEffect } from "react";
import { useVendorAuth } from "../../context/VendorAuthContext";

const DailyMenus = () => {
  const { vendor } = useVendorAuth();
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    fetchMenus();
  }, [selectedDate]);

  const fetchMenus = async () => {
    try {
      let url = `${import.meta.env.VITE_API_URL}/api/vendor/daily-menus/`;
      if (selectedDate) {
        url += `?date=${selectedDate}`;
      }
      
      console.log("Fetching from:", url); // Debug log
      
      const response = await fetch(url, {
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      console.log("Response status:", response.status); // Debug log
      
      if (response.ok) {
        const data = await response.json();
        console.log("Response data:", data); // Debug log
        // Handle different response structures
        setMenus(data.menus || data.results || data || []);
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
        fetchMenus(); // Refresh the list
      } else {
        alert('Failed to update menu status');
      }
    } catch (err) {
      console.error("Error updating menu:", err);
      alert('Error updating menu status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D1117] flex items-center justify-center">
        <div className="text-[#F0F6FC] text-xl">Loading daily menus...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D1117]">
      {/* Header */}
      <header className="bg-[#161B22] border-b border-[#21262D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-[#F97316]">
              Daily Menus Management
            </h1>
            <a
              href="/vendor/dashboard"
              className="text-[#8B949E] hover:text-[#F0F6FC] transition-colors"
            >
              ← Back to Dashboard
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Filter Section */}
        <div className="bg-[#161B22] border border-[#21262D] rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <label className="text-[#8B949E]">Filter by date:</label>
              <input 
                type="date" 
                value={selectedDate} 
                onChange={handleDateChange}
                className="bg-[#0D1117] text-[#F0F6FC] border border-[#21262D] rounded px-3 py-1 focus:outline-none focus:border-[#F97316]"
              />
              {selectedDate && (
                <button 
                  onClick={() => {
                    setSelectedDate("");
                    setLoading(true);
                  }} 
                  className="text-[#8B949E] hover:text-[#F0F6FC] transition-colors"
                >
                  Clear Filter
                </button>
              )}
            </div>
            <button className="bg-[#10B981] text-white px-4 py-2 rounded-md hover:bg-[#059669] transition-colors">
              + Create New Menu
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-[#161B22] border border-[#EF4444] rounded-lg p-4 mb-6">
            <p className="text-[#EF4444]">{error}</p>
          </div>
        )}

        {/* Menus Count */}
        <div className="mb-4">
          <p className="text-[#8B949E]">Total Menus: <span className="text-[#F0F6FC] font-semibold">{menus.length}</span></p>
        </div>

        {/* Menus Grid */}
        {menus.length === 0 ? (
          <div className="bg-[#161B22] border border-[#21262D] rounded-lg p-8 text-center">
            <p className="text-[#8B949E]">No menus found for the selected criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {menus.map((menu) => (
              <div key={menu.id} className="bg-[#161B22] border border-[#21262D] rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-[#F0F6FC]">{menu.name}</h3>
                  <button
                    onClick={() => toggleMenuStatus(menu.id, menu.is_active)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      menu.is_active 
                        ? 'bg-[#10B981] bg-opacity-20 text-[#10B981] hover:bg-opacity-30' 
                        : 'bg-[#EF4444] bg-opacity-20 text-[#EF4444] hover:bg-opacity-30'
                    }`}
                  >
                    {menu.is_active ? "Active" : "Inactive"}
                  </button>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-[#8B949E]">Date:</span>
                    <span className="text-[#F0F6FC]">{new Date(menu.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8B949E]">Total Price:</span>
                    <span className="text-[#F0F6FC] font-semibold">₹{menu.total_price || "Not set"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8B949E]">Available:</span>
                    <span className={menu.is_available ? "text-[#10B981]" : "text-[#EF4444]"}>
                      {menu.is_available ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8B949E]">Orders:</span>
                    <span className="text-[#F0F6FC]">
                      {menu.orders_count} / {menu.max_orders}
                      {menu.orders_count >= menu.max_orders && (
                        <span className="text-[#EF4444] ml-2">(Sold Out)</span>
                      )}
                    </span>
                  </div>
                </div>
                
                {menu.special_instructions && (
                  <div className="mb-4 p-3 bg-[#0D1117] rounded">
                    <p className="text-[#8B949E] text-sm">
                      <span className="font-medium">Special Instructions:</span> {menu.special_instructions}
                    </p>
                  </div>
                )}

                <div className="border-t border-[#21262D] pt-4">
                  <h4 className="text-[#F0F6FC] font-medium mb-3">
                    Menu Items ({menu.menu_items?.length || 0}):
                  </h4>
                  <div className="space-y-2">
                    {menu.menu_items?.map((item) => (
                      <div key={item.id} className="bg-[#0D1117] p-3 rounded">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="text-[#F0F6FC] font-medium">{item.name}</p>
                            {item.description && (
                              <p className="text-[#8B949E] text-sm mt-1">{item.description}</p>
                            )}
                            <div className="flex items-center space-x-2 mt-2 text-xs">
                              <span className="text-[#8B949E]">{item.category}</span>
                              {item.is_vegetarian && (
                                <span className="text-[#10B981]">• Veg</span>
                              )}
                              {!item.is_vegetarian && (
                                <span className="text-[#EF4444]">• Non-Veg</span>
                              )}
                              {item.is_vegan && (
                                <span className="text-[#10B981]">• Vegan</span>
                              )}
                              {item.is_spicy && (
                                <span className="text-[#F97316]">• Spicy</span>
                              )}
                            </div>
                          </div>
                          <span className="text-[#F0F6FC] font-semibold ml-4">₹{item.price}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-[#21262D]">
                  <p className="text-[#8B949E] text-sm">
                    Created: {new Date(menu.created_at).toLocaleDateString()}
                  </p>
                  <div className="space-x-2">
                    <button className="text-[#3B82F6] hover:text-[#2563EB] text-sm">
                      Edit
                    </button>
                    <button className="text-[#EF4444] hover:text-[#DC2626] text-sm">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default DailyMenus;