<script setup lang="ts">
import { useTheme } from '@/composables/useTheme'
import AuthorButton from '@/components/ui/AuthorButton.vue'
import { PhSun, PhMoon } from '@phosphor-icons/vue'

const { tema, alternarTema } = useTheme()
</script>

<template>
  <AuthorButton
    variant="icono"
    @click="alternarTema"
    :aria-label="tema === 'claro' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'"
    role="switch"
    :aria-checked="tema === 'oscuro'"
  >
    <PhSun v-if="tema === 'oscuro'" :size="20" weight="bold" class="text-acento" />
    <PhMoon v-else :size="20" weight="bold" class="text-verde-marca" />
  </AuthorButton>
</template>