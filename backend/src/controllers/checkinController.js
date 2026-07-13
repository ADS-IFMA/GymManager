import checkinService from '../services/checkinService.js';

export const registrarCheckin = async (req, res) => {
  try {
    const { id_aluno } = req.body;
    const checkin = await checkinService.registrarCheckin(id_aluno);
    res.status(201).json(checkin);
  } catch (error) {
    console.error('Erro ao registrar check-in:', error.message);
    res.status(400).json({ erro: error.message });
  }
};

export const listarCheckinsPorAluno = async (req, res) => {
  try {
    const { id } = req.params;
    const checkins = await checkinService.listarCheckinsPorAluno(id);
    res.json(checkins);
  } catch (error) {
    console.error('Erro ao listar check-ins do aluno:', error.message);
    res.status(400).json({ erro: error.message });
  }
};
