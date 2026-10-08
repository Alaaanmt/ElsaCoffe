<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { useCart } from '@/composables/useCart'
import { PhX, PhCalendarBlank, PhClock, PhArrowRight, PhWarning, PhCaretLeft, PhCaretRight, PhInfo } from '@phosphor-icons/vue'
import { validarNombreApellido, validarEmail, limpiarYValidarTelefono } from '@/utils/validators'

const { isCartOpen, formattedTotalConEnvio } = useCart()
const isOpen = ref(false)

// Lógica de fechas (mínimo 48 hs de anticipación)
const hoy = new Date()
const fechaMinima = new Date()
fechaMinima.setDate(hoy.getDate() + 2)
fechaMinima.setHours(0, 0, 0, 0)

const mesActual = ref(hoy.getMonth())
const anioActual = ref(hoy.getFullYear())

const nombresMeses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]

const fechaSeleccionada = ref<Date>(new Date(fechaMinima))

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

const esMismaFecha = (d1: Date, d2: Date) => {
    return d1.getDate() === d2.getDate() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getFullYear() === d2.getFullYear()
}

const fechaFormateadaTexto = computed(() => {
    return fechaSeleccionada.value.toLocaleDateString('es-AR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })
})

const turnoSeleccionado = ref<'mañana' | 'tarde'>('mañana')

// Datos de contacto
const email = ref('')
const nombre = ref('')
const apellido = ref('')
const telefono = ref('')
const notas = ref('')
const errorMessage = ref('')
const errorBoxRef = ref<HTMLElement | null>(null)

const formatearTelefono = (e: Event) => {
    const input = e.target as HTMLInputElement
    let valor = input.value.replace(/\D/g, '')
    if (valor.length > 2) {
        valor = `${valor.slice(0, 2)} ${valor.slice(2, 12)}`
    }
    telefono.value = valor
}

const mostrarError = (mensaje: string) => {
    errorMessage.value = mensaje
    nextTick(() => {
        errorBoxRef.value?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    })
}

const validarYConfirmar = () => {
    errorMessage.value = ''

    if (!validarNombreApellido(nombre.value, apellido.value)) {
        mostrarError('Por favor, completá tu nombre y apellido.')
        return
    }

    if (!validarEmail(email.value)) {
        mostrarError('El formato del correo electrónico no es válido (ej: tu@email.com).')
        return
    }

    if (!limpiarYValidarTelefono(telefono.value)) {
        mostrarError('El teléfono debe incluir característica y número (ej: 11 23456789).')
        return
    }

    alert(`¡Pedido confirmado con éxito para el ${fechaFormateadaTexto.value} (${turnoSeleccionado.value})! Gracias por tu compra en ELSA.`)
    isOpen.value = false
}

const abrirModalCheckout = () => {
    isCartOpen.value = false
    isOpen.value = true
}

defineExpose({ abrirModalCheckout })
</script>

<template>
    <Transition enter-active-class="transition-opacity duration-300 ease-out" enter-from-class="opacity-0"
        enter-to-class="opacity-100" leave-active-class="transition-opacity duration-200 ease-in"
        leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="isOpen"
            class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <div
                class="bg-fondo w-full max-w-5xl rounded-3xl border border-borde-suave shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">

                <!-- Cabecera -->
                <div class="p-6 border-b border-borde-suave flex items-center justify-between bg-superficie">
                    <div>
                        <span class="text-xs uppercase tracking-[0.2em] font-medium text-tinta-suave block">Checkout
                            ELSA</span>
                        <h3 class="font-titulo text-xl md:text-2xl font-semibold text-tinta">Seleccioná la fecha y rango
                            horario</h3>
                    </div>
                    <button @click="isOpen = false"
                        class="size-10 rounded-full bg-fondo border border-borde-suave flex items-center justify-center text-tinta-suave hover:text-tinta transition-colors cursor-pointer">
                        <PhX :size="20" weight="bold" />
                    </button>
                </div>

                <!-- Contenido -->
                <div class="p-6 sm:p-8 overflow-y-auto space-y-8 flex-1">

                    <!-- Alerta de errores -->
                    <div v-if="errorMessage" ref="errorBoxRef"
                        class="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3 text-red-600 dark:text-red-400">
                        <PhWarning :size="20" weight="bold" class="shrink-0" />
                        <span class="text-xs sm:text-sm font-medium">{{ errorMessage }}</span>
                    </div>

                    <!-- Sección 1: Calendario y Horarios (Distribución balanceada editorial) -->
                    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

                        <!-- Calendario (7 cols) -->
                        <div
                            class="lg:col-span-7 p-5 rounded-2xl bg-superficie border border-borde-suave space-y-4 flex flex-col justify-between">
                            <div>
                                <div class="flex items-center justify-between mb-3">
                                    <h4
                                        class="font-titulo text-base md:text-lg font-semibold text-tinta flex items-center gap-2">
                                        <PhCalendarBlank :size="20" class="text-verde-marca dark:text-acento" />
                                        <span>{{ nombresMeses[mesActual] }} {{ anioActual }}</span>
                                    </h4>
                                    <div class="flex items-center gap-1">
                                        <button @click="cambiarMes(-1)"
                                            class="p-2 rounded-xl bg-fondo border border-borde-suave hover:border-borde-control text-tinta transition-colors cursor-pointer">
                                            <PhCaretLeft :size="16" weight="bold" />
                                        </button>
                                        <button @click="cambiarMes(1)"
                                            class="p-2 rounded-xl bg-fondo border border-borde-suave hover:border-borde-control text-tinta transition-colors cursor-pointer">
                                            <PhCaretRight :size="16" weight="bold" />
                                        </button>
                                    </div>
                                </div>

                                <div
                                    class="grid grid-cols-7 text-center text-[11px] md:text-xs font-semibold text-tinta-suave uppercase tracking-wider mb-1">
                                    <span>Dom</span><span>Lun</span><span>Mar</span><span>Mié</span><span>Jue</span><span>Vie</span><span>Sáb</span>
                                </div>

                                <div class="grid grid-cols-7 gap-1.5 pt-1">
                                    <template v-for="(dia, index) in diasDelMes"
                                        :key="dia.esVacio ? `vacio-${index}` : dia.fecha?.toISOString()">
                                        <div v-if="dia.esVacio" class="aspect-square" />
                                        <button v-else @click="seleccionarFecha(dia)" :disabled="dia.bloqueado"
                                            class="aspect-square rounded-xl text-xs md:text-sm font-mono font-medium flex items-center justify-center transition-all relative"
                                            :class="[
                                                dia.bloqueado
                                                    ? 'bg-fondo/40 text-tinta-suave/30 cursor-not-allowed border border-transparent'
                                                    : dia.fecha && esMismaFecha(dia.fecha, fechaSeleccionada)
                                                        ? 'bg-verde-marca text-crema font-bold shadow-md scale-105'
                                                        : 'bg-fondo border border-borde-suave text-tinta hover:border-verde-marca cursor-pointer'
                                            ]">
                                            {{ dia.diaNum }}
                                        </button>
                                    </template>
                                </div>
                            </div>

                            <div
                                class="flex items-center justify-center gap-6 pt-3 border-t border-borde-suave text-[11px] md:text-xs text-tinta-suave">
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

                        <!-- Columna Derecha con justify-between para alinear perfecto (5 cols) -->
                        <div class="lg:col-span-5 flex flex-col justify-between">

                            <!-- 1. Rango Horario -->
                            <div class="p-5 rounded-2xl bg-superficie border border-borde-suave space-y-4">
                                <h4
                                    class="font-titulo text-base md:text-lg font-semibold text-tinta flex items-center gap-2">
                                    <PhClock :size="20" class="text-verde-marca dark:text-acento" />
                                    <span>Rango Horario</span>
                                </h4>

                                <div class="space-y-3">
                                    <label
                                        class="flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer"
                                        :class="turnoSeleccionado === 'mañana' ? 'border-verde-marca bg-verde-marca/5 dark:bg-fondo/60 dark:border-verde-marca' : 'border-borde-suave bg-fondo dark:bg-superficie/40 dark:border-borde-suave'">
                                        <input type="radio" v-model="turnoSeleccionado" value="mañana"
                                            class="mt-1 accent-verde-marca" />
                                        <div>
                                            <span class="text-xs md:text-sm font-semibold text-tinta block">Turno
                                                Mañana</span>
                                            <span class="text-[11px] md:text-xs text-tinta-suave">8:00 a 13:00 hs</span>
                                        </div>
                                    </label>

                                    <label
                                        class="flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer"
                                        :class="turnoSeleccionado === 'tarde' ? 'border-verde-marca bg-verde-marca/5 dark:bg-fondo/60 dark:border-verde-marca' : 'border-borde-suave bg-fondo dark:bg-superficie/40 dark:border-borde-suave'">
                                        <input type="radio" v-model="turnoSeleccionado" value="tarde"
                                            class="mt-1 accent-verde-marca" />
                                        <div>
                                            <span class="text-xs md:text-sm font-semibold text-tinta block">Turno
                                                Tarde</span>
                                            <span class="text-[11px] md:text-xs text-tinta-suave">13:00 a 17:00
                                                hs</span>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <!-- 2. Selección activa (Queda exactamente en el medio) -->
                            <div
                                class="p-4 rounded-2xl bg-superficie border border-borde-suave flex items-center justify-between my-3 lg:my-0">
                                <div>
                                    <span
                                        class="text-[10px] md:text-xs uppercase tracking-wider text-tinta-suave block pb-2">Selección
                                        activa</span>
                                    <span class="font-titulo text-xs md:text-lg font-semibold text-tinta capitalize">{{
                                        fechaFormateadaTexto
                                        }}</span>
                                </div>
                                <span
                                    class="px-2.5 py-1 rounded-full bg-verde-marca/10 text-verde-marca dark:bg-acento/20 dark:text-acento text-[11px] md:text-xs font-mono font-bold uppercase">{{
                                        turnoSeleccionado }}</span>
                            </div>

                            <!-- 3. Tarjeta de Logística y Elaboración Artesanal -->
                            <div
                                class="p-4 rounded-2xl bg-superficie border border-borde-suave flex items-start gap-3 text-tinta-suave">
                                <PhInfo :size="20" weight="regular"
                                    class="shrink-0 text-verde-marca dark:text-acento mt-0.5" />
                                <p class="text-xs md:text-sm leading-relaxed">Elaboración artesanal propia. Los encargos
                                    se preparan con un
                                    mínimo de 48 hs de anticipación para asegurar ingredientes frescos y de calidad.</p>
                            </div>

                        </div>

                    </div>

                    <!-- Sección 2: Datos de Contacto -->
                    <div class="space-y-4 p-5 rounded-2xl bg-superficie border border-borde-suave">
                        <h4 class="font-titulo text-lg md:text-xl font-semibold text-tinta">Datos de Contacto y
                            Facturación</h4>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label class="text-xs md:text-sm font-medium text-tinta-suave block mb-1">Correo
                                    Electrónico *</label>
                                <input v-model="email" type="email" placeholder="ejemplo@correo.com"
                                    class="w-full bg-fondo border border-borde-suave rounded-xl px-4 py-2.5 text-sm md:text-base text-tinta focus:outline-none focus:border-verde-marca" />
                            </div>
                            <div>
                                <label class="text-xs md:text-sm font-medium text-tinta-suave block mb-1">Teléfono /
                                    WhatsApp *</label>
                                <input :value="telefono" @input="formatearTelefono" type="tel" maxlength="12"
                                    placeholder="11 23456789"
                                    class="w-full bg-fondo border border-borde-suave rounded-xl px-4 py-2.5 text-sm md:text-base text-tinta focus:outline-none focus:border-verde-marca font-mono" />
                                <span class="text-[10px] md:text-xs text-tinta-suave mt-1 block">Ej: 11 seguido del
                                    número sin
                                    guiones</span>
                            </div>
                            <div>
                                <label class="text-xs md:text-sm font-medium text-tinta-suave block mb-1">Nombre
                                    *</label>
                                <input v-model="nombre" type="text" placeholder="Tu nombre"
                                    class="w-full bg-fondo border border-borde-suave rounded-xl px-4 py-2.5 text-sm md:text-base text-tinta focus:outline-none focus:border-verde-marca" />
                            </div>
                            <div>
                                <label class="text-xs md:text-sm font-medium text-tinta-suave block mb-1">Apellido
                                    *</label>
                                <input v-model="apellido" type="text" placeholder="Tu apellido"
                                    class="w-full bg-fondo border border-borde-suave rounded-xl px-4 py-2.5 text-sm md:text-base text-tinta focus:outline-none focus:border-verde-marca" />
                            </div>
                        </div>
                        <div class="pt-2">
                            <label class="text-xs md:text-sm font-medium text-tinta-suave block mb-1">Notas especiales o
                                dedicatoria
                                (Opcional)</label>
                            <textarea v-model="notas" rows="2"
                                placeholder="Ej: Es para un regalo, agregar tarjeta con dedicatoria..."
                                class="w-full bg-fondo border border-borde-suave rounded-xl px-4 py-2.5 text-sm md:text-base text-tinta focus:outline-none focus:border-verde-marca resize-none"></textarea>
                        </div>
                    </div>

                </div>

                <!-- Pie -->
                <div
                    class="p-6 bg-superficie border-t border-borde-suave flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                        <span class="text-xs md:text-sm text-tinta-suave block">Total a abonar:</span>
                        <span class="font-mono text-2xl md:text-3xl font-semibold text-tinta">{{ formattedTotalConEnvio
                            }}</span>
                    </div>
                    <button @click="validarYConfirmar"
                        class="w-full sm:w-auto px-8 py-3.5 rounded-full bg-verde-marca text-crema text-sm md:text-base font-medium hover:bg-acento hover:text-verde-marca transition-all cursor-pointer shadow-md flex items-center justify-center gap-2">
                        <span>CONFIRMAR Y PAGAR</span>
                        <PhArrowRight :size="18" weight="bold" />
                    </button>
                </div>

            </div>
        </div>
    </Transition>
</template>