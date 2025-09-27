import React, { useState, useEffect } from "react";
import { useVendorAuth } from "../../context/VendorAuthContext";

const VendorDashboard = () => {
  const { vendor, logout } = useVendorAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/vendor/profile/`,
        {
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        setProfile(data.user);
      }
    } catch (error) {
      console.error("Failed to fetch vendor profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D1117] flex items-center justify-center">
        <div className="text-[#F0F6FC] text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D1117]">
      {/* Header */}
      <header className="bg-[#161B22] border-b border-[#21262D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-[#F97316]">
                NourishNet Vendor
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-[#8B949E]">
                Welcome, {vendor?.first_name || vendor?.username}!
              </span>
              <span className="text-[#10B981] text-sm px-2 py-1 rounded-full bg-[#10B981] bg-opacity-10">
                {vendor?.is_verified ? "Verified" : "Pending Verification"}
              </span>
              <button
                onClick={handleLogout}
                className="bg-[#EF4444] text-white px-4 py-2 rounded-md hover:bg-[#DC2626] transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#161B22] border border-[#21262D] rounded-lg p-6">
            <h3 className="text-sm font-medium text-[#8B949E] mb-2">
              Total Orders
            </h3>
            <p className="text-3xl font-bold text-[#F0F6FC]">156</p>
            <p className="text-sm text-[#10B981] mt-1">+12% from last month</p>
          </div>

          <div className="bg-[#161B22] border border-[#21262D] rounded-lg p-6">
            <h3 className="text-sm font-medium text-[#8B949E] mb-2">
              Active Customers
            </h3>
            <p className="text-3xl font-bold text-[#F0F6FC]">89</p>
            <p className="text-sm text-[#10B981] mt-1">+8% from last month</p>
          </div>

          <div className="bg-[#161B22] border border-[#21262D] rounded-lg p-6">
            <h3 className="text-sm font-medium text-[#8B949E] mb-2">Revenue</h3>
            <p className="text-3xl font-bold text-[#F0F6FC]">₹24,580</p>
            <p className="text-sm text-[#10B981] mt-1">+15% from last month</p>
          </div>

          <div className="bg-[#161B22] border border-[#21262D] rounded-lg p-6">
            <h3 className="text-sm font-medium text-[#8B949E] mb-2">
              Menu Items
            </h3>
            <p className="text-3xl font-bold text-[#F0F6FC]">12</p>
            <p className="text-sm text-[#F97316] mt-1">2 out of stock</p>
          </div>
        </div>

        {/* Business Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Business Details */}
          <div className="bg-[#161B22] border border-[#21262D] rounded-lg p-6">
            <h2 className="text-xl font-semibold text-[#F0F6FC] mb-4">
              Business Information
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[#8B949E]">Kitchen Name</span>
                <span className="text-[#F0F6FC] font-medium">{vendor?.kitchen_name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8B949E]">Owner</span>
                <span className="text-[#F0F6FC] font-medium">
                  {vendor?.first_name} {vendor?.last_name}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8B949E]">Phone</span>
                <span className="text-[#F0F6FC] font-medium">
                  {vendor?.phone_number}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8B949E]">License</span>
                <span className="text-[#F0F6FC] font-medium">
                  {vendor?.license_number}
                </span>
              </div>
              <div className="flex items-start justify-between">
                <span className="text-[#8B949E]">Address</span>
                <span className="text-[#F0F6FC] text-right max-w-xs">{vendor?.address}</span>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-[#161B22] border border-[#21262D] rounded-lg p-6">
            <h2 className="text-xl font-semibold text-[#F0F6FC] mb-4">
              Recent Orders
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-[#21262D]">
                <div>
                  <p className="text-[#F0F6FC] text-sm">
                    #ORD001 - Rajesh Kumar
                  </p>
                  <p className="text-[#8B949E] text-xs">Today, 11:30 AM</p>
                </div>
                <div className="text-right">
                  <span className="text-[#10B981] text-sm">₹180</span>
                  <p className="text-[#F97316] text-xs">Preparing</p>
                </div>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-[#21262D]">
                <div>
                  <p className="text-[#F0F6FC] text-sm">
                    #ORD002 - Priya Sharma
                  </p>
                  <p className="text-[#8B949E] text-xs">Today, 10:45 AM</p>
                </div>
                <div className="text-right">
                  <span className="text-[#10B981] text-sm">₹150</span>
                  <p className="text-[#10B981] text-xs">Delivered</p>
                </div>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-[#F0F6FC] text-sm">#ORD003 - Amit Singh</p>
                  <p className="text-[#8B949E] text-xs">Yesterday, 1:15 PM</p>
                </div>
                <div className="text-right">
                  <span className="text-[#10B981] text-sm">₹200</span>
                  <p className="text-[#10B981] text-xs">Delivered</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-[#161B22] border border-[#21262D] rounded-lg p-6">
          <h2 className="text-xl font-semibold text-[#F0F6FC] mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="bg-[#F97316] text-white px-6 py-3 rounded-md hover:bg-[#EA580C] transition-colors">
              Add Menu Item
            </button>
            <button className="bg-[#10B981] text-white px-6 py-3 rounded-md hover:bg-[#059669] transition-colors">
              View Orders
            </button>
            <button className="bg-[#3B82F6] text-white px-6 py-3 rounded-md hover:bg-[#2563EB] transition-colors">
              Manage Customers
            </button>
            <button className="bg-[#8B5CF6] text-white px-6 py-3 rounded-md hover:bg-[#7C3AED] transition-colors">
              View Analytics
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VendorDashboard;
