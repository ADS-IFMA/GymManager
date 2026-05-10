import profissionalService from '../services/profissionalService.js';

export const cadastrarProfissional = async (req, res) => {
  try {
    const profissionalCriado = await profissionalService.cadastrar(req.body);
    res.status(201).json(profissionalCriado);
  } catch (error) {
    console.error('Erro ao cadastrar profissional:', error.message);
    res.status(400).json({ erro: error.message });
  }
};