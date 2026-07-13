//import express from 'express';
//import { cadastrarProfissional } from '../controllers/profissionalController.js';

//const router = express.Router();

//router.post('/profissionais', cadastrarProfissional);

//export default router;

import express from 'express';

import {
  cadastrarProfissional,
  listarProfissionais
} from '../controllers/profissionalController.js';

const router = express.Router();

router.post('/profissionais', cadastrarProfissional);
router.get('/profissionais', listarProfissionais);

export default router;