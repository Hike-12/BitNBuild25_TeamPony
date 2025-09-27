import React, { useState, useEffect } from "react";
import { useVendorAuth } from "../../context/VendorAuthContext";
import toast from "react-hot-toast";
import { format } from "date-fns";

const DailyMenus = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { vendor } = useVendorAuth();
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchDailyMenus = async () => {
    try {
      const token = localStorage.getItem("vendor_token");
      const response = await fetch(`${API_URL}/api/vendor/daily-menus/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch menus");
      }

      const data = await response.json();
      if (data.success) {
        setMenus(data.menus);
      } else {
        throw new Error(data.error || "Failed to fetch menus");
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createDailyMenu = async (menuData) => {
    try {
      const token = localStorage.getItem("vendor_token");
      const response = await fetch(`${API_URL}/api/vendor/daily-menus/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(menuData),
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Menu created successfully!");
        fetchDailyMenus(); // Refresh the list
        return true;
      } else {
        throw new Error(data.error || "Failed to create menu");
      }
    } catch (err) {
      toast.error(err.message);
      return false;
    }
  };

  const updateDailyMenu = async (menuId, updates) => {
    try {
      const token = localStorage.getItem("vendor_token");
      const response = await fetch(
        `${API_URL}/api/vendor/daily-menus/${menuId}/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updates),
        }
      );

      const data = await response.json();
      if (data.success) {
        toast.success("Menu updated successfully!");
        fetchDailyMenus(); // Refresh the list
        return true;
      } else {
        throw new Error(data.error || "Failed to update menu");
      }
    } catch (err) {
      toast.error(err.message);
      return false;
    }
  };

  useEffect(() => {
    fetchDailyMenus();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-error mb-4">{error}</p>
        <button onClick={fetchDailyMenus} className="btn btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Daily Menus</h1>
        <button
          className="btn btn-primary"
          onClick={() => {
            /* Add your modal open logic */
          }}
        >
          Create New Menu
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menus.map((menu) => (
          <div key={menu.id} className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">{menu.name}</h2>
              <p className="text-sm text-gray-500">
                {format(new Date(menu.date), "PPP")}
              </p>
              <p className="font-semibold">₹{menu.full_dabba_price}</p>
              <div className="flex justify-between items-center mt-4">
                <span className="badge badge-primary">
                  {menu.dabbas_sold}/{menu.max_dabbas} sold
                </span>
                <button
                  className="btn btn-sm btn-outline"
                  onClick={() => {
                    /* Add your edit logic */
                  }}
                >
                  Edit Menu
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {menus.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No menus created yet.</p>
          <button
            className="btn btn-primary mt-4"
            onClick={() => {
              /* Add your modal open logic */
            }}
          >
            Create Your First Menu
          </button>
        </div>
      )}
    </div>
  );
};

export default DailyMenus;
