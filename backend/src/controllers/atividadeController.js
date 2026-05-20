import atividadeService from '../services/atividadeService.js';

export const criarAtividade = async (req, res) => {
  try {
    const atividade = await atividadeService.criarAtividade(req.body);
    res.status(201).json(atividade);
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
};

export const listarAtividades = async (req, res) => {
  try {
    const atividades = await atividadeService.listarAtividades();
    res.status(200).json(atividades);
  } catch (error) {
    res.status(500).json({ erro: 'Erro interno ao listar atividades.' });
  }
};

export const criarAgendamento = async (req, res) => {
  try {
    const agendamento = await atividadeService.criarAgendamento(req.body);
    res.status(201).json(agendamento);
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
};

export const listarAgendamentosDoAluno = async (req, res) => {
  try {
    const { id } = req.params;
    const agendamentos = await atividadeService.listarAgendamentosDoAluno(id);
    res.status(200).json(agendamentos);
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
};