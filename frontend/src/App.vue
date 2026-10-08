<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useTheme } from '@/composables/useTheme'
import SiteHeader from '@/components/layout/SiteHeader.vue'
import FloatingWhatsApp from '@/components/layout/FloatingWhatsapp.vue'
import SiteFooter from '@/components/layout/SiteFooter.vue'
import CartToast from '@/components/cart/CartToast.vue'
import CartDrawer from '@/components/cart/CartDrawer.vue'
import CheckoutModal from './components/cart/CheckoutModal.vue'

const checkoutModalRef = ref<InstanceType<typeof CheckoutModal> | null>(null)

const abrirCheckout = () => {
  checkoutModalRef.value?.abrirModalCheckout()
}
const { iniciarTema } = useTheme()

onMounted(() => {
  iniciarTema()
})
</script>

<template>
  <div
    class="min-h-screen flex flex-col bg-fondo text-tinta font-cuerpo antialiased selection:bg-acento selection:text-tinta transition-colors duration-500">
    <SiteHeader />

    <main class="flex-grow">
      <!-- Aquí se renderiza dinámicamente HomeView o TortasView según la URL -->
      <router-view />
    </main>
    <SiteFooter />
    <CartToast />
    <CartDrawer @iniciar-checkout="abrirCheckout" />
    <CheckoutModal ref="checkoutModalRef" />
    <FloatingWhatsApp />
  </div>
</template>