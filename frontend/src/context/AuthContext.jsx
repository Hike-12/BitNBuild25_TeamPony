import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext({});
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper function to get auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('userToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    };
  };

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('userToken');
    console.log("Checking auth with token in user:", token ? "exists" : "missing");
    if (!token) {
      setLoading(false);
      return;
    }
    setUser(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null);
  };

  const login = async (username, password) => {
    try {
      const response = await fetch(`${API_URL}/api/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();
      console.log(data);
      console.log("Login response data:", data);

      if (data.success && data.token) {
        // Store the token
        localStorage.setItem('userToken', data.token);
        localStorage.setItem('vendor_token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        console.log(data.token);
        
        // Set the user data
        setUser(data.user);
        
        return { success: true };
      } else {
        return { 
          success: false, 
          error: data.error || 'Login failed' 
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: 'Network error. Please try again.' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await fetch(`${API_URL}/api/user/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: userData.username,
          email: userData.email,
          password: userData.password,
          first_name: userData.first_name,
          last_name: userData.last_name
        })
      });

      const data = await response.json();

      if (data.success && data.token) {
        // Store the token
        localStorage.setItem('userToken', data.token);
        
        // Set the user data
        setUser(data.user);
        
        return { success: true };
      } else {
        return { 
          success: false, 
          error: data.error || 'Registration failed' 
        };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: 'Network error. Please try again.' 
      };
    }
  };

  const logout = async () => {
      // Clear token and user data
      localStorage.removeItem('userToken');
      setUser(null);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        login, 
        register, 
        logout, 
        checkAuth,
        getAuthHeaders 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};