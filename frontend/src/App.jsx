import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { VendorAuthProvider } from './context/VendorAuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './ProtectedRoute';
import VendorProtectedRoute from './VendorProtectedRoute';
import Login from './components/Login';
import Dashboard from './pages/Consumer/Dashboard'; // Changed path
import VendorLogin from './components/VendorLogin';
import VendorDashboard from './pages/Vendor/VendorDashboard'; // Changed path
import LandingPage from './pages/Landing/LandingPage_new';
import Menu from './pages/Consumer/Menu'; // Changed path

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <VendorAuthProvider>
          <Router>
            <div className="App">
              <Routes>
                {/* Landing Page Route */}
                <Route path="/" element={<LandingPage />} />
                
                {/* Consumer Routes */}
                <Route path="/login" element={<Login />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/menus"
                  element={
                    <ProtectedRoute>
                      <Menu />
                    </ProtectedRoute>
                  }
                />

                {/* Vendor Routes */}
                <Route path="/vendor/login" element={<VendorLogin />} />
                <Route
                  path="/vendor/dashboard"
                  element={
                    <VendorProtectedRoute>
                      <VendorDashboard />
                    </VendorProtectedRoute>
                  }
                />
              </Routes>
              
              {/* Toast Container */}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#172922',
                    color: '#ECEFF1',
                    border: '1px solid #22352A',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: '500'
                  },
                  success: {
                    iconTheme: {
                      primary: '#38B174',
                      secondary: '#ECEFF1',
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: '#FF5C5C',
                      secondary: '#ECEFF1',
                    },
                  },
                }}
              />
            </div>
          </Router>
        </VendorAuthProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;