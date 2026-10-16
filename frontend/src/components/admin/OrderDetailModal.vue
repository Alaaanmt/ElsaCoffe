<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { PhX, PhNote, PhCopy, PhCheck, PhWhatsappLogo, PhCaretDown } from '@phosphor-icons/vue'
import type { OrderMock, EstadoPedido, EstadoPago } from '@/types/order'
import { formatPrecio } from '@/utils/orderFormatters'

const props = defineProps<{
  pedido: OrderMock | null
}>()

const emit = defineEmits<{
  (e: 'cerrar'): void
  (e: 'guardar', cambios: { estadoPedido: EstadoPedido; estadoPago: EstadoPago }): void
}>()

const estadoPedidoTemp = ref<EstadoPedido>('NUEVO')
const estadoPagoTemp = ref<EstadoPago>('PENDIENTE')
const direccionCopiada = ref(false)

const dropdownEstadoPedidoAbierto = ref(false)
const dropdownEstadoPagoAbierto = ref(false)

watch(() => props.pedido, (nuevo) => {
  if (nuevo) {
    estadoPedidoTemp.value = nuevo.estadoPedido
    estadoPagoTemp.value = nuevo.estadoPago
  }
}, { immediate: true })

const copiarDireccion = (order: OrderMock) => {
  const dir = `${order.calleEnvio} ${order.numeroEnvio}, ${order.ciudadEnvio}`
  navigator.clipboard.writeText(dir)
  direccionCopiada.value = true
  setTimeout(() => direccionCopiada.value = false, 2000)
}

const abrirWhatsapp = (tel: string, nroPedido: number) => {
  const numLimpio = tel.replace(/\D/g, '')
  const msg = `¡Hola! Te escribimos de Elsa Coffee & Wine respecto a tu Pedido #${nroPedido}.`
  window.open(`https://wa.me/549${numLimpio}?text=${encodeURIComponent(msg)}`, '_blank')
}

const guardarCambios = () => {
  emit('guardar', {
    estadoPedido: estadoPedidoTemp.value,
    estadoPago: estadoPagoTemp.value
  })
}

const cerrarDropdowns = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (!target.closest('.dropdown-modal-container')) {
    dropdownEstadoPedidoAbierto.value = false
    dropdownEstadoPagoAbierto.value = false
  }
}

onMounted(() => window.addEventListener('click', cerrarDropdowns))
onUnmounted(() => window.removeEventListener('click', cerrarDropdowns))
</script>

<template>
  <div v-if="pedido" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
    <div class="w-full max-w-xl bg-superficie border border-borde-suave rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex items-center justify-between border-b border-borde-suave pb-4">
        <div>
          <h3 class="font-titulo text-2xl font-bold text-tinta">Pedido #{{ pedido.numeroPedido }}</h3>
          <p class="text-xs text-tinta-suave">Ingresado el {{ new Date(pedido.createdAt).toLocaleString('es-AR') }}</p>
        </div>
        <button @click="emit('cerrar')" class="size-9 rounded-full bg-fondo border border-borde-suave flex items-center justify-center text-tinta-suave hover:text-tinta cursor-pointer">
          <PhX :size="18" weight="bold" />
        </button>
      </div>

      <!-- Alerta -->
      <div v-if="estadoPedidoTemp !== pedido.estadoPedido || estadoPagoTemp !== pedido.estadoPago"
        class="p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-bold flex items-center gap-2">
        <PhNote :size="18" />
        <span>Tenés cambios de estado sin guardar. Presioná "Guardar cambios" para aplicarlos.</span>
      </div>

      <!-- Edición de Estados Personalizados -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-fondo rounded-2xl border border-borde-suave">
        <!-- Estado del Pedido -->
        <div class="relative dropdown-modal-container">
          <label class="text-[11px] font-bold text-tinta-suave uppercase block mb-1">Estado del Pedido</label>
          <button 
            type="button"
            @click.stop="dropdownEstadoPedidoAbierto = !dropdownEstadoPedidoAbierto; dropdownEstadoPagoAbierto = false"
            class="w-full bg-superficie border border-borde-suave rounded-xl px-3 py-2 text-xs font-bold text-tinta flex items-center justify-between cursor-pointer"
          >
            <span>{{ estadoPedidoTemp.replace('_', ' ') }}</span>
            <PhCaretDown :size="14" class="text-tinta-suave" weight="bold" />
          </button>

          <div v-if="dropdownEstadoPedidoAbierto" class="absolute left-0 right-0 mt-1 py-1 bg-superficie border border-borde-suave rounded-xl shadow-xl z-50">
            <button v-for="est in (['NUEVO', 'EN_PREPARACION', 'LISTO', 'ENTREGADO', 'CANCELADO'] as EstadoPedido[])" :key="est"
              type="button"
              @click="estadoPedidoTemp = est; dropdownEstadoPedidoAbierto = false"
              class="w-full text-left px-3 py-2 text-xs font-bold transition-colors cursor-pointer"
              :class="estadoPedidoTemp === est ? 'bg-verde-marca/15 text-verde-marca dark:text-acento' : 'text-tinta hover:bg-fondo'"
            >
              {{ est.replace('_', ' ') }}
            </button>
          </div>
        </div>

        <!-- Estado del Pago -->
        <div class="relative dropdown-modal-container">
          <label class="text-[11px] font-bold text-tinta-suave uppercase block mb-1">Estado del Pago</label>
          <button 
            type="button"
            @click.stop="dropdownEstadoPagoAbierto = !dropdownEstadoPagoAbierto; dropdownEstadoPedidoAbierto = false"
            class="w-full bg-superficie border border-borde-suave rounded-xl px-3 py-2 text-xs font-bold text-tinta flex items-center justify-between cursor-pointer"
          >
            <span>{{ estadoPagoTemp }}</span>
            <PhCaretDown :size="14" class="text-tinta-suave" weight="bold" />
          </button>

          <div v-if="dropdownEstadoPagoAbierto" class="absolute left-0 right-0 mt-1 py-1 bg-superficie border border-borde-suave rounded-xl shadow-xl z-50">
            <button v-for="pago in (['PENDIENTE', 'PAGADO', 'RECHAZADO'] as EstadoPago[])" :key="pago"
              type="button"
              @click="estadoPagoTemp = pago; dropdownEstadoPagoAbierto = false"
              class="w-full text-left px-3 py-2 text-xs font-bold transition-colors cursor-pointer"
              :class="estadoPagoTemp === pago ? 'bg-verde-marca/15 text-verde-marca dark:text-acento' : 'text-tinta hover:bg-fondo'"
            >
              {{ pago }}
            </button>
          </div>
        </div>
      </div>

      <!-- Datos de Entrega -->
      <div class="space-y-2">
        <h4 class="text-xs font-bold uppercase text-verde-marca dark:text-acento tracking-wider">Datos de Entrega y Turno</h4>
        <div class="p-5 rounded-2xl bg-fondo border border-verde-marca/30 space-y-3 text-sm text-tinta">
          <div class="flex items-center justify-between">
            <div>
              <span class="text-xs text-tinta-suave block">Fecha y Turno</span>
              <strong class="text-base font-bold capitalize">{{ new Date(pedido.fechaTurno).toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' }) }} ({{ pedido.turno }})</strong>
            </div>
            <!-- Mantenemos exactamente text-purple-600 dark:text-purple-400 para retiro en sucursal -->
            <span class="px-3 py-1 rounded-xl text-xs font-bold uppercase" :class="pedido.tipoEntrega === 'envio' ? 'bg-blue-500/10 text-blue-600' : 'bg-purple-500/10 text-purple-600 dark:text-purple-400'">
              {{ pedido.tipoEntrega === 'envio' ? 'Envío a Domicilio' : 'Retiro en Sucursal' }}
            </span>
          </div>

          <div v-if="pedido.tipoEntrega === 'envio'" class="pt-2 border-t border-borde-suave/60 space-y-2">
            <div class="flex items-center justify-between">
              <div>
                <span class="text-xs text-tinta-suave block">Dirección de Entrega</span>
                <p class="font-bold text-sm">{{ pedido.calleEnvio }} {{ pedido.numeroEnvio }} ({{ pedido.ciudadEnvio }})</p>
              </div>
              <button @click="copiarDireccion(pedido)" class="px-3 py-1.5 rounded-xl bg-superficie border border-borde-suave hover:border-verde-marca text-xs font-bold flex items-center gap-1.5 cursor-pointer">
                <!-- Ícono en blanco en modo oscuro para que resalte -->
                <component :is="direccionCopiada ? PhCheck : PhCopy" :size="16" class="text-verde-marca dark:text-white" />
                <span>{{ direccionCopiada ? '¡Copiada!' : 'Copiar' }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Cliente -->
      <div class="space-y-2">
        <h4 class="text-xs font-bold uppercase text-tinta-suave tracking-wider">Cliente</h4>
        <div class="p-4 rounded-2xl bg-fondo border border-borde-suave text-sm text-tinta space-y-2">
          <p><strong>Nombre:</strong> {{ pedido.nombreCliente }} {{ pedido.apellidoCliente }}</p>
          <p><strong>Email:</strong> {{ pedido.emailCliente }}</p>
          <p><strong>Teléfono:</strong> <span class="font-mono">{{ pedido.telefonoCliente }}</span></p>
          <button @click="abrirWhatsapp(pedido.telefonoCliente, pedido.numeroPedido)" class="w-full justify-center mt-2 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold transition-all cursor-pointer shadow-sm">
            <PhWhatsappLogo :size="18" weight="fill" />
            <span>Chatear por WhatsApp</span>
          </button>
        </div>
      </div>

      <!-- Productos e Importes -->
      <div class="space-y-2">
        <h4 class="text-xs font-bold uppercase text-tinta-suave tracking-wider">Productos e Importes</h4>
        <div class="p-4 rounded-2xl bg-fondo border border-borde-suave space-y-3">
          <div v-for="item in pedido.items" :key="item.id" class="flex items-center justify-between text-sm text-tinta gap-3">
            <div class="flex items-center gap-3">
              <img :src="item.imagenProducto" :alt="item.nombreProducto" class="size-10 rounded-xl object-cover border border-borde-suave" />
              <span>{{ item.cantidad }}x {{ item.nombreProducto }}</span>
            </div>
            <span class="font-mono font-semibold">{{ formatPrecio(item.precioUnitario * item.cantidad) }}</span>
          </div>
          <div class="pt-3 border-t border-borde-suave space-y-1.5 text-xs text-tinta-suave">
            <div class="flex justify-between">
              <span>Subtotal Productos</span>
              <span class="font-mono font-semibold text-tinta">{{ formatPrecio(pedido.subtotal) }}</span>
            </div>
            <div v-if="pedido.costoEnvio > 0" class="flex justify-between">
              <span>Costo de Envío</span>
              <span class="font-mono font-semibold text-tinta">{{ formatPrecio(pedido.costoEnvio) }}</span>
            </div>
            <div class="pt-2 flex justify-between font-bold text-base text-tinta border-t border-borde-suave/60">
              <span>Total Final</span>
              <span class="font-mono text-verde-marca dark:text-acento text-lg">{{ formatPrecio(pedido.totalFinal) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Acciones -->
      <div class="flex items-center gap-3">
        <button @click="emit('cerrar')" class="w-1/3 py-3.5 rounded-full bg-superficie border border-borde-suave text-tinta text-xs font-bold hover:bg-fondo cursor-pointer">CANCELAR</button>
        <button @click="guardarCambios" class="w-2/3 py-3.5 rounded-full bg-verde-marca text-crema text-xs font-bold hover:bg-acento hover:text-verde-marca transition-all cursor-pointer shadow-md">GUARDAR CAMBIOS</button>
      </div>
    </div>
  </div>
</template>