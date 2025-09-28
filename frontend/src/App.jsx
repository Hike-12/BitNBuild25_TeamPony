import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { VendorAuthProvider } from "./context/VendorAuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import ProtectedRoute from "./ProtectedRoute";
import VendorProtectedRoute from "./VendorProtectedRoute";
import Login from "./components/Login";
import Dashboard from "./pages/Consumer/Dashboard";
import VendorLogin from "./components/VendorLogin";
import VendorDashboard from "./pages/Vendor/VendorDashboard";
import LandingPage from "./pages/Landing/LandingPage_new";
import DailyMenus from "./pages/Vendor/DailyMenus";
import VendorMenuManager from "./pages/Vendor/VendorMenuManager";
import Menu from "./pages/Consumer/Menu";
import ConsumerChatbot from "./components/ConsumerChatbot";
import AdminDashboard from "./pages/Admin";
import PWAInstall from "./pages/PWAInstall";


function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <VendorAuthProvider>
          <Router>
            <ConsumerChatbot />
            <div className="App">
              <Routes>
                {/* Landing Page Route */}
                <Route path="/" element={<LandingPage />} />
                {/* Consumer Routes - Remove ProtectedRoute wrapper */}
                <Route path="/menu" element={<Menu />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                {/* Vendor Routes - Remove VendorProtectedRoute wrapper */}
                <Route path="/vendor/login" element={<VendorLogin />} />
                <Route path="/vendor/dashboard" element={<VendorDashboard />} />
                <Route path="/vendor/menu" element={<VendorMenuManager />} />
                <Route path="/vendor/daily-menus" element={<DailyMenus />} />
                {/* Catch all route - redirect to landing page */}

                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              {/* Toast Container */}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: "#172922",
                    color: "#ECEFF1",
                    border: "1px solid #22352A",
                    borderRadius: "12px",
                    fontSize: "14px",
                    fontWeight: "500",
                  },
                  success: {
                    iconTheme: {
                      primary: "#38B174",
                      secondary: "#ECEFF1",
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: "#FF5C5C",
                      secondary: "#ECEFF1",
                    },
                  },
                }}
              />
              <PWAInstall />
            </div>
          </Router>
        </VendorAuthProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
export default App;