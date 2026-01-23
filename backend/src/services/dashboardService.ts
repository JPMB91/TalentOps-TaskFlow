import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class DashboardService {
  static async getUserStats(userId: string) {
    // Obtener proyectos del usuario
    const userProjects = await prisma.project.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { members: { some: { userId } } }
        ]
      },
      include: {
        tasks: {
          include: {
            assignee: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    });

    // Calcular estadísticas
    const totalProjects = userProjects.length;
    
    // Obtener todas las tareas de los proyectos del usuario
    const allTasks = userProjects.flatMap(project => project.tasks);
    const totalTasks = allTasks.length;
    
    // Contar tareas por estado
    const completedTasks = allTasks.filter(task => task.status === 'DONE').length;
    const pendingTasks = totalTasks - completedTasks;
    
    // Tareas asignadas al usuario actual
    const assignedToMe = allTasks.filter(task => task.assigneeId === userId).length;

    return {
      totalProjects,
      totalTasks,
      completedTasks,
      pendingTasks,
      assignedToMe
    };
  }

  static async getRecentActivity(userId: string, limit: number = 10) {
    // Obtener proyectos del usuario para filtrar actividad
    const userProjects = await prisma.project.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { members: { some: { userId } } }
        ]
      },
      select: { id: true }
    });

    const projectIds = userProjects.map(project => project.id);

    // Obtener tareas recientes
    const recentTasks = await prisma.task.findMany({
      where: {
        projectId: { in: projectIds }
      },
      include: {
        project: {
          select: {
            name: true
          }
        },
        assignee: {
          select: {
            name: true,
            email: true
          }
        },
        reporter: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    });

    // Obtener proyectos recientes
    const recentProjects = await prisma.project.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { members: { some: { userId } } }
        ]
      },
      include: {
        owner: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    });

    // Formatear actividad
    const activity = [
      ...recentTasks.map(task => ({
        id: `task-${task.id}`,
        type: 'task_created' as const,
        title: `Nueva tarea en ${task.project.name}`,
        description: `"${task.title}" ${task.assignee ? 'asignada a ' + task.assignee.name : 'sin asignar'}`,
        timestamp: task.createdAt,
        projectId: task.projectId,
        taskId: task.id
      })),
      ...recentProjects.map(project => ({
        id: `project-${project.id}`,
        type: 'project_created' as const,
        title: 'Nuevo proyecto',
        description: `"${project.name}" creado por ${project.owner.name}`,
        timestamp: project.createdAt,
        projectId: project.id
      }))
    ];

    // Ordenar por fecha (más reciente primero) y limitar
    return activity
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }
}