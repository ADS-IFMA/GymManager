const API_BASE = 'http://localhost:3000/api';

/**
 * Registra um novo check-in para um aluno.
 * @param {number} id_aluno - ID do aluno
 * @returns {Promise} Dados do check-in registrado
 */
export async function registrarCheckin(id_aluno) {
  const response = await fetch(`${API_BASE}/checkins`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id_aluno }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ erro: `Erro ${response.status}` }));
    throw new Error(error.erro || 'Erro ao registrar check-in.');
  }

  const data = await response.json();
  return data;
}

/**
 * Lista todos os check-ins de um aluno específico.
 * @param {number} id_aluno - ID do aluno
 * @returns {Promise} Array de check-ins do aluno
 */
export async function listarCheckinsAluno(id_aluno) {
  const response = await fetch(`${API_BASE}/checkins/aluno/${id_aluno}`);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ erro: `Erro ${response.status}` }));
    throw new Error(error.erro || 'Erro ao listar check-ins do aluno.');
  }

  const data = await response.json();
  return data;
}
