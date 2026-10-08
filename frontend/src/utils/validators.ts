import parsePhoneNumberFromString from 'libphonenumber-js'


export const validarNombreApellido = (nombre: string, apellido: string): boolean => {
  return Boolean(nombre.trim() && apellido.trim())
}

export const validarEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const limpiarYValidarTelefono = (telefono: string): boolean => {
  if (!telefono || !telefono.trim()) return false
  
  // Parseamos asumiendo Argentina ('AR') por defecto, pero detecta prefijos de Uruguay (+598), Brasil (+55), etc.
  const phoneNumber = parsePhoneNumberFromString(telefono, 'AR')
  
  return phoneNumber ? phoneNumber.isValid() : false
}