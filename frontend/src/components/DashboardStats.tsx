'use client';

import { apiService } from '@/services/api';
import { useEffect, useState } from 'react';


export const DashboardStats: React.FC = () => {
  const [stats, setStats] = useState({ totalProjects: 0 });

  // useEffect(() => {
  //   const loadStats = async () => {
  //     try {
  //       const projects = await apiService.getProjects();
  //       setStats({ totalProjects: projects.length });
  //     } catch (error) {
  //       console.error('Error loading stats:', error);
  //     }
  //   };
  //   loadStats();
  // }, []);


  useEffect(() => {
  const loadStats = async () => {
    try {
      console.log('Fetching projects...');
      const projects = await apiService.getProjects();
      console.log('Projects received:', projects); // <-- Esto debería aparecer en consola
      console.log('Projects length:', projects.length);
      setStats({ totalProjects: projects.length });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };
  loadStats();
}, []);
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-gray-500 text-sm">Total Projects</h3>
        <p className="text-2xl font-bold">{stats.totalProjects}</p>
      </div>
    </div>
  );
};