import React from 'react';
import { Navigate } from 'react-router-dom';
import { useVendorAuth } from './context/VendorAuthContext';

const VendorProtectedRoute = ({ children }) => {
  const { vendor, loading } = useVendorAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D1117] flex items-center justify-center">
        <div className="text-[#F0F6FC] text-xl">Loading...</div>
      </div>
    );
  }

  return vendor ? children : <Navigate to="/vendor/login" />;
};

export default VendorProtectedRoute;