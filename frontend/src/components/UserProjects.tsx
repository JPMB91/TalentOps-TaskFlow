'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiService } from '@/services/api';

interface Project {
  id: string;
  name: string;
  description: string;
  _count?: {
    tasks: number;
  };
}

export const UserProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await apiService.getProjects();
        setProjects(data);
      } catch (error) {
        console.error('Error loading projects:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProjects();
  }, []);

  if (loading) {
    return <div className="text-gray-500">Cargando proyectos...</div>;
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No tienes proyectos aún</p>
        <Link
          href="/projects/new"
          className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Crear primer proyecto
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Mis Proyectos</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.id}`}
            className="block bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-lg transition border border-gray-200"
          >
            <h4 className="font-bold text-md text-gray-900">{project.name}</h4>
            <p className="text-gray-600 text-sm mt-1 line-clamp-2">
              {project.description || 'Sin descripción'}
            </p>
            {project._count?.tasks !== undefined && (
              <p className="text-xs text-gray-500 mt-2">
                {project._count.tasks} tarea{project._count.tasks !== 1 ? 's' : ''}
              </p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};