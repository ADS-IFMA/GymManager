import express from 'express';

const router = express.Router();

router.get('/mensalidades', (_req, res) => {
  res.json([]);
});

router.get('/mensalidades/aluno/:alunoId', (_req, res) => {
  res.json([]);
});

router.patch('/mensalidades/:id', (req, res) => {
  res.json({ id: req.params.id, status: req.body.status || 'PAGO' });
});

export default router;
