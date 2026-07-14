const API_BASE = 'http://localhost:3000/api';

export async function listarMensalidades() {
  const response = await fetch(`${API_BASE}/mensalidades`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.erro || 'Erro ao listar mensalidades.');
  }

  return data;
}

export async function getMensalidadesPorAluno(alunoId) {
  const response = await fetch(`${API_BASE}/mensalidades/aluno/${alunoId}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.erro || 'Erro ao carregar mensalidades do aluno.');
  }

  return data;
}

export async function atualizarStatusMensalidade(id, status) {
  const response = await fetch(`${API_BASE}/mensalidades/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.erro || 'Erro ao atualizar mensalidade.');
  }

  return data;
}
