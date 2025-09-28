import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Package, 
  MapPin, 
  ChevronRight, 
  Search, 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  Truck, 
  ChefHat,
  DollarSign,
  Filter,
  ShoppingBag,
  Store,
  Phone,
  MessageSquare,
  ChevronDown
} from 'lucide-react';

const CustomerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [expandedOrder, setExpandedOrder] = useState(null);
  
  // Get API URL from environment variables
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Get auth headers for API requests
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token'); // Using 'token' for customer auth
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

      const response = await fetch(`${API_URL}/api/orders?${params}`, {
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch orders`);
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
      // Optionally show toast notification here
      // toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Cancel order function
  const cancelOrder = async (orderId) => {
    try {
      const response = await fetch(`${API_URL}/api/orders/${orderId}/cancel`, {
        method: 'PATCH',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to cancel order');
      }

      const data = await response.json();
      
      if (data.success) {
        // Refresh orders after cancellation
        fetchOrders();
        setShowOrderDetails(false);
        // toast.success('Order cancelled successfully');
      } else {
        throw new Error(data.error || 'Failed to cancel order');
      }
    } catch (err) {
      console.error('Error cancelling order:', err);
      // toast.error(err.message);
    }
  };

  // Fetch orders when component mounts or when filters change
  useEffect(() => {
    fetchOrders();
  }, [page, activeTab]);

  const statusColors = {
    placed: { bg: 'bg-yellow-50', text: 'text-yellow-600', border: 'border-yellow-200' },
    confirmed: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
    preparing: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
    out_for_delivery: { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200' },
    delivered: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200' },
    cancelled: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' }
  };

  const statusIcons = {
    placed: <AlertCircle size={16} />,
    confirmed: <CheckCircle size={16} />,
    preparing: <ChefHat size={16} />,
    out_for_delivery: <Truck size={16} />,
    delivered: <CheckCircle size={16} />,
    cancelled: <XCircle size={16} />
  };

  const orderSteps = [
    { status: 'placed', label: 'Order Placed', icon: ShoppingBag },
    { status: 'confirmed', label: 'Confirmed', icon: CheckCircle },
    { status: 'preparing', label: 'Preparing', icon: ChefHat },
    { status: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
    { status: 'delivered', label: 'Delivered', icon: Package }
  ];

  const getStatusIndex = (status) => {
    return orderSteps.findIndex(step => step.status === status);
  };

  const filteredOrders = orders.filter(order => {
    const matchesTab = activeTab === 'all' || order.order_status === activeTab;
    const matchesSearch = searchTerm === '' || 
      order.vendor?.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.menu?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order._id.includes(searchTerm);
    return matchesTab && matchesSearch;
  });

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getStatusCount = (status) => {
    return orders.filter(order => status === 'all' ? true : order.order_status === status).length;
  };

  // Calculate stats
  const activeOrders = orders.filter(o => 
    ['placed', 'confirmed', 'preparing', 'out_for_delivery'].includes(o.order_status)
  );
  const totalSpent = orders.filter(o => o.payment_status === 'paid')
    .reduce((sum, o) => sum + o.total_amount, 0);
  const completedOrders = orders.filter(o => o.order_status === 'delivered').length;

  if (loading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error && orders.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <p className="text-lg mb-4 text-red-600">{error}</p>
          <button 
            onClick={fetchOrders}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
        <p className="mt-2 text-gray-600">Track and manage your food orders</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Orders</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{activeOrders.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">₹{totalSpent}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{completedOrders}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <CheckCircle className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Status Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
              {['all', 'placed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'].map(status => (
                <button
                  key={status}
                  onClick={() => setActiveTab(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    activeTab === status 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')} 
                  ({getStatusCount(status)})
                </button>
              ))}
            </div>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="divide-y divide-gray-100">
          {filteredOrders.length === 0 ? (
            <div className="p-12 text-center">
              <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500 text-lg">No orders found</p>
              <p className="text-gray-400 text-sm mt-2">Start ordering delicious meals!</p>
            </div>
          ) : (
            filteredOrders.map(order => (
              <div key={order._id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    {/* Order Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-gray-900">
                            {order.menu?.name}
                          </h3>
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[order.order_status].bg} ${statusColors[order.order_status].text} ${statusColors[order.order_status].border} border`}>
                            {statusIcons[order.order_status]}
                            {order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1).replace('_', ' ')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Store className="w-4 h-4 text-gray-400" />
                          <p className="text-sm text-gray-600">{order.vendor?.business_name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">₹{order.total_amount}</p>
                        <p className="text-xs text-gray-500">{order.quantity} items</p>
                      </div>
                    </div>

                    {/* Order Info */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{formatDate(order.delivery_date)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>{order.delivery_time_slot}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="truncate">{order.delivery_address.split(',')[0]}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded ${
                          order.payment_status === 'paid' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {order.payment_method?.toUpperCase()} • {order.payment_status}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 mt-4">
                      <button
                        onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium text-sm"
                      >
                        Track Order
                        <ChevronDown className={`w-4 h-4 transition-transform ${expandedOrder === order._id ? 'rotate-180' : ''}`} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowOrderDetails(true);
                        }}
                        className="flex items-center gap-1 text-gray-600 hover:text-gray-700 font-medium text-sm"
                      >
                        View Details
                        <ChevronRight className="w-4 h-4" />
                      </button>
                      {order.order_status === 'delivered' && (
                        <button className="flex items-center gap-1 text-gray-600 hover:text-gray-700 font-medium text-sm">
                          Reorder
                        </button>
                      )}
                    </div>

                    {/* Order Tracking (Expandable) */}
                    {expandedOrder === order._id && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          {orderSteps.map((step, index) => {
                            const currentIndex = getStatusIndex(order.order_status);
                            const isActive = index <= currentIndex;
                            const Icon = step.icon;
                            
                            return (
                              <div key={step.status} className="flex-1 relative">
                                <div className="flex flex-col items-center">
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                    isActive ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'
                                  }`}>
                                    <Icon size={20} />
                                  </div>
                                  <p className={`text-xs mt-2 text-center ${
                                    isActive ? 'text-gray-900 font-medium' : 'text-gray-400'
                                  }`}>
                                    {step.label}
                                  </p>
                                </div>
                                {index < orderSteps.length - 1 && (
                                  <div className={`absolute top-5 left-1/2 w-full h-0.5 ${
                                    index < currentIndex ? 'bg-blue-600' : 'bg-gray-200'
                                  }`} style={{ transform: 'translateX(50%)' }} />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 flex items-center justify-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className={`px-4 py-2 rounded-lg transition-all ${
                page === 1 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Previous
            </button>
            <span className="px-4 py-2 text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className={`px-4 py-2 rounded-lg transition-all ${
                page === totalPages 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
                <button
                  onClick={() => setShowOrderDetails(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Order Status */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Order #{selectedOrder._id.slice(-8)}
                  </h3>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${statusColors[selectedOrder.order_status].bg} ${statusColors[selectedOrder.order_status].text}`}>
                    {statusIcons[selectedOrder.order_status]}
                    {selectedOrder.order_status.charAt(0).toUpperCase() + selectedOrder.order_status.slice(1).replace('_', ' ')}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Placed on {formatDate(selectedOrder.createdAt)} at {formatTime(selectedOrder.createdAt)}
                </p>
              </div>

              <div className="space-y-6">
                {/* Order Items */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Order Items</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">{selectedOrder.menu?.name}</p>
                        <p className="text-sm text-gray-600 mt-1">Quantity: {selectedOrder.quantity}</p>
                        <p className="text-sm text-gray-600">Price per item: ₹{selectedOrder.menu?.full_dabba_price}</p>
                      </div>
                      <p className="font-bold text-lg text-gray-900">₹{selectedOrder.total_amount}</p>
                    </div>
                  </div>
                </div>

                {/* Vendor Info */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Vendor Information</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <Store className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{selectedOrder.vendor?.business_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{selectedOrder.vendor?.phone_number}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                      <span className="text-gray-900">{selectedOrder.vendor?.address}</span>
                    </div>
                  </div>
                </div>

                {/* Delivery Info */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Delivery Information</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                      <span className="text-gray-900">{selectedOrder.delivery_address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{formatDate(selectedOrder.delivery_date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{selectedOrder.delivery_time_slot}</span>
                    </div>
                  </div>
                </div>

                {/* Special Instructions */}
                {selectedOrder.special_instructions && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Special Instructions</h4>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex gap-2">
                        <MessageSquare className="w-4 h-4 text-yellow-600 mt-0.5" />
                        <p className="text-gray-900">{selectedOrder.special_instructions}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Payment Info */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Payment Information</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Method</span>
                      <span className="font-medium text-gray-900">
                        {selectedOrder.payment_method?.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Status</span>
                      <span className={`font-medium ${
                        selectedOrder.payment_status === 'paid' ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {selectedOrder.payment_status?.charAt(0).toUpperCase() + selectedOrder.payment_status?.slice(1)}
                      </span>
                    </div>
                    <div className="flex justify-between pt-3 border-t border-gray-200">
                      <span className="font-medium text-gray-900">Total Amount</span>
                      <span className="font-bold text-xl text-gray-900">₹{selectedOrder.total_amount}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  {selectedOrder.order_status === 'delivered' && (
                    <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium">
                      Reorder
                    </button>
                  )}
                  {['placed', 'confirmed'].includes(selectedOrder.order_status) && (
                    <button 
                      onClick={() => {
                        if (window.confirm('Are you sure you want to cancel this order?')) {
                          cancelOrder(selectedOrder._id);
                        }
                      }}
                      className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 font-medium"
                    >
                      Cancel Order
                    </button>
                  )}
                  <button className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 font-medium">
                    Contact Support
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerOrders;