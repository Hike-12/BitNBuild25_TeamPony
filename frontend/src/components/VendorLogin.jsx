import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useVendorAuth } from '../context/VendorAuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Store, User, Mail, Lock, Phone, FileText, MapPin, Eye, EyeOff } from 'lucide-react';

const VendorLogin = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    business_name: '',
    business_address: '',
    phone_number: '',
    license_number: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { vendor, login, register } = useVendorAuth();
  const { isDarkMode, toggleTheme, theme } = useTheme();

  if (vendor) {
    return <Navigate to="/vendor/dashboard" />;
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

      if (!formData.business_name.trim()) {
        newErrors.business_name = 'Business name is required';
      }

      if (!formData.business_address.trim()) {
        newErrors.business_address = 'Business address is required';
      }

      if (!formData.phone_number.trim()) {
        newErrors.phone_number = 'Phone number is required';
      }

      if (!formData.license_number.trim()) {
        newErrors.license_number = 'License number is required';
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
        business_name: formData.business_name,
        business_address: formData.business_address,
        phone_number: formData.phone_number,
        license_number: formData.license_number,
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
      business_name: '',
      business_address: '',
      phone_number: '',
      license_number: '',
    });
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4 py-8 transition-all duration-300"
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

      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <div className="mb-6">
            <div 
              className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center shadow-xl"
              style={{ backgroundColor: theme.primary }}
            >
              <Store size={40} color="white" />
            </div>
          </div>
          <h2 
            className="text-4xl font-bold mb-3"
            style={{ color: theme.text }}
          >
            {isLogin ? 'Vendor Portal' : 'Join as Partner'}
          </h2>
          <p 
            className="text-lg"
            style={{ color: theme.textSecondary }}
          >
            {isLogin ? 'Access your business dashboard' : 'Register your business with NourishNet'}
          </p>
        </div>

        <form 
          className="space-y-6 p-10 rounded-3xl shadow-2xl border backdrop-blur-sm"
          style={{ 
            backgroundColor: theme.panels,
            borderColor: theme.border
          }}
          onSubmit={handleSubmit}
        >
          {errors.form && (
            <div 
              className="px-6 py-4 rounded-xl border text-sm font-semibold"
              style={{ 
                backgroundColor: `${theme.error}15`,
                borderColor: theme.error,
                color: theme.error
              }}
            >
              {errors.form}
            </div>
          )}
          
          <div className="space-y-5">
            {/* Username Field */}
            <div>
              <label 
                htmlFor="username" 
                className="block text-sm font-bold mb-3"
                style={{ color: theme.text }}
              >
                Username
              </label>
              <div className="relative">
                <User 
                  size={20} 
                  className="absolute left-4 top-1/2 transform -translate-y-1/2" 
                  style={{ color: theme.textSecondary }}
                />
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:border-opacity-100"
                  style={{ 
                    backgroundColor: theme.background,
                    borderColor: errors.username ? theme.error : theme.border,
                    color: theme.text
                  }}
                  placeholder="Enter your username"
                />
              </div>
              {errors.username && (
                <p className="mt-2 text-sm font-semibold" style={{ color: theme.error }}>
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
                    className="block text-sm font-bold mb-3"
                    style={{ color: theme.text }}
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail 
                      size={20} 
                      className="absolute left-4 top-1/2 transform -translate-y-1/2" 
                      style={{ color: theme.textSecondary }}
                    />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 rounded-xl border-2 transition-all duration-200 focus:outline-none"
                      style={{ 
                        backgroundColor: theme.background,
                        borderColor: errors.email ? theme.error : theme.border,
                        color: theme.text
                      }}
                      placeholder="Enter your email"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-2 text-sm font-semibold" style={{ color: theme.error }}>
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label 
                      htmlFor="first_name" 
                      className="block text-sm font-bold mb-3"
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
                      className="w-full px-4 py-4 rounded-xl border-2 transition-all duration-200 focus:outline-none"
                      style={{ 
                        backgroundColor: theme.background,
                        borderColor: errors.first_name ? theme.error : theme.border,
                        color: theme.text
                      }}
                      placeholder="First name"
                    />
                    {errors.first_name && (
                      <p className="mt-2 text-sm font-semibold" style={{ color: theme.error }}>
                        {errors.first_name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label 
                      htmlFor="last_name" 
                      className="block text-sm font-bold mb-3"
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
                      className="w-full px-4 py-4 rounded-xl border-2 transition-all duration-200 focus:outline-none"
                      style={{ 
                        backgroundColor: theme.background,
                        borderColor: errors.last_name ? theme.error : theme.border,
                        color: theme.text
                      }}
                      placeholder="Last name"
                    />
                    {errors.last_name && (
                      <p className="mt-2 text-sm font-semibold" style={{ color: theme.error }}>
                        {errors.last_name}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label 
                    htmlFor="business_name" 
                    className="block text-sm font-bold mb-3"
                    style={{ color: theme.text }}
                  >
                    Business Name
                  </label>
                  <div className="relative">
                    <Store 
                      size={20} 
                      className="absolute left-4 top-1/2 transform -translate-y-1/2" 
                      style={{ color: theme.textSecondary }}
                    />
                    <input
                      id="business_name"
                      name="business_name"
                      type="text"
                      value={formData.business_name}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 rounded-xl border-2 transition-all duration-200 focus:outline-none"
                      style={{ 
                        backgroundColor: theme.background,
                        borderColor: errors.business_name ? theme.error : theme.border,
                        color: theme.text
                      }}
                      placeholder="Enter your business name"
                    />
                  </div>
                  {errors.business_name && (
                    <p className="mt-2 text-sm font-semibold" style={{ color: theme.error }}>
                      {errors.business_name}
                    </p>
                  )}
                </div>

                <div>
                  <label 
                    htmlFor="business_address" 
                    className="block text-sm font-bold mb-3"
                    style={{ color: theme.text }}
                  >
                    Business Address
                  </label>
                  <div className="relative">
                    <MapPin 
                      size={20} 
                      className="absolute left-4 top-4" 
                      style={{ color: theme.textSecondary }}
                    />
                    <textarea
                      id="business_address"
                      name="business_address"
                      rows="3"
                      value={formData.business_address}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 rounded-xl border-2 transition-all duration-200 focus:outline-none resize-none"
                      style={{ 
                        backgroundColor: theme.background,
                        borderColor: errors.business_address ? theme.error : theme.border,
                        color: theme.text
                      }}
                      placeholder="Enter your complete business address"
                    />
                  </div>
                  {errors.business_address && (
                    <p className="mt-2 text-sm font-semibold" style={{ color: theme.error }}>
                      {errors.business_address}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label 
                      htmlFor="phone_number" 
                      className="block text-sm font-bold mb-3"
                      style={{ color: theme.text }}
                    >
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone 
                        size={20} 
                        className="absolute left-4 top-1/2 transform -translate-y-1/2" 
                        style={{ color: theme.textSecondary }}
                      />
                      <input
                        id="phone_number"
                        name="phone_number"
                        type="text"
                        value={formData.phone_number}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-4 rounded-xl border-2 transition-all duration-200 focus:outline-none"
                        style={{ 
                          backgroundColor: theme.background,
                          borderColor: errors.phone_number ? theme.error : theme.border,
                          color: theme.text
                        }}
                        placeholder="Phone number"
                      />
                    </div>
                    {errors.phone_number && (
                      <p className="mt-2 text-sm font-semibold" style={{ color: theme.error }}>
                        {errors.phone_number}
                      </p>
                    )}
                  </div>

                  <div>
                    <label 
                      htmlFor="license_number" 
                      className="block text-sm font-bold mb-3"
                      style={{ color: theme.text }}
                    >
                      License Number
                    </label>
                    <div className="relative">
                      <FileText 
                        size={20} 
                        className="absolute left-4 top-1/2 transform -translate-y-1/2" 
                        style={{ color: theme.textSecondary }}
                      />
                      <input
                        id="license_number"
                        name="license_number"
                        type="text"
                        value={formData.license_number}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-4 rounded-xl border-2 transition-all duration-200 focus:outline-none"
                        style={{ 
                          backgroundColor: theme.background,
                          borderColor: errors.license_number ? theme.error : theme.border,
                          color: theme.text
                        }}
                        placeholder="License number"
                      />
                    </div>
                    {errors.license_number && (
                      <p className="mt-2 text-sm font-semibold" style={{ color: theme.error }}>
                        {errors.license_number}
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
                className="block text-sm font-bold mb-3"
                style={{ color: theme.text }}
              >
                Password
              </label>
              <div className="relative">
                <Lock 
                  size={20} 
                  className="absolute left-4 top-1/2 transform -translate-y-1/2" 
                  style={{ color: theme.textSecondary }}
                />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-12 pr-14 py-4 rounded-xl border-2 transition-all duration-200 focus:outline-none"
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
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 hover:opacity-70 transition-opacity"
                  style={{ color: theme.textSecondary }}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm font-semibold" style={{ color: theme.error }}>
                  {errors.password}
                </p>
              )}
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 rounded-xl text-white font-bold text-lg transition-all duration-200 hover:transform hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              style={{ 
                backgroundColor: theme.primary,
                boxShadow: `0 8px 32px ${theme.primary}40`
              }}
            >
              {loading 
                ? (isLogin ? 'Signing in...' : 'Registering business...') 
                : (isLogin ? 'Sign In to Dashboard' : 'Register Business')
              }
            </button>
          </div>

          <div className="text-center pt-4">
            <button
              type="button"
              onClick={switchMode}
              className="text-base font-semibold hover:underline transition-all duration-200"
              style={{ color: theme.secondary }}
            >
              {isLogin 
                ? "Don't have a business account? Register" 
                : "Already have an account? Sign in"
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VendorLogin;