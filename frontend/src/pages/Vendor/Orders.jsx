import React, { useState, useEffect } from 'react';
import { useVendorAuth } from '../../context/VendorAuthContext';
import { useTheme } from '../../context/ThemeContext';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { 
  Calendar, 
  Clock, 
  Package, 
  User, 
  Phone, 
  MapPin, 
  ChevronRight, 
  Search, 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  Truck, 
  ChefHat,
  DollarSign,
  TrendingUp
} from 'lucide-react';

const Orders = () => {
  const { vendor } = useVendorAuth();
  const { theme } = useTheme();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const API_URL = import.meta.env.VITE_API_URL;

  const getAuthHeaders = () => {
    const token = localStorage.getItem('vendor_token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  // Fetch orders from backend
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Build query params
      const params = new URLSearchParams({
        page: page,
        limit: 10
      });
      
      if (activeTab !== 'all') {
        params.append('status', activeTab);
      }

      const response = await fetch(`${API_URL}/api/orders/vendor?${params}`, {
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch orders`);
      }

      const data = await response.json();
      
      if (data.success) {
        setOrders(data.orders || []);
        setTotalPages(data.pagination?.total_pages || 1);
      } else {
        throw new Error(data.error || 'Failed to fetch orders');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching orders:', err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setUpdatingStatus(true);

      const response = await fetch(`${API_URL}/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to update order status`);
      }

      const data = await response.json();
      
      if (data.success) {
        // Update local state
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order._id === orderId ? { ...order, order_status: newStatus } : order
          )
        );
        
        if (selectedOrder?._id === orderId) {
          setSelectedOrder(prev => ({ ...prev, order_status: newStatus }));
        }
        
        toast.success('Order status updated successfully');
      } else {
        throw new Error(data.error || 'Failed to update status');
      }
    } catch (err) {
      toast.error(err.message);
      console.error('Error updating order status:', err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Fetch orders when component mounts or when filters change
  useEffect(() => {
    fetchOrders();
  }, [page, activeTab]);

  const statusColors = {
    placed: { bg: `${theme.warning}15`, text: theme.warning },
    confirmed: { bg: `${theme.info}15`, text: theme.info },
    preparing: { bg: `${theme.secondary}15`, text: theme.secondary },
    out_for_delivery: { bg: `${theme.primary}15`, text: theme.primary },
    delivered: { bg: `${theme.success}15`, text: theme.success },
    cancelled: { bg: `${theme.error}15`, text: theme.error }
  };

  const statusIcons = {
    placed: <AlertCircle size={16} />,
    confirmed: <CheckCircle size={16} />,
    preparing: <ChefHat size={16} />,
    out_for_delivery: <Truck size={16} />,
    delivered: <CheckCircle size={16} />,
    cancelled: <XCircle size={16} />
  };

  const orderStatuses = ['placed', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];

  const filteredOrders = orders.filter(order => {
    const matchesSearch = searchTerm === '' || 
      order.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.menu?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order._id.includes(searchTerm);
    return matchesSearch;
  });

  const getStatusCount = (status) => {
    return orders.filter(order => status === 'all' ? true : order.order_status === status).length;
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  // Calculate stats
  const todaysOrders = orders.filter(order => {
    const orderDate = new Date(order.createdAt).toDateString();
    const today = new Date().toDateString();
    return orderDate === today;
  });

  const pendingOrders = orders.filter(o => o.order_status === 'placed');
  const preparingOrders = orders.filter(o => o.order_status === 'preparing');
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total_amount || 0), 0);

  if (loading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" 
               style={{ borderColor: theme.primary }}></div>
          <p style={{ color: theme.textSecondary }}>Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error && orders.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center p-8 rounded-2xl" style={{ backgroundColor: theme.panels }}>
          <AlertCircle className="w-12 h-12 mx-auto mb-4" style={{ color: theme.error }} />
          <p className="text-lg mb-4" style={{ color: theme.error }}>{error}</p>
          <button 
            onClick={fetchOrders}
            className="px-6 py-2.5 rounded-lg font-medium transition-all duration-200 hover:transform hover:scale-105"
            style={{ backgroundColor: theme.primary, color: '#fff' }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border p-6" 
           style={{ backgroundColor: theme.panels, borderColor: theme.border }}>
        <h1 className="text-3xl font-bold" style={{ color: theme.text }}>Orders Management</h1>
        <p className="mt-2" style={{ color: theme.textSecondary }}>Manage and track your customer orders</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl border p-4" style={{ backgroundColor: theme.panels, borderColor: theme.border }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: theme.textSecondary }}>Today's Orders</p>
              <p className="text-2xl font-bold" style={{ color: theme.text }}>{todaysOrders.length}</p>
            </div>
            <Package className="w-8 h-8" style={{ color: theme.primary }} />
          </div>
        </div>
        <div className="rounded-xl border p-4" style={{ backgroundColor: theme.panels, borderColor: theme.border }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: theme.textSecondary }}>Pending</p>
              <p className="text-2xl font-bold" style={{ color: theme.warning }}>{pendingOrders.length}</p>
            </div>
            <AlertCircle className="w-8 h-8" style={{ color: theme.warning }} />
          </div>
        </div>
        <div className="rounded-xl border p-4" style={{ backgroundColor: theme.panels, borderColor: theme.border }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: theme.textSecondary }}>Preparing</p>
              <p className="text-2xl font-bold" style={{ color: theme.secondary }}>{preparingOrders.length}</p>
            </div>
            <ChefHat className="w-8 h-8" style={{ color: theme.secondary }} />
          </div>
        </div>
        <div className="rounded-xl border p-4" style={{ backgroundColor: theme.panels, borderColor: theme.border }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: theme.textSecondary }}>Revenue</p>
              <p className="text-2xl font-bold" style={{ color: theme.success }}>₹{totalRevenue}</p>
            </div>
            <TrendingUp className="w-8 h-8" style={{ color: theme.success }} />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="rounded-xl border" style={{ backgroundColor: theme.panels, borderColor: theme.border }}>
        <div className="border-b p-4" style={{ borderColor: theme.border }}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex gap-2 overflow-x-auto">
              {['all', 'placed', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'].map(status => (
                <button
                  key={status}
                  onClick={() => {
                    setActiveTab(status);
                    setPage(1);
                  }}
                  className="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200"
                  style={{
                    backgroundColor: activeTab === status ? theme.primary : theme.background,
                    color: activeTab === status ? '#fff' : theme.textSecondary
                  }}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')} ({getStatusCount(status)})
                </button>
              ))}
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" 
                      style={{ color: theme.textSecondary }} />
              <input
                type="text"
                placeholder="Search orders..."
                className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2"
                style={{ 
                  backgroundColor: theme.background, 
                  borderColor: theme.border,
                  color: theme.text
                }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="divide-y" style={{ borderColor: theme.border }}>
          {filteredOrders.length === 0 ? (
            <div className="p-8 text-center">
              <Package className="w-12 h-12 mx-auto mb-4 opacity-30" style={{ color: theme.textSecondary }} />
              <p style={{ color: theme.textSecondary }}>No orders found</p>
            </div>
          ) : (
            filteredOrders.map(order => (
              <div key={order._id} className="p-4 hover:bg-opacity-50 transition-colors"
                   style={{ backgroundColor: theme.background }}>
                <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold" style={{ color: theme.text }}>
                          Order #{order._id}
                        </h3>
                        <p className="text-sm mt-1" style={{ color: theme.textSecondary }}>
                          {order.menu?.name} × {order.quantity}
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium"
                            style={statusColors[order.order_status]}>
                        {statusIcons[order.order_status]}
                        {order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1).replace('_', ' ')}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                      <div className="flex items-center gap-2" style={{ color: theme.textSecondary }}>
                        <User className="w-4 h-4" />
                        <span>{order.customer?.name || order.customer?.email || 'Customer'}</span>
                      </div>
                      <div className="flex items-center gap-2" style={{ color: theme.textSecondary }}>
                        <Phone className="w-4 h-4" />
                        <span>{order.customer?.phone || 'No phone'}</span>
                      </div>
                      <div className="flex items-center gap-2" style={{ color: theme.textSecondary }}>
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(order.delivery_date)}</span>
                      </div>
                      <div className="flex items-center gap-2" style={{ color: theme.textSecondary }}>
                        <Clock className="w-4 h-4" />
                        <span>{order.delivery_time_slot}</span>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-bold" style={{ color: theme.text }}>₹{order.total_amount}</span>
                        <span className="text-xs px-2 py-1 rounded"
                              style={{
                                backgroundColor: order.payment_status === 'paid' 
                                  ? `${theme.success}15` 
                                  : `${theme.warning}15`,
                                color: order.payment_status === 'paid' 
                                  ? theme.success 
                                  : theme.warning
                              }}>
                          {order.payment_method?.toUpperCase()} - {order.payment_status}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowOrderDetails(true);
                        }}
                        className="flex items-center gap-1 font-medium text-sm hover:opacity-80"
                        style={{ color: theme.primary }}
                      >
                        View Details
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t flex items-center justify-center gap-2"
               style={{ borderColor: theme.border }}>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 rounded transition-all"
              style={{
                backgroundColor: page === 1 ? theme.background : theme.primary,
                color: page === 1 ? theme.textSecondary : '#fff',
                cursor: page === 1 ? 'not-allowed' : 'pointer'
              }}
            >
              Previous
            </button>
            <span className="px-4 py-1 text-sm" style={{ color: theme.textSecondary }}>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 rounded transition-all"
              style={{
                backgroundColor: page === totalPages ? theme.background : theme.primary,
                color: page === totalPages ? theme.textSecondary : '#fff',
                cursor: page === totalPages ? 'not-allowed' : 'pointer'
              }}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
               style={{ backgroundColor: theme.panels }}>
            <div className="p-6 border-b" style={{ borderColor: theme.border }}>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold" style={{ color: theme.text }}>Order Details</h2>
                <button
                  onClick={() => setShowOrderDetails(false)}
                  className="hover:opacity-70"
                  style={{ color: theme.textSecondary }}
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold" style={{ color: theme.text }}>
                    Order #{selectedOrder._id}
                  </h3>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium"
                        style={statusColors[selectedOrder.order_status]}>
                    {statusIcons[selectedOrder.order_status]}
                    {selectedOrder.order_status.charAt(0).toUpperCase() + selectedOrder.order_status.slice(1).replace('_', ' ')}
                  </span>
                </div>
                <p className="text-sm" style={{ color: theme.textSecondary }}>
                  Placed on {formatDate(selectedOrder.createdAt)} at {formatTime(selectedOrder.createdAt)}
                </p>
              </div>

              <div className="space-y-6">
                {/* Customer Info */}
                <div>
                  <h4 className="font-medium mb-3" style={{ color: theme.text }}>Customer Information</h4>
                  <div className="rounded-lg p-4 space-y-2" style={{ backgroundColor: theme.background }}>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" style={{ color: theme.textSecondary }} />
                      <span style={{ color: theme.text }}>
                        {selectedOrder.customer?.name || selectedOrder.customer?.email || 'Customer'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" style={{ color: theme.textSecondary }} />
                      <span style={{ color: theme.text }}>{selectedOrder.customer?.phone || 'No phone'}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 mt-1" style={{ color: theme.textSecondary }} />
                      <span style={{ color: theme.text }}>{selectedOrder.delivery_address}</span>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h4 className="font-medium mb-3" style={{ color: theme.text }}>Order Items</h4>
                  <div className="rounded-lg p-4" style={{ backgroundColor: theme.background }}>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium" style={{ color: theme.text }}>{selectedOrder.menu?.name}</p>
                        <p className="text-sm" style={{ color: theme.textSecondary }}>Quantity: {selectedOrder.quantity}</p>
                      </div>
                      <p className="font-medium" style={{ color: theme.text }}>₹{selectedOrder.total_amount}</p>
                    </div>
                  </div>
                </div>

                {/* Delivery Info */}
                <div>
                  <h4 className="font-medium mb-3" style={{ color: theme.text }}>Delivery Information</h4>
                  <div className="rounded-lg p-4 space-y-2" style={{ backgroundColor: theme.background }}>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" style={{ color: theme.textSecondary }} />
                      <span style={{ color: theme.text }}>{formatDate(selectedOrder.delivery_date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" style={{ color: theme.textSecondary }} />
                      <span style={{ color: theme.text }}>{selectedOrder.delivery_time_slot}</span>
                    </div>
                  </div>
                </div>

                {/* Special Instructions */}
                {selectedOrder.special_instructions && (
                  <div>
                    <h4 className="font-medium mb-3" style={{ color: theme.text }}>Special Instructions</h4>
                    <div className="rounded-lg p-4" style={{ backgroundColor: `${theme.warning}10` }}>
                      <p style={{ color: theme.text }}>{selectedOrder.special_instructions}</p>
                    </div>
                  </div>
                )}

                {/* Payment Info */}
                <div>
                  <h4 className="font-medium mb-3" style={{ color: theme.text }}>Payment Information</h4>
                  <div className="rounded-lg p-4 space-y-2" style={{ backgroundColor: theme.background }}>
                    <div className="flex justify-between">
                      <span style={{ color: theme.textSecondary }}>Payment Method</span>
                      <span className="font-medium" style={{ color: theme.text }}>
                        {selectedOrder.payment_method?.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: theme.textSecondary }}>Payment Status</span>
                      <span className="font-medium"
                            style={{ color: selectedOrder.payment_status === 'paid' ? theme.success : theme.warning }}>
                        {selectedOrder.payment_status?.charAt(0).toUpperCase() + selectedOrder.payment_status?.slice(1)}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t" style={{ borderColor: theme.border }}>
                      <span className="font-medium" style={{ color: theme.text }}>Total Amount</span>
                      <span className="font-bold text-lg" style={{ color: theme.text }}>₹{selectedOrder.total_amount}</span>
                    </div>
                  </div>
                </div>

                {/* Update Status */}
                <div>
                  <h4 className="font-medium mb-3" style={{ color: theme.text }}>Update Order Status</h4>
                  <div className="flex flex-wrap gap-2">
                    {orderStatuses.map(status => (
                      <button
                        key={status}
                        onClick={() => updateOrderStatus(selectedOrder._id, status)}
                        disabled={selectedOrder.order_status === status || updatingStatus}
                        className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                        style={{
                          backgroundColor: selectedOrder.order_status === status
                            ? theme.background
                            : updatingStatus
                            ? theme.border
                            : theme.primary,
                          color: selectedOrder.order_status === status
                            ? theme.textSecondary
                            : updatingStatus
                            ? theme.textSecondary
                            : '#fff',
                          cursor: selectedOrder.order_status === status || updatingStatus ? 'not-allowed' : 'pointer'
                        }}
                      >
                        {updatingStatus && status !== selectedOrder.order_status ? 'Updating...' : 
                          status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;