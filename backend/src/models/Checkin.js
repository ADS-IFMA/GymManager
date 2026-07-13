import pool from "../database/db.js";

class Checkin {
  constructor({
    id,
    id_aluno,
    data_hora,
    criado_em,
  } = {}) {
    this.id = id;
    this.id_aluno = id_aluno;
    this.data_hora = data_hora;
    this.criado_em = criado_em;
  }

  // Método para registrar um novo check-in no banco
  static async create({ id_aluno }) {
    const query = `
      INSERT INTO checkins (id_aluno, data_hora, criado_em)
      VALUES ($1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING id, id_aluno, data_hora, criado_em;
    `;
    const values = [id_aluno];

    try {
      const { rows } = await pool.query(query, values);
      return new Checkin(rows[0]);
    } catch (error) {
      throw new Error(`Erro ao registrar check-in: ${error.message}`);
    }
  }

  // Método para listar todos os check-ins de um aluno
  static async buscarPorAluno(id_aluno) {
    const query = `
      SELECT id, id_aluno, data_hora, criado_em
      FROM checkins
      WHERE id_aluno = $1
      ORDER BY data_hora DESC;
    `;
    const values = [id_aluno];

    try {
      const { rows } = await pool.query(query, values);
      return rows.map(row => new Checkin(row));
    } catch (error) {
      throw new Error(`Erro ao buscar check-ins do aluno: ${error.message}`);
    }
  }
}

export default Checkin;
