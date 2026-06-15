const API_BASE_URL = 'http://localhost:3000/api';

export const listarAtividades = async () => {
  const response = await fetch(`${API_BASE_URL}/atividades`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.erro || 'Erro ao listar atividades');
  }

  return await response.json();
};

export const buscarAtividade = async (id) => {
  const response = await fetch(`${API_BASE_URL}/atividades/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.erro || 'Erro ao buscar atividade');
  }

  return await response.json();
};

export const criarAtividade = async ({
  nome,
  descricao,
  data_hora,
  limite_vagas,
  id_profissional,
}) => {
  const response = await fetch(`${API_BASE_URL}/atividades`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      nome,
      descricao,
      data_hora,
      limite_vagas,
      id_profissional,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.erro || 'Erro ao criar atividade');
  }

  return await response.json();
};

export const inscreverAtividade = async (id_atividade, id_aluno) => {
  const response = await fetch(
    `${API_BASE_URL}/atividades/${id_atividade}/inscricoes`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id_aluno }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.erro || 'Erro ao inscrever na atividade');
  }

  return await response.json();
};

export const cancelarInscricao = async (id_atividade, id_aluno) => {
  const response = await fetch(
    `${API_BASE_URL}/atividades/${id_atividade}/inscricoes/${id_aluno}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.erro || 'Erro ao cancelar inscrição');
  }

  return await response.json();
};

export const listarInscritos = async (id_atividade) => {
  const response = await fetch(
    `${API_BASE_URL}/atividades/${id_atividade}/inscricoes`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.erro || 'Erro ao listar inscritos');
  }

  return await response.json();
};
