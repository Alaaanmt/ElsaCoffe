<script setup lang="ts">
import { onMounted } from 'vue'
import { useTheme } from '@/composables/useTheme'
import SiteHeader from '@/components/layout/SiteHeader.vue'
import FloatingWhatsApp from '@/components/layout/FloatingWhatsapp.vue'
import SiteFooter from './components/layout/SiteFooter.vue'

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
    <FloatingWhatsApp />
  </div>
</template>