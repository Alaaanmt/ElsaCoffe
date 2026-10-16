export interface OrderItemMock {
  id: string
  nombreProducto: string
  cantidad: number
  precioUnitario: number
  imagenProducto?: string
}

export interface OrderMock {
  id: string
  numeroPedido: number
  nombreCliente: string
  apellidoCliente: string
  emailCliente: string
  telefonoCliente: string
  tipoEntrega: 'retiro' | 'envio'
  calleEnvio?: string
  numeroEnvio?: string
  ciudadEnvio?: string
  costoEnvio: number
  subtotal: number
  totalFinal: number
  metodoPago: 'mercadopago' | 'transferencia' | 'efectivo'
  estadoPago: 'PENDIENTE' | 'PAGADO' | 'RECHAZADO'
  estadoPedido: 'NUEVO' | 'EN_PREPARACION' | 'LISTO' | 'ENTREGADO' | 'CANCELADO'
  fechaTurno: string // YYYY-MM-DD
  turno: 'mañana' | 'tarde'
  notasCliente?: string
  createdAt: string
  items: OrderItemMock[]
}

const hoy = new Date().toISOString().split('T')[0] as string

export const MOCK_ORDERS: OrderMock[] = [
  {
    id: '1',
    numeroPedido: 1042,
    nombreCliente: 'Ana',
    apellidoCliente: 'García',
    emailCliente: 'ana.garcia@email.com',
    telefonoCliente: '11 4598 1234',
    tipoEntrega: 'retiro',
    costoEnvio: 0,
    subtotal: 19000,
    totalFinal: 19000,
    metodoPago: 'transferencia',
    estadoPago: 'PENDIENTE',
    estadoPedido: 'NUEVO',
    fechaTurno: '2026-10-18',
    turno: 'tarde',
    notasCliente: 'Con velita de cumpleaños por favor',
    createdAt: '2026-10-13T09:30:00Z',
    items: [
      { id: 'item-1', nombreProducto: 'Red Velvet Cake', cantidad: 1, precioUnitario: 19000, imagenProducto: 'https://images.unsplash.com/photo-1586788224331-947f68671cf1?w=500&q=80' }
    ]
  },
  {
    id: '2',
    numeroPedido: 1043,
    nombreCliente: 'Carlos',
    apellidoCliente: 'Mendoza',
    emailCliente: 'carlos.m@email.com',
    telefonoCliente: '11 6543 9876',
    tipoEntrega: 'envio',
    calleEnvio: 'Av. Rivadavia',
    numeroEnvio: '12450',
    ciudadEnvio: 'San Justo',
    costoEnvio: 3500,
    subtotal: 32000,
    totalFinal: 35500,
    metodoPago: 'mercadopago',
    estadoPago: 'PAGADO',
    estadoPedido: 'EN_PREPARACION',
    fechaTurno: hoy,
    turno: 'mañana',
    notasCliente: 'Timbre 2B. Dejar en portería si no contesto.',
    createdAt: '2026-10-12T18:20:00Z', // Creado hace más de 48 hs respecto a hoy
    items: [
      { id: 'item-2', nombreProducto: 'Cheesecake de Frutos Rojos', cantidad: 1, precioUnitario: 17000, imagenProducto: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500&q=80' },
      { id: 'item-3', nombreProducto: 'Torta Chocotorta Clásica', cantidad: 1, precioUnitario: 15000, imagenProducto: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80' }
    ]
  },
  {
    id: '3',
    numeroPedido: 1044,
    nombreCliente: 'Lucía',
    apellidoCliente: 'Rios',
    emailCliente: 'lu.rios@email.com',
    telefonoCliente: '11 3211 8899',
    tipoEntrega: 'retiro',
    costoEnvio: 0,
    subtotal: 16500,
    totalFinal: 16500,
    metodoPago: 'efectivo',
    estadoPago: 'PENDIENTE',
    estadoPedido: 'LISTO',
    fechaTurno: hoy,
    turno: 'tarde',
    createdAt: '2026-10-11T10:00:00Z', // Creado hace más de 48 hs
    items: [
      { id: 'item-4', nombreProducto: 'Tarta de Limón y Merengue', cantidad: 1, precioUnitario: 16500, imagenProducto: 'https://images.unsplash.com/photo-1519869325930-281384150729?w=500&q=80' }
    ]
  },
  {
    id: '4',
    numeroPedido: 1045,
    nombreCliente: 'Gonzalo',
    apellidoCliente: 'Pérez',
    emailCliente: 'gonza.perez@email.com',
    telefonoCliente: '11 8877 6655',
    tipoEntrega: 'envio',
    calleEnvio: 'Almafuerte',
    numeroEnvio: '3210',
    ciudadEnvio: 'San Justo',
    costoEnvio: 3500,
    subtotal: 21000,
    totalFinal: 24500,
    metodoPago: 'transferencia',
    estadoPago: 'PAGADO',
    estadoPedido: 'NUEVO',
    fechaTurno: '2026-10-19',
    turno: 'mañana',
    createdAt: '2026-10-14T11:00:00Z',
    items: [
      { id: 'item-5', nombreProducto: 'Carrot Cake con Frosting', cantidad: 1, precioUnitario: 21000, imagenProducto: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=500&q=80' }
    ]
  },
  {
    id: '5',
    numeroPedido: 1046,
    nombreCliente: 'Mariana',
    apellidoCliente: 'Sosa',
    emailCliente: 'msosa@email.com',
    telefonoCliente: '11 2233 4455',
    tipoEntrega: 'retiro',
    costoEnvio: 0,
    subtotal: 38000,
    totalFinal: 38000,
    metodoPago: 'mercadopago',
    estadoPago: 'PAGADO',
    estadoPedido: 'EN_PREPARACION',
    fechaTurno: '2026-10-18',
    turno: 'tarde',
    notasCliente: 'Escribir "Feliz Aniversario" en la placa de chocolate.',
    createdAt: '2026-10-13T14:20:00Z',
    items: [
      { id: 'item-6', nombreProducto: 'Marquise de Chocolate y Dulce de Leche', cantidad: 2, precioUnitario: 19000, imagenProducto: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=500&q=80' }
    ]
  },
  {
    id: '6',
    numeroPedido: 1047,
    nombreCliente: 'Federico',
    apellidoCliente: 'Alvarez',
    emailCliente: 'fede.alvarez@email.com',
    telefonoCliente: '11 5544 3322',
    tipoEntrega: 'envio',
    calleEnvio: 'Florio',
    numeroEnvio: '2150',
    ciudadEnvio: 'San Justo',
    costoEnvio: 3500,
    subtotal: 18500,
    totalFinal: 22000,
    metodoPago: 'efectivo',
    estadoPago: 'PENDIENTE',
    estadoPedido: 'LISTO',
    fechaTurno: hoy,
    turno: 'tarde',
    createdAt: '2026-10-12T08:00:00Z',
    items: [
      { id: 'item-7', nombreProducto: 'Torta Rogel Artesanal', cantidad: 1, precioUnitario: 18500, imagenProducto: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=500&q=80' }
    ]
  },
  {
    id: '7',
    numeroPedido: 1040,
    nombreCliente: 'Sofia',
    apellidoCliente: 'Rossi',
    emailCliente: 'sofi.rossi@email.com',
    telefonoCliente: '11 9988 7766',
    tipoEntrega: 'retiro',
    costoEnvio: 0,
    subtotal: 19000,
    totalFinal: 19000,
    metodoPago: 'mercadopago',
    estadoPago: 'PAGADO',
    estadoPedido: 'ENTREGADO',
    fechaTurno: '2026-10-10',
    turno: 'mañana',
    createdAt: '2026-10-07T09:00:00Z',
    items: [
      { id: 'item-8', nombreProducto: 'Red Velvet Cake', cantidad: 1, precioUnitario: 19000, imagenProducto: 'https://images.unsplash.com/photo-1586788224331-947f68671cf1?w=500&q=80' }
    ]
  },
  {
    id: '8',
    numeroPedido: 1041,
    nombreCliente: 'Tomás',
    apellidoCliente: 'Herrera',
    emailCliente: 'therrera@email.com',
    telefonoCliente: '11 4411 2233',
    tipoEntrega: 'envio',
    calleEnvio: 'Arieta',
    numeroEnvio: '1800',
    ciudadEnvio: 'San Justo',
    costoEnvio: 3500,
    subtotal: 17000,
    totalFinal: 20500,
    metodoPago: 'transferencia',
    estadoPago: 'RECHAZADO',
    estadoPedido: 'CANCELADO',
    fechaTurno: '2026-10-11',
    turno: 'tarde',
    notasCliente: 'Comprobante no válido enviado.',
    createdAt: '2026-10-08T16:45:00Z',
    items: [
      { id: 'item-9', nombreProducto: 'Cheesecake de Frutos Rojos', cantidad: 1, precioUnitario: 17000, imagenProducto: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500&q=80' }
    ]
  },
  {
    id: '9',
    numeroPedido: 1038,
    nombreCliente: 'Valeria',
    apellidoCliente: 'Blanco',
    emailCliente: 'val.blanco@email.com',
    telefonoCliente: '11 7766 5544',
    tipoEntrega: 'retiro',
    costoEnvio: 0,
    subtotal: 33000,
    totalFinal: 33000,
    metodoPago: 'mercadopago',
    estadoPago: 'PAGADO',
    estadoPedido: 'ENTREGADO',
    fechaTurno: '2026-10-05',
    turno: 'tarde',
    createdAt: '2026-10-02T12:00:00Z',
    items: [
      { id: 'item-10', nombreProducto: 'Torta Chocotorta Clásica', cantidad: 1, precioUnitario: 15000, imagenProducto: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80' },
      { id: 'item-11', nombreProducto: 'Tarta de Limón y Merengue', cantidad: 1, precioUnitario: 16500, imagenProducto: 'https://images.unsplash.com/photo-1519869325930-281384150729?w=500&q=80' }
    ]
  },
  {
    id: '10',
    numeroPedido: 1039,
    nombreCliente: 'Diego',
    apellidoCliente: 'Castro',
    emailCliente: 'dcastro@email.com',
    telefonoCliente: '11 1122 3344',
    tipoEntrega: 'envio',
    calleEnvio: 'Villegas',
    numeroEnvio: '2400',
    ciudadEnvio: 'San Justo',
    costoEnvio: 3500,
    subtotal: 21000,
    totalFinal: 24500,
    metodoPago: 'transferencia',
    estadoPago: 'PAGADO',
    estadoPedido: 'ENTREGADO',
    fechaTurno: '2026-10-06',
    turno: 'mañana',
    createdAt: '2026-10-03T15:30:00Z',
    items: [
      { id: 'item-12', nombreProducto: 'Carrot Cake con Frosting', cantidad: 1, precioUnitario: 21000, imagenProducto: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=500&q=80' }
    ]
  }
]