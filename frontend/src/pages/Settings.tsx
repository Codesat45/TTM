import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Cog6ToothIcon,
  ShieldCheckIcon,
  LinkIcon
} from '@heroicons/react/24/outline';

export const Settings: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Review application and account configuration</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-11 w-11 rounded-lg bg-red-500/15 flex items-center justify-center">
              <Cog6ToothIcon className="h-6 w-6 text-red-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Account</h2>
              <p className="text-sm text-gray-400">Signed-in admin details</p>
            </div>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-gray-700 pb-3">
              <span className="text-gray-400">Name</span>
              <span className="text-white">{user?.name || 'Unknown'}</span>
            </div>
            <div className="flex justify-between border-b border-gray-700 pb-3">
              <span className="text-gray-400">Email</span>
              <span className="text-white">{user?.email || 'Unknown'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Role</span>
              <span className="badge badge-primary">{user?.role || 'Member'}</span>
            </div>
          </div>
        </section>

        <section className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-11 w-11 rounded-lg bg-green-500/15 flex items-center justify-center">
              <ShieldCheckIcon className="h-6 w-6 text-green-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Security</h2>
              <p className="text-sm text-gray-400">Production configuration checklist</p>
            </div>
          </div>
          <ul className="space-y-3 text-sm text-gray-300">
            <li className="flex items-center gap-2">
              <LinkIcon className="h-4 w-4 text-green-400" />
              Backend API is configured through environment variables.
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheckIcon className="h-4 w-4 text-green-400" />
              Admin-only pages are protected by role checks.
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
};
