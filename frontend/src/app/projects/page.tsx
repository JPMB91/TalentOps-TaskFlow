'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiService } from '@/services/api';


interface Project {
  id: string;
  name: string;
  description: string;
}

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const loadProjects = async () => {
      const data = await apiService.getProjects();
      setProjects(data);
    };
    loadProjects();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Proyectos</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <div
            key={project.id}
            data-cy="project-card"
            onClick={() => router.push(`/projects/${project.id}`)}
            className="bg-white p-6 rounded-lg shadow cursor-pointer hover:shadow-lg transition"
          >
            <h3 className="font-bold text-lg">{project.name}</h3>
            <p className="text-gray-600 text-sm mt-2">{project.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}