// src/utils/validators.ts

export const validarNombreApellido = (nombre: string, apellido: string): boolean => {
  return Boolean(nombre.trim() && apellido.trim())
}

export const validarEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const limpiarYValidarTelefono = (telefono: string): boolean => {
  const telLimpio = telefono.replace(/\D/g, '')
  return telLimpio.length >= 10
}