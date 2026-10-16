<!-- src/components/layout/Footer.vue -->
<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { PhInstagramLogo, PhWhatsappLogo, PhHeart } from '@phosphor-icons/vue'
import { negocio } from '@/data/business'

const router = useRouter()
const route = useRoute()

const scrollToSection = async (id: string) => {
  if (route.path !== '/') {
    await router.push('/')
    setTimeout(() => {
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
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
  <footer class="bg-superficie border-t border-borde-suave text-tinta transition-colors duration-500">
    <div class="mx-auto max-w-7xl px-5 sm:px-8 py-12 md:py-16">
      
      <!-- Contenido Principal -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 pb-10 md:pb-12 border-b border-borde-suave text-center md:text-left">
        
        <!-- Columna 1: Marca y Bajada -->
        <div class="md:col-span-5 space-y-4 flex flex-col items-center md:items-start">
          <span class="font-titulo text-3xl font-bold tracking-tight text-tinta">ELSA</span>
          <p class="font-cuerpo text-sm text-tinta-suave max-w-sm leading-relaxed">
            Un espacio tranquilo en Mataderos donde podés disfrutar de café de especialidad, almuerzos y pastelería 100% artesanal de elaboración propia.
          </p>
        </div>

        <!-- Columna 2: Navegación Principal (Grilla de 2 columnas en Mobile para optimizar espacio) -->
        <div class="md:col-span-4 space-y-4">
          <h4 class="font-titulo text-xs uppercase tracking-[0.2em] font-semibold text-verde-marca dark:text-acento">
            Navegación
          </h4>
          <ul class="grid grid-cols-2 md:grid-cols-1 gap-2.5 text-sm font-medium text-tinta-suave max-w-xs mx-auto md:mx-0">
            <li>
              <button @click="scrollToSection('historia')" class="hover:text-acento transition-colors cursor-pointer">
                Historia
              </button>
            </li>
            <li>
              <button @click="scrollToSection('carta')" class="hover:text-acento transition-colors cursor-pointer">
                Nuestra Carta
              </button>
            </li>
            <li>
              <button @click="scrollToSection('tortas')" class="hover:text-acento transition-colors cursor-pointer">
                Especialidades
              </button>
            </li>
            <li>
              <router-link to="/tortas" class="hover:text-acento transition-colors">
                Carta de Tortas
              </router-link>
            </li>
            <li class="col-span-2 md:col-span-1">
              <button @click="scrollToSection('visitanos')" class="hover:text-acento transition-colors cursor-pointer">
                Visítanos
              </button>
            </li>
          </ul>
        </div>

        <!-- Columna 3: Redes & Ubicación -->
        <div class="md:col-span-3 space-y-4 flex flex-col items-center md:items-start">
          <h4 class="font-titulo text-xs uppercase tracking-[0.2em] font-semibold text-verde-marca dark:text-acento">
            Encuéntranos
          </h4>
          
          <div class="flex items-center gap-3 pt-1">
            <a
              :href="negocio.instagram"
              target="_blank"
              rel="noopener noreferrer"
              class="flex size-11 items-center justify-center rounded-full bg-fondo border border-borde-suave text-tinta hover:bg-acento hover:border-acento hover:text-verde-marca transition-all cursor-pointer shadow-sm"
              aria-label="Instagram"
            >
              <PhInstagramLogo :size="20" weight="regular" />
            </a>
            <a
              :href="negocio.whatsappUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="flex size-11 items-center justify-center rounded-full bg-fondo border border-borde-suave text-tinta hover:bg-acento hover:border-acento hover:text-verde-marca transition-all cursor-pointer shadow-sm"
              aria-label="WhatsApp"
            >
              <PhWhatsappLogo :size="20" weight="regular" />
            </a>
          </div>

          <div class="space-y-1 text-xs text-tinta-suave pt-1">
            <p class="font-medium text-tinta">José León Suárez 2015, Mataderos</p>
            <p>Buenos Aires, Argentina</p>
          </div>
        </div>

      </div>

      <!-- Copyright Inferior Adaptado -->
      <div class="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-tinta-suave gap-3 text-center sm:text-left">
        <p>&copy; 2026 ELSA Coffee BA. Todos los derechos reservados.</p>
        <p class="font-mono flex items-center justify-center gap-1.5 text-tinta-suave/80">
          <span>Hecho con dedicación y café</span>
          <PhHeart :size="14" weight="fill" class="text-verde-marca dark:text-acento inline" />
        </p>
      </div>

    </div>
  </footer>
</template>