import React from "react";
import { Navigate } from "react-router-dom";
import { useVendorAuth } from "./context/VendorAuthContext";

const VendorProtectedRoute = ({ children }) => {
  const { vendor, loading } = useVendorAuth();

  console.log("ProtectedRoute - vendor:", vendor, "loading:", loading);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Loading authentication...</div>
      </div>
    );
  }

  if (!vendor) {
    console.log("No vendor found, redirecting to login");
    return <Navigate to="/vendor/login" replace />;
  }

  return children;
};

export default VendorProtectedRoute;