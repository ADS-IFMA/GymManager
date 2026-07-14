import express from 'express';
import { cadastrarProfissional } from '../controllers/profissionalController.js';

const router = express.Router();

router.post('/profissionais', cadastrarProfissional);

export default router;