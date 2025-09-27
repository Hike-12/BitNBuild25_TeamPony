import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
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
    <div className="min-h-screen bg-[#0D1117] flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-[#F0F6FC]">
            {isLogin ? 'Sign in to your account' : 'Create your account'}
          </h2>
        </div>
        <form className="mt-8 space-y-6 bg-[#161B22] p-8 rounded-lg border border-[#21262D]" onSubmit={handleSubmit}>
          {errors.form && (
            <div className="bg-[#EF4444] bg-opacity-10 border border-[#EF4444] text-[#EF4444] px-4 py-3 rounded">
              {errors.form}
            </div>
          )}
          
          <div className="space-y-4">
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-[#F0F6FC] mb-2">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-2 bg-[#0D1117] border border-[#21262D] text-[#F0F6FC] rounded-md focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-[#F97316] sm:text-sm"
                placeholder="Enter your username"
              />
              {errors.username && <p className="mt-1 text-sm text-[#EF4444]">{errors.username}</p>}
            </div>

            {/* Signup Only Fields */}
            {!isLogin && (
              <>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[#F0F6FC] mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="appearance-none relative block w-full px-3 py-2 bg-[#0D1117] border border-[#21262D] text-[#F0F6FC] rounded-md focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-[#F97316] sm:text-sm"
                    placeholder="Enter your email"
                  />
                  {errors.email && <p className="mt-1 text-sm text-[#EF4444]">{errors.email}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="first_name" className="block text-sm font-medium text-[#F0F6FC] mb-2">
                      First Name
                    </label>
                    <input
                      id="first_name"
                      name="first_name"
                      type="text"
                      value={formData.first_name}
                      onChange={handleChange}
                      className="appearance-none relative block w-full px-3 py-2 bg-[#0D1117] border border-[#21262D] text-[#F0F6FC] rounded-md focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-[#F97316] sm:text-sm"
                      placeholder="First name"
                    />
                    {errors.first_name && <p className="mt-1 text-sm text-[#EF4444]">{errors.first_name}</p>}
                  </div>

                  <div>
                    <label htmlFor="last_name" className="block text-sm font-medium text-[#F0F6FC] mb-2">
                      Last Name
                    </label>
                    <input
                      id="last_name"
                      name="last_name"
                      type="text"
                      value={formData.last_name}
                      onChange={handleChange}
                      className="appearance-none relative block w-full px-3 py-2 bg-[#0D1117] border border-[#21262D] text-[#F0F6FC] rounded-md focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-[#F97316] sm:text-sm"
                      placeholder="Last name"
                    />
                    {errors.last_name && <p className="mt-1 text-sm text-[#EF4444]">{errors.last_name}</p>}
                  </div>
                </div>
              </>
            )}

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#F0F6FC] mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-2 bg-[#0D1117] border border-[#21262D] text-[#F0F6FC] rounded-md focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-[#F97316] sm:text-sm"
                placeholder={isLogin ? "Enter your password" : "Create a password (min 8 characters)"}
              />
              {errors.password && <p className="mt-1 text-sm text-[#EF4444]">{errors.password}</p>}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#F97316] hover:bg-[#EA580C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F97316] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading 
                ? (isLogin ? 'Signing in...' : 'Creating account...') 
                : (isLogin ? 'Sign in' : 'Create account')
              }
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={switchMode}
              className="text-[#F97316] hover:text-[#EA580C] text-sm underline bg-transparent border-none cursor-pointer"
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