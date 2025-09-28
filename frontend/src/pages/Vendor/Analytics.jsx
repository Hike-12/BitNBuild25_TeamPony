import React, { useState, useEffect } from 'react';
import { useVendorAuth } from '../../context/VendorAuthContext';
import { useTheme } from '../../context/ThemeContext';
import toast from 'react-hot-toast';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Cell, RadialBarChart, RadialBar, ComposedChart
} from 'recharts';
import {
  TrendingUp, TrendingDown, DollarSign, Package, Users, Calendar,
  ShoppingBag, Clock, ChefHat, Award, Target, Activity
} from 'lucide-react';

const Analytics = () => {
  const { vendor } = useVendorAuth();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState({
    orders: [],
    subscriptions: [],
    menus: [],
    summary: {
      totalRevenue: 0,
      totalOrders: 0,
      totalSubscriptions: 0,
      activeMenus: 0,
      avgOrderValue: 0,
      totalCustomers: 0
    }
  });
  const [timeframe, setTimeframe] = useState('week'); // week, month, year
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  const getAuthHeaders = () => {
    const token = localStorage.getItem("vendor_token");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  // Fetch all analytics data
  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Fetch orders
      const ordersResponse = await fetch(`${API_URL}/api/orders/vendor?limit=100`, {
        headers: getAuthHeaders(),
      });
      
      // Fetch dashboard data (includes menus)
      const dashboardResponse = await fetch(`${API_URL}/api/vendor/dashboard`, {
        headers: getAuthHeaders(),
      });

      // Fetch vendor subscriptions (you'll need to add this endpoint)
      // const subscriptionsResponse = await fetch(`${API_URL}/api/subscriptions/vendor`, {
      //   headers: getAuthHeaders(),
      // });

      if (!ordersResponse.ok || !dashboardResponse.ok) {
        throw new Error('Failed to fetch analytics data');
      }

      const ordersData = await ordersResponse.json();
      const dashboardData = await dashboardResponse.json();

      // Process and set data
      processAnalyticsData(ordersData.orders || [], dashboardData);
      
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  // Process raw data into analytics format
  const processAnalyticsData = (orders, dashboardData) => {
    // Calculate summary metrics
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
    const totalOrders = orders.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    // Get unique customers
    const uniqueCustomers = new Set(orders.map(order => order.customer?._id)).size;
    
    // Process orders by date for charts
    const ordersByDate = processOrdersByDate(orders);
    const ordersByStatus = processOrdersByStatus(orders);
    const ordersByTimeSlot = processOrdersByTimeSlot(orders);
    const revenueByDate = processRevenueByDate(orders);
    
    setAnalyticsData({
      orders,
      ordersByDate,
      ordersByStatus,
      ordersByTimeSlot,
      revenueByDate,
      menus: dashboardData.dashboard_data?.recent_menus || [],
      summary: {
        totalRevenue,
        totalOrders,
        totalSubscriptions: 0, // Update when subscription endpoint is ready
        activeMenus: dashboardData.dashboard_data?.statistics?.active_menus || 0,
        avgOrderValue,
        totalCustomers: uniqueCustomers,
        totalMenuItems: dashboardData.dashboard_data?.statistics?.total_menu_items || 0,
        activeMenuItems: dashboardData.dashboard_data?.statistics?.active_menu_items || 0
      }
    });
  };

  // Process orders by date
  const processOrdersByDate = (orders) => {
    const last7Days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
      
      const dayOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate.toDateString() === date.toDateString();
      });
      
      last7Days.push({
        date: dateStr,
        orders: dayOrders.length,
        revenue: dayOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0)
      });
    }
    
    return last7Days;
  };

  // Process orders by status
  const processOrdersByStatus = (orders) => {
    const statusCount = {};
    orders.forEach(order => {
      const status = order.order_status || 'unknown';
      statusCount[status] = (statusCount[status] || 0) + 1;
    });
    
    const statusColors = {
      placed: theme.warning,
      confirmed: theme.info,
      preparing: theme.secondary,
      out_for_delivery: theme.primary,
      delivered: theme.success,
      cancelled: theme.error
    };
    
    return Object.entries(statusCount).map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' '),
      value: count,
      color: statusColors[status] || theme.textSecondary
    }));
  };

  // Process orders by time slot
  const processOrdersByTimeSlot = (orders) => {
    const timeSlotCount = {};
    orders.forEach(order => {
      const slot = order.delivery_time_slot || 'unknown';
      timeSlotCount[slot] = (timeSlotCount[slot] || 0) + 1;
    });
    
    return Object.entries(timeSlotCount).map(([slot, count]) => ({
      timeSlot: slot,
      orders: count
    }));
  };

  // Process revenue by date
  const processRevenueByDate = (orders) => {
    const last30Days = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
      
      const dayRevenue = orders
        .filter(order => {
          const orderDate = new Date(order.createdAt);
          return orderDate.toDateString() === date.toDateString();
        })
        .reduce((sum, order) => sum + (order.total_amount || 0), 0);
      
      last30Days.push({
        date: dateStr,
        revenue: dayRevenue
      });
    }
    
    return last30Days;
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeframe]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
               style={{ borderColor: theme.primary }}></div>
          <p style={{ color: theme.textSecondary }}>Loading analytics...</p>
        </div>
      </div>
    );
  }

  const { summary, ordersByDate, ordersByStatus, ordersByTimeSlot, revenueByDate } = analyticsData;

  // Custom tooltip styles
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 rounded-lg shadow-lg" 
             style={{ backgroundColor: theme.panels, border: `1px solid ${theme.border}` }}>
          <p className="font-medium" style={{ color: theme.text }}>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.name.includes('revenue') || entry.name.includes('Revenue') 
                ? `₹${entry.value}` 
                : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border p-6"
           style={{ backgroundColor: theme.panels, borderColor: theme.border }}>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-3" style={{ color: theme.text }}>
              <Activity style={{ color: theme.primary }} /> Analytics Dashboard
            </h1>
            <p className="mt-1" style={{ color: theme.textSecondary }}>
              Track your business performance and insights
            </p>
          </div>
          <div className="flex gap-2">
            {['week', 'month', 'year'].map(period => (
              <button
                key={period}
                onClick={() => setTimeframe(period)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  backgroundColor: timeframe === period ? theme.primary : theme.background,
                  color: timeframe === period ? '#fff' : theme.textSecondary
                }}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border p-4" style={{ backgroundColor: theme.panels, borderColor: theme.border }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: theme.textSecondary }}>Total Revenue</p>
              <p className="text-2xl font-bold mt-1" style={{ color: theme.text }}>
                ₹{summary.totalRevenue.toLocaleString()}
              </p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp size={16} style={{ color: theme.success }} />
                <span className="text-sm" style={{ color: theme.success }}>+12.5%</span>
              </div>
            </div>
            <div className="p-3 rounded-lg" style={{ backgroundColor: `${theme.primary}15` }}>
              <DollarSign size={24} style={{ color: theme.primary }} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border p-4" style={{ backgroundColor: theme.panels, borderColor: theme.border }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: theme.textSecondary }}>Total Orders</p>
              <p className="text-2xl font-bold mt-1" style={{ color: theme.text }}>
                {summary.totalOrders}
              </p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp size={16} style={{ color: theme.success }} />
                <span className="text-sm" style={{ color: theme.success }}>+8.3%</span>
              </div>
            </div>
            <div className="p-3 rounded-lg" style={{ backgroundColor: `${theme.secondary}15` }}>
              <Package size={24} style={{ color: theme.secondary }} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border p-4" style={{ backgroundColor: theme.panels, borderColor: theme.border }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: theme.textSecondary }}>Avg Order Value</p>
              <p className="text-2xl font-bold mt-1" style={{ color: theme.text }}>
                ₹{Math.round(summary.avgOrderValue)}
              </p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingDown size={16} style={{ color: theme.error }} />
                <span className="text-sm" style={{ color: theme.error }}>-2.1%</span>
              </div>
            </div>
            <div className="p-3 rounded-lg" style={{ backgroundColor: `${theme.warning}15` }}>
              <Target size={24} style={{ color: theme.warning }} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border p-4" style={{ backgroundColor: theme.panels, borderColor: theme.border }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: theme.textSecondary }}>Total Customers</p>
              <p className="text-2xl font-bold mt-1" style={{ color: theme.text }}>
                {summary.totalCustomers}
              </p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp size={16} style={{ color: theme.success }} />
                <span className="text-sm" style={{ color: theme.success }}>+15.2%</span>
              </div>
            </div>
            <div className="p-3 rounded-lg" style={{ backgroundColor: `${theme.info}15` }}>
              <Users size={24} style={{ color: theme.info }} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders Trend */}
        <div className="rounded-xl border p-6" style={{ backgroundColor: theme.panels, borderColor: theme.border }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: theme.text }}>Orders Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={ordersByDate}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.border} />
              <XAxis dataKey="date" stroke={theme.textSecondary} />
              <YAxis stroke={theme.textSecondary} />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="orders" 
                stroke={theme.primary} 
                fill={`${theme.primary}30`}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Order Status Distribution */}
        <div className="rounded-xl border p-6" style={{ backgroundColor: theme.panels, borderColor: theme.border }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: theme.text }}>Order Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={ordersByStatus}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {ordersByStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="middle" 
                align="right"
                layout="vertical"
                iconType="circle"
                formatter={(value) => <span style={{ color: theme.text }}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend */}
        <div className="lg:col-span-2 rounded-xl border p-6" style={{ backgroundColor: theme.panels, borderColor: theme.border }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: theme.text }}>Revenue Trend (30 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueByDate}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.border} />
              <XAxis 
                dataKey="date" 
                stroke={theme.textSecondary}
                interval={4}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis stroke={theme.textSecondary} />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                name="Revenue"
                stroke={theme.primary} 
                strokeWidth={3}
                dot={{ fill: theme.primary, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Time Slot Performance */}
        <div className="rounded-xl border p-6" style={{ backgroundColor: theme.panels, borderColor: theme.border }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: theme.text }}>Popular Time Slots</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ordersByTimeSlot} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke={theme.border} />
              <XAxis type="number" stroke={theme.textSecondary} />
              <YAxis dataKey="timeSlot" type="category" stroke={theme.textSecondary} width={80} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="orders" fill={theme.secondary} radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Menu Performance */}
      <div className="rounded-xl border p-6" style={{ backgroundColor: theme.panels, borderColor: theme.border }}>
        <h3 className="text-lg font-semibold mb-4" style={{ color: theme.text }}>Menu Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {analyticsData.menus.map((menu) => (
            <div key={menu.id} className="p-4 rounded-lg border" 
                 style={{ backgroundColor: theme.background, borderColor: theme.border }}>
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium" style={{ color: theme.text }}>{menu.name}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium`}
                      style={{
                        backgroundColor: menu.is_active ? `${theme.success}15` : `${theme.error}15`,
                        color: menu.is_active ? theme.success : theme.error
                      }}>
                  {menu.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="text-sm mb-2" style={{ color: theme.textSecondary }}>
                {new Date(menu.date).toLocaleDateString('en-IN', { 
                  day: 'numeric', 
                  month: 'short', 
                  year: 'numeric' 
                })}
              </p>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm" style={{ color: theme.textSecondary }}>Price</span>
                  <span className="font-medium" style={{ color: theme.text }}>₹{menu.full_dabba_price}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm" style={{ color: theme.textSecondary }}>Sold/Total</span>
                  <span className="font-medium" style={{ color: theme.text }}>
                    {menu.dabbas_sold}/{menu.max_dabbas}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div className="h-2 rounded-full" 
                       style={{
                         backgroundColor: theme.primary,
                         width: `${(menu.dabbas_sold / menu.max_dabbas) * 100}%`
                       }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;