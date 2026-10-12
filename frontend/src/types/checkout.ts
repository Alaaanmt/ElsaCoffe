export type MetodoPago = 'mercadopago' | 'transferencia' | 'efectivo'
export type TipoEntrega = 'retiro' | 'envio'
export type Turno = 'mañana' | 'tarde'

export interface DatosCliente {
  nombre: string
  apellido: string
  email: string
  telefono: string
  notas: string
  calle: string
  numero: string
  departamento: string
  ciudad: string
  codigoPostal: string
}