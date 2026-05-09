import pool from "../database/db.js";

class Usuario {
  constructor({
    id,
    nome,
    email,
    senha,
    perfil,
    ativo,
    tipo_usuario,
    data_nasc,
    telefone,
    criado_at,
    atualizado_at,
  } = {}) {
    this.id = id;
    this.nome = nome;
    this.email = email;
    this.senha = senha;
    this.perfil = perfil;
    this.ativo = ativo;
    this.tipo_usuario = tipo_usuario;
    this.data_nasc = data_nasc;
    this.telefone = telefone;
    this.criado_at = criado_at;
    this.atualizado_at = atualizado_at;
  }

  toJSON() {
    const { senha, ...usuarioSemSenha } = this;
    return usuarioSemSenha;
  }

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
      return new Usuario(rows[0]);
    } catch (error) {
      throw error;
    }
  }

  // Método para buscar usuário por e-mail (importante para o Login/Red Team)
  static async buscarPorEmail(email) {
    const query = "SELECT * FROM usuarios WHERE email = $1";
    const { rows } = await pool.query(query, [email]);
    if (!rows[0]) return null;
    return new Usuario(rows[0]);
  }
}

export default Usuario;
