"use client";

import { useAuthStore } from "@/stores/authStore";

export const Navigation: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) return null;

  return (
    <nav className="bg-white shadow-sm border-b px-6 py-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-gray-800">
            TalentOps TaskFlow
          </h1>
          <span className="text-gray-600">
            Hola, {user?.name}
          </span>
        </div>
        
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          data-cy="logout-button"
        >
          Cerrar Sesión
        </button>
      </div>
    </nav>
  );
};