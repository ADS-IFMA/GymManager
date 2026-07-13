<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { listarAlunos } from '../services/alunoService.js';
import { registrarCheckin, listarCheckinsAluno } from '../services/checkinService.js';
import {
  Dumbbell,
  LayoutGrid,
  Users,
  GraduationCap,
  CalendarDays,
  LineChart,
  CreditCard,
  UserCheck,
  LogOut,
  Clock,
  CheckCircle,
} from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();

// ─── Estado Reativo ──────────────────────────────────────────────────────────

const alunos = ref([]);
const busca = ref('');
const alunoSelecionado = ref(null);
const historicoCheckins = ref([]);
const carregando = ref(false);
const carregandoCheckin = ref(false);
const mostrarDropdown = ref(false);
const toast = ref({ exibir: false, mensagem: '', tipo: 'success' });
let toastTimer = null;

// ─── Computados ──────────────────────────────────────────────────────────────

const alunosFiltrados = computed(() => {
  if (!busca.value.trim()) return [];
  return alunos.value.filter(aluno =>
    aluno.nome.toLowerCase().includes(busca.value.toLowerCase())
  );
});

// ─── Toast de Notificação ────────────────────────────────────────────────────

const exibirToast = (mensagem, tipo = 'success') => {
  if (toastTimer) clearTimeout(toastTimer);
  toast.value = { exibir: true, mensagem, tipo };
  toastTimer = setTimeout(() => {
    toast.value.exibir = false;
  }, 3000);
};

// ─── Carregamento de Alunos ──────────────────────────────────────────────────

const carregarAlunos = async () => {
  carregando.value = true;
  try {
    alunos.value = await listarAlunos();
  } catch (error) {
    console.error('Erro ao carregar alunos:', error);
    exibirToast('Erro ao carregar lista de alunos', 'error');
  } finally {
    carregando.value = false;
  }
};

// ─── Seleção de Aluno ────────────────────────────────────────────────────────

const selecionarAluno = async (aluno) => {
  alunoSelecionado.value = aluno;
  busca.value = aluno.nome;
  mostrarDropdown.value = false;

  // Carrega o histórico de check-ins do aluno
  try {
    historicoCheckins.value = await listarCheckinsAluno(aluno.id);
  } catch (error) {
    console.error('Erro ao carregar histórico:', error);
    exibirToast('Erro ao carregar histórico de check-ins', 'error');
    historicoCheckins.value = [];
  }
};

// ─── Confirmar Check-in ──────────────────────────────────────────────────────

const confirmarCheckin = async () => {
  if (!alunoSelecionado.value) {
    exibirToast('Selecione um aluno primeiro', 'error');
    return;
  }

  carregandoCheckin.value = true;
  try {
    const novoCheckin = await registrarCheckin(alunoSelecionado.value.id);

    // Adiciona o novo check-in ao topo da lista
    historicoCheckins.value.unshift(novoCheckin);

    exibirToast(`Check-in realizado para ${alunoSelecionado.value.nome}! ✓`, 'success');
  } catch (error) {
    console.error('Erro ao registrar check-in:', error);
    exibirToast(`Erro ao registrar check-in: ${error.message}`, 'error');
  } finally {
    carregandoCheckin.value = false;
  }
};

// ─── Limpar Seleção ─────────────────────────────────────────────────────────

const limparSeleção = () => {
  alunoSelecionado.value = null;
  busca.value = '';
  historicoCheckins.value = [];
  mostrarDropdown.value = false;
};

// ─── Formatação de Data ──────────────────────────────────────────────────────

const formatarDataHora = (dataStr) => {
  if (!dataStr) return '-';
  const data = new Date(dataStr);
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();
  const hora = String(data.getHours()).padStart(2, '0');
  const minuto = String(data.getMinutes()).padStart(2, '0');
  return `${dia}/${mes}/${ano} às ${hora}:${minuto}`;
};

// ─── Ciclo de Vida ───────────────────────────────────────────────────────────

onMounted(() => {
  carregarAlunos();
});

// ─── Logout ──────────────────────────────────────────────────────────────────

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
  router.push('/login');
};
</script>

<template>
  <div class="dashboard-layout">

    <!-- Toast de Notificação -->
    <Transition name="toast">
      <div v-if="toast.exibir" :class="['toast-notification', `toast-${toast.tipo}`]">
        <span class="toast-icon">{{ toast.tipo === 'success' ? '✓' : '✕' }}</span>
        <span class="toast-mensagem">{{ toast.mensagem }}</span>
      </div>
    </Transition>

    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="brand">
        <Dumbbell class="logo-icon" :size="28" />
        <span>GymManager</span>
      </div>

      <nav class="menu">
        <router-link to="/dashboard" class="menu-item" :class="{ active: route.path === '/dashboard' }">
          <LayoutGrid :size="18" /> Dashboard
        </router-link>
        <router-link to="/alunos" class="menu-item" :class="{ active: route.path.startsWith('/alunos') }">
          <Users :size="18" /> Alunos
        </router-link>
        <router-link to="/profissionais/cadastro" class="menu-item" :class="{ active: route.path.startsWith('/profissionais') }">
          <GraduationCap :size="18" /> Profissionais
        </router-link>
        <a href="#" class="menu-item">
          <CalendarDays :size="18" /> Agendamentos
        </a>
        <a href="#" class="menu-item">
          <LineChart :size="18" /> Avaliações Físicas
        </a>
        <router-link to="/mensalidades" class="menu-item" :class="{ active: route.path.startsWith('/mensalidades') }">
          <CreditCard :size="18" /> Mensalidades
        </router-link>
        <router-link to="/checkin" class="menu-item" :class="{ active: route.path === '/checkin' }">
          <UserCheck :size="18" /> Check-in
        </router-link>
      </nav>

      <button @click="logout" class="logout-btn">
        <LogOut :size="18" /> Sair
      </button>
    </aside>

    <!-- Main Content -->
    <main class="content">
      <header class="content-header">
        <h1>Check-in de Alunos</h1>
        <p>Registre e consulte o histórico de entradas</p>
      </header>

      <!-- Card de Busca -->
      <section class="search-section">
        <div class="card">
          <div class="card-header">
            <UserCheck :size="24" class="header-icon" />
            <h2>Buscar Aluno</h2>
          </div>

          <div class="search-container">
            <div class="search-input-wrapper">
              <input
                v-model="busca"
                @focus="mostrarDropdown = true"
                @input="mostrarDropdown = alunosFiltrados.length > 0"
                type="text"
                placeholder="Digite o nome do aluno..."
                class="search-input"
              />
              <span class="search-icon">🔍</span>
            </div>

            <!-- Dropdown de Resultados -->
            <Transition name="dropdown">
              <div v-if="mostrarDropdown && alunosFiltrados.length > 0" class="dropdown-results">
                <button
                  v-for="aluno in alunosFiltrados"
                  :key="aluno.id"
                  @click="selecionarAluno(aluno)"
                  class="dropdown-item"
                >
                  <span class="avatar">{{ aluno.nome.charAt(0).toUpperCase() }}</span>
                  <span class="aluno-info">
                    <strong>{{ aluno.nome }}</strong>
                    <small>ID: {{ aluno.id }}</small>
                  </span>
                </button>
              </div>
            </Transition>

            <!-- Mensagem quando não há resultados -->
            <div v-if="mostrarDropdown && busca.trim() && alunosFiltrados.length === 0" class="no-results">
              Nenhum aluno encontrado para "{{ busca }}"
            </div>
          </div>
        </div>
      </section>

      <!-- Card de Detalhes e Confirmação -->
      <section v-if="alunoSelecionado" class="confirmation-section">
        <div class="card">
          <div class="card-header success">
            <CheckCircle :size="24" class="header-icon" />
            <h2>Confirmar Entrada</h2>
          </div>

          <div class="confirmation-content">
            <div class="aluno-details">
              <div class="avatar-large">
                {{ alunoSelecionado.nome.charAt(0).toUpperCase() }}
              </div>
              <div class="details-text">
                <h3>{{ alunoSelecionado.nome }}</h3>
                <div class="mt-1.5 flex flex-wrap items-center gap-2 text-sm text-gray-600">
                  <span class="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-700/10">ID: {{ alunoSelecionado.id }}</span>
                  <span class="text-gray-300">•</span>
                  <span class="font-medium text-gray-500">{{ alunoSelecionado.email }}</span>
                </div>
              </div>
            </div>

            <div class="button-group">
              <button
                @click="confirmarCheckin"
                :disabled="carregandoCheckin"
                class="btn-confirm"
              >
                {{ carregandoCheckin ? 'Registrando...' : 'Confirmar Entrada' }}
              </button>
              <button @click="limparSeleção" class="btn-cancel">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Card de Histórico -->
      <section v-if="alunoSelecionado" class="history-section">
        <div class="card">
          <div class="card-header">
            <Clock :size="24" class="header-icon" />
            <h2>Histórico Recente</h2>
          </div>

          <div v-if="historicoCheckins.length === 0" class="empty-history">
            <p>Nenhum check-in registrado para este aluno.</p>
          </div>

          <div v-else class="checkin-table-scroll">
            <table class="checkin-history-table">
              <colgroup>
                <col class="checkin-col-id" />
                <col class="checkin-col-date" />
              </colgroup>
              <thead>
                <tr class="bg-gray-50 border-b border-gray-200">
                  <th scope="col" class="w-[25%] px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">ID</th>
                  <th scope="col" class="w-[75%] px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Horário de Entrada</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-100">
                <tr v-for="checkin in historicoCheckins" :key="checkin.id" class="hover:bg-gray-50 transition-colors">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{{ checkin.id }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-normal text-gray-600">{{ formatarDataHora(checkin.data_hora) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </main>

  </div>
</template>

<style scoped>
/* ─── Estrutura Principal ────────────────────────────────────────────────────────────── */

.dashboard-layout {
  display: flex;
  min-height: 100vh;
  width: 100%;
  background-color: #f8fafc;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

/* ─── Sidebar ────────────────────────────────────────────────────────────────────────── */

.sidebar {
  width: 260px;
  min-width: 260px;
  background-color: #ffffff;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  padding: 24px 0;
  height: 100vh;
  position: sticky;
  top: 0;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 24px;
  margin-bottom: 40px;
  font-size: 1.15rem;
  font-weight: 800;
  color: #1e40af;
}

.brand .logo-icon {
  color: #2563eb;
  flex-shrink: 0;
}

.menu {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 24px;
  color: #64748b;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s;
  border-left: 4px solid transparent;
}

.menu-item:hover {
  background-color: #f1f5f9;
  color: #1e293b;
}

.menu-item.active {
  background-color: #eff6ff;
  color: #2563eb;
  border-left-color: #2563eb;
}

.logout-btn {
  margin: 24px;
  padding: 12px;
  background: none;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  transition: all 0.2s;
}

.logout-btn:hover {
  background-color: #fee2e2;
  border-color: #fecaca;
  color: #dc2626;
}

/* ─── Conteúdo Principal ─────────────────────────────────────────────────────────────── */

.content {
  flex: 1;
  padding: 40px;
  width: 100%;
  overflow-y: auto;
  background-color: #f8fafc;
}

.content-header {
  margin-bottom: 36px;
}

.content-header h1 {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.content-header p {
  color: #64748b;
  font-size: 0.95rem;
  margin: 0;
}

/* ─── Cards Gerais ───────────────────────────────────────────────────────────────────── */

.card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.2s;
}

.card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f1f5f9;
}

.card-header.success {
  border-bottom-color: #dcfce7;
}

.header-icon {
  color: #2563eb;
  flex-shrink: 0;
}

.card-header.success .header-icon {
  color: #16a34a;
}

.card-header h2 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

/* ─── Seção de Busca ─────────────────────────────────────────────────────────────────── */

.search-section {
  margin-bottom: 32px;
}

.search-container {
  position: relative;
}

.search-input-wrapper {
  position: relative;
}

.search-input {
  width: 100%;
  padding: 12px 16px 12px 42px;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
  background-color: #f8fafc;
  font-size: 0.95rem;
  color: #1e293b;
  box-sizing: border-box;
  transition: all 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  background-color: white;
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.9rem;
  pointer-events: none;
  color: #94a3b8;
}

/* ─── Dropdown de Resultados ─────────────────────────────────────────────────────────── */

.dropdown-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #cbd5e1;
  border-top: none;
  border-radius: 0 0 10px 10px;
  max-height: 300px;
  overflow-y: auto;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 16px;
  border: none;
  background: none;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;
  border-bottom: 1px solid #f1f5f9;
}

.dropdown-item:hover {
  background-color: #f1f5f9;
}

.dropdown-item:last-child {
  border-bottom: none;
}

.avatar {
  width: 40px;
  height: 40px;
  min-width: 40px;
  background: linear-gradient(135deg, #dbeafe, #bfdbfe);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: #1e40af;
  font-size: 0.9rem;
}

.aluno-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.aluno-info strong {
  color: #1e293b;
  font-weight: 600;
}

.aluno-info small {
  color: #94a3b8;
  font-size: 0.8rem;
}

.no-results {
  padding: 16px;
  color: #94a3b8;
  text-align: center;
  font-size: 0.9rem;
}

/* ─── Seção de Confirmação ───────────────────────────────────────────────────────────── */

.confirmation-section {
  margin-bottom: 32px;
}

.confirmation-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
}

.aluno-details {
  display: flex;
  align-items: center;
  gap: 24px;
  flex: 1;
}

.avatar-large {
  width: 80px;
  height: 80px;
  min-width: 80px;
  background: linear-gradient(135deg, #dbeafe, #bfdbfe);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: #1e40af;
  font-size: 1.8rem;
  box-shadow: 0 4px 12px rgba(30, 64, 175, 0.15);
}

.details-text h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 4px 0;
}

.details-text > div {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
  color: #4b5563;
  font-size: 0.875rem;
}

.details-text > div span:first-child {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 6px;
  background: #eff6ff;
  color: #1d4ed8;
  box-shadow: inset 0 0 0 1px rgba(29, 78, 216, 0.1);
  font-size: 0.75rem;
  font-weight: 700;
}

.details-text > div span:nth-child(2) {
  color: #d1d5db;
}

.details-text > div span:last-child {
  color: #6b7280;
  font-weight: 500;
}

.button-group {
  display: flex;
  gap: 12px;
}

.btn-confirm {
  background: linear-gradient(135deg, #2563eb, #1e40af);
  color: white;
  border: none;
  padding: 14px 32px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
  font-size: 0.95rem;
}

.btn-confirm:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.4);
}

.btn-confirm:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-cancel {
  background: #f1f5f9;
  color: #64748b;
  border: 1px solid #cbd5e1;
  padding: 14px 32px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.95rem;
}

.btn-cancel:hover {
  background: #e2e8f0;
  color: #1e293b;
}

/* ─── Seção de Histórico ─────────────────────────────────────────────────────────────── */

.history-section {
  margin-bottom: 32px;
}

.empty-history {
  padding: 40px;
  text-align: center;
  color: #94a3b8;
}

.checkin-table-scroll {
  width: 100%;
  overflow-x: auto;
}

.checkin-history-table {
  display: table;
  width: 100%;
  min-width: 640px;
  table-layout: fixed;
  border-collapse: collapse;
  text-align: left;
  color: #111827;
}

.checkin-history-table .checkin-col-id {
  width: 25%;
}

.checkin-history-table .checkin-col-date {
  width: 75%;
}

.checkin-history-table thead tr {
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.checkin-history-table tbody tr {
  border-bottom: 1px solid #f1f5f9;
  transition: background-color 0.2s ease;
}

.checkin-history-table tbody tr:hover {
  background: #f8fafc;
}

.checkin-history-table th,
.checkin-history-table td {
  display: table-cell;
  padding: 12px 24px;
  text-align: left;
  vertical-align: middle;
  white-space: nowrap;
  line-height: 1.4;
}

.checkin-history-table th {
  color: #334155;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.checkin-history-table td {
  color: #4b5563;
  font-size: 0.95rem;
  font-weight: 400;
}

.checkin-history-table td:first-child {
  color: #2563eb;
  font-weight: 500;
}

/* ─── Toast de Notificação ───────────────────────────────────────────────────────────── */

.toast-notification {
  position: fixed;
  bottom: 24px;
  right: 24px;
  padding: 14px 20px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  z-index: 1000;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  max-width: 400px;
  animation: slideIn 0.3s ease-out;
}

.toast-success {
  background: #dcfce7;
  color: #166534;
  border: 1px solid #86efac;
}

.toast-error {
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #fca5a5;
}

.toast-icon {
  font-size: 1.2rem;
  font-weight: 700;
}

.toast-mensagem {
  font-size: 0.95rem;
}

/* ─── Transições ────────────────────────────────────────────────────────────────────── */

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* ─── Responsive ────────────────────────────────────────────────────────────────────── */

@media (max-width: 768px) {
  .sidebar {
    width: 200px;
  }

  .content {
    padding: 24px;
  }

  .confirmation-content {
    flex-direction: column;
    gap: 24px;
  }

  .button-group {
    width: 100%;
    flex-direction: column;
  }

  .btn-confirm,
  .btn-cancel {
    width: 100%;
  }

  .content-header h1 {
    font-size: 1.5rem;
  }

  .avatar-large {
    width: 60px;
    height: 60px;
    font-size: 1.4rem;
  }

  .toast-notification {
    bottom: 16px;
    right: 16px;
    left: 16px;
    max-width: none;
  }
}
</style>
