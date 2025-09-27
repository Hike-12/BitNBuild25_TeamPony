// API utility functions for consistent request handling

export const getAuthHeaders = () => {
  const token = localStorage.getItem('vendor_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

export const handleApiError = (error) => {
  console.error("API Error:", error);
  
  if (error.message.includes('401')) {
    // Token expired or invalid
    localStorage.removeItem('vendor_token');
    window.location.href = '/vendor/login';
    return { error: "Please login again" };
  }
  
  if (error.message.includes('403')) {
    return { error: "Access denied" };
  }
  
  if (error.message.includes('404')) {
    return { error: "Resource not found" };
  }
  
  if (error.message.includes('500')) {
    return { error: "Server error occurred" };
  }
  
  return { error: error.message || "An error occurred" };
};

export const makeAuthenticatedRequest = async (url, options = {}) => {
  const config = {
    headers: getAuthHeaders(),
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    throw handleApiError(error);
  }
};