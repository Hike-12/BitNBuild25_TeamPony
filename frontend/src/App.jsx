import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { VendorAuthProvider } from './context/VendorAuthContext';
import ProtectedRoute from './ProtectedRoute';
import VendorProtectedRoute from './VendorProtectedRoute';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import VendorLogin from './components/VendorLogin';
import VendorDashboard from './components/VendorDashboard';

function App() {
  return (
    <AuthProvider>
      <VendorAuthProvider>
        <Router>
          <div className="App">
            <Routes>
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
              
              {/* Default redirect */}
              <Route path="/" element={<Navigate to="/dashboard" />} />
            </Routes>
          </div>
        </Router>
      </VendorAuthProvider>
    </AuthProvider>
  );
}

export default App;