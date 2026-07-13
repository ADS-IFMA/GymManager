import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
import DashboardView from "../views/DashboardView.vue";
import AlunosView from "../views/AlunosView.vue";
import ProfissionalCadastroView from "../views/ProfissionalCadastroView.vue";
import MensalidadeView from "../views/MensalidadeView.vue";

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
    meta: { requiresAuth: false },
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: DashboardView,
    meta: { requiresAuth: true },
  },
  {
    path: "/alunos",
    name: "alunos",
    component: AlunosView,
    meta: { requiresAuth: true },
  },
  {
    path: "/mensalidades",
    name: "mensalidades",
    component: MensalidadeView,
    meta: { requiresAuth: true },
  },
  {
    path: "/profissionais/cadastro",
    name: "profissional-cadastro",
    component: ProfissionalCadastroView,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Guard de autenticação
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  const usuario = localStorage.getItem("usuario");

  if (to.meta.requiresAuth) {
    if (token && usuario) {
      next();
    } else {
      next("/login");
    }
  } else if (to.path === "/login" && token && usuario) {
    next("/dashboard");
  } else {
    next();
  }
});

export default router;
