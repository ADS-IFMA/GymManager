<script setup>
import { ref } from "vue";

const alunosExemplo = ref([
  { id: 1, nome: "João Silva", email: "joao@example.com", status: "Ativo" },
  { id: 2, nome: "Maria Santos", email: "maria@example.com", status: "Ativo" },
  { id: 3, nome: "Pedro Costa", email: "pedro@example.com", status: "Inativo" },
]);
</script>

<template>
  <div class="alunos-container">
    <header class="alunos-header">
      <h1>Alunos</h1>
      <router-link to="/dashboard" class="btn-voltar">← Voltar</router-link>
    </header>

    <main class="alunos-main">
      <table class="alunos-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>E-mail</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="aluno in alunosExemplo" :key="aluno.id">
            <td>{{ aluno.id }}</td>
            <td>{{ aluno.nome }}</td>
            <td>{{ aluno.email }}</td>
            <td>
              <span :class="['status', aluno.status.toLowerCase()]">
                {{ aluno.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </main>
  </div>
</template>

<style scoped>
.alunos-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  padding: 32px 16px;
}

.alunos-header {
  max-width: 1200px;
  margin: 0 auto 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.alunos-header h1 {
  font-size: 2rem;
  color: #1f2937;
}

.btn-voltar {
  padding: 10px 16px;
  background: #6b7280;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  transition: background 0.3s ease;
  font-weight: 600;
}

.btn-voltar:hover {
  background: #4b5563;
}

.alunos-main {
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
}

.alunos-table {
  width: 100%;
  border-collapse: collapse;
}

.alunos-table thead {
  background: #f3f4f6;
  border-bottom: 2px solid #e5e7eb;
}

.alunos-table th {
  padding: 12px;
  text-align: left;
  font-weight: 600;
  color: #374151;
}

.alunos-table td {
  padding: 12px;
  border-bottom: 1px solid #e5e7eb;
}

.alunos-table tbody tr:hover {
  background: #f9fafb;
}

.status {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
}

.status.ativo {
  background: #dcfce7;
  color: #166534;
}

.status.inativo {
  background: #fee2e2;
  color: #991b1b;
}

@media (max-width: 768px) {
  .alunos-header {
    flex-direction: column;
    gap: 12px;
  }

  .alunos-main {
    padding: 16px;
  }

  .alunos-table th,
  .alunos-table td {
    padding: 8px;
    font-size: 0.9rem;
  }
}
</style>
