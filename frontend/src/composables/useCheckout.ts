import { ref, reactive, computed } from 'vue'
import type { TipoEntrega, Turno, DatosCliente, MetodoPago } from '@/types/checkout'

const tipoEntrega = ref<TipoEntrega>('retiro')
const costoEnvio = ref<number>(0)
const sucursalRetiro = ref('José León Suárez 2015, Mataderos, CABA')
const fechaSeleccionada = ref<Date>(new Date(Date.now() + 172800000)) // +48hs
const turnoSeleccionado = ref<Turno>('mañana')
const metodoPagoSeleccionado = ref<MetodoPago>('mercadopago')

const datosCliente = reactive<DatosCliente>({
  nombre: '',
  apellido: '',
  email: '',
  telefono: '',
  notas: '',
  calle: '',
  numero: '',
  departamento: '',
  ciudad: '',
  codigoPostal: ''
})

export function useCheckout() {
  const seleccionarTipoEntrega = (tipo: TipoEntrega) => {
    tipoEntrega.value = tipo
    if (tipo === 'retiro') {
      costoEnvio.value = 0
    }
  }

  const calcularCostoEnvio = (cp: string) => {
    if (!cp.trim()) return
    const cpLimpio = cp.trim().toUpperCase()
    datosCliente.codigoPostal = cpLimpio
    if (cpLimpio.startsWith('1440') || cpLimpio.startsWith('1439')) {
      costoEnvio.value = 3500
    } else if (cpLimpio.startsWith('C')) {
      costoEnvio.value = 5500
    } else {
      costoEnvio.value = 7500
    }
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

  return {
    tipoEntrega,
    costoEnvio,
    sucursalRetiro,
    fechaSeleccionada,
    turnoSeleccionado,
    metodoPagoSeleccionado,
    datosCliente,
    seleccionarTipoEntrega,
    calcularCostoEnvio,
    fechaFormateadaTexto
  }
}