import { ref, computed } from 'vue'
import { useOrdersStore } from '@/stores/orders'
import type { OrderMock, TabPedido, CriterioOrden } from '@/types/order'

export function useAdminOrders() {
  const ordersStore = useOrdersStore()
  
  const tabActiva = ref<TabPedido>('activos')
  const filtroEstado = ref<string>('TODOS')
  const filtroTiempoHistorial = ref<'TODOS' | 'SEMANA' | 'MES'>('TODOS')
  const criterioOrden = ref<CriterioOrden>('ENTREGA_PROXIMA')
  const busqueda = ref<string>('')
  
  const paginaActual = ref(1)
  const pedidosPorPagina = 4
  const hoyStr = new Date().toISOString().split('T')[0] as string

  const cumpleAnticipacion48hs = (order: OrderMock): boolean => {
    const fechaCreacion = new Date(order.createdAt).getTime()
    const fechaEntrega = new Date(`${order.fechaTurno}T00:00:00Z`).getTime()
    return (fechaEntrega - fechaCreacion) / (1000 * 60 * 60) >= 48
  }

  // Métricas dinámicas calculadas sobre la Store
  const totalNuevos = computed(() => ordersStore.pedidos.filter(o => o.estadoPedido === 'NUEVO').length)
  const totalPendientesPago = computed(() => ordersStore.pedidos.filter(o => o.estadoPago === 'PENDIENTE').length)
  const totalParaHoy = computed(() => ordersStore.pedidos.filter(o =>
    o.fechaTurno === hoyStr &&
    o.estadoPedido !== 'ENTREGADO' &&
    o.estadoPedido !== 'CANCELADO' &&
    cumpleAnticipacion48hs(o)
  ).length)

  const filtrarPorMetrica = (tipo: 'NUEVO' | 'PENDIENTE_PAGO' | 'HOY') => {
    tabActiva.value = 'activos'
    paginaActual.value = 1
    if (tipo === 'NUEVO') filtroEstado.value = 'NUEVO'
    else if (tipo === 'HOY') filtroEstado.value = 'HOY'
    else if (tipo === 'PENDIENTE_PAGO') filtroEstado.value = 'PENDIENTE_PAGO'
  }

  const pedidosSegunTab = computed(() => {
    if (tabActiva.value === 'activos') {
      return ordersStore.pedidos.filter(o => o.estadoPedido !== 'ENTREGADO' && o.estadoPedido !== 'CANCELADO')
    } else {
      let lista = ordersStore.pedidos.filter(o => o.estadoPedido === 'ENTREGADO' || o.estadoPedido === 'CANCELADO')
      const ahora = new Date().getTime()
      if (filtroTiempoHistorial.value === 'SEMANA') {
        lista = lista.filter(o => new Date(o.createdAt).getTime() >= ahora - (7 * 24 * 60 * 60 * 1000))
      } else if (filtroTiempoHistorial.value === 'MES') {
        lista = lista.filter(o => new Date(o.createdAt).getTime() >= ahora - (30 * 24 * 60 * 60 * 1000))
      }
      return lista
    }
  })

  // Búsqueda, Filtrado y Ordenamiento
  const pedidosFiltrados = computed(() => {
    const listaBase = pedidosSegunTab.value.filter(o => {
      const coincideBusqueda =
        o.numeroPedido.toString().includes(busqueda.value) ||
        o.nombreCliente.toLowerCase().includes(busqueda.value.toLowerCase()) ||
        o.apellidoCliente.toLowerCase().includes(busqueda.value.toLowerCase())

      if (!coincideBusqueda) return false
      if (filtroEstado.value === 'TODOS') return true
      if (filtroEstado.value === 'HOY') return o.fechaTurno === hoyStr && cumpleAnticipacion48hs(o)
      if (filtroEstado.value === 'PENDIENTE_PAGO') return o.estadoPago === 'PENDIENTE'
      return o.estadoPedido === filtroEstado.value
    })

    if (tabActiva.value === 'activos') {
      return [...listaBase].sort((a, b) => {
        if (criterioOrden.value === 'ENTREGA_PROXIMA') {
          const timeA = new Date(`${a.fechaTurno}T${a.turno === 'mañana' ? '08:00:00' : '14:00:00'}`).getTime()
          const timeB = new Date(`${b.fechaTurno}T${b.turno === 'mañana' ? '08:00:00' : '14:00:00'}`).getTime()
          return timeA - timeB
        } else if (criterioOrden.value === 'CREACION_DESC') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        } else {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        }
      })
    }

    return listaBase
  })

  const totalPaginas = computed(() => Math.ceil(pedidosFiltrados.value.length / pedidosPorPagina) || 1)
  const pedidosPaginados = computed(() => {
    const inicio = (paginaActual.value - 1) * pedidosPorPagina
    return pedidosFiltrados.value.slice(inicio, inicio + pedidosPorPagina)
  })

  const cambiarPagina = (pag: number) => {
    if (pag >= 1 && pag <= totalPaginas.value) {
      paginaActual.value = pag
    }
  }

  return {
    pedidos: computed(() => ordersStore.pedidos),
    tabActiva,
    filtroEstado,
    filtroTiempoHistorial,
    criterioOrden,
    busqueda,
    paginaActual,
    totalPaginas,
    pedidosPaginados,
    totalNuevos,
    totalPendientesPago,
    totalParaHoy,
    filtrarPorMetrica,
    cambiarPagina,
    avanzarEstadoContextual: ordersStore.avanzarEstadoOperativo,
    actualizarEstadoPedido: ordersStore.actualizarEstadoPedido
  }
}