import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, check for token and user
  useEffect(() => {
    checkAuth();
  }, []);

  const getToken = () => localStorage.getItem('user_token');

  const checkAuth = async () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/check-auth/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success && data.authenticated) {
        setUser(data.user);
      } else {
        setUser(null);
        localStorage.removeItem('user_token');
      }
    } catch (error) {
      setUser(null);
      localStorage.removeItem('user_token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (data.success && data.token) {
        localStorage.setItem('user_token', data.token);
        setUser(data.user);
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      return { success: false, error: 'Network error occurred' };
    }
  };

  const register = async (userData) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      if (data.success && data.token) {
        localStorage.setItem('user_token', data.token);
        setUser(data.user);
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      return { success: false, error: 'Network error occurred' };
    }
  };

  const logout = () => {
    localStorage.removeItem('user_token');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    checkAuth,
    getToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};