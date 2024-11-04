'use client'

import { useState } from 'react';

export default function Settings() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement password change logic
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Account Settings</h1>
      
      <form onSubmit={handleSubmit} className="max-w-md space-y-6">
        <div className="space-y-2">
          <label htmlFor="oldPassword" className="block text-gray-800 font-medium">
            Old password
          </label>
          <input
            type="password"
            id="oldPassword"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="Enter your old password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="newPassword" className="block text-gray-800 font-medium">
            New password
          </label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter your new password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Save Changes
        </button>
      </form>
    </>
  );
}
