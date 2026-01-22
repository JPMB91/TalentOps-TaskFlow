"use client";

import { useEffect, useState } from "react";

import { useParams } from "next/navigation";
import { apiService } from "@/services/api";

interface Project {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export default function ProjectDetailPage() {
  const params = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "MEDIUM",
    dueDate: "",
  });

  useEffect(() => {
    const loadProject = async () => {
      const data = await apiService.getProject(params.id as string);
      setProject(data);
      setName(data.name);
    };
    loadProject();
  }, [params.id]);

const handleUpdate = async () => {
  if (!project) return;
  
  await apiService.updateProject(params.id as string, { name });
  setIsEditing(false);
  setProject({ ...project, name });
};
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    await apiService.createTask(params.id as string, taskData);
    setShowTaskForm(false);
    setTaskData({
      title: "",
      description: "",
      priority: "MEDIUM",
      dueDate: "",
    });
  };

  if (!project) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        {isEditing ? (
          <input
            data-cy="project-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="text-2xl font-bold border-b-2"
          />
        ) : (
          <h1 data-cy="project-title" className="text-2xl font-bold">
            {project.name}
          </h1>
        )}

        {isEditing ? (
          <button
            data-cy="save-changes"
            onClick={handleUpdate}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Guardar
          </button>
        ) : (
          <button
            data-cy="edit-project"
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Editar
          </button>
        )}
      </div>

      <div data-cy="task-board" className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Tareas</h2>
          <button
            data-cy="add-task"
            onClick={() => setShowTaskForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Agregar Tarea
          </button>
        </div>

        {showTaskForm && (
          <form
            onSubmit={handleCreateTask}
            className="mb-6 p-4 bg-gray-50 rounded"
          >
            <input
              data-cy="task-title"
              value={taskData.title}
              onChange={(e) =>
                setTaskData({ ...taskData, title: e.target.value })
              }
              placeholder="Título"
              className="w-full p-2 border rounded mb-2"
              required
            />
            <textarea
              data-cy="task-description"
              value={taskData.description}
              onChange={(e) =>
                setTaskData({ ...taskData, description: e.target.value })
              }
              placeholder="Descripción"
              className="w-full p-2 border rounded mb-2"
            />
            <select
              data-cy="task-priority"
              value={taskData.priority}
              onChange={(e) =>
                setTaskData({ ...taskData, priority: e.target.value })
              }
              className="w-full p-2 border rounded mb-2"
            >
              <option value="LOW">Baja</option>
              <option value="MEDIUM">Media</option>
              <option value="HIGH">Alta</option>
              <option value="URGENT">Urgente</option>
            </select>
            <input
              data-cy="task-due-date"
              type="date"
              value={taskData.dueDate}
              onChange={(e) =>
                setTaskData({ ...taskData, dueDate: e.target.value })
              }
              className="w-full p-2 border rounded mb-2"
            />
            <button
              data-cy="create-task"
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded"
            >
              Crear Tarea
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
