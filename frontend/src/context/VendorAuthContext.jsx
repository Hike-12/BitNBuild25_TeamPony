import React, { createContext, useContext, useState, useEffect } from 'react';

const VendorAuthContext = createContext();

export const useVendorAuth = () => {
  const context = useContext(VendorAuthContext);
  if (!context) {
    throw new Error('useVendorAuth must be used within a VendorAuthProvider');
  }
  return context;
};

export const VendorAuthProvider = ({ children }) => {
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkVendorAuth();
  }, []);

  const getToken = () => localStorage.getItem('vendor_token');
  console.log("Vendor Token from getToken:", getToken()); // Debugging line

  const checkVendorAuth = async () => {
    const token = getToken();
    if (!token) {
      setVendor(null);
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/vendor/check-auth/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success && data.authenticated) {
        setVendor(data.vendor);
      } else {
        setVendor(null);
        localStorage.removeItem('vendor_token');
      }
    } catch (error) {
      setVendor(null);
      localStorage.removeItem('vendor_token');
    } finally {
      setLoading(false);
    }
  };

  // in VendorAuthContext.jsx
const login = async (identifier, password) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    });
    const data = await response.json();
    if (data.success && data.token) {
      localStorage.setItem('vendor_token', data.token);
      setVendor(data.vendor);
      return { success: true };
    } else {
      return { success: false, error: data.error };
    }
  } catch (error) {
    return { success: false, error: 'Network error occurred' };
  }
};

  const register = async (vendorData) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vendorData),
      });
      const data = await response.json();
      if (data.success && data.token) {
        localStorage.setItem('vendor_token', data.token);
        setVendor(data.vendor);
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      return { success: false, error: 'Network error occurred' };
    }
  };

  const logout = () => {
    localStorage.removeItem('vendor_token');
    setVendor(null);
  };

  const value = {
    vendor,
    loading,
    login,
    register,
    logout,
    checkVendorAuth,
    getToken,
  };

  return <VendorAuthContext.Provider value={value}>{children}</VendorAuthContext.Provider>;
};