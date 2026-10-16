import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import TortasView from '@/views/TortasView.vue'
import CheckoutView from '@/views/CheckoutView.vue'
import PaymentView from '@/views/PaymentView.vue'
import LoginView from '@/views/LoginView.vue'
import AdminOrders from '@/views/AdminOrders.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
        path: '/tortas',
        name: 'tortas',
        component: TortasView,
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: CheckoutView
    },
    {
      path: '/checkout/payment',
      name: 'checkout-payment',
      component: PaymentView
    },
    {
      path: '/admin/login',
      name: 'admin-login',
      component: LoginView
    },
    {
      path: '/admin/pedidos',
      name: 'admin-pedidos',
      component: AdminOrders,
      meta: { requiresAuth: true }
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ],
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0, behavior: 'smooth' }
    }
  },
  
})

// GUARD
router.beforeEach((to, _from, next) => {
  const requiereAutenticacion = to.matched.some(record => record.meta.requiresAuth)
  const token = localStorage.getItem('elsa_admin_token')

  if (requiereAutenticacion && !token) {
    next({ name: 'admin-login' })
  } else if (to.name === 'admin-login' && token) {
    next({ name: 'admin-pedidos' })
  } else {
    next()
  }
})

export default router