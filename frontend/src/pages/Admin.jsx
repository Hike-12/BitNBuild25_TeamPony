import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';
import {
  FiUsers,
  FiUser,
  FiShoppingBag,
  FiSettings,
  FiSun,
  FiMoon,
  FiEdit,
  FiTrash2,
  FiEye,
  FiCheck,
  FiX,
  FiSearch,
  FiFilter,
  FiDownload,
  FiRefreshCw
} from 'react-icons/fi';
import {
  MdRestaurant,
  MdVerifiedUser,
  MdBlock,
  MdDashboard
} from 'react-icons/md';

const AdminDashboard = () => {
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('overview');
  const [vendors, setVendors] = useState([]);
  const [consumers, setConsumers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  // Mock admin check - replace with actual logic
  const isAdmin = () => {
    const adminKey = localStorage.getItem('adminKey');
    return adminKey === 'admin123'; // Simple admin check
  };

  // Admin login prompt
  const promptAdminLogin = () => {
    const key = prompt('Enter Admin Password:');
    if (key === 'admin123') {
      localStorage.setItem('adminKey', key);
      toast.success('Admin access granted! 🔑');
      return true;
    } else {
      toast.error('Invalid admin password!');
      return false;
    }
  };

  // Check admin access on component mount
  useEffect(() => {
    if (!isAdmin()) {
      if (!promptAdminLogin()) {
        window.location.href = '/';
        return;
      }
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch vendors using existing API
      const vendorResponse = await fetch(`${API_URL}/api/vendor/public/daily-menus`);
      if (vendorResponse.ok) {
        const vendorData = await vendorResponse.json();
        // Extract unique vendors from menus
        const uniqueVendors = [];
        const vendorIds = new Set();
        vendorData.menus?.forEach(menu => {
          if (menu.vendor && !vendorIds.has(menu.vendor._id)) {
            vendorIds.add(menu.vendor._id);
            uniqueVendors.push({
              _id: menu.vendor._id,
              business_name: menu.vendor.business_name,
              address: menu.vendor.address,
              phone_number: menu.vendor.phone_number,
              is_active: true,
              is_verified: true,
              createdAt: new Date(),
              totalMenus: vendorData.menus.filter(m => m.vendor._id === menu.vendor._id).length
            });
          }
        });
        setVendors(uniqueVendors);
      }

      // Mock consumer data (since we don't have a public consumer API)
      setConsumers([
        {
          _id: '1',
          username: 'rajesh_kumar',
          first_name: 'Rajesh',
          last_name: 'Kumar',
          email: 'rajesh.kumar@gmail.com',
          phone: '+91 9876543210',
          is_active: true,
          createdAt: new Date('2024-01-15'),
          totalOrders: 25
        },
        {
          _id: '2',
          username: 'priya_mehta',
          first_name: 'Priya',
          last_name: 'Mehta',
          email: 'priya.mehta@gmail.com',
          phone: '+91 9876543211',
          is_active: true,
          createdAt: new Date('2024-02-10'),
          totalOrders: 18
        },
        {
          _id: '3',
          username: 'arjun_patel',
          first_name: 'Arjun',
          last_name: 'Patel',
          email: 'arjun.patel@gmail.com',
          phone: '+91 9876543212',
          is_active: false,
          createdAt: new Date('2024-03-05'),
          totalOrders: 5
        }
      ]);

    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleVendorAction = async (vendorId, action) => {
    try {
      if (action === 'verify') {
        setVendors(prev => prev.map(v => 
          v._id === vendorId ? { ...v, is_verified: true } : v
        ));
        toast.success('Vendor verified successfully!');
      } else if (action === 'block') {
        setVendors(prev => prev.map(v => 
          v._id === vendorId ? { ...v, is_active: false } : v
        ));
        toast.success('Vendor blocked successfully!');
      } else if (action === 'unblock') {
        setVendors(prev => prev.map(v => 
          v._id === vendorId ? { ...v, is_active: true } : v
        ));
        toast.success('Vendor unblocked successfully!');
      }
    } catch (error) {
      toast.error('Action failed!');
    }
  };

  const handleConsumerAction = async (consumerId, action) => {
    try {
      if (action === 'block') {
        setConsumers(prev => prev.map(c => 
          c._id === consumerId ? { ...c, is_active: false } : c
        ));
        toast.success('Consumer blocked successfully!');
      } else if (action === 'unblock') {
        setConsumers(prev => prev.map(c => 
          c._id === consumerId ? { ...c, is_active: true } : c
        ));
        toast.success('Consumer unblocked successfully!');
      }
    } catch (error) {
      toast.error('Action failed!');
    }
  };

  // Filter functions
  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.address?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && vendor.is_active) ||
                         (filterStatus === 'inactive' && !vendor.is_active) ||
                         (filterStatus === 'verified' && vendor.is_verified) ||
                         (filterStatus === 'unverified' && !vendor.is_verified);
    return matchesSearch && matchesStatus;
  });

  const filteredConsumers = consumers.filter(consumer => {
    const matchesSearch = consumer.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         consumer.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         consumer.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && consumer.is_active) ||
                         (filterStatus === 'inactive' && !consumer.is_active);
    return matchesSearch && matchesStatus;
  });

  // Overview Component
  const OverviewComponent = () => (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: 'Total Vendors',
            value: vendors.length,
            icon: MdRestaurant,
            color: theme.primary,
            bg: `${theme.primary}15`
          },
          {
            title: 'Total Consumers',
            value: consumers.length,
            icon: FiUsers,
            color: theme.success,
            bg: `${theme.success}15`
          },
          {
            title: 'Active Vendors',
            value: vendors.filter(v => v.is_active).length,
            icon: MdVerifiedUser,
            color: theme.warning,
            bg: `${theme.warning}15`
          },
          {
            title: 'Total Orders',
            value: consumers.reduce((sum, c) => sum + (c.totalOrders || 0), 0),
            icon: FiShoppingBag,
            color: theme.secondary,
            bg: `${theme.secondary}15`
          }
        ].map((stat, index) => (
          <div key={index}
            className="p-6 rounded-2xl border transition-all duration-300 hover:transform hover:scale-105"
            style={{ backgroundColor: theme.panels, borderColor: theme.border }}
          >
            <div className="flex items-center justify-between mb-4">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: stat.bg }}
              >
                <stat.icon size={24} style={{ color: stat.color }} />
              </div>
              <span className="text-2xl font-bold" style={{ color: theme.text }}>
                {stat.value}
              </span>
            </div>
            <h3 className="font-semibold" style={{ color: theme.text }}>{stat.title}</h3>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="rounded-2xl border p-6"
        style={{ backgroundColor: theme.panels, borderColor: theme.border }}
      >
        <h2 className="text-xl font-bold mb-4" style={{ color: theme.text }}>
          Recent Activity
        </h2>
        <div className="space-y-3">
          {[
            'New vendor "Sharma Kitchen" registered',
            'Consumer "Rajesh Kumar" placed order #12345',
            'Vendor "Chennai Express" updated menu',
            'New consumer "Priya Mehta" signed up'
          ].map((activity, index) => (
            <div key={index} 
              className="p-3 rounded-lg" 
              style={{ backgroundColor: theme.background }}
            >
              <span style={{ color: theme.textSecondary }}>{activity}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Vendors Component
  const VendorsComponent = () => (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2" 
              style={{ color: theme.textSecondary }} />
            <input
              type="text"
              placeholder="Search vendors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg border"
              style={{ 
                backgroundColor: theme.panels, 
                borderColor: theme.border, 
                color: theme.text 
              }}
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 rounded-lg border"
            style={{ 
              backgroundColor: theme.panels, 
              borderColor: theme.border, 
              color: theme.text 
            }}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="verified">Verified</option>
            <option value="unverified">Unverified</option>
          </select>
        </div>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium"
          style={{ backgroundColor: theme.primary, color: 'white' }}
        >
          <FiRefreshCw size={16} /> Refresh
        </button>
      </div>

      {/* Vendors Table */}
      <div className="rounded-2xl border overflow-hidden"
        style={{ backgroundColor: theme.panels, borderColor: theme.border }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ backgroundColor: theme.background }}>
              <tr>
                <th className="text-left p-4" style={{ color: theme.text }}>Vendor</th>
                <th className="text-left p-4" style={{ color: theme.text }}>Contact</th>
                <th className="text-left p-4" style={{ color: theme.text }}>Status</th>
                <th className="text-left p-4" style={{ color: theme.text }}>Menus</th>
                <th className="text-left p-4" style={{ color: theme.text }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVendors.map((vendor) => (
                <tr key={vendor._id} 
                  className="border-t hover:bg-opacity-50 transition-colors"
                  style={{ borderColor: theme.border }}
                >
                  <td className="p-4">
                    <div>
                      <div className="font-semibold" style={{ color: theme.text }}>
                        {vendor.business_name}
                      </div>
                      <div className="text-sm" style={{ color: theme.textSecondary }}>
                        {vendor.address}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm" style={{ color: theme.textSecondary }}>
                      {vendor.phone_number}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium`}
                        style={{
                          backgroundColor: vendor.is_active ? `${theme.success}15` : `${theme.error}15`,
                          color: vendor.is_active ? theme.success : theme.error
                        }}>
                        {vendor.is_active ? 'Active' : 'Inactive'}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium`}
                        style={{
                          backgroundColor: vendor.is_verified ? `${theme.primary}15` : `${theme.warning}15`,
                          color: vendor.is_verified ? theme.primary : theme.warning
                        }}>
                        {vendor.is_verified ? 'Verified' : 'Pending'}
                      </span>
                    </div>
                  </td>
                  <td className="p-4" style={{ color: theme.text }}>
                    {vendor.totalMenus || 0}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      {!vendor.is_verified && (
                        <button
                          onClick={() => handleVendorAction(vendor._id, 'verify')}
                          className="p-2 rounded-lg hover:opacity-70"
                          style={{ backgroundColor: `${theme.success}15` }}
                          title="Verify Vendor"
                        >
                          <FiCheck size={16} style={{ color: theme.success }} />
                        </button>
                      )}
                      {vendor.is_active ? (
                        <button
                          onClick={() => handleVendorAction(vendor._id, 'block')}
                          className="p-2 rounded-lg hover:opacity-70"
                          style={{ backgroundColor: `${theme.error}15` }}
                          title="Block Vendor"
                        >
                          <MdBlock size={16} style={{ color: theme.error }} />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleVendorAction(vendor._id, 'unblock')}
                          className="p-2 rounded-lg hover:opacity-70"
                          style={{ backgroundColor: `${theme.success}15` }}
                          title="Unblock Vendor"
                        >
                          <FiCheck size={16} style={{ color: theme.success }} />
                        </button>
                      )}
                      <button
                        className="p-2 rounded-lg hover:opacity-70"
                        style={{ backgroundColor: `${theme.primary}15` }}
                        title="View Details"
                      >
                        <FiEye size={16} style={{ color: theme.primary }} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Consumers Component
  const ConsumersComponent = () => (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2" 
              style={{ color: theme.textSecondary }} />
            <input
              type="text"
              placeholder="Search consumers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg border"
              style={{ 
                backgroundColor: theme.panels, 
                borderColor: theme.border, 
                color: theme.text 
              }}
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 rounded-lg border"
            style={{ 
              backgroundColor: theme.panels, 
              borderColor: theme.border, 
              color: theme.text 
            }}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Consumers Table */}
      <div className="rounded-2xl border overflow-hidden"
        style={{ backgroundColor: theme.panels, borderColor: theme.border }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ backgroundColor: theme.background }}>
              <tr>
                <th className="text-left p-4" style={{ color: theme.text }}>Consumer</th>
                <th className="text-left p-4" style={{ color: theme.text }}>Contact</th>
                <th className="text-left p-4" style={{ color: theme.text }}>Status</th>
                <th className="text-left p-4" style={{ color: theme.text }}>Orders</th>
                <th className="text-left p-4" style={{ color: theme.text }}>Joined</th>
                <th className="text-left p-4" style={{ color: theme.text }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredConsumers.map((consumer) => (
                <tr key={consumer._id} 
                  className="border-t hover:bg-opacity-50 transition-colors"
                  style={{ borderColor: theme.border }}
                >
                  <td className="p-4">
                    <div>
                      <div className="font-semibold" style={{ color: theme.text }}>
                        {consumer.first_name} {consumer.last_name}
                      </div>
                      <div className="text-sm" style={{ color: theme.textSecondary }}>
                        @{consumer.username}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <div className="text-sm" style={{ color: theme.text }}>
                        {consumer.email}
                      </div>
                      <div className="text-sm" style={{ color: theme.textSecondary }}>
                        {consumer.phone}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium`}
                      style={{
                        backgroundColor: consumer.is_active ? `${theme.success}15` : `${theme.error}15`,
                        color: consumer.is_active ? theme.success : theme.error
                      }}>
                      {consumer.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-4" style={{ color: theme.text }}>
                    {consumer.totalOrders || 0}
                  </td>
                  <td className="p-4" style={{ color: theme.textSecondary }}>
                    {new Date(consumer.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      {consumer.is_active ? (
                        <button
                          onClick={() => handleConsumerAction(consumer._id, 'block')}
                          className="p-2 rounded-lg hover:opacity-70"
                          style={{ backgroundColor: `${theme.error}15` }}
                          title="Block Consumer"
                        >
                          <MdBlock size={16} style={{ color: theme.error }} />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleConsumerAction(consumer._id, 'unblock')}
                          className="p-2 rounded-lg hover:opacity-70"
                          style={{ backgroundColor: `${theme.success}15` }}
                          title="Unblock Consumer"
                        >
                          <FiCheck size={16} style={{ color: theme.success }} />
                        </button>
                      )}
                      <button
                        className="p-2 rounded-lg hover:opacity-70"
                        style={{ backgroundColor: `${theme.primary}15` }}
                        title="View Details"
                      >
                        <FiEye size={16} style={{ color: theme.primary }} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  if (!isAdmin()) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: theme.background }}
      >
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4" style={{ color: theme.text }}>
            Access Denied
          </h1>
          <p style={{ color: theme.textSecondary }}>
            You don't have permission to access this page.
          </p>
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
        className="border-b sticky top-0 z-40 backdrop-blur-md"
        style={{ 
          backgroundColor: `${theme.panels}95`,
          borderColor: theme.border 
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: theme.primary }}
              >
                <MdDashboard size={24} color="white" />
              </div>
              <h1 
                className="text-2xl font-bold"
                style={{ color: theme.text }}
              >
                Admin Dashboard
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:opacity-80 transition-opacity"
                style={{ 
                  backgroundColor: theme.panels,
                  color: theme.textSecondary 
                }}
              >
                {isDarkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
              </button>

              <button
                onClick={() => {
                  localStorage.removeItem('adminKey');
                  window.location.href = '/';
                }}
                className="px-4 py-2 rounded-lg font-medium"
                style={{ backgroundColor: theme.error, color: 'white' }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside 
          className="w-64 min-h-screen border-r"
          style={{ 
            backgroundColor: theme.panels,
            borderColor: theme.border 
          }}
        >
          <nav className="p-4 space-y-2">
            {[
              { id: 'overview', label: 'Overview', icon: MdDashboard },
              { id: 'vendors', label: 'Vendors', icon: MdRestaurant },
              { id: 'consumers', label: 'Consumers', icon: FiUsers }
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    isActive ? 'transform scale-105' : 'hover:transform hover:scale-102'
                  }`}
                  style={{
                    backgroundColor: isActive ? theme.primary : 'transparent',
                    color: isActive ? 'white' : theme.textSecondary
                  }}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2" 
                style={{ borderColor: theme.primary }}></div>
            </div>
          ) : (
            <>
              {activeTab === 'overview' && <OverviewComponent />}
              {activeTab === 'vendors' && <VendorsComponent />}
              {activeTab === 'consumers' && <ConsumersComponent />}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;