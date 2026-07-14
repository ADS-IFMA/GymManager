import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import DashboardView from '../views/DashboardView.vue';

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { requiresAuth: false }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
    meta: { requiresAuth: true }
  },
  {
    path: '/alunos',
    name: 'Alunos',
    component: () => import('../views/AlunoCadastro.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/profissionais',
    name: 'Profissionais',
    component: () => import('../views/ProfissionalCadastroView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/mensalidades',
    name: 'Mensalidades',
    component: () => import('../views/MensalidadesView.vue'),
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation Guard - Proteger rotas autenticadas
router.beforeEach((to, from) => {
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;

  if (to.meta.requiresAuth && !isAuthenticated) {
    // Se a rota requer autenticação e não há token, redireciona para login
    return '/login';
  } else if (to.path === '/login' && isAuthenticated) {
    // Se está tentando acessar login e já está autenticado, redireciona para dashboard
    return '/dashboard';
  }
  // Caso contrário, permite o acesso
});

export default router;
