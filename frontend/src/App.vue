<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useTheme } from '@/composables/useTheme'
import SiteHeader from '@/components/layout/SiteHeader.vue'
import FloatingWhatsApp from '@/components/layout/FloatingWhatsapp.vue'
import SiteFooter from '@/components/layout/SiteFooter.vue'
import CartToast from '@/components/cart/CartToast.vue'
import CartDrawer from '@/components/cart/CartDrawer.vue'

const route = useRoute()
const { iniciarTema } = useTheme()

// Ocultar footer y whatsapp
const esVistaCheckout = computed(() => {
  return route.path.startsWith('/checkout')
})

onMounted(() => {
  iniciarTema()
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-fondo text-tinta font-cuerpo antialiased selection:bg-acento selection:text-tinta transition-colors duration-500">
    <SiteHeader/>
    
    <main class="flex-grow">
      <router-view />
    </main>

    <SiteFooter v-if="!esVistaCheckout" />
    
    <CartToast />
    <CartDrawer />
    
    <FloatingWhatsApp v-if="!esVistaCheckout" />
  </div>
</template>