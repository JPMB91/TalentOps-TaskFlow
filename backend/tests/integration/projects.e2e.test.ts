import request from 'supertest';
import { prisma } from '../../src/config/database';
import app from '../../src/index';

describe('Projects API Integration', () => {
  let authToken: string;
  let userId: string;

  beforeAll(async () => {
    // Crear usuario de prueba
    const user = await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedpassword',
      },
    });
    userId = user.id;

    // Generar token (simular login)
    const jwt = require('jsonwebtoken');
    authToken = jwt.sign(
      { userId },
      process.env.JWT_SECRET || 'test-secret',
      { expiresIn: '1h' }
    );
  });

  afterAll(async () => {
    // Limpiar base de datos
    await prisma.projectMember.deleteMany();
    await prisma.task.deleteMany();
    await prisma.project.deleteMany();
    await prisma.user.deleteMany();
  });

  describe('POST /api/projects', () => {
    test('should create project successfully', async () => {
      const projectData = {
        name: 'Test Project',
        description: 'A test project',
        memberEmails: [],
      };

      const response = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send(projectData)
        .expect(201);

      expect(response.body.id).toBeDefined();
      expect(response.body.name).toBe(projectData.name);
      expect(response.body.owner.id).toBe(userId);
    });

    test('should add members to project', async () => {
      // Crear usuario adicional
      const member = await prisma.user.create({
        data: {
          name: 'Member User',
          email: 'member@example.com',
          password: 'hashedpassword',
        },
      });

      const projectData = {
        name: 'Project with Members',
        description: 'Testing member addition',
        memberEmails: [member.email],
      };

      const response = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send(projectData)
        .expect(201);

      expect(response.body.members).toHaveLength(1);
      expect(response.body.members[0].user.email).toBe(member.email);
    });
  });

  describe('GET /api/projects', () => {
    test('should return user projects', async () => {
      // Crear proyecto de prueba
      await prisma.project.create({
        data: {
          name: 'User Project',
          description: 'Belongs to user',
          ownerId: userId,
        },
      });

      const response = await request(app)
        .get('/api/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0].owner.id).toBe(userId);
    });
  });

  describe('PUT /api/projects/:id', () => {
    test('should update project', async () => {
      const project = await prisma.project.create({
        data: {
          name: 'Original Name',
          description: 'Original description',
          ownerId: userId,
        },
      });

      const updates = {
        name: 'Updated Name',
        description: 'Updated description',
      };

      const response = await request(app)
        .put(`/api/projects/${project.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updates)
        .expect(200);

      expect(response.body.name).toBe(updates.name);
      expect(response.body.description).toBe(updates.description);
    });

    test('should return 403 for non-owner update', async () => {
      // Crear otro usuario
      const otherUser = await prisma.user.create({
        data: {
          name: 'Other User',
          email: 'other@example.com',
          password: 'hashedpassword',
        },
      });

      const project = await prisma.project.create({
        data: {
          name: 'Other User Project',
          ownerId: otherUser.id,
        },
      });

      const otherToken = jwt.sign(
        { userId: otherUser.id },
        process.env.JWT_SECRET || 'test-secret'
      );

      await request(app)
        .put(`/api/projects/${project.id}`)
        .set('Authorization', `Bearer ${otherToken}`)
        .send({ name: 'Hacked Name' })
        .expect(403);
    });
  });
});