"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { DashboardStats } from "@/components/DashboardStats";
import { RecentActivity } from "@/components/RecentActivity";

export default function Dashboard() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back!</p>
        </div>
        <button
          onClick={() => router.push("/projects/new")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Crear Proyecto
        </button>
      </div>

      <DashboardStats />
      <RecentActivity />
    </div>
  );
}
