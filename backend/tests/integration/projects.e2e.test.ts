import supertest from 'supertest';
const request = supertest;
import { prisma } from '../../src/config/database';
import app from '../../src/index';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import { config } from '../../src/config/environment';

describe('Projects API Integration', () => {
  let authToken: string;
  let userId: string;

  beforeAll(async () => {
  // Usar un email único para esta suite de tests
  const hashedPassword = await bcrypt.hash('Password123@', 12);
  const user = await prisma.user.create({
    data: {
      name: 'Project Test User',
      email: 'project-test@example.com',  // Email único
      password: hashedPassword,
    },
  });
  userId = user.id;

  authToken = jwt.sign(
    { userId },
    config.jwtSecret,
    { expiresIn: '1h' }
  );
});

beforeEach(async () => {
  await prisma.projectMember.deleteMany();
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();
  
  // Verificar que el usuario específico de ESTA suite existe
  const userExists = await prisma.user.findUnique({
    where: { email: 'project-test@example.com' }
  });
  
  if (!userExists) {
    throw new Error('Project test user was deleted!');
  }
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
// Crear usuario adicional con contraseña hasheada
      const memberPassword = await bcrypt.hash('password123', 12);
      const member = await prisma.user.create({
        data: {
          name: 'Member User',
          email: 'member@example.com',
          password: memberPassword,
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
      // First create a project via API to ensure proper setup
      await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'User Project',
          description: 'Belongs to user',
          memberEmails: [],
        })
        .expect(201);

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
      // First create a project via API
      const createResponse = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Original Name',
          description: 'Original description',
          memberEmails: [],
        })
        .expect(201);

      const updates = {
        name: 'Updated Name',
        description: 'Updated description',
      };

      const response = await request(app)
        .put(`/api/projects/${createResponse.body.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updates)
        .expect(200);

      expect(response.body.name).toBe(updates.name);
      expect(response.body.description).toBe(updates.description);
    });

test('should return 404 for non-owner update', async () => {
      // Crear otro usuario con contraseña hasheada
      const otherUserPassword = await bcrypt.hash('Password123@', 12);
      const otherUser = await prisma.user.create({
        data: {
          name: 'Other User',
          email: 'other@example.com',
          password: otherUserPassword,
        },
      });

      // Create project as other user
      const otherToken = jwt.sign(
        { userId: otherUser.id },
        config.jwtSecret 
      );

      const createResponse = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${otherToken}`)
        .send({
          name: 'Other User Project',
          description: 'Should not be updatable by others',
          memberEmails: [],
        })
        .expect(201);

      // Try to update other user's project with original user's token
      const response = await request(app)
        .put(`/api/projects/${createResponse.body.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Hacked Name' });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Project not found or not authorized');
    });
  });
});