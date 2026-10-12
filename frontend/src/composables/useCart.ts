import { ref, computed, watch } from 'vue'
import type { CartItem } from '@/types/cart'

const carritoGuardado = typeof window !== 'undefined' ? localStorage.getItem('elsa_cart') : null
const cartItems = ref<CartItem[]>(carritoGuardado ? JSON.parse(carritoGuardado) : [])
const isCartOpen = ref(false)
const latestAddedItem = ref<CartItem | null>(null)
const showToast = ref(false)
let toastTimer: number | null = null

watch(cartItems, (nuevoCarrito) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('elsa_cart', JSON.stringify(nuevoCarrito))
  }
}, { deep: true })

export function useCart() {
  const addToCart = (product: { id: string; nombre: string; precio: string; imagen: string; rinde: string }) => {
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
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(totalPrice.value)
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
    formattedTotalPrice
  }
}