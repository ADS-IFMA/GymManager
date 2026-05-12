import pool from '../database/db.js';
import Mensalidade from '../models/Mensalidade.js';

class MensalidadesService {
  async registrar({ aluno_id, valor, data_vencimento }) {
    if (!aluno_id || !valor || !data_vencimento) {
      throw new Error('Os campos aluno_id, valor e data_vencimento são obrigatórios.');
    }

    if (isNaN(valor) || Number(valor) <= 0) {
      throw new Error('O valor da mensalidade deve ser um número maior que zero.');
    }

    const queryBuscarUsuario = "SELECT id, perfil FROM usuarios WHERE id = $1";
    const { rows } = await pool.query(queryBuscarUsuario, [aluno_id]);
    
    if (!rows[0]) {
      throw new Error('Aluno não encontrado no sistema com o ID informado.');
    }

    const statusInicial = 'PENDENTE';

    const novaMensalidade = await Mensalidade.create({
      aluno_id,
      valor,
      data_vencimento,
      status: statusInicial
    });

    return novaMensalidade;
  }

  async listarPorAluno(aluno_id) {
    if (!aluno_id) {
      throw new Error('O ID do aluno é obrigatório para realizar a busca.');
    }

    const mensalidades = await Mensalidade.buscarPorAluno(aluno_id);
    return mensalidades;
  }

  async atualizarStatus(id, { status }) {
    if (!status) {
      throw new Error('O campo status é obrigatório para a atualização.');
    }

    const statusLimpo = status.trim().toUpperCase();
    const statusValidos = ['PAGO', 'PENDENTE', 'VENCIDO'];

    if (!statusValidos.includes(statusLimpo)) {
      throw new Error("Status inválido. Utilize apenas 'PAGO', 'PENDENTE' ou 'VENCIDO'.");
    }

    const mensalidadeExistente = await Mensalidade.buscarPorId(id);
    if (!mensalidadeExistente) {
      throw new Error('Mensalidade não encontrada.');
    }

    let dataPagamento = null;
    if (statusLimpo === 'PAGO') {
      const hoje = new Date();
      dataPagamento = hoje.toISOString().split('T')[0]; 
    }

    const mensalidadeAtualizada = await Mensalidade.atualizarStatus(
      id,
      statusLimpo,
      dataPagamento
    );

    return mensalidadeAtualizada;
  }
}

export default new MensalidadesService();