<script setup lang="ts">
import { PhInstagramLogo, PhWhatsappLogo } from '@phosphor-icons/vue'
import { negocio } from '@/data/business'
</script>

<template>
  <footer class="bg-superficie border-t border-borde-suave text-tinta transition-colors duration-500">
    <div class="mx-auto max-w-7xl px-5 sm:px-8 py-16">
      
      <div class="grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-borde-suave">
        
        <!-- Columna 1: Marca y Bajada -->
        <div class="md:col-span-5 space-y-4">
          <span class="font-titulo text-2xl font-bold tracking-tight">ELSA</span>
          <p class="font-cuerpo text-sm text-tinta-suave max-w-sm leading-relaxed">
            Un espacio tranquilo en Mataderos donde podés disfrutar de café de especialidad, almuerzos y pastelería 100% artesanal de elaboración propia.
          </p>
        </div>

        <!-- Columna 2: Enlaces Rápidos -->
        <div class="md:col-span-4 space-y-3">
          <h4 class="font-titulo text-base font-semibold uppercase tracking-wider text-tinta">Navegación</h4>
          <ul class="space-y-2 text-sm text-tinta-suave">
            <li>
              <router-link to="/" class="hover:text-acento transition-colors">Inicio</router-link>
            </li>
            <li>
              <router-link to="/tortas" class="hover:text-acento transition-colors">Tortas Completas</router-link>
            </li>
            <li>
              <a href="/#carta" class="hover:text-acento transition-colors">Nuestra Carta</a>
            </li>
            <li>
              <a href="/#visitanos" class="hover:text-acento transition-colors">Visítanos</a>
            </li>
          </ul>
        </div>

        <!-- Columna 3: Redes & Contacto -->
        <div class="md:col-span-3 space-y-3">
          <h4 class="font-titulo text-base font-semibold uppercase tracking-wider text-tinta">Seguinos</h4>
          <div class="flex items-center gap-3 pt-1">
            <a 
              :href=negocio.instagram
              target="_blank" 
              rel="noopener noreferrer"
              class="flex size-10 items-center justify-center rounded-full bg-superficie-alta border border-borde-suave text-tinta hover:bg-acento hover:text-verde-marca transition-all"
              aria-label="Instagram"
            >
              <PhInstagramLogo :size="20" weight="regular" />
            </a>
            <a 
              :href= negocio.whatsappUrl
              target="_blank" 
              rel="noopener noreferrer"
              class="flex size-10 items-center justify-center rounded-full bg-superficie-alta border border-borde-suave text-tinta hover:bg-acento hover:text-verde-marca transition-all"
              aria-label="WhatsApp"
            >
              <PhWhatsappLogo :size="20" weight="regular" />
            </a>
          </div>
          <p class="text-xs text-tinta-suave pt-2">
            José León Suárez 2015, Mataderos.
          </p>
        </div>

      </div>

      <!-- Copyright inferior -->
      <div class="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-tinta-suave gap-4">
        <p>&copy; 2026 ELSA Coffee BA. Todos los derechos reservados.</p>
        <p class="font-mono">Hecho con dedicación y café.</p>
      </div>

    </div>
  </footer>
</template>