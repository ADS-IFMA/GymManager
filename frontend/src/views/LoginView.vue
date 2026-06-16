<template>
  <div class="login-container">
    <div class="login-card">
      <h1>GymManager</h1>
      <p class="subtitle">Login</p>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">E-mail:</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="seu@email.com"
            required
          />
        </div>

        <div class="form-group">
          <label for="senha">Senha:</label>
          <input
            id="senha"
            v-model="senha"
            type="password"
            placeholder="••••••••"
            required
          />
        </div>

        <button type="submit" class="btn-login" :disabled="loading">
          {{ loading ? 'Autenticando...' : 'Entrar' }}
        </button>
      </form>

      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>

      <div v-if="successMessage" class="success-message">
        {{ successMessage }}
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import authService from '../services/authService.js';

export default defineComponent({
  name: 'LoginView',
  data() {
    return {
      email: '',
      senha: '',
      loading: false,
      errorMessage: '',
      successMessage: ''
    };
  },
  methods: {
    async handleLogin() {
      this.errorMessage = '';
      this.successMessage = '';

      if (!this.email || !this.senha) {
        this.errorMessage = 'Por favor, preencha todos os campos';
        return;
      }

      this.loading = true;

      try {
        const response = await authService.login(this.email, this.senha);
        this.successMessage = 'Login realizado com sucesso!';
        
        // Redirecionar para dashboard após 1 segundo
        setTimeout(() => {
          this.$router.push('/dashboard');
        }, 1000);
      } catch (error) {
        this.errorMessage = error.message || 'Erro ao fazer login. Verifique suas credenciais.';
        console.error('Erro no login:', error);
      } finally {
        this.loading = false;
      }
    }
  },
  mounted() {
    // Se já está autenticado, redirecionar para dashboard
    if (authService.isAuthenticated()) {
      this.$router.push('/dashboard');
    }
  }
});
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.login-card {
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
}

h1 {
  color: #667eea;
  text-align: center;
  margin: 0 0 10px;
  font-size: 28px;
}

.subtitle {
  text-align: center;
  color: #666;
  margin: 0 0 30px;
  font-size: 14px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
  font-size: 14px;
}

input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  box-sizing: border-box;
  transition: border-color 0.3s;
}

input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.btn-login {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.3s;
  margin-top: 10px;
}

.btn-login:hover:not(:disabled) {
  opacity: 0.9;
}

.btn-login:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  color: #d32f2f;
  background-color: #ffebee;
  padding: 12px;
  border-radius: 5px;
  margin-top: 20px;
  font-size: 14px;
  border-left: 4px solid #d32f2f;
}

.success-message {
  color: #388e3c;
  background-color: #e8f5e9;
  padding: 12px;
  border-radius: 5px;
  margin-top: 20px;
  font-size: 14px;
  border-left: 4px solid #388e3c;
}
</style>
