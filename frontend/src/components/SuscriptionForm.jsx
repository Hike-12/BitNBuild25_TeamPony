import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';
import {
  FiMapPin,
  FiClock,
  FiCalendar,
  FiRefreshCw,
  FiX,
  FiCheck,
  FiUser,
  FiMail
} from 'react-icons/fi';
import { FaLeaf } from 'react-icons/fa';

const SubscriptionForm = ({ vendor, menus = [], onClose, onSuccess }) => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  
  // Calculate average price from vendor's menus
  const averagePrice = menus.length > 0 
    ? Math.round(menus.reduce((sum, menu) => sum + menu.full_dabba_price, 0) / menus.length)
    : 250;

  const [subscriptionData, setSubscriptionData] = useState({
    plan_type: 'weekly',
    meal_preferences: {
      is_veg_only: false,
      spice_level: 'medium',
      avoid_ingredients: []
    },
    delivery_address: '',
    delivery_time_slot: '12:00-13:00',
    delivery_days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    start_date: '',
    end_date: '',
    price_per_meal: averagePrice,
    special_instructions: ''
  });

  const planTypes = [
    { value: 'weekly', label: 'Weekly Plan', description: '7 days subscription', days: 7 },
    { value: 'monthly', label: 'Monthly Plan', description: '30 days subscription', days: 30 },
    { value: 'custom', label: 'Custom Plan', description: 'Choose your own duration', days: 0 }
  ];

  const timeSlots = [
    { value: '12:00-13:00', label: '12:00 PM - 1:00 PM (Lunch)' },
    { value: '13:00-14:00', label: '1:00 PM - 2:00 PM (Lunch)' },
    { value: '19:00-20:00', label: '7:00 PM - 8:00 PM (Dinner)' },
    { value: '20:00-21:00', label: '8:00 PM - 9:00 PM (Dinner)' }
  ];

  const weekDays = [
    { value: 'monday', label: 'Monday' },
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' },
    { value: 'thursday', label: 'Thursday' },
    { value: 'friday', label: 'Friday' },
    { value: 'saturday', label: 'Saturday' },
    { value: 'sunday', label: 'Sunday' }
  ];

  const spiceLevels = [
    { value: 'low', label: 'Mild', description: 'Low spice level' },
    { value: 'medium', label: 'Medium', description: 'Moderate spice level' },
    { value: 'high', label: 'Hot', description: 'High spice level' }
  ];

  // Auto-populate dates based on plan type
  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    
    const selectedPlan = planTypes.find(plan => plan.value === subscriptionData.plan_type);
    
    if (selectedPlan && selectedPlan.days > 0) {
      const endDate = new Date();
      endDate.setDate(today.getDate() + selectedPlan.days);
      
      setSubscriptionData(prev => ({
        ...prev,
        start_date: tomorrow.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0]
      }));
    } else {
      // For custom plan, just set start date
      setSubscriptionData(prev => ({
        ...prev,
        start_date: tomorrow.toISOString().split('T')[0]
      }));
    }
  }, [subscriptionData.plan_type]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('meal_preferences.')) {
      const field = name.split('.')[1];
      setSubscriptionData(prev => ({
        ...prev,
        meal_preferences: {
          ...prev.meal_preferences,
          [field]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setSubscriptionData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleDayToggle = (day) => {
    setSubscriptionData(prev => ({
      ...prev,
      delivery_days: prev.delivery_days.includes(day)
        ? prev.delivery_days.filter(d => d !== day)
        : [...prev.delivery_days, day]
    }));
  };

  const calculateTotalMeals = () => {
    if (!subscriptionData.start_date || !subscriptionData.end_date || subscriptionData.delivery_days.length === 0) {
      return 0;
    }
    
    const startDate = new Date(subscriptionData.start_date);
    const endDate = new Date(subscriptionData.end_date);
    const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    const weeksCount = Math.ceil(daysDiff / 7);
    
    return subscriptionData.delivery_days.length * weeksCount;
  };

  const calculateTotalAmount = () => {
    return calculateTotalMeals() * subscriptionData.price_per_meal;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!subscriptionData.delivery_address || !subscriptionData.delivery_time_slot || 
        !subscriptionData.delivery_days.length || !subscriptionData.start_date || 
        !subscriptionData.end_date) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (subscriptionData.delivery_days.length === 0) {
      toast.error('Please select at least one delivery day');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/subscriptions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          vendor_id: vendor._id,
          ...subscriptionData,
          total_meals: calculateTotalMeals(),
          total_amount: calculateTotalAmount()
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Subscription created successfully! 🎉');
        onSuccess && onSuccess(data.subscription);
        onClose();
      } else {
        toast.error(data.error || 'Failed to create subscription');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        className="w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-2xl border"
        style={{
          backgroundColor: theme.panels,
          borderColor: theme.border
        }}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b" style={{ borderColor: theme.border }}>
          <div>
            <h2 className="text-2xl font-bold" style={{ color: theme.text }}>
              Create Subscription
            </h2>
            <p className="text-sm mt-1" style={{ color: theme.textSecondary }}>
              Subscribe to {vendor.business_name} for regular meal delivery
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:opacity-80 transition-opacity"
            style={{ backgroundColor: theme.background, color: theme.textSecondary }}
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6">
          {/* Left Column - Vendor & Menu Info */}
          <div className="space-y-6">
            {/* Vendor Info */}
            <div className="p-6 rounded-xl border" style={{ backgroundColor: theme.background, borderColor: theme.border }}>
              <h3 className="text-lg font-bold mb-4" style={{ color: theme.text }}>
                Vendor Information
              </h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold" style={{ color: theme.text }}>{vendor.business_name}</h4>
                  <p className="text-sm" style={{ color: theme.textSecondary }}>{vendor.address}</p>
                </div>
                <div className="text-sm" style={{ color: theme.textSecondary }}>
                  📞 {vendor.phone_number}
                </div>
              </div>
            </div>

            {/* Available Menus Preview */}
            {menus.length > 0 && (
              <div className="p-6 rounded-xl border" style={{ backgroundColor: theme.background, borderColor: theme.border }}>
                <h3 className="text-lg font-bold mb-4" style={{ color: theme.text }}>
                  Sample Menus
                </h3>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {menus.slice(0, 3).map((menu, idx) => (
                    <div key={idx} className="p-3 rounded-lg border" style={{ borderColor: theme.border }}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-medium" style={{ color: theme.text }}>{menu.name}</h5>
                          <div className="flex items-center mt-1">
                            {menu.is_veg_only && <FaLeaf className="text-green-500 mr-1" size={12} />}
                            <span className="text-xs" style={{ color: theme.textSecondary }}>
                              {menu.cooking_style}
                            </span>
                          </div>
                        </div>
                        <span className="font-bold" style={{ color: theme.success }}>
                          ₹{menu.full_dabba_price}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* User Info */}
            <div className="p-4 rounded-xl border" style={{ backgroundColor: theme.background, borderColor: theme.border }}>
              <h4 className="font-medium mb-3 flex items-center" style={{ color: theme.text }}>
                <FiUser className="mr-2" />
                Customer Information
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center" style={{ color: theme.textSecondary }}>
                  <FiUser className="mr-2" size={14} />
                  <span>{user?.first_name} {user?.last_name}</span>
                </div>
                <div className="flex items-center" style={{ color: theme.textSecondary }}>
                  <FiMail className="mr-2" size={14} />
                  <span>{user?.email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Column - Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Plan Type */}
            <div>
              <label className="block text-sm font-medium mb-3" style={{ color: theme.textSecondary }}>
                Subscription Plan *
              </label>
              <div className="grid grid-cols-1 gap-3">
                {planTypes.map(plan => (
                  <label
                    key={plan.value}
                    className="p-4 border rounded-lg cursor-pointer hover:opacity-80 transition-all duration-300"
                    style={{
                      backgroundColor: subscriptionData.plan_type === plan.value ? `${theme.primary}20` : theme.background,
                      borderColor: subscriptionData.plan_type === plan.value ? theme.primary : theme.border
                    }}
                  >
                    <input
                      type="radio"
                      name="plan_type"
                      value={plan.value}
                      checked={subscriptionData.plan_type === plan.value}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div>
                      <div className="font-medium" style={{ color: theme.text }}>
                        {plan.label}
                      </div>
                      <div className="text-xs mt-1" style={{ color: theme.textSecondary }}>
                        {plan.description}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Meal Preferences */}
            <div>
              <h3 className="text-lg font-semibold mb-4" style={{ color: theme.text }}>
                Meal Preferences
              </h3>
              
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="meal_preferences.is_veg_only"
                      checked={subscriptionData.meal_preferences.is_veg_only}
                      onChange={handleInputChange}
                      className="rounded"
                    />
                    <span style={{ color: theme.text }}>Vegetarian Only</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: theme.textSecondary }}>
                    Spice Level
                  </label>
                  <select
                    name="meal_preferences.spice_level"
                    value={subscriptionData.meal_preferences.spice_level}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2"
                    style={{
                      backgroundColor: theme.background,
                      borderColor: theme.border,
                      color: theme.text
                    }}
                  >
                    {spiceLevels.map(level => (
                      <option key={level.value} value={level.value}>
                        {level.label} - {level.description}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Delivery Details */}
            <div>
              <h3 className="text-lg font-semibold mb-4" style={{ color: theme.text }}>
                Delivery Details
              </h3>
              
              {/* Delivery Address */}
              <div className="mb-4">
                <label className="flex items-center space-x-2 text-sm font-medium mb-2" style={{ color: theme.textSecondary }}>
                  <FiMapPin size={16} />
                  <span>Delivery Address *</span>
                </label>
                <textarea
                  name="delivery_address"
                  value={subscriptionData.delivery_address}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full border rounded-lg px-3 py-2"
                  style={{
                    backgroundColor: theme.background,
                    borderColor: theme.border,
                    color: theme.text
                  }}
                  placeholder="Enter your complete delivery address..."
                  required
                />
              </div>

              {/* Time Slot */}
              <div className="mb-4">
                <label className="flex items-center space-x-2 text-sm font-medium mb-2" style={{ color: theme.textSecondary }}>
                  <FiClock size={16} />
                  <span>Preferred Time Slot *</span>
                </label>
                <select
                  name="delivery_time_slot"
                  value={subscriptionData.delivery_time_slot}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-3 py-2"
                  style={{
                    backgroundColor: theme.background,
                    borderColor: theme.border,
                    color: theme.text
                  }}
                  required
                >
                  {timeSlots.map(slot => (
                    <option key={slot.value} value={slot.value}>
                      {slot.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Delivery Days */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" style={{ color: theme.textSecondary }}>
                  Delivery Days * ({subscriptionData.delivery_days.length} selected)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {weekDays.map(day => (
                    <label
                      key={day.value}
                      className="flex items-center space-x-2 p-2 border rounded-lg cursor-pointer hover:opacity-80"
                      style={{
                        backgroundColor: subscriptionData.delivery_days.includes(day.value) ? `${theme.primary}20` : theme.background,
                        borderColor: subscriptionData.delivery_days.includes(day.value) ? theme.primary : theme.border
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={subscriptionData.delivery_days.includes(day.value)}
                        onChange={() => handleDayToggle(day.value)}
                        className="sr-only"
                      />
                      <span className="text-sm" style={{ color: theme.text }}>
                        {day.label}
                      </span>
                      {subscriptionData.delivery_days.includes(day.value) && (
                        <FiCheck size={16} style={{ color: theme.primary }} />
                      )}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Duration */}
            <div>
              <h3 className="text-lg font-semibold mb-4" style={{ color: theme.text }}>
                Subscription Duration
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium mb-2" style={{ color: theme.textSecondary }}>
                    <FiCalendar size={16} />
                    <span>Start Date *</span>
                  </label>
                  <input
                    type="date"
                    name="start_date"
                    value={subscriptionData.start_date}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full border rounded-lg px-3 py-2"
                    style={{
                      backgroundColor: theme.background,
                      borderColor: theme.border,
                      color: theme.text
                    }}
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium mb-2" style={{ color: theme.textSecondary }}>
                    <FiCalendar size={16} />
                    <span>End Date *</span>
                  </label>
                  <input
                    type="date"
                    name="end_date"
                    value={subscriptionData.end_date}
                    onChange={handleInputChange}
                    min={subscriptionData.start_date || new Date().toISOString().split('T')[0]}
                    className="w-full border rounded-lg px-3 py-2"
                    style={{
                      backgroundColor: theme.background,
                      borderColor: theme.border,
                      color: theme.text
                    }}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Special Instructions */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: theme.textSecondary }}>
                Special Instructions (Optional)
              </label>
              <textarea
                name="special_instructions"
                value={subscriptionData.special_instructions}
                onChange={handleInputChange}
                rows={2}
                className="w-full border rounded-lg px-3 py-2"
                style={{
                  backgroundColor: theme.background,
                  borderColor: theme.border,
                  color: theme.text
                }}
                placeholder="Any special dietary requirements or preferences..."
              />
            </div>
          </form>

          {/* Right Column - Summary */}
          <div className="space-y-6">
            {/* Pricing Info */}
            <div className="p-6 rounded-xl border" style={{ backgroundColor: theme.background, borderColor: theme.border }}>
              <h3 className="text-lg font-bold mb-4" style={{ color: theme.text }}>
                Pricing Details
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span style={{ color: theme.textSecondary }}>Price per Meal:</span>
                  <span className="font-bold text-lg" style={{ color: theme.success }}>
                    ₹{subscriptionData.price_per_meal}
                  </span>
                </div>
                <div className="text-xs" style={{ color: theme.textSecondary }}>
                  * Based on average menu price from this vendor
                </div>
              </div>
            </div>

            {/* Subscription Summary */}
            <div className="p-6 rounded-xl border" style={{ backgroundColor: theme.background, borderColor: theme.border }}>
              <h3 className="font-semibold mb-4" style={{ color: theme.text }}>
                Subscription Summary
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span style={{ color: theme.textSecondary }}>Plan:</span>
                  <span style={{ color: theme.text }}>
                    {planTypes.find(p => p.value === subscriptionData.plan_type)?.label}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: theme.textSecondary }}>Delivery Days:</span>
                  <span style={{ color: theme.text }}>
                    {subscriptionData.delivery_days.length} days/week
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: theme.textSecondary }}>Total Meals:</span>
                  <span className="font-bold" style={{ color: theme.text }}>
                    {calculateTotalMeals()}
                  </span>
                </div>
                <div className="border-t pt-3" style={{ borderColor: theme.border }}>
                  <div className="flex justify-between font-bold">
                    <span style={{ color: theme.text }}>Total Amount:</span>
                    <span className="text-xl" style={{ color: theme.success }}>
                      ₹{calculateTotalAmount().toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                type="submit"
                form="subscription-form"
                disabled={loading || calculateTotalMeals() === 0}
                className="w-full px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                style={{
                  backgroundColor: theme.primary,
                  color: 'white'
                }}
                onClick={handleSubmit}
              >
                <FiRefreshCw size={16} />
                <span>
                  {loading ? 'Creating...' : `Subscribe for ₹${calculateTotalAmount().toLocaleString()}`}
                </span>
              </button>
              
              <button
                type="button"
                onClick={onClose}
                className="w-full px-6 py-3 border rounded-lg font-medium transition-all duration-300 hover:opacity-80"
                style={{
                  borderColor: theme.border,
                  color: theme.textSecondary,
                  backgroundColor: theme.background
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionForm;