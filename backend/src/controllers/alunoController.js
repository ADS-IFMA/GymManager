import alunoService from '../services/alunoService.js';

export const cadastrarAluno = async (req, res) => {
  try {
    const alunoCriado = await alunoService.cadastrar(req.body);
    res.status(201).json(alunoCriado);
  } catch (error) {
    console.error('Erro ao cadastrar aluno:', error.message);
    res.status(400).json({ erro: error.message });
  }
};
