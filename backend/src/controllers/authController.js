import authService from '../services/authService.js';

export const login = async (req, res) => {
  try {
    const { email, senha } = req.body;
    const resultado = await authService.autenticar(email, senha);
    res.json(resultado);
  } catch (error) {
    console.error("Erro no login:", error.message);
    res.status(401).json({ erro: error.message });
  }
};