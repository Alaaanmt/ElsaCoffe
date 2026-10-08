import { ref, computed, reactive, watch } from 'vue'

export interface CartItem {
  id: string
  nombre: string
  precioNum: number
  precioStr: string
  imagen: string
  cantidad: number
  rinde: string
}


const carritoGuardado = typeof window !== 'undefined' ? localStorage.getItem('elsa_cart') : null
const cartItems = ref<CartItem[]>(carritoGuardado ? JSON.parse(carritoGuardado) : [])

const isCartOpen = ref(false)
const latestAddedItem = ref<CartItem | null>(null)
const showToast = ref(false)
let toastTimer: number | null = null

// Nuevas variables globales en el composable
const tipoEntrega = ref<'retiro' | 'envio'>('retiro') // por defecto retiro o envío
const costoEnvio = ref<number>(0)
const sucursalRetiro = ref('José León Suárez 2015, Mataderos, CABA')
const fechaSeleccionada = ref<Date>(new Date())
const turnoSeleccionado = ref<'mañana' | 'tarde'>('mañana')

const datosCliente = reactive({
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

// Guardar automáticamente en localStorage cada vez que cartItems cambie
watch(cartItems, (nuevoCarrito) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('elsa_cart', JSON.stringify(nuevoCarrito))
  }
}, { deep: true })

export function useCart() {
  const addToCart = (product: { id: string; nombre: string; precio: string; imagen: string; rinde: string }) => {
    // Convertir el precio string (ej: "$18.500") a número (18500) para calcular bien los totales
    const precioNum = parseInt(product.precio.replace('$', '').replace('.', ''))
    const existing = cartItems.value.find(item => item.id === product.id)
    if (existing) {
      existing.cantidad++
    } else {
      cartItems.value.push({
        id: product.id,
        nombre: product.nombre,
        precioNum,
        precioStr: product.precio,
        imagen: product.imagen,
        cantidad: 1,
        rinde: product.rinde
      })
    }

    // Activar la notificación flotante (Toast)
    latestAddedItem.value = {
      id: product.id,
      nombre: product.nombre,
      precioNum,
      precioStr: product.precio,
      imagen: product.imagen,
      cantidad: existing ? existing.cantidad : 1,
      rinde: product.rinde
    }
    showToast.value = true
    if (toastTimer) clearTimeout(toastTimer)
    
    // Desaparece automáticamente a los 4 segundos
    toastTimer = window.setTimeout(() => {
      showToast.value = false
    }, 4000)
  }

  const removeFromCart = (id: string) => {
    const index = cartItems.value.findIndex(item => item.id === id)
    if (index !== -1) {
      cartItems.value.splice(index, 1)
    }
  }

  const updateQuantity = (id: string, delta: number) => {
    const item = cartItems.value.find(i => i.id === id)
    if (item) {
      item.cantidad += delta
      if (item.cantidad <= 0) {
        removeFromCart(id)
      }
    }
  }

  const totalItems = computed(() => {
    return cartItems.value.reduce((sum, item) => sum + item.cantidad, 0)
  })

  const totalPrice = computed(() => {
    return cartItems.value.reduce((sum, item) => sum + (item.precioNum * item.cantidad), 0)
  })

  const formattedTotalPrice = computed(() => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency:'ARS', maximumFractionDigits: 0 }).format(totalPrice.value)
  })

  const seleccionarTipoEntrega = (tipo: 'retiro' | 'envio') => {
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

  const totalConEnvio = computed(() => {
    return totalPrice.value + costoEnvio.value
  })

  const formattedTotalConEnvio = computed(() => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(totalConEnvio.value)
  })

  return {
    cartItems,
    isCartOpen,
    showToast,
    latestAddedItem,
    addToCart,
    removeFromCart,
    updateQuantity,
    totalItems,
    totalPrice,
    formattedTotalPrice,
    tipoEntrega,
    costoEnvio,
    sucursalRetiro,
    fechaSeleccionada,
    turnoSeleccionado,
    seleccionarTipoEntrega,
    calcularCostoEnvio,
    totalConEnvio,
    formattedTotalConEnvio,
    datosCliente
  }
}