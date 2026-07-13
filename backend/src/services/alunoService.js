import bcrypt from 'bcryptjs';
import db from '../database/db.js';
import Usuario from '../models/Usuario.js';

class AlunoService {
  async cadastrar({ nome, email, senha }) {
    if (!nome || !email || !senha) {
      throw new Error('Nome, email e senha são obrigatórios para o cadastro.');
    }

    const nomeLimpo = nome.trim();
    const emailLimpo = email.trim().toLowerCase();

    if (!nomeLimpo || !emailLimpo || !senha) {
      throw new Error('Por favor, preencha todos os campos corretamente.');
    }

    const usuarioExistente = await Usuario.buscarPorEmail(emailLimpo);
    if (usuarioExistente) {
      throw new Error('Já existe um aluno cadastrado com este e-mail.');
    }

    const senhaHash = await bcrypt.hash(senha, 10);
    const client = await db.connect();

    try {
      await client.query('BEGIN');

      const queryInserirUsuario = `
        INSERT INTO usuarios (nome, email, senha, perfil, ativo)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;

      const resultadoUsuario = await client.query(queryInserirUsuario, [
        nomeLimpo,
        emailLimpo,
        senhaHash,
        'ALUNO',
        true,
      ]);

      const usuarioCriado = new Usuario(resultadoUsuario.rows[0]);

      const queryInserirAluno = `
        INSERT INTO alunos (id_usuario)
        VALUES ($1)
      `;
      await client.query(queryInserirAluno, [usuarioCriado.id]);

      await client.query('COMMIT');
      return usuarioCriado.toJSON();
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}

export default new AlunoService();
