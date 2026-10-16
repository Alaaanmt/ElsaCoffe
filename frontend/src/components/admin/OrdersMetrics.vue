<script setup lang="ts">
defineProps<{
  totalNuevos: number
  totalPendientesPago: number
  totalParaHoy: number
}>()

const emit = defineEmits<{
  (e: 'filtrar', tipo: 'NUEVO' | 'PENDIENTE_PAGO' | 'HOY'): void
}>()
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
    <div @click="emit('filtrar', 'NUEVO')"
      class="p-6 rounded-2xl bg-superficie border border-borde-suave hover:border-blue-500/50 cursor-pointer space-y-1 shadow-sm transition-all group">
      <span class="text-xs uppercase tracking-wider text-tinta-suave font-semibold group-hover:text-blue-500">Nuevos Por Confirmar</span>
      <div class="font-sans text-4xl font-extrabold text-blue-600 dark:text-blue-400 tracking-tight">{{ totalNuevos }}</div>
    </div>
    <div @click="emit('filtrar', 'PENDIENTE_PAGO')"
      class="p-6 rounded-2xl bg-superficie border border-borde-suave hover:border-amber-500/50 cursor-pointer space-y-1 shadow-sm transition-all group">
      <span class="text-xs uppercase tracking-wider text-tinta-suave font-semibold group-hover:text-amber-500">Pendientes de Pago</span>
      <div class="font-sans text-4xl font-extrabold text-amber-500 tracking-tight">{{ totalPendientesPago }}</div>
    </div>
    <div @click="emit('filtrar', 'HOY')"
      class="p-6 rounded-2xl bg-superficie border border-borde-suave hover:border-verde-marca/50 dark:hover:border-acento/50 cursor-pointer space-y-1 shadow-sm transition-all group">
      <span class="text-xs uppercase tracking-wider text-tinta-suave font-semibold group-hover:text-verde-marca dark:group-hover:text-acento transition-colors">Para Entregar Hoy</span>
      <div class="font-sans text-4xl font-extrabold text-verde-marca dark:text-acento tracking-tight">{{ totalParaHoy }}</div>
    </div>
  </div>
</template>