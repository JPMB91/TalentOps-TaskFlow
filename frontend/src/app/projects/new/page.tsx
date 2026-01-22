'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiService } from '@/services/api';


export default function NewProject() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [memberEmails, setMemberEmails] = useState<string[]>([]);
  const [message, setMessage] = useState('');

  const handleAddMember = () => {
    if (memberEmail && !memberEmails.includes(memberEmail)) {
      setMemberEmails([...memberEmails, memberEmail]);
      setMemberEmail('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiService.createProject({ name, description, memberEmails });
      setMessage('Proyecto creado exitosamente');
      setTimeout(() => router.push('/projects'), 1500);
    } catch (error) {
      setMessage('Error al crear proyecto');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Crear Nuevo Proyecto</h1>
      
      {message && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nombre</label>
          <input
            data-cy="project-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Descripción</label>
          <textarea
            data-cy="project-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Agregar Miembros</label>
          <div className="flex gap-2">
            <input
              data-cy="member-email"
              type="email"
              value={memberEmail}
              onChange={(e) => setMemberEmail(e.target.value)}
              className="flex-1 p-2 border rounded"
              placeholder="email@example.com"
            />
            <button
              data-cy="add-member"
              type="button"
              onClick={handleAddMember}
              className="px-4 py-2 bg-gray-600 text-white rounded"
            >
              Agregar
            </button>
          </div>
          {memberEmails.length > 0 && (
            <ul className="mt-2 space-y-1">
              {memberEmails.map((email) => (
                <li key={email} className="text-sm text-gray-600">• {email}</li>
              ))}
            </ul>
          )}
        </div>

        <button
          data-cy="create-project"
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Crear Proyecto
        </button>
      </form>
    </div>
  );
}