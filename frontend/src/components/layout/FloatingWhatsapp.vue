<script setup lang="ts">
import { negocio } from '@/data/business'
import AuthorButton from '@/components/ui/AuthorButton.vue'
import { PhWhatsappLogo } from '@phosphor-icons/vue'
</script>

<template>
  <div class="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] z-50">
    <AuthorButton
      variant="icono"
      :href="negocio.whatsappUrl"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribinos por WhatsApp"
      class="size-14 shadow-lg hover:scale-105 transition-transform"
    >
      <PhWhatsappLogo :size="38" weight="fill" class="text-verde-marca dark:text-rosa-marca" />
    </AuthorButton>
  </div>
</template>