// Sidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FiHome,
  FiSettings,
  FiUser,
} from 'react-icons/fi';
import { 
  BsBoxSeam,
  BsCreditCard,
} from 'react-icons/bs';
import { 
  MdRestaurant,
} from 'react-icons/md';

const Sidebar = ({ theme }) => {
  const location = useLocation();

  const sidebarItems = [
    { 
      id: 'overview', 
      label: 'Overview', 
      icon: FiHome,
      path: '/dashboard' 
    },
    { 
      id: 'orders', 
      label: 'My Orders', 
      icon: BsBoxSeam,
      path: '/dashboard/orders' 
    },
    { 
      id: 'subscriptions', 
      label: 'Subscriptions', 
      icon: MdRestaurant,
      path: '/dashboard/subscriptions' 
    },
    { 
      id: 'payments', 
      label: 'Payments', 
      icon: BsCreditCard,
      path: '/dashboard/payments' 
    },
    { 
      id: 'profile', 
      label: 'Profile', 
      icon: FiUser,
      path: '/dashboard/profile' 
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: FiSettings,
      path: '/dashboard/settings' 
    },
  ];

  return (
    <aside 
      className="w-64 min-h-screen border-r"
      style={{ 
        backgroundColor: theme.panels,
        borderColor: theme.border 
      }}
    >
      <nav className="p-4 space-y-2">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.id}
              to={item.path}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                isActive ? 'transform scale-105' : 'hover:transform hover:scale-102'
              }`}
              style={{
                backgroundColor: isActive ? theme.primary : 'transparent',
                color: isActive ? 'white' : theme.textSecondary,
                textDecoration: 'none',
                display: 'flex'
              }}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;