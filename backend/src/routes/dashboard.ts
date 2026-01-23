import express from 'express';
import { authenticate } from '../middleware/auth';
import { DashboardService } from '../services/dashboardService';

const router = express.Router();

// Obtener estadísticas del dashboard
router.get('/stats', authenticate, async (req, res) => {
  try {
    const userId = req.user.userId;
    const stats = await DashboardService.getUserStats(userId);
    res.json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener actividad reciente
router.get('/activity', authenticate, async (req, res) => {
  try {
    const userId = req.user.userId;
    const limit = parseInt(req.query.limit as string) || 10;
    
    const activity = await DashboardService.getRecentActivity(userId, limit);
    res.json(activity);
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;