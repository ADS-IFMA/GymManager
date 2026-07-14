const API_BASE = 'http://localhost:3000/api';

export async function loginAPI({ email, senha }) {
  const response = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, senha }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.erro || 'Erro ao fazer login.');
  }

  return data;
}

export function armazenarAuthData(token, usuario) {
  localStorage.setItem('token', token);
  localStorage.setItem('usuario', JSON.stringify(usuario));
}

export function limparAuthData() {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
}
