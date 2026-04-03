const bcrypt = require('bcrypt');
const pool = require('../database/db');

const registerAluno = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ erro: 'Nome, e-mail e senha são obrigatórios.' });
    }

    const existResult = await pool.query('SELECT id FROM usuarios WHERE email = $1', [email]);
    if (existResult.rowCount > 0) {
      return res.status(409).json({ erro: 'E-mail já cadastrado.' });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    await pool.query('BEGIN');

    const insertUsuario = await pool.query(
      'INSERT INTO usuarios (nome, email, senha, perfil, ativo) VALUES ($1, $2, $3, $4, $5) RETURNING id, nome, email, perfil, ativo',
      [nome, email, senhaHash, 'ALUNO', true]
    );

    const novoUsuario = insertUsuario.rows[0];

    await pool.query(
      'INSERT INTO alunos (id_usuario, status_matricula) VALUES ($1, $2)',
      [novoUsuario.id, true]
    );

    await pool.query('COMMIT');

    return res.status(201).json({
      mensagem: 'Aluno cadastrado com sucesso.',
      aluno: {
        id: novoUsuario.id,
        nome: novoUsuario.nome,
        email: novoUsuario.email,
        perfil: novoUsuario.perfil,
        ativo: novoUsuario.ativo,
        status_matricula: true,
      },
    });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Erro ao cadastrar aluno:', error);
    return res.status(500).json({ erro: 'Erro interno no servidor.' });
  }
};

module.exports = { registerAluno };
