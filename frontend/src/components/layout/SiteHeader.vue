<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BrandLogo from './BrandLogo.vue'
import ThemeToggle from './ThemeToggle.vue'
import AuthorButton from '@/components/ui/AuthorButton.vue'

const router = useRouter()
const route = useRoute()
const scrolled = ref(false)

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
  <header
    class="fixed inset-x-0 top-0 z-50 transition-all duration-300"
    :class="[
      scrolled 
        ? 'bg-fondo/90 backdrop-blur-md border-b border-borde-suave shadow-sm py-3' 
        : 'bg-gradient-to-b from-black/60 to-transparent py-5'
    ]"
  >
    <div class="mx-auto flex max-w-7xl  items-center justify-between px-5 sm:px-8">
      <BrandLogo :variant="scrolled ? 'normal' : 'sobre-hero'" />

      <nav class="hidden md:flex items-center gap-8">
        <button 
          @click="scrollToSection('historia')" 
          class="text-xl font-medium tracking-wide transition-colors hover:text-acento cursor-pointer" 
          :class="scrolled ? 'text-tinta' : 'text-white drop-shadow-sm'"
        >
          Historia
        </button>
        <button 
          @click="scrollToSection('carta')" 
          class="text-xl font-medium tracking-wide transition-colors hover:text-acento cursor-pointer" 
          :class="scrolled ? 'text-tinta' : 'text-white drop-shadow-sm'"
        >
          Carta
        </button>
        <button 
          @click="scrollToSection('visitanos')" 
          class="text-xl font-medium tracking-wide transition-colors hover:text-acento cursor-pointer" 
          :class="scrolled ? 'text-tinta' : 'text-white drop-shadow-sm'"
        >
          Visítanos
        </button>
        <router-link 
          to="/tortas"
          class="text-xl font-medium tracking-wide transition-colors hover:text-acento cursor-pointer"
          :class="scrolled ? 'text-tinta' : 'text-white drop-shadow-sm'"
        >
          Tortas
        </router-link>
      </nav>

      <div class="flex items-center gap-3">
        <!-- Botones rápidos en versión Mobile (< md) -->
        <div class="flex md:hidden items-center gap-2">
          <AuthorButton variant="pestana" @click="scrollToSection('carta')" :active="false">
            Carta
          </AuthorButton>
          
          <router-link to="/tortas">
            <AuthorButton variant="pestana" :active="route.path === '/tortas'">
              Tortas
            </AuthorButton>
          </router-link>
        </div>
        <ThemeToggle />
      </div>
    </div>
  </header>
</template>