import mensalidadesService from '../services/mensalidadesService.js';

export const registrarMensalidade = async (req, res) => {
  try {
    const mensalidadeCriada = await mensalidadesService.registrar(req.body);
    res.status(201).json(mensalidadeCriada);
  } catch (error) {
    console.error('Erro ao registrar mensalidade:', error.message);
    res.status(400).json({ erro: error.message });
  }
};

export const listarMensalidadesAluno = async (req, res) => {
  try {
    const { id } = req.params;
    const mensalidades = await mensalidadesService.listarPorAluno(id);
    res.json(mensalidades);
  } catch (error) {
    console.error('Erro ao listar mensalidades do aluno:', error.message);
    res.status(400).json({ erro: error.message });
  }
};

export const atualizarStatusMensalidade = async (req, res) => {
  try {
    const { id } = req.params;
    const mensalidadeAtualizada = await mensalidadesService.atualizarStatus(id, req.body);
    res.json(mensalidadeAtualizada);
  } catch (error) {
    console.error('Erro ao atualizar status da mensalidade:', error.message);
    res.status(400).json({ erro: error.message });
  }
};