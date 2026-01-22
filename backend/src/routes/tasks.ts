import express from 'express';
import { authenticate } from '../middleware/auth';
import { TaskService } from '../services/taskService';

const router = express.Router();

router.use(authenticate);

// Get tasks for a project
router.get('/projects/:projectId/tasks', async (req, res) => {
  try {
    const tasks = await TaskService.getProjectTasks(req.params.projectId, req.user.id);
    res.json(tasks);
  } catch (error: any) {
    const status = error.message.includes('not found') || error.message.includes('denied') ? 404 : 500;
    res.status(status).json({ error: error.message });
  }
});

// Create task
router.post('/tasks', async (req, res) => {
  try {
    const task = await TaskService.createTask(req.user.id, req.body);
    res.status(201).json(task);
  } catch (error: any) {
    const status = error.message.includes('not found') || error.message.includes('denied') ? 403 : 400;
    res.status(status).json({ error: error.message });
  }
});

// Update task
router.put('/tasks/:id', async (req, res) => {
  try {
    const task = await TaskService.updateTask(req.params.id, req.user.id, req.body);
    res.json(task);
  } catch (error: any) {
    const status = error.message.includes('not found') ? 404 : 403;
    res.status(status).json({ error: error.message });
  }
});

// Update task status (for drag-and-drop)
router.patch('/tasks/:id/status', async (req, res) => {
  try {
    const task = await TaskService.updateTaskStatus(req.params.id, req.user.id, req.body.status);
    res.json(task);
  } catch (error: any) {
    const status = error.message.includes('not found') ? 404 : 403;
    res.status(status).json({ error: error.message });
  }
});

// Delete task
router.delete('/tasks/:id', async (req, res) => {
  try {
    const result = await TaskService.deleteTask(req.params.id, req.user.id);
    res.json(result);
  } catch (error: any) {
    const status = error.message.includes('not found') ? 404 : 403;
    res.status(status).json({ error: error.message });
  }
});

export default router;