import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import { format, addMinutes } from 'date-fns';
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
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', 
  '#8B5CF6', '#F97316', '#06B6D4', '#84CC16'
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

// AI Route Optimization Class (Simulating OR-Tools logic)
class RouteOptimizer {
  constructor() {
    this.vehicleCapacity = 10; // Max orders per vehicle
    this.averageSpeed = 25; // km/h in city traffic
  }

  // Calculate distance between two points (Haversine formula)
  calculateDistance(point1, point2) {
    const R = 6371; // Earth's radius in km
    const dLat = (point2[0] - point1[0]) * Math.PI / 180;
    const dLon = (point2[1] - point1[1]) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(point1[0] * Math.PI / 180) * Math.cos(point2[0] * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in km
  }

  // Create distance matrix for all locations
  createDistanceMatrix(locations) {
    const matrix = [];
    for (let i = 0; i < locations.length; i++) {
      matrix[i] = [];
      for (let j = 0; j < locations.length; j++) {
        if (i === j) {
          matrix[i][j] = 0;
        } else {
          matrix[i][j] = this.calculateDistance(locations[i], locations[j]);
        }
      }
    }
    return matrix;
  }

  // Nearest Neighbor Algorithm (simplified TSP solver)
  nearestNeighborTSP(distanceMatrix, startIndex = 0) {
    const n = distanceMatrix.length;
    const visited = new Array(n).fill(false);
    const route = [startIndex];
    visited[startIndex] = true;
    let totalDistance = 0;

    let currentIndex = startIndex;
    for (let i = 0; i < n - 1; i++) {
      let nearestIndex = -1;
      let nearestDistance = Infinity;

      for (let j = 0; j < n; j++) {
        if (!visited[j] && distanceMatrix[currentIndex][j] < nearestDistance) {
          nearestDistance = distanceMatrix[currentIndex][j];
          nearestIndex = j;
        }
      }

      if (nearestIndex !== -1) {
        route.push(nearestIndex);
        visited[nearestIndex] = true;
        totalDistance += nearestDistance;
        currentIndex = nearestIndex;
      }
    }

    return { route, totalDistance };
  }

  // Optimize routes for multiple vehicles (simplified VRP)
  optimizeRoutes(orders, vendorLocation) {
    if (orders.length === 0) return [];

    // Create locations array: [vendor, ...deliveryLocations]
    const locations = [vendorLocation, ...orders.map(order => order.delivery_location)];
    const distanceMatrix = this.createDistanceMatrix(locations);

    // Group orders into vehicles (simple batching)
    const vehicles = [];
    for (let i = 0; i < orders.length; i += this.vehicleCapacity) {
      const batch = orders.slice(i, i + this.vehicleCapacity);
      
      // Create sub-matrix for this batch
      const batchIndices = [0, ...batch.map(order => orders.indexOf(order) + 1)];
      const subMatrix = batchIndices.map(i => 
        batchIndices.map(j => distanceMatrix[i][j])
      );

      // Optimize route for this vehicle
      const { route: optimalRoute, totalDistance } = this.nearestNeighborTSP(subMatrix);
      
      // Convert back to actual locations
      const actualRoute = optimalRoute.map(index => locations[batchIndices[index]]);
      const orderSequence = optimalRoute.slice(1).map(index => batch[index - 1]);

      vehicles.push({
        id: `vehicle-${vehicles.length + 1}`,
        route: actualRoute,
        orders: orderSequence,
        totalDistance,
        estimatedTime: (totalDistance / this.averageSpeed) * 60 // minutes
      });
    }

    return vehicles;
  }

  // Calculate ETA for specific order
  calculateETA(order, currentLocation, trafficFactor = 1.2) {
    const distance = this.calculateDistance(currentLocation, order.delivery_location);
    const timeInMinutes = (distance / this.averageSpeed) * 60 * trafficFactor;
    const eta = addMinutes(new Date(), timeInMinutes);
    return {
      eta,
      estimatedMinutes: Math.round(timeInMinutes),
      distance: distance.toFixed(2)
    };
  }
}

// Enhanced order generation with priority and time windows
function generateOrders(center, n = 5) {
  const priorities = ['high', 'medium', 'low'];
  const timeWindows = [
    { start: '12:00', end: '13:00', label: 'Lunch' },
    { start: '19:00', end: '20:00', label: 'Dinner' },
    { start: '13:00', end: '14:00', label: 'Late Lunch' }
  ];

  return Array.from({ length: n }).map((_, i) => {
    const vendorLoc = randomNearby(center, 0.008);
    const deliveryLoc = randomNearby(center, 0.015);
    const timeWindow = timeWindows[i % timeWindows.length];
    
    return {
      id: `order-${i + 1}`,
      order_number: `#ORD${1000 + i}`,
      vendor_location: vendorLoc,
      delivery_location: deliveryLoc,
      current_location: [...vendorLoc],
      status: 'out_for_delivery',
      color: orderColors[i % orderColors.length],
      icon: createOrderIcon(orderColors[i % orderColors.length]),
      route_points: [],
      current_route_index: 0,
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      time_window: timeWindow,
      customer_name: `Customer ${i + 1}`,
      customer_phone: `+91 9876543${(10 + i).toString().slice(-3)}`,
      order_value: Math.floor(Math.random() * 300) + 150,
      preparation_time: Math.floor(Math.random() * 20) + 10, // minutes
      eta: null,
      estimated_distance: null
    };
  });
}

// Enhanced OSRM route fetching with error handling
async function fetchRoute(from, to) {
  try {
    console.log(`Fetching route from [${from[1]}, ${from[0]}] to [${to[1]}, ${to[0]}]`);
    
    const url = `https://router.project-osrm.org/route/v1/driving/${from[1]},${from[0]};${to[1]},${to[0]}?overview=full&geometries=geojson&steps=true`;
    
    const response = await axios.get(url);
    const data = response.data;
    
    if (data.routes && data.routes[0] && data.routes[0].geometry) {
      const coordinates = data.routes[0].geometry.coordinates;
      const route = coordinates.map(([lng, lat]) => [lat, lng]);
      const duration = data.routes[0].duration / 60; // Convert to minutes
      const distance = data.routes[0].distance / 1000; // Convert to km
      
      console.log(`Route fetched: ${route.length} points, ${distance.toFixed(2)} km, ${duration.toFixed(1)} min`);
      
      return { 
        route, 
        duration: Math.round(duration), 
        distance: distance.toFixed(2) 
      };
    } else {
      throw new Error('No route found');
    }
  } catch (error) {
    console.error('Route fetch failed:', error);
    // Fallback route
    const latDiff = (to[0] - from[0]) / 3;
    const lngDiff = (to[1] - from[1]) / 3;
    const fallbackDistance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111; // Rough km conversion
    
    return {
      route: [
        from,
        [from[0] + latDiff, from[1] + lngDiff],
        [from[0] + latDiff * 2, from[1] + lngDiff * 2],
        to
      ],
      duration: Math.round(fallbackDistance * 2), // Rough estimate
      distance: fallbackDistance.toFixed(2)
    };
  }
}

// Enhanced movement function
function moveAlongRoute(order, step = 0.0002) {
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
  
  const distanceToTarget = Math.sqrt(
    Math.pow(newLocation[0] - currentTarget[0], 2) + 
    Math.pow(newLocation[1] - currentTarget[1], 2)
  );
  
  if (distanceToTarget < 0.0001) {
    order.current_route_index = Math.min(currentIndex + 1, routePoints.length - 1);
  }
  
  return newLocation;
}

function moveTowards(current, target, step = 0.0002) {
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

// MapUpdater component
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

// Main Component
export default function SimulatedBusMap() {
  const center = [28.4595, 77.0266]; // Gurgaon
  const [orders, setOrders] = useState(() => generateOrders(center, 6));
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [routes, setRoutes] = useState({});
  const [optimizedVehicles, setOptimizedVehicles] = useState([]);
  const [routeOptimizer] = useState(new RouteOptimizer());
  const [showOptimization, setShowOptimization] = useState(false);
  const intervalRef = useRef();

  // Fetch routes and optimize on component mount
  useEffect(() => {
    const initializeRoutes = async () => {
      const routePromises = orders.map(async (order) => {
        try {
          const routeData = await fetchRoute(order.vendor_location, order.delivery_location);
          
          // Calculate ETA
          const etaData = routeOptimizer.calculateETA(order, order.vendor_location);
          
          return { 
            orderId: order.id, 
            route: routeData.route,
            duration: routeData.duration,
            distance: routeData.distance,
            eta: etaData
          };
        } catch (error) {
          console.error(`Failed to fetch route for order ${order.id}:`, error);
          return { 
            orderId: order.id, 
            route: [order.vendor_location, order.delivery_location],
            duration: 30,
            distance: "2.5",
            eta: routeOptimizer.calculateETA(order, order.vendor_location)
          };
        }
      });

      const routeResults = await Promise.all(routePromises);
      const newRoutes = {};
      
      // Update orders with route points and ETA
      setOrders(prevOrders => 
        prevOrders.map(order => {
          const routeResult = routeResults.find(r => r.orderId === order.id);
          if (routeResult) {
            newRoutes[order.id] = {
              route: routeResult.route,
              duration: routeResult.duration,
              distance: routeResult.distance
            };
            
            return {
              ...order,
              route_points: routeResult.route,
              current_route_index: 0,
              eta: routeResult.eta.eta,
              estimated_distance: routeResult.distance,
              estimated_time: routeResult.duration
            };
          }
          return order;
        })
      );
      
      setRoutes(newRoutes);

      // Optimize routes
      const vehicles = routeOptimizer.optimizeRoutes(orders, center);
      setOptimizedVehicles(vehicles);
    };

    initializeRoutes();
  }, []);

  // Simulate live GPS movement
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setOrders(prevOrders =>
        prevOrders.map(order => {
          if (order.status === 'delivered') return order;
          
          const nextLoc = moveAlongRoute(order, 0.0001); // Even slower movement
          const distance = Math.sqrt(
            Math.pow(nextLoc[0] - order.delivery_location[0], 2) + 
            Math.pow(nextLoc[1] - order.delivery_location[1], 2)
          );
          
          const delivered = distance < 0.0003;
          
          // Update ETA in real-time
          let updatedETA = order.eta;
          if (!delivered && order.current_location) {
            const etaData = routeOptimizer.calculateETA(
              { delivery_location: order.delivery_location }, 
              nextLoc
            );
            updatedETA = etaData.eta;
          }
          
          return {
            ...order,
            current_location: nextLoc,
            status: delivered ? 'delivered' : 'out_for_delivery',
            eta: updatedETA
          };
        })
      );
    }, 2000); // Update every 2 seconds
    
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div className="w-full h-full relative" style={{ height: '100vh' }}>
      {/* Enhanced Control Panel */}
      <div style={{
        position: 'absolute', top: 16, left: 16, zIndex: 1000, 
        background: 'rgba(255,255,255,0.95)', 
        backdropFilter: 'blur(10px)',
        borderRadius: 12, 
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)', 
        padding: 16, 
        minWidth: 320,
        maxHeight: '80vh',
        overflowY: 'auto',
        border: '1px solid rgba(255,255,255,0.2)'
      }}>
        <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 16 }}>
          🚚 AI Route Optimization & Live Tracking
        </div>
        
        {/* Optimization Toggle */}
        <button
          onClick={() => setShowOptimization(!showOptimization)}
          style={{
            display: 'block', 
            width: '100%', 
            marginBottom: 12, 
            background: showOptimization ? '#10B981' : '#6B7280', 
            color: '#fff', 
            border: 'none', 
            borderRadius: 8, 
            padding: '8px 12px', 
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          🤖 {showOptimization ? 'Hide' : 'Show'} AI Optimization
        </button>

        {/* Optimization Details */}
        {showOptimization && optimizedVehicles.length > 0 && (
          <div style={{ marginBottom: 16, padding: 12, background: 'rgba(16, 185, 129, 0.1)', borderRadius: 8 }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
              🎯 Optimized Routes ({optimizedVehicles.length} vehicles)
            </div>
            {optimizedVehicles.map((vehicle, index) => (
              <div key={vehicle.id} style={{ fontSize: 12, marginBottom: 4, color: '#374151' }}>
                • Vehicle {index + 1}: {vehicle.orders.length} orders, {vehicle.totalDistance.toFixed(1)}km, ~{Math.round(vehicle.estimatedTime)}min
              </div>
            ))}
          </div>
        )}
        
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
          <div key={order.id} style={{ marginBottom: 8 }}>
            <button
              style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%', 
                marginBottom: 4, 
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
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div>{order.order_number} {order.status === 'delivered' ? '✅' : '🚚'}</div>
                <div style={{ fontSize: 11, opacity: 0.8 }}>
                  {order.customer_name} • ₹{order.order_value}
                </div>
              </div>
              <div 
                style={{
                  fontSize: 10,
                  background: order.priority === 'high' ? '#EF4444' : order.priority === 'medium' ? '#F59E0B' : '#6B7280',
                  color: 'white',
                  padding: '2px 6px',
                  borderRadius: 4,
                  marginLeft: 4
                }}
              >
                {order.priority?.toUpperCase()}
              </div>
            </button>
            
            {/* ETA Information */}
            <div style={{
              fontSize: 11,
              padding: '6px 12px',
              background: 'rgba(59, 130, 246, 0.05)',
              borderRadius: 6,
              marginLeft: 8,
              marginRight: 8,
              color: '#374151'
            }}>
              <div>📍 Distance: {order.estimated_distance || 'Calculating...'}km</div>
              <div>⏱️ ETA: {order.eta ? format(new Date(order.eta), 'HH:mm') : 'Calculating...'}</div>
              <div>📞 {order.customer_phone}</div>
              <div>🕐 Window: {order.time_window.label} ({order.time_window.start}-{order.time_window.end})</div>
            </div>
          </div>
        ))}
      </div>

      {/* Map Container */}
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
              <Marker position={order.vendor_location} icon={vendorIcon}>
                <Popup>
                  <div style={{ textAlign: 'center', minWidth: 200 }}>
                    <strong>🏪 Vendor Location</strong><br />
                    <div>{order.order_number}</div>
                    <div style={{ fontSize: 11, marginTop: 4 }}>
                      📍 {order.vendor_location[0].toFixed(5)}, {order.vendor_location[1].toFixed(5)}
                    </div>
                  </div>
                </Popup>
              </Marker>
              
              {/* Delivery destination marker */}
              <Marker position={order.delivery_location} icon={deliveryIcon}>
                <Popup>
                  <div style={{ textAlign: 'center', minWidth: 200 }}>
                    <strong>🏁 Delivery Location</strong><br />
                    <div>{order.customer_name}</div>
                    <div>{order.customer_phone}</div>
                    <div style={{ fontSize: 11, marginTop: 4 }}>
                      📍 {order.delivery_location[0].toFixed(5)}, {order.delivery_location[1].toFixed(5)}
                    </div>
                    <div style={{ marginTop: 8, fontSize: 12 }}>
                      <div>💰 Order Value: ₹{order.order_value}</div>
                      <div>⏱️ ETA: {order.eta ? format(new Date(order.eta), 'HH:mm') : 'Calculating...'}</div>
                      <div>📏 Distance: {order.estimated_distance || 'Calculating...'}km</div>
                    </div>
                  </div>
                </Popup>
              </Marker>
              
              {/* Current location marker (moving) */}
              <Marker position={order.current_location} icon={order.icon}>
                <Popup>
                  <div style={{ textAlign: 'center', minWidth: 250 }}>
                    <strong style={{ color: order.color }}>{order.order_number}</strong><br />
                    <div style={{ margin: '8px 0' }}>
                      Status: <span style={{ 
                        color: order.status === 'delivered' ? '#10B981' : '#F59E0B',
                        fontWeight: 'bold'
                      }}>
                        {order.status === 'delivered' ? '✅ Delivered' : '🚚 Out for Delivery'}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, textAlign: 'left' }}>
                      <div><strong>Customer:</strong> {order.customer_name}</div>
                      <div><strong>Phone:</strong> {order.customer_phone}</div>
                      <div><strong>Value:</strong> ₹{order.order_value}</div>
                      <div><strong>Priority:</strong> {order.priority?.toUpperCase()}</div>
                      <div><strong>Time Window:</strong> {order.time_window.start}-{order.time_window.end}</div>
                      <div><strong>Distance:</strong> {order.estimated_distance}km</div>
                      <div><strong>ETA:</strong> {order.eta ? format(new Date(order.eta), 'HH:mm') : 'Calculating...'}</div>
                    </div>
                    <div style={{ fontSize: 10, marginTop: 8, color: '#6B7280' }}>
                      📍 Current: {order.current_location[0].toFixed(5)}, {order.current_location[1].toFixed(5)}
                    </div>
                  </div>
                </Popup>
              </Marker>
              
              {/* Route polyline for selected order */}
              {selectedOrder === order.id && routes[order.id] && (
                <Polyline 
                  positions={routes[order.id].route} 
                  color={order.color} 
                  weight={4}
                  opacity={0.7}
                  dashArray="8, 8"
                />
              )}
              
              {/* Completed route trail */}
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