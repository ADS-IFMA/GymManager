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
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

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
  }
}
</style>
