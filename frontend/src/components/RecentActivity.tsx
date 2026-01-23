'use client';

import { apiService } from '@/services/api';
import { useEffect, useState } from 'react';

interface ActivityItem {
  id: string;
  type: 'task_created' | 'task_updated' | 'task_completed' | 'project_created' | 'comment_added';
  description: string;
  timestamp: string;
  user?: {
    name: string;
    avatar?: string;
  };
}

export const RecentActivity: React.FC = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadActivities = async () => {
      try {
        const activityData = await apiService.getRecentActivity();
        setActivities(activityData);
      } catch (error) {
        console.error('Error loading recent activity:', error);
      } finally {
        setLoading(false);
      }
    };
    loadActivities();
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'task_created':
        return '📝';
      case 'task_updated':
        return '✏️';
      case 'task_completed':
        return '✅';
      case 'project_created':
        return '📁';
      case 'comment_added':
        return '💬';
      default:
        return '📋';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Actividad Reciente</h3>
        <p className="text-gray-500">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Actividad Reciente</h3>
      
      {activities.length === 0 ? (
        <p className="text-gray-500">No hay actividad reciente</p>
      ) : (
        <div className="space-y-3">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <span className="text-lg">{getActivityIcon(activity.type)}</span>
              <div className="flex-1">
                <p className="text-sm text-gray-800">{activity.description}</p>
                <p className="text-xs text-gray-500">{formatDate(activity.timestamp)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};