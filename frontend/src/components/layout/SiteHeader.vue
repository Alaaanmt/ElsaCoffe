<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BrandLogo from './BrandLogo.vue'
import ThemeToggle from './ThemeToggle.vue'
import AuthorButton from '@/components/ui/AuthorButton.vue'
import { useCart } from '@/composables/useCart'
import { PhShoppingCart } from '@phosphor-icons/vue'

const router = useRouter()
const route = useRoute()
const scrolled = ref(false)

const { isCartOpen, totalItems, formattedTotalPrice } = useCart()

const handleScroll = () => {
  if (route.path !== '/') {
    scrolled.value = true
    return
  }

  if (window.scrollY > 40) {
    scrolled.value = true
  } else {
    scrolled.value = false
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  handleScroll()
})

watch(() => route.path, () => {
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const scrollToSection = async (id: string) => {
  if (route.path !== '/') {
    await router.push('/')
    setTimeout(() => {
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
        handleScroll()
      }
    }, 300)
    return
  }

  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
    history.replaceState(null, '', '#' + id)
  }
}
</script>

<template>
  <header class="fixed inset-x-0 top-0 z-50 transition-all duration-300" :class="[
    scrolled
      ? 'bg-fondo/90 backdrop-blur-md border-b border-borde-suave shadow-sm py-3'
      : 'bg-gradient-to-b from-black/60 to-transparent py-5'
  ]">
    <div class="mx-auto flex max-w-7xl  items-center justify-between px-5 sm:px-8">
      <BrandLogo :variant="scrolled ? 'normal' : 'sobre-hero'" />

      <nav class="hidden md:flex items-center gap-8">
        <button @click="scrollToSection('historia')"
          class="text-xl font-medium tracking-wide transition-colors hover:text-acento cursor-pointer"
          :class="scrolled ? 'text-tinta' : 'text-white drop-shadow-sm'">
          Historia
        </button>
        <button @click="scrollToSection('carta')"
          class="text-xl font-medium tracking-wide transition-colors hover:text-acento cursor-pointer"
          :class="scrolled ? 'text-tinta' : 'text-white drop-shadow-sm'">
          Carta
        </button>
        <button @click="scrollToSection('visitanos')"
          class="text-xl font-medium tracking-wide transition-colors hover:text-acento cursor-pointer"
          :class="scrolled ? 'text-tinta' : 'text-white drop-shadow-sm'">
          Visítanos
        </button>
        <router-link to="/tortas"
          class="text-xl font-medium tracking-wide transition-colors hover:text-acento cursor-pointer"
          :class="scrolled ? 'text-tinta' : 'text-white drop-shadow-sm'">
          Tortas
        </router-link>
        <button @click="isCartOpen = true"
          class="relative flex items-center gap-2 px-3.5 py-2 rounded-full bg-superficie border border-borde-suave hover:border-borde-control transition-all cursor-pointer group">
          <div class="relative text-tinta">
            <PhShoppingCart :size="20" weight="fill" />
            <span v-if="totalItems > 0"
              class="absolute -top-2 -right-2.5 size-5 rounded-full bg-verde-marca text-crema text-[10px] font-bold flex items-center justify-center shadow-sm">
              {{ totalItems }}
            </span>
          </div>
          <span class="font-mono text-xs font-semibold text-tinta hidden sm:inline">
            {{ formattedTotalPrice }}
          </span>
        </button>
      </nav>

      <div class="flex items-center gap-3">
        <!-- Botones rápidos en versión Mobile (< md) -->
        <div class="flex md:hidden items-center gap-2">

          <router-link to="/tortas">
            <AuthorButton variant="pestana" :active="route.path === '/tortas'">
              Tortas
            </AuthorButton>
          </router-link>

          <button @click="isCartOpen = true" class="relative flex items-center p-2.5 rounded-full bg-superficie border border-borde-suave hover:border-borde-control transition-all cursor-pointer group">
            <div class="relative text-tinta flex items-center justify-center">
              <PhShoppingCart :size="18" weight="fill" />
              <span v-if="totalItems > 0" class="absolute -top-2 -right-2.5 size-4 rounded-full bg-verde-marca text-crema text-[9px] font-bold flex items-center justify-center shadow-sm">{{ totalItems }}</span>
            </div>
          </button>
        </div>
        <ThemeToggle />
      </div>
    </div>
  </header>
</template>