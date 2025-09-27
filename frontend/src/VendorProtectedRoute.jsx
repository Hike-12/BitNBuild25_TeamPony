import React from "react";
import { Navigate } from "react-router-dom";
import { useVendorAuth } from "./context/VendorAuthContext";

const VendorProtectedRoute = ({ children }) => {
  const { vendor, loading } = useVendorAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return vendor ? children : <Navigate to="/vendor/login" />;
};

export default VendorProtectedRoute;
