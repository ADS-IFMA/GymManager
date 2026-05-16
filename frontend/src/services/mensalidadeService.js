const API_BASE = 'http://localhost:3000/api';

/**
 * Registra uma nova mensalidade no backend.
 * @param {Object} dados - { aluno_id, valor, data_vencimento }
 */
export async function registrarMensalidade(dados) {
  const response = await fetch(`${API_BASE}/mensalidades`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dados),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.erro || 'Erro ao registrar mensalidade.');
  }

  return data;
}

/**
 * Busca todas as mensalidades de um aluno específico.
 * @param {number|string} alunoId 
 */
export async function getMensalidadesPorAluno(alunoId) {
  const response = await fetch(`${API_BASE}/mensalidades/aluno/${alunoId}`);
  
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.erro || 'Erro ao buscar mensalidades do aluno.');
  }

  return data;
}

/**
 * Atualiza o status de uma mensalidade (ex: para 'PAGO').
 * @param {number|string} id - ID da mensalidade
 * @param {string} status - Novo status ('PAGO', 'PENDENTE', 'VENCIDO')
 */
export async function atualizarStatusMensalidade(id, status) {
  const response = await fetch(`${API_BASE}/mensalidades/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.erro || 'Erro ao atualizar status da mensalidade.');
  }

  return data;
}
