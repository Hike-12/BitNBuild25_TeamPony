import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { user, login, register } = useAuth();
  const { isDarkMode, toggleTheme, theme } = useTheme();

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: '',
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!isLogin) {
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid';
      }

      if (!formData.first_name.trim()) {
        newErrors.first_name = 'First name is required';
      }

      if (!formData.last_name.trim()) {
        newErrors.last_name = 'Last name is required';
      }
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!isLogin && formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    let result;

    if (isLogin) {
      result = await login(formData.username, formData.password);
    } else {
      result = await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        first_name: formData.first_name,
        last_name: formData.last_name,
      });
    }
    
    if (!result.success) {
      setErrors({ form: result.error });
    }
    setLoading(false);
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setFormData({
      username: '',
      email: '',
      password: '',
      first_name: '',
      last_name: '',
    });
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4 transition-all duration-300"
      style={{ backgroundColor: theme.background }}
    >
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="fixed top-6 right-6 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-10"
        style={{ 
          backgroundColor: theme.panels,
          color: theme.text,
          border: `1px solid ${theme.border}`
        }}
      >
        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mb-6">
            <div 
              className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center shadow-lg"
              style={{ backgroundColor: theme.primary }}
            >
              <User size={32} color="white" />
            </div>
          </div>
          <h2 
            className="text-3xl font-bold mb-2"
            style={{ color: theme.text }}
          >
            {isLogin ? 'Welcome Back' : 'Join NourishNet'}
          </h2>
          <p 
            className="text-sm"
            style={{ color: theme.textSecondary }}
          >
            {isLogin ? 'Sign in to your account' : 'Create your account to get started'}
          </p>
        </div>

        <form 
          className="space-y-6 p-8 rounded-2xl shadow-xl border backdrop-blur-sm"
          style={{ 
            backgroundColor: theme.panels,
            borderColor: theme.border
          }}
          onSubmit={handleSubmit}
        >
          {errors.form && (
            <div 
              className="px-4 py-3 rounded-lg border text-sm font-medium"
              style={{ 
                backgroundColor: `${theme.error}15`,
                borderColor: theme.error,
                color: theme.error
              }}
            >
              {errors.form}
            </div>
          )}
          
          <div className="space-y-4">
            {/* Username Field */}
            <div>
              <label 
                htmlFor="username" 
                className="block text-sm font-semibold mb-2"
                style={{ color: theme.text }}
              >
                Username
              </label>
              <div className="relative">
                <User 
                  size={18} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2" 
                  style={{ color: theme.textSecondary }}
                />
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                  style={{ 
                    backgroundColor: theme.background,
                    borderColor: errors.username ? theme.error : theme.border,
                    color: theme.text,
                    focusRingColor: theme.primary
                  }}
                  placeholder="Enter your username"
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-sm font-medium" style={{ color: theme.error }}>
                  {errors.username}
                </p>
              )}
            </div>

            {/* Signup Only Fields */}
            {!isLogin && (
              <>
                <div>
                  <label 
                    htmlFor="email" 
                    className="block text-sm font-semibold mb-2"
                    style={{ color: theme.text }}
                  >
                    Email
                  </label>
                  <div className="relative">
                    <Mail 
                      size={18} 
                      className="absolute left-3 top-1/2 transform -translate-y-1/2" 
                      style={{ color: theme.textSecondary }}
                    />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                      style={{ 
                        backgroundColor: theme.background,
                        borderColor: errors.email ? theme.error : theme.border,
                        color: theme.text
                      }}
                      placeholder="Enter your email"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm font-medium" style={{ color: theme.error }}>
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label 
                      htmlFor="first_name" 
                      className="block text-sm font-semibold mb-2"
                      style={{ color: theme.text }}
                    >
                      First Name
                    </label>
                    <input
                      id="first_name"
                      name="first_name"
                      type="text"
                      value={formData.first_name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                      style={{ 
                        backgroundColor: theme.background,
                        borderColor: errors.first_name ? theme.error : theme.border,
                        color: theme.text
                      }}
                      placeholder="First name"
                    />
                    {errors.first_name && (
                      <p className="mt-1 text-sm font-medium" style={{ color: theme.error }}>
                        {errors.first_name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label 
                      htmlFor="last_name" 
                      className="block text-sm font-semibold mb-2"
                      style={{ color: theme.text }}
                    >
                      Last Name
                    </label>
                    <input
                      id="last_name"
                      name="last_name"
                      type="text"
                      value={formData.last_name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                      style={{ 
                        backgroundColor: theme.background,
                        borderColor: errors.last_name ? theme.error : theme.border,
                        color: theme.text
                      }}
                      placeholder="Last name"
                    />
                    {errors.last_name && (
                      <p className="mt-1 text-sm font-medium" style={{ color: theme.error }}>
                        {errors.last_name}
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Password Field */}
            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-semibold mb-2"
                style={{ color: theme.text }}
              >
                Password
              </label>
              <div className="relative">
                <Lock 
                  size={18} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2" 
                  style={{ color: theme.textSecondary }}
                />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-12 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                  style={{ 
                    backgroundColor: theme.background,
                    borderColor: errors.password ? theme.error : theme.border,
                    color: theme.text
                  }}
                  placeholder={isLogin ? "Enter your password" : "Create a password (min 8 characters)"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:opacity-70 transition-opacity"
                  style={{ color: theme.textSecondary }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm font-medium" style={{ color: theme.error }}>
                  {errors.password}
                </p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-lg text-white font-semibold transition-all duration-200 hover:transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              style={{ 
                backgroundColor: theme.primary,
                boxShadow: `0 4px 20px ${theme.primary}30`
              }}
            >
              {loading 
                ? (isLogin ? 'Signing in...' : 'Creating account...') 
                : (isLogin ? 'Sign In' : 'Create Account')
              }
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={switchMode}
              className="text-sm font-medium hover:underline transition-all duration-200"
              style={{ color: theme.secondary }}
            >
              {isLogin 
                ? "Don't have an account? Sign up" 
                : "Already have an account? Sign in"
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;