import pool from "../database/db.js";

class Usuario {
  // Método para criar um novo usuário no banco
  static async create({
    nome,
    email,
    senha,
    tipo_usuario,
    data_nasc,
    telefone,
  }) {
    const query = `
      INSERT INTO usuarios (nome, email, senha, tipo_usuario, data_nasc, telefone)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, nome, email, tipo_usuario, criado_at;
    `;
    const values = [nome, email, senha, tipo_usuario, data_nasc, telefone];

    try {
      const { rows } = await pool.query(query, values);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Método para buscar usuário por e-mail (importante para o Login/Red Team)
  static async findByEmail(email) {
    const query = "SELECT * FROM usuarios WHERE email = $1";
    const { rows } = await pool.query(query, [email]);
    return rows[0];
  }
}

export default Usuario;
