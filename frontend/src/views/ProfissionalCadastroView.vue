<template>
  <div class="main-container">
    <div class="cadastro-profissional">
      <h2>Cadastro de Profissional</h2>
      
      <form @submit.prevent="realizarCadastro" class="form-profissional">
        <div class="form-group">
          <label for="nome">Nome Completo *</label>
          <input type="text" id="nome" v-model="form.nome" class="form-control" required placeholder="Digite o nome" />
        </div>

        <div class="form-group">
          <label for="email">E-mail *</label>
          <input type="email" id="email" v-model="form.email" class="form-control" required placeholder="Digite o e-mail" />
        </div>

        <div class="form-group">
          <label for="senha">Senha *</label>
          <input type="password" id="senha" v-model="form.senha" class="form-control" required placeholder="Crie uma senha forte" />
        </div>

        <div class="form-group">
          <label for="cref">Registro Profissional (CREF) *</label>
          <input type="text" id="cref" v-model="form.registro_profissional" class="form-control" required placeholder="Ex: 123456-G/MA" />
        </div>

        <div class="form-group span-2">
          <label for="especialidade">Especialidade</label>
          <input type="text" id="especialidade" v-model="form.especialidade" class="form-control" placeholder="Ex: Musculação, Crossfit" />
        </div>

        <p v-if="mensagemErro" class="mensagem erro span-2">{{ mensagemErro }}</p>
        <p v-if="mensagemSucesso" class="mensagem sucesso span-2">{{ mensagemSucesso }}</p>

        <button type="submit" class="btn-primary" :disabled="carregando">
          {{ carregando ? 'Cadastrando...' : 'Cadastrar Profissional' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { cadastrarProfissionalAPI } from '../services/profissionalService';

const form = reactive({
  nome: '',
  email: '',
  senha: '',
  registro_profissional: '',
  especialidade: ''
});

const carregando = ref(false);
const mensagemErro = ref('');
const mensagemSucesso = ref('');

const realizarCadastro = async () => {
  mensagemErro.value = '';
  mensagemSucesso.value = '';
  carregando.value = true;

  try {
    await cadastrarProfissionalAPI(form);
    mensagemSucesso.value = 'Profissional cadastrado com sucesso!';
    
    form.nome = '';
    form.email = '';
    form.senha = '';
    form.registro_profissional = '';
    form.especialidade = '';

  } catch (error) {
    mensagemErro.value = error.message;
  } finally {
    carregando.value = false;
  }
};
</script>

<style scoped>

.main-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 80px); 
  padding: 20px;
}

.cadastro-profissional {
  background-color: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 800px; 
  margin: 30px auto;
}

h2 {
  color: #333;
  text-align: center;
  margin-bottom: 30px;
  font-size: 2rem;
  font-weight: 700;
}

.form-profissional {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

label {
  font-weight: 600;
  color: #555;
  font-size: 0.95rem;
}

.form-control {
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-control:focus {
  border-color: #3f51b5; 
  box-shadow: 0 0 0 3px rgba(63, 81, 181, 0.1);
  outline: none;
}

.span-2 {
  grid-column: span 2;
}

.btn-primary {
  grid-column: span 2;
  padding: 15px;
  background-color: #3f51b5;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 15px;
}

.btn-primary:hover:not(:disabled) {
  background-color: #2c3e9c;
}

.btn-primary:active:not(:disabled) {
  transform: translateY(1px);
}

.btn-primary:disabled {
  background-color: #a0a8d6;
  cursor: not-allowed;
}

.mensagem {
  text-align: center;
  padding: 10px;
  border-radius: 6px;
  font-weight: 600;
  margin-top: 10px;
}

.erro {
  color: #d32f2f;
  background-color: #ffebee;
  border: 1px solid #ffcdd2;
}

.sucesso {
  color: #388e3c;
  background-color: #e8f5e9;
  border: 1px solid #c8e6c9;
}

@media (max-width: 600px) {
  .form-profissional {
    grid-template-columns: 1fr;
  }
  
  .span-2,
  .btn-primary {
    grid-column: span 1;
  }
}
</style>