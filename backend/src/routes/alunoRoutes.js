import express from 'express';
import { cadastrarAluno, listarAlunos } from '../controllers/alunoController.js';

const router = express.Router();

router.get('/alunos', listarAlunos);
router.post('/alunos', cadastrarAluno);

export default router;
