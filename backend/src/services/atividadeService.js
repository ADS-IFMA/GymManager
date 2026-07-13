import db from '../database/db.js';
import Atividade from '../models/Atividade.js';
import Usuario from '../models/Usuario.js';

class AtividadeService {
  async criar({ nome, descricao, data_hora, limite_vagas, id_profissional }) {
    if (!nome || !descricao || !data_hora || !limite_vagas || !id_profissional) {
      throw new Error('Nome, descrição, data/hora, limite de vagas e ID do profissional são obrigatórios.');
    }

    const nomeLimpo = nome.trim();
    const descricaoLimpa = descricao.trim();

    if (!nomeLimpo || !descricaoLimpa) {
      throw new Error('Nome e descrição não podem estar vazios.');
    }

    if (isNaN(limite_vagas) || limite_vagas <= 0) {
      throw new Error('Limite de vagas deve ser um número maior que zero.');
    }

    const data = new Date(data_hora);
    if (isNaN(data.getTime())) {
      throw new Error('Data e hora inválidas.');
    }

    if (data < new Date()) {
      throw new Error('A data da atividade deve ser no futuro.');
    }

    const profissional = await Usuario.buscarPorEmail(id_profissional) ||
                         (await db.query('SELECT * FROM usuarios WHERE id = $1', [id_profissional])).rows[0];

    if (!profissional) {
      throw new Error('Profissional não encontrado.');
    }

    const atividade = await Atividade.create({
      nome: nomeLimpo,
      descricao: descricaoLimpa,
      data_hora,
      limite_vagas: parseInt(limite_vagas),
      id_profissional,
    });

    return atividade.toJSON();
  }

  async listar() {
    const atividades = await Atividade.listar();
    return atividades.map(a => ({
      ...a.toJSON(),
      vagas_disponiveis: a.limite_vagas - a.total_inscritos,
    }));
  }

  async buscarPorId(id) {
    if (!id || isNaN(id)) {
      throw new Error('ID inválido.');
    }

    const atividade = await Atividade.buscarPorId(id);
    if (!atividade) {
      throw new Error('Atividade não encontrada.');
    }

    return atividade.toJSON();
  }

  async listarPorProfissional(id_profissional) {
    if (!id_profissional || isNaN(id_profissional)) {
      throw new Error('ID do profissional inválido.');
    }

    const atividades = await Atividade.listarPorProfissional(id_profissional);
    return atividades.map(a => ({
      ...a.toJSON(),
      vagas_disponiveis: a.limite_vagas - a.total_inscritos,
    }));
  }
}

export default new AtividadeService();
