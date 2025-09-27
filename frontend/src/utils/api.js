const API_URL = import.meta.env.VITE_API_URL;

export const getAuthHeaders = () => {
  const token = localStorage.getItem("vendor_token");
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

export const handleApiError = (error) => {
  if (error.response?.status === 401) {
    // Handle unauthorized access
    localStorage.removeItem("vendor_token");
    window.location.href = "/vendor/login";
  }
  return error;
};
