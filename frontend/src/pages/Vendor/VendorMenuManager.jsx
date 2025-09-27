import React, { useState, useEffect } from "react";

const VendorMenuManager = () => {
  const [activeTab, setActiveTab] = useState("menu-items");
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const getVendorAuthHeaders = () => {
  const token = localStorage.getItem('vendor_token');
  console.log("Vendor Token:", token); // Debugging line
  return token ? { Authorization: `Bearer ${token}` } : {};
};

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/vendor/dashboard/`,
        { headers: getVendorAuthHeaders() }
      );
      
      if (response.status === 401) {
        setError("Please login to access the dashboard");
        // You might want to redirect to login page here
        // window.location.href = '/vendor/login';
        return;
      }
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setDashboardData(data.dashboard_data);
        } else {
          setError(data.error || "Failed to fetch dashboard data");
        }
      } else {
        setError("Failed to fetch dashboard data");
      }
    } catch (err) {
      setError("Error fetching dashboard data");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const tabStyle = {
    display: "inline-block",
    padding: "10px 20px",
    margin: "0 5px",
    backgroundColor: "#f8f9fa",
    border: "1px solid #ddd",
    cursor: "pointer",
    borderRadius: "5px 5px 0 0",
  };

  const activeTabStyle = {
    ...tabStyle,
    backgroundColor: "#007bff",
    color: "white",
  };

  if (loading) return <div>Loading vendor menu data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Vendor Menu Management</h1>

      {/* Dashboard Overview */}
      {dashboardData && (
        <div
          style={{
            marginBottom: "30px",
            padding: "20px",
            backgroundColor: "#f8f9fa",
            borderRadius: "5px",
          }}
        >
          <h2>Dashboard Overview</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "15px",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <h3>{dashboardData.statistics.total_menu_items}</h3>
              <p>Total Menu Items</p>
            </div>
            <div style={{ textAlign: "center" }}>
              <h3>{dashboardData.statistics.active_menu_items}</h3>
              <p>Active Menu Items</p>
            </div>
            <div style={{ textAlign: "center" }}>
              <h3>{dashboardData.statistics.total_menus}</h3>
              <p>Total Menus</p>
            </div>
            <div style={{ textAlign: "center" }}>
              <h3>{dashboardData.statistics.active_menus}</h3>
              <p>Active Daily Menus</p>
            </div>
          </div>

          <div style={{ marginTop: "20px" }}>
            <h3>Kitchen Information</h3>
            <p>
              <strong>Kitchen Name:</strong>{" "}
              {dashboardData.vendor_info.kitchen_name}
            </p>
            <p>
              <strong>Verification Status:</strong>
              <span
                style={{
                  color: dashboardData.vendor_info.is_verified
                    ? "green"
                    : "orange",
                }}
              >
                {dashboardData.vendor_info.is_verified
                  ? " Verified"
                  : " Pending Verification"}
              </span>
            </p>
            <p>
              <strong>Status:</strong>
              <span
                style={{
                  color: dashboardData.vendor_info.is_active ? "green" : "red",
                }}
              >
                {dashboardData.vendor_info.is_active ? " Active" : " Inactive"}
              </span>
            </p>
          </div>

          {/* Recent Menus */}
          <div style={{ marginTop: "20px" }}>
            <h3>Recent Menus</h3>
            {dashboardData.recent_menus.length > 0 ? (
              <div style={{ display: "grid", gap: "10px" }}>
                {dashboardData.recent_menus.map((menu) => (
                  <div
                    key={menu.id}
                    style={{
                      padding: "10px",
                      backgroundColor: "white",
                      borderRadius: "3px",
                      border: "1px solid #ddd",
                    }}
                  >
                    <strong>{menu.name}</strong> -{" "}
                    {new Date(menu.date).toLocaleDateString()}
                    <br />
                    <small>
                      Items: {menu.items_count} | Price: ₹{menu.full_dabba_price} |
                      Dabbas Sold: {menu.dabbas_sold}/{menu.max_dabbas} |
                      {menu.is_veg_only && <span style={{ color: "green" }}> Veg Only |</span>}
                      <span style={{ color: menu.is_active ? "green" : "red" }}>
                        {menu.is_active ? " Active" : " Inactive"}
                      </span>
                    </small>
                    {menu.todays_special && (
                      <div style={{ marginTop: "5px", fontStyle: "italic" }}>
                        Today's Special: {menu.todays_special}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p>No menus created yet.</p>
            )}
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div style={{ borderBottom: "1px solid #ddd", marginBottom: "20px" }}>
        <div
          style={activeTab === "menu-items" ? activeTabStyle : tabStyle}
          onClick={() => setActiveTab("menu-items")}
        >
          Menu Items
        </div>
        <div
          style={activeTab === "daily-menus" ? activeTabStyle : tabStyle}
          onClick={() => setActiveTab("daily-menus")}
        >
          Daily Menus
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "menu-items" && <div>Menu Items Component</div>}
        {activeTab === "daily-menus" && <div>Daily Menus Component</div>}
      </div>
    </div>
  );
};

export default VendorMenuManager;