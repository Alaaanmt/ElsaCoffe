<script setup lang="ts">
import { useTheme } from '@/composables/useTheme'
import logoBlanco from '@/assets/img/logo-elsa-white.png'
import logoOscuro from '@/assets/img/logo-elsa.png'

interface Props {
  variant?: 'normal' | 'sobre-hero'
}

withDefaults(defineProps<Props>(), {
  variant: 'normal'
})

const { tema } = useTheme()
</script>

<template>
  <RouterLink to="/" class="group inline-flex items-center gap-3 transition-opacity hover:opacity-90">
    <div class="relative h-10 w-36 overflow-hidden rounded-md sm:h-12 sm:w-44 flex items-center  ">
      <img
        :src="tema === 'oscuro' ? logoBlanco : logoOscuro"
        alt="ELSA Coffee BA"
        class="h-32 w-full object-contain object-left transition-all duration-300"
        :class="[
          tema === 'oscuro' && variant !== 'sobre-hero' ? '' : ''
        ]"
      />
    </div>
  </RouterLink>
</template>