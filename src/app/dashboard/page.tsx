'use client'

import Navbar from "@/components/ui/navbar"
import Sidebar from "@/components/sidebar"
import { useAuthGuard } from '@/hooks/useAuthGuard';

export default function Dashboard() {
  const user = useAuthGuard();
  
  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="flex flex-1">
        <Sidebar user={user} />
        <main className="flex-1 p-6 bg-white shadow-md rounded-lg m-4">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Welcome, {user.firstname} {user.lastname}!</h2>
          <p className="text-gray-600">This is your dashboard. You can add more content here.</p>
        </main>
      </div>
    </div>
  );
}