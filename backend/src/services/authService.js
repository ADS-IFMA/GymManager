import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';

class AuthService {
  async autenticar(email, senha) {
    const usuario = await Usuario.buscarPorEmail(email.trim());

    if (!usuario) {
      throw new Error('Credenciais inválidas.');
    }

    if (!usuario.ativo) {
      throw new Error('Usuário desativado. Procure o administrador.');
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      throw new Error('Credenciais inválidas.');
    }

    const token = jwt.sign(
      { id: usuario.id, perfil: usuario.perfil },
      'gymmanager_secret_2026',
      { expiresIn: '8h' }
    );
    return {
      token,
      usuario: usuario.toJSON()
    };
  }
}

export default new AuthService(); 