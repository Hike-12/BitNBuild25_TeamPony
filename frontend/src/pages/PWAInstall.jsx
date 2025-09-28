import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { FiDownload, FiX, FiSmartphone } from 'react-icons/fi';
import { FaCrown } from 'react-icons/fa';

const PWAInstall = () => {
  const { theme } = useTheme();
  const [showInstall, setShowInstall] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstall(false);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    }
    
    setDeferredPrompt(null);
    setShowInstall(false);
  };

  const handleDismiss = () => {
    setShowInstall(false);
  };

  if (!showInstall) return null;

  return (
    <div 
      className="fixed bottom-4 right-4 z-50 max-w-sm"
      style={{ 
        backgroundColor: theme.panels,
        borderRadius: '16px',
        border: `2px solid ${theme.primary}30`,
        boxShadow: `0 20px 40px ${theme.primary}20`
      }}
    >
      <div className="p-6">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-2 rounded-full hover:bg-gray-200 transition-colors"
          style={{ color: theme.textSecondary }}
        >
          <FiX size={16} />
        </button>
        
        <div className="flex items-start gap-4">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${theme.primary}15` }}
          >
            <FaCrown size={24} style={{ color: theme.primary }} />
          </div>
          
          <div className="flex-1">
            <h3 
              className="font-bold text-lg mb-2"
              style={{ 
                color: theme.text,
                fontFamily: 'Playfair Display, serif'
              }}
            >
              Install NourishNet
            </h3>
            <p className="text-sm mb-4" style={{ color: theme.textSecondary }}>
              Get the full app experience with offline access, push notifications, and faster loading.
            </p>
            
            <div className="flex gap-2">
              <button
                onClick={handleInstallClick}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 hover:scale-105"
                style={{
                  backgroundColor: theme.primary,
                  color: 'white'
                }}
              >
                <FiDownload size={16} />
                Install App
              </button>
              
              <button
                onClick={handleDismiss}
                className="px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200"
                style={{
                  backgroundColor: `${theme.textSecondary}15`,
                  color: theme.textSecondary
                }}
              >
                Later
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PWAInstall;