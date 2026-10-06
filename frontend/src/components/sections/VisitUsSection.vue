<script setup lang="ts">
import { PhMapPin, PhClock, PhArrowRight } from '@phosphor-icons/vue'
import fachadaImg from '@/assets/img/local-fachada.jpg'
const abrirMapa = () => {
  window.open('https://maps.app.goo.gl/sVmeWHMVKGx3uFjz7', '_blank')
}
</script>

<template>
  <section id="visitanos" class="relative py-24 md:py-36 bg-superficie transition-colors duration-500 overflow-hidden">
    <div class="mx-auto max-w-7xl px-5 sm:px-8">
      
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        <!-- Columna de Información (Izquierda) -->
        <div class="lg:col-span-6 space-y-8">
          <div>
            <span class="text-xs uppercase tracking-[0.2em] font-medium text-tinta-suave mb-3 block">
              Ubicación & Horarios
            </span>
            <h2 class="font-titulo text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-tinta">
              Te esperamos <span class="italic font-normal">hoy y siempre</span>.
            </h2>
          </div>

          <p class="font-cuerpo text-base text-tinta-suave leading-relaxed">
            Un espacio pensado para que disfrutes de un excelente café de especialidad y pastelería artesanal en el corazón de Mataderos.
          </p>

          <!-- Tarjeta de Dirección y Horarios -->
          <div class="space-y-6 pt-2">
            
            <!-- Dirección -->
            <div class="flex items-start gap-4">
              <div class="flex size-11 shrink-0 items-center justify-center rounded-xl bg-verde-marca/10 text-verde-marca dark:bg-acento/20 dark:text-acento">
                <PhMapPin :size="22" weight="fill" />
              </div>
              <div>
                <h3 class="text-sm font-semibold uppercase tracking-wider text-tinta mb-1">Dirección</h3>
                <p class="font-cuerpo text-base text-tinta-suave">José León Suárez 2015, Mataderos, CABA</p>
              </div>
            </div>

            <!-- Horarios -->
            <div class="flex items-start gap-4">
              <div class="flex size-11 shrink-0 items-center justify-center rounded-xl bg-verde-marca/10 text-verde-marca dark:bg-acento/20 dark:text-acento">
                <PhClock :size="22" weight="fill" />
              </div>
              <div class="space-y-1.5">
                <h3 class="text-sm font-semibold uppercase tracking-wider text-tinta mb-1">Horarios de Atención</h3>
                <div class="flex justify-between gap-8 text-sm text-tinta-suave">
                  <span class="font-medium text-tinta">Lunes a Viernes:</span>
                  <span>07:30 a 20:00 hs</span>
                </div>
                <div class="flex justify-between gap-8 text-sm text-tinta-suave">
                  <span class="font-medium text-tinta">Sábados, Domingos y Feriados:</span>
                  <span>08:30 a 20:00 hs</span>
                </div>
              </div>
            </div>

          </div>

          <!-- Botón Cómo llegar -->
          <div class="pt-4">
            <button
              @click="abrirMapa"
              class="inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-verde-marca text-crema font-medium text-sm transition-all hover:bg-acento hover:text-verde-marca cursor-pointer shadow-md group"
            >
              <span>Cómo llegar</span>
              <PhArrowRight :size="16" weight="bold" class="transition-transform group-hover:translate-x-1" />
            </button>
          </div>

        </div>

        <!-- Columna Visual: Foto de la Fachada (Derecha) -->
        <div class="lg:col-span-6">
          <div class="relative overflow-hidden rounded-[1.5kt] rounded-[1.5rem] shadow-2xl aspect-[4/3] bg-superficie-alta border border-borde-suave group">
            <img
              :src="fachadaImg"
              alt="Fachada de ELSA Coffee & Wine en Mataderos"
              class="h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-105"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            <div class="absolute bottom-6 left-6 right-6 text-white">
              <span class="text-xs uppercase tracking-widest text-crema/90 font-medium">Nuestro Local</span>
              <p class="font-titulo text-lg font-medium">José León Suárez 2015</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  </section>
</template>