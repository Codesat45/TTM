import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

interface NavbarProps {
  onSidebarToggle: () => void;
  isSidebarOpen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onSidebarToggle, isSidebarOpen }) => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar flex-shrink-0">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14">
          <div className="flex items-center">
            <button
              onClick={onSidebarToggle}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 lg:hidden"
            >
              {isSidebarOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
            <div className="flex-shrink-0 flex items-center ml-4 lg:ml-0">
              <h1 className="text-xl font-bold text-primary-600">Task Manager</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-500">Welcome,</span>
                <span className="text-sm font-medium text-gray-900">{user?.name}</span>
                <span className="badge badge-primary">{user?.role}</span>
              </div>
            </div>
            
            <div className="relative">
              <button
                onClick={logout}
                className="btn btn-outline text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
