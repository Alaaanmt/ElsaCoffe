<script setup lang="ts">
import {
  PhStorefront, PhTruck, PhCheckCircle, PhXCircle, PhCalendarBlank,
  PhNote, PhCreditCard, PhBank, PhMoney, PhArrowRight
} from '@phosphor-icons/vue'
import type { OrderMock } from '@/types/order'
import { formatPrecio, getBadgeEstadoPedidoClass, getMetodoPagoLabel } from '@/utils/orderFormatters'

defineProps<{
  order: OrderMock
}>()

const emit = defineEmits<{
  (e: 'avanzarEstado', order: OrderMock): void
  (e: 'verDetalle', order: OrderMock): void
}>()
</script>

<template>
  <div class="p-7 rounded-3xl bg-superficie border border-borde-suave shadow-sm space-y-6 transition-all relative overflow-hidden">
    
    <!-- BANNER CENTRADO ABSOLUTO EN HISTORIAL -->
    <div v-if="order.estadoPedido === 'ENTREGADO' || order.estadoPedido === 'CANCELADO'"
      class="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
      <div v-if="order.estadoPedido === 'ENTREGADO'"
        class="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-2 border-emerald-500/40 px-6 py-2.5 rounded-full text-sm md:text-base font-extrabold uppercase tracking-widest flex items-center gap-2.5 backdrop-blur-md shadow-2xl">
        <PhCheckCircle :size="22" weight="fill" />
        <span>PEDIDO ENTREGADO</span>
      </div>
      <div v-if="order.estadoPedido === 'CANCELADO'"
        class="bg-red-500/20 text-red-600 dark:text-red-400 border-2 border-red-500/40 px-6 py-2.5 rounded-full text-sm md:text-base font-extrabold uppercase tracking-widest flex items-center gap-2.5 backdrop-blur-md shadow-2xl">
        <PhXCircle :size="22" weight="fill" />
        <span>PEDIDO CANCELADO</span>
      </div>
    </div>

    <div class="space-y-6" :class="{'opacity-50': order.estadoPedido === 'ENTREGADO' || order.estadoPedido === 'CANCELADO'}">
      <!-- Encabezado Principal -->
      <div class="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div class="space-y-1">
          <div class="flex items-center gap-3 flex-wrap">
            <h3 class="font-titulo text-2xl md:text-3xl font-extrabold text-tinta">Pedido #{{ order.numeroPedido }}</h3>
            <span class="py-2 px-3.5 inline-flex items-center gap-2 text-xs sm:text-sm font-mono font-bold rounded-xl bg-fondo border border-borde-suave text-tinta shadow-sm">
              <component :is="order.metodoPago === 'mercadopago' ? PhCreditCard : (order.metodoPago === 'transferencia' ? PhBank : PhMoney)" :size="18" class="text-verde-marca dark:text-acento shrink-0" />
              <span>{{ getMetodoPagoLabel(order.metodoPago) }}</span>
            </span>
          </div>
          <p class="text-base font-semibold text-tinta-suave pt-1">
            <span v-for="(item, idx) in order.items" :key="item.id" class="text-tinta font-bold">{{ item.nombreProducto }} × {{ item.cantidad }}<span v-if="idx < order.items.length - 1">, </span></span>
          </p>
        </div>
        
        <div class="text-left md:text-right space-y-1">
          <span class="font-mono text-2xl md:text-3xl font-bold text-verde-marca dark:text-acento block">{{ formatPrecio(order.totalFinal) }}</span>
          
          <!-- Ocultar etiqueta de Pago Pendiente/Realizado si el pedido está CANCELADO -->
          <span v-if="order.estadoPedido !== 'CANCELADO'" 
            class="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
            :class="order.estadoPago === 'PAGADO' ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'">
            {{ order.estadoPago === 'PAGADO' ? 'Pago Realizado' : 'Pago Pendiente' }}
          </span>
        </div>
      </div>

      <!-- Bloque Medio -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pt-2 border-t border-borde-suave/60">
        <div class="lg:col-span-9 space-y-3 text-sm sm:text-base text-tinta-suave">
          <div class="flex items-center gap-2">
            <PhCalendarBlank :size="20" class="text-verde-marca dark:text-acento shrink-0" />
            <span class="font-semibold text-tinta">Entrega:</span>
            <span class="capitalize">{{ new Date(order.fechaTurno).toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' }) }}</span>
            <span class="capitalize font-mono font-bold text-verde-marca dark:text-acento">({{ order.turno }})</span>
          </div>
          <div class="flex items-center gap-2">
            <component :is="order.tipoEntrega === 'retiro' ? PhStorefront : PhTruck" :size="20" class="text-verde-marca dark:text-acento shrink-0" />
            <span class="font-semibold text-tinta">Cliente:</span>
            <span class="text-tinta font-medium">{{ order.nombreCliente }} {{ order.apellidoCliente }}</span>
            <span>· {{ order.tipoEntrega === 'retiro' ? 'Retiro en sucursal' : `Envío a domicilio (${order.calleEnvio} ${order.numeroEnvio})` }}</span>
          </div>
          <div v-if="order.notasCliente" class="w-fit px-3.5 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs sm:text-sm text-tinta flex items-center gap-2.5">
            <PhNote :size="20" class="text-amber-600 dark:text-amber-400 shrink-0" />
            <div class="flex items-center gap-1.5 truncate">
              <strong class="font-bold text-amber-700 dark:text-amber-300 shrink-0">Nota:</strong>
              <span class="italic text-tinta-suave truncate">"{{ order.notasCliente }}"</span>
            </div>
          </div>
        </div>
        <div class="lg:col-span-3 flex items-center justify-start lg:justify-end">
          <div v-if="order.items.length > 0" class="relative">
            <img :src="order.items[0].imagenProducto" :alt="order.items[0].nombreProducto" class="size-28 rounded-2xl object-cover border border-borde-suave shadow-md" />
            <span v-if="order.items.length > 1" class="absolute -bottom-2 -right-2 px-2.5 py-1 rounded-full bg-verde-marca text-crema text-xs font-bold font-mono shadow-lg">+{{ order.items.length - 1 }} más</span>
          </div>
        </div>
      </div>

      <!-- Pie de Tarjeta -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-3 border-t border-borde-suave/60">
        <span class="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider self-start sm:self-auto" :class="getBadgeEstadoPedidoClass(order.estadoPedido)">{{ order.estadoPedido.replace('_', ' ') }}</span>
        <div class="flex items-center gap-3 relative z-30">
          <button v-if="order.estadoPedido === 'NUEVO'" @click="emit('avanzarEstado', order)"
            class="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-sm flex items-center gap-1.5">
            <span>Aceptar y Preparar</span>
            <PhArrowRight :size="16" weight="bold" />
          </button>
          <button v-else-if="order.estadoPedido === 'EN_PREPARACION'" @click="emit('avanzarEstado', order)"
            class="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-sm flex items-center gap-1.5">
            <span>Marcar como Listo</span>
            <PhCheckCircle :size="16" weight="bold" />
          </button>
          <button v-else-if="order.estadoPedido === 'LISTO'" @click="emit('avanzarEstado', order)"
            class="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-sm flex items-center gap-1.5">
            <span>Registrar Entrega</span>
            <PhCheckCircle :size="16" weight="bold" />
          </button>
          <button @click="emit('verDetalle', order)" class="px-5 py-2.5 rounded-xl bg-fondo border border-borde-suave hover:border-verde-marca text-xs sm:text-sm font-semibold text-tinta transition-all cursor-pointer text-center shadow-sm">Ver detalle completo</button>
        </div>
      </div>

    </div>
  </div>
</template>