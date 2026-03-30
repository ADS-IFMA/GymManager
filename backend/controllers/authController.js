const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const usersMock = require('../services/mockUsers');

const JWT_SECRET = 'gymmanager_super_secreto_2026'; 

const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ erro: 'E-mail e senha são obrigatórios.' });
    }

    const user = usersMock.find(u => u.email === email);
    
    if (!user) {
      return res.status(401).json({ erro: 'Credenciais inválidas.' });
    }

    const senhaValida = await bcrypt.compare(senha, user.senhaHash);
    
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