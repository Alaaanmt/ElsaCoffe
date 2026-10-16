<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { PhMagnifyingGlass, PhSortAscending, PhCaretDown } from '@phosphor-icons/vue'
import type { TabPedido, CriterioOrden } from '@/types/order'

const props = defineProps<{
  tabActiva: TabPedido
  filtroEstado: string
  filtroTiempoHistorial: string
  criterioOrden: CriterioOrden
  busqueda: string
}>()

const emit = defineEmits<{
  (e: 'update:busqueda', val: string): void
  (e: 'update:filtroEstado', val: string): void
  (e: 'update:filtroTiempoHistorial', val: 'TODOS' | 'SEMANA' | 'MES'): void
  (e: 'update:criterioOrden', val: CriterioOrden): void
  (e: 'resetPagina'): void
}>()

const ordenDropdownAbierto = ref(false)

const labelCriterioOrden = computed(() => {
  switch (props.criterioOrden) {
    case 'ENTREGA_PROXIMA': return 'Orden: Próximos a Entregar'
    case 'CREACION_DESC': return 'Orden: Realizados más recientes'
    case 'CREACION_ASC': return 'Orden: Realizados más antiguos'
    default: return 'Ordenar por'
  }
})

const seleccionarOrden = (valor: CriterioOrden) => {
  emit('update:criterioOrden', valor)
  ordenDropdownAbierto.value = false
}

const cerrarDropdownAlClicAfuera = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (!target.closest('.dropdown-orden-container')) {
    ordenDropdownAbierto.value = false
  }
}

onMounted(() => window.addEventListener('click', cerrarDropdownAlClicAfuera))
onUnmounted(() => window.removeEventListener('click', cerrarDropdownAlClicAfuera))
</script>

<template>
  <div class="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
    <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
      <!-- Búsqueda -->
      <div class="relative flex-1">
        <PhMagnifyingGlass :size="20" class="absolute left-4 top-3.5 text-tinta-suave" />
        <input 
          :value="busqueda"
          @input="emit('update:busqueda', ($event.target as HTMLInputElement).value)"
          type="text" 
          placeholder="Buscar por # pedido o cliente..." 
          class="w-full bg-superficie border border-borde-suave rounded-xl pl-11 pr-4 py-3 text-base text-tinta focus:outline-none focus:border-verde-marca" 
        />
      </div>

      <!-- Dropdown Personalizado -->
      <div v-if="tabActiva === 'activos'" class="relative dropdown-orden-container w-full sm:w-auto shrink-0">
        <button 
          type="button"
          @click.stop="ordenDropdownAbierto = !ordenDropdownAbierto"
          class="w-full sm:w-auto flex items-center justify-between gap-3 bg-superficie border border-borde-suave rounded-xl px-4 py-3 sm:py-2.5 cursor-pointer hover:border-verde-marca dark:hover:border-acento transition-all shadow-sm"
        >
          <div class="flex items-center gap-2">
            <PhSortAscending :size="20" class="text-verde-marca dark:text-acento shrink-0" />
            <span class="text-xs sm:text-sm font-semibold text-tinta">{{ labelCriterioOrden }}</span>
          </div>
          <PhCaretDown 
            :size="16" 
            class="text-tinta-suave shrink-0 transition-transform duration-200" 
            :class="{ 'rotate-180': ordenDropdownAbierto }"
            weight="bold" 
          />
        </button>

        <div 
          v-if="ordenDropdownAbierto"
          class="absolute left-0 right-0 sm:right-auto sm:w-64 mt-2 py-2 bg-superficie border border-borde-suave rounded-2xl shadow-2xl z-50 overflow-hidden"
        >
          <button
            type="button"
            @click="seleccionarOrden('ENTREGA_PROXIMA')"
            class="w-full text-left px-4 py-2.5 text-xs sm:text-sm transition-colors flex items-center justify-between cursor-pointer"
            :class="criterioOrden === 'ENTREGA_PROXIMA' ? 'bg-verde-marca/15 text-verde-marca dark:text-acento dark:bg-acento/15 font-bold' : 'text-tinta font-semibold hover:bg-fondo'"
          >
            <span>Orden: Próximos a Entregar</span>
            <span v-if="criterioOrden === 'ENTREGA_PROXIMA'" class="text-verde-marca dark:text-acento">✓</span>
          </button>

          <button
            type="button"
            @click="seleccionarOrden('CREACION_DESC')"
            class="w-full text-left px-4 py-2.5 text-xs sm:text-sm transition-colors flex items-center justify-between cursor-pointer"
            :class="criterioOrden === 'CREACION_DESC' ? 'bg-verde-marca/15 text-verde-marca dark:text-acento dark:bg-acento/15 font-bold' : 'text-tinta font-semibold hover:bg-fondo'"
          >
            <span>Orden: Realizados más recientes</span>
            <span v-if="criterioOrden === 'CREACION_DESC'" class="text-verde-marca dark:text-acento">✓</span>
          </button>

          <button
            type="button"
            @click="seleccionarOrden('CREACION_ASC')"
            class="w-full text-left px-4 py-2.5 text-xs sm:text-sm transition-colors flex items-center justify-between cursor-pointer"
            :class="criterioOrden === 'CREACION_ASC' ? 'bg-verde-marca/15 text-verde-marca dark:text-acento dark:bg-acento/15 font-bold' : 'text-tinta font-semibold hover:bg-fondo'"
          >
            <span>Orden: Realizados más antiguos</span>
            <span v-if="criterioOrden === 'CREACION_ASC'" class="text-verde-marca dark:text-acento">✓</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Filtros Secundarios -->
    <div v-if="tabActiva === 'activos'" class="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
      <button @click="emit('update:filtroEstado', 'TODOS'); emit('resetPagina')" class="px-4 py-2 rounded-xl text-sm font-semibold transition-all shrink-0 cursor-pointer" :class="filtroEstado === 'TODOS' ? 'bg-verde-marca text-crema' : 'bg-superficie border border-borde-suave text-tinta-suave hover:text-tinta'">Todos</button>
      <button @click="emit('update:filtroEstado', 'HOY'); emit('resetPagina')" class="px-4 py-2 rounded-xl text-sm font-semibold transition-all shrink-0 cursor-pointer" :class="filtroEstado === 'HOY' ? 'bg-verde-marca text-crema' : 'bg-superficie border border-borde-suave text-tinta-suave hover:text-tinta'">Para Hoy</button>
      <button @click="emit('update:filtroEstado', 'NUEVO'); emit('resetPagina')" class="px-4 py-2 rounded-xl text-sm font-semibold transition-all shrink-0 cursor-pointer" :class="filtroEstado === 'NUEVO' ? 'bg-blue-600 text-white' : 'bg-superficie border border-borde-suave text-tinta-suave hover:text-tinta'">Nuevos</button>
      <button @click="emit('update:filtroEstado', 'EN_PREPARACION'); emit('resetPagina')" class="px-4 py-2 rounded-xl text-sm font-semibold transition-all shrink-0 cursor-pointer" :class="filtroEstado === 'EN_PREPARACION' ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30' : 'bg-superficie border border-borde-suave text-tinta-suave hover:text-tinta'">En Preparación</button>
    </div>

    <div v-else class="flex items-center gap-2">
      <button @click="emit('update:filtroTiempoHistorial', 'TODOS'); emit('resetPagina')" class="px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer" :class="filtroTiempoHistorial === 'TODOS' ? 'bg-verde-marca text-crema' : 'bg-superficie border border-borde-suave text-tinta-suave'">Más recientes</button>
      <button @click="emit('update:filtroTiempoHistorial', 'SEMANA'); emit('resetPagina')" class="px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer" :class="filtroTiempoHistorial === 'SEMANA' ? 'bg-verde-marca text-crema' : 'bg-superficie border border-borde-suave text-tinta-suave'">Última semana</button>
      <button @click="emit('update:filtroTiempoHistorial', 'MES'); emit('resetPagina')" class="px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer" :class="filtroTiempoHistorial === 'MES' ? 'bg-verde-marca text-crema' : 'bg-superficie border border-borde-suave text-tinta-suave'">Último mes</button>
    </div>
  </div>
</template>