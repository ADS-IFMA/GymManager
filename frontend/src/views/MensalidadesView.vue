<template>
  <div class="mensalidades-container">
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

    <main class="content">
      <h2>Mensalidades</h2>
      <p>Gerenciamento de mensalidades em desenvolvimento...</p>
    </main>
  </div>
</template>

<script>
import authService from '../services/authService.js';

export default {
  name: 'MensalidadesView',
  methods: {
    handleLogout() {
      authService.logout();
      this.$router.push('/login');
    }
  },
  mounted() {
    if (!authService.isAuthenticated()) {
      this.$router.push('/login');
    }
  }
};
</script>

<style scoped>
.mensalidades-container {
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

.content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.content h2 {
  color: #333;
  margin-bottom: 20px;
}

.content p {
  color: #666;
}
</style>
