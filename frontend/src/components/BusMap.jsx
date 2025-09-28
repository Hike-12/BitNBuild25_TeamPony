import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import toast from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';

// Custom icons
const orderIcon = (status) => {
  const colors = {
    placed: '#FFA500',
    confirmed: '#3B82F6', 
    preparing: '#F59E0B',
    ready: '#10B981',
    out_for_delivery: '#8B5CF6',
    delivered: '#22C55E',
    cancelled: '#EF4444'
  };

  const emojis = {
    placed: '📝',
    confirmed: '✅',
    preparing: '👨‍🍳',
    ready: '🍽️',
    out_for_delivery: '🚚',
    delivered: '✨',
    cancelled: '❌'
  };

  return new L.divIcon({
    className: 'custom-order-marker',
    html: `<div style="background: ${colors[status] || '#6B7280'}; color: white; border-radius: 50%; width: 35px; height: 35px; display: flex; align-items: center; justify-content: center; font-size: 16px; box-shadow: 0 2px 10px rgba(0,0,0,0.3); border: 2px solid white;">${emojis[status] || '📦'}</div>`,
    iconSize: [35, 35],
    iconAnchor: [17, 17],
    popupAnchor: [0, -17]
  });
};

const vendorIcon = new L.divIcon({
  className: 'custom-vendor-marker',
  html: '<div style="background: #144640; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-size: 16px; box-shadow: 0 2px 10px rgba(0,0,0,0.3); border: 2px solid white;">🏪</div>',
  iconSize: [30, 30],
  iconAnchor: [15, 15],
  popupAnchor: [0, -15]
});

// Component to handle map updates
function MapUpdater({ orders, center, selectedOrder, hasFitted, setHasFitted }) {
  const map = useMap();

  // Fit bounds on initial load
  useEffect(() => {
    if (!hasFitted && orders.length > 0) {
      const bounds = [];
      orders.forEach(order => {
        if (order.current_location?.latitude && order.current_location?.longitude) {
          bounds.push([order.current_location.latitude, order.current_location.longitude]);
        }
      });
      
      if (bounds.length > 0) {
        const group = new L.featureGroup(bounds.map(coord => L.marker(coord)));
        map.fitBounds(group.getBounds().pad(0.1));
        setHasFitted(true);
      }
    }
  }, [orders, map, hasFitted, setHasFitted]);

  // Fit bounds when selected order changes
  useEffect(() => {
    if (selectedOrder !== null) {
      const order = orders.find(o => o.id === selectedOrder);
      if (order?.current_location?.latitude && order?.current_location?.longitude) {
        map.setView([order.current_location.latitude, order.current_location.longitude], 15);
      }
    }
  }, [selectedOrder, orders, map]);

  return null;
}

export default function OrderTracker({
  userType = 'consumer', // 'consumer' or 'vendor'
  center = [28.4595, 77.0266], // Gurgaon coordinates
  refreshInterval = 30000, // 30 seconds
  orderId = null // For tracking specific order
}) {
  const { theme } = useTheme();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasFitted, setHasFitted] = useState(false);
  const intervalRef = useRef(null);

  const getAuthHeaders = () => {
    const token = userType === 'consumer' 
      ? localStorage.getItem('userToken')
      : localStorage.getItem('vendor_token');
    
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  // Fetch orders based on user type
  const fetchOrders = async () => {
    try {
      const endpoint = orderId 
        ? `/api/order-tracking/${userType}/${orderId}`
        : `/api/order-tracking/${userType}`;
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        if (orderId) {
          // Single order tracking
          setOrders([{
            ...data.order,
            ...data.tracking,
            // Mock location data if not available
            current_location: data.tracking?.current_location || {
              latitude: 28.4595 + (Math.random() - 0.5) * 0.01,
              longitude: 77.0266 + (Math.random() - 0.5) * 0.01,
              address: 'En route to delivery address'
            }
          }]);
        } else {
          // Multiple orders
          setOrders(data.orders.map(order => ({
            ...order,
            // Mock location data for demo
            current_location: order.current_location || (order.current_status === 'out_for_delivery' ? {
              latitude: 28.4595 + (Math.random() - 0.5) * 0.02,
              longitude: 77.0266 + (Math.random() - 0.5) * 0.02,
              address: 'En route to delivery address'
            } : null)
          })));
        }
      }
      setError(null);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setError(err.message);
      toast.error('Failed to fetch order tracking data');
    } finally {
      setLoading(false);
    }
  };

  // Initialize and set up auto-refresh
  useEffect(() => {
    fetchOrders();

    if (refreshInterval > 0) {
      intervalRef.current = setInterval(fetchOrders, refreshInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [userType, orderId, refreshInterval]);

  // Reset fit bounds when selected order changes
  useEffect(() => {
    setHasFitted(false);
  }, [selectedOrder]);

  // Format time
  const formatTime = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleString('en-IN', {
      weekday: 'short',
      day: 'numeric', 
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    const colors = {
      placed: '#FFA500',
      confirmed: '#3B82F6',
      preparing: '#F59E0B', 
      ready: '#10B981',
      out_for_delivery: '#8B5CF6',
      delivered: '#22C55E',
      cancelled: '#EF4444'
    };
    return colors[status] || '#6B7280';
  };

  // Get status display text
  const getStatusText = (status) => {
    const statusTexts = {
      placed: 'Order Placed',
      confirmed: 'Confirmed',
      preparing: 'Being Prepared',
      ready: 'Ready for Pickup',
      out_for_delivery: 'Out for Delivery',
      delivered: 'Delivered',
      cancelled: 'Cancelled'
    };
    return statusTexts[status] || status;
  };

  if (loading) {
    return (
      <div 
        className="w-full h-full flex items-center justify-center"
        style={{ backgroundColor: theme.background }}
      >
        <div className="text-center">
          <div 
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto"
            style={{ borderColor: theme.primary }}
          ></div>
          <p className="mt-4" style={{ color: theme.text }}>
            Loading order tracking...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className="w-full h-full flex items-center justify-center"
        style={{ backgroundColor: theme.background }}
      >
        <div className="text-center">
          <p className="mb-4" style={{ color: theme.error }}>
            Error loading tracking: {error}
          </p>
          <button
            onClick={fetchOrders}
            className="px-4 py-2 rounded-lg"
            style={{ 
              backgroundColor: theme.primary,
              color: 'white'
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      {/* Order Selection Panel */}
      {!orderId && orders.length > 0 && (
        <div 
          className="absolute top-4 left-4 rounded-lg shadow-lg p-4 z-[1000] max-w-xs max-h-96 overflow-y-auto"
          style={{ 
            backgroundColor: theme.panels,
            borderColor: theme.border,
            border: `1px solid ${theme.border}`
          }}
        >
          <h3 className="font-bold mb-3" style={{ color: theme.text }}>
            {userType === 'consumer' ? 'Your Orders' : 'Today\'s Orders'}
          </h3>
          <div className="space-y-2">
            <button
              onClick={() => setSelectedOrder(null)}
              className={`w-full text-left px-3 py-2 rounded text-sm transition-all ${
                selectedOrder === null ? 'scale-105' : 'hover:scale-102'
              }`}
              style={{
                backgroundColor: selectedOrder === null ? theme.primary : 'transparent',
                color: selectedOrder === null ? 'white' : theme.text
              }}
            >
              Show All Orders ({orders.length})
            </button>
            {orders.map((order) => (
              <button
                key={order.id}
                onClick={() => setSelectedOrder(order.id)}
                className={`w-full text-left px-3 py-2 rounded text-sm transition-all ${
                  selectedOrder === order.id ? 'scale-105' : 'hover:scale-102'
                }`}
                style={{
                  backgroundColor: selectedOrder === order.id ? theme.primary : theme.background,
                  color: selectedOrder === order.id ? 'white' : theme.text,
                  border: `1px solid ${theme.border}`
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{order.order_number}</div>
                    <div className="text-xs opacity-80">
                      {userType === 'consumer' ? order.vendor_name : order.customer_name}
                    </div>
                  </div>
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getStatusColor(order.current_status) }}
                  ></div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Map Container */}
      <MapContainer
        center={center}
        zoom={12}
        className="w-full h-full"
        zoomControl={true}
      >
        <TileLayer
          attribution=""
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
        />

        {/* Order Markers */}
        <MarkerClusterGroup chunkedLoading>
          {orders
            .filter(order => selectedOrder === null || order.id === selectedOrder)
            .filter(order => order.current_location?.latitude && order.current_location?.longitude)
            .map((order) => (
              <Marker
                key={order.id}
                position={[order.current_location.latitude, order.current_location.longitude]}
                icon={orderIcon(order.current_status)}
              >
                <Popup>
                  <div className="p-3 min-w-[280px]">
                    <h3 className="font-bold text-lg mb-2">
                      {order.order_number}
                    </h3>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="font-semibold">Status:</span>
                        <span 
                          className="px-2 py-1 rounded-full text-xs font-medium"
                          style={{ 
                            backgroundColor: `${getStatusColor(order.current_status)}20`,
                            color: getStatusColor(order.current_status)
                          }}
                        >
                          {getStatusText(order.current_status)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="font-semibold">Menu:</span>
                        <span>{order.menu_name}</span>
                      </div>
                      
                      {userType === 'consumer' ? (
                        <>
                          <div className="flex justify-between">
                            <span className="font-semibold">Vendor:</span>
                            <span>{order.vendor_name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-semibold">Contact:</span>
                            <span>{order.vendor_phone}</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex justify-between">
                            <span className="font-semibold">Customer:</span>
                            <span>{order.customer_name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-semibold">Phone:</span>
                            <span>{order.customer_phone}</span>
                          </div>
                        </>
                      )}
                      
                      <div className="flex justify-between">
                        <span className="font-semibold">Amount:</span>
                        <span className="font-bold text-green-600">₹{order.total_amount}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="font-semibold">Quantity:</span>
                        <span>{order.quantity} items</span>
                      </div>
                      
                      {order.delivery_person?.name && (
                        <div className="border-t pt-2 mt-2">
                          <div className="flex justify-between">
                            <span className="font-semibold">Delivery by:</span>
                            <span>{order.delivery_person.name}</span>
                          </div>
                          {order.delivery_person.phone && (
                            <div className="flex justify-between">
                              <span className="font-semibold">Phone:</span>
                              <span>{order.delivery_person.phone}</span>
                            </div>
                          )}
                          {order.delivery_person.vehicle_number && (
                            <div className="flex justify-between">
                              <span className="font-semibold">Vehicle:</span>
                              <span>{order.delivery_person.vehicle_number}</span>
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between">
                          <span className="font-semibold">Progress:</span>
                          <span>{order.progress_percentage || 0}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className="h-2 rounded-full transition-all duration-300"
                            style={{ 
                              backgroundColor: getStatusColor(order.current_status),
                              width: `${order.progress_percentage || 0}%`
                            }}
                          />
                        </div>
                      </div>
                      
                      {order.estimated_delivery_time && (
                        <div className="flex justify-between">
                          <span className="font-semibold">ETA:</span>
                          <span>{formatTime(order.estimated_delivery_time)}</span>
                        </div>
                      )}
                      
                      <div className="text-xs text-gray-500 mt-2">
                        Ordered: {formatTime(order.created_at)}
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
        </MarkerClusterGroup>

        <MapUpdater
          orders={orders}
          center={center}
          selectedOrder={selectedOrder}
          hasFitted={hasFitted}
          setHasFitted={setHasFitted}
        />
      </MapContainer>

      {/* Status Overlay */}
      <div 
        className="absolute top-4 right-4 rounded-lg shadow-lg p-3 z-[1000]"
        style={{ 
          backgroundColor: theme.panels,
          border: `1px solid ${theme.border}`
        }}
      >
        <div className="flex items-center space-x-2">
          <div 
            className="w-3 h-3 rounded-full animate-pulse"
            style={{ backgroundColor: theme.success }}
          ></div>
          <span className="text-sm font-medium" style={{ color: theme.text }}>
            Live Tracking
          </span>
        </div>
        <p className="text-xs mt-1" style={{ color: theme.textSecondary }}>
          {orders.length} orders active
        </p>
        <p className="text-xs" style={{ color: theme.textSecondary }}>
          Updated: {formatTime(new Date())}
        </p>
      </div>

      {/* Refresh Button */}
      <button
        onClick={fetchOrders}
        className="absolute bottom-4 right-4 p-3 rounded-full shadow-lg transition-colors z-[1000]"
        style={{ 
          backgroundColor: theme.primary,
          color: 'white'
        }}
        title="Refresh tracking data"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
    </div>
  );
}