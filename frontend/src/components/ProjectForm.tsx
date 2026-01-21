import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useProjectStore } from '@/stores/projectStore';

interface ProjectFormProps {
  onClose: () => void;
  initialData?: {
    name: string;
    description: string;
  };
  projectId?: string;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({
  onClose,
  initialData,
  projectId,
}) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    memberEmails: [] as string[],
  });

  const [currentEmail, setCurrentEmail] = useState('');
  const { createProject, updateProject, isLoading, error } = useProjectStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (projectId) {
        await updateProject(projectId, formData);
      } else {
        await createProject(formData);
      }
      onClose();
    } catch (error) {
      // Error handled by store
    }
  };

  const addMember = () => {
    if (currentEmail && !formData.memberEmails.includes(currentEmail)) {
      setFormData(prev => ({
        ...prev,
        memberEmails: [...prev.memberEmails, currentEmail],
      }));
      setCurrentEmail('');
    }
  };

  const removeMember = (email: string) => {
    setFormData(prev => ({
      ...prev,
      memberEmails: prev.memberEmails.filter(e => e !== email),
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {projectId ? 'Edit Project' : 'Create New Project'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData(prev => ({ ...prev, name: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter project name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData(prev => ({ ...prev, description: e.target.value }))
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe your project"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Team Members
            </label>
            <div className="flex space-x-2 mb-2">
              <input
                type="email"
                value={currentEmail}
                onChange={(e) => setCurrentEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMember())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter email address"
              />
              <button
                type="button"
                onClick={addMember}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                Add
              </button>
            </div>

            <div className="space-y-1">
              {formData.memberEmails.map((email) => (
                <div
                  key={email}
                  className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md"
                >
                  <span className="text-sm">{email}</span>
                  <button
                    type="button"
                    onClick={() => removeMember(email)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : projectId ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};