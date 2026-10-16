<script setup lang="ts">
import { PhShoppingCart, PhInfo } from '@phosphor-icons/vue'
import FadeInObserver from '@/components/ui/FadeInObserver.vue'
import { useCart } from '@/composables/useCart'
import { tortasCompletas, type TortaEncargo } from '@/data/cakes'

const { addToCart } = useCart()

const handleAgregar = (torta: TortaEncargo) => {
  addToCart({
    id: torta.id,
    nombre: torta.nombre,
    precio: torta.precio,
    imagen: torta.imagen,
    rinde: torta.rinde
  })
}
</script>

<template>
  <div class="pt-32 pb-24 px-5 sm:px-8 max-w-7xl mx-auto min-h-[80vh]">
    <FadeInObserver>
      <!-- Encabezado de la Vista -->
      <div class="max-w-2xl mx-auto text-center space-y-4 mb-16">
        <span class="text-xs uppercase tracking-[0.2em] font-medium text-tinta-suave block">Encargos Especiales</span>
        <h1 class="font-titulo text-4xl sm:text-5xl font-semibold tracking-tight text-tinta">Tortas completas para <span
            class="italic font-normal">compartir</span>.</h1>
        <p class="font-cuerpo text-base text-tinta-suave">Elegí tu torta artesanal preferida para celebrar en casa.
          Elaboración propia con reserva anticipada.</p>
      </div>

      <!-- Grilla de Tarjetas Visuales -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="torta in tortasCompletas" :key="torta.id"
          class="bg-superficie rounded-2xl overflow-hidden border border-borde-suave shadow-sm flex flex-col justify-between transition-all duration-500 hover:shadow-md hover:border-borde-control group">
          <div>
            <!-- Contenedor de la Imagen -->
            <div class="relative overflow-hidden aspect-[11/10] bg-superficie-alta">
              <img :src="torta.imagen" :alt="torta.nombre"
                class="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />

              <!-- Badge flotante sobre la imagen -->
              <div v-if="torta.badge" class="absolute top-4 right-4">
                <span
                  class="text-[10px] uppercase tracking-wider px-3 py-1 rounded-full bg-fondo/90 backdrop-blur-md text-tinta font-semibold shadow-sm">
                  {{ torta.badge }}
                </span>
              </div>
            </div>

            <!-- Contenido de texto de la tarjeta -->
            <div class="p-6 sm:p-7 space-y-3">
              <div class="flex items-baseline justify-between">
                <h3 class="font-titulo text-2xl font-semibold text-tinta group-hover:text-acento transition-colors">
                  {{ torta.nombre }}
                </h3>
              </div>
              <span class="text-xs font-medium text-tinta-suave block">Rinde aprox. {{ torta.rinde }}</span>
              <p class="font-cuerpo text-sm text-tinta-suave leading-relaxed line-clamp-3">
                {{ torta.descripcion }}
              </p>
            </div>
          </div>

          <!-- Pie de tarjeta: Precio y Botón de Carrito -->
          <div class="px-6 sm:px-7 pb-6 pt-2 flex items-center justify-between border-t border-borde-suave/60 mt-auto">
            <div>
              <span class="text-[10px] uppercase tracking-wider text-tinta-suave block">Precio</span>
              <span class="font-mono text-xl font-semibold text-tinta">{{ torta.precio }}</span>
            </div>
            <button @click="handleAgregar(torta)"
              class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-verde-marca text-crema text-xs font-medium hover:bg-acento hover:text-verde-marca transition-all cursor-pointer shadow-sm active:scale-98">
              <PhShoppingCart :size="16" weight="fill" />
              <span>Agregar</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Nota -->
      <div
        class="mt-16 max-w-xl mx-auto text-center bg-superficie rounded-2xl p-6 border border-borde-suave flex items-center gap-4 justify-center text-tinta-suave">
        <PhInfo :size="24" weight="regular" class="shrink-0 text-verde-marca dark:text-acento" />
        <p class="text-xs sm:text-sm leading-relaxed text-left">
          Los encargos de tortas completas se realizan con un mínimo de 48 hs de anticipación para asegurar su óptima
          elaboración artesanal.
        </p>
      </div>
    </FadeInObserver>
  </div>
</template>