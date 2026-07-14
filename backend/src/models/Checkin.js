import pool from "../database/db.js";

class Checkin {
  constructor({
    id,
    id_aluno,
    data_horat,
    criado_em,
    data_hora,
  } = {}) {
    this.id = id;
    this.id_aluno = id_aluno;
    this.data_hora = data_hora || data_horat;
    this.criado_em = criado_em;
  }

  // Método para registrar um novo check-in no banco
  static async create({ id_aluno }) {
    const query = `
      INSERT INTO checkins (id_aluno, data_horat, status)
      VALUES ($1, CURRENT_TIMESTAMP, $2)
      RETURNING id, id_aluno, data_horat, status;
    `;
    const values = [id_aluno, 'PRESENTE'];

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
      SELECT id, id_aluno, data_horat, status
      FROM checkins
      WHERE id_aluno = $1
      ORDER BY data_horat DESC;
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
