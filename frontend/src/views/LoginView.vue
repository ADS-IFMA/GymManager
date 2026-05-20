<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { loginAPI, armazenarAuthData } from "../services/authService.js";

const router = useRouter();

const email = ref("");
const senha = ref("");
const carregando = ref(false);
const erro = ref("");

const handleLogin = async () => {
  erro.value = "";
  carregando.value = true;

  try {
    // Chamar a API de login
    const response = await loginAPI({
      email: email.value,
      senha: senha.value,
    });

    // Armazenar o token no localStorage usando a mesma chave que o guard de rota espera
    armazenarAuthData(response.token, response.usuario);

    // Redirecionar para o dashboard
    router.push("/dashboard");
  } catch (err) {
    erro.value =
      err.message || "Erro ao fazer login. Verifique suas credenciais.";
  } finally {
    carregando.value = false;
  }
};

const handleKeyPress = (e) => {
  if (e.key === "Enter") {
    handleLogin();
  }
};
</script>

<template>
  <main class="login-container">
    <section class="login-card">
      <h1>GymManager</h1>
      <p>Sistema de Gestão de Academia</p>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">E-mail</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="seu@email.com"
            required
            @keypress="handleKeyPress"
          />
        </div>

        <div class="form-group">
          <label for="senha">Senha</label>
          <input
            id="senha"
            v-model="senha"
            type="password"
            placeholder="Digite sua senha"
            required
            @keypress="handleKeyPress"
          />
        </div>

        <p v-if="erro" class="error-message">{{ erro }}</p>

        <button type="submit" :disabled="carregando" class="btn-login">
          {{ carregando ? "Entrando..." : "Entrar" }}
        </button>
      </form>
    </section>
  </main>
</template>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0c4a6e 0%, #1e3a8a 100%);
  padding: 16px;
}

.login-card {
  width: 100%;
  max-width: 400px;
  background: rgba(15, 23, 42, 0.95);
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.45);
  padding: 40px 32px;
  text-align: center;
  color: #f8fafc;
}

h1 {
  margin-bottom: 8px;
  font-size: 2.5rem;
  font-weight: 700;
  color: #60a5fa;
}

p {
  margin-bottom: 32px;
  font-size: 0.95rem;
  color: #cbd5e1;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

label {
  margin-bottom: 8px;
  font-size: 0.95rem;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid rgba(148, 163, 184, 0.35);
  border-radius: 12px;
  background: #0f172a;
  color: #f8fafc;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

input:focus {
  outline: none;
  border-color: #60a5fa;
  box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.1);
}

input::placeholder {
  color: #64748b;
}

.btn-login {
  padding: 12px 16px;
  margin-top: 8px;
  border: none;
  border-radius: 12px;
  background: #3b82f6;
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;
}

.btn-login:hover:not(:disabled) {
  background: #2563eb;
}

.btn-login:disabled {
  background: #6b7280;
  cursor: not-allowed;
  opacity: 0.7;
}

.error-message {
  color: #ef4444;
  font-size: 0.9rem;
  text-align: center;
  margin-top: -8px;
}
</style>
