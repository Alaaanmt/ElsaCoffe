<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useCart } from '@/composables/useCart'
import { PhArrowLeft, PhCalendarBlank, PhClock, PhArrowRight, PhWarning, PhCaretLeft, PhCaretRight, PhInfo } from '@phosphor-icons/vue'
import { validarNombreApellido, validarEmail, limpiarYValidarTelefono } from '@/utils/validators'
import parsePhoneNumberFromString, { AsYouType } from 'libphonenumber-js'

const router = useRouter()
const { formattedTotalConEnvio, datosCliente, isCartOpen, fechaSeleccionada, turnoSeleccionado } = useCart()

// Función para volver a la sección de tortas con el carrito abierto
const volverAlCarrito = () => {
  isCartOpen.value = true
  router.push('/tortas')
}

// Lógica de fechas (mínimo 48 hs de anticipación)
const hoy = new Date()
const fechaMinima = new Date()
fechaMinima.setDate(hoy.getDate() + 2)
fechaMinima.setHours(0, 0, 0, 0)

// Si no hay una fecha seleccionada o es anterior a la mínima, inicializamos con la mínima
if (!fechaSeleccionada.value || new Date(fechaSeleccionada.value) < fechaMinima) {
  fechaSeleccionada.value = new Date(fechaMinima)
}

const mesActual = ref(new Date(fechaSeleccionada.value).getMonth())
const anioActual = ref(new Date(fechaSeleccionada.value).getFullYear())

const nombresMeses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

const diasDelMes = computed(() => {
  const anio = anioActual.value
  const mes = mesActual.value
  const primerDiaMes = new Date(anio, mes, 1)
  const diaSemanaInicio = primerDiaMes.getDay()
  const ultimoDiaMes = new Date(anio, mes + 1, 0)
  const totalDias = ultimoDiaMes.getDate()
  
  const dias = []
  for (let i = 0; i < diaSemanaInicio; i++) {
    dias.push({ esVacio: true, id: `vacio-${i}` })
  }
  for (let d = 1; d <= totalDias; d++) {
    const fechaDia = new Date(anio, mes, d)
    fechaDia.setHours(0, 0, 0, 0)
    const esBloqueado = fechaDia < fechaMinima
    dias.push({
      esVacio: false,
      diaNum: d,
      fecha: fechaDia,
      bloqueado: esBloqueado
    })
  }
  return dias
})

const cambiarMes = (direccion: number) => {
  let nuevoMes = mesActual.value + direccion
  let nuevoAnio = anioActual.value
  if (nuevoMes > 11) {
    nuevoMes = 0
    nuevoAnio++
  } else if (nuevoMes < 0) {
    nuevoMes = 11
    nuevoAnio--
  }
  if (nuevoAnio < hoy.getFullYear() || (nuevoAnio === hoy.getFullYear() && nuevoMes < hoy.getMonth())) {
    return
  }
  mesActual.value = nuevoMes
  anioActual.value = nuevoAnio
}

const seleccionarFecha = (diaObj: any) => {
  if (diaObj.bloqueado) return
  fechaSeleccionada.value = diaObj.fecha
}

const esMismaFecha = (d1: Date | string, d2: Date | string) => {
  const fecha1 = new Date(d1)
  const fecha2 = new Date(d2)
  return fecha1.getDate() === fecha2.getDate() &&
         fecha1.getMonth() === fecha2.getMonth() &&
         fecha1.getFullYear() === fecha2.getFullYear()
}

const fechaFormateadaTexto = computed(() => {
  const fecha = new Date(fechaSeleccionada.value)
  return fecha.toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
})

const errorMessage = ref('')
const errorBoxRef = ref<HTMLElement | null>(null)

const formatearTelefono = (e: Event) => {
  const input = e.target as HTMLInputElement
  const rawValue = input.value
  
  // Usamos el formateador inteligente de libphonenumber-js
  const formatter = new AsYouType('AR')
  const formatted = formatter.input(rawValue)
  
  datosCliente.telefono = formatted
}
const mostrarError = (mensaje: string) => {
  errorMessage.value = mensaje
  nextTick(() => {
    errorBoxRef.value?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  })
}

const validarYContinuarAPago = () => {
  errorMessage.value = ''
  if (!validarNombreApellido(datosCliente.nombre, datosCliente.apellido)) {
    mostrarError('Por favor, completá tu nombre y apellido.')
    return
  }
  if (!validarEmail(datosCliente.email)) {
    mostrarError('El formato del correo electrónico no es válido (ej: tu@email.com).')
    return
  }
  if (!limpiarYValidarTelefono(datosCliente.telefono)) {
    mostrarError('El teléfono debe incluir característica y número (ej: 11 23456789).')
    return
  }
  router.push('/checkout/payment')
}
</script>

<template>
  <div class="min-h-screen bg-fondo pt-28 pb-24 px-5 sm:px-8 transition-colors duration-300">
    <div class="max-w-4xl mx-auto space-y-8">
      
      <button 
        @click="volverAlCarrito" 
        class="inline-flex items-center gap-2 text-sm font-medium text-tinta-suave hover:text-tinta transition-colors cursor-pointer"
      >
        <PhArrowLeft :size="18" weight="bold" />
        <span>Volver al carrito</span>
      </button>

      <div class="space-y-1">
        <span class="text-xs uppercase tracking-[0.2em] font-medium text-tinta-suave block">Paso 1 de 2</span>
        <h1 class="font-titulo text-2xl md:text-3xl font-semibold text-tinta">Seleccioná la fecha, horario y tus datos</h1>
      </div>

      <div v-if="errorMessage" ref="errorBoxRef" class="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3 text-red-600 dark:text-red-400">
        <PhWarning :size="20" weight="bold" class="shrink-0" />
        <span class="text-xs sm:text-sm font-medium">{{ errorMessage }}</span>
      </div>

      <div class="space-y-8">
        
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          <!-- Calendario (7 cols) -->
          <div class="lg:col-span-7 p-5 rounded-2xl bg-superficie border border-borde-suave space-y-4 flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-3">
                <h4 class="font-titulo text-base md:text-lg font-semibold text-tinta flex items-center gap-2">
                  <PhCalendarBlank :size="20" class="text-verde-marca dark:text-acento" />
                  <span>{{ nombresMeses[mesActual] }} {{ anioActual }}</span>
                </h4>
                <div class="flex items-center gap-1">
                  <button @click="cambiarMes(-1)" class="p-2 rounded-xl bg-fondo border border-borde-suave hover:border-borde-control text-tinta transition-colors cursor-pointer">
                    <PhCaretLeft :size="16" weight="bold" />
                  </button>
                  <button @click="cambiarMes(1)" class="p-2 rounded-xl bg-fondo border border-borde-suave hover:border-borde-control text-tinta transition-colors cursor-pointer">
                    <PhCaretRight :size="16" weight="bold" />
                  </button>
                </div>
              </div>

              <div class="grid grid-cols-7 text-center text-[11px] md:text-xs font-semibold text-tinta-suave uppercase tracking-wider mb-1">
                <span>Dom</span><span>Lun</span><span>Mar</span><span>Mié</span><span>Jue</span><span>Vie</span><span>Sáb</span>
              </div>

              <div class="grid grid-cols-7 gap-1.5 pt-1">
                <template v-for="(dia, index) in diasDelMes" :key="dia.esVacio ? `vacio-${index}` : dia.fecha?.toISOString()">
                  <div v-if="dia.esVacio" class="aspect-square" />
                  <button 
                    v-else
                    @click="seleccionarFecha(dia)"
                    :disabled="dia.bloqueado"
                    class="aspect-square rounded-xl text-xs md:text-sm font-mono font-medium flex items-center justify-center transition-all relative"
                    :class="[
                      dia.bloqueado 
                        ? 'bg-fondo/40 text-tinta-suave/30 cursor-not-allowed border border-transparent' 
                        : dia.fecha && esMismaFecha(dia.fecha, fechaSeleccionada)
                          ? 'bg-verde-marca text-crema font-bold shadow-md scale-105'
                          : 'bg-fondo border border-borde-suave text-tinta hover:border-verde-marca cursor-pointer'
                    ]"
                  >
                    {{ dia.diaNum }}
                  </button>
                </template>
              </div>
            </div>

            <div class="flex items-center justify-center gap-6 pt-3 border-t border-borde-suave text-[11px] md:text-xs text-tinta-suave">
              <div class="flex items-center gap-2">
                <span class="size-3 rounded-full bg-verde-marca" />
                <span>Seleccionada</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="size-3 rounded-full bg-fondo border border-borde-suave" />
                <span>Disponible</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="size-3 rounded-full bg-fondo/40 border border-transparent" />
                <span>No disponible</span>
              </div>
            </div>
          </div>

          <!-- Columna Derecha: Horarios y Selección (5 cols) -->
          <div class="lg:col-span-5 flex flex-col justify-between">
            <div class="p-5 rounded-2xl bg-superficie border border-borde-suave space-y-4">
              <h4 class="font-titulo text-base md:text-lg font-semibold text-tinta flex items-center gap-2">
                <PhClock :size="20" class="text-verde-marca dark:text-acento" />
                <span>Rango Horario</span>
              </h4>

              <div class="space-y-3">
                <label class="flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer" :class="turnoSeleccionado === 'mañana' ? 'border-verde-marca bg-verde-marca/5 dark:bg-fondo/60 dark:border-verde-marca' : 'border-borde-suave bg-fondo dark:bg-superficie/40 dark:border-borde-suave'">
                  <input type="radio" v-model="turnoSeleccionado" value="mañana" class="mt-1 accent-verde-marca" />
                  <div>
                    <span class="text-xs md:text-sm font-semibold text-tinta block">Turno Mañana</span>
                    <span class="text-[11px] md:text-xs text-tinta-suave">8:00 a 13:00 hs</span>
                  </div>
                </label>
                
                <label class="flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer" :class="turnoSeleccionado === 'tarde' ? 'border-verde-marca bg-verde-marca/5 dark:bg-fondo/60 dark:border-verde-marca' : 'border-borde-suave bg-fondo dark:bg-superficie/40 dark:border-borde-suave'">
                  <input type="radio" v-model="turnoSeleccionado" value="tarde" class="mt-1 accent-verde-marca" />
                  <div>
                    <span class="text-xs md:text-sm font-semibold text-tinta block">Turno Tarde</span>
                    <span class="text-[11px] md:text-xs text-tinta-suave">13:00 a 17:00 hs</span>
                  </div>
                </label>
              </div>
            </div>

            <div class="p-4 rounded-2xl bg-superficie border border-borde-suave flex items-center justify-between my-3 lg:my-0">
              <div>
                <span class="text-[10px] md:text-xs uppercase tracking-wider text-tinta-suave block pb-2">Selección activa</span>
                <span class="font-titulo text-xs md:text-lg font-semibold text-tinta capitalize">{{ fechaFormateadaTexto }}</span>
              </div>
              <span class="px-2.5 py-1 rounded-full bg-verde-marca/10 text-verde-marca dark:bg-acento/20 dark:text-acento text-[11px] md:text-xs font-mono font-bold uppercase">{{ turnoSeleccionado }}</span>
            </div>

            <div class="p-4 rounded-2xl bg-superficie border border-borde-suave flex items-start gap-3 text-tinta-suave">
              <PhInfo :size="20" weight="regular" class="shrink-0 text-verde-marca dark:text-acento mt-0.5" />
              <p class="text-xs md:text-sm leading-relaxed">Elaboración artesanal propia. Los encargos se preparan con un mínimo de 48 hs de anticipación.</p>
            </div>
          </div>

        </div>

        <!-- Sección 2: Datos de Contacto -->
        <div class="space-y-4 p-6 rounded-2xl bg-superficie border border-borde-suave">
          <h4 class="font-titulo text-lg md:text-xl font-semibold text-tinta">Datos de Contacto y Facturación</h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="text-xs md:text-sm font-medium text-tinta-suave block mb-1">Correo Electrónico *</label>
              <input v-model="datosCliente.email" type="email" placeholder="ejemplo@correo.com" class="w-full bg-fondo border border-borde-suave rounded-xl px-4 py-2.5 text-sm md:text-base text-tinta focus:outline-none focus:border-verde-marca" />
            </div>
            <div>
              <label class="text-xs md:text-sm font-medium text-tinta-suave block mb-1">Teléfono / WhatsApp *</label>
              <input 
                :value="datosCliente.telefono" 
                @input="formatearTelefono" 
                type="tel" 
                placeholder="11 23456789 o +598..." 
                class="w-full bg-fondo border border-borde-suave rounded-xl px-4 py-2.5 text-sm md:text-base text-tinta focus:outline-none focus:border-verde-marca font-mono"
              />
              <span class="text-[10px] md:text-xs text-tinta-suave mt-1 block">Acepta números nacionales e internacionales con característica.</span>
            </div>
            <div>
              <label class="text-xs md:text-sm font-medium text-tinta-suave block mb-1">Nombre *</label>
              <input v-model="datosCliente.nombre" type="text" placeholder="Tu nombre" class="w-full bg-fondo border border-borde-suave rounded-xl px-4 py-2.5 text-sm md:text-base text-tinta focus:outline-none focus:border-verde-marca" />
            </div>
            <div>
              <label class="text-xs md:text-sm font-medium text-tinta-suave block mb-1">Apellido *</label>
              <input v-model="datosCliente.apellido" type="text" placeholder="Tu apellido" class="w-full bg-fondo border border-borde-suave rounded-xl px-4 py-2.5 text-sm md:text-base text-tinta focus:outline-none focus:border-verde-marca" />
            </div>
          </div>
          <div class="pt-2">
            <label class="text-xs md:text-sm font-medium text-tinta-suave block mb-1">Notas especiales o dedicatoria (Opcional)</label>
            <textarea v-model="datosCliente.notas" rows="2" placeholder="Ej: Es para un regalo, agregar tarjeta con dedicatoria..." class="w-full bg-fondo border border-borde-suave rounded-xl px-4 py-2.5 text-sm md:text-base text-tinta focus:outline-none focus:border-verde-marca resize-none"></textarea>
          </div>
        </div>

      </div>

    </div>

    <!-- Footer Sticky Inferior -->
    <div class="fixed inset-x-0 bottom-0 z-40 bg-superficie/90 backdrop-blur-md border-t border-borde-suave px-6 py-4 shadow-lg">
      <div class="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span class="text-xs md:text-sm text-tinta-suave block">Total a abonar:</span>
          <span class="font-mono text-xl md:text-2xl font-semibold text-tinta">{{ formattedTotalConEnvio }}</span>
        </div>
        <button 
          @click="validarYContinuarAPago"
          class="w-full sm:w-auto px-8 py-3.5 rounded-full bg-verde-marca text-crema text-sm md:text-base font-medium hover:bg-acento hover:text-verde-marca transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
        >
          <span>CONTINUAR AL PAGO</span>
          <PhArrowRight :size="18" weight="bold" />
        </button>
      </div>
    </div>

  </div>
</template>