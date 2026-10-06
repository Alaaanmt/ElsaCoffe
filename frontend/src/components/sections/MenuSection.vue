<script setup lang="ts">
import { ref, computed } from 'vue'
import { categoriasMenu, type MenuCategoria } from '@/data/menu'
import imgTorta from '@/assets/img/torta-franui.png'
import imgTortita from '@/assets/img/tortita-negra-sandwich.png'

const categoriaActiva = ref<string>(categoriasMenu[0]?.id || 'cafeteria')

const categoriaSeleccionada = computed<MenuCategoria>(() => {
  return categoriasMenu.find(c => c.id === categoriaActiva.value) ?? categoriasMenu[0] ?? {
    id: 'default',
    titulo: 'Carta',
    subtitulo: '',
    items: []
  }
})

</script>

<template>
  <section id="carta" class="py-24 md:py-36 bg-fondo transition-colors duration-500">
    <div class="mx-auto max-w-7xl px-5 sm:px-8">
      
      <!-- Encabezado de sección -->
      <div class="text-center max-w-2xl mx-auto mb-16 space-y-4">
        <span class="text-xs uppercase tracking-[0.2em] font-medium text-tinta-suave block">
          Nuestra Carta
        </span>
        <h2 class="font-titulo text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-tinta">
          Elaboración propia y sabores <span class="italic font-normal">auténticos</span>.
        </h2>
        <p class="font-cuerpo text-base text-tinta-suave">
          Descubrí nuestras opciones de cafetería, desayunos, almuerzos y pastelería artesanal.
        </p>
      </div>

      <!-- Pestañas de Navegación de Categorías -->
      <div class="flex flex-wrap justify-center gap-2 sm:gap-3 mb-12">
        <button
          v-for="cat in categoriasMenu"
          :key="cat.id"
          @click="categoriaActiva = cat.id"
          class="px-5 py-2.5 rounded-full text-sm font-medium transition-all cursor-pointer border"
          :class="[
            categoriaActiva === cat.id
              ? 'bg-tinta text-fondo border-tinta shadow-sm scale-105'
              : 'bg-superficie text-tinta-suave border-borde-control hover:border-tinta hover:text-tinta'
          ]"
        >
          {{ cat.titulo }}
        </button>
      </div>

      <!-- Contenido de la Carta con Grid y Tarjetas Visuales -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        <!-- Listado de Platos / Precios (Columna Izquierda / Principal) -->
        <div class="lg:col-span-7 bg-superficie rounded-2xl p-6 sm:p-8 border border-borde-suave shadow-sm">
          <div class="mb-6 pb-4 border-b border-borde-suave">
            <h3 class="font-titulo text-2xl font-semibold text-tinta">{{ categoriaSeleccionada?.titulo }}</h3>
            <p class="text-sm text-tinta-suave mt-1">{{ categoriaSeleccionada?.subtitulo }}</p>
          </div>

          <div class="space-y-6">
            <div 
              v-for="(item, index) in (categoriaSeleccionada?.items || [])" 
              :key="index"
              class="group flex items-baseline justify-between gap-4 pb-4 border-b border-borde-suave/50 last:border-0 last:pb-0"
            >
              <div class="space-y-1">
                <div class="flex items-center gap-2">
                  <span class="font-medium text-tinta group-hover:text-acento transition-colors">
                    {{ item.nombre }}
                  </span>
                  <span 
                    v-if="item.badge" 
                    class="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-verde-marca/10 text-verde-marca dark:bg-acento/20 dark:text-acento font-semibold"
                  >
                    {{ item.badge }}
                  </span>
                </div>
                <p v-if="item.descripcion" class="text-xs sm:text-sm text-tinta-suave leading-relaxed">
                  {{ item.descripcion }}
                </p>
              </div>

              <!-- Precio con línea punteada visual o separación limpia -->
              <span class="font-mono text-base font-semibold text-tinta shrink-0">
                {{ item.precio }}
              </span>
            </div>
          </div>
        </div>

        <!-- Columna Derecha: Tarjetas Visuales de Apoyo (Inspiración en Cajas/Combos) -->
        <div class="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
          
          <div class="group relative overflow-hidden rounded-2xl aspect-[16/9] sm:aspect-[4/3] bg-superficie-alta shadow-md border border-borde-suave">
            <img 
              :src="imgTorta" 
              alt="Pastelería artesanal ELSA" 
              class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
              <span class="text-xs uppercase tracking-widest text-crema/80 font-medium">Elaboración Propia</span>
              <h4 class="font-titulo text-xl font-semibold text-white">Pastelería & Tortas</h4>
            </div>
          </div>

          <div class="group relative overflow-hidden rounded-2xl aspect-[16/9] sm:aspect-[4/3] bg-superficie-alta shadow-md border border-borde-suave">
            <img 
              :src="imgTortita" 
              alt="Opciones saladas y panadería" 
              class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
              <span class="text-xs uppercase tracking-widest text-crema/80 font-medium">fresco y diario</span>
              <h4 class="font-titulo text-xl font-semibold text-white">Panadería & Almuerzos</h4>
            </div>
          </div>

        </div>

      </div>

    </div>
  </section>
</template>