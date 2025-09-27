import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, User, Mail, Lock, Eye, EyeOff, Crown, Utensils, Star, Gem } from 'lucide-react';

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
    
    if (!validateForm()) {
      toast.error('Please fix the form errors');
      return;
    }

    setLoading(true);
    let result;

    const loadingToast = toast.loading(
      isLogin ? 'Signing you in...' : 'Creating your account...'
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
      });
    }

    toast.dismiss(loadingToast);
    
    if (result.success) {
      toast.success(
        isLogin 
          ? `Welcome back, ${formData.username}! 🍽️` 
          : 'Account created successfully! Welcome to NourishNet! 🎉'
      );
    } else {
      toast.error(result.error);
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
    
    toast.success(
      isLogin ? 'Switched to registration mode' : 'Switched to login mode'
    );
  };

  return (
    <div 
      className="min-h-screen relative flex items-center justify-center px-4 transition-all duration-500"
      style={{ 
        backgroundColor: theme.background,
        backgroundImage: `
          ${isDarkMode 
            ? 'url("https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")' 
            : 'url("https://images.unsplash.com/photo-1543353071-873f17a7a088?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")' // pasta, restored
          },
          radial-gradient(circle at 20% 80%, ${theme.primary}15 0%, transparent 60%), 
          radial-gradient(circle at 80% 20%, ${theme.secondary}12 0%, transparent 60%),
          radial-gradient(circle at 40% 40%, ${theme.primary}10 0%, transparent 60%)
        `,
        backgroundSize: 'cover, 100% 100%, 100% 100%, 100% 100%',
        backgroundPosition: 'center, center, center, center',
        backgroundBlendMode: isDarkMode ? 'overlay, normal, normal, normal' : 'normal, normal, normal, normal'
      }}
    >
      {/* Premium Background Overlay */}
      <div 
        className="absolute inset-0"
        style={{
          background: isDarkMode 
            ? `linear-gradient(135deg, rgba(3, 3, 3, 0.75) 0%, rgba(23, 41, 34, 0.70) 100%)`
            : `linear-gradient(135deg, rgba(253, 253, 247, 0.40) 0%, rgba(245, 248, 242, 0.45) 100%)` // much less opaque overlay for light mode
        }}
      />

      {/* Premium Background Pattern */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='${theme.primary.replace('#', '%23')}' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Floating Culinary Elements */}
      <div className="absolute top-20 left-10 animate-pulse">
        <div 
          className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl backdrop-blur-sm border"
          style={{ 
            backgroundColor: `${theme.primary}15`,
            borderColor: `${theme.primary}30`
          }}
        >
          <Utensils size={20} style={{ color: theme.primary }} />
        </div>
      </div>
      <div className="absolute top-32 right-20 animate-pulse delay-500">
        <div 
          className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg backdrop-blur-sm border"
          style={{ 
            backgroundColor: `${theme.secondary}15`,
            borderColor: `${theme.secondary}30`
          }}
        >
          <Star size={18} style={{ color: theme.secondary }} />
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
          <Gem size={20} style={{ color: theme.primary }} />
        </div>
      </div>

      {/* Theme Toggle - Enhanced */}
      <button
        onClick={toggleTheme}
        className="fixed top-6 right-6 p-4 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-110 z-20 backdrop-blur-md border-2 group"
        style={{ 
          backgroundColor: isDarkMode 
            ? `rgba(23, 41, 34, 0.95)` 
            : `rgba(245, 248, 242, 0.98)`,
          color: theme.primary,
          borderColor: isDarkMode 
            ? `${theme.primary}50` 
            : `${theme.primary}60`,
          boxShadow: isDarkMode 
            ? `0 8px 32px rgba(0, 0, 0, 0.5)` 
            : `0 8px 32px rgba(0, 0, 0, 0.2)`,
          backdropFilter: 'blur(20px)'
        }}
      >
        {isDarkMode ? <Sun size={22} /> : <Moon size={22} />}
      </button>

      {/* Vendor Login Link - Enhanced */}
      <Link
        to="/vendor/login"
        className="fixed top-6 left-6 px-6 py-3 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 z-20 text-sm font-bold backdrop-blur-md border-2 flex items-center gap-2 group"
        style={{ 
          backgroundColor: isDarkMode 
            ? `rgba(59, 130, 246, 0.15)` 
            : `rgba(59, 130, 246, 0.12)`,
          color: theme.secondary,
          borderColor: isDarkMode 
            ? `${theme.secondary}50` 
            : `${theme.secondary}60`,
          boxShadow: isDarkMode 
            ? `0 8px 32px rgba(59, 130, 246, 0.3)` 
            : `0 8px 32px rgba(59, 130, 246, 0.25)`,
          backdropFilter: 'blur(20px)'
        }}
      >
        <Crown size={18} />
        Vendor Portal →
      </Link>

      <div className="max-w-lg w-full space-y-8 relative z-10">
        {/* Premium Header */}
        <div className="text-center">
          <div className="mb-8 relative">
            {/* Main Brand Icon */}
            <div 
              className="w-20 h-20 mx-auto rounded-3xl flex items-center justify-center shadow-2xl border-4 mb-4 relative overflow-hidden group"
              style={{ 
                background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`,
                borderColor: isDarkMode 
                  ? `${theme.primary}60` 
                  : `${theme.primary}40`,
                boxShadow: isDarkMode 
                  ? `0 20px 60px rgba(0, 0, 0, 0.7), 0 0 40px ${theme.primary}40` 
                  : `0 20px 60px ${theme.primary}30, 0 0 30px ${theme.primary}20`,
                animation: 'luxuryPulse 3s ease-in-out infinite'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
              <Crown size={36} color="white" className="relative z-10" />
            </div>
            
            {/* Brand Name */}
            <div className="flex items-center justify-center gap-2 mb-2">
              <Crown size={24} style={{ color: theme.primary }} />
              <h1 
                className="text-2xl font-bold"
                style={{ 
                  color: theme.primary,
                  fontFamily: 'Playfair Display, serif',
                  letterSpacing: '1px'
                }}
              >
                NourishNet
              </h1>
              <Crown size={24} style={{ color: theme.primary }} />
            </div>
          </div>
          
          <h2 
            className="text-4xl font-bold mb-3"
            style={{ 
              color: isDarkMode ? '#F1F5F9' : '#1A1A1A',
              fontFamily: 'Playfair Display, serif',
              letterSpacing: '-0.5px',
              textShadow: isDarkMode 
                ? '2px 2px 8px rgba(0, 0, 0, 0.9), 0 0 20px rgba(0, 0, 0, 0.8)' 
                : '2px 2px 8px rgba(255, 255, 255, 0.9), 0 0 20px rgba(255, 255, 255, 0.8), 1px 1px 4px rgba(0, 0, 0, 0.5)'
            }}
          >
            {isLogin ? 'Welcome Back' : 'Join Our Elite'}
          </h2>
          <p 
            className="text-base leading-relaxed max-w-sm mx-auto"
            style={{ color: theme.textSecondary }}
          >
            {isLogin 
              ? 'Continue your premium culinary journey with us' 
              : 'Discover exceptional dining experiences curated for discerning palates'
            }
          </p>
          
          {/* Decorative Elements */}
          <div className="flex justify-center gap-4 mt-6 mb-8">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: theme.primary }}></div>
            <div className="w-2 h-2 rounded-full animate-pulse delay-300" style={{ backgroundColor: theme.secondary }}></div>
            <div className="w-2 h-2 rounded-full animate-pulse delay-700" style={{ backgroundColor: theme.primary }}></div>
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
              ? `${theme.primary}40` 
              : `${theme.primary}30`,
            boxShadow: isDarkMode 
              ? `0 25px 80px rgba(0, 0, 0, 0.5), 0 0 0 1px ${theme.primary}20` 
              : `0 25px 80px rgba(0, 0, 0, 0.15), 0 0 0 1px ${theme.primary}15`
          }}
          onSubmit={handleSubmit}
        >
          {/* Form Background Pattern */}
          <div 
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, ${theme.primary} 2px, transparent 2px),
                               radial-gradient(circle at 75% 75%, ${theme.secondary} 1px, transparent 1px)`,
              backgroundSize: '24px 24px, 32px 32px'
            }}
          />
          
          {/* Premium Form Header */}
          <div className="text-center mb-8 relative z-10">
            <div 
              className="inline-flex items-center gap-2 px-6 py-2 rounded-full backdrop-blur-md border shadow-lg mb-4"
              style={{
                backgroundColor: isDarkMode ? `${theme.primary}25` : `${theme.primary}35`,
                borderColor: isDarkMode ? `${theme.primary}50` : `${theme.primary}60`,
                color: isDarkMode ? theme.primary : '#FFFFFF',
                textShadow: isDarkMode 
                  ? '1px 1px 3px rgba(0, 0, 0, 0.7)' 
                  : '1px 1px 3px rgba(0, 0, 0, 0.8)',
                boxShadow: isDarkMode 
                  ? `0 8px 25px rgba(0, 0, 0, 0.4)` 
                  : `0 8px 25px rgba(0, 0, 0, 0.3)`
              }}
            >
              <Gem size={16} />
              <span className="text-xs font-semibold tracking-wide uppercase">
                {isLogin ? 'Member Access' : 'Elite Registration'}
              </span>
              <Gem size={16} />
            </div>
            <h2 
              className="text-4xl font-bold mb-3"
              style={{ 
                color: isDarkMode ? '#F1F5F9' : '#FFFFFF',
                fontFamily: 'Playfair Display, serif',
                letterSpacing: '-0.5px',
                textShadow: isDarkMode 
                  ? '2px 2px 8px rgba(0, 0, 0, 0.9), 0 0 20px rgba(0, 0, 0, 0.8)' 
                  : '2px 2px 8px rgba(0, 0, 0, 0.9), 0 0 20px rgba(0, 0, 0, 0.8)'
              }}
            >
              {isLogin ? 'Welcome Back' : 'Join Our Elite'}
            </h2>
            {/* Username Field - Enhanced */}
            <div className="group">
              <label 
                htmlFor="username" 
                className="flex text-sm font-bold mb-3 items-center gap-2"
                style={{ color: isDarkMode ? '#ECEFF1' : '#1A1A1A' }}
              >
                <User size={16} style={{ color: theme.primary }} />
                Username
              </label>
              <div className="relative">
                <div 
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${theme.primary}15` }}
                >
                  <User 
                    size={14} 
                    style={{ color: theme.primary }}
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
                      ? `rgba(34, 53, 42, 0.8)` 
                      : `rgba(245, 248, 242, 0.98)`,
                    backdropFilter: 'blur(10px)',
                    borderColor: errors.username 
                      ? theme.error 
                      : isDarkMode 
                        ? `${theme.primary}40` 
                        : `${theme.primary}60`,
                    color: isDarkMode ? '#ECEFF1' : '#1A1A1A',
                    boxShadow: errors.username 
                      ? `0 0 0 4px ${theme.error}20` 
                      : isDarkMode 
                        ? `0 8px 24px rgba(0, 0, 0, 0.3)` 
                        : `0 8px 24px rgba(0, 0, 0, 0.12)`
                  }}
                  placeholder="Enter your distinguished username"
                />
                <div 
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    backgroundColor: formData.username ? theme.primary : 'transparent',
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
            {/* Signup Only Fields - Enhanced */}
            {!isLogin && (
              <React.Fragment>
                <div className="group">
                  <label 
                    htmlFor="email" 
                    className="flex text-sm font-bold mb-3 items-center gap-2"
                    style={{ color: isDarkMode ? '#ECEFF1' : '#1A1A1A' }}
                  >
                    <Mail size={16} style={{ color: theme.secondary }} />
                    Email Address
                  </label>
                  <div className="relative">
                    <div 
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${theme.secondary}15` }}
                    >
                      <Mail 
                        size={14} 
                        style={{ color: theme.secondary }}
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
                          ? `rgba(51, 65, 85, 0.8)` 
                          : `rgba(248, 250, 252, 0.95)`,
                        borderColor: errors.email 
                          ? theme.error 
                          : isDarkMode 
                            ? `${theme.secondary}40` 
                            : `${theme.secondary}50`,
                        color: isDarkMode ? '#ECEFF1' : '#1A1A1A',
                        boxShadow: errors.email 
                          ? `0 0 0 4px ${theme.error}20` 
                          : isDarkMode 
                            ? `0 8px 24px rgba(0, 0, 0, 0.3)` 
                            : `0 8px 24px rgba(0, 0, 0, 0.08)`
                      }}
                      placeholder="Enter your premium email address"
                    />
                    <div 
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        backgroundColor: formData.email ? theme.secondary : 'transparent',
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
                      First Name
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
                          ? `rgba(51, 65, 85, 0.8)` 
                          : `rgba(248, 250, 252, 0.95)`,
                        borderColor: errors.first_name 
                          ? theme.error 
                          : isDarkMode 
                            ? `${theme.primary}30` 
                            : `${theme.primary}40`,
                        color: isDarkMode ? '#ECEFF1' : '#1A1A1A',
                        boxShadow: isDarkMode 
                          ? `0 6px 20px rgba(0, 0, 0, 0.3)` 
                          : `0 6px 20px rgba(0, 0, 0, 0.06)`
                      }}
                      placeholder="First name"
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
                      Last Name
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
                          ? `rgba(51, 65, 85, 0.8)` 
                          : `rgba(248, 250, 252, 0.95)`,
                        borderColor: errors.last_name 
                          ? theme.error 
                          : isDarkMode 
                            ? `${theme.primary}30` 
                            : `${theme.primary}40`,
                        color: isDarkMode ? '#ECEFF1' : '#1A1A1A',
                        boxShadow: isDarkMode 
                          ? `0 6px 20px rgba(0, 0, 0, 0.3)` 
                          : `0 6px 20px rgba(0, 0, 0, 0.06)`
                      }}
                      placeholder="Last name"
                    />
                    {errors.last_name && (
                      <p className="mt-2 text-sm font-semibold flex items-center gap-2" style={{ color: theme.error }}>
                        <span className="w-1 h-1 rounded-full" style={{ backgroundColor: theme.error }} />
                        {errors.last_name}
                      </p>
                    )}
                  </div>
                </div>
              </React.Fragment>
            )}

            {/* Password Field - Enhanced */}
            <div className="group">
              <label 
                htmlFor="password" 
                className="flex text-sm font-bold mb-3 items-center gap-2"
                style={{ color: isDarkMode ? '#ECEFF1' : '#1A1A1A' }}
              >
                <Lock size={16} style={{ color: theme.primary }} />
                Password
              </label>
              <div className="relative">
                <div 
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${theme.primary}15` }}
                >
                  <Lock 
                    size={14} 
                    style={{ color: theme.primary }}
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
                      ? `rgba(51, 65, 85, 0.8)` 
                      : `rgba(248, 250, 252, 0.95)`,
                    borderColor: errors.password 
                      ? theme.error 
                      : isDarkMode 
                        ? `${theme.primary}40` 
                        : `${theme.primary}50`,
                    color: isDarkMode ? '#ECEFF1' : '#1A1A1A',
                    boxShadow: errors.password 
                      ? `0 0 0 4px ${theme.error}20` 
                      : isDarkMode 
                        ? `0 8px 24px rgba(0, 0, 0, 0.3)` 
                        : `0 8px 24px rgba(0, 0, 0, 0.08)`
                  }}
                  placeholder={isLogin ? "Enter your secure password" : "Create a strong password (min 8 characters)"}
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
                    backgroundColor: formData.password.length >= 8 ? theme.primary : 'transparent',
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
                  ? `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)` 
                  : `linear-gradient(135deg, ${theme.primary} 0%, #6366f1 100%)`,
                boxShadow: isDarkMode 
                  ? `0 15px 50px rgba(0, 0, 0, 0.6), 0 0 0 1px ${theme.primary}30` 
                  : `0 15px 50px ${theme.primary}30, 0 0 0 1px ${theme.primary}20`,
                fontFamily: 'Playfair Display, serif'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <div className="relative z-10 flex items-center justify-center gap-3">
                <Crown size={20} />
                <span>
                  {loading 
                    ? (isLogin ? 'Authenticating...' : 'Creating Elite Account...') 
                    : (isLogin ? 'Enter Premium Portal' : 'Join Elite Circle')
                  }
                </span>
                <Crown size={20} />
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
                color: theme.secondary,
                backgroundColor: `${theme.secondary}10`,
                borderColor: `${theme.secondary}20`
              }}
            >
              {isLogin 
                ? "New to NourishNet? Join Elite Circle →" 
                : "Already Elite Member? Sign In →"
              }
            </button>
          </div>
        </form>

        {/* Footer Space */}
        <div className="mt-12 mb-8 text-center space-y-4 relative z-10">
          <div 
            className="flex items-center justify-center gap-4 text-sm"
            style={{ color: theme.textSecondary }}
          >
            <span className="flex items-center gap-2">
              <Utensils size={14} />
              Premium Dining
            </span>
            <span className="w-1 h-1 rounded-full" style={{ backgroundColor: theme.border }}></span>
            <span className="flex items-center gap-2">
              <Crown size={14} />
              Curated Experience
            </span>
          </div>
          <div 
            className="text-xs tracking-wide opacity-75"
            style={{ 
              color: theme.textSecondary,
              fontFamily: 'Merriweather, serif'
            }}
          >
            NourishNet • Elevating Culinary Experiences • Connecting Food Enthusiasts • Est. 2024
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;