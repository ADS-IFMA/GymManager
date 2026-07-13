import Checkin from '../models/Checkin.js';

class CheckinService {
  async registrarCheckin(id_aluno) {
    if (!id_aluno) {
      throw new Error('ID do aluno é obrigatório para registrar check-in.');
    }

    try {
      const checkin = await Checkin.create({ id_aluno });
      return checkin;
    } catch (error) {
      throw new Error(`Erro ao registrar check-in: ${error.message}`);
    }
  }

  async listarCheckinsPorAluno(id_aluno) {
    if (!id_aluno) {
      throw new Error('ID do aluno é obrigatório para listar check-ins.');
    }

    try {
      const checkins = await Checkin.buscarPorAluno(id_aluno);
      return checkins;
    } catch (error) {
      throw new Error(`Erro ao listar check-ins do aluno: ${error.message}`);
    }
  }
}

export default new CheckinService();
