import express from 'express';
import {
  criarAtividade,
  listarAtividades,
<<<<<<< HEAD
  buscarAtividade,
  listarAtividadesPorProfissional,
  inscreverAluno,
  cancelarInscricao,
  listarInscritos,
=======
  criarAgendamento,
  listarAgendamentosDoAluno
>>>>>>> origin/develop
} from '../controllers/atividadeController.js';

const router = express.Router();

router.post('/atividades', criarAtividade);
router.get('/atividades', listarAtividades);
<<<<<<< HEAD
router.get('/atividades/:id', buscarAtividade);
router.get('/profissionais/:id_profissional/atividades', listarAtividadesPorProfissional);
router.post('/atividades/:id/inscricoes', inscreverAluno);
router.delete('/atividades/:id/inscricoes/:id_aluno', cancelarInscricao);
router.get('/atividades/:id/inscricoes', listarInscritos);

export default router;
=======
router.post('/agendamentos', criarAgendamento);
router.get('/agendamentos/aluno/:id', listarAgendamentosDoAluno);

export default router;
>>>>>>> origin/develop
