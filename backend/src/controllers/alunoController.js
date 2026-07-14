import alunoService from '../services/alunoService.js';

export const listarAlunos = async (_req, res) => {
  try {
    const alunos = await alunoService.listar();
    res.json(alunos);
  } catch (error) {
    console.error('Erro ao listar alunos:', error.message);
    res.status(500).json({ erro: error.message });
  }
};

export const cadastrarAluno = async (req, res) => {
  try {
    const alunoCriado = await alunoService.cadastrar(req.body);
    res.status(201).json(alunoCriado);
  } catch (error) {
    console.error('Erro ao cadastrar aluno:', error.message);
    res.status(400).json({ erro: error.message });
  }
};
