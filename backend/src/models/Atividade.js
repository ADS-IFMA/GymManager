import pool from '../database/db.js';

class Atividade {
  static async criarAtividade({ nome, descricao, duracao_minutos, profissional_id }) {
    const query = `
      INSERT INTO atividades (nome, descricao, duracao_minutos, profissional_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [nome, descricao, duracao_minutos, profissional_id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async listarAtividades() {
    const query = 'SELECT * FROM atividades ORDER BY id DESC;';
    const { rows } = await pool.query(query);
    return rows;
  }

  static async criarAgendamento({ atividade_id, aluno_id, data_hora, status = 'CONFIRMADO' }) {
    const query = `
      INSERT INTO agendamentos (atividade_id, aluno_id, data_hora, status)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [atividade_id, aluno_id, data_hora, status];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async listarAgendamentosDoAluno(aluno_id) {
    const query = `
      SELECT ag.id, ag.data_hora, ag.status, at.nome AS atividade_nome, at.duracao_minutos
      FROM agendamentos ag
      JOIN atividades at ON ag.atividade_id = at.id
      WHERE ag.aluno_id = $1
      ORDER BY ag.data_hora ASC;
    `;
    const { rows } = await pool.query(query, [aluno_id]);
    return rows;
  }
}

export default Atividade;