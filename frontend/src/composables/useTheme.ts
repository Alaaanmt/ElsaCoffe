import { ref, watchEffect } from 'vue'

const tema = ref<'claro' | 'oscuro'>('claro')

export function useTheme() {
  const iniciarTema = () => {
    try {
      const guardado = localStorage.getItem('elsa-tema') as 'claro' | 'oscuro' | null
      if (guardado) {
        tema.value = guardado
      } else {
        const prefiereOscuro = window.matchMedia('(prefers-color-scheme: dark)').matches
        tema.value = prefiereOscuro ? 'oscuro' : 'claro'
      }
    } catch {
      tema.value = 'claro'
    }
    aplicarTema(tema.value)
  }

  const aplicarTema = (nuevoTema: 'claro' | 'oscuro') => {
    const root = document.documentElement
    if (nuevoTema === 'oscuro') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    root.style.colorScheme = nuevoTema
    
    const metaTheme = document.querySelector('meta[name="theme-color"]')
    if (metaTheme) {
      metaTheme.setAttribute('content', nuevoTema === 'oscuro' ? '#152B19' : '#FDFBF7')
    }
  }

  const alternarTema = () => {
    tema.value = tema.value === 'claro' ? 'oscuro' : 'claro'
    aplicarTema(tema.value)
    try {
      localStorage.setItem('elsa-tema', tema.value)
    } catch {
    }
  }

  return {
    tema,
    iniciarTema,
    alternarTema
  }
}