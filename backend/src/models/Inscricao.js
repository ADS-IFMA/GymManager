import pool from "../database/db.js";

class Inscricao {
  constructor({
    id,
    id_aluno,
    id_atividade,
    data_inscricao,
  } = {}) {
    this.id = id;
    this.id_aluno = id_aluno;
    this.id_atividade = id_atividade;
    this.data_inscricao = data_inscricao;
  }

  toJSON() {
    return {
      id: this.id,
      id_aluno: this.id_aluno,
      id_atividade: this.id_atividade,
      data_inscricao: this.data_inscricao,
    };
  }

  static async create(id_aluno, id_atividade) {
    const query = `
      INSERT INTO inscricoes (id_aluno, id_atividade)
      VALUES ($1, $2)
      RETURNING *;
    `;

    try {
      const { rows } = await pool.query(query, [id_aluno, id_atividade]);
      return new Inscricao(rows[0]);
    } catch (error) {
      throw error;
    }
  }

  static async buscarPorAtividade(id_atividade) {
    const query = `
      SELECT i.*, u.nome, u.email
      FROM inscricoes i
      JOIN usuarios u ON i.id_aluno = u.id
      WHERE i.id_atividade = $1
      ORDER BY i.data_inscricao ASC;
    `;
    const { rows } = await pool.query(query, [id_atividade]);
    return rows.map(row => ({
      ...new Inscricao(row),
      aluno_nome: row.nome,
      aluno_email: row.email,
    }));
  }

  static async buscarPorAluno(id_aluno) {
    const query = `
      SELECT i.*, a.nome, a.data_hora, a.limite_vagas
      FROM inscricoes i
      JOIN atividades a ON i.id_atividade = a.id
      WHERE i.id_aluno = $1
      ORDER BY a.data_hora ASC;
    `;
    const { rows } = await pool.query(query, [id_aluno]);
    return rows;
  }

  static async verificarInscricao(id_aluno, id_atividade) {
    const query = `
      SELECT * FROM inscricoes
      WHERE id_aluno = $1 AND id_atividade = $2;
    `;
    const { rows } = await pool.query(query, [id_aluno, id_atividade]);
    return rows.length > 0;
  }

  static async contagemInscritos(id_atividade) {
    const query = `
      SELECT COUNT(*) as total FROM inscricoes
      WHERE id_atividade = $1;
    `;
    const { rows } = await pool.query(query, [id_atividade]);
    return parseInt(rows[0].total);
  }

  static async cancelar(id_aluno, id_atividade) {
    const query = `
      DELETE FROM inscricoes
      WHERE id_aluno = $1 AND id_atividade = $2
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [id_aluno, id_atividade]);
    return rows.length > 0;
  }
}

export default Inscricao;
