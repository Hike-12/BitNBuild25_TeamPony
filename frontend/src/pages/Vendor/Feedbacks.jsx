// components/vendor/Feedbacks.jsx - Fixed version
import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { FiStar, FiMessageCircle } from 'react-icons/fi';
import { format } from 'date-fns';

const VendorFeedbacks = () => {
  const { theme } = useTheme();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalReviews: 0,
    averageRating: 0,
    ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  });

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      // HARDCODE THE VENDOR ID FOR NOW
      const vendorId = '68d81ff8feb96e5b5c4df344'; // Arshdeep's Kitchen
      
      console.log('Fetching feedbacks for vendor:', vendorId);
      
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/feedback/vendors/${vendorId}`,
        {
          headers: { 
            'Content-Type': 'application/json'
          }
        }
      );
      
      const data = await response.json();
      console.log('Vendor feedbacks response:', data);
      
      if (data.success) {
        setFeedbacks(data.feedbacks);
        calculateStats(data.feedbacks);
      }
    } catch (error) {
      console.error('Failed to fetch feedbacks:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (feedbacks) => {
    const total = feedbacks.length;
    if (total === 0) {
      setStats({ totalReviews: 0, averageRating: 0, ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } });
      return;
    }

    const sum = feedbacks.reduce((acc, fb) => acc + fb.rating, 0);
    const avg = (sum / total).toFixed(1);
    
    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    feedbacks.forEach(fb => {
      breakdown[fb.rating]++;
    });

    setStats({
      totalReviews: total,
      averageRating: avg,
      ratingBreakdown: breakdown
    });
  };

  const StarRating = ({ rating }) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <FiStar
            key={star}
            size={14}
            fill={star <= rating ? theme.warning : 'none'}
            style={{ color: star <= rating ? theme.warning : theme.border }}
          />
        ))}
      </div>
    );
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
          Customer Reviews
        </h2>
        <p style={{ color: theme.textSecondary }}>
          See what your customers are saying about your food
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Average Rating Card */}
        <div className="p-6 rounded-xl border" style={{ backgroundColor: theme.panels, borderColor: theme.border }}>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2" style={{ color: theme.text }}>
              {stats.averageRating}
            </div>
            <div className="flex justify-center mb-2">
              <StarRating rating={Math.round(stats.averageRating)} />
            </div>
            <p className="text-sm" style={{ color: theme.textSecondary }}>
              {stats.totalReviews} reviews
            </p>
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="md:col-span-2 p-6 rounded-xl border" style={{ backgroundColor: theme.panels, borderColor: theme.border }}>
          <h3 className="font-semibold mb-4" style={{ color: theme.text }}>Rating Distribution</h3>
          {[5, 4, 3, 2, 1].map(rating => {
            const count = stats.ratingBreakdown[rating];
            const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
            
            return (
              <div key={rating} className="flex items-center mb-2">
                <span className="text-sm w-8" style={{ color: theme.textSecondary }}>
                  {rating}★
                </span>
                <div className="flex-1 mx-3 h-4 rounded-full overflow-hidden" style={{ backgroundColor: theme.background }}>
                  <div 
                    className="h-full transition-all duration-500"
                    style={{ 
                      width: `${percentage}%`,
                      backgroundColor: theme.primary
                    }}
                  />
                </div>
                <span className="text-sm w-12 text-right" style={{ color: theme.textSecondary }}>
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reviews List */}
      <div>
        <h3 className="text-lg font-semibold mb-4" style={{ color: theme.text }}>
          All Reviews
        </h3>
        <div className="space-y-4">
          {feedbacks.length > 0 ? (
            feedbacks.map((feedback) => (
              <div 
                key={feedback._id}
                className="p-6 rounded-xl border"
                style={{ backgroundColor: theme.panels, borderColor: theme.border }}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold" style={{ color: theme.text }}>
                      {feedback.customer?.first_name || 'arshdeep'} {feedback.customer?.last_name || ''}
                    </h4>
                    <p className="text-sm" style={{ color: theme.textSecondary }}>
                      {format(new Date(feedback.createdAt), 'dd MMM yyyy')}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <StarRating rating={feedback.rating} />
                    <span className="font-semibold" style={{ color: theme.text }}>
                      {feedback.rating}.0
                    </span>
                  </div>
                </div>
                
                {feedback.comment && (
                  <p style={{ color: theme.text }}>
                    {feedback.comment}
                  </p>
                )}
              </div>
            ))
          ) : (
            <div 
              className="text-center py-12 rounded-xl border"
              style={{ backgroundColor: theme.panels, borderColor: theme.border }}
            >
              <FiMessageCircle size={48} style={{ color: theme.textSecondary }} className="mx-auto mb-4" />
              <p style={{ color: theme.textSecondary }}>
                No reviews yet. Keep serving great food!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorFeedbacks;