import React, { useState } from 'react';
import Navigation from './Navigation.jsx';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar Navigation */}
      <Navigation isOpen={sidebarOpen} onToggle={toggleSidebar} />
      
      {/* Main Content */}
      <main className="flex-1 lg:ml-0 relative">
        <div className="h-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
