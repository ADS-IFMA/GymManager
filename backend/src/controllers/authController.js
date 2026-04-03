const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../database/db');
const Usuario = require('../models/usuario.js');

const JWT_SECRET = 'gymmanager_super_secreto_2026'; 

const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ erro: 'E-mail e senha são obrigatórios.' });
    }

    const query = 'SELECT id, nome, email, senha, perfil, ativo FROM usuarios WHERE email = $1';
    const result = await pool.query(query, [email]);

    if (result.rowCount === 0) {
      return res.status(401).json({ erro: 'Credenciais inválidas.' });
    }

    const userData = result.rows[0];

    if (!userData.ativo) {
      return res.status(401).json({ erro: 'Usuário inativo.' });
    }

    const user = new Usuario({
      id: userData.id,
      nome: userData.nome,
      email: userData.email,
      senha: userData.senha,
      perfil: userData.perfil,
      ativo: userData.ativo,
    });

    const senhaValida = await bcrypt.compare(senha, user.senha);

    if (!senhaValida) {
      return res.status(401).json({ erro: 'Credenciais inválidas.' });
    }

    const token = jwt.sign(
      { 
        id: user.id, 
        perfil: user.perfil 
      }, 
      JWT_SECRET, 
      { expiresIn: '8h' } 
    );

    return res.status(200).json({
      mensagem: 'Login realizado com sucesso',
      token: token,
      usuario: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        perfil: user.perfil
      }
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ erro: 'Erro interno no servidor.' });
  }
};

module.exports = { login };