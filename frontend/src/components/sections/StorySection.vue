<script setup lang="ts">
import { historia } from '@/data/story'
</script>

<template>
    <section id="historia" class="relative bg-superficie pt-28 md:pt-32 pb-24 md:pb-36 transition-colors duration-500">
    
    <div class="absolute top-0 md:top-10 inset-x-0 w-full overflow-hidden leading-none pointer-events-none -translate-y-[99%] z-40">
      <svg 
        class="relative block w-full h-12 md:h-24 text-superficie" 
        viewBox="0 0 1200 120" 
        preserveAspectRatio="none"
        fill="currentColor"
      >
        <path d="M0,0 C150,90 350,-40 500,40 C650,120 900,10 1200,60 L1200,120 L0,120 Z"></path>
      </svg>
    </div>

    <div class="mx-auto max-w-7xl px-5 sm:px-8 relative z-30">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

                <!-- Columna de Texto Editorial -->
                <div class="lg:col-span-6 space-y-8">
                    <div>
                        <span class="text-xs uppercase tracking-[0.2em] font-medium text-tinta-suave mb-3 block">
                            Nuestra Esencia
                        </span>
                        <h2
                            class="font-titulo text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight leading-[1.1] text-tinta">
                            Un espacio tranquilo donde vas a poder <span class="italic font-normal">disfrutar</span> de
                            un buen momento.
                        </h2>
                    </div>

                    <p class="font-cuerpo text-base md:text-lg text-tinta-suave leading-relaxed max-w-[65ch]">
                        {{ historia.textoOficial }}
                    </p>

                    <!-- Frases clave limpias -->
                    <ul class="flex flex-wrap gap-y-3 gap-x-8 pt-4 border-t border-borde-suave">
                        <li v-for="punto in historia.puntosClave" :key="punto"
                            class="flex items-center gap-2 text-sm font-medium text-tinta">
                            <span class="size-1.5 rounded-full bg-acento" />
                            {{ punto }}
                        </li>
                    </ul>
                </div>

                <!-- Columna de Collage Asimétrico de Autor -->
                <div class="lg:col-span-6 relative">
                    <div class="relative mx-auto max-w-md lg:max-w-none">

                        <!-- Imagen principal vertical -->
                        <div class="group overflow-hidden rounded-[1.25rem] shadow-xl aspect-[4/5] bg-superficie-alta">
                            <img src="@/assets/img/torta-franui.png"
                                alt="Porción de torta artesanal de elaboración propia"
                                class="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
                        </div>

                        <!-- Segunda imagen superpuesta -->
                        <div
                            class="group absolute -bottom-8 -left-6 sm:-left-10 w-3/5 overflow-hidden rounded-[1.25rem] shadow-2xl aspect-[1/1] border-4 border-superficie hidden sm:block bg-superficie-alta">
                            <img src="@/assets/img/tortita-negra-sandwich.png"
                                alt="Tortita negra rellena con ingredientes de calidad"
                                class="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
                        </div>

                    </div>
                </div>

            </div>
        </div>
    </section>
</template>