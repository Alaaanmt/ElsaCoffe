<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const elementRef = ref<HTMLElement | null>(null)
const isVisible = ref(false)
let observer: IntersectionObserver | null = null

onMounted(() => {
  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry?.isIntersecting) {
        isVisible.value = true
        // Una vez que aparece, dejamos de observar para optimizar rendimiento
        if (elementRef.value) observer?.unobserve(elementRef.value)
      }
    },
    { threshold: 0.15 } // Se dispara cuando el 15% del bloque es visible
  )

  if (elementRef.value) {
    observer.observe(elementRef.value)
  }
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<template>
  <div
    ref="elementRef"
    class="transition-all duration-700 ease-out"
    :class="[
      isVisible 
        ? 'opacity-100 translate-y-0' 
        : 'opacity-0 translate-y-6'
    ]"
  >
    <slot />
  </div>
</template>