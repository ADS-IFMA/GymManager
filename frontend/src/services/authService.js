const API_BASE_URL = 'http://localhost:3000/api';

const authService = {
  async login(email, senha) {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, senha })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.erro || 'Erro ao fazer login');
      }

      const data = await response.json();
      
      // Armazenar token no localStorage
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('usuario', JSON.stringify(data.usuario));
      }

      return data;
    } catch (error) {
      console.error('Erro no login:', error.message);
      throw error;
    }
  },

  logout() {
    // Remover token e dados do usuario do localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  },

  getToken() {
    return localStorage.getItem('token');
  },

  getUsuario() {
    const usuario = localStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario) : null;
  },

  isAuthenticated() {
    return !!this.getToken();
  }
};

export default authService;
