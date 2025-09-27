import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const theme = {
    dark: {
      background: '#121212',
      panels: '#1E2A24',
      primary: '#FFB347',
      secondary: '#4ADE80',
      text: '#F5F5F5',
      textSecondary: '#B0B0B0',
      border: '#2A3F2A',
      error: '#FF6B6B',
      success: '#4ADE80',
      warning: '#FFB347'
    },
    light: {
      background: '#FFFFFF',
      panels: '#F9FAF5',
      primary: '#FF7F50',
      secondary: '#2E8B57',
      text: '#1A1A1A',
      textSecondary: '#4A4A4A',
      border: '#E0E8E0',
      error: '#E53E3E',
      success: '#2E8B57',
      warning: '#FF7F50'
    }
  };

  const currentTheme = isDarkMode ? theme.dark : theme.light;

  const value = {
    isDarkMode,
    toggleTheme,
    theme: currentTheme,
    colors: theme
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};