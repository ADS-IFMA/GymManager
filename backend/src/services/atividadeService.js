import Atividade from '../models/Atividade.js';

class AtividadeService {
  async criarAtividade(dados) {
    if (!dados.nome || !dados.duracao_minutos || !dados.profissional_id) {
      throw new Error('Nome, duracao_minutos e profissional_id são obrigatórios.');
    }
    return await Atividade.criarAtividade(dados);
  }

  async listarAtividades() {
    return await Atividade.listarAtividades();
  }

  async criarAgendamento(dados) {
    if (!dados.atividade_id || !dados.aluno_id || !dados.data_hora) {
      throw new Error('atividade_id, aluno_id e data_hora são obrigatórios.');
    }
    return await Atividade.criarAgendamento(dados);
  }

  async listarAgendamentosDoAluno(aluno_id) {
    if (!aluno_id) {
      throw new Error('O ID do aluno é obrigatório.');
    }
    return await Atividade.listarAgendamentosDoAluno(aluno_id);
  }
}

export default new AtividadeService();