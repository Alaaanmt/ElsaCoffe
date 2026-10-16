<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useCart } from '@/composables/useCart'
import { useCheckout } from '@/composables/useCheckout'
import { useOrdersStore } from '@/stores/orders'
import { PhArrowLeft, PhShieldCheck, PhCheckCircle, PhUser, PhEnvelope, PhPhone, PhStorefront, PhTruck, PhWarning, PhCopy, PhWhatsappLogo } from '@phosphor-icons/vue'
import { useTheme } from '@/composables/useTheme'
import { negocio } from '@/data/business'

const { tema } = useTheme()
const router = useRouter()
const { cartItems, formattedTotalPrice } = useCart()
const { tipoEntrega, costoEnvio, datosCliente, sucursalRetiro, fechaSeleccionada, turnoSeleccionado, metodoPagoSeleccionado } = useCheckout()
const ordersStore = useOrdersStore()


const procesandoPago = ref(false)
const pagoExitoso = ref(false)
const numeroPedido = ref(0)
const textoCopiado = ref(false)


const itemsRespaldo = ref<any[]>([])
const totalFinalRespaldo = ref('')
const subtotalRespaldo = ref('')

const errorMessage = ref('')
const errorBoxRef = ref<HTMLElement | null>(null)

const calcularTotalConEnvioNum = () => {
  const sub = cartItems.value.reduce((sum, item) => sum + (item.precioNum * item.cantidad), 0)
  return sub + costoEnvio.value
}

const mostrarError = (mensaje: string) => {
  errorMessage.value = mensaje
  nextTick(() => {
    errorBoxRef.value?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  })
}

const generarMensajePedido = () => {
  const productosListado = itemsRespaldo.value.map(item => {
    const subsub = item.precioNum * item.cantidad
    return `• ${item.cantidad}x ${item.nombre} ($${subsub.toLocaleString('es-AR')})`
  }).join('\n')

  const fechaFormateada = new Date(fechaSeleccionada.value).toLocaleDateString('es-AR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  })

  return `🍰 *¡NUEVO PEDIDO EN LA WEB!* (Pedido #${numeroPedido.value})\n\n` +
    `👤 *CLIENTE*\n` +
    `Nombre: ${datosCliente.nombre} ${datosCliente.apellido}\n` +
    `Email: ${datosCliente.email}\n` +
    `Teléfono: ${datosCliente.telefono}\n\n` +
    `📦 *DETALLE*\n${productosListado}\n\n` +
    `💰 *Subtotal:* ${subtotalRespaldo.value}\n` +
    `🚚 *Modalidad:* ${tipoEntrega.value === 'retiro' ? 'Retiro en sucursal' : `Envío a domicilio (${datosCliente.calle} ${datosCliente.numero},${datosCliente.ciudad})`}\n` +
    `📅 *Fecha y Turno:* ${fechaFormateada} - ${turnoSeleccionado.value.toUpperCase()}\n` +
    `🏷️ *Método de pago:* ${metodoPagoSeleccionado.value.toUpperCase()}\n` +
    `💵 *TOTAL FINAL:* ${totalFinalRespaldo.value}\n\n` +
    (datosCliente.notas ? `📝 *Notas:* ${datosCliente.notas}\n\n` : '') +
    `¡Hola Elsa! Te comparto los datos de mi pedido para coordinar.`
}

const handlePagar = () => {
  errorMessage.value = ''
  procesandoPago.value = true

  itemsRespaldo.value = [...cartItems.value]
  const subtotalNum = cartItems.value.reduce((sum, item) => sum + (item.precioNum * item.cantidad), 0)
  const totalNum = calcularTotalConEnvioNum()

  // Formateamos la fecha a YYYY-MM-DD para compatibilidad con el Admin
  const fechaObj = fechaSeleccionada.value ? new Date(fechaSeleccionada.value) : new Date()
  const fechaStr = fechaObj.toISOString().split('T')[0] as string

  //CREAMOS EL PEDIDO EN LA STORE GLOBAL (Pinia + LocalStorage)
  const pedidoCreado = ordersStore.crearPedido({
    nombreCliente: datosCliente.nombre,
    apellidoCliente: datosCliente.apellido,
    emailCliente: datosCliente.email,
    telefonoCliente: datosCliente.telefono,
    tipoEntrega: tipoEntrega.value, // 'retiro' | 'envio'
    calleEnvio: datosCliente.calle || '',
    numeroEnvio: datosCliente.numero || '',
    ciudadEnvio: datosCliente.ciudad || '',
    costoEnvio: costoEnvio.value,
    subtotal: subtotalNum,
    totalFinal: totalNum,
    metodoPago: metodoPagoSeleccionado.value, // 'mercadopago' | 'transferencia' | 'efectivo'
    estadoPago: metodoPagoSeleccionado.value === 'mercadopago' ? 'PAGADO' : 'PENDIENTE',
    estadoPedido: 'NUEVO',
    fechaTurno: fechaStr,
    turno: turnoSeleccionado.value,
    notasCliente: datosCliente.notas || '',
    items: cartItems.value.map(item => ({
      id: item.id.toString(),
      nombreProducto: item.nombre,
      cantidad: item.cantidad,
      precioUnitario: item.precioNum,
      imagenProducto: item.imagen
    }))
  })

  // Guardamos el número de pedido autogenerado (#1041, #1042, etc.)
  numeroPedido.value = pedidoCreado.numeroPedido

  totalFinalRespaldo.value = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(totalNum)
  subtotalRespaldo.value = formattedTotalPrice.value

  setTimeout(() => {
    procesandoPago.value = false
    pagoExitoso.value = true
    cartItems.value = [] // Vaciar el carrito
  }, 1000)
}

const enviarPorWhatsApp = () => {
  const telefonoLimpio = negocio.telefono.replace(/\+/g, '')
  const mensaje = generarMensajePedido()
  const url = `https://wa.me/${telefonoLimpio}?text=${encodeURIComponent(mensaje)}`
  window.open(url, '_blank')
}

const copiarDatosPedido = () => {
  const mensaje = generarMensajePedido()
  navigator.clipboard.writeText(mensaje)
  textoCopiado.value = true
  setTimeout(() => { textoCopiado.value = false }, 3000)
}
</script>

<template>
  <div class="min-h-screen bg-fondo pt-28 pb-24 px-5 sm:px-8 transition-colors duration-300">
    <div class="max-w-4xl mx-auto space-y-8">
      <button v-if="!pagoExitoso" @click="router.push('/checkout')"
        class="inline-flex items-center gap-2 text-sm font-medium text-tinta-suave hover:text-tinta transition-colors cursor-pointer">
        <PhArrowLeft :size="18" weight="bold" />
        <span>Volver a fecha y datos</span>
      </button>

      <div v-if="!pagoExitoso" class="space-y-1">
        <span class="text-xs uppercase tracking-[0.2em] font-medium text-tinta-suave block">Paso 2 de 2</span>
        <h1 class="font-titulo text-2xl md:text-3xl font-semibold text-tinta">Método de Pago y Confirmación</h1>
      </div>

      <!-- Pantalla de Éxito / WhatsApp -->
      <div v-if="pagoExitoso"
        class="p-8 sm:p-12 rounded-3xl bg-superficie border border-borde-suave text-center space-y-8 shadow-xl max-w-2xl mx-auto">
        <div
          class="size-20 mx-auto rounded-full bg-verde-marca/10 text-verde-marca dark:bg-acento/20 dark:text-acento flex items-center justify-center">
          <PhCheckCircle :size="48" weight="fill" />
        </div>

        <div class="space-y-2">
          <h2 class="font-titulo text-2xl md:text-3xl font-semibold text-tinta">¡Tu pedido fue registrado!</h2>
          <p class="font-mono text-sm text-tinta-suave">Pedido #{{ numeroPedido }} · Total: <span
              class="text-tinta font-bold">{{ totalFinalRespaldo }}</span></p>
        </div>

        <p class="text-sm text-tinta-suave max-w-md mx-auto leading-relaxed">
          Avisale a Elsa por WhatsApp para coordinar el pago, recibir el alias de transferencia o confirmar los detalles
          finales de tu encargo.
        </p>

        <div class="space-y-3 pt-2">
          <button @click="enviarPorWhatsApp"
            class="w-full py-4 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white text-sm md:text-base font-semibold transition-all cursor-pointer shadow-md flex items-center justify-center gap-2.5">
            <PhWhatsappLogo :size="22" weight="fill" />
            <span>Enviar pedido por WhatsApp</span>
          </button>

          <button @click="copiarDatosPedido"
            class="w-full py-3.5 rounded-full bg-fondo border border-borde-suave text-tinta text-sm font-medium hover:border-verde-marca transition-all cursor-pointer flex items-center justify-center gap-2">
            <PhCopy :size="18" />
            <span>{{ textoCopiado ? '¡Datos copiados al portapapeles!' : 'Copiar datos del pedido' }}</span>
          </button>
        </div>

        <div class="pt-4 border-t border-borde-suave text-xs text-tinta-suave/80 space-y-2">
          <p>Si WhatsApp no se abre o no podés enviar el mensaje, podés copiarlo y comunicarte con el negocio por otro
            medio.</p>
          <button @click="router.push('/')"
            class="text-verde-marca dark:text-acento font-medium hover:underline pt-2 inline-block cursor-pointer">
            Volver al inicio de la tienda
          </button>
        </div>
      </div>

      <!-- Contenedor Principal -->
      <div v-else class="space-y-6">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <!-- Métodos de Pago -->
          <div
            class="lg:col-span-7 p-6 rounded-2xl bg-superficie border border-borde-suave flex flex-col justify-between space-y-6">
            <div class="space-y-6">
              <h3 class="font-titulo text-lg font-semibold text-tinta">Seleccioná cómo querés abonar</h3>
              <div class="space-y-3">
                <label class="flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer"
                  :class="metodoPagoSeleccionado === 'mercadopago' ? 'border-verde-marca bg-verde-marca/5 dark:bg-fondo/60 dark:border-verde-marca' : 'border-borde-suave bg-fondo dark:bg-superficie/40'">
                  <div class="w-full flex items-center justify-between gap-3">
                    <div class="flex items-center gap-3">
                      <input type="radio" v-model="metodoPagoSeleccionado" value="mercadopago"
                        class="accent-verde-marca" />
                      <div>
                        <span class="text-sm font-semibold text-tinta block">Mercado Pago</span>
                        <span class="text-xs text-tinta-suave">Tarjetas, dinero en cuenta o QR</span>
                      </div>
                    </div>
                    <div class="w-10 shrink-0">
                      <img src="@/assets/img/mercado-pago-logo.png" class="w-full h-full object-cover">
                    </div>
                  </div>
                </label>

                <label class="flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer"
                  :class="metodoPagoSeleccionado === 'transferencia' ? 'border-verde-marca bg-verde-marca/5 dark:bg-fondo/60 dark:border-verde-marca' : 'border-borde-suave bg-fondo dark:bg-superficie/40'">
                  <div class="w-full flex items-center justify-between gap-3">
                    <div class="flex items-center gap-3">
                      <input type="radio" v-model="metodoPagoSeleccionado" value="transferencia"
                        class="accent-verde-marca" />
                      <div>
                        <span class="text-sm font-semibold text-tinta block">Transferencia Bancaria</span>
                        <span class="text-xs text-tinta-suave">Alias / CBU (Validación manual)</span>
                      </div>
                    </div>
                    <div class="shrink-0">
                      <img src="@/assets/img/bank.svg" alt="Banco" class="size-8 dark:hidden" />
                      <img src="@/assets/img/bank-white.svg" alt="Banco" class="size-8 hidden dark:block" />
                    </div>
                  </div>
                </label>

                <label class="flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer"
                  :class="metodoPagoSeleccionado === 'efectivo' ? 'border-verde-marca bg-verde-marca/5 dark:bg-fondo/60 dark:border-verde-marca' : 'border-borde-suave bg-fondo dark:bg-superficie/40'">
                  <div class="w-full flex items-center justify-between gap-3">
                    <div class="flex items-center gap-3">
                      <input type="radio" v-model="metodoPagoSeleccionado" value="efectivo"
                        class="accent-verde-marca" />
                      <div>
                        <span class="text-sm font-semibold text-tinta block">Efectivo al recibir / retirar</span>
                        <span class="text-xs text-tinta-suave">Abonás de forma presencial</span>
                      </div>
                    </div>
                    <div class="shrink-0">
                      <img src="@/assets/img/money.svg" alt="Efectivo" class="size-8 dark:hidden" />
                      <img src="@/assets/img/money-white.svg" alt="Efectivo" class="size-8 hidden dark:block" />
                    </div>
                  </div>
                </label>
              </div>
            </div>

            <div class="pt-4 border-t border-borde-suave flex items-center gap-2 text-xs text-tinta-suave">
              <PhShieldCheck :size="18" class="text-verde-marca dark:text-acento shrink-0" />
              <span>Transacciones seguras y coordinadas directamente con el comercio.</span>
            </div>
          </div>

          <!-- Tarjeta Derecha: Resumen de Pedido -->
          <div
            class="lg:col-span-5 p-6 rounded-2xl bg-superficie border border-borde-suave flex flex-col justify-between space-y-6">
            <div class="space-y-4">
              <h3 class="font-titulo text-lg font-semibold text-tinta">Resumen de tu pedido</h3>

              <!-- Listado de Productos -->
              <div class="space-y-3 max-h-52 overflow-y-auto pr-1">
                <div v-for="item in cartItems" :key="item.id" class="flex items-center justify-between gap-3 text-sm">
                  <div class="flex items-center gap-3 min-w-0">
                    <img :src="item.imagen" :alt="item.nombre"
                      class="size-12 rounded-xl object-cover border border-borde-suave shrink-0" />
                    <div class="min-w-0">
                      <span class="text-xs font-mono font-bold text-tinta-suave block">{{ item.cantidad }}x</span>
                      <span class="text-tinta font-medium truncate block">{{ item.nombre }}</span>
                    </div>
                  </div>
                  <span class="font-mono text-xs font-semibold text-tinta shrink-0">$ {{ (item.precioNum *
                    item.cantidad).toLocaleString('es-AR') }}</span>
                </div>
              </div>

              <!-- Bloque Relleno UX: SOLO se muestra si hay 1 sola torta -->
              <div v-if="cartItems.length === 1"
                class="p-3.5 rounded-xl bg-fondo/60 border border-borde-suave/80 space-y-1.5 text-xs text-tinta-suave transition-all">
                <div class="flex items-center gap-2 font-semibold text-tinta">
                  <span class="size-2 rounded-full bg-verde-marca dark:bg-acento shrink-0"></span>
                  <span>Garantía de Frescura Elsa</span>
                </div>
                <p class="text-[11px] leading-relaxed">
                  Cada encargo se elabora artesanalmente en nuestro taller el mismo día de tu turno de entrega.
                </p>
              </div>
            </div>

            <!-- Desglose de Importes y Botón -->
            <div class="space-y-4 pt-4 border-t border-borde-suave">
              <div class="space-y-2 text-sm">
                <div class="flex justify-between text-tinta-suave">
                  <span>Subtotal</span>
                  <span class="font-mono text-tinta">{{ formattedTotalPrice }}</span>
                </div>
                <div class="flex justify-between text-tinta-suave">
                  <span>Entrega</span>
                  <span class="font-mono text-tinta">{{ tipoEntrega === 'retiro' ? 'Retiro en local (Gratis)' : `$
                    ${costoEnvio.toLocaleString('es-AR')}` }}</span>
                </div>
                <div class="flex justify-between text-base font-semibold text-tinta pt-2 border-t border-borde-suave">
                  <span>Total Final</span>
                  <span class="font-mono text-lg text-tinta">$ {{(cartItems.reduce((sum, item) => sum + (item.precioNum
                    * item.cantidad), 0) + costoEnvio).toLocaleString('es-AR') }}</span>
                </div>
              </div>

              <button @click="handlePagar" :disabled="procesandoPago"
                class="w-full py-4 rounded-full bg-verde-marca text-crema text-sm font-medium hover:bg-acento hover:text-verde-marca transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 disabled:opacity-50">
                <span v-if="procesandoPago">Registrando pedido...</span>
                <span v-else>REALIZAR PEDIDO</span>
              </button>
            </div>
          </div>

        </div>

        <!-- Detalles de tu pedido -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div class="lg:col-span-7 p-6 rounded-2xl bg-superficie border border-borde-suave space-y-4">
            <h3 class="font-titulo text-base font-semibold text-tinta flex items-center gap-2">
              <component :is="tipoEntrega === 'retiro' ? PhStorefront : PhTruck" :size="20"
                class="text-verde-marca dark:text-acento" />
              <span>Detalles de tu pedido</span>
            </h3>

            <div class="space-y-3 text-sm text-tinta-suave divide-y divide-borde-suave/60">
              <div class="pt-2 space-y-1">
                <span class="text-xs uppercase tracking-wider text-tinta-suave font-medium block">Entrega</span>
                <p class="text-tinta font-medium">{{ tipoEntrega === 'retiro' ? `Retiro en local (${sucursalRetiro})` :
                  `Envío a domicilio: ${datosCliente.calle} ${datosCliente.numero}, ${datosCliente.ciudad}` }}</p>
              </div>

              <div class="pt-3 space-y-1">
                <span class="text-xs uppercase tracking-wider text-tinta-suave font-medium block">Fecha y Horario</span>
                <p class="text-tinta font-medium capitalize">{{ new Date(fechaSeleccionada).toLocaleDateString('es-AR',
                  { weekday: 'long', day: 'numeric', month: 'long' }) }} - Turno <span
                    class="uppercase font-mono text-verde-marca dark:text-acento font-bold">{{ turnoSeleccionado
                    }}</span></p>
              </div>

              <div class="pt-3 space-y-1">
                <span class="text-xs uppercase tracking-wider text-tinta-suave font-medium block">Contacto</span>
                <p class="text-tinta font-medium">{{ datosCliente.nombre }} {{ datosCliente.apellido }} · <span
                    class="font-mono">{{ datosCliente.telefono }}</span></p>
                <p class="text-xs text-tinta-suave">{{ datosCliente.email }}</p>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>