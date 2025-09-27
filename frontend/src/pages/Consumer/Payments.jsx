import VoiceRouter from '../../components/VoiceRouter';
import React from 'react';

const Payments = () => {
  const voiceRoutes = [
    { keyword: 'menu', path: '/menu' },
    { keyword: 'dashboard', path: '/dashboard' },
    { keyword: 'nutrition', path: '/nutritioninsights' },
    { keyword: 'login', path: '/login' },
  ];
  
  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#f8f9fa' }}>
      {/* Page Content */}
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Payments</h1>
        <p className="text-lg text-gray-600 mb-8">Manage your payment methods and transaction history.</p>
        
        {/* Placeholder content */}
        <div className="bg-white rounded-lg p-6 shadow-md">
          <p className="text-gray-700">Payment functionality coming soon...</p>
        </div>
      </div>
      
      {/* Page Overview & Voice Commands */}
      <div className="mt-8 p-4 rounded-xl border flex flex-col lg:flex-row items-center justify-between gap-4 bg-white">
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2 text-gray-800">Page Overview</h3>
          <ul className="list-disc ml-6 text-sm text-gray-600">
            <li>View payment history and transaction details</li>
            <li>Manage saved payment methods and cards</li>
            <li>Track subscription payments and refunds</li>
            <li>Use voice commands for quick navigation</li>
          </ul>
        </div>
        <div className="flex flex-col items-center">
          <h4 className="text-sm font-semibold mb-1 text-blue-600">Voice Commands</h4>
          <ul className="text-xs mb-2 text-gray-600">
            <li><b>"Go to menu"</b> – Navigate to Menu</li>
            <li><b>"Go to dashboard"</b> – Back to Dashboard</li>
            <li><b>"Go to nutrition"</b> – Nutrition Insights</li>
            <li><b>"Go to login"</b> – Login Page</li>
          </ul>
          <div className="mt-2">
            <VoiceRouter routes={voiceRoutes} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;
