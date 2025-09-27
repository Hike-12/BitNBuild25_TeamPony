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

  const checkVendorAuth = async () => {
    const token = getToken();
    // console.log("Checking auth with token:", token ? "exists" : "missing");
    
    if (!token) {
      setVendor(null);
      setLoading(false);
      return;
    }
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/check-auth`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      console.log("Auth check response status:", response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Auth response:", data);
      
      if (data.success && data.authenticated) {
        setVendor(data.vendor);
      } else {
        setVendor(null);
        localStorage.removeItem('vendor_token');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setVendor(null);
      localStorage.removeItem('vendor_token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (identifier, password) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: vendorData.username,
          email: vendorData.email,
          business_name: vendorData.business_name,
          address: vendorData.address,
          phone_number: vendorData.phone_number,
          license_number: vendorData.license_number,
          password: vendorData.password,
        }),
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