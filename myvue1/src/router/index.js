import { createRouter, createWebHistory } from 'vue-router'
import BoardDetail from '@/pages/BoardDetail.vue';
import CreateBoard from '@/pages/CreateBoard.vue';
import RegisterForm from '@/pages/RegisterForm.vue';
import LoginForm from '@/pages/LoginForm.vue';
import BoardList from '@/pages/BoardList.vue';

const routes = [

  { path: "/", name: 'Login', component: LoginForm },
  { path: "/create", component: CreateBoard },
  { path: "/boards", component: BoardList },
  { path: "/boards/:id", component: BoardDetail },
  { path: "/register", name: 'Register', component: RegisterForm }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router
