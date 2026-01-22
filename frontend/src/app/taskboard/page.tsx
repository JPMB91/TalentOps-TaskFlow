'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useTaskStore } from '@/stores/taskStore';
import { useProjectStore } from '@/stores/projectStore';
import { TaskBoard } from '@/components/TaskBoard';

export default function ProjectPage() {
  const params = useParams();
  const projectId = params.id as string;
  
  const { fetchTasks } = useTaskStore();
  const { fetchProject, currentProject } = useProjectStore();

  useEffect(() => {
    if (projectId) {
      fetchProject(projectId);
      fetchTasks(projectId);
    }
  }, [projectId, fetchProject, fetchTasks]);

  if (!currentProject) {
    return <div>Loading project...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {currentProject.name}
        </h1>
        {currentProject.description && (
          <p className="text-gray-600">{currentProject.description}</p>
        )}
      </div>

      <TaskBoard />
    </div>
  );
}
