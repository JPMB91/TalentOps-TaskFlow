import React from 'react';
import { Calendar, Users, MoreVertical } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  members: Array<{ id: string; name: string; avatar?: string }>;
}

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {project.name}
        </h3>
        <button className="text-gray-400 hover:text-gray-600">
          <MoreVertical size={20} />
        </button>
      </div>

      {project.description && (
        <p className="text-gray-600 mb-4 line-clamp-2">
          {project.description}
        </p>
      )}

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-1">
          <Users size={16} />
          <span>{project.members.length} members</span>
        </div>

        <div className="flex items-center space-x-1">
          <Calendar size={16} />
          <span>
            {new Date(project.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="flex -space-x-2 mt-4">
        {project.members.slice(0, 3).map((member) => (
          <img
            key={member.id}
            src={member.avatar || '/default-avatar.png'}
            alt={member.name}
            className="w-8 h-8 rounded-full border-2 border-white"
          />
        ))}
        {project.members.length > 3 && (
          <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs text-gray-600">
            +{project.members.length - 3}
          </div>
        )}
      </div>
    </div>
  );
};