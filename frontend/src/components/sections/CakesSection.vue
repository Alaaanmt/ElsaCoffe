<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { PhArrowRight, PhCaretLeft, PhCaretRight } from '@phosphor-icons/vue'
import FadeInObserver from '@/components/ui/FadeInObserver.vue'
import { tortasCompletas } from '@/data/cakes'

const router = useRouter()
const scrollContainer = ref<HTMLElement | null>(null)

const idsDestacados = ['matilda', 'torta-patagonica', 'crumble-manzana', 'elsa']
const tortasDestacadas = computed(() => {
  return tortasCompletas.filter(torta => idsDestacados.includes(torta.id))
})

const irACarta = () => {
  router.push('/tortas')
}

const scroll = (direction: 'left' | 'right') => {
  scrollContainer.value?.scrollBy({
    left: direction === 'left' ? -310 : 310,
    behavior: 'smooth',
  })
}
</script>

<template>
  <section
    id="tortas"
    class="overflow-hidden border-y border-borde-suave bg-superficie px-5 py-24 transition-colors duration-500 sm:px-8 md:py-36"
  >
    <div class="mx-auto max-w-7xl px-5 sm:px-8">
      <FadeInObserver>
        <div class="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          <!-- Presentación -->
          <div class="space-y-7 lg:col-span-4">
            <div>
              <span class="mb-4 block text-xs font-semibold uppercase tracking-[0.22em] text-verde-marca dark:text-acento">
                Nuestras especialidades
              </span>
              <h2 class="font-titulo text-4xl font-semibold leading-[1.12] tracking-tight text-tinta sm:text-5xl">
                El arte de la <span class="font-normal italic">pastelería.</span>
              </h2>
            </div>

            <p class="max-w-md font-cuerpo text-base leading-relaxed text-tinta-suave md:text-lg">
              Tortas artesanales elaboradas con dedicación, para compartir algo especial en cada ocasión.
            </p>

            <p class="text-sm text-tinta-suave">Encargá tu torta con 48 horas de anticipación.</p>

            <div class="flex flex-wrap items-center gap-4 pt-1">
              <button
                type="button"
                @click="irACarta"
                class="cursor-pointer group inline-flex items-center gap-3 rounded-full bg-verde-marca px-6 py-3.5 text-sm font-semibold text-crema shadow-sm transition-all hover:bg-acento hover:text-verde-marca"
              >
                <span>Descubrir las tortas</span>
                <PhArrowRight :size="17" weight="bold" class="transition-transform group-hover:translate-x-1" />
              </button>

              <div class="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Ver tortas anteriores"
                  @click="scroll('left')"
                  class="cursor-pointer flex size-10 items-center justify-center rounded-full border border-borde-suave bg-fondo text-tinta transition-colors hover:border-verde-marca dark:hover:border-acento"
                >
                  <PhCaretLeft :size="19" weight="bold" />
                </button>
                <button
                  type="button"
                  aria-label="Ver más tortas"
                  @click="scroll('right')"
                  class="cursor-pointer flex size-10 items-center justify-center rounded-full border border-borde-suave bg-fondo text-tinta transition-colors hover:border-verde-marca dark:hover:border-acento"
                >
                  <PhCaretRight :size="19" weight="bold" />
                </button>
              </div>
            </div>
          </div>

          <!-- Fotografías destacadas-->
          <div class="min-w-0 lg:col-span-8">
            <div
              ref="scrollContainer"
              class="scrollbar-none flex snap-x snap-mandatory items-start gap-5 overflow-x-auto pb-3"
            >
              <button
                v-for="torta in tortasDestacadas"
                :key="torta.id"
                type="button"
                @click="irACarta"
                :aria-label="`Conocer ${torta.nombre}`"
                class="group w-[76%] shrink-0 snap-start text-left sm:w-[46%] lg:w-[calc(50%-10px)]"
              >
                <div class="cursor-pointer relative aspect-[4/5] overflow-hidden rounded-2xl bg-fondo">
                  <img
                    :src="torta.imagen"
                    :alt="torta.nombre"
                    loading="lazy"
                    class="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <!-- Degradado sutil para integrar el título -->
                  <div
                    class="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-100"
                  ></div>

                  <div class="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                    <h3 class="font-titulo text-2xl font-semibold text-white sm:text-3xl">
                      {{ torta.nombre }}
                    </h3>
                    <div
                      class="mt-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/90 opacity-100 transition-all duration-300 sm:translate-y-2 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100"
                    >
                      <span>Descubrir</span>
                      <PhArrowRight :size="15" weight="bold" />
                    </div>
                  </div>
                </div>
              </button>
            </div>
            <p class="mt-3 text-right text-xs text-tinta-suave sm:hidden">Deslizá para descubrir más</p>
          </div>
        </div>
      </FadeInObserver>
    </div>
  </section>
</template>

<style scoped>
.scrollbar-none::-webkit-scrollbar {
  display: none;
}
.scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>