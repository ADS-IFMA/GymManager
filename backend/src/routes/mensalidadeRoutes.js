import express from 'express';
import {
  registrarMensalidade,
  listarMensalidadesAluno,
  atualizarStatusMensalidade
} from '../controllers/mensalidadeController.js';

const router = express.Router();

router.post('/mensalidades', registrarMensalidade);
router.get('/mensalidades/aluno/:id', listarMensalidadesAluno);
router.patch('/mensalidades/:id/status', atualizarStatusMensalidade);

export default router;