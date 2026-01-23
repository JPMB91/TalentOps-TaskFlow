"use client";

import { useEffect, useState } from "react";

import { useParams } from "next/navigation";
import { apiService } from "@/services/api";

interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  dueDate?: string;
  assignee?: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface Project {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  members?: Array<{
    id: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
    role: string;
  }>;
  tasks?: Task[];
}

export default function ProjectDetailPage() {
  const params = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "MEDIUM",
    assigneeId: "",
    dueDate: "",
  });

  useEffect(() => {
    const loadProjectData = async () => {
      const [projectData, tasksData] = await Promise.all([
        apiService.getProject(params.id as string),
        apiService.getProjectTasks(params.id as string)
      ]);
      setProject(projectData);
      setName(projectData.name);
      setTasks(tasksData);
    };
    loadProjectData();
  }, [params.id]);

const handleUpdate = async () => {
  if (!project) return;
  
  await apiService.updateProject(params.id as string, { name });
  setIsEditing(false);
  setProject({ ...project, name });
};
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    const newTask = await apiService.createTask(params.id as string, taskData);
    setTasks([...tasks, newTask]);
    setShowTaskForm(false);
    setTaskData({
      title: "",
      description: "",
      priority: "MEDIUM",
      assigneeId: "",
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
            <select
              data-cy="task-assignee"
              value={taskData.assigneeId}
              onChange={(e) =>
                setTaskData({ ...taskData, assigneeId: e.target.value })
              }
              className="w-full p-2 border rounded mb-2"
            >
              <option value="">Seleccionar asignado</option>
              {project?.members?.map((member) => (
                <option key={member.user.id} value={member.user.id}>
                  {member.user.name} ({member.user.email})
                </option>
              ))}
            </select>
            <button
              data-cy="create-task"
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded"
            >
              Crear Tarea
            </button>
          </form>
        )}

        {/* Mostrar tareas existentes */}
        {tasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="bg-white p-4 rounded-lg shadow border"
                data-cy="task-item"
              >
                <h3 className="font-semibold text-lg mb-2" data-cy="task-title">
                  {task.title}
                </h3>
                {task.description && (
                  <p className="text-gray-600 mb-2" data-cy="task-description">
                    {task.description}
                  </p>
                )}
                <div className="flex justify-between items-center mb-2">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      task.status === 'todo'
                        ? 'bg-gray-200 text-gray-800'
                        : task.status === 'in_progress'
                        ? 'bg-blue-200 text-blue-800'
                        : 'bg-green-200 text-green-800'
                    }`}
                    data-cy="task-status"
                  >
                    {task.status === 'todo'
                      ? 'Pendiente'
                      : task.status === 'in_progress'
                      ? 'En Progreso'
                      : 'Completada'}
                  </span>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      task.priority === 'LOW'
                        ? 'bg-green-200 text-green-800'
                        : task.priority === 'MEDIUM'
                        ? 'bg-yellow-200 text-yellow-800'
                        : task.priority === 'HIGH'
                        ? 'bg-orange-200 text-orange-800'
                        : 'bg-red-200 text-red-800'
                    }`}
                    data-cy="task-priority"
                  >
                    {task.priority === 'LOW'
                      ? 'Baja'
                      : task.priority === 'MEDIUM'
                      ? 'Media'
                      : task.priority === 'HIGH'
                      ? 'Alta'
                      : 'Urgente'}
                  </span>
                </div>
                {task.dueDate && (
                  <p className="text-sm text-gray-500 mb-2" data-cy="task-due-date">
                    Vence: {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                )}
                {task.assignee && (
                  <p className="text-sm text-gray-600" data-cy="task-assignee">
                    Asignado a: {task.assignee.name}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8" data-cy="no-tasks">
            No hay tareas en este proyecto. ¡Crea la primera!
          </p>
        )}
      </div>
    </div>
  );
}
