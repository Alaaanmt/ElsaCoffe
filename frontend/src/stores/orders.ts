import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { MOCK_ORDERS } from '@/data/mockOrders'
import type { OrderMock, EstadoPedido, EstadoPago } from '@/types/order'

const STORAGE_KEY = 'elsa_orders_data'

export const useOrdersStore = defineStore('orders', () => {
  // Inicializar cargando desde localStorage o recurriendo a los mocks iniciales
  const obtenerPedidosIniciales = (): OrderMock[] => {
    const guardados = localStorage.getItem(STORAGE_KEY)
    if (guardados) {
      try {
        return JSON.parse(guardados)
      } catch (e) {
        console.error('Error al leer pedidos de localStorage', e)
      }
    }
    return [...MOCK_ORDERS]
  }

  const pedidos = ref<OrderMock[]>(obtenerPedidosIniciales())

  // Guardar automáticamente en localStorage
  const guardarEnStorage = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pedidos.value))
  }

  // ACCIÓN 1: Crear un nuevo pedido desde el Checkout del Cliente
  const crearPedido = (nuevoPedidoData: Omit<OrderMock, 'id' | 'numeroPedido' | 'createdAt'>) => {
    // Generar un número de pedido incremental basado en el último
    const ultimoNumero = pedidos.value.reduce((max, p) => (p.numeroPedido > max ? p.numeroPedido : max), 1040)
    const numeroPedido = ultimoNumero + 1

    const nuevoPedido: OrderMock = {
      ...nuevoPedidoData,
      id: `ord_${crypto.randomUUID()}`,
      numeroPedido,
      createdAt: new Date().toISOString()
    }

    // Insertar al inicio para que aparezca primero como el más reciente
    pedidos.value.unshift(nuevoPedido)
    guardarEnStorage()

    return nuevoPedido
  }

  // ACCIÓN 2: Actualizar el estado de un pedido desde el Admin
  const actualizarEstadoPedido = (id: string, estadoPedido: EstadoPedido, estadoPago?: EstadoPago) => {
    const order = pedidos.value.find(p => p.id === id)
    if (order) {
      order.estadoPedido = estadoPedido
      if (estadoPago) {
        order.estadoPago = estadoPago
      }
      guardarEnStorage()
    }
  }

  // ACCIÓN 3: Avanzar de estado en el flujo operativo directo
  const avanzarEstadoOperativo = (id: string) => {
    const order = pedidos.value.find(p => p.id === id)
    if (order) {
      if (order.estadoPedido === 'NUEVO') order.estadoPedido = 'EN_PREPARACION'
      else if (order.estadoPedido === 'EN_PREPARACION') order.estadoPedido = 'LISTO'
      else if (order.estadoPedido === 'LISTO') order.estadoPedido = 'ENTREGADO'
      guardarEnStorage()
    }
  }

  return {
    pedidos,
    crearPedido,
    actualizarEstadoPedido,
    avanzarEstadoOperativo
  }
})