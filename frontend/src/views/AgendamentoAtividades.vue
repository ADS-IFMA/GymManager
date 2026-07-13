<script setup>
import { ref, onMounted } from 'vue';
import {
  listarAtividades,
  listarInscritos,
  inscreverAtividade,
  cancelarInscricao,
} from '../services/atividadeService.js';

const atividades = ref([]);
const carregando = ref(false);
const erro = ref('');
const mensagem = ref('');
const atividadesExpandidas = ref(new Set());
const inscritosPorAtividade = ref({});
const idAlunoLogado = ref(3); // ID do Aluno 1 (use 3, 4 ou 5 para testar)

const formatarData = (dataStr) => {
  const data = new Date(dataStr);
  return data.toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const carregarAtividades = async () => {
  erro.value = '';
  mensagem.value = '';
  carregando.value = true;

  try {
    const dados = await listarAtividades();
    atividades.value = dados;
  } catch (err) {
    erro.value = 'Erro ao carregar atividades: ' + err.message;
    atividades.value = [];
  } finally {
    carregando.value = false;
  }
};

const toggleExpandida = async (id) => {
  if (atividadesExpandidas.value.has(id)) {
    atividadesExpandidas.value.delete(id);
  } else {
    atividadesExpandidas.value.add(id);
    if (!inscritosPorAtividade.value[id]) {
      await carregarInscritos(id);
    }
  }
};

const carregarInscritos = async (id) => {
  try {
    const dados = await listarInscritos(id);
    inscritosPorAtividade.value[id] = dados;
  } catch (err) {
    console.error('Erro ao carregar inscritos:', err.message);
  }
};

const estaInscrito = (atividadeId) => {
  const inscritos = inscritosPorAtividade.value[atividadeId];
  if (!inscritos) return false;
  return inscritos.inscritos.some(i => i.id_aluno === idAlunoLogado.value);
};

const handleInscrever = async (atividadeId) => {
  erro.value = '';
  mensagem.value = '';

  try {
    await inscreverAtividade(atividadeId, idAlunoLogado.value);
    mensagem.value = 'Inscrição realizada com sucesso!';

    await carregarAtividades();
    if (atividadesExpandidas.value.has(atividadeId)) {
      await carregarInscritos(atividadeId);
    }
  } catch (err) {
    erro.value = 'Erro ao inscrever: ' + err.message;
  }
};

const handleCancelarInscricao = async (atividadeId) => {
  erro.value = '';
  mensagem.value = '';

  try {
    await cancelarInscricao(atividadeId, idAlunoLogado.value);
    mensagem.value = 'Inscrição cancelada com sucesso!';

    await carregarAtividades();
    if (atividadesExpandidas.value.has(atividadeId)) {
      await carregarInscritos(atividadeId);
    }
  } catch (err) {
    erro.value = 'Erro ao cancelar inscrição: ' + err.message;
  }
};

onMounted(() => {
  carregarAtividades();
});
</script>

<template>
  <main class="app-container">
    <section class="card-container">
      <div class="header">
        <h1>Agendamento de Atividades</h1>
        <p>Consulte e inscreva-se nas atividades disponíveis</p>
      </div>

      <div v-if="carregando" class="loading">
        Carregando atividades...
      </div>

      <p class="success-message" v-if="mensagem">{{ mensagem }}</p>
      <p class="error-message" v-if="erro">{{ erro }}</p>

      <div v-if="!carregando && atividades.length === 0" class="empty-state">
        <p>Nenhuma atividade disponível no momento.</p>
      </div>

      <div class="aluno-selector" v-if="!carregando && atividades.length > 0">
        <label>
          Aluno Logado:
          <select v-model.number="idAlunoLogado">
            <option value="3">Aluno 1 (ID: 3)</option>
            <option value="4">Aluno 2 (ID: 4)</option>
            <option value="5">Aluno 3 (ID: 5)</option>
          </select>
        </label>
      </div>

      <div v-if="!carregando && atividades.length > 0" class="atividades-grid">
        <article
          v-for="atividade in atividades"
          :key="atividade.id"
          class="atividade-card"
        >
          <div class="card-header">
            <h2>{{ atividade.nome }}</h2>
            <span class="vagas-badge"
              >{{ atividade.vagas_disponiveis }}/{{ atividade.limite_vagas }}</span
            >
          </div>

          <p class="descricao">{{ atividade.descricao }}</p>

          <div class="info-row">
            <span class="label">Data e Hora:</span>
            <span class="value">{{ formatarData(atividade.data_hora) }}</span>
          </div>

          <div class="info-row">
            <span class="label">Vagas Disponíveis:</span>
            <span class="value">{{ atividade.vagas_disponiveis }}</span>
          </div>

          <div class="actions">
            <button
              v-if="!estaInscrito(atividade.id)"
              :disabled="atividade.vagas_disponiveis === 0"
              class="btn btn-primary"
              @click="handleInscrever(atividade.id)"
            >
              Inscrever-se
            </button>

            <button
              v-else
              class="btn btn-danger"
              @click="handleCancelarInscricao(atividade.id)"
            >
              Cancelar Inscrição
            </button>

            <button
              class="btn btn-secondary"
              @click="toggleExpandida(atividade.id)"
            >
              {{
                atividadesExpandidas.has(atividade.id)
                  ? 'Fechar'
                  : 'Ver Inscritos'
              }}
            </button>
          </div>

          <div
            v-if="atividadesExpandidas.has(atividade.id)"
            class="inscritos-section"
          >
            <h3>Inscritos ({{ inscritosPorAtividade[atividade.id]?.total_inscritos || 0 }})</h3>
            <ul
              v-if="
                inscritosPorAtividade[atividade.id]?.inscritos &&
                inscritosPorAtividade[atividade.id].inscritos.length > 0
              "
              class="inscritos-list"
            >
              <li
                v-for="inscrito in inscritosPorAtividade[atividade.id]
                  .inscritos"
                :key="inscrito.id"
              >
                <span class="nome">{{ inscrito.aluno_nome }}</span>
                <span class="email">{{ inscrito.aluno_email }}</span>
              </li>
            </ul>
            <p v-else class="empty-inscritos">Nenhum aluno inscrito ainda.</p>
          </div>
        </article>
      </div>
    </section>
  </main>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #0c4a6e 0%, #1e3a8a 100%);
  color: #f8fafc;
  padding: 32px 16px;
}

.card-container {
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  text-align: center;
  margin-bottom: 40px;
}

.header h1 {
  font-size: 2.5rem;
  margin-bottom: 12px;
  font-weight: 700;
}

.header p {
  font-size: 1.1rem;
  opacity: 0.9;
}

.loading {
  text-align: center;
  padding: 40px;
  font-size: 1.1rem;
  background: rgba(15, 23, 42, 0.95);
  border-radius: 24px;
  margin-bottom: 20px;
}

.success-message {
  background: rgba(34, 197, 94, 0.15);
  color: #22c55e;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 20px;
  border-left: 4px solid #22c55e;
}

.error-message {
  background: rgba(248, 113, 113, 0.15);
  color: #f87171;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 20px;
  border-left: 4px solid #f87171;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: rgba(15, 23, 42, 0.95);
  border-radius: 24px;
  font-size: 1.1rem;
  opacity: 0.8;
}

.aluno-selector {
  background: rgba(15, 23, 42, 0.95);
  border-radius: 24px;
  padding: 20px;
  margin-bottom: 24px;
  border: 1px solid rgba(37, 99, 235, 0.3);
}

.aluno-selector label {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 600;
  color: #f8fafc;
}

.aluno-selector select {
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid rgba(148, 163, 184, 0.35);
  background: #0f172a;
  color: #f8fafc;
  cursor: pointer;
  font-size: 0.95rem;
}

.atividades-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 24px;
}

.atividade-card {
  background: rgba(15, 23, 42, 0.95);
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.45);
  border: 1px solid rgba(148, 163, 184, 0.15);
  transition: transform 0.2s, box-shadow 0.2s;
}

.atividade-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 25px 70px rgba(15, 23, 42, 0.6);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.card-header h2 {
  font-size: 1.4rem;
  margin: 0;
  flex: 1;
}

.vagas-badge {
  background: #2563eb;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  white-space: nowrap;
}

.descricao {
  color: rgba(248, 250, 252, 0.85);
  margin: 0 0 16px 0;
  line-height: 1.5;
  font-size: 0.95rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.15);
  font-size: 0.95rem;
}

.info-row:last-of-type {
  margin-bottom: 20px;
}

.label {
  color: rgba(248, 250, 252, 0.65);
  font-weight: 500;
}

.value {
  color: #f8fafc;
  font-weight: 600;
}

.actions {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.btn {
  flex: 1;
  min-width: 120px;
  padding: 12px 16px;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.btn-primary {
  background: #2563eb;
  color: #f8fafc;
}

.btn-primary:hover:not(:disabled) {
  background: #1d4ed8;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-danger {
  background: #ef4444;
  color: #f8fafc;
}

.btn-danger:hover {
  background: #dc2626;
}

.btn-secondary {
  background: rgba(148, 163, 184, 0.2);
  color: #f8fafc;
  border: 1px solid rgba(148, 163, 184, 0.3);
}

.btn-secondary:hover {
  background: rgba(148, 163, 184, 0.3);
}

.inscritos-section {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid rgba(148, 163, 184, 0.15);
}

.inscritos-section h3 {
  font-size: 1.1rem;
  margin: 0 0 12px 0;
  color: #2563eb;
}

.inscritos-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.inscritos-list li {
  padding: 12px;
  background: rgba(37, 99, 235, 0.1);
  border-radius: 8px;
  border-left: 3px solid #2563eb;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.inscritos-list .nome {
  color: #f8fafc;
  font-weight: 600;
}

.inscritos-list .email {
  color: rgba(248, 250, 252, 0.65);
  font-size: 0.85rem;
}

.empty-inscritos {
  color: rgba(248, 250, 252, 0.65);
  font-size: 0.95rem;
  margin: 0;
  padding: 12px;
  text-align: center;
}

@media (max-width: 768px) {
  .app-container {
    padding: 20px 12px;
  }

  .header h1 {
    font-size: 1.8rem;
  }

  .atividades-grid {
    grid-template-columns: 1fr;
  }

  .actions {
    flex-direction: column;
  }

  .btn {
    min-width: auto;
    width: 100%;
  }
}
</style>
