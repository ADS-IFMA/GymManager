import express from 'express';
import { registrarCheckin, listarCheckinsPorAluno } from '../controllers/checkinController.js';

const router = express.Router();

router.post('/checkins', registrarCheckin);
router.get('/checkins/aluno/:id', listarCheckinsPorAluno);

export default router;
