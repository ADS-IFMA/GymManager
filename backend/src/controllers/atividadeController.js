import atividadeService from '../services/atividadeService.js';
import inscricaoService from '../services/inscricaoService.js';

export const criarAtividade = async (req, res) => {
  try {
    const atividade = await atividadeService.criar(req.body);
    res.status(201).json(atividade);
  } catch (error) {
    console.error('Erro ao criar atividade:', error.message);
    res.status(400).json({ erro: error.message });
  }
};

export const listarAtividades = async (req, res) => {
  try {
    const atividades = await atividadeService.listar();
    res.status(200).json(atividades);
  } catch (error) {
    console.error('Erro ao listar atividades:', error.message);
    res.status(400).json({ erro: error.message });
  }
};

export const buscarAtividade = async (req, res) => {
  try {
    const { id } = req.params;
    const atividade = await atividadeService.buscarPorId(id);
    res.status(200).json(atividade);
  } catch (error) {
    console.error('Erro ao buscar atividade:', error.message);
    res.status(404).json({ erro: error.message });
  }
};

export const listarAtividadesPorProfissional = async (req, res) => {
  try {
    const { id_profissional } = req.params;
    const atividades = await atividadeService.listarPorProfissional(id_profissional);
    res.status(200).json(atividades);
  } catch (error) {
    console.error('Erro ao listar atividades do profissional:', error.message);
    res.status(400).json({ erro: error.message });
  }
};

export const inscreverAluno = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_aluno } = req.body;

    if (!id_aluno) {
      return res.status(400).json({ erro: 'ID do aluno é obrigatório.' });
    }

    const inscricao = await inscricaoService.inscrever(id_aluno, id);
    res.status(201).json(inscricao);
  } catch (error) {
    console.error('Erro ao inscrever aluno:', error.message);
    res.status(400).json({ erro: error.message });
  }
};

export const cancelarInscricao = async (req, res) => {
  try {
    const { id, id_aluno } = req.params;
    const resultado = await inscricaoService.cancelar(id_aluno, id);
    res.status(200).json(resultado);
  } catch (error) {
    console.error('Erro ao cancelar inscrição:', error.message);
    res.status(400).json({ erro: error.message });
  }
};

export const listarInscritos = async (req, res) => {
  try {
    const { id } = req.params;
    const inscritos = await inscricaoService.listarInscritos(id);
    res.status(200).json(inscritos);
  } catch (error) {
    console.error('Erro ao listar inscritos:', error.message);
    res.status(404).json({ erro: error.message });
  }
};
