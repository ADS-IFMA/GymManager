const API_BASE = 'http://localhost:3000/api';

export async function listarAlunos() {
  const response = await fetch(`${API_BASE}/alunos`);
  const text = await response.text();

  let data = [];
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error('Resposta inválida da API de alunos.');
    }
  }

  if (!response.ok) {
    throw new Error(data.erro || 'Erro ao listar alunos.');
  }

  return data;
}

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
