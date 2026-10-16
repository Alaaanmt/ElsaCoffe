import type { EstadoPedido, MetodoPago } from '@/types/order'

export const formatPrecio = (val: number): string => {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(val)
}

export const getBadgeEstadoPedidoClass = (estado: EstadoPedido): string => {
  switch (estado) {
    case 'NUEVO': return 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30'
    case 'EN_PREPARACION': return 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
    case 'LISTO': return 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
    case 'ENTREGADO': return 'bg-gray-500/15 text-gray-600 dark:text-gray-400 border border-gray-500/30'
    case 'CANCELADO': return 'bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30'
    default: return 'bg-superficie text-tinta-suave'
  }
}

export const getMetodoPagoLabel = (metodo: MetodoPago): string => {
  switch (metodo) {
    case 'mercadopago': return 'Mercado Pago'
    case 'transferencia': return 'Transferencia Bancaria'
    case 'efectivo': return 'Efectivo Presencial'
    default: return metodo
  }
}