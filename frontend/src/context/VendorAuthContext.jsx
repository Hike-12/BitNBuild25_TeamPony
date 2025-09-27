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

  // Check authentication status on app load
  useEffect(() => {
    checkVendorAuth();
  }, []);

  const checkVendorAuth = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/vendor/check-auth/`, {
        credentials: 'include',
      });
      const data = await response.json();
      
      if (data.success && data.authenticated) {
        setVendor(data.user);
      } else {
        setVendor(null);
      }
    } catch (error) {
      console.error('Vendor auth check failed:', error);
      setVendor(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/vendor/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        setVendor(data.user);
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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/vendor/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(vendorData),
      });

      const data = await response.json();

      if (data.success) {
        setVendor(data.user);
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      return { success: false, error: 'Network error occurred' };
    }
  };

  const logout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/vendor/logout/`, {
        method: 'GET',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Vendor logout error:', error);
    } finally {
      setVendor(null);
    }
  };

  const value = {
    vendor,
    loading,
    login,
    register,
    logout,
    checkVendorAuth,
  };

  return <VendorAuthContext.Provider value={value}>{children}</VendorAuthContext.Provider>;
};