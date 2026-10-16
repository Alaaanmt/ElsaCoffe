import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import TortasView from '@/views/TortasView.vue'
import CheckoutView from '@/views/CheckoutView.vue'
import PaymentView from '@/views/PaymentView.vue'
import LoginView from '@/views/LoginView.vue'
import AdminOrders from '@/views/AdminOrders.vue'
import { useCart } from '@/composables/useCart'
import { useCheckout } from '@/composables/useCheckout'
import { validarNombreApellido, validarEmail, limpiarYValidarTelefono } from '@/utils/validators'

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
      component: CheckoutView,
      meta: { requiresCart: true }
    },
    {
      path: '/checkout/payment',
      name: 'checkout-payment',
      component: PaymentView,
      meta: { requiresCart: true, requiresCheckoutComplete: true }
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
  const token = localStorage.getItem('elsa_admin_token')

  // Vista Admin
  if (to.matched.some(record => record.meta.requiresAuth) && !token) {
    return next({ name: 'admin-login' })
  }
  if (to.name === 'admin-login' && token) {
    return next({ name: 'admin-pedidos' })
  }

  // Carrito No Vacío
  if (to.matched.some(record => record.meta.requiresCart)) {
    const { cartItems } = useCart()
    if (!cartItems.value || cartItems.value.length === 0) {
      return next({ name: 'tortas' })
    }
  }

  // Ir al pago 
  if (to.matched.some(record => record.meta.requiresCheckoutComplete)) {
    const { datosCliente } = useCheckout()

    const nombreValido = validarNombreApellido(datosCliente.nombre, datosCliente.apellido)
    const emailValido = validarEmail(datosCliente.email)
    const telefonoValido = limpiarYValidarTelefono(datosCliente.telefono)

    if (!nombreValido || !emailValido || !telefonoValido) {
      return next({ name: 'checkout' })
    }
  }

  next()
})
export default router