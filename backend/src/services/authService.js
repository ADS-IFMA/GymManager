const API_URL = 'http://localhost:3000/api';

export const loginAPI = async (email, senha) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, senha })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.erro || 'Erro ao fazer login');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const registerAlunoAPI = async (nome, email, senha) => {
  try {
    const response = await fetch(`${API_URL}/alunos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ nome, email, senha })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.erro || 'Erro ao cadastrar aluno');
    }

    return data;
  } catch (error) {
    throw error;
  }
};
