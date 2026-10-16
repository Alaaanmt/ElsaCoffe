<script setup lang="ts">
import { PhCaretLeft, PhCaretRight } from '@phosphor-icons/vue'
import OrderCard from './OrderCard.vue'
import type { OrderMock } from '@/types/order'

defineProps<{
  pedidosPaginados: OrderMock[]
  paginaActual: number
  totalPaginas: number
}>()

const emit = defineEmits<{
  (e: 'avanzarEstado', order: OrderMock): void
  (e: 'verDetalle', order: OrderMock): void
  (e: 'cambiarPagina', pag: number): void
}>()
</script>

<template>
  <div class="space-y-6">
    <div v-if="pedidosPaginados.length === 0" class="text-center py-20 bg-superficie rounded-3xl border border-borde-suave text-tinta-suave text-base">
      No hay pedidos registrados en este listado.
    </div>

    <OrderCard 
      v-for="order in pedidosPaginados" 
      :key="order.id" 
      :order="order"
      @avanzar-estado="emit('avanzarEstado', $event)"
      @ver-detalle="emit('verDetalle', $event)"
    />

    <!-- Paginación -->
    <div v-if="totalPaginas > 1" class="flex items-center justify-center gap-2 pt-6">
      <button @click="emit('cambiarPagina', paginaActual - 1)" :disabled="paginaActual === 1"
        class="p-2.5 rounded-xl bg-superficie border border-borde-suave text-tinta disabled:opacity-40 disabled:cursor-not-allowed hover:border-verde-marca cursor-pointer">
        <PhCaretLeft :size="18" weight="bold" />
      </button>
      <button v-for="pag in totalPaginas" :key="pag" @click="emit('cambiarPagina', pag)"
        class="size-10 rounded-xl text-sm font-bold transition-all cursor-pointer font-mono"
        :class="paginaActual === pag ? 'bg-verde-marca text-crema shadow-md' : 'bg-superficie border border-borde-suave text-tinta hover:border-verde-marca'">{{ pag }}</button>
      <button @click="emit('cambiarPagina', paginaActual + 1)" :disabled="paginaActual === totalPaginas"
        class="p-2.5 rounded-xl bg-superficie border border-borde-suave text-tinta disabled:opacity-40 disabled:cursor-not-allowed hover:border-verde-marca cursor-pointer">
        <PhCaretRight :size="18" weight="bold" />
      </button>
    </div>
  </div>
</template>