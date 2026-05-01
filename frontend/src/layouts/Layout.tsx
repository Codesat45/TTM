import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';

export const Layout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-netflix-black">
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      
      <div className={`flex flex-col h-screen transition-all duration-300 ${isSidebarOpen ? 'lg:pl-64' : ''}`}>
        <Navbar 
          onSidebarToggle={toggleSidebar} 
          isSidebarOpen={isSidebarOpen} 
        />
        
        <main className="flex-1">
          <div className="w-full px-2 sm:px-4 lg:px-6 py-4">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
