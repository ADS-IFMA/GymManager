const API_BASE = 'http://localhost:3000/api';

export async function cadastrarAluno({ nome, email, senha }) {
  const response = await fetch(`${API_BASE}/alunos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ nome, email, senha }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.erro || 'Erro ao cadastrar aluno.');
  }

  return data;
}

/**
 * Lista todos os alunos cadastrados no sistema.
 */
export async function listarAlunos() {
  const response = await fetch(`${API_BASE}/alunos`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.erro || 'Erro ao listar alunos.');
  }

  return data;
}
