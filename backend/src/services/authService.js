const db = require('../database/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthService {
  async autenticar(email, senha) {
    // 1. Busca o usuário pelo e-mail
    const query = 'SELECT * FROM usuarios WHERE email = $1';
    const resultado = await db.query(query, [email.trim()]);
    const usuario = resultado.rows[0];

    if (!usuario) {
      throw new Error('Credenciais inválidas.');
    }

    // 3. Validação: Usuário está ativo
    if (!usuario.ativo) {
      throw new Error('Usuário desativado. Procure o administrador.');
    }

    // 4. Comparação da senha criptografada
    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      throw new Error('Credenciais inválidas.');
    }

    const token = jwt.sign(
      { id: usuario.id, perfil: usuario.perfil },
      'gymmanager_secret_2026', // mover isso para um arquivo .env em  breve
      { expiresIn: '8h' }
    );

    return {
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil
      }
    };
  }
}

module.exports = new AuthService();