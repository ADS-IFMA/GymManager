const authService = require('../services/authService');

/**
 * Controller de Autenticação
 * Responsável apenas por receber a requisição e enviar a resposta.
 */
const login = async (req, res) => {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) {
      return res.status(400).json({ erro: 'E-mail e senha são obrigatórios.' });
    }
    
    const resultado = await authService.autenticar(email, senha);

    return res.status(200).json(resultado);

  } catch (error) {
    console.error('Erro no login:', error.message);
    return res.status(401).json({ erro: error.message });
  }
};

module.exports = { login };