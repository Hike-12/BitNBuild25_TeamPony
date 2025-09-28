// components/user/MySubscriptions.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { format, differenceInDays, addDays } from 'date-fns';
import {
  FiCalendar,
  FiClock,
  FiDollarSign,
  FiPackage,
  FiPause,
  FiPlay,
  FiX,
  FiCheck,
  FiAlertCircle,
  FiEdit,
  FiRefreshCw,
  FiTrendingUp
} from 'react-icons/fi';
import { MdRestaurant, MdRepeat } from 'react-icons/md';
import toast from 'react-hot-toast';

const MySubscriptions = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, active, paused, completed, cancelled
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [stats, setStats] = useState({
    totalActive: 0,
    totalSaved: 0,
    mealsDelivered: 0,
    upcomingDeliveries: 0
  });

  useEffect(() => {
    fetchSubscriptions();
  }, [filter]);

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('userToken');
      
      // For now, using mock data since subscription API might not be ready
      // Replace with actual API call when ready
      const mockSubscriptions = [
        {
          _id: '1',
          vendor: {
            _id: '68d81ff8feb96e5b5c4df344',
            business_name: "Arshdeep's Kitchen",
            address: "123 Main St, Mumbai"
          },
          plan_type: 'weekly',
          meal_preferences: {
            is_veg_only: false,
            spice_level: 'medium',
            avoid_ingredients: ['peanuts']
          },
          delivery_address: "123 MG Road, Mumbai",
          delivery_time_slot: "12:00-13:00",
          delivery_days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
          start_date: new Date('2024-09-23'),
          end_date: new Date('2024-09-30'),
          price_per_meal: 150,
          total_meals: 7,
          total_amount: 1050,
          meals_delivered: 4,
          payment_status: 'paid',
          subscription_status: 'active',
          auto_renewal: true,
          special_instructions: 'Ring the bell twice'
        },
        {
          _id: '2',
          vendor: {
            _id: '68d81ff8feb96e5b5c4df345',
            business_name: "Home Kitchen Delights",
            address: "456 Park St, Mumbai"
          },
          plan_type: 'monthly',
          meal_preferences: {
            is_veg_only: true,
            spice_level: 'low',
            avoid_ingredients: []
          },
          delivery_address: "789 Lake View, Mumbai",
          delivery_time_slot: "19:00-20:00",
          delivery_days: ['monday', 'wednesday', 'friday'],
          start_date: new Date('2024-09-01'),
          end_date: new Date('2024-09-30'),
          price_per_meal: 120,
          total_meals: 30,
          total_amount: 3600,
          meals_delivered: 25,
          payment_status: 'paid',
          subscription_status: 'active',
          auto_renewal: false,
          special_instructions: ''
        }
      ];

      // Filter subscriptions based on status
      let filtered = mockSubscriptions;
      if (filter !== 'all') {
        filtered = mockSubscriptions.filter(sub => sub.subscription_status === filter);
      }

      setSubscriptions(filtered);
      
      // Calculate stats
      const activeCount = mockSubscriptions.filter(s => s.subscription_status === 'active').length;
      const totalDelivered = mockSubscriptions.reduce((sum, s) => sum + s.meals_delivered, 0);
      const totalAmount = mockSubscriptions.reduce((sum, s) => sum + s.total_amount, 0);
      const upcoming = mockSubscriptions.filter(s => s.subscription_status === 'active')
        .reduce((sum, s) => sum + (s.total_meals - s.meals_delivered), 0);

      setStats({
        totalActive: activeCount,
        totalSaved: Math.round(totalAmount * 0.2), // Assuming 20% savings
        mealsDelivered: totalDelivered,
        upcomingDeliveries: upcoming
      });

    } catch (error) {
      console.error('Failed to fetch subscriptions:', error);
      toast.error('Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'active': theme.success,
      'paused': theme.warning,
      'cancelled': theme.error,
      'completed': theme.info
    };
    return colors[status] || theme.textSecondary;
  };

  const getDaysRemaining = (endDate) => {
    return differenceInDays(new Date(endDate), new Date());
  };

  const getNextDeliveryDate = (deliveryDays) => {
    const today = new Date();
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const currentDay = dayNames[today.getDay()];
    
    // Find next delivery day
    let daysUntilNext = 7;
    for (let i = 1; i <= 7; i++) {
      const checkDay = dayNames[(today.getDay() + i) % 7];
      if (deliveryDays.includes(checkDay)) {
        daysUntilNext = i;
        break;
      }
    }
    
    return addDays(today, daysUntilNext);
  };

  const handlePauseResume = async (subscriptionId, currentStatus) => {
    try {
      // API call would go here
      toast.success(`Subscription ${currentStatus === 'active' ? 'paused' : 'resumed'} successfully`);
      fetchSubscriptions();
    } catch (error) {
      toast.error('Failed to update subscription');
    }
  };

  const handleCancel = async (subscriptionId) => {
    if (confirm('Are you sure you want to cancel this subscription?')) {
      try {
        // API call would go here
        toast.success('Subscription cancelled successfully');
        fetchSubscriptions();
      } catch (error) {
        toast.error('Failed to cancel subscription');
      }
    }
  };

  const filterTabs = [
    { id: 'all', label: 'All', count: subscriptions.length },
    { id: 'active', label: 'Active', count: stats.totalActive },
    { id: 'paused', label: 'Paused' },
    { id: 'completed', label: 'Completed' },
    { id: 'cancelled', label: 'Cancelled' }
  ];

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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: theme.text }}>
            My Subscriptions
          </h2>
          <p style={{ color: theme.textSecondary }}>
            Manage your meal subscriptions and delivery preferences
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 flex items-center space-x-2"
          style={{ 
            backgroundColor: theme.primary,
            color: 'white' 
          }}
        >
          <FiPackage size={16} />
          <span>New Subscription</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border" style={{ backgroundColor: theme.panels, borderColor: theme.border }}>
          <div className="flex items-center justify-between mb-2">
            <FiCheck size={20} style={{ color: theme.success }} />
            <span className="text-xs px-2 py-1 rounded-full" 
              style={{ backgroundColor: `${theme.success}20`, color: theme.success }}>
              Active
            </span>
          </div>
          <div className="text-2xl font-bold" style={{ color: theme.text }}>{stats.totalActive}</div>
          <p className="text-sm" style={{ color: theme.textSecondary }}>Active Plans</p>
        </div>

        <div className="p-4 rounded-xl border" style={{ backgroundColor: theme.panels, borderColor: theme.border }}>
          <div className="flex items-center justify-between mb-2">
            <FiDollarSign size={20} style={{ color: theme.warning }} />
            <span className="text-xs px-2 py-1 rounded-full" 
              style={{ backgroundColor: `${theme.warning}20`, color: theme.warning }}>
              Saved
            </span>
          </div>
          <div className="text-2xl font-bold" style={{ color: theme.text }}>₹{stats.totalSaved}</div>
          <p className="text-sm" style={{ color: theme.textSecondary }}>Total Saved</p>
        </div>

        <div className="p-4 rounded-xl border" style={{ backgroundColor: theme.panels, borderColor: theme.border }}>
          <div className="flex items-center justify-between mb-2">
            <MdRestaurant size={20} style={{ color: theme.primary }} />
            <span className="text-xs px-2 py-1 rounded-full" 
              style={{ backgroundColor: `${theme.primary}20`, color: theme.primary }}>
              Delivered
            </span>
          </div>
          <div className="text-2xl font-bold" style={{ color: theme.text }}>{stats.mealsDelivered}</div>
          <p className="text-sm" style={{ color: theme.textSecondary }}>Meals Delivered</p>
        </div>

        <div className="p-4 rounded-xl border" style={{ backgroundColor: theme.panels, borderColor: theme.border }}>
          <div className="flex items-center justify-between mb-2">
            <FiTrendingUp size={20} style={{ color: theme.secondary }} />
            <span className="text-xs px-2 py-1 rounded-full" 
              style={{ backgroundColor: `${theme.secondary}20`, color: theme.secondary }}>
              Upcoming
            </span>
          </div>
          <div className="text-2xl font-bold" style={{ color: theme.text }}>{stats.upcomingDeliveries}</div>
          <p className="text-sm" style={{ color: theme.textSecondary }}>Upcoming Meals</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {filterTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all duration-200 ${
              filter === tab.id ? 'scale-105' : 'hover:scale-102'
            }`}
            style={{
              backgroundColor: filter === tab.id ? theme.primary : theme.panels,
              color: filter === tab.id ? 'white' : theme.textSecondary
            }}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className="ml-2">({tab.count})</span>
            )}
          </button>
        ))}
      </div>

      {/* Subscriptions List */}
      <div className="space-y-4">
        {subscriptions.length > 0 ? (
          subscriptions.map((subscription) => (
            <div 
              key={subscription._id}
              className="p-6 rounded-xl border transition-all duration-200 hover:shadow-lg"
              style={{ 
                backgroundColor: theme.panels, 
                borderColor: theme.border 
              }}
            >
              {/* Subscription Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold" style={{ color: theme.text }}>
                    {subscription.vendor.business_name}
                  </h3>
                  <p className="text-sm" style={{ color: theme.textSecondary }}>
                    {subscription.plan_type.charAt(0).toUpperCase() + subscription.plan_type.slice(1)} Plan
                  </p>
                </div>
                <div className="text-right">
                  <span 
                    className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium"
                    style={{
                      backgroundColor: `${getStatusColor(subscription.subscription_status)}20`,
                      color: getStatusColor(subscription.subscription_status)
                    }}
                  >
                    <FiCheck size={14} className="mr-1" />
                    {subscription.subscription_status.charAt(0).toUpperCase() + subscription.subscription_status.slice(1)}
                  </span>
                  {subscription.auto_renewal && (
                    <div className="flex items-center justify-end mt-2 text-xs" style={{ color: theme.primary }}>
                      <MdRepeat size={14} className="mr-1" />
                      Auto-renewal on
                    </div>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              {subscription.subscription_status === 'active' && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span style={{ color: theme.textSecondary }}>
                      {subscription.meals_delivered} of {subscription.total_meals} meals
                    </span>
                   
                  </div>
                  <div className="w-full h-3 rounded-full overflow-hidden" 
                    style={{ backgroundColor: theme.background }}>
                    <div 
                      className="h-full transition-all duration-500 rounded-full"
                      style={{ 
                        width: `${(subscription.meals_delivered / subscription.total_meals) * 100}%`,
                        backgroundColor: theme.primary
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Subscription Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <FiCalendar size={16} style={{ color: theme.textSecondary }} className="mr-2" />
                    <span style={{ color: theme.textSecondary }}>Duration:</span>
                    <span className="ml-2 font-medium" style={{ color: theme.text }}>
                      {format(new Date(subscription.start_date), 'dd MMM')} - {format(new Date(subscription.end_date), 'dd MMM yyyy')}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <FiClock size={16} style={{ color: theme.textSecondary }} className="mr-2" />
                    <span style={{ color: theme.textSecondary }}>Delivery Time:</span>
                    <span className="ml-2 font-medium" style={{ color: theme.text }}>
                      {subscription.delivery_time_slot}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <FiDollarSign size={16} style={{ color: theme.textSecondary }} className="mr-2" />
                    <span style={{ color: theme.textSecondary }}>Per Meal:</span>
                    <span className="ml-2 font-medium" style={{ color: theme.text }}>
                      ₹{subscription.price_per_meal}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm">
                    <span style={{ color: theme.textSecondary }}>Delivery Days:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {subscription.delivery_days.map(day => (
                        <span 
                          key={day}
                          className="px-2 py-1 rounded text-xs capitalize"
                          style={{ 
                            backgroundColor: theme.background,
                            color: theme.text
                          }}
                        >
                          {day.substring(0, 3)}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-sm">
                    <span style={{ color: theme.textSecondary }}>Preferences:</span>
                    <div className="mt-1">
                      <span className="text-xs" style={{ color: theme.text }}>
                        {subscription.meal_preferences.is_veg_only ? 'Vegetarian' : 'Non-Vegetarian'} • 
                        {' ' + subscription.meal_preferences.spice_level.charAt(0).toUpperCase() + subscription.meal_preferences.spice_level.slice(1)} Spice
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Next Delivery */}
              {subscription.subscription_status === 'active' && (
                <div className="mb-4 p-3 rounded-lg flex items-center justify-between"
                  style={{ backgroundColor: `${theme.info}15` }}>
                  <div className="flex items-center">
                    <FiAlertCircle size={16} style={{ color: theme.info }} className="mr-2" />
                    <span className="text-sm" style={{ color: theme.text }}>
                      Next delivery: {format(getNextDeliveryDate(subscription.delivery_days), 'EEEE, dd MMM')}
                    </span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-4 border-t" style={{ borderColor: theme.border }}>
                <div className="text-right">
                  <p className="text-sm" style={{ color: theme.textSecondary }}>Total Amount</p>
                  <p className="text-xl font-bold" style={{ color: theme.success }}>₹{subscription.total_amount}</p>
                </div>

                <div className="flex space-x-2">
                  {subscription.subscription_status === 'active' && (
                    <>
                      <button
                        onClick={() => handlePauseResume(subscription._id, subscription.subscription_status)}
                        className="px-3 py-2 rounded-lg font-medium transition-all hover:opacity-80 flex items-center space-x-1"
                        style={{ 
                          backgroundColor: theme.warning + '20',
                          color: theme.warning
                        }}
                      >
                        <FiPause size={16} />
                        <span>Pause</span>
                      </button>
                      <button
                        onClick={() => setSelectedSubscription(subscription)}
                        className="px-3 py-2 rounded-lg font-medium transition-all hover:opacity-80 flex items-center space-x-1"
                        style={{ 
                          backgroundColor: theme.primary + '20',
                          color: theme.primary
                        }}
                      >
                        <FiEdit size={16} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleCancel(subscription._id)}
                        className="px-3 py-2 rounded-lg font-medium transition-all hover:opacity-80 flex items-center space-x-1"
                        style={{ 
                          backgroundColor: theme.error + '20',
                          color: theme.error
                        }}
                      >
                        <FiX size={16} />
                        <span>Cancel</span>
                      </button>
                    </>
                  )}
                  {subscription.subscription_status === 'paused' && (
                    <button
                      onClick={() => handlePauseResume(subscription._id, subscription.subscription_status)}
                      className="px-3 py-2 rounded-lg font-medium transition-all hover:opacity-80 flex items-center space-x-1"
                      style={{ 
                        backgroundColor: theme.success + '20',
                        color: theme.success
                      }}
                    >
                      <FiPlay size={16} />
                      <span>Resume</span>
                    </button>
                  )}
                  {subscription.subscription_status === 'completed' && subscription.auto_renewal && (
                    <button
                      className="px-3 py-2 rounded-lg font-medium transition-all hover:opacity-80 flex items-center space-x-1"
                      style={{ 
                        backgroundColor: theme.primary,
                        color: 'white'
                      }}
                    >
                      <FiRefreshCw size={16} />
                      <span>Renew</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div 
            className="text-center py-12 rounded-xl border"
            style={{ backgroundColor: theme.panels, borderColor: theme.border }}
          >
            <MdRestaurant size={48} style={{ color: theme.textSecondary }} className="mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2" style={{ color: theme.text }}>
              No subscriptions found
            </h3>
            <p style={{ color: theme.textSecondary }}>
              Start a subscription to enjoy regular meal deliveries
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="mt-4 px-6 py-2 rounded-lg font-medium"
              style={{ 
                backgroundColor: theme.primary,
                color: 'white' 
              }}
            >
              Create Subscription
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MySubscriptions;