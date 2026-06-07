import pool from "../database/db.js";

class Atividade {
  constructor({
    id,
    nome,
    descricao,
    data_hora,
    limite_vagas,
    id_profissional,
    criado_em,
  } = {}) {
    this.id = id;
    this.nome = nome;
    this.descricao = descricao;
    this.data_hora = data_hora;
    this.limite_vagas = limite_vagas;
    this.id_profissional = id_profissional;
    this.criado_em = criado_em;
  }

  toJSON() {
    return {
      id: this.id,
      nome: this.nome,
      descricao: this.descricao,
      data_hora: this.data_hora,
      limite_vagas: this.limite_vagas,
      id_profissional: this.id_profissional,
      criado_em: this.criado_em,
    };
  }

  static async create({
    nome,
    descricao,
    data_hora,
    limite_vagas,
    id_profissional,
  }) {
    const query = `
      INSERT INTO atividades (nome, descricao, data_hora, limite_vagas, id_profissional)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [nome, descricao, data_hora, limite_vagas, id_profissional];

    try {
      const { rows } = await pool.query(query, values);
      return new Atividade(rows[0]);
    } catch (error) {
      throw error;
    }
  }

  static async buscarPorId(id) {
    const query = "SELECT * FROM atividades WHERE id = $1";
    const { rows } = await pool.query(query, [id]);
    if (!rows[0]) return null;
    return new Atividade(rows[0]);
  }

  static async listar() {
    const query = `
      SELECT a.*,
        COUNT(i.id) as total_inscritos
      FROM atividades a
      LEFT JOIN inscricoes i ON a.id = i.id_atividade
      GROUP BY a.id
      ORDER BY a.data_hora ASC;
    `;
    const { rows } = await pool.query(query);
    return rows.map(row => {
      const atividade = new Atividade(row);
      atividade.total_inscritos = parseInt(row.total_inscritos);
      return atividade;
    });
  }

  static async listarPorProfissional(id_profissional) {
    const query = `
      SELECT a.*,
        COUNT(i.id) as total_inscritos
      FROM atividades a
      LEFT JOIN inscricoes i ON a.id = i.id_atividade
      WHERE a.id_profissional = $1
      GROUP BY a.id
      ORDER BY a.data_hora ASC;
    `;
    const { rows } = await pool.query(query, [id_profissional]);
    return rows.map(row => {
      const atividade = new Atividade(row);
      atividade.total_inscritos = parseInt(row.total_inscritos);
      return atividade;
    });
  }
}

export default Atividade;
