import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import TicketsView from '../views/TicketsMainPage/TicketsView.vue'
import RegisterView from '../views/RegisterView.vue'
import ExpensesView from '@/views/TicketsMainPage/ExpensesView.vue'
import ViewTicket from '@/views/TicketsMainPage/ViewTicket.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: LoginView,
    },
    {
      path: '/register',
      name: 'register',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component:RegisterView,
    },
    {
      path: '/mainPage',
      name: 'mainPage',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: TicketsView,
    },
    {
      path: '/expenses/:ticketID',
      name: 'expenses',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: ExpensesView,
    },
    {
      path: '/viewTicket/:ticketID',
      name: 'viewTicket',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: ViewTicket,
    },
  ],
})

export default router
