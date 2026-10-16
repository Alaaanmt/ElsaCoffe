export interface OrderItemMock {
  id: string
  nombreProducto: string
  cantidad: number
  precioUnitario: number
  imagenProducto?: string
}

export type TipoEntrega = 'retiro' | 'envio'
export type MetodoPago = 'mercadopago' | 'transferencia' | 'efectivo'
export type EstadoPago = 'PENDIENTE' | 'PAGADO' | 'RECHAZADO'
export type EstadoPedido = 'NUEVO' | 'EN_PREPARACION' | 'LISTO' | 'ENTREGADO' | 'CANCELADO'
export type CriterioOrden = 'ENTREGA_PROXIMA' | 'CREACION_DESC' | 'CREACION_ASC'
export type TabPedido = 'activos' | 'historial'

export interface OrderMock {
  id: string
  numeroPedido: number
  nombreCliente: string
  apellidoCliente: string
  emailCliente: string
  telefonoCliente: string
  tipoEntrega: TipoEntrega
  calleEnvio?: string
  numeroEnvio?: string
  ciudadEnvio?: string
  costoEnvio: number
  subtotal: number
  totalFinal: number
  metodoPago: MetodoPago
  estadoPago: EstadoPago
  estadoPedido: EstadoPedido
  fechaTurno: string // YYYY-MM-DD
  turno: 'mañana' | 'tarde'
  notasCliente?: string
  createdAt: string
  items: OrderItemMock[]
}