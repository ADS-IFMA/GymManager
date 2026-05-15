import express from 'express';
import { obterDashboard } from '../controllers/dashboardController.js';

const router = express.Router();

router.get('/dashboard', obterDashboard);

export default router;