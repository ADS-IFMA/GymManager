import express from 'express';
import { cadastrarAluno, listarAlunos } from '../controllers/alunoController.js';

const router = express.Router();

router.post('/alunos', cadastrarAluno);
router.get('/alunos', listarAlunos);

export default router;
