<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

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

// Dados temporários
const totalAlunos = ref(0)
const totalProfissionais = ref(0)
const mensalidadesPendentes = ref(0)

const carregarDashboard = async () => {
  try {

    const respostaAlunos = await axios.get(
      'http://localhost:3000/api/alunos'
    )

    totalAlunos.value = respostaAlunos.data.length

    const respostaProfissionais = await axios.get(
      'http://localhost:3000/api/profissionais'
    )

    totalProfissionais.value =
      respostaProfissionais.data.length

  } catch (error) {
    console.error('Erro ao carregar dashboard:', error)
  }

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

        <a href="#" class="menu-item active">
          <LayoutGrid :size="18" />
          Dashboard
        </a>

        <a href="#" class="menu-item">
          <Users :size="18" />
          Alunos
        </a>

        <a href="#" class="menu-item">
          <GraduationCap :size="18" />
          Profissionais
        </a>

        <a href="#" class="menu-item">
          <CalendarDays :size="18" />
          Agendamentos
        </a>

        <a href="#" class="menu-item">
          <LineChart :size="18" />
          Avaliações
        </a>

        <a href="#" class="menu-item">
          <CreditCard :size="18" />
          Mensalidades
        </a>

        <a href="#" class="menu-item">
          <UserCheck :size="18" />
          Check-in
        </a>

      </nav>

      <button class="logout-btn">
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

        <div class="metric-card">

          <div>
            <span class="label">
              Total de Alunos
            </span>

            <h2>{{ totalAlunos }}</h2>
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

        <div class="metric-card">

          <div>
            <span class="label">
              Mensalidades Pendentes
            </span>

            <h2>{{ mensalidadesPendentes }}</h2>
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

    </main>

  </div>
</template>

<style scoped>

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
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.metric-card h2 {
  margin-top: 10px;
  font-size: 2rem;
  color: #0f172a;
}

.label {
  color: #64748b;
  font-size: 0.9rem;
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

</style>