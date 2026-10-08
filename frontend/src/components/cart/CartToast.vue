<script setup lang="ts">
import { useCart } from '@/composables/useCart'
import { PhX, PhShoppingCart } from '@phosphor-icons/vue'

const { showToast, latestAddedItem, totalItems, formattedTotalPrice, isCartOpen, showToast: toggleToast } = useCart()

const abrirCarritoDrawer = () => {
  showToast.value = false
  isCartOpen.value = true
}
</script>

<template>
  <Transition
    enter-active-class="transform transition duration-300 ease-out"
    enter-from-class="translate-y-4 opacity-0 scale-95"
    enter-to-class="translate-y-0 opacity-100 scale-100"
    leave-active-class="transform transition duration-200 ease-in"
    leave-from-class="translate-y-0 opacity-100 scale-100"
    leave-to-class="translate-y-4 opacity-0 scale-95"
  >
    <div 
      v-if="showToast && latestAddedItem" 
      class="fixed bottom-6 right-6 z-[100] w-80 sm:w-96 bg-superficie border border-borde-suave rounded-2xl shadow-2xl p-4 sm:p-5 backdrop-blur-lg"
    >
      <!-- Cabecera de la notificación -->
      <div class="flex items-start justify-between gap-3 mb-3">
        <div class="flex items-center gap-3">
          <img 
            :src="latestAddedItem.imagen" 
            :alt="latestAddedItem.nombre" 
            class="size-14 rounded-xl object-cover border border-borde-suave shrink-0"
          />
          <div>
            <h4 class="font-titulo text-base font-semibold text-tinta leading-tight">
              {{ latestAddedItem.nombre }}
            </h4>
            <span class="text-xs text-tinta-suave mt-0.5 block">
              {{ latestAddedItem.cantidad }}x {{ latestAddedItem.precioStr }}
            </span>
            <span class="text-[11px] font-medium text-verde-marca dark:text-acento mt-1 block">
              ¡Agregado al carrito!
            </span>
          </div>
        </div>

        <button 
          @click="showToast = false"
          class="text-tinta-suave hover:text-tinta p-1 rounded-lg transition-colors cursor-pointer"
        >
          <PhX :size="18" weight="bold" />
        </button>
      </div>

      <!-- Resumen y botón de ver carrito -->
      <div class="pt-3 border-t border-borde-suave flex items-center justify-between gap-4">
        <div>
          <span class="text-[10px] uppercase tracking-wider text-tinta-suave block">
            Total ({{ totalItems }} {{ totalItems === 1 ? 'producto' : 'productos' }}):
          </span>
          <span class="font-mono text-base font-semibold text-tinta">
            {{ formattedTotalPrice }}
          </span>
        </div>

        <button 
          @click="abrirCarritoDrawer"
          class="px-5 py-2.5 rounded-full bg-verde-marca text-crema text-xs font-medium hover:bg-acento hover:text-verde-marca transition-all cursor-pointer shadow-md flex items-center gap-2"
        >
          <PhShoppingCart :size="15" weight="fill" />
          <span>VER CARRITO</span>
        </button>
      </div>
    </div>
  </Transition>
</template>