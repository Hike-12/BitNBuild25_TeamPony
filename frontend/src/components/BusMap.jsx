import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Helper to generate random coordinates near a center
function randomNearby([lat, lng], radius = 0.01) {
  return [
    lat + (Math.random() - 0.5) * radius,
    lng + (Math.random() - 0.5) * radius
  ];
}

// Order colors for different orders
const orderColors = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Orange
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#F97316', // Orange-Red
  '#06B6D4', // Cyan
  '#84CC16'  // Lime
];

// Generate custom icons for each order
function createOrderIcon(color, emoji = '🚚') {
  return new L.DivIcon({
    className: 'custom-order-marker',
    html: `<div style="background: ${color}; color: white; border-radius: 50%; width: 35px; height: 35px; display: flex; align-items: center; justify-content: center; font-size: 16px; box-shadow: 0 2px 10px rgba(0,0,0,0.3); border: 2px solid white; transition: all 0.3s ease;">${emoji}</div>`,
    iconSize: [35, 35],
    iconAnchor: [17, 17],
    popupAnchor: [0, -17]
  });
}

const vendorIcon = new L.DivIcon({
  className: 'custom-vendor-marker',
  html: `<div style="background: #144640; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-size: 16px; box-shadow: 0 2px 10px rgba(0,0,0,0.3); border: 2px solid white;">🏪</div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
  popupAnchor: [0, -15]
});

const deliveryIcon = new L.DivIcon({
  className: 'custom-delivery-marker',
  html: `<div style="background: #DC2626; color: white; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-size: 16px; box-shadow: 0 2px 10px rgba(0,0,0,0.3); border: 2px solid white;">🏁</div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16]
});

// Simulate orders with colors and proper routing
function generateOrders(center, n = 5) {
  return Array.from({ length: n }).map((_, i) => {
    const vendorLoc = randomNearby(center, 0.008); // Smaller radius for better routes
    const deliveryLoc = randomNearby(center, 0.015); // Reasonable distance
    return {
      id: `order-${i + 1}`,
      order_number: `#ORD${1000 + i}`,
      vendor_location: vendorLoc,
      delivery_location: deliveryLoc,
      current_location: [...vendorLoc], // Start at vendor
      status: 'out_for_delivery',
      color: orderColors[i % orderColors.length],
      icon: createOrderIcon(orderColors[i % orderColors.length]),
      route_points: [], // Store the full route
      current_route_index: 0 // Track position on route
    };
  });
}

// Improved OSRM route fetching with error handling
async function fetchRoute(from, to) {
  try {
    console.log(`Fetching route from [${from[1]}, ${from[0]}] to [${to[1]}, ${to[0]}]`);
    
    const url = `https://router.project-osrm.org/route/v1/driving/${from[1]},${from[0]};${to[1]},${to[0]}?overview=full&geometries=geojson`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.routes && data.routes[0] && data.routes[0].geometry) {
      const coordinates = data.routes[0].geometry.coordinates;
      const route = coordinates.map(([lng, lat]) => [lat, lng]);
      console.log(`Route fetched successfully with ${route.length} points`);
      return route;
    } else {
      console.log('No route found in OSRM response');
      throw new Error('No route found');
    }
  } catch (error) {
    console.error('Route fetch failed:', error);
    // Fallback: create a simple route with intermediate points
    const latDiff = (to[0] - from[0]) / 3;
    const lngDiff = (to[1] - from[1]) / 3;
    
    return [
      from,
      [from[0] + latDiff, from[1] + lngDiff],
      [from[0] + latDiff * 2, from[1] + lngDiff * 2],
      to
    ];
  }
}

// Move along the route points instead of direct line
function moveAlongRoute(order, step = 0.0003) {
  if (!order.route_points || order.route_points.length === 0) {
    return moveTowards(order.current_location, order.delivery_location, step);
  }

  const routePoints = order.route_points;
  const currentIndex = order.current_route_index || 0;
  
  if (currentIndex >= routePoints.length - 1) {
    return [...order.delivery_location];
  }

  const currentTarget = routePoints[currentIndex + 1];
  const newLocation = moveTowards(order.current_location, currentTarget, step);
  
  // Check if we've reached the current target point
  const distanceToTarget = Math.sqrt(
    Math.pow(newLocation[0] - currentTarget[0], 2) + 
    Math.pow(newLocation[1] - currentTarget[1], 2)
  );
  
  if (distanceToTarget < 0.0001) {
    // Move to next point in route
    order.current_route_index = Math.min(currentIndex + 1, routePoints.length - 1);
  }
  
  return newLocation;
}

// Standard move towards function
function moveTowards(current, target, step = 0.0003) {
  const [clat, clng] = current;
  const [tlat, tlng] = target;
  const dlat = tlat - clat;
  const dlng = tlng - clng;
  const dist = Math.sqrt(dlat * dlat + dlng * dlng);
  
  if (dist < step) return [...target];
  
  const ratio = step / dist;
  return [
    clat + dlat * ratio,
    clng + dlng * ratio
  ];
}

// MapUpdater to fit bounds
function MapUpdater({ orders, selectedOrder }) {
  const map = useMap();
  useEffect(() => {
    if (selectedOrder) {
      const order = orders.find(o => o.id === selectedOrder);
      if (order) {
        map.setView(order.current_location, 15);
      }
    } else if (orders.length > 0) {
      const bounds = orders.map(o => o.current_location);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [orders, selectedOrder, map]);
  return null;
}

export default function SimulatedBusMap() {
  const center = [28.4595, 77.0266]; // Gurgaon
  const [orders, setOrders] = useState(() => generateOrders(center, 5));
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [routes, setRoutes] = useState({});
  const intervalRef = useRef();

  // Fetch routes for all orders on component mount
  useEffect(() => {
    const fetchAllRoutes = async () => {
      const routePromises = orders.map(async (order) => {
        try {
          const route = await fetchRoute(order.vendor_location, order.delivery_location);
          return { orderId: order.id, route };
        } catch (error) {
          console.error(`Failed to fetch route for order ${order.id}:`, error);
          return { 
            orderId: order.id, 
            route: [order.vendor_location, order.delivery_location] 
          };
        }
      });

      const routeResults = await Promise.all(routePromises);
      const newRoutes = {};
      
      // Update orders with route points and routes state
      setOrders(prevOrders => 
        prevOrders.map(order => {
          const routeResult = routeResults.find(r => r.orderId === order.id);
          if (routeResult) {
            newRoutes[order.id] = routeResult.route;
            return {
              ...order,
              route_points: routeResult.route,
              current_route_index: 0
            };
          }
          return order;
        })
      );
      
      setRoutes(newRoutes);
    };

    fetchAllRoutes();
  }, []);

  // Simulate live GPS movement along the route
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setOrders(prevOrders =>
        prevOrders.map(order => {
          if (order.status === 'delivered') return order;
          
          const nextLoc = moveAlongRoute(order, 0.0002); // Slower movement
          const distance = Math.sqrt(
            Math.pow(nextLoc[0] - order.delivery_location[0], 2) + 
            Math.pow(nextLoc[1] - order.delivery_location[1], 2)
          );
          
          const delivered = distance < 0.0005;
          
          return {
            ...order,
            current_location: nextLoc,
            status: delivered ? 'delivered' : 'out_for_delivery'
          };
        })
      );
    }, 1500);
    
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div className="w-full h-full relative" style={{ height: '100vh' }}>
      {/* Order selection panel */}
      <div style={{
        position: 'absolute', top: 16, left: 16, zIndex: 1000, 
        background: 'rgba(255,255,255,0.95)', 
        backdropFilter: 'blur(10px)',
        borderRadius: 12, 
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)', 
        padding: 16, 
        minWidth: 250,
        border: '1px solid rgba(255,255,255,0.2)'
      }}>
        <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 16 }}>🚚 Live Orders</div>
        
        <button
          style={{
            display: 'block', 
            width: '100%', 
            marginBottom: 8, 
            background: selectedOrder ? 'rgba(59, 130, 246, 0.1)' : '#3B82F6', 
            color: selectedOrder ? '#3B82F6' : '#fff', 
            border: selectedOrder ? '1px solid #3B82F6' : 'none', 
            borderRadius: 8, 
            padding: '8px 12px', 
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onClick={() => setSelectedOrder(null)}
        >
          📍 Show All Orders
        </button>
        
        {orders.map((order, index) => (
          <button
            key={order.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%', 
              marginBottom: 6, 
              background: selectedOrder === order.id ? order.color : 'rgba(255,255,255,0.8)', 
              color: selectedOrder === order.id ? '#fff' : '#333', 
              border: selectedOrder === order.id ? 'none' : `2px solid ${order.color}`, 
              borderRadius: 8, 
              padding: '8px 12px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontSize: '14px',
              fontWeight: 500
            }}
            onClick={() => setSelectedOrder(order.id)}
          >
            <div 
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: order.color,
                marginRight: 8,
                flexShrink: 0
              }}
            />
            <span style={{ flex: 1 }}>
              {order.order_number} {order.status === 'delivered' ? '✅' : '🚚'}
            </span>
          </button>
        ))}
      </div>

      <MapContainer
        key={`map-${orders.length}`}
        center={center}
        zoom={13}
        className="w-full h-full"
        style={{ height: '100vh', zIndex: 1 }}
        zoomControl={true}
      >
        <TileLayer
          attribution=""
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
        />

        {orders
          .filter(order => !selectedOrder || order.id === selectedOrder)
          .map(order => (
            <React.Fragment key={order.id}>
              {/* Vendor marker */}
              <Marker
                position={order.vendor_location}
                icon={vendorIcon}
              >
                <Popup>
                  <div style={{ textAlign: 'center' }}>
                    <strong>🏪 Vendor Location</strong><br />
                    <small>{order.order_number}</small><br />
                    📍 {order.vendor_location[0].toFixed(5)}, {order.vendor_location[1].toFixed(5)}
                  </div>
                </Popup>
              </Marker>
              
              {/* Delivery destination marker */}
              <Marker
                position={order.delivery_location}
                icon={deliveryIcon}
              >
                <Popup>
                  <div style={{ textAlign: 'center' }}>
                    <strong>🏁 Delivery Location</strong><br />
                    <small>{order.order_number}</small><br />
                    📍 {order.delivery_location[0].toFixed(5)}, {order.delivery_location[1].toFixed(5)}
                  </div>
                </Popup>
              </Marker>
              
              {/* Current location marker (moving) */}
              <Marker
                position={order.current_location}
                icon={order.icon}
              >
                <Popup>
                  <div style={{ textAlign: 'center' }}>
                    <strong style={{ color: order.color }}>{order.order_number}</strong><br />
                    Status: <span style={{ 
                      color: order.status === 'delivered' ? '#10B981' : '#F59E0B',
                      fontWeight: 'bold'
                    }}>
                      {order.status === 'delivered' ? '✅ Delivered' : '🚚 Out for Delivery'}
                    </span><br />
                    📍 {order.current_location[0].toFixed(5)}, {order.current_location[1].toFixed(5)}
                  </div>
                </Popup>
              </Marker>
              
              {/* Full route polyline for selected order */}
              {selectedOrder === order.id && routes[order.id] && (
                <Polyline 
                  positions={routes[order.id]} 
                  color={order.color} 
                  weight={4}
                  opacity={0.7}
                  dashArray="8, 8"
                />
              )}
              
              {/* Completed route trail (from vendor to current location) */}
              {order.route_points && order.route_points.length > 0 && (
                <Polyline 
                  positions={order.route_points.slice(0, (order.current_route_index || 0) + 1)}
                  color={order.color} 
                  weight={3}
                  opacity={0.9}
                />
              )}
            </React.Fragment>
          ))}
        
        <MapUpdater orders={orders} selectedOrder={selectedOrder} />
      </MapContainer>
    </div>
  );
}