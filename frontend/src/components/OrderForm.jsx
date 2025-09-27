import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';
import {
  FiMapPin,
  FiClock,
  FiCalendar,
  FiCreditCard,
  FiShoppingCart,
  FiX
} from 'react-icons/fi';

const OrderForm = ({ menu, vendor, onClose, onSuccess }) => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState({
    quantity: 1,
    delivery_address: '',
    delivery_date: '',
    delivery_time_slot: '',
    special_instructions: '',
    payment_method: 'cod'
  });

  const timeSlots = [
    { value: '12:00-13:00', label: '12:00 PM - 1:00 PM (Lunch)' },
    { value: '13:00-14:00', label: '1:00 PM - 2:00 PM (Lunch)' },
    { value: '19:00-20:00', label: '7:00 PM - 8:00 PM (Dinner)' },
    { value: '20:00-21:00', label: '8:00 PM - 9:00 PM (Dinner)' }
  ];

  const paymentMethods = [
    { value: 'cod', label: 'Cash on Delivery', icon: FiCreditCard },
    { value: 'upi', label: 'UPI Payment', icon: FiCreditCard },
    { value: 'card', label: 'Credit/Debit Card', icon: FiCreditCard },
    { value: 'wallet', label: 'Digital Wallet', icon: FiCreditCard }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateTotal = () => {
    return menu.full_dabba_price * orderData.quantity;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!orderData.delivery_address || !orderData.delivery_date || !orderData.delivery_time_slot) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          menu_id: menu._id,
          vendor_id: vendor._id,
          ...orderData
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Order placed successfully! 🎉');
        onSuccess && onSuccess(data.order);
        onClose();
      } else {
        toast.error(data.error || 'Failed to place order');
      }
    } catch (error) {
      console.error('Order error:', error);
      toast.error('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const remainingDabbas = menu.max_dabbas - menu.dabbas_sold;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border"
        style={{
          backgroundColor: theme.panels,
          borderColor: theme.border
        }}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b" style={{ borderColor: theme.border }}>
          <div>
            <h2 className="text-2xl font-bold" style={{ color: theme.text }}>
              Place Order
            </h2>
            <p className="text-sm mt-1" style={{ color: theme.textSecondary }}>
              {menu.name} - {vendor.business_name}
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Quantity Selection */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: theme.textSecondary }}>
              Quantity *
            </label>
            <div className="flex items-center space-x-4">
              <div className="flex items-center border rounded-lg" style={{ borderColor: theme.border }}>
                <button
                  type="button"
                  onClick={() => setOrderData(prev => ({ ...prev, quantity: Math.max(1, prev.quantity - 1) }))}
                  className="px-3 py-2 hover:opacity-80 transition-opacity"
                  style={{ color: theme.textSecondary }}
                >
                  -
                </button>
                <span className="px-4 py-2 border-x" style={{ borderColor: theme.border, color: theme.text }}>
                  {orderData.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setOrderData(prev => ({ ...prev, quantity: Math.min(remainingDabbas, prev.quantity + 1) }))}
                  className="px-3 py-2 hover:opacity-80 transition-opacity"
                  style={{ color: theme.textSecondary }}
                  disabled={orderData.quantity >= remainingDabbas}
                >
                  +
                </button>
              </div>
              <span className="text-sm" style={{ color: theme.textSecondary }}>
                {remainingDabbas} available
              </span>
            </div>
          </div>

          {/* Delivery Address */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium mb-2" style={{ color: theme.textSecondary }}>
              <FiMapPin size={16} />
              <span>Delivery Address *</span>
            </label>
            <textarea
              name="delivery_address"
              value={orderData.delivery_address}
              onChange={handleInputChange}
              rows={3}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-opacity-50 transition-all duration-300"
              style={{
                backgroundColor: theme.background,
                borderColor: theme.border,
                color: theme.text,
                focusRingColor: theme.primary
              }}
              placeholder="Enter your complete delivery address..."
              required
            />
          </div>

          {/* Delivery Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium mb-2" style={{ color: theme.textSecondary }}>
                <FiCalendar size={16} />
                <span>Delivery Date *</span>
              </label>
              <input
                type="date"
                name="delivery_date"
                value={orderData.delivery_date}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-opacity-50 transition-all duration-300"
                style={{
                  backgroundColor: theme.background,
                  borderColor: theme.border,
                  color: theme.text,
                  focusRingColor: theme.primary
                }}
                required
              />
            </div>

            <div>
              <label className="flex items-center space-x-2 text-sm font-medium mb-2" style={{ color: theme.textSecondary }}>
                <FiClock size={16} />
                <span>Time Slot *</span>
              </label>
              <select
                name="delivery_time_slot"
                value={orderData.delivery_time_slot}
                onChange={handleInputChange}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-opacity-50 transition-all duration-300"
                style={{
                  backgroundColor: theme.background,
                  borderColor: theme.border,
                  color: theme.text,
                  focusRingColor: theme.primary
                }}
                required
              >
                <option value="">Select time slot</option>
                {timeSlots.map(slot => (
                  <option key={slot.value} value={slot.value}>
                    {slot.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium mb-3" style={{ color: theme.textSecondary }}>
              <FiCreditCard size={16} />
              <span>Payment Method</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {paymentMethods.map(method => {
                const Icon = method.icon;
                return (
                  <label
                    key={method.value}
                    className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:opacity-80 transition-all duration-300"
                    style={{
                      backgroundColor: orderData.payment_method === method.value ? `${theme.primary}20` : theme.background,
                      borderColor: orderData.payment_method === method.value ? theme.primary : theme.border
                    }}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      value={method.value}
                      checked={orderData.payment_method === method.value}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <Icon size={16} style={{ color: theme.textSecondary }} />
                    <span className="text-sm" style={{ color: theme.text }}>
                      {method.label}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Special Instructions */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: theme.textSecondary }}>
              Special Instructions (Optional)
            </label>
            <textarea
              name="special_instructions"
              value={orderData.special_instructions}
              onChange={handleInputChange}
              rows={2}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-opacity-50 transition-all duration-300"
              style={{
                backgroundColor: theme.background,
                borderColor: theme.border,
                color: theme.text,
                focusRingColor: theme.primary
              }}
              placeholder="Any special requests or dietary requirements..."
            />
          </div>

          {/* Order Summary */}
          <div 
            className="border rounded-lg p-4"
            style={{ backgroundColor: theme.background, borderColor: theme.border }}
          >
            <h3 className="font-semibold mb-3" style={{ color: theme.text }}>
              Order Summary
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span style={{ color: theme.textSecondary }}>
                  {menu.name} × {orderData.quantity}
                </span>
                <span style={{ color: theme.text }}>
                  ₹{menu.full_dabba_price * orderData.quantity}
                </span>
              </div>
              <div className="border-t pt-2" style={{ borderColor: theme.border }}>
                <div className="flex justify-between font-semibold">
                  <span style={{ color: theme.text }}>Total Amount</span>
                  <span className="text-lg" style={{ color: theme.success }}>
                    ₹{calculateTotal()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border rounded-lg font-medium transition-all duration-300 hover:opacity-80"
              style={{
                borderColor: theme.border,
                color: theme.textSecondary,
                backgroundColor: theme.background
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              style={{
                backgroundColor: theme.primary,
                color: 'white'
              }}
            >
              <FiShoppingCart size={16} />
              <span>{loading ? 'Placing Order...' : `Place Order - ₹${calculateTotal()}`}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderForm;