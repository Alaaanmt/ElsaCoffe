<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useCart } from '@/composables/useCart'
import { PhArrowLeft, PhShieldCheck, PhCheckCircle, PhUser, PhEnvelope, PhPhone, PhStorefront, PhTruck, PhWarning } from '@phosphor-icons/vue'

const router = useRouter()
const { cartItems, formattedTotalPrice, tipoEntrega, costoEnvio, formattedTotalConEnvio, datosCliente, sucursalRetiro, fechaSeleccionada, turnoSeleccionado } = useCart()

const metodoPagoSeleccionado = ref<'mercadopago' | 'transferencia' | 'efectivo'>('mercadopago')
const procesandoPago = ref(false)
const pagoExitoso = ref(false)

const errorMessage = ref('')
const errorBoxRef = ref<HTMLElement | null>(null)

const mostrarError = (mensaje: string) => {
  errorMessage.value = mensaje
  nextTick(() => {
    errorBoxRef.value?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  })
}

const handlePagar = () => {
  errorMessage.value = ''

  if (tipoEntrega.value === 'envio') {
    if (!datosCliente.calle.trim() || !datosCliente.numero.trim() || !datosCliente.ciudad.trim()) {
      mostrarError('Por favor, completá los campos obligatorios de la dirección de envío (Calle, Número y Ciudad).')
      return
    }
  }

  procesandoPago.value = true
  setTimeout(() => {
    procesandoPago.value = false
    pagoExitoso.value = true
    cartItems.value = []
  }, 2000)
}
</script>

<template>
  <div class="min-h-screen bg-fondo pt-28 pb-24 px-5 sm:px-8 transition-colors duration-300">
    <div class="max-w-4xl mx-auto space-y-8">
      
      <!-- Botón para volver al paso anterior -->
      <button 
        @click="router.push('/checkout')" 
        class="inline-flex items-center gap-2 text-sm font-medium text-tinta-suave hover:text-tinta transition-colors cursor-pointer"
      >
        <PhArrowLeft :size="18" weight="bold" />
        <span>Volver a fecha y datos</span>
      </button>

      <!-- Cabecera -->
      <div class="space-y-1">
        <span class="text-xs uppercase tracking-[0.2em] font-medium text-tinta-suave block">Paso 2 de 2</span>
        <h1 class="font-titulo text-2xl md:text-3xl font-semibold text-tinta">Método de Pago y Resumen</h1>
      </div>

      <!-- Alerta de errores -->
      <div v-if="errorMessage" ref="errorBoxRef" class="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3 text-red-600 dark:text-red-400 shadow-sm">
        <PhWarning :size="20" weight="bold" class="shrink-0" />
        <span class="text-xs sm:text-sm font-medium">{{ errorMessage }}</span>
      </div>

      <!-- Pantalla de Éxito al abonar -->
      <div v-if="pagoExitoso" class="p-8 rounded-3xl bg-superficie border border-borde-suave text-center space-y-6 shadow-xl">
        <div class="size-20 mx-auto rounded-full bg-verde-marca/10 text-verde-marca dark:bg-acento/20 dark:text-acento flex items-center justify-center">
          <PhCheckCircle :size="48" weight="fill" />
        </div>
        <div class="space-y-2">
          <h2 class="font-titulo text-2xl font-semibold text-tinta">¡Pedido Confirmado con Éxito!</h2>
          <p class="text-sm text-tinta-suave max-w-md mx-auto">Tu orden en ELSA Coffee & Wine ya se encuentra en proceso de elaboración artesanal. Te enviamos el comprobante a {{ datosCliente.email }}.</p>
        </div>
        <button 
          @click="router.push('/')" 
          class="px-8 py-3.5 rounded-full bg-verde-marca text-crema text-sm font-medium hover:bg-acento hover:text-verde-marca transition-all cursor-pointer shadow-md inline-block"
        >
          Volver al Inicio
        </button>
      </div>

      <!-- Contenedor Principal -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- Columna Izquierda: Métodos de Pago, Entrega y Datos (7 cols) -->
        <div class="lg:col-span-7 space-y-6">
          
          <!-- Bloque de Métodos de Pago -->
          <div class="p-6 rounded-2xl bg-superficie border border-borde-suave space-y-6">
            <h3 class="font-titulo text-lg font-semibold text-tinta">Seleccioná cómo querés abonar</h3>

            <div class="space-y-3">
              <!-- Mercado Pago -->
              <label 
                class="flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer"
                :class="metodoPagoSeleccionado === 'mercadopago' ? 'border-verde-marca bg-verde-marca/5 dark:bg-fondo/60 dark:border-verde-marca' : 'border-borde-suave bg-fondo dark:bg-superficie/40 dark:border-borde-suave'"
              >
                <div class="flex items-center gap-3">
                  <input type="radio" v-model="metodoPagoSeleccionado" value="mercadopago" class="accent-verde-marca" />
                  <div class="flex items-center gap-3">
                    <div class="size-8 rounded-full bg-[#009EE3]/10 flex items-center justify-center text-[#009EE3] font-bold text-xs shrink-0">
                      MP
                    </div>
                    <div>
                      <span class="text-sm font-semibold text-tinta block">Mercado Pago</span>
                      <span class="text-xs text-tinta-suave">Tarjetas, dinero en cuenta o QR</span>
                    </div>
                  </div>
                </div>
              </label>

              <!-- Transferencia Bancaria -->
              <label 
                class="flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer"
                :class="metodoPagoSeleccionado === 'transferencia' ? 'border-verde-marca bg-verde-marca/5 dark:bg-fondo/60 dark:border-verde-marca' : 'border-borde-suave bg-fondo dark:bg-superficie/40 dark:border-borde-suave'"
              >
                <div class="flex items-center gap-3">
                  <input type="radio" v-model="metodoPagoSeleccionado" value="transferencia" class="accent-verde-marca" />
                  <div>
                    <span class="text-sm font-semibold text-tinta block">Transferencia Bancaria</span>
                    <span class="text-xs text-tinta-suave">Alias / CBU (Validación manual)</span>
                  </div>
                </div>
              </label>

              <!-- Efectivo -->
              <label 
                class="flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer"
                :class="metodoPagoSeleccionado === 'efectivo' ? 'border-verde-marca bg-verde-marca/5 dark:bg-fondo/60 dark:border-verde-marca' : 'border-borde-suave bg-fondo dark:bg-superficie/40 dark:border-borde-suave'"
              >
                <div class="flex items-center gap-3">
                  <input type="radio" v-model="metodoPagoSeleccionado" value="efectivo" class="accent-verde-marca" />
                  <div class="flex items-center gap-3">
                    <div class="size-8 rounded-full bg-verde-marca/10 flex items-center justify-center text-verde-marca font-bold text-xs shrink-0">
                      $
                    </div>
                    <div>
                      <span class="text-sm font-semibold text-tinta block">Efectivo al recibir / retirar</span>
                      <span class="text-xs text-tinta-suave">Abonás de forma presencial</span>
                    </div>
                  </div>
                </div>
              </label>
            </div>

            <div class="pt-4 border-t border-borde-suave flex items-center gap-2 text-xs text-tinta-suave">
              <PhShieldCheck :size="18" class="text-verde-marca dark:text-acento shrink-0" />
              <span>Transacciones seguras y encriptadas mediante protocolo SSL.</span>
            </div>
          </div>

          <!-- Bloque de Información de Entrega (Retiro vs Envío) -->
          <div class="p-6 rounded-2xl bg-superficie border border-borde-suave space-y-4">
            <h3 class="font-titulo text-base font-semibold text-tinta flex items-center gap-2">
              <component :is="tipoEntrega === 'retiro' ? PhStorefront : PhTruck" :size="20" class="text-verde-marca dark:text-acento" />
              <span>{{ tipoEntrega === 'retiro' ? 'Información de Retiro' : 'Dirección de Envío' }}</span>
            </h3>

            <!-- Si es Retiro -->
            <div v-if="tipoEntrega === 'retiro'" class="space-y-2 text-sm text-tinta-suave">
              <div class="flex items-center gap-2">
                <span class="font-semibold text-tinta">Sucursal:</span>
                <span>{{ sucursalRetiro }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="font-semibold text-tinta">Modalidad:</span>
                <span class="text-verde-marca dark:text-acento font-medium">Retiro gratuito en local</span>
              </div>
              <!-- Fecha y Turno (Solo visible si es retiro) -->
              <div v-if="fechaSeleccionada && turnoSeleccionado" class="flex items-center gap-2 pt-1 border-t border-borde-suave/60">
                <span class="font-semibold text-tinta">Fecha y Turno:</span>
                <span class="capitalize text-tinta">
                  {{ new Date(fechaSeleccionada).toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short' }) }} - 
                  <span class="uppercase font-mono text-verde-marca dark:text-acento font-bold">{{ turnoSeleccionado }}</span>
                </span>
              </div>
            </div>

            <!-- Si es Envío a Domicilio -->
            <div v-else class="space-y-4 pt-1">
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div class="sm:col-span-2">
                  <label class="text-xs font-medium text-tinta-suave block mb-1">Calle *</label>
                  <input v-model="datosCliente.calle" type="text" placeholder="Ej: Av. Rivadavia" class="w-full bg-fondo border border-borde-suave rounded-xl px-3 py-2 text-sm text-tinta focus:outline-none focus:border-verde-marca" />
                </div>
                <div>
                  <label class="text-xs font-medium text-tinta-suave block mb-1">Número *</label>
                  <input v-model="datosCliente.numero" type="text" placeholder="Ej: 4500" class="w-full bg-fondo border border-borde-suave rounded-xl px-3 py-2 text-sm text-tinta focus:outline-none focus:border-verde-marca font-mono" />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label class="text-xs font-medium text-tinta-suave block mb-1">Depto / Piso (Op.)</label>
                  <input v-model="datosCliente.departamento" type="text" placeholder="Ej: 2° B" class="w-full bg-fondo border border-borde-suave rounded-xl px-3 py-2 text-sm text-tinta focus:outline-none focus:border-verde-marca" />
                </div>
                <div>
                  <label class="text-xs font-medium text-tinta-suave block mb-1">Ciudad / Localidad *</label>
                  <input v-model="datosCliente.ciudad" type="text" placeholder="Ej: CABA / San Justo" class="w-full bg-fondo border border-borde-suave rounded-xl px-3 py-2 text-sm text-tinta focus:outline-none focus:border-verde-marca" />
                </div>
                <div v-if="datosCliente.codigoPostal">
                  <label class="text-xs font-medium text-tinta-suave block mb-1">Código Postal</label>
                  <input v-model="datosCliente.codigoPostal" type="text" readonly class="w-full bg-fondo/60 border border-borde-suave rounded-xl px-3 py-2 text-sm text-tinta-suave font-mono cursor-not-allowed" />
                </div>
              </div>
            </div>
          </div>

          <!-- Datos de Contacto -->
          <div class="p-6 rounded-2xl bg-superficie border border-borde-suave space-y-4">
            <h3 class="font-titulo text-base font-semibold text-tinta">Datos de Contacto Registrados</h3>
            <div class="space-y-2 text-sm text-tinta-suave">
              <div class="flex items-center gap-2">
                <PhUser :size="16" class="text-verde-marca dark:text-acento shrink-0" />
                <span class="text-tinta font-medium">{{ datosCliente.nombre }} {{ datosCliente.apellido }}</span>
              </div>
              <div class="flex items-center gap-2">
                <PhEnvelope :size="16" class="text-verde-marca dark:text-acento shrink-0" />
                <span>{{ datosCliente.email }}</span>
              </div>
              <div class="flex items-center gap-2">
                <PhPhone :size="16" class="text-verde-marca dark:text-acento shrink-0" />
                <span class="font-mono">{{ datosCliente.telefono }}</span>
              </div>
            </div>
          </div>

        </div>

        <!-- Columna Derecha: Resumen -->
        <div class="lg:col-span-5 space-y-6">
          <div class="p-6 rounded-2xl bg-superficie border border-borde-suave space-y-6">
            <h3 class="font-titulo text-lg font-semibold text-tinta">Resumen de tu pedido</h3>

            <div class="space-y-3 max-h-60 overflow-y-auto pr-1">
              <div v-for="item in cartItems" :key="item.id" class="flex items-center justify-between gap-3 text-sm">
                <div class="flex items-center gap-3 min-w-0">
                  <img :src="item.imagen" :alt="item.nombre" class="size-12 rounded-xl object-cover border border-borde-suave shrink-0" />
                  <div class="min-w-0">
                    <span class="text-xs font-mono font-bold text-tinta-suave block">{{ item.cantidad }}x</span>
                    <span class="text-tinta font-medium truncate block">{{ item.nombre }}</span>
                  </div>
                </div>
                <span class="font-mono text-xs font-semibold text-tinta shrink-0">$ {{ (item.precioNum * item.cantidad).toLocaleString('es-AR') }}</span>
              </div>
            </div>

            <div class="pt-4 border-t border-borde-suave space-y-2 text-sm">
              <div class="flex justify-between text-tinta-suave">
                <span>Subtotal</span>
                <span class="font-mono text-tinta">{{ formattedTotalPrice }}</span>
              </div>
              <div class="flex justify-between text-tinta-suave">
                <span>Entrega</span>
                <span class="font-mono text-tinta">
                  {{ tipoEntrega === 'retiro' ? 'Retiro en local (Gratis)' : `$ ${costoEnvio.toLocaleString('es-AR')}` }}
                </span>
              </div>
              <div class="flex justify-between text-base font-semibold text-tinta pt-2 border-t border-borde-suave">
                <span>Total Final</span>
                <span class="font-mono text-lg text-tinta">{{ formattedTotalConEnvio }}</span>
              </div>
            </div>

            <button 
              @click="handlePagar"
              :disabled="procesandoPago"
              class="w-full py-4 rounded-full bg-verde-marca text-crema text-sm font-medium hover:bg-acento hover:text-verde-marca transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span v-if="procesandoPago">Conectando con Mercado Pago...</span>
              <span v-else>REALIZAR PEDIDO</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>