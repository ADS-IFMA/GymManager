import express from 'express';
import {
  criarAtividade,
  listarAtividades,
  buscarAtividade,
  listarAtividadesPorProfissional,
  inscreverAluno,
  cancelarInscricao,
  listarInscritos,
} from '../controllers/atividadeController.js';

const router = express.Router();

router.post('/atividades', criarAtividade);
router.get('/atividades', listarAtividades);
router.get('/atividades/:id', buscarAtividade);
router.get('/profissionais/:id_profissional/atividades', listarAtividadesPorProfissional);
router.post('/atividades/:id/inscricoes', inscreverAluno);
router.delete('/atividades/:id/inscricoes/:id_aluno', cancelarInscricao);
router.get('/atividades/:id/inscricoes', listarInscritos);

export default router;
