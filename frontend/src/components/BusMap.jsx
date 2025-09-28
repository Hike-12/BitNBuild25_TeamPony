import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import MarkerClusterGroup from "@changey/react-leaflet-markercluster";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Helper to generate random coordinates near a center
function randomNearby([lat, lng], radius = 0.01) {
  return [
    lat + (Math.random() - 0.5) * radius,
    lng + (Math.random() - 0.5) * radius
  ];
}

// Custom icon
const orderIcon = new L.DivIcon({
  className: 'custom-order-marker',
  html: `<div style="background: #3B82F6; color: white; border-radius: 50%; width: 35px; height: 35px; display: flex; align-items: center; justify-content: center; font-size: 16px; box-shadow: 0 2px 10px rgba(0,0,0,0.3); border: 2px solid white;">🚚</div>`,
  iconSize: [35, 35],
  iconAnchor: [17, 17],
  popupAnchor: [0, -17]
});

const vendorIcon = new L.DivIcon({
  className: 'custom-vendor-marker',
  html: `<div style="background: #144640; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-size: 16px; box-shadow: 0 2px 10px rgba(0,0,0,0.3); border: 2px solid white;">🏪</div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
  popupAnchor: [0, -15]
});

// Simulate orders
function generateOrders(center, n = 5) {
  return Array.from({ length: n }).map((_, i) => {
    const vendorLoc = randomNearby(center, 0.01);
    const deliveryLoc = randomNearby(center, 0.03);
    return {
      id: `order-${i + 1}`,
      order_number: `#ORD${1000 + i}`,
      vendor_location: vendorLoc,
      delivery_location: deliveryLoc,
      current_location: vendorLoc, // Start at vendor
      status: 'out_for_delivery'
    };
  });
}

// Move current_location slightly toward delivery_location
function moveTowards(current, target, step = 0.001) {
  const [clat, clng] = current;
  const [tlat, tlng] = target;
  const dlat = tlat - clat;
  const dlng = tlng - clng;
  const dist = Math.sqrt(dlat * dlat + dlng * dlng);
  if (dist < step) return target;
  return [clat + (dlat / dist) * step, clng + (dlng / dist) * step];
}

// Fetch route from OSRM
async function fetchRoute(from, to) {
  const url = `https://router.project-osrm.org/route/v1/driving/${from[1]},${from[0]};${to[1]},${to[0]}?overview=full&geometries=geojson`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.routes && data.routes[0]) {
    return data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
  }
  return [];
}

// MapUpdater to fit bounds
function MapUpdater({ orders, selectedOrder }) {
  const map = useMap();
  useEffect(() => {
    if (selectedOrder) {
      const order = orders.find(o => o.id === selectedOrder);
      if (order) {
        map.setView(order.current_location, 14);
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
  const [orders, setOrders] = useState(() => generateOrders(center, 4));
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [routes, setRoutes] = useState({});
  const intervalRef = useRef();

  // Simulate live GPS movement
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setOrders(orders =>
        orders.map(order => {
          if (order.status === 'delivered') return order;
          const nextLoc = moveTowards(order.current_location, order.delivery_location, 0.0015);
          const delivered = nextLoc[0] === order.delivery_location[0] && nextLoc[1] === order.delivery_location[1];
          return {
            ...order,
            current_location: nextLoc,
            status: delivered ? 'delivered' : 'out_for_delivery'
          };
        })
      );
    }, 2000);
    return () => clearInterval(intervalRef.current);
  }, []);

  // Fetch route for selected order
  useEffect(() => {
    if (!selectedOrder) return;
    const order = orders.find(o => o.id === selectedOrder);
    if (!order) return;
    fetchRoute(order.current_location, order.delivery_location).then(route => {
      setRoutes(r => ({ ...r, [order.id]: route }));
    });
  }, [selectedOrder, orders]);

  return (
    <div className="w-full h-full relative" style={{ height: '100vh' }}>
      {/* Order selection */}
      <div style={{
        position: 'absolute', top: 16, left: 16, zIndex: 1000, background: 'white', borderRadius: 8, boxShadow: '0 2px 8px #0002', padding: 12, minWidth: 220
      }}>
        <div style={{ fontWeight: 700, marginBottom: 8 }}>Orders</div>
        <button
          style={{
            display: 'block', width: '100%', marginBottom: 6, background: selectedOrder ? '#eee' : '#3B82F6', color: selectedOrder ? '#222' : '#fff', border: 'none', borderRadius: 4, padding: 6, fontWeight: 500
          }}
          onClick={() => setSelectedOrder(null)}
        >
          Show All Orders
        </button>
        {orders.map(order => (
          <button
            key={order.id}
            style={{
              display: 'block', width: '100%', marginBottom: 6, background: selectedOrder === order.id ? '#3B82F6' : '#eee', color: selectedOrder === order.id ? '#fff' : '#222', border: 'none', borderRadius: 4, padding: 6
            }}
            onClick={() => setSelectedOrder(order.id)}
          >
            {order.order_number} {order.status === 'delivered' ? '✅' : ''}
          </button>
        ))}
      </div>

      <MapContainer
        key={`${selectedOrder || 'all'}-${orders.length}`}
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

        <MarkerClusterGroup chunkedLoading>
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
                    Vendor Location<br />
                    {order.vendor_location[0].toFixed(5)}, {order.vendor_location[1].toFixed(5)}
                  </Popup>
                </Marker>
                {/* Delivery marker */}
                <Marker
                  position={order.delivery_location}
                  icon={orderIcon}
                >
                  <Popup>
                    Delivery Location<br />
                    {order.delivery_location[0].toFixed(5)}, {order.delivery_location[1].toFixed(5)}
                  </Popup>
                </Marker>
                {/* Current location marker */}
                <Marker
                  position={order.current_location}
                  icon={orderIcon}
                >
                  <Popup>
                    {order.order_number}<br />
                    Status: {order.status}<br />
                    Current: {order.current_location[0].toFixed(5)}, {order.current_location[1].toFixed(5)}
                  </Popup>
                </Marker>
                {/* Route polyline */}
                {selectedOrder === order.id && routes[order.id] && (
                  <Polyline positions={routes[order.id]} color="#3B82F6" weight={5} />
                )}
              </React.Fragment>
            ))}
        </MarkerClusterGroup>
        <MapUpdater orders={orders} selectedOrder={selectedOrder} />
      </MapContainer>
    </div>
  );
}