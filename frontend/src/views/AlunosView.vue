<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { listarAlunos } from '../services/alunoService.js';

const router = useRouter();
const alunos = ref([]);
const carregando = ref(false);
const erro = ref('');

const carregarAlunos = async () => {
  carregando.value = true;
  erro.value = '';

  try {
    alunos.value = await listarAlunos();
  } catch (err) {
    erro.value = err.message || 'Erro ao carregar alunos.';
  } finally {
    carregando.value = false;
  }
};

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
  router.push('/login');
};

onMounted(() => {
  carregarAlunos();
});
</script>

<template>
  <div class="page-shell">
    <header class="page-header">
      <div>
        <h1>Alunos</h1>
        <p>Gerencie os alunos cadastrados no sistema.</p>
      </div>
      <button class="logout-btn" @click="logout">Sair</button>
    </header>

    <div v-if="carregando" class="state">Carregando alunos...</div>
    <div v-else-if="erro" class="state error">{{ erro }}</div>
    <div v-else class="card">
      <div class="actions">
        <router-link to="/alunos/cadastro" class="btn-primary">Novo aluno</router-link>
        <router-link to="/dashboard" class="btn-secondary">Voltar</router-link>
      </div>

      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>E-mail</th>
            <th>Perfil</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="aluno in alunos" :key="aluno.id">
            <td>{{ aluno.nome }}</td>
            <td>{{ aluno.email }}</td>
            <td>{{ aluno.perfil || 'aluno' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.page-shell { padding: 24px; background: #f8fafc; min-height: 100vh; }
.page-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; }
.card { background:white; border-radius:16px; padding:20px; box-shadow:0 10px 30px rgba(15,23,42,0.08); }
.actions { display:flex; gap:12px; margin-bottom:16px; }
.btn-primary, .btn-secondary, .logout-btn { padding:10px 14px; border:none; border-radius:10px; cursor:pointer; text-decoration:none; }
.btn-primary { background:#2563eb; color:white; }
.btn-secondary { background:#e2e8f0; color:#0f172a; }
.logout-btn { background:#dc2626; color:white; }
table { width:100%; border-collapse:collapse; }
th, td { padding:12px; border-bottom:1px solid #e2e8f0; text-align:left; }
.state { padding:20px; background:white; border-radius:16px; }
.error { color:#dc2626; }
</style>
