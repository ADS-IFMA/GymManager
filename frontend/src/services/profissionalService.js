const API_URL = 'http://localhost:3000/api';

export const cadastrarProfissionalAPI = async (dadosProfissional) => {
  try {
    const response = await fetch(`${API_URL}/profissionais`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dadosProfissional)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.erro || 'Erro ao cadastrar profissional.');
    }

    return data;
  } catch (error) {
    throw error;
  }
};