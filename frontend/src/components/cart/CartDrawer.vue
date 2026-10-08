<script setup lang="ts">
import { useCart } from '@/composables/useCart'
import { PhX, PhTrash, PhPlus, PhMinus, PhShoppingBag, PhArrowRight, PhStorefront, PhTruck, PhWarning } from '@phosphor-icons/vue'
import { ref } from 'vue'

const {
  isCartOpen,
  cartItems,
  updateQuantity,
  removeFromCart,
  totalItems,
  formattedTotalPrice,
  tipoEntrega,
  seleccionarTipoEntrega,
  costoEnvio,
  calcularCostoEnvio,
  formattedTotalConEnvio
} = useCart()

const emit = defineEmits(['iniciar-checkout'])

const codigoPostalInput = ref('')
const errorCp = ref('')

const handleCalcularEnvio = () => {
  const cpLimpio = codigoPostalInput.value.trim()
  
  // Validar que sean exactamente 4 dígitos numéricos
  if (!/^\d{4}$/.test(cpLimpio)) {
    errorCp.value = 'Código postal incorrecto. Debe tener 4 dígitos numéricos.'
    costoEnvio.value = 0
    return
  }

  errorCp.value = ''
  seleccionarTipoEntrega('envio')
  calcularCostoEnvio(cpLimpio)
}

const handleIniciarCompra = () => {
  // Si eligió envío, obligamos a que tenga el CP de 4 dígitos y esté calculado
  if (tipoEntrega.value === 'envio') {
    const cpLimpio = codigoPostalInput.value.trim()
    if (!/^\d{4}$/.test(cpLimpio)) {
      errorCp.value = 'Por favor, ingresá un código postal válido de 4 dígitos.'
      return
    }
    if (costoEnvio.value === 0) {
      errorCp.value = 'Por favor, hacé clic en "Calcular" para obtener el costo de envío antes de continuar.'
      return
    }
  }
  
  // Si eligió retiro en tienda, no hace falta validar nada del código postal
  errorCp.value = ''
  isCartOpen.value = false
  emit('iniciar-checkout')
}
</script>

<template>
  <!-- Overlay oscuro de fondo -->
  <Transition enter-active-class="transition-opacity duration-300 ease-out" enter-from-class="opacity-0"
    enter-to-class="opacity-100" leave-active-class="transition-opacity duration-200 ease-in"
    leave-from-class="opacity-100" leave-to-class="opacity-0">
    <div v-if="isCartOpen" @click="isCartOpen = false" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]" />
  </Transition>

  <!-- Panel Lateral (Drawer) -->
  <Transition enter-active-class="transform transition duration-300 ease-out" enter-from-class="translate-x-full"
    enter-to-class="translate-x-0" leave-active-class="transform transition duration-200 ease-in"
    leave-from-class="translate-x-0" leave-to-class="translate-x-full">
    <div v-if="isCartOpen"
      class="fixed inset-y-0 right-0 z-[101] w-full max-w-md bg-fondo border-l border-borde-suave shadow-2xl flex flex-col">

      <!-- Cabecera -->
      <div class="p-6 border-b border-borde-suave flex items-center justify-between">
        <div class="flex items-center gap-2">
          <PhShoppingBag :size="22" weight="fill" class="text-verde-marca dark:text-acento" />
          <h3 class="font-titulo text-xl font-semibold text-tinta">Tu Carrito</h3>
          <span
            class="text-xs font-mono px-2 py-0.5 rounded-full bg-superficie-alta text-tinta-suave border border-borde-suave">
            {{ totalItems }}
          </span>
        </div>
        <button @click="isCartOpen = false"
          class="size-9 rounded-full bg-superficie border border-borde-suave flex items-center justify-center text-tinta-suave hover:text-tinta transition-colors cursor-pointer">
          <PhX :size="18" weight="bold" />
        </button>
      </div>

      <!-- Listado de Productos -->
      <div class="flex-1 overflow-y-auto p-6 space-y-4">
        <div v-if="cartItems.length === 0" class="text-center py-16 space-y-4">
          <div
            class="size-16 mx-auto rounded-full bg-superficie border border-borde-suave flex items-center justify-center text-tinta-suave">
            <PhShoppingBag :size="32" weight="regular" />
          </div>
          <p class="font-titulo text-lg font-medium text-tinta">Tu carrito está vacío</p>
          <p class="text-xs text-tinta-suave max-w-xs mx-auto">Explorá nuestra sección de tortas y agregá tus favoritas.
          </p>
        </div>

        <div v-for="item in cartItems" :key="item.id"
          class="flex items-center gap-4 p-4 rounded-2xl bg-superficie border border-borde-suave">
          <img :src="item.imagen" :alt="item.nombre"
            class="size-16 rounded-xl object-cover border border-borde-suave shrink-0" />
          <div class="flex-1 min-w-0">
            <h4 class="font-titulo text-sm font-semibold text-tinta truncate">{{ item.nombre }}</h4>
            <span class="text-xs text-tinta-suave block mt-0.5">{{ item.precioStr }} c/u</span>
            <div class="flex items-center gap-3 mt-3">
              <div class="inline-flex items-center border border-borde-suave rounded-lg bg-fondo overflow-hidden">
                <button @click="updateQuantity(item.id, -1)"
                  class="px-2.5 py-1 text-tinta-suave hover:text-tinta transition-colors cursor-pointer">
                  <PhMinus :size="12" weight="bold" />
                </button>
                <span class="px-3 text-xs font-mono font-semibold text-tinta">{{ item.cantidad }}</span>
                <button @click="updateQuantity(item.id, 1)"
                  class="px-2.5 py-1 text-tinta-suave hover:text-tinta transition-colors cursor-pointer">
                  <PhPlus :size="12" weight="bold" />
                </button>
              </div>
              <button @click="removeFromCart(item.id)"
                class="text-red-500 hover:text-red-600 p-1 transition-colors cursor-pointer">
                <PhTrash :size="16" weight="regular" />
              </button>
            </div>
          </div>
          <div class="text-right">
            <span class="font-mono text-sm font-semibold text-tinta">$ {{ (item.precioNum *
              item.cantidad).toLocaleString('es-AR') }}</span>
          </div>
        </div>

        <!-- Opciones de Entrega (Retiro vs Envío con CP) -->
        <div v-if="cartItems.length > 0" class="pt-6 border-t border-borde-suave space-y-4">
          <h4 class="text-xs font-semibold uppercase tracking-wider text-tinta">Método de Entrega</h4>
          <div class="grid grid-cols-2 gap-3">
            <button @click="seleccionarTipoEntrega('retiro'); errorCp = ''"
              class="p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1"
              :class="tipoEntrega === 'retiro' ? 'border-verde-marca bg-verde-marca/5 text-tinta' : 'border-borde-suave bg-superficie text-tinta-suave'">
              <div class="flex items-center gap-2 font-medium text-xs">
                <PhStorefront :size="16" weight="fill" />
                <span>Retiro gratis</span>
              </div>
              <span class="text-[10px] text-tinta-suave">José León Suárez 2015</span>
            </button>
            <button @click="tipoEntrega = 'envio'"
              class="p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1"
              :class="tipoEntrega === 'envio' ? 'border-verde-marca bg-verde-marca/5 text-tinta' : 'border-borde-suave bg-superficie text-tinta-suave'">
              <div class="flex items-center gap-2 font-medium text-xs">
                <PhTruck :size="16" weight="fill" />
                <span>Envío a domicilio</span>
              </div>
              <span class="text-[10px] text-tinta-suave">Calculá con tu CP</span>
            </button>
          </div>

          <!-- Input de Código Postal si elige Envío -->
          <div v-if="tipoEntrega === 'envio'" class="space-y-2 pt-2">
            <div class="flex gap-2">
              <input v-model="codigoPostalInput" type="text" maxlength="4" placeholder="Ej: 1440 (4 dígitos)"
                class="flex-1 bg-superficie border border-borde-suave rounded-xl px-4 py-2 text-sm text-tinta focus:outline-none focus:border-verde-marca font-mono" />
              <button @click="handleCalcularEnvio"
                class="px-4 py-2 bg-verde-marca text-crema text-xs font-medium rounded-xl hover:bg-acento hover:text-verde-marca transition-all cursor-pointer">
                Calcular
              </button>
            </div>

            <!-- Mensaje de error de CP -->
            <p v-if="errorCp" class="text-xs text-red-500 font-medium flex items-center gap-1">
              <PhWarning :size="14" weight="bold" /> {{ errorCp }}
            </p>

            <p v-if="costoEnvio > 0 && !errorCp" class="text-xs text-verde-marca font-medium">
              Costo de envío: $ {{ costoEnvio.toLocaleString('es-AR') }}
            </p>
          </div>
        </div>
      </div>

      <!-- Pie del Drawer (Totales e Iniciar Compra) -->
      <div v-if="cartItems.length > 0" class="p-6 border-t border-borde-suave bg-superficie space-y-4">
        <div class="space-y-2">
          <div class="flex justify-between text-sm text-tinta-suave">
            <span>Subtotal</span>
            <span class="font-mono font-medium text-tinta">{{ formattedTotalPrice }}</span>
          </div>
          <div class="flex justify-between text-sm text-tinta-suave">
            <span>Envío</span>
            <span class="font-mono font-medium text-tinta">{{ tipoEntrega === 'retiro' ? 'Gratis (Retiro)' : (costoEnvio
              > 0 ? `$ ${costoEnvio.toLocaleString('es-AR')}` : 'A calcular') }}</span>
          </div>
          <div class="flex justify-between text-base font-semibold text-tinta pt-2 border-t border-borde-suave">
            <span>Total</span>
            <span class="font-mono text-lg text-tinta">{{ formattedTotalConEnvio }}</span>
          </div>
        </div>

        <button @click="handleIniciarCompra"
          class="w-full py-3.5 rounded-full bg-verde-marca text-crema text-sm font-medium hover:bg-acento hover:text-verde-marca transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 group">
          <span>INICIAR COMPRA</span>
          <PhArrowRight :size="16" weight="bold" class="transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  </Transition>
</template>