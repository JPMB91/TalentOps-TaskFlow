import React from "react";
import { useTaskStore, type TaskStatus } from "@/stores/taskStore";
import { TaskColumn } from "./TaskColumn";

const COLUMNS = [
  { id: "TODO", title: "To Do", color: "bg-gray-100" },
  { id: "IN_PROGRESS", title: "In Progress", color: "bg-blue-100" },
  { id: "REVIEW", title: "Review", color: "bg-yellow-100" },
  { id: "DONE", title: "Done", color: "bg-green-100" },
];

export const TaskBoard: React.FC = () => {
  const { tasks, moveTask } = useTaskStore();

  const handleDrop = (taskId: string, newStatus: string) => {
    moveTask(taskId, newStatus as TaskStatus);
  };

  return (
    <div className="flex space-x-6 overflow-x-auto pb-4">
      {COLUMNS.map((column) => {
        const columnTasks = tasks.filter((task) => task.status === column.id);

        return (
          <TaskColumn
            key={column.id}
            id={column.id}
            title={column.title}
            color={column.color}
            tasks={columnTasks}
            onDrop={handleDrop}
          />
        );
      })}
    </div>
  );
};
