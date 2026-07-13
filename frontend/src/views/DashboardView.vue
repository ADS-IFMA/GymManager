<<<<<<< HEAD
<template>
  <div class="dashboard">
    <header class="navbar">
      <div class="navbar-container">
        <h1>GymManager</h1>
        <nav class="nav-menu">
          <router-link to="/dashboard" class="nav-link">Dashboard</router-link>
          <router-link to="/alunos" class="nav-link">Alunos</router-link>
          <router-link to="/profissionais" class="nav-link">Profissionais</router-link>
          <router-link to="/mensalidades" class="nav-link">Mensalidades</router-link>
          <button @click="handleLogout" class="btn-logout">Sair</button>
        </nav>
      </div>
    </header>

    <main class="dashboard-content">
      <div class="welcome-section">
        <h2>Bem-vindo, {{ usuarioNome }}!</h2>
        <p>Este é o painel de controle do GymManager</p>
      </div>

      <div class="dashboard-grid">
        <div class="card">
          <h3>Alunos</h3>
          <p class="card-number">{{ stats.alunos }}</p>
          <router-link to="/alunos" class="card-link">Ver Alunos →</router-link>
        </div>

        <div class="card">
          <h3>Profissionais</h3>
          <p class="card-number">{{ stats.profissionais }}</p>
          <router-link to="/profissionais" class="card-link">Ver Profissionais →</router-link>
        </div>

        <div class="card">
          <h3>Atividades</h3>
          <p class="card-number">{{ stats.atividades }}</p>
          <a href="#" class="card-link">Ver Atividades →</a>
        </div>

        <div class="card">
          <h3>Mensalidades</h3>
          <p class="card-number">{{ stats.mensalidades }}</p>
          <router-link to="/mensalidades" class="card-link">Ver Mensalidades →</router-link>
        </div>
      </div>
=======
<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter, useRoute } from 'vue-router'

import {
  Dumbbell,
  LayoutGrid,
  Users,
  GraduationCap,
  CalendarDays,
  LineChart,
  CreditCard,
  UserCheck,
  LogOut
} from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()

// Dados do dashboard
const totalAlunos = ref(0)
const totalProfissionais = ref(0)
const mensalidadesPendentes = ref(0)
const alunosRecentes = ref([])

const carregarDashboard = async () => {
  try {
    const respostaAlunos = await axios.get('http://localhost:3000/api/alunos')
    totalAlunos.value = respostaAlunos.data.length
    alunosRecentes.value = respostaAlunos.data.slice(-5).reverse()

    const respostaProfissionais = await axios.get('http://localhost:3000/api/profissionais')
    totalProfissionais.value = respostaProfissionais.data.length

    // const respostaMensalidades = await axios.get('http://localhost:3000/api/mensalidades')
   // mensalidadesPendentes.value = respostaMensalidades.data.filter(m => m.paga === false).length
   mensalidadesPendentes.value = 0;
  } catch (error) {
    console.error('Erro ao carregar dashboard:', error)
  }
}

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('usuario')
  router.push('/login')
}

onMounted(() => {
  carregarDashboard()
})

</script>

<template>
  <div class="dashboard-layout">

    <!-- Sidebar -->
    <aside class="sidebar">

      <div class="brand">
        <Dumbbell :size="28" />
        <span>GymManager</span>
      </div>

      <nav class="menu">

        <router-link to="/dashboard" class="menu-item" :class="{ active: route.path === '/dashboard' }">
          <LayoutGrid :size="18" />
          Dashboard
        </router-link>

        <router-link to="/alunos" class="menu-item" :class="{ active: route.path.startsWith('/alunos') }">
          <Users :size="18" />
          Alunos
        </router-link>

        <router-link to="/alunos/cadastro"  class="menu-item" :class="{ active: route.path === '/alunos/cadastro' }" >          <Users :size="18" />
          Cadastrar Aluno
        </router-link>

        <router-link to="/profissionais/cadastro" class="menu-item" :class="{ active: route.path.startsWith('/profissionais') }">
          <GraduationCap :size="18" />
          Profissionais
        </router-link>

        <a href="#" class="menu-item">
          <CalendarDays :size="18" />
          Agendamentos
        </a>

        <a href="#" class="menu-item">
          <LineChart :size="18" />
          Avaliações
        </a>

        <router-link to="/mensalidades" class="menu-item" :class="{ active: route.path.startsWith('/mensalidades') }">
          <CreditCard :size="18" />
          Mensalidades
        </router-link>

        <router-link to="/checkin" class="menu-item" :class="{ active: route.path === '/checkin' }">
          <UserCheck :size="18" />
          Check-in
        </router-link>

      </nav>

      <button @click="logout" class="logout-btn">
        <LogOut :size="18" />
        Sair
      </button>

    </aside>

    <!-- Conteúdo -->
    <main class="content">

      <header class="content-header">
        <h1>Dashboard</h1>
        <p>Visão geral da academia</p>
      </header>

      <!-- Cards -->
      <section class="metrics-grid">

        <div class="metric-card clickable" @click="router.push('/alunos')">

          <div>
            <span class="label">
              Total de Alunos
            </span>

            <h2>{{ totalAlunos }}</h2>
            <small>Ver lista de alunos</small>
          </div>

          <div class="metric-icon blue">
            <Users :size="28" />
          </div>

        </div>

        <div class="metric-card">

          <div>
            <span class="label">
              Profissionais
            </span>

            <h2>{{ totalProfissionais }}</h2>
          </div>

          <div class="metric-icon green">
            <GraduationCap :size="28" />
          </div>

        </div>

        <div class="metric-card clickable" @click="router.push('/mensalidades')">

          <div>
            <span class="label">
              Mensalidades Pendentes
            </span>

            <h2>{{ mensalidadesPendentes }}</h2>
            <small>Ir para mensalidades</small>
          </div>

          <div class="metric-icon red">
            <CreditCard :size="28" />
          </div>

        </div>

      </section>

      <!-- Tabela -->
      <section class="table-section">

        <div class="table-header">
          <h2>Últimos alunos cadastrados</h2>
        </div>

        <table>

          <thead>
            <tr>
              <th>Nome</th>
              <th>Plano</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>

            <tr
              v-for="aluno in alunosRecentes"
              :key="aluno.id"
            >
              <td>{{ aluno.nome }}</td>

              <td>{{ aluno.plano }}</td>

              <td>
                <span
                  :class="[
                    'badge',
                    aluno.status === 'Ativo'
                      ? 'badge-success'
                      : 'badge-warning'
                  ]"
                >
                  {{ aluno.status }}
                </span>
              </td>
            </tr>

          </tbody>

        </table>

      </section>

>>>>>>> origin/develop
    </main>

  </div>
</template>

<script>
import { defineComponent } from 'vue';
import authService from '../services/authService.js';

export default defineComponent({
  name: 'DashboardView',
  data() {
    return {
      usuarioNome: 'Usuário',
      stats: {
        alunos: 0,
        profissionais: 0,
        atividades: 0,
        mensalidades: 0
      }
    };
  },
  methods: {
    handleLogout() {
      authService.logout();
      this.$router.push('/login');
    },
    async carregarDados() {
      try {
        const usuario = authService.getUsuario();
        if (usuario) {
          this.usuarioNome = usuario.nome || 'Usuário';
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    }
  },
  mounted() {
    if (!authService.isAuthenticated()) {
      this.$router.push('/login');
    } else {
      this.carregarDados();
    }
  }
});
</script>

<style scoped>
<<<<<<< HEAD
.dashboard {
  min-height: 100vh;
  background-color: #f5f5f5;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.navbar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.navbar-container {
=======

.dashboard-layout {
  display: flex;
  min-height: 100vh;
  background: #f8fafc;
  font-family: 'Inter', sans-serif;
}

/* SIDEBAR */

.sidebar {
  width: 260px;
  background: white;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  padding: 24px 0;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 24px;
  margin-bottom: 40px;
  color: #2563eb;
  font-size: 1.2rem;
  font-weight: 800;
}

.menu {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 24px;
  color: #64748b;
  text-decoration: none;
  font-weight: 500;
  border-left: 4px solid transparent;
  transition: 0.2s;
}

.menu-item:hover {
  background: #f1f5f9;
}

.menu-item.active {
  background: #eff6ff;
  color: #2563eb;
  border-left-color: #2563eb;
}

.logout-btn {
  margin: 24px;
  padding: 12px;
  border: none;
  border-radius: 10px;
  background: #ef4444;
  color: white;
  font-weight: 600;
  cursor: pointer;
}

/* CONTENT */

.content {
  flex: 1;
  padding: 40px;
}

.content-header h1 {
  font-size: 2rem;
  color: #0f172a;
}

.content-header p {
  color: #64748b;
  margin-top: 5px;
}

/* CARDS */

.metrics-grid {
  margin-top: 32px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
}

.metric-card {
  background: white;
  border-radius: 18px;
  padding: 24px;
  border: 1px solid #e2e8f0;
>>>>>>> origin/develop
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

<<<<<<< HEAD
.navbar h1 {
  margin: 0;
  font-size: 24px;
}

.nav-menu {
  display: flex;
  gap: 20px;
  align-items: center;
}

.nav-link {
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.3s;
}

.nav-link:hover {
  opacity: 0.8;
}

.nav-link.router-link-active {
  opacity: 0.8;
  border-bottom: 2px solid white;
  padding-bottom: 5px;
}

.btn-logout {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid white;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s;
}

.btn-logout:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

.dashboard-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.welcome-section {
  background: white;
  padding: 30px;
  border-radius: 10px;
  margin-bottom: 40px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.welcome-section h2 {
  margin: 0 0 10px;
  color: #333;
}

.welcome-section p {
  margin: 0;
  color: #666;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.card {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s, box-shadow 0.3s;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.card h3 {
  margin: 0 0 10px;
  color: #333;
  font-size: 18px;
}

.card-number {
  font-size: 32px;
  font-weight: bold;
  color: #667eea;
  margin: 10px 0;
}

.card-link {
  display: inline-block;
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  margin-top: 10px;
  transition: color 0.3s;
}

.card-link:hover {
  color: #764ba2;
}

@media (max-width: 768px) {
  .navbar-container {
    flex-direction: column;
    gap: 15px;
  }

  .nav-menu {
    flex-direction: column;
    width: 100%;
  }

  .nav-link {
    padding: 10px;
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
=======
.metric-card.clickable {
  cursor: pointer;
}

.metric-card.clickable:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.08);
}

.metric-card small {
  display: block;
  margin-top: 6px;
  color: #64748b;
}

.metric-icon {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.blue {
  background: #dbeafe;
  color: #2563eb;
}

.green {
  background: #dcfce7;
  color: #16a34a;
}

.red {
  background: #fee2e2;
  color: #dc2626;
}

/* TABLE */

.table-section {
  margin-top: 36px;
  background: white;
  border-radius: 18px;
  padding: 24px;
  border: 1px solid #e2e8f0;
}

.table-header {
  margin-bottom: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  text-align: left;
  padding: 14px;
  background: #f8fafc;
  color: #475569;
}

td {
  padding: 14px;
  border-top: 1px solid #f1f5f9;
}

.badge {
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 700;
}

.badge-success {
  background: #dcfce7;
  color: #16a34a;
}

.badge-warning {
  background: #fef3c7;
  color: #ca8a04;
}

:global(#app) {
  width: 100%;
  max-width: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
}

@media (max-width: 768px) {

  .dashboard-layout{
    flex-direction: column;
  }

  .sidebar{
    width:100%;
    border-right:none;
    border-bottom:1px solid #e2e8f0;
  }

  .content{
    padding:20px;
>>>>>>> origin/develop
  }

  .metrics-grid{
    grid-template-columns:1fr;
  }

}

</style>

