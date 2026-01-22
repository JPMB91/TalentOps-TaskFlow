import { prisma } from '../config/database';
import { TaskStatus, TaskPriority } from '@prisma/client';

export class TaskService {
  static async getProjectTasks(projectId: string, userId: string) {
    // Verify user has access to project
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        OR: [
          { ownerId: userId },
          { members: { some: { userId } } }
        ]
      }
    });

    if (!project) {
      throw new Error('Project not found or access denied');
    }

    return await prisma.task.findMany({
      where: { projectId },
      include: {
        assignee: {
          select: { id: true, name: true, email: true, avatar: true }
        },
        reporter: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async createTask(userId: string, data: {
    title: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    projectId: string;
    assigneeId?: string;
    dueDate?: Date;
  }) {
    // Verify user has access to project
    const project = await prisma.project.findFirst({
      where: {
        id: data.projectId,
        OR: [
          { ownerId: userId },
          { members: { some: { userId } } }
        ]
      }
    });

    if (!project) {
      throw new Error('Project not found or access denied');
    }

    return await prisma.task.create({
      data: {
        ...data,
        reporterId: userId,
        status: data.status || 'TODO',
        priority: data.priority || 'MEDIUM'
      },
      include: {
        assignee: {
          select: { id: true, name: true, email: true, avatar: true }
        },
        reporter: {
          select: { id: true, name: true, email: true }
        }
      }
    });
  }

  static async updateTask(taskId: string, userId: string, updates: {
    title?: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    assigneeId?: string;
    dueDate?: Date;
  }) {
    // Verify user has access to task's project
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { project: true }
    });

    if (!task) {
      throw new Error('Task not found');
    }

    const hasAccess = await prisma.project.findFirst({
      where: {
        id: task.projectId,
        OR: [
          { ownerId: userId },
          { members: { some: { userId } } }
        ]
      }
    });

    if (!hasAccess) {
      throw new Error('Access denied');
    }

    return await prisma.task.update({
      where: { id: taskId },
      data: updates,
      include: {
        assignee: {
          select: { id: true, name: true, email: true, avatar: true }
        },
        reporter: {
          select: { id: true, name: true, email: true }
        }
      }
    });
  }

  static async updateTaskStatus(taskId: string, userId: string, status: TaskStatus) {
    return await this.updateTask(taskId, userId, { status });
  }

  static async deleteTask(taskId: string, userId: string) {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { project: true }
    });

    if (!task) {
      throw new Error('Task not found');
    }

    const hasAccess = await prisma.project.findFirst({
      where: {
        id: task.projectId,
        OR: [
          { ownerId: userId },
          { members: { some: { userId } } }
        ]
      }
    });

    if (!hasAccess) {
      throw new Error('Access denied');
    }

    await prisma.task.delete({
      where: { id: taskId }
    });

    return { message: 'Task deleted successfully' };
  }
}