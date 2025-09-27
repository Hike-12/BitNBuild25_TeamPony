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
      background: '#030303',   // deeper black as requested
      panels: '#172922',       // darker green slate for cards/panels
      primary: '#E5A64A',      // warm gold accent
      secondary: '#38B174',    // fresh but muted green
      text: '#ECEFF1',         // soft off-white
      textSecondary: '#A3B1A3',
      border: '#22352A',
      error: '#FF5C5C',
      success: '#38B174',
      warning: '#E5A64A'
    },
    light: {
      background: '#FDFDF7',   // very slight off-white, soft on eyes
      panels: '#F5F8F2',       // subtle green-white card background
      primary: '#FF8C4B',      // muted coral/orange accent
      secondary: '#2F9E63',    // natural leafy green
      text: '#1A1A1A',
      textSecondary: '#555F55',
      border: '#E0E7DE',
      error: '#E53935',
      success: '#2F9E63',
      warning: '#FF8C4B'
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
