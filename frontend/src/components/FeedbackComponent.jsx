// components/SimpleFeedback.jsx
import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';
import { FiStar, FiX } from 'react-icons/fi';

// Simple Feedback Form
export const FeedbackForm = ({ order, onClose }) => {
  const { theme } = useTheme();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/feedback/orders/${order._id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ rating, comment })
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success('Thank you for your feedback!');
        onClose();
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error('Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        className="max-w-md w-full p-6 rounded-xl"
        style={{ backgroundColor: theme.panels, borderColor: theme.border }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold" style={{ color: theme.text }}>
            Rate Your Order
          </h3>
          <button onClick={onClose} style={{ color: theme.textSecondary }}>
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Star Rating */}
          <div className="mb-4">
            <p className="text-sm mb-2" style={{ color: theme.textSecondary }}>
              How was your experience?
            </p>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="text-2xl"
                >
                  <FiStar
                    fill={star <= rating ? theme.warning : 'none'}
                    style={{ color: star <= rating ? theme.warning : theme.border }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div className="mb-4">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us more (optional)"
              rows={3}
              maxLength={500}
              className="w-full p-3 rounded-lg border"
              style={{
                backgroundColor: theme.background,
                borderColor: theme.border,
                color: theme.text
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg font-medium"
            style={{ backgroundColor: theme.primary, color: 'white' }}
          >
            {loading ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </form>
      </div>
    </div>
  );
};

// Simple Feedback Display
export const FeedbackDisplay = ({ feedback }) => {
  const { theme } = useTheme();

  return (
    <div 
      className="p-4 rounded-lg border mb-3"
      style={{ backgroundColor: theme.background, borderColor: theme.border }}
    >
      <div className="flex justify-between mb-2">
        <span className="font-medium" style={{ color: theme.text }}>
          {feedback.customer.first_name} {feedback.customer.last_name}
        </span>
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <FiStar
              key={i}
              size={14}
              fill={i < feedback.rating ? theme.warning : 'none'}
              style={{ color: i < feedback.rating ? theme.warning : theme.border }}
            />
          ))}
        </div>
      </div>
      {feedback.comment && (
        <p className="text-sm" style={{ color: theme.textSecondary }}>
          {feedback.comment}
        </p>
      )}
    </div>
  );
};

// Simple Vendor Feedback List
export const VendorFeedbackList = ({ vendorId }) => {
  const { theme } = useTheme();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/feedback/vendors/${vendorId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setFeedbacks(data.feedbacks);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [vendorId]);

  if (loading) return <div>Loading...</div>;

  const avgRating = feedbacks.length > 0 
    ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
    : 0;

  return (
    <div>
      <div className="mb-4 p-4 rounded-lg" style={{ backgroundColor: theme.panels }}>
        <h3 className="font-bold mb-2" style={{ color: theme.text }}>
          Customer Reviews
        </h3>
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold" style={{ color: theme.text }}>
            {avgRating}
          </span>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <FiStar
                key={i}
                size={16}
                fill={i < Math.round(avgRating) ? theme.warning : 'none'}
                style={{ color: i < Math.round(avgRating) ? theme.warning : theme.border }}
              />
            ))}
          </div>
          <span className="text-sm" style={{ color: theme.textSecondary }}>
            ({feedbacks.length} reviews)
          </span>
        </div>
      </div>

      <div>
        {feedbacks.map(feedback => (
          <FeedbackDisplay key={feedback._id} feedback={feedback} />
        ))}
      </div>
    </div>
  );
};