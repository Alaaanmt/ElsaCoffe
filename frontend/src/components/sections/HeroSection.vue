<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import AuthorButton from '@/components/ui/AuthorButton.vue'


const prefiereMovimientoReducido = ref(false)

onMounted(() => {
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  prefiereMovimientoReducido.value = mediaQuery.matches
  
  const handleMotionChange = (e: MediaQueryListEvent) => {
    prefiereMovimientoReducido.value = e.matches
  }
  mediaQuery.addEventListener('change', handleMotionChange)

  onUnmounted(() => {
    mediaQuery.removeEventListener('change', handleMotionChange)
  })
})


const scrollToSection = (id: string) => {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
    history.replaceState(null, '', '#' + id)
  }
}
</script>

<template>
  <section id="inicio" class="relative min-h-[100dvh]  z-30 flex items-end overflow-hidden pb-20 pt-28 sm:pb-48">
    <!-- Capa de Fondo (Video) -->
    <div class="absolute inset-0 -z-10 bg-[#0e1c10]">
      <video
        v-if="!prefiereMovimientoReducido"
        ref="videoRef"
        autoplay
        muted
        loop
        playsinline
        preload="auto"
        aria-hidden="true"
        class="absolute inset-0 h-full w-full object-cover opacity-90 transition-opacity duration-1000"
      >
        <source src="/media/video-landing.mp4" type="video/mp4" />
      </video>

      <!-- Overlay oscuro translúcido para contraste de WCAG AA -->
      <div class="absolute inset-0 bg-gradient-to-t from-[#0e1c10]/90 via-[#0e1c10]/50 to-[#0e1c10]/30 pointer-events-none" />
    </div>

    <!-- Contenido del Hero -->
    <div class="mx-auto w-full max-w-7xl px-5 sm:px-8 relative z-10">
      <div class="max-w-2xl">
        <h1 class="font-titulo text-4xl sm:text-5xl lg:text-6xl font-semibold text-white tracking-tight leading-[1.05] mb-4 drop-shadow-md">
          Un rincón tranquilo para tu café de cada día.
        </h1>
        <p class="font-cuerpo text-base sm:text-lg text-crema/90 leading-relaxed max-w-xl mb-8 drop-shadow">
          Panadería y pastelería 100% artesanales, de elaboración propia. Almuerzo y opciones sin TACC.
        </p>

        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <AuthorButton variant="sobre-video" @click="scrollToSection('carta')">
            Ver la carta
          </AuthorButton>
          <AuthorButton variant="secundario" class="text-white border-white/60 hover:bg-white hover:text-verde-marca" @click="scrollToSection('visitanos')">
            Dónde estamos
          </AuthorButton>
        </div>
      </div>
    </div>
  </section>
</template>