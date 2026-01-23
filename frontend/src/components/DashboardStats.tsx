'use client';

import { apiService } from '@/services/api';
import { useEffect, useState } from 'react';

interface DashboardStatsData {
  totalProjects: number;
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
}

export const DashboardStats: React.FC = () => {
  const [stats, setStats] = useState<DashboardStatsData>({
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    overdueTasks: 0
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const statsData = await apiService.getDashboardStats();
        setStats(statsData);
      } catch (error) {
        console.error('Error loading dashboard stats:', error);
      }
    };
    loadStats();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-gray-500 text-sm">Proyectos Totales</h3>
        <p className="text-2xl font-bold">{stats.totalProjects}</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-gray-500 text-sm">Tareas Totales</h3>
        <p className="text-2xl font-bold">{stats.totalTasks}</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-gray-500 text-sm">Tareas Completadas</h3>
        <p className="text-2xl font-bold">{stats.completedTasks}</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-gray-500 text-sm">Tareas Vencidas</h3>
        <p className="text-2xl font-bold">{stats.overdueTasks}</p>
      </div>
    </div>
  );
};