import pool from "../database/db.js";

class Mensalidade {
  constructor({
    id,
    aluno_id,
    valor,
    data_vencimento,
    data_pagamento,
    status,
  }) {
    this.id = id;
    this.aluno_id = aluno_id;
    this.valor = valor;
    this.data_vencimento = data_vencimento;
    this.data_pagamento = data_pagamento;
    this.status = status;
  }

  static async create({ aluno_id, valor, data_vencimento, status }) {
    const query = `
      INSERT INTO mensalidades (aluno_id, valor, data_vencimento, status)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [aluno_id, valor, data_vencimento, status];

    const { rows } = await pool.query(query, values);
    return new Mensalidade(rows[0]);
  }

  static async buscarPorAluno(aluno_id) {
    const query = `
      SELECT m.*, u.nome as nome_aluno 
      FROM mensalidades m
      JOIN usuarios u ON m.aluno_id = u.id
      WHERE m.aluno_id = $1
      ORDER BY m.data_vencimento DESC;
    `;
    const { rows } = await pool.query(query, [aluno_id]);
    return rows;
  }

  static async buscarPorId(id) {
    const query = "SELECT * FROM mensalidades WHERE id = $1";
    const { rows } = await pool.query(query, [id]);
    if (!rows[0]) return null;
    return new Mensalidade(rows[0]);
  }

  static async atualizarStatus(id, status, data_pagamento) {
    const query = `
      UPDATE mensalidades
      SET status = $1, data_pagamento = $2
      WHERE id = $3
      RETURNING *;
    `;
    const values = [status, data_pagamento, id];

    const { rows } = await pool.query(query, values);
    return new Mensalidade(rows[0]);
  }
}

export default Mensalidade;