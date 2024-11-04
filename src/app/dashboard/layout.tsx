'use client'

import Sidebar from "@/components/sidebar"
import { useAuthGuard } from '@/hooks/useAuthGuard';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
          {children}
        </main>
      </div>
    </div>
  );
} 