<script setup>
import { ref, computed, onMounted } from 'vue';
import { atualizarStatusMensalidade, getMensalidadesPorAluno } from '../services/mensalidadeService.js';
import { listarAlunos } from '../services/alunoService.js';
import { Dumbbell, LayoutGrid, Users, GraduationCap, CalendarDays, LineChart, CreditCard, UserCheck, LogOut } from 'lucide-vue-next';

// Estado Reativo
const mensalidades = ref([]);
const carregando = ref(false);
const erroCarregamento = ref('');
const busca = ref('');
const carregandoId = ref(null);

// ─── Toast de Notificação ──────────────────────────────────────────────────────

const toast = ref({ exibir: false, mensagem: '', tipo: 'success' });
let toastTimer = null;

const exibirToast = (mensagem, tipo = 'success') => {
  if (toastTimer) clearTimeout(toastTimer);
  toast.value = { exibir: true, mensagem, tipo };
  toastTimer = setTimeout(() => {
    toast.value.exibir = false;
  }, 3000);
};

// ─── Carregamento dos Dados Reais ─────────────────────────────────────────────

const carregarDadosFinanceiros = async () => {
  carregando.value = true;
  erroCarregamento.value = '';

  try {
    // 1. Busca todos os alunos do banco
    const alunos = await listarAlunos();

    // 2. Para cada aluno, busca suas mensalidades em paralelo
    const resultados = await Promise.all(
      alunos.map(async (aluno) => {
        try {
          const registros = await getMensalidadesPorAluno(aluno.id);

          // 3. Se o aluno tiver mensalidades, mapeia cada uma como uma linha
          if (registros && registros.length > 0) {
            return registros.map((m) => ({
              id: m.id,
              alunoId: aluno.id,
              aluno: aluno.nome,
              valor: parseFloat(m.valor),
              vencimento: m.data_vencimento,
              dataPagamento: m.data_pagamento || null,
              status: m.status, // 'PAGO' | 'PENDENTE' | 'VENCIDO'
            }));
          }

          // 4. Se o aluno não tiver mensalidades, exibe linha neutra
          return [{
            id: null,
            alunoId: aluno.id,
            aluno: aluno.nome,
            valor: null,
            vencimento: null,
            dataPagamento: null,
            status: 'SEM_REGISTRO',
          }];
        } catch {
          // Falha silenciosa por aluno — não quebra o carregamento geral
          return [];
        }
      })
    );

    // 5. Achata o array de arrays em uma lista única
    mensalidades.value = resultados.flat();

  } catch (err) {
    console.error('Erro ao carregar dados financeiros:', err);
    erroCarregamento.value = 'Não foi possível carregar os dados. Verifique se o servidor está ativo.';
  } finally {
    carregando.value = false;
  }
};

onMounted(carregarDadosFinanceiros);

// ─── Computados de Métricas (baseados nos dados reais) ───────────────────────

const totalRecebido = computed(() =>
  mensalidades.value
    .filter(m => m.status === 'PAGO')
    .reduce((acc, curr) => acc + (curr.valor || 0), 0)
);

const totalPendente = computed(() =>
  mensalidades.value
    .filter(m => m.status === 'PENDENTE')
    .reduce((acc, curr) => acc + (curr.valor || 0), 0)
);

const totalAtrasado = computed(() =>
  mensalidades.value
    .filter(m => m.status === 'VENCIDO')
    .reduce((acc, curr) => acc + (curr.valor || 0), 0)
);

// ─── Filtro de Busca Reativo ──────────────────────────────────────────────────

const mensalidadesFiltradas = computed(() => {
  if (!busca.value.trim()) return mensalidades.value;
  return mensalidades.value.filter(m =>
    m.aluno.toLowerCase().includes(busca.value.toLowerCase())
  );
});

// ─── Ação de Registrar Pagamento ─────────────────────────────────────────────

const registrarPagamento = async (item) => {
  if (carregandoId.value || !item.id) return;

  carregandoId.value = item.id;
  try {
    await atualizarStatusMensalidade(item.id, 'PAGO');

    // Atualiza o estado local sem precisar recarregar tudo
    const index = mensalidades.value.findIndex(m => m.id === item.id);
    if (index !== -1) {
      mensalidades.value[index].status = 'PAGO';
      mensalidades.value[index].dataPagamento = new Date().toISOString().split('T')[0];
    }
    exibirToast(`Pagamento de ${item.aluno} registrado com sucesso!`, 'success');
  } catch (err) {
    console.error(err);
    exibirToast('Erro ao registrar pagamento: ' + err.message, 'error');
  } finally {
    carregandoId.value = null;
  }
};

// ─── Utilitários ─────────────────────────────────────────────────────────────

const formatarMoeda = (valor) => {
  if (valor === null || valor === undefined) return '-';
  return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const formatarData = (dataStr) => {
  if (!dataStr || dataStr === '-') return '-';
  // Formato ISO: YYYY-MM-DD ou com timestamp
  const partes = dataStr.toString().split('T')[0].split('-');
  if (partes.length === 3) return `${partes[2]}/${partes[1]}/${partes[0]}`;
  return dataStr;
};

// Mapeia o status do banco para o rótulo visual exibido na interface
const labelStatus = (status) => {
  const mapa = { PAGO: 'Pago', PENDENTE: 'Pendente', VENCIDO: 'Atrasado', SEM_REGISTRO: 'Sem registro' };
  return mapa[status] || status;
};
</script>

<template>
  <div class="dashboard-layout">

    <!-- Toast de Notificação Premium -->
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
        <a href="#" class="menu-item"><LayoutGrid :size="18" /> Dashboard</a>
        <a href="#" class="menu-item"><Users :size="18" /> Alunos</a>
        <a href="#" class="menu-item"><GraduationCap :size="18" /> Profissionais</a>
        <a href="#" class="menu-item"><CalendarDays :size="18" /> Agendamentos</a>
        <a href="#" class="menu-item"><LineChart :size="18" /> Avaliações Físicas</a>
        <a href="#" class="menu-item active"><CreditCard :size="18" /> Mensalidades</a>
        <a href="#" class="menu-item"><UserCheck :size="18" /> Check-in</a>
      </nav>

      <button class="logout-btn">
        <LogOut :size="18" /> Sair
      </button>
    </aside>

    <!-- Main Content -->
    <main class="content">
      <header class="content-header">
        <h1>Mensalidades</h1>
      </header>

      <!-- Metric Cards -->
      <section class="metrics-grid">
        <div class="metric-card card-success">
          <div class="metric-info">
            <span class="label">Recebido (Mês)</span>
            <span class="value">{{ formatarMoeda(totalRecebido) }}</span>
          </div>
          <div class="metric-icon">✓</div>
        </div>

        <div class="metric-card card-warning">
          <div class="metric-info">
            <span class="label">Pendente</span>
            <span class="value">{{ formatarMoeda(totalPendente) }}</span>
          </div>
          <div class="metric-icon">!</div>
        </div>

        <div class="metric-card card-danger">
          <div class="metric-info">
            <span class="label">Atrasado</span>
            <span class="value">{{ formatarMoeda(totalAtrasado) }}</span>
          </div>
          <div class="metric-icon">✕</div>
        </div>
      </section>

      <!-- Filter and Table Container -->
      <section class="data-section">
        <div class="data-header">
          <div class="search-box">
            <span class="search-icon">🔍</span>
            <input
              type="text"
              v-model="busca"
              placeholder="Buscar por aluno..."
            />
          </div>
        </div>

        <!-- Estado de carregamento -->
        <div v-if="carregando" class="text-center empty-state">
          Carregando dados financeiros...
        </div>

        <!-- Estado de erro -->
        <div v-else-if="erroCarregamento" class="text-center empty-state error-state">
          {{ erroCarregamento }}
        </div>

        <!-- Tabela de dados -->
        <div v-else class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Aluno</th>
                <th>Valor</th>
                <th>Vencimento</th>
                <th>Data Pagamento</th>
                <th>Status</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in mensalidadesFiltradas"
                :key="`${item.alunoId}-${item.id}`"
                :class="{ 'row-warning': item.status === 'PENDENTE' || item.status === 'VENCIDO' }"
              >
                <td>
                  <div class="aluno-cell">
                    <div class="avatar-small">{{ item.aluno.charAt(0) }}</div>
                    {{ item.aluno }}
                  </div>
                </td>
                <td class="bold">{{ formatarMoeda(item.valor) }}</td>
                <td>{{ formatarData(item.vencimento) }}</td>
                <td>{{ formatarData(item.dataPagamento) }}</td>
                <td>
                  <span :class="['badge', `badge-${item.status.toLowerCase()}`]">
                    <i v-if="item.status === 'PAGO'">✓</i>
                    <i v-if="item.status === 'PENDENTE'">!</i>
                    <i v-if="item.status === 'VENCIDO'">✕</i>
                    {{ labelStatus(item.status) }}
                  </span>
                </td>
                <td>
                  <button
                    v-if="item.status === 'PENDENTE' || item.status === 'VENCIDO'"
                    @click="registrarPagamento(item)"
                    class="btn-register"
                    :disabled="carregandoId === item.id"
                  >
                    {{ carregandoId === item.id ? '...' : 'REGISTRAR' }}
                  </button>
                  <span v-else class="text-muted">-</span>
                </td>
              </tr>
              <tr v-if="mensalidadesFiltradas.length === 0 && !carregando">
                <td colspan="6" class="text-center empty-state">
                  {{ busca ? `Nenhum aluno encontrado para "${busca}"` : 'Nenhum dado disponível.' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  </div>
</template>

<style>
/* Reset Global para garantir Full Width em todo o sistema */
#app {
  max-width: none !important;
  width: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
  border: none !important; /* Remove bordas que possam estar no style.css global */
}
</style>

<style scoped>
/* Estrutura Principal Flexbox */
.dashboard-layout {
  display: flex;
  min-height: 100vh;
  width: 100%;
  background-color: #f8fafc;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

/* Sidebar Fixa e Lateral */
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

/* Ícone Dumbbell do Lucide usado como logo */
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
}

/* Conteúdo Principal (Direita) */
.content {
  flex: 1;
  padding: 40px;
  width: 100%; /* Garante preenchimento total */
  overflow-y: auto;
  background-color: #f8fafc;
}

.content-header h1 {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 32px;
}

/* Cards de Métricas (Horizontal - Full Width) */
.metrics-grid {
  display: flex;
  flex-direction: row;
  gap: 20px;
  margin-bottom: 32px;
  flex-wrap: wrap;
  width: 100%;
}

.metric-card {
  flex: 1; /* Faz os cards se esticarem para ocupar todo o espaço lateral */
  min-width: 280px; /* Largura mínima para manter legibilidade */
  background: white;
  padding: 24px;
  border-radius: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
}

.metric-info .label {
  display: block;
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
}

.metric-info .value {
  font-size: 1.75rem; /* Um pouco maior para preencher melhor o espaço */
  font-weight: 800;
  color: #0f172a;
  margin-top: 4px;
}

.metric-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.card-success .value { color: #16a34a; }
.card-success .metric-icon { background: #dcfce7; color: #16a34a; }
.card-warning .value { color: #ca8a04; }
.card-warning .metric-icon { background: #fef9c3; color: #ca8a04; }
.card-danger .value { color: #dc2626; }
.card-danger .metric-icon { background: #fee2e2; color: #dc2626; }

/* Filtro e Tabela */
.data-section {
  background: white;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  width: 100%;
  box-sizing: border-box;
}

.search-box {
  margin-bottom: 24px;
  max-width: 400px;
  position: relative; /* Container para a lupa absoluta */
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.9rem;
  line-height: 1;
  pointer-events: none; /* Lupa não intercepta cliques */
}

.search-box input {
  width: 100%;
  padding: 12px 16px 12px 42px; /* Padding esquerdo para não sobrepor a lupa */
  border-radius: 10px;
  border: 1px solid #cbd5e1;
  background-color: #f8fafc;
  font-size: 0.9rem;
  color: #1e293b;
  box-sizing: border-box;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.search-box input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  background-color: white;
}

.table-responsive {
  width: 100%;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  text-align: left;
  padding: 16px;
  background: #f8fafc;
  color: #475569;
  font-size: 0.85rem;
  font-weight: 700;
}

td {
  padding: 16px;
  border-top: 1px solid #f1f5f9;
  font-size: 0.9rem;
  color: #334155; /* Texto escuro e legível em todas as colunas */
}

.row-warning { background-color: #fff1f2; }

tr {
  transition: background-color 0.4s ease;
}

.aluno-cell {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  color: #1e293b; /* Cor escura e legível para o nome do aluno */
}

.avatar-small {
  width: 32px;
  height: 32px;
  min-width: 32px;
  background-color: #dbeafe;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 700;
  color: #1e40af;
}

/* Badges e Botões */
.badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
}

.badge-pago { background: #dcfce7; color: #16a34a; }
.badge-pendente { background: #fef9c3; color: #ca8a04; }
.badge-vencido { background: #fee2e2; color: #dc2626; }
.badge-sem_registro { background: #f1f5f9; color: #94a3b8; }

.btn-register {
  background-color: #16a34a;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
}

.btn-register:hover { background-color: #15803d; }

.empty-state {
  padding: 48px 16px;
  color: #94a3b8;
  font-style: italic;
  font-size: 0.95rem;
}

.error-state {
  color: #dc2626;
  font-style: normal;
  font-weight: 500;
}

.text-center { text-align: center; }
.text-muted { color: #94a3b8; }

/* ─── Toast de Notificação Premium ──────────────────────────────────── */
.toast-notification {
  position: fixed;
  top: 28px;
  right: 32px;
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 22px;
  border-radius: 14px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.08);
  font-size: 0.95rem;
  font-weight: 600;
  min-width: 280px;
  max-width: 420px;
  pointer-events: none;
}

.toast-success {
  background: linear-gradient(135deg, #059669, #047857);
  color: white;
  border-left: 4px solid #34d399;
}

.toast-error {
  background: linear-gradient(135deg, #dc2626, #b91c1c);
  color: white;
  border-left: 4px solid #fca5a5;
}

.toast-icon {
  width: 28px;
  height: 28px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  flex-shrink: 0;
}

.toast-mensagem {
  line-height: 1.4;
}

/* Animação do Vue <Transition name="toast"> */
.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.35s ease, transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(40px) scale(0.92);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(40px) scale(0.92);
}
</style>
