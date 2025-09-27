import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/profile/`, {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setProfile(data.user);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
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
              <h1 className="text-2xl font-bold text-[#F97316]">Tiffin Management</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-[#8B949E]">Welcome, {user?.first_name || user?.username}!</span>
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="bg-[#161B22] border border-[#21262D] rounded-lg p-6">
            <h2 className="text-xl font-semibold text-[#F0F6FC] mb-4">Profile Information</h2>
            {profile && (
              <div className="space-y-3">
                <div>
                  <span className="text-[#8B949E] text-sm">Username:</span>
                  <p className="text-[#F0F6FC]">{profile.username}</p>
                </div>
                <div>
                  <span className="text-[#8B949E] text-sm">Email:</span>
                  <p className="text-[#F0F6FC]">{profile.email}</p>
                </div>
                <div>
                  <span className="text-[#8B949E] text-sm">Full Name:</span>
                  <p className="text-[#F0F6FC]">
                    {profile.first_name} {profile.last_name}
                  </p>
                </div>
                <div>
                  <span className="text-[#8B949E] text-sm">Member since:</span>
                  <p className="text-[#F0F6FC]">
                    {new Date(profile.date_joined).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="bg-[#161B22] border border-[#21262D] rounded-lg p-6">
            <h2 className="text-xl font-semibold text-[#F0F6FC] mb-4">Quick Stats</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[#8B949E]">Active Orders</span>
                <span className="text-[#10B981] text-xl font-bold">5</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8B949E]">This Month</span>
                <span className="text-[#F97316] text-xl font-bold">₹2,450</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8B949E]">Total Saved</span>
                <span className="text-[#22C55E] text-xl font-bold">₹8,200</span>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-[#161B22] border border-[#21262D] rounded-lg p-6">
            <h2 className="text-xl font-semibold text-[#F0F6FC] mb-4">Recent Orders</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-[#21262D]">
                <div>
                  <p className="text-[#F0F6FC] text-sm">Dal Rice Combo</p>
                  <p className="text-[#8B949E] text-xs">Today, 12:30 PM</p>
                </div>
                <span className="text-[#10B981] text-sm">₹85</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-[#21262D]">
                <div>
                  <p className="text-[#F0F6FC] text-sm">Roti Sabji</p>
                  <p className="text-[#8B949E] text-xs">Yesterday, 1:00 PM</p>
                </div>
                <span className="text-[#10B981] text-sm">₹75</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-[#F0F6FC] text-sm">Biryani Special</p>
                  <p className="text-[#8B949E] text-xs">2 days ago, 12:45 PM</p>
                </div>
                <span className="text-[#10B981] text-sm">₹120</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;