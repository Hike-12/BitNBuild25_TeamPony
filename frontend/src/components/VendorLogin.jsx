import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useVendorAuth } from '../context/VendorAuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Store, User, Mail, Lock, Phone, FileText, MapPin, Eye, EyeOff, Crown, Building2, Shield, Briefcase } from 'lucide-react';
import Footer from './Footer';

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

  // Validation logic (move outside of JSX)
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
    
    if (!validateForm()) {
      toast.error('Please fix the form errors');
      return;
    }

    setLoading(true);
    let result;

    const loadingToast = toast.loading(
      isLogin ? 'Signing you in...' : 'Registering your business...'
    );

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
        address: formData.business_address,
        phone_number: formData.phone_number,
        license_number: formData.license_number,
      });
    }

    toast.dismiss(loadingToast);
    
    if (result.success) {
      toast.success(
        isLogin 
          ? `Welcome back, ${formData.username}! Business portal accessed successfully` 
          : 'Business registered successfully! Welcome to NourishNet Business Partner Network'
      );
    }
    setLoading(false);
  };

  const switchMode = () => {
    setIsLogin((prev) => !prev);
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
    setErrors({});
  };

  return (
    <>
    <div 
      className="min-h-screen relative flex items-center justify-center px-4 py-8 transition-all duration-500"
      style={{ 
        backgroundColor: theme.background,
        backgroundImage: `
          ${isDarkMode 
            ? 'url("https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")' // pizza
            : 'url("https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")' // burger, vibrant and visible
          },
          radial-gradient(circle at 20% 80%, ${theme.secondary}15 0%, transparent 60%), 
          radial-gradient(circle at 80% 20%, ${theme.primary}12 0%, transparent 60%),
          radial-gradient(circle at 40% 40%, ${theme.secondary}10 0%, transparent 60%)
        `,
        backgroundSize: 'cover, 100% 100%, 100% 100%, 100% 100%',
        backgroundPosition: 'center, center, center, center',
        backgroundBlendMode: isDarkMode ? 'overlay, normal, normal, normal' : 'normal, normal, normal, normal'
      }}
    >
      {/* Theme Toggle Button - Top Right */}
      <button
        onClick={toggleTheme}
        className="absolute top-8 right-8 z-30 p-3 rounded-full shadow-lg border-2 backdrop-blur-md transition-all duration-300 hover:scale-110"
        style={{
          backgroundColor: isDarkMode ? `${theme.secondary}20` : `${theme.primary}10`,
          borderColor: isDarkMode ? `${theme.secondary}50` : `${theme.primary}40`,
          color: isDarkMode ? theme.secondary : theme.primary,
        }}
        aria-label="Toggle theme"
      >
        {isDarkMode ? <Sun size={22} /> : <Moon size={22} />}
      </button>
      {/* Premium Background Overlay */}
      <div 
        className="absolute inset-0"
        style={{
          background: isDarkMode 
            ? `linear-gradient(135deg, rgba(3, 3, 3, 0.75) 0%, rgba(23, 41, 34, 0.70) 100%)`
            : `linear-gradient(135deg, rgba(253, 253, 247, 0.58) 0%, rgba(245, 248, 242, 0.12) 100%)` // nearly transparent overlay for light mode
        }}
      ></div>

      {/* Premium Background Pattern */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='${theme.primary.replace('#', '%23')}' fill-opacity='0.15'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Floating Business Elements */}
      <div className="absolute top-16 left-8 animate-pulse">
        <div 
          className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl backdrop-blur-sm border"
          style={{ 
            backgroundColor: `${theme.primary}15`,
            borderColor: `${theme.primary}30`
          }}
        >
          <Building2 size={24} style={{ color: theme.primary }} />
        </div>
      </div>
      <div className="absolute top-24 right-16 animate-pulse delay-500">
        <div 
          className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg backdrop-blur-sm border"
          style={{ 
            backgroundColor: `${theme.secondary}15`,
            borderColor: `${theme.secondary}30`
          }}
        >
          <Shield size={18} style={{ color: theme.secondary }} />
        </div>
      </div>
      <div className="absolute bottom-28 left-12 animate-pulse delay-1000">
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg backdrop-blur-sm border"
          style={{ 
            backgroundColor: `${theme.primary}12`,
            borderColor: `${theme.primary}25`
          }}
        >
          <Briefcase size={20} style={{ color: theme.primary }} />
        </div>
      </div>

      {/* Consumer Login Link - Enhanced */}
      <Link
        to="/login"
        className="fixed top-6 left-6 px-6 py-3 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 z-20 text-sm font-bold backdrop-blur-md border-2 flex items-center gap-2 group"
        style={{ 
          backgroundColor: isDarkMode 
            ? `rgba(168, 85, 247, 0.15)` 
            : `rgba(168, 85, 247, 0.1)`,
          color: theme.primary,
          borderColor: isDarkMode 
            ? `${theme.primary}50` 
            : `${theme.primary}40`,
          boxShadow: isDarkMode 
            ? `0 8px 32px rgba(168, 85, 247, 0.3)` 
            : `0 8px 32px rgba(168, 85, 247, 0.2)`
        }}
      >
        <User size={18} />
        ← Consumer Portal
      </Link>

      <div className="max-w-2xl w-full space-y-8 relative z-10">
        {/* Premium Header */}
        <div className="text-center">
          <div className="mb-8 relative">
            {/* Main Business Icon */}
            <div 
              className="w-24 h-24 mx-auto rounded-3xl flex items-center justify-center shadow-2xl border-4 mb-6 relative overflow-hidden group"
              style={{ 
                background: `linear-gradient(135deg, ${theme.secondary} 0%, ${theme.primary} 100%)`,
                borderColor: isDarkMode 
                  ? `${theme.secondary}60` 
                  : `${theme.secondary}40`,
                boxShadow: isDarkMode 
                  ? `0 20px 60px rgba(0, 0, 0, 0.7), 0 0 40px ${theme.secondary}40` 
                  : `0 20px 60px ${theme.secondary}30, 0 0 30px ${theme.secondary}20`,
                animation: 'luxuryPulse 3s ease-in-out infinite'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
              <Store size={42} color="white" className="relative z-10" />
            </div>
            
            {/* Business Brand Name */}
            <div className="flex items-center justify-center gap-3 mb-3">
              <Building2 size={28} style={{ color: theme.secondary }} />
              <h1 
                className="text-3xl font-bold"
                style={{ 
                  color: theme.secondary,
                  fontFamily: 'Playfair Display, serif',
                  letterSpacing: '0.5px'
                }}
              >
                NourishNet Business
              </h1>
              <Building2 size={28} style={{ color: theme.secondary }} />
            </div>
          </div>
          
          <h2 
            className="text-4xl font-bold mb-4"
            style={{ 
              color: isDarkMode ? '#FFFFFF' : '#1A1A1A',
              fontFamily: 'Playfair Display, serif',
              letterSpacing: '-0.5px',
              textShadow: isDarkMode 
                ? '2px 2px 8px rgba(0, 0, 0, 0.9), 0 0 20px rgba(0, 0, 0, 0.8)' 
                : '2px 2px 8px rgba(255, 255, 255, 0.9), 0 0 20px rgba(255, 255, 255, 0.8)'
            }}
          >
            {isLogin ? 'Business Portal Access' : 'Elite Partnership'}
          </h2>
          <p 
            className="text-lg leading-relaxed max-w-md mx-auto mb-2"
            style={{ color: theme.textSecondary }}
          >
            {isLogin 
              ? 'Access your premium business dashboard and manage your culinary enterprise' 
              : 'Join our exclusive network of distinguished culinary establishments and premium food partners'
            }
          </p>
          
          {/* Business Features Badge */}
          <div 
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full backdrop-blur-sm border shadow-lg mt-4 mb-6"
            style={{
              backgroundColor: `${theme.secondary}10`,
              borderColor: `${theme.secondary}30`,
              color: theme.secondary,
            }}
          >
            <Shield size={16} />
            <span className="text-sm font-semibold tracking-wide">
              {isLogin ? 'Verified Business Access' : 'Premium Partner Registration'}
            </span>
            <Crown size={16} />
          </div>
          
          {/* Decorative Elements */}
          <div className="flex justify-center gap-4 mt-6 mb-8">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: theme.secondary }}></div>
            <div className="w-2 h-2 rounded-full animate-pulse delay-300" style={{ backgroundColor: theme.primary }}></div>
            <div className="w-2 h-2 rounded-full animate-pulse delay-700" style={{ backgroundColor: theme.secondary }}></div>
          </div>
        </div>

        <form 
          className="space-y-6 p-10 rounded-3xl shadow-2xl border-2 backdrop-blur-md relative overflow-hidden glass-effect luxury-hover"
          style={{ 
            backgroundColor: isDarkMode 
              ? `rgba(23, 41, 34, 0.98)` 
              : `rgba(245, 248, 242, 0.96)`,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderColor: isDarkMode 
              ? `${theme.secondary}50` 
              : `${theme.secondary}40`,
            boxShadow: isDarkMode 
              ? `0 25px 80px rgba(0, 0, 0, 0.6), 0 0 0 1px ${theme.secondary}30` 
              : `0 25px 80px rgba(0, 0, 0, 0.15), 0 0 0 1px ${theme.secondary}20`
          }}
          onSubmit={handleSubmit}
        >
          {/* Form Background Pattern */}
          <div 
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, ${theme.secondary} 2px, transparent 2px),
                               radial-gradient(circle at 75% 75%, ${theme.primary} 1px, transparent 1px)`,
              backgroundSize: '32px 32px, 24px 24px'
            }}
          />
          
          {/* Premium Form Header */}
          <div className="text-center mb-8 relative z-10">
            <div 
              className="inline-flex items-center gap-2 px-6 py-2 rounded-full backdrop-blur-md border shadow-xl mb-4"
              style={{
                backgroundColor: isDarkMode 
                  ? `rgba(23, 41, 34, 0.95)` 
                  : `rgba(245, 248, 242, 0.95)`,
                borderColor: isDarkMode 
                  ? `${theme.secondary}70` 
                  : `${theme.secondary}60`,
                color: theme.secondary,
                boxShadow: isDarkMode 
                  ? '0 8px 32px rgba(0, 0, 0, 0.6)' 
                  : '0 8px 32px rgba(0, 0, 0, 0.2)'
              }}
            >
              <Briefcase size={16} />
              <span className="text-xs font-semibold tracking-wide uppercase">
                {isLogin ? 'Business Access' : 'Partner Registration'}
              </span>
              <Store size={16} />
            </div>
          </div>
          
          <div className="space-y-6 relative z-10">
            {/* Username Field - Enhanced */}
            <div className="group">
              <label 
                htmlFor="username" 
                className="flex text-sm font-bold mb-3 items-center gap-2"
                style={{ color: isDarkMode ? '#ECEFF1' : '#1A1A1A' }}
              >
                <User size={16} style={{ color: theme.secondary }} />
                Business Username
              </label>
              <div className="relative">
                <div 
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${theme.secondary}15` }}
                >
                  <User 
                    size={14} 
                    style={{ color: theme.secondary }}
                  />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full pl-14 pr-6 py-4 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-opacity-20 backdrop-blur-sm font-medium"
                  style={{ 
                    backgroundColor: isDarkMode 
                      ? `rgba(34, 53, 42, 0.85)` 
                      : `rgba(245, 248, 242, 0.98)`,
                    backdropFilter: 'blur(10px)',
                    borderColor: errors.username 
                      ? theme.error 
                      : isDarkMode 
                        ? `${theme.secondary}50` 
                        : `${theme.secondary}70`,
                    color: isDarkMode ? '#ECEFF1' : '#1A1A1A',
                    boxShadow: errors.username 
                      ? `0 0 0 4px ${theme.error}20` 
                      : isDarkMode 
                        ? `0 8px 24px rgba(0, 0, 0, 0.4)` 
                        : `0 8px 24px rgba(0, 0, 0, 0.15)`
                  }}
                  placeholder="Enter your business username"
                />
                <div 
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    backgroundColor: formData.username ? theme.secondary : 'transparent',
                    opacity: formData.username ? 1 : 0
                  }}
                />
              </div>
              {errors.username && (
                <p className="mt-2 text-sm font-semibold flex items-center gap-2" style={{ color: theme.error }}>
                  <span className="w-1 h-1 rounded-full" style={{ backgroundColor: theme.error }} />
                  {errors.username}
                </p>
              )}
            </div>

            {/* Signup Fields */}
            {!isLogin && (
              <>
                <div className="group">
                  <label 
                    htmlFor="email" 
                    className="flex text-sm font-bold mb-3 items-center gap-2"
                    style={{ color: isDarkMode ? '#ECEFF1' : '#1A1A1A' }}
                  >
                    <Mail size={16} style={{ color: theme.primary }} />
                    Business Email
                  </label>
                  <div className="relative">
                    <div 
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${theme.primary}15` }}
                    >
                      <Mail 
                        size={14} 
                        style={{ color: theme.primary }}
                      />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-14 pr-6 py-4 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-opacity-20 backdrop-blur-sm font-medium"
                      style={{ 
                        backgroundColor: isDarkMode 
                          ? `rgba(51, 65, 85, 0.85)` 
                          : `rgba(248, 250, 252, 0.95)`,
                        borderColor: errors.email 
                          ? theme.error 
                          : isDarkMode 
                            ? `${theme.primary}50` 
                            : `${theme.primary}60`,
                        color: isDarkMode ? '#ECEFF1' : '#1A1A1A',
                        boxShadow: errors.email 
                          ? `0 0 0 4px ${theme.error}20` 
                          : isDarkMode 
                            ? `0 8px 24px rgba(0, 0, 0, 0.4)` 
                            : `0 8px 24px rgba(0, 0, 0, 0.1)`
                      }}
                      placeholder="Enter your business email address"
                    />
                    <div 
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        backgroundColor: formData.email ? theme.primary : 'transparent',
                        opacity: formData.email ? 1 : 0
                      }}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-2 text-sm font-semibold flex items-center gap-2" style={{ color: theme.error }}>
                      <span className="w-1 h-1 rounded-full" style={{ backgroundColor: theme.error }} />
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="group">
                    <label 
                      htmlFor="first_name" 
                      className="block text-sm font-bold mb-3"
                      style={{ color: isDarkMode ? '#ECEFF1' : '#1A1A1A' }}
                    >
                      Owner First Name
                    </label>
                    <input
                      id="first_name"
                      name="first_name"
                      type="text"
                      value={formData.first_name}
                      onChange={handleChange}
                      className="w-full px-5 py-4 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-opacity-20 backdrop-blur-sm font-medium"
                      style={{ 
                        backgroundColor: isDarkMode 
                          ? `rgba(51, 65, 85, 0.85)` 
                          : `rgba(248, 250, 252, 0.95)`,
                        borderColor: errors.first_name 
                          ? theme.error 
                          : isDarkMode 
                            ? `${theme.secondary}40` 
                            : `${theme.secondary}50`,
                        color: isDarkMode ? '#ECEFF1' : '#1A1A1A',
                        boxShadow: isDarkMode 
                          ? `0 6px 20px rgba(0, 0, 0, 0.4)` 
                          : `0 6px 20px rgba(0, 0, 0, 0.08)`
                      }}
                      placeholder="Owner's first name"
                    />
                    {errors.first_name && (
                      <p className="mt-2 text-sm font-semibold flex items-center gap-2" style={{ color: theme.error }}>
                        <span className="w-1 h-1 rounded-full" style={{ backgroundColor: theme.error }} />
                        {errors.first_name}
                      </p>
                    )}
                  </div>

                  <div className="group">
                    <label 
                      htmlFor="last_name" 
                      className="block text-sm font-bold mb-3"
                      style={{ color: isDarkMode ? '#ECEFF1' : '#1A1A1A' }}
                    >
                      Owner Last Name
                    </label>
                    <input
                      id="last_name"
                      name="last_name"
                      type="text"
                      value={formData.last_name}
                      onChange={handleChange}
                      className="w-full px-5 py-4 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-opacity-20 backdrop-blur-sm font-medium"
                      style={{ 
                        backgroundColor: isDarkMode 
                          ? `rgba(51, 65, 85, 0.85)` 
                          : `rgba(248, 250, 252, 0.95)`,
                        borderColor: errors.last_name 
                          ? theme.error 
                          : isDarkMode 
                            ? `${theme.secondary}40` 
                            : `${theme.secondary}50`,
                        color: isDarkMode ? '#ECEFF1' : '#1A1A1A',
                        boxShadow: isDarkMode 
                          ? `0 6px 20px rgba(0, 0, 0, 0.4)` 
                          : `0 6px 20px rgba(0, 0, 0, 0.08)`
                      }}
                      placeholder="Owner's last name"
                    />
                    {errors.last_name && (
                      <p className="mt-2 text-sm font-semibold flex items-center gap-2" style={{ color: theme.error }}>
                        <span className="w-1 h-1 rounded-full" style={{ backgroundColor: theme.error }} />
                        {errors.last_name}
                      </p>
                    )}
                  </div>
                </div>

                <div className="group">
                  <label 
                    htmlFor="business_name" 
                    className="flex text-sm font-bold mb-3 items-center gap-2"
                    style={{ color: isDarkMode ? '#ECEFF1' : '#1A1A1A' }}
                  >
                    <Store size={16} style={{ color: theme.secondary }} />
                    Business Name
                  </label>
                  <div className="relative">
                    <div 
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${theme.secondary}15` }}
                    >
                      <Store 
                        size={14} 
                        style={{ color: theme.secondary }}
                      />
                    </div>
                    <input
                      id="business_name"
                      name="business_name"
                      type="text"
                      value={formData.business_name}
                      onChange={handleChange}
                      className="w-full pl-14 pr-6 py-4 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-opacity-20 backdrop-blur-sm font-medium"
                      style={{ 
                        backgroundColor: isDarkMode 
                          ? `rgba(51, 65, 85, 0.85)` 
                          : `rgba(248, 250, 252, 0.95)`,
                        borderColor: errors.business_name 
                          ? theme.error 
                          : isDarkMode 
                            ? `${theme.secondary}50` 
                            : `${theme.secondary}60`,
                        color: isDarkMode ? '#ECEFF1' : '#1A1A1A',
                        boxShadow: errors.business_name 
                          ? `0 0 0 4px ${theme.error}20` 
                          : isDarkMode 
                            ? `0 8px 24px rgba(0, 0, 0, 0.4)` 
                            : `0 8px 24px rgba(0, 0, 0, 0.1)`
                      }}
                      placeholder="Enter your distinguished business name"
                    />
                    <div 
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        backgroundColor: formData.business_name ? theme.secondary : 'transparent',
                        opacity: formData.business_name ? 1 : 0
                      }}
                    />
                  </div>
                  {errors.business_name && (
                    <p className="mt-2 text-sm font-semibold flex items-center gap-2" style={{ color: theme.error }}>
                      <span className="w-1 h-1 rounded-full" style={{ backgroundColor: theme.error }} />
                      {errors.business_name}
                    </p>
                  )}
                </div>

                <div className="group">
                  <label 
                    htmlFor="business_address" 
                    className="flex text-sm font-bold mb-3 items-center gap-2"
                    style={{ color: isDarkMode ? '#ECEFF1' : '#1A1A1A' }}
                  >
                    <MapPin size={16} style={{ color: theme.primary }} />
                    Business Address
                  </label>
                  <div className="relative">
                    <div 
                      className="absolute left-4 top-4 w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${theme.primary}15` }}
                    >
                      <MapPin 
                        size={14} 
                        style={{ color: theme.primary }}
                      />
                    </div>
                    <textarea
                      id="business_address"
                      name="business_address"
                      rows="3"
                      value={formData.business_address}
                      onChange={handleChange}
                      className="w-full pl-14 pr-6 py-4 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-opacity-20 backdrop-blur-sm font-medium resize-none"
                      style={{ 
                        backgroundColor: isDarkMode 
                          ? `rgba(51, 65, 85, 0.85)` 
                          : `rgba(248, 250, 252, 0.95)`,
                        borderColor: errors.business_address 
                          ? theme.error 
                          : isDarkMode 
                            ? `${theme.primary}50` 
                            : `${theme.primary}60`,
                        color: isDarkMode ? '#ECEFF1' : '#1A1A1A',
                        boxShadow: errors.business_address 
                          ? `0 0 0 4px ${theme.error}20` 
                          : isDarkMode 
                            ? `0 8px 24px rgba(0, 0, 0, 0.4)` 
                            : `0 8px 24px rgba(0, 0, 0, 0.1)`
                      }}
                      placeholder="Enter your complete business address including city, state, and postal code"
                    />
                    <div 
                      className="absolute right-4 top-4 w-2 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        backgroundColor: formData.business_address ? theme.primary : 'transparent',
                        opacity: formData.business_address ? 1 : 0
                      }}
                    />
                  </div>
                  {errors.business_address && (
                    <p className="mt-2 text-sm font-semibold flex items-center gap-2" style={{ color: theme.error }}>
                      <span className="w-1 h-1 rounded-full" style={{ backgroundColor: theme.error }} />
                      {errors.business_address}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="group">
                    <label 
                      htmlFor="phone_number" 
                      className="flex text-sm font-bold mb-3 items-center gap-2"
                      style={{ color: isDarkMode ? '#ECEFF1' : '#1A1A1A' }}
                    >
                      <Phone size={16} style={{ color: theme.secondary }} />
                      Business Phone
                    </label>
                    <div className="relative">
                      <div 
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${theme.secondary}15` }}
                      >
                        <Phone 
                          size={14} 
                          style={{ color: theme.secondary }}
                        />
                      </div>
                      <input
                        id="phone_number"
                        name="phone_number"
                        type="text"
                        value={formData.phone_number}
                        onChange={handleChange}
                        className="w-full pl-14 pr-6 py-4 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-opacity-20 backdrop-blur-sm font-medium"
                        style={{ 
                          backgroundColor: isDarkMode 
                            ? `rgba(51, 65, 85, 0.85)` 
                            : `rgba(248, 250, 252, 0.95)`,
                          borderColor: errors.phone_number 
                            ? theme.error 
                            : isDarkMode 
                              ? `${theme.secondary}50` 
                              : `${theme.secondary}60`,
                          color: isDarkMode ? '#ECEFF1' : '#1A1A1A',
                          boxShadow: isDarkMode 
                            ? `0 6px 20px rgba(0, 0, 0, 0.4)` 
                            : `0 6px 20px rgba(0, 0, 0, 0.08)`
                        }}
                        placeholder="Business phone number"
                      />
                      <div 
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          backgroundColor: formData.phone_number ? theme.secondary : 'transparent',
                          opacity: formData.phone_number ? 1 : 0
                        }}
                      />
                    </div>
                    {errors.phone_number && (
                      <p className="mt-2 text-sm font-semibold flex items-center gap-2" style={{ color: theme.error }}>
                        <span className="w-1 h-1 rounded-full" style={{ backgroundColor: theme.error }} />
                        {errors.phone_number}
                      </p>
                    )}
                  </div>

                  <div className="group">
                    <label 
                      htmlFor="license_number" 
                      className="flex text-sm font-bold mb-3 items-center gap-2"
                      style={{ color: isDarkMode ? '#ECEFF1' : '#1A1A1A' }}
                    >
                      <Shield size={16} style={{ color: theme.primary }} />
                      License Number
                    </label>
                    <div className="relative">
                      <div 
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${theme.primary}15` }}
                      >
                        <FileText 
                          size={14} 
                          style={{ color: theme.primary }}
                        />
                      </div>
                      <input
                        id="license_number"
                        name="license_number"
                        type="text"
                        value={formData.license_number}
                        onChange={handleChange}
                        className="w-full pl-14 pr-6 py-4 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-opacity-20 backdrop-blur-sm font-medium"
                        style={{ 
                          backgroundColor: isDarkMode 
                            ? `rgba(51, 65, 85, 0.85)` 
                            : `rgba(248, 250, 252, 0.95)`,
                          borderColor: errors.license_number 
                            ? theme.error 
                            : isDarkMode 
                              ? `${theme.primary}50` 
                              : `${theme.primary}60`,
                          color: isDarkMode ? '#ECEFF1' : '#1A1A1A',
                          boxShadow: isDarkMode 
                            ? `0 6px 20px rgba(0, 0, 0, 0.4)` 
                            : `0 6px 20px rgba(0, 0, 0, 0.08)`
                        }}
                        placeholder="Business license number"
                      />
                      <div 
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          backgroundColor: formData.license_number ? theme.primary : 'transparent',
                          opacity: formData.license_number ? 1 : 0
                        }}
                      />
                    </div>
                    {errors.license_number && (
                      <p className="mt-2 text-sm font-semibold flex items-center gap-2" style={{ color: theme.error }}>
                        <span className="w-1 h-1 rounded-full" style={{ backgroundColor: theme.error }} />
                        {errors.license_number}
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Password Field - Enhanced */}
            <div className="group">
              <label 
                htmlFor="password" 
                className="flex text-sm font-bold mb-3 items-center gap-2"
                style={{ color: isDarkMode ? '#ECEFF1' : '#1A1A1A' }}
              >
                <Lock size={16} style={{ color: theme.secondary }} />
                Secure Password
              </label>
              <div className="relative">
                <div 
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${theme.secondary}15` }}
                >
                  <Lock 
                    size={14} 
                    style={{ color: theme.secondary }}
                  />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-14 pr-14 py-4 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-opacity-20 backdrop-blur-sm font-medium"
                  style={{ 
                    backgroundColor: isDarkMode 
                      ? `rgba(51, 65, 85, 0.85)` 
                      : `rgba(248, 250, 252, 0.95)`,
                    borderColor: errors.password 
                      ? theme.error 
                      : isDarkMode 
                        ? `${theme.secondary}50` 
                        : `${theme.secondary}60`,
                    color: isDarkMode ? '#ECEFF1' : '#1A1A1A',
                    boxShadow: errors.password 
                      ? `0 0 0 4px ${theme.error}20` 
                      : isDarkMode 
                        ? `0 8px 24px rgba(0, 0, 0, 0.4)` 
                        : `0 8px 24px rgba(0, 0, 0, 0.1)`
                  }}
                  placeholder={isLogin ? "Enter your secure business password" : "Create a strong password (min 8 characters)"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300"
                  style={{ 
                    backgroundColor: `${theme.textSecondary}10`,
                    color: theme.textSecondary
                  }}
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
                <div 
                  className="absolute right-12 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    backgroundColor: formData.password.length >= 8 ? theme.secondary : 'transparent',
                    opacity: formData.password.length >= 8 ? 1 : 0
                  }}
                />
              </div>
              {errors.password && (
                <p className="mt-2 text-sm font-semibold flex items-center gap-2" style={{ color: theme.error }}>
                  <span className="w-1 h-1 rounded-full" style={{ backgroundColor: theme.error }} />
                  {errors.password}
                </p>
              )}
            </div>
          </div>

          {/* Premium Submit Button */}
          <div className="pt-6 relative z-10">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 px-6 rounded-2xl text-white font-bold text-lg transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
              style={{ 
                background: isDarkMode 
                  ? `linear-gradient(135deg, ${theme.secondary} 0%, ${theme.primary} 100%)` 
                  : `linear-gradient(135deg, ${theme.secondary} 0%, #8b5cf6 100%)`,
                boxShadow: isDarkMode 
                  ? `0 15px 50px rgba(0, 0, 0, 0.6), 0 0 0 1px ${theme.secondary}30` 
                  : `0 15px 50px ${theme.secondary}30, 0 0 0 1px ${theme.secondary}20`,
                fontFamily: 'Playfair Display, serif'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <div className="relative z-10 flex items-center justify-center gap-3">
                <Store size={20} />
                <span>
                  {loading 
                    ? (isLogin ? 'Accessing Business Portal...' : 'Registering Premium Partnership...') 
                    : (isLogin ? 'Access Business Dashboard' : 'Join Elite Partner Network')
                  }
                </span>
                <Building2 size={20} />
              </div>
            </button>
          </div>

          {/* Enhanced Switch Mode */}
          <div className="text-center pt-6 relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1 h-px" style={{ backgroundColor: `${theme.border}50` }}></div>
              <span className="text-xs font-semibold tracking-wide" style={{ color: theme.textSecondary }}>
                OR
              </span>
              <div className="flex-1 h-px" style={{ backgroundColor: `${theme.border}50` }}></div>
            </div>
            <button
              type="button"
              onClick={switchMode}
              className="text-sm font-bold hover:underline transition-all duration-300 px-6 py-2 rounded-full backdrop-blur-sm border hover:scale-105"
              style={{ 
                color: theme.primary,
                backgroundColor: `${theme.primary}10`,
                borderColor: `${theme.primary}20`
              }}
            >
              {isLogin 
                ? "New Business Partner? Join Elite Network →" 
                : "Existing Partner? Access Dashboard →"
              }
            </button>
          </div>
        </form>

      </div>
    </div>
    
    {/* Premium Footer */}
    <Footer variant="simple" />
    </>
  );
}

export default VendorLogin;