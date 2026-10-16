<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { PhSignOut } from '@phosphor-icons/vue'
import ThemeToggle from '@/components/layout/ThemeToggle.vue'

import OrdersMetrics from '@/components/admin/OrdersMetrics.vue'
import OrdersToolbar from '@/components/admin/OrdersToolbar.vue'
import OrdersList from '@/components/admin/OrdersList.vue'
import OrderDetailModal from '@/components/admin/OrderDetailModal.vue'

import { useAdminOrders } from '@/composables/useAdminOrders'
import type { OrderMock, EstadoPedido, EstadoPago } from '@/types/order'

const router = useRouter()
const {
  pedidos,
  tabActiva,
  filtroEstado,
  filtroTiempoHistorial,
  criterioOrden,
  busqueda,
  paginaActual,
  totalPaginas,
  pedidosPaginados,
  totalNuevos,
  totalPendientesPago,
  totalParaHoy,
  filtrarPorMetrica,
  cambiarPagina,
  avanzarEstadoContextual
} = useAdminOrders()

const pedidoSeleccionado = ref<OrderMock | null>(null)

const cerrarSesion = () => {
  localStorage.removeItem('elsa_admin_token')
  router.push('/admin/login')
}

const abrirModalDetalle = (order: OrderMock) => {
  pedidoSeleccionado.value = order
}

const guardarCambiosModal = (cambios: { estadoPedido: EstadoPedido; estadoPago: EstadoPago }) => {
  if (pedidoSeleccionado.value) {
    pedidoSeleccionado.value.estadoPedido = cambios.estadoPedido
    pedidoSeleccionado.value.estadoPago = cambios.estadoPago
  }
  pedidoSeleccionado.value = null
}
</script>

<template>
  <div class="min-h-screen bg-fondo pt-12 pb-20 px-5 sm:px-8 transition-colors duration-300">
    <div class="max-w-7xl mx-auto space-y-8">
      
      <!-- Topbar del Admin -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-borde-suave pb-6">
        <div>
          <h1 class="font-titulo text-3xl md:text-4xl font-bold text-tinta">Panel de Pedidos</h1>
          <p class="text-sm text-tinta-suave mt-1">Gestión operativa diaria de encargos para Elsa</p>
        </div>
        <div class="flex items-center gap-3 self-start sm:self-auto">
          <ThemeToggle />
          <button @click="cerrarSesion" class="inline-flex items-center gap-2 text-sm font-semibold text-red-500 hover:text-red-600 bg-red-500/10 px-4 py-2.5 rounded-xl transition-colors cursor-pointer">
            <PhSignOut :size="18" weight="bold" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>

      <!-- Componente de Métricas -->
      <OrdersMetrics 
        :total-nuevos="totalNuevos"
        :total-pendientes-pago="totalPendientesPago"
        :total-para-hoy="totalParaHoy"
        @filtrar="filtrarPorMetrica"
      />

      <!-- Pestañas Principales (Activos vs Historial) -->
      <div class="flex items-center gap-3 border-b border-borde-suave pb-2">
        <button @click="tabActiva = 'activos'; filtroEstado = 'TODOS'; paginaActual = 1"
          class="px-5 py-2.5 rounded-xl font-titulo text-base md:text-lg font-bold transition-all cursor-pointer flex items-center gap-2"
          :class="tabActiva === 'activos' ? 'bg-verde-marca text-crema shadow-md' : 'bg-superficie text-tinta-suave hover:text-tinta border border-borde-suave'">
          <span>Pedidos Activos</span>
          <span class="text-xs font-mono px-2 py-0.5 rounded-full bg-fondo/20">{{ pedidos.filter(o => o.estadoPedido !== 'ENTREGADO' && o.estadoPedido !== 'CANCELADO').length }}</span>
        </button>
        <button @click="tabActiva = 'historial'; filtroEstado = 'TODOS'; paginaActual = 1"
          class="px-5 py-2.5 rounded-xl font-titulo text-base md:text-lg font-bold transition-all cursor-pointer flex items-center gap-2"
          :class="tabActiva === 'historial' ? 'bg-verde-marca text-crema shadow-md' : 'bg-superficie text-tinta-suave hover:text-tinta border border-borde-suave'">
          <span>Historial de Pedidos</span>
          <span class="text-xs font-mono px-2 py-0.5 rounded-full bg-fondo/20">{{ pedidos.filter(o => o.estadoPedido === 'ENTREGADO' || o.estadoPedido === 'CANCELADO').length }}</span>
        </button>
      </div>

      <!-- Toolbar de Controles -->
      <OrdersToolbar 
        :tab-activa="tabActiva"
        v-model:busqueda="busqueda"
        v-model:filtro-estado="filtroEstado"
        v-model:filtro-tiempo-historial="filtroTiempoHistorial"
        v-model:criterio-orden="criterioOrden"
        @reset-pagina="paginaActual = 1"
      />

      <!-- Listado con Paginación -->
      <OrdersList 
        :pedidos-paginados="pedidosPaginados"
        :pagina-actual="paginaActual"
        :total-paginas="totalPaginas"
        @avanzar-estado="avanzarEstadoContextual"
        @ver-detalle="abrirModalDetalle"
        @cambiar-pagina="cambiarPagina"
      />

    </div>

    <!-- Modal de Detalle -->
    <OrderDetailModal 
      :pedido="pedidoSeleccionado"
      @cerrar="pedidoSeleccionado = null"
      @guardar="guardarCambiosModal"
    />
  </div>
</template>