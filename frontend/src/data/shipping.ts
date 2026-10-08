export interface ZonaEnvio {
  cp: string[]
  precio: number
  zonaNombre: string
}

export const ZONAS_ENVIO: ZonaEnvio[] = [
  {
    cp: ['1440', '1439', '1407', '1408'], // Códigos postales cercanos a Mataderos / Liniers / Lugano
    precio: 3500,
    zonaNombre: 'Cercanías (Mataderos y aledaños)'
  },
  {
    cp: ['14', '15', '16'], // Resto de CABA (prefijos)
    precio: 5500,
    zonaNombre: 'Resto de CABA'
  }
]

export const COSTO_ENVIO_DEFAULT = 7500 // Para otros CP o GBA
