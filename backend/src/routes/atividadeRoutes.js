import express from 'express';
import {
  criarAtividade,
  listarAtividades,
  criarAgendamento,
  listarAgendamentosDoAluno
} from '../controllers/atividadeController.js';

const router = express.Router();

router.post('/atividades', criarAtividade);
router.get('/atividades', listarAtividades);
router.post('/agendamentos', criarAgendamento);
router.get('/agendamentos/aluno/:id', listarAgendamentosDoAluno);

export default router;