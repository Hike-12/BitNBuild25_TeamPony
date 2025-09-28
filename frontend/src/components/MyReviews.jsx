// components/user/MyReviews.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { format } from 'date-fns';
import {
  FiStar,
  FiClock,
  FiMessageCircle,
  FiPlus,
  FiPackage
} from 'react-icons/fi';
import { MdRestaurant } from 'react-icons/md';
import toast from 'react-hot-toast';
import { FeedbackForm } from './FeedbackComponent';

const MyReviews = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [reviews, setReviews] = useState([]);
  const [unreviewedOrders, setUnreviewedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [stats, setStats] = useState({
    totalReviews: 0,
    averageRating: 0,
    reviewsThisMonth: 0
  });

  useEffect(() => {
    fetchUserReviews();
    fetchUnreviewedOrders();
  }, []);

  const fetchUserReviews = async () => {
    try {
      const token = localStorage.getItem('userToken');
      console.log('Token being used:', token ? 'Token exists' : 'No token found');
      
      if (!token) {
        toast.error('Please login to view reviews');
        setLoading(false);
        return;
      }
      
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/feedback/user`,
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Feedback response status:', response.status);
      const data = await response.json();
      
      if (data.success) {
        setReviews(data.feedbacks || []);
        calculateStats(data.feedbacks || []);
      } else {
        console.error('Feedback error:', data.error);
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
      toast.error('Failed to load your reviews');
    }
  };

  const fetchUnreviewedOrders = async () => {
    try {
      const token = localStorage.getItem('userToken');
      console.log('Fetching orders...');
      
      // Fetch all user orders
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/orders`,
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Orders response:', data); // Debug log
      
      if (data.success) {
        console.log('Total orders received:', data.orders?.length || 0);
        
        // Get all delivered orders
        const deliveredOrders = (data.orders || []).filter(
          order => order.order_status === 'delivered'
        );
        console.log('Delivered orders:', deliveredOrders); // Debug log
        console.log('Delivered orders count:', deliveredOrders.length);
        
        // Filter orders that don't have reviews
        const reviewedOrderIds = reviews.map(r => r.order?._id);
        console.log('Already reviewed order IDs:', reviewedOrderIds);
        
        const unreviewed = deliveredOrders.filter(
          order => !reviewedOrderIds.includes(order._id)
        );
        console.log('Unreviewed orders:', unreviewed); // Debug log
        console.log('Unreviewed orders count:', unreviewed.length);
        setUnreviewedOrders(unreviewed);
      } else {
        console.error('API returned success: false', data.error);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (feedbacks) => {
    const total = feedbacks.length;
    if (total === 0) {
      setStats({ totalReviews: 0, averageRating: 0, reviewsThisMonth: 0 });
      return;
    }

    const sum = feedbacks.reduce((acc, fb) => acc + fb.rating, 0);
    const avg = (sum / total).toFixed(1);
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const thisMonthReviews = feedbacks.filter(fb => {
      const reviewDate = new Date(fb.createdAt);
      return reviewDate.getMonth() === currentMonth && reviewDate.getFullYear() === currentYear;
    }).length;

    setStats({
      totalReviews: total,
      averageRating: avg,
      reviewsThisMonth: thisMonthReviews
    });
  };

  const handleReviewSubmit = () => {
    setShowFeedbackForm(false);
    setSelectedOrder(null);
    fetchUserReviews();
    fetchUnreviewedOrders();
  };

  const StarRating = ({ rating, size = 16 }) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <FiStar
            key={star}
            size={size}
            fill={star <= rating ? theme.warning : 'none'}
            style={{ color: star <= rating ? theme.warning : theme.border }}
          />
        ))}
      </div>
    );
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return theme.success;
    if (rating >= 3) return theme.warning;
    return theme.error;
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: theme.primary }}></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: theme.text }}>
          My Reviews
        </h2>
        <p style={{ color: theme.textSecondary }}>
          View and manage all your feedback for past orders
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 rounded-xl border" style={{ backgroundColor: theme.panels, borderColor: theme.border }}>
          <FiStar size={24} style={{ color: theme.warning }} className="mb-2" />
          <div className="text-2xl font-bold" style={{ color: theme.text }}>{stats.totalReviews}</div>
          <p className="text-sm" style={{ color: theme.textSecondary }}>Total Reviews</p>
        </div>
        <div className="p-6 rounded-xl border" style={{ backgroundColor: theme.panels, borderColor: theme.border }}>
          <FiStar size={24} fill={theme.warning} style={{ color: theme.warning }} className="mb-2" />
          <div className="text-2xl font-bold" style={{ color: theme.text }}>{stats.averageRating}</div>
          <p className="text-sm" style={{ color: theme.textSecondary }}>Average Rating</p>
        </div>
        <div className="p-6 rounded-xl border" style={{ backgroundColor: theme.panels, borderColor: theme.border }}>
          <FiClock size={24} style={{ color: theme.secondary }} className="mb-2" />
          <div className="text-2xl font-bold" style={{ color: theme.text }}>{stats.reviewsThisMonth}</div>
          <p className="text-sm" style={{ color: theme.textSecondary }}>This Month</p>
        </div>
      </div>

      {/* Temporary Debug Section - Remove after testing */}
      {loading === false && (
        <div className="p-4 rounded-xl border mb-4" style={{ backgroundColor: theme.warning + '20', borderColor: theme.warning }}>
          <h4 className="font-semibold mb-2" style={{ color: theme.text }}>Debug Info:</h4>
          <p style={{ color: theme.text }}>Total unreviewed orders: {unreviewedOrders.length}</p>
          <p style={{ color: theme.text }}>Total reviews: {reviews.length}</p>
        </div>
      )}

      {/* Unreviewed Orders Section */}
      {unreviewedOrders.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4" style={{ color: theme.text }}>
            Orders to Review
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {unreviewedOrders.map((order) => (
              <div 
                key={order._id}
                className="p-4 rounded-xl border transition-all duration-200 hover:shadow-lg"
                style={{ 
                  backgroundColor: theme.panels, 
                  borderColor: theme.border 
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${theme.primary}20` }}>
                      <FiPackage size={20} style={{ color: theme.primary }} />
                    </div>
                    <div>
                      <h4 className="font-semibold" style={{ color: theme.text }}>
                        {order.menu?.name || 'Menu Item'}
                      </h4>
                      <p className="text-sm" style={{ color: theme.textSecondary }}>
                        {order.vendor?.business_name || 'Vendor'}
                      </p>
                      <p className="text-xs mt-1" style={{ color: theme.textSecondary }}>
                        Delivered on {format(new Date(order.delivery_date), 'dd MMM yyyy')}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold" style={{ color: theme.success }}>
                    ₹{order.total_amount}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setSelectedOrder(order);
                    setShowFeedbackForm(true);
                  }}
                  className="w-full mt-3 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 flex items-center justify-center space-x-2"
                  style={{ 
                    backgroundColor: theme.primary, 
                    color: 'white' 
                  }}
                >
                  <FiPlus size={16} />
                  <span>Add Review</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div>
        <h3 className="text-lg font-semibold mb-4" style={{ color: theme.text }}>
          Your Reviews
        </h3>
        
        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div 
                key={review._id}
                className="p-6 rounded-xl border transition-all duration-200 hover:shadow-lg"
                style={{ 
                  backgroundColor: theme.panels, 
                  borderColor: theme.border 
                }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${theme.primary}20` }}>
                      <MdRestaurant size={24} style={{ color: theme.primary }} />
                    </div>
                    <div>
                      <h4 className="font-semibold" style={{ color: theme.text }}>
                        {review.vendor?.business_name || 'Vendor'}
                      </h4>
                      <p className="text-sm" style={{ color: theme.textSecondary }}>
                        {review.menu?.name || 'Menu Item'}
                      </p>
                      <p className="text-xs flex items-center mt-1" style={{ color: theme.textSecondary }}>
                        <FiClock size={12} className="mr-1" />
                        {format(new Date(review.createdAt), 'dd MMM yyyy, hh:mm a')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="inline-flex items-center px-3 py-1 rounded-lg font-semibold"
                      style={{
                        backgroundColor: `${getRatingColor(review.rating)}20`,
                        color: getRatingColor(review.rating)
                      }}>
                      <FiStar size={14} className="mr-1" fill={getRatingColor(review.rating)} />
                      {review.rating}.0
                    </div>
                    <div className="mt-2">
                      <StarRating rating={review.rating} />
                    </div>
                  </div>
                </div>

                {review.comment && (
                  <div className="p-4 rounded-lg mb-4"
                    style={{ backgroundColor: theme.background }}>
                    <p style={{ color: theme.text }}>"{review.comment}"</p>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm pt-4 border-t" 
                  style={{ borderColor: theme.border }}>
                  <span style={{ color: theme.textSecondary }}>
                    Order #{review.order?._id?.slice(-8) || 'N/A'}
                  </span>
                  {review.vendor_response && (
                    <div className="flex items-center text-xs" style={{ color: theme.primary }}>
                      <FiMessageCircle size={12} className="mr-1" />
                      Vendor replied
                    </div>
                  )}
                </div>

                {review.vendor_response && (
                  <div className="mt-4 p-4 rounded-lg border-l-4"
                    style={{
                      backgroundColor: `${theme.primary}10`,
                      borderColor: theme.primary
                    }}>
                    <p className="text-sm font-medium mb-1" style={{ color: theme.primary }}>
                      Vendor Response
                    </p>
                    <p className="text-sm" style={{ color: theme.text }}>
                      {review.vendor_response}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 rounded-xl border"
            style={{ backgroundColor: theme.panels, borderColor: theme.border }}>
            <FiStar size={48} style={{ color: theme.textSecondary }} className="mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2" style={{ color: theme.text }}>
              No Reviews Yet
            </h3>
            <p style={{ color: theme.textSecondary }}>
              {unreviewedOrders.length > 0 
                ? 'Start by reviewing your delivered orders above!'
                : 'Order some delicious food and share your experience!'}
            </p>
          </div>
        )}
      </div>

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

export default MyReviews;