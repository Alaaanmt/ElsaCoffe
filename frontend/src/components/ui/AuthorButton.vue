<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primario-claro' | 'primario-oscuro' | 'secundario' | 'sobre-video' | 'pestana' | 'icono'
  href?: string
  tag?: string
  active?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'secundario',
  active: false
})

const isExternal = computed(() => props.href && (props.href.startsWith('http') || props.href.startsWith('#')))
</script>

<template>
  <component
    :is="href ? (isExternal ? 'a' : 'router-link') : (tag || 'button')"
    :href="isExternal ? href : undefined"
    :to="!isExternal && href ? href : undefined"
    class="relative isolate inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-medium transition-all duration-300 select-none whitespace-nowrap cursor-pointer active:scale-[0.97] hover:-translate-y-px focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foco motion-reduce:transition-none motion-reduce:transform-none"
    :class="[
      // Variantes de estilo de autor
      variant === 'primario-claro' && 'bg-verde-marca text-crema px-6 min-h-12 border border-verde-marca shadow-[0_10px_20px_-10px_var(--color-verde-marca)] hover:bg-acento hover:text-verde-marca',
      variant === 'primario-oscuro' && 'bg-rosa-marca text-verde-marca px-6 min-h-12 border border-rosa-marca shadow-[0_10px_20px_-10px_rgba(239,180,205,0.3)] hover:bg-crema hover:text-verde-marca',
      variant === 'secundario' && 'bg-transparent text-tinta px-6 min-h-12 border border-borde-control hover:bg-tinta hover:text-fondo',
      variant === 'sobre-video' && 'bg-transparent text-crema px-6 min-h-12 border border-crema/60 hover:bg-crema hover:text-verde-marca',
      variant === 'pestana' && [
        'px-5 min-h-10 text-sm border transition-colors',
        active 
          ? 'bg-tinta text-fondo border-tinta shadow-sm' 
          : 'bg-superficie text-tinta-suave border-borde-control hover:border-tinta hover:text-tinta'
      ],
      variant === 'icono' && 'size-12 p-0 rounded-full border border-borde-control bg-superficie text-tinta hover:bg-acento hover:text-verde-marca dark:hover:bg-crema dark:hover:text-verde-marca',
    ]"
  >
    <span class="relative z-10 inline-flex items-center justify-center gap-2">
      <slot />
    </span>
  </component>
</template>
