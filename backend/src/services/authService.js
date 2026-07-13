import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';

class AuthService {
  async autenticar(email, senha) {
<<<<<<< HEAD
    const usuario = await Usuario.buscarPorEmail(email.trim());
=======
    // 1. Ajustado para o nome correto do método no Model (buscarPorEmail)
    // Usamos o trim() e o toLowerCase() para evitar erros se o usuário digitar espaços ou maiúsculas
    const usuario = await Usuario.buscarPorEmail(email.trim().toLowerCase());
>>>>>>> origin/develop

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

<<<<<<< HEAD
    const token = jwt.sign(
      { id: usuario.id, perfil: usuario.perfil },
      'gymmanager_secret_2026',
      { expiresIn: '8h' }
=======
    console.log(
      `[AuthService] Usuário autenticado com sucesso: ${usuario.nome}`,
    );

    const token = jwt.sign(
      { id: usuario.id, tipo_usuario: usuario.perfil },
      "gymmanager_secret_2026",
      { expiresIn: "8h" },
>>>>>>> origin/develop
    );

    return {
      token,
<<<<<<< HEAD
      usuario: usuario.toJSON()
=======
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo_usuario: usuario.perfil,
      },
>>>>>>> origin/develop
    };
  }
}

export default new AuthService();