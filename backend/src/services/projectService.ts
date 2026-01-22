import { prisma } from '../config/database';

export class ProjectService {
  static async createProject(ownerId: string, projectData: {
    name: string;
    description?: string;
    memberEmails?: string[];
  }) {
    const { name, description, memberEmails = [] } = projectData;

    // Find users by emails
    const members = memberEmails.length > 0
      ? await prisma.user.findMany({
          where: { email: { in: memberEmails } },
          select: { id: true, email: true }
        })
      : [];

    // Create project with members
    const project = await prisma.project.create({
      data: {
        name,
        description,
        ownerId,
        members: {
          create: members.map(user => ({
            userId: user.id,
            role: 'MEMBER' as const
          }))
        }
      },
      include: {
        owner: {
          select: { id: true, name: true, email: true }
        },
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true, avatar: true }
            }
          }
        },
        _count: {
          select: { tasks: true }
        }
      }
    });

    return project;
  }

  static async getUserProjects(userId: string) {
    return await prisma.project.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { members: { some: { userId } } }
        ]
      },
      include: {
        owner: {
          select: { id: true, name: true, email: true }
        },
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true, avatar: true }
            }
          }
        },
        _count: {
          select: { tasks: true }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });
  }

  static async getProjectById(projectId: string, userId: string) {
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        OR: [
          { ownerId: userId },
          { members: { some: { userId } } }
        ]
      },
      include: {
        owner: {
          select: { id: true, name: true, email: true }
        },
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true, avatar: true }
            }
          }
        },
        tasks: {
          include: {
            assignee: {
              select: { id: true, name: true, email: true, avatar: true }
            },
            reporter: {
              select: { id: true, name: true, email: true }
            }
          },
          orderBy: { updatedAt: 'desc' }
        }
      }
    });

    if (!project) {
      throw new Error('Project not found or access denied');
    }

    return project;
  }

  static async updateProject(projectId: string, ownerId: string, updates: {
    name?: string;
    description?: string;
  }) {
    // Verify ownership
    const project = await prisma.project.findFirst({
      where: { id: projectId, ownerId }
    });

    if (!project) {
      throw new Error('Project not found or not authorized');
    }

    return await prisma.project.update({
      where: { id: projectId },
      data: updates,
      include: {
        owner: { select: { id: true, name: true, email: true } },
        members: {
          include: {
            user: { select: { id: true, name: true, email: true, avatar: true } }
          }
        }
      }
    });
  }

  static async deleteProject(projectId: string, ownerId: string) {
    const project = await prisma.project.findFirst({
      where: { id: projectId, ownerId }
    });

    if (!project) {
      throw new Error('Project not found or not authorized');
    }

    await prisma.project.delete({
      where: { id: projectId }
    });

    return { message: 'Project deleted successfully' };
  }
}