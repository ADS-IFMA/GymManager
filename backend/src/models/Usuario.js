import db from '../database/db.js'; 

class Usuario {
  constructor({ id, nome, email, senha, perfil, ativo, criado_at }) {
    this.id = id;
    this.nome = nome;
    this.email = email;
    this.senha = senha; 
    this.perfil = perfil; 
    this.ativo = ativo !== undefined ? ativo : true;
    this.criado_at = criado_at;
  }

  static async buscarPorEmail(email) {
    const query = 'SELECT * FROM usuarios WHERE email = $1';
    const resultado = await db.query(query, [email]);
    if (resultado.rows.length > 0) {
      return new Usuario(resultado.rows[0]);
    }
    return null;
  }

  toJSON() {
    return {
      id: this.id,
      nome: this.nome,
      email: this.email,
      perfil: this.perfil,
      ativo: this.ativo,
    };
  }
}

export default Usuario; 