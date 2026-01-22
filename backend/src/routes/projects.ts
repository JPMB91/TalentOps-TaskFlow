import express from 'express';
import { authenticate } from '../middleware/auth';
import { ProjectService } from '../services/projectService';
import { validateCreateProject, validateUpdateProject } from '../validators/projectValidators';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get user's projects
router.get('/', async (req, res) => {
  try {
    const projects = await ProjectService.getUserProjects(req.user.id);
    res.json(projects);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get specific project
router.get('/:id', async (req, res) => {
  try {
    const project = await ProjectService.getProjectById(req.params.id, req.user.id);
    res.json(project);
  } catch (error: any) {
    const status = error.message.includes('not found') ? 404 : 403;
    res.status(status).json({ error: error.message });
  }
});

// Create project
router.post('/', validateCreateProject, async (req, res) => {
  try {
    const project = await ProjectService.createProject(req.user.id, req.body);
    res.status(201).json(project);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Update project
router.put('/:id', validateUpdateProject, async (req, res) => {
  try {
    const projectId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const project = await ProjectService.updateProject(projectId, req.user.id, req.body);
    res.json(project);
  } catch (error: any) {
    const status = error.message.includes('not found') ? 404 : 403;
    res.status(status).json({ error: error.message });
  }
});

// Delete project
router.delete('/:id', async (req, res) => {
  try {
    const result = await ProjectService.deleteProject(req.params.id, req.user.id);
    res.json(result);
  } catch (error: any) {
    const status = error.message.includes('not found') ? 404 : 403;
    res.status(status).json({ error: error.message });
  }
});

export default router;