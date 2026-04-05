import bcrypt from 'bcryptjs';
import db from '../database/db.js';
import Usuario from '../models/Usuario.js';

class ProfissionalService {
  async cadastrar({ nome, email, senha, registro_profissional, especialidade }) {
    if (!nome || !email || !senha || !registro_profissional) {
      throw new Error('Nome, email, senha e registro profissional são obrigatórios.');
    }

    const nomeLimpo = nome.trim();
    const emailLimpo = email.trim().toLowerCase();
    const registroLimpo = registro_profissional.trim();

    const usuarioExistente = await Usuario.buscarPorEmail(emailLimpo);
    if (usuarioExistente) {
      throw new Error('Já existe um usuário cadastrado com este e-mail.');
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
        'PROFISSIONAL',
        true,
      ]);

      const usuarioCriado = new Usuario(resultadoUsuario.rows[0]);

      const queryInserirTreinador = `
        INSERT INTO treinadores (id_usuario, registro_profissional, especialidade)
        VALUES ($1, $2, $3)
        RETURNING registro_profissional, especialidade
      `;
      const resultadoTreinador = await client.query(queryInserirTreinador, [
        usuarioCriado.id,
        registroLimpo,
        especialidade || null
      ]);

      await client.query('COMMIT');

      return {
        ...usuarioCriado.toJSON(),
        registro_profissional: resultadoTreinador.rows[0].registro_profissional,
        especialidade: resultadoTreinador.rows[0].especialidade
      };

    } catch (error) {
      await client.query('ROLLBACK');
      
      if (error.code === '23505') {
        throw new Error('Este Registro Profissional (CREF) já está cadastrado no sistema.');
      }
      throw error;
    } finally {
      client.release();
    }
  }
}

export default new ProfissionalService();