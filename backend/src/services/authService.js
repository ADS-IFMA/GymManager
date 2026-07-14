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

    const senhaArmazenada = usuario.senha || '';
    const senhaInformada = senha || '';

    let senhaValida = false;

    if (senhaArmazenada.startsWith('$2')) {
      senhaValida = await bcrypt.compare(senhaInformada, senhaArmazenada);
    } else {
      senhaValida = senhaInformada === senhaArmazenada;

      if (senhaValida) {
        const senhaHash = await bcrypt.hash(senhaInformada, 10);
        await Usuario.atualizarSenha(usuario.id, senhaHash);
      }
    }

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