<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getUsuario, logout } from "../services/authService.js";

const router = useRouter();
const usuario = ref(null);

onMounted(() => {
  const usuarioData = getUsuario();
  if (usuarioData) {
    usuario.value = usuarioData;
  }
});

const handleLogout = () => {
  logout();
  router.push("/login");
};
</script>

<template>
  <div class="dashboard-container">
    <nav class="navbar">
      <div class="navbar-content">
        <h2 class="logo">GymManager</h2>
        <div class="user-section">
          <span v-if="usuario" class="user-name">{{ usuario.nome }}</span>
          <button @click="handleLogout" class="btn-logout">Sair</button>
        </div>
      </div>
    </nav>

    <main class="dashboard-main">
      <section class="welcome-section">
        <h1>Bem-vindo ao Dashboard</h1>
        <p v-if="usuario">
          Olá, <strong>{{ usuario.nome }}</strong
          >! Bem-vindo ao GymManager.
        </p>

        <div class="dashboard-grid">
          <router-link to="/alunos" class="dashboard-card">
            <div class="card-icon">👥</div>
            <h3>Alunos</h3>
            <p>Gerenciar alunos e cadastros</p>
          </router-link>

          <router-link to="/profissionais" class="dashboard-card">
            <div class="card-icon">💼</div>
            <h3>Profissionais</h3>
            <p>Gerenciar profissionais da academia</p>
          </router-link>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
}

.navbar {
  background: linear-gradient(135deg, #0c4a6e 0%, #1e3a8a 100%);
  padding: 16px 32px;
  color: #f8fafc;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.1);
}

.navbar-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: #60a5fa;
}

.user-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-name {
  font-size: 0.95rem;
}

.btn-logout {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  background: #ef4444;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;
}

.btn-logout:hover {
  background: #dc2626;
}

.dashboard-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 16px;
}

.welcome-section {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.welcome-section h1 {
  margin-bottom: 8px;
  color: #1f2937;
  font-size: 2rem;
}

.welcome-section > p {
  margin-bottom: 32px;
  color: #6b7280;
  font-size: 1.05rem;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 24px;
}

.dashboard-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  border-radius: 12px;
  color: white;
  text-decoration: none;
  cursor: pointer;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
}

.dashboard-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.3);
}

.card-icon {
  font-size: 3rem;
  margin-bottom: 12px;
}

.dashboard-card h3 {
  margin-bottom: 8px;
  font-size: 1.25rem;
  font-weight: 700;
}

.dashboard-card p {
  text-align: center;
  font-size: 0.9rem;
  opacity: 0.9;
}

@media (max-width: 768px) {
  .navbar-content {
    flex-direction: column;
    gap: 12px;
  }

  .welcome-section {
    padding: 20px;
  }

  .welcome-section h1 {
    font-size: 1.5rem;
  }
}
</style>
