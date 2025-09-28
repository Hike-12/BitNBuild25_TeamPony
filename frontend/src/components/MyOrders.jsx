// components/user/MyOrders.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { format } from 'date-fns';
import {
  FiPackage,
  FiClock,
  FiCheck,
  FiX,
  FiTruck,
  FiStar,
  FiMapPin,
  FiDollarSign,
  FiCalendar,
  FiRefreshCw
} from 'react-icons/fi';
import { MdRestaurant } from 'react-icons/md';
import toast from 'react-hot-toast';
import { FeedbackForm } from './FeedbackComponent';

const MyOrders = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, active, delivered, cancelled
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_orders: 0
  });

  useEffect(() => {
    fetchOrders();
    fetchUserFeedbacks();
  }, [filter, page]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('userToken');
      const queryParams = new URLSearchParams({
        page,
        limit: 10,
        ...(filter !== 'all' && { status: filter })
      }).toString();
      
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/orders?${queryParams}`,
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      const data = await response.json();
      
      if (data.success) {
        setOrders(data.orders || []);
        setPagination(data.pagination);
      } else {
        toast.error('Failed to load orders');
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserFeedbacks = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/feedback/user`,
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      const data = await response.json();
      if (data.success) {
        setFeedbacks(data.feedbacks || []);
      }
    } catch (error) {
      console.error('Failed to fetch feedbacks:', error);
    }
  };

  const getStatusColor = (status) => {
    const statusColors = {
      'placed': theme.info,
      'confirmed': theme.primary,
      'preparing': theme.warning,
      'out_for_delivery': theme.secondary,
      'delivered': theme.success,
      'cancelled': theme.error
    };
    return statusColors[status] || theme.textSecondary;
  };

  const getStatusIcon = (status) => {
    const icons = {
      'placed': <FiClock />,
      'confirmed': <FiCheck />,
      'preparing': <FiClock />,
      'out_for_delivery': <FiTruck />,
      'delivered': <FiCheck />,
      'cancelled': <FiX />
    };
    return icons[status] || <FiClock />;
  };

  const hasReviewed = (orderId) => {
    return feedbacks.some(feedback => feedback.order?._id === orderId);
  };

  const handleReviewSubmit = () => {
    setShowFeedbackForm(false);
    setSelectedOrder(null);
    fetchUserFeedbacks();
  };

  const filterTabs = [
    { id: 'all', label: 'All Orders', count: pagination.total_orders },
    { id: 'delivered', label: 'Delivered' },
    { id: 'out_for_delivery', label: 'In Transit' },
    { id: 'preparing', label: 'Preparing' },
    { id: 'cancelled', label: 'Cancelled' }
  ];

  if (loading && orders.length === 0) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: theme.primary }}></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: theme.text }}>
            My Orders
          </h2>
          <p style={{ color: theme.textSecondary }}>
            Track and manage your food orders
          </p>
        </div>
        <button
          onClick={fetchOrders}
          disabled={loading}
          className="p-2 rounded-lg hover:opacity-80 transition-opacity"
          style={{ 
            backgroundColor: theme.panels,
            color: theme.textSecondary 
          }}
        >
          <FiRefreshCw size={20} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {filterTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              setFilter(tab.id);
              setPage(1);
            }}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all duration-200 ${
              filter === tab.id ? 'scale-105' : 'hover:scale-102'
            }`}
            style={{
              backgroundColor: filter === tab.id ? theme.primary : theme.panels,
              color: filter === tab.id ? 'white' : theme.textSecondary,
              borderColor: theme.border
            }}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className="ml-2 px-2 py-0.5 rounded-full text-xs"
                style={{
                  backgroundColor: filter === tab.id ? 'rgba(255,255,255,0.2)' : `${theme.primary}20`,
                  color: filter === tab.id ? 'white' : theme.primary
                }}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div 
              key={order._id}
              className="p-6 rounded-xl border transition-all duration-200 hover:shadow-lg"
              style={{ 
                backgroundColor: theme.panels, 
                borderColor: theme.border 
              }}
            >
              {/* Order Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-start space-x-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${theme.primary}20` }}
                  >
                    <MdRestaurant size={24} style={{ color: theme.primary }} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold" style={{ color: theme.text }}>
                      {order.menu?.name || 'Menu Item'}
                    </h3>
                    <p className="text-sm" style={{ color: theme.textSecondary }}>
                      {order.vendor?.business_name || 'Vendor'}
                    </p>
                    <p className="text-xs mt-1" style={{ color: theme.textSecondary }}>
                      Order #{order._id.slice(-8)}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div 
                    className="inline-flex items-center px-3 py-1 rounded-lg font-medium mb-2"
                    style={{
                      backgroundColor: `${getStatusColor(order.order_status)}20`,
                      color: getStatusColor(order.order_status)
                    }}
                  >
                    {getStatusIcon(order.order_status)}
                    <span className="ml-2 capitalize">
                      {order.order_status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-2xl font-bold" style={{ color: theme.success }}>
                    ₹{order.total_amount}
                  </p>
                </div>
              </div>

              {/* Order Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <FiPackage size={16} style={{ color: theme.textSecondary }} className="mr-2" />
                    <span style={{ color: theme.textSecondary }}>Quantity:</span>
                    <span className="ml-2 font-medium" style={{ color: theme.text }}>
                      {order.quantity} dabba(s)
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <FiCalendar size={16} style={{ color: theme.textSecondary }} className="mr-2" />
                    <span style={{ color: theme.textSecondary }}>Delivery Date:</span>
                    <span className="ml-2 font-medium" style={{ color: theme.text }}>
                      {format(new Date(order.delivery_date), 'dd MMM yyyy')}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <FiClock size={16} style={{ color: theme.textSecondary }} className="mr-2" />
                    <span style={{ color: theme.textSecondary }}>Time Slot:</span>
                    <span className="ml-2 font-medium" style={{ color: theme.text }}>
                      {order.delivery_time_slot}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-start text-sm">
                    <FiMapPin size={16} style={{ color: theme.textSecondary }} className="mr-2 mt-0.5" />
                    <div>
                      <span style={{ color: theme.textSecondary }}>Delivery Address:</span>
                      <p className="font-medium" style={{ color: theme.text }}>
                        {order.delivery_address}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center text-sm">
                    <FiDollarSign size={16} style={{ color: theme.textSecondary }} className="mr-2" />
                    <span style={{ color: theme.textSecondary }}>Payment:</span>
                    <span className="ml-2 font-medium capitalize" style={{ color: theme.text }}>
                      {order.payment_method} ({order.payment_status})
                    </span>
                  </div>
                </div>
              </div>

              {/* Special Instructions */}
              {order.special_instructions && (
                <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: theme.background }}>
                  <p className="text-sm">
                    <span style={{ color: theme.textSecondary }}>Special Instructions: </span>
                    <span style={{ color: theme.text }}>{order.special_instructions}</span>
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-4 border-t" style={{ borderColor: theme.border }}>
                <p className="text-sm" style={{ color: theme.textSecondary }}>
                  Ordered on {format(new Date(order.createdAt), 'dd MMM yyyy, hh:mm a')}
                </p>
                
                {order.order_status === 'delivered' && !hasReviewed(order._id) && (
                  <button
                    onClick={() => {
                      setSelectedOrder(order);
                      setShowFeedbackForm(true);
                    }}
                    className="px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 flex items-center space-x-2"
                    style={{ 
                      backgroundColor: theme.primary, 
                      color: 'white' 
                    }}
                  >
                    <FiStar size={16} />
                    <span>Rate & Review</span>
                  </button>
                )}
                
                {hasReviewed(order._id) && (
                  <div className="flex items-center text-sm" style={{ color: theme.success }}>
                    <FiCheck size={16} className="mr-1" />
                    Reviewed
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div 
            className="text-center py-12 rounded-xl border"
            style={{ backgroundColor: theme.panels, borderColor: theme.border }}
          >
            <FiPackage size={48} style={{ color: theme.textSecondary }} className="mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2" style={{ color: theme.text }}>
              No orders found
            </h3>
            <p style={{ color: theme.textSecondary }}>
              {filter === 'all' 
                ? "You haven't placed any orders yet" 
                : `No ${filter.replace('_', ' ')} orders`}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.total_pages > 1 && (
        <div className="flex items-center justify-center space-x-4 mt-6">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50"
            style={{
              backgroundColor: theme.panels,
              color: theme.text,
              borderColor: theme.border
            }}
          >
            Previous
          </button>
          
          <span style={{ color: theme.textSecondary }}>
            Page {pagination.current_page} of {pagination.total_pages}
          </span>
          
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === pagination.total_pages}
            className="px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50"
            style={{
              backgroundColor: theme.panels,
              color: theme.text,
              borderColor: theme.border
            }}
          >
            Next
          </button>
        </div>
      )}

      {/* Feedback Form Modal */}
      {showFeedbackForm && selectedOrder && (
        <FeedbackForm
          order={selectedOrder}
          onClose={() => {
            setShowFeedbackForm(false);
            setSelectedOrder(null);
          }}
          onSuccess={handleReviewSubmit}
        />
      )}
    </div>
  );
};

export default MyOrders;