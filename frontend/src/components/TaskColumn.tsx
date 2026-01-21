'use client';

import React, { useState } from 'react';
import { type Task } from '@/stores/taskStore';

interface TaskColumnProps {
  id: string;
  title: string;
  color: string;
  tasks: Task[];
  onDrop: (taskId: string, newStatus: string) => void;
}

export const TaskColumn: React.FC<TaskColumnProps> = ({
  id,
  title,
  color,
  tasks,
  onDrop,
}) => {
  const [dragOver, setDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      onDrop(taskId, id);
    }
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  return (
    <div className="flex-shrink-0 w-80">
      <div className={`${color} rounded-lg p-4`}>
        <h3 className="font-semibold text-gray-700 mb-4">
          {title} ({tasks.length})
        </h3>

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`space-y-3 min-h-[200px] ${
            dragOver ? 'bg-blue-50 border-2 border-blue-300 border-dashed' : ''
          }`}
        >
          {tasks.map((task) => (
            <div
              key={task.id}
              draggable
              onDragStart={(e) => handleDragStart(e, task.id)}
              className="bg-white p-4 rounded-lg shadow cursor-move hover:shadow-md transition-shadow"
            >
              <h4 className="font-medium text-gray-900">{task.title}</h4>
              {task.description && (
                <p className="text-sm text-gray-600 mt-2">{task.description}</p>
              )}
              {task.dueDate && (
                <p className="text-xs text-gray-500 mt-2">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};