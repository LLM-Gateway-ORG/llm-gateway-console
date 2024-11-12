"use client";

import Sidebar from "./sidebar";
import { useAuthGuard } from "@/hooks/useAuthGuard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
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
        <Sidebar user={user}>
          <main className="flex-1 p-6 m-4">
            {/* <div className="border-b pb-4 mb-6">
              <h1 className="text-3xl font-bold text-gray-800">
                Welcome back,{" "}
                <span className="text-blue-600">
                  {user.firstname || "User"}
                </span>
                !
              </h1>
              <p className="text-gray-600 mt-2">
                Manage your API keys and view your analytics
              </p>
            </div> */}
            {children}
          </main>
        </Sidebar>
      </div>
    </div>
  );
}
