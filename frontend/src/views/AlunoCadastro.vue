<script setup>
import { ref } from 'vue';
import { cadastrarAluno } from '../services/alunoService.js';

const nome = ref('');
const email = ref('');
const senha = ref('');
const mensagem = ref('');
const erro = ref('');
const carregando = ref(false);

const limparFormulario = () => {
  nome.value = '';
  email.value = '';
  senha.value = '';
};

const handleSubmit = async () => {
  erro.value = '';
  mensagem.value = '';
  carregando.value = true;

  try {
    const aluno = await cadastrarAluno({
      nome: nome.value,
      email: email.value,
      senha: senha.value,
    });

    mensagem.value = `Aluno ${aluno.nome} cadastrado com sucesso!`;
    limparFormulario();
  } catch (err) {
    erro.value = err.message;
  } finally {
    carregando.value = false;
  }
};
</script>

<template>
  <main class="app-container">
    <section class="card">
      <h1>Cadastro de Aluno</h1>
      <p>Registre um novo cliente para o sistema GymManager.</p>

      <label>
        Nome completo
        <input type="text" v-model="nome" placeholder="Digite o nome do aluno" />
      </label>

      <label>
        E-mail
        <input type="email" v-model="email" placeholder="Digite o e-mail do aluno" />
      </label>

      <label>
        Senha
        <input type="password" v-model="senha" placeholder="Digite uma senha segura" />
      </label>

      <button :disabled="carregando" @click="handleSubmit">
        {{ carregando ? 'Cadastrando...' : 'Cadastrar aluno' }}
      </button>

      <p class="success-message" v-if="mensagem">{{ mensagem }}</p>
      <p class="error-message" v-if="erro">{{ erro }}</p>
    </section>
  </main>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0c4a6e 0%, #1e3a8a 100%);
  color: #f8fafc;
  padding: 32px;
}

.card {
  width: 100%;
  max-width: 420px;
  background: rgba(15, 23, 42, 0.95);
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.45);
  padding: 32px;
}

h1 {
  margin-bottom: 12px;
  font-size: 2rem;
}

p {
  margin-bottom: 24px;
  line-height: 1.5;
}

label {
  display: block;
  margin-bottom: 18px;
  font-size: 0.95rem;
}

input {
  width: 100%;
  margin-top: 8px;
  padding: 12px 14px;
  border: 1px solid rgba(148, 163, 184, 0.35);
  border-radius: 12px;
  background: #0f172a;
  color: #f8fafc;
}

button {
  width: 100%;
  padding: 14px 16px;
  margin-top: 8px;
  border: none;
  border-radius: 12px;
  background: #2563eb;
  color: #f8fafc;
  font-weight: 700;
  cursor: pointer;
}

button:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.success-message {
  margin-top: 18px;
  color: #22c55e;
}

.error-message {
  margin-top: 18px;
  color: #f87171;
}
</style>
