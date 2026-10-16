<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { PhLockKey, PhEnvelopeSimple, PhArrowRight, PhStorefront } from '@phosphor-icons/vue'

const router = useRouter()
const email = ref('')
const password = ref('')
const errorMsg = ref('')

const handleLogin = () => {
  errorMsg.value = ''

  if (email.value.trim() === 'elsa@admin.com' && password.value === 'elsadmin') {
    const tokenSimulado = `elsa_token_${crypto.randomUUID()}`
    localStorage.setItem('elsa_admin_token', tokenSimulado)
    router.push('/admin/pedidos')
  } else {
    errorMsg.value = 'Correo o contraseña incorrectos.'
  }
}
</script>

<template>
  <div class="min-h-screen bg-fondo flex items-center justify-center p-5 transition-colors duration-300">
    <div class="w-full max-w-md bg-superficie border border-borde-suave rounded-3xl p-8 shadow-xl space-y-6">
      
      <div class="text-center space-y-2">
        <div class="size-14 mx-auto rounded-2xl bg-verde-marca/10 text-verde-marca dark:bg-acento/20 dark:text-acento flex items-center justify-center">
          <PhStorefront :size="32" weight="fill" />
        </div>
        <h1 class="font-titulo text-2xl font-bold text-tinta">Elsa Coffee & Wine</h1>
        <p class="text-xs text-tinta-suave">Panel de Administración de Pedidos</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div v-if="errorMsg" class="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-medium text-center">
          {{ errorMsg }}
        </div>

        <div>
          <label class="text-xs font-medium text-tinta-suave block mb-1">Correo Electrónico</label>
          <div class="relative flex items-center">
            <PhEnvelopeSimple :size="18" class="absolute left-3.5 text-tinta-suave" />
            <input 
              v-model="email" 
              type="email" 
              placeholder="elsa@admin.com" 
              class="w-full bg-fondo border border-borde-suave rounded-xl pl-10 pr-4 py-2.5 text-sm text-tinta focus:outline-none focus:border-verde-marca" 
              required
            />
          </div>
        </div>

        <div>
          <label class="text-xs font-medium text-tinta-suave block mb-1">Contraseña</label>
          <div class="relative flex items-center">
            <PhLockKey :size="18" class="absolute left-3.5 text-tinta-suave" />
            <input 
              v-model="password" 
              type="password" 
              placeholder="••••••••" 
              class="w-full bg-fondo border border-borde-suave rounded-xl pl-10 pr-4 py-2.5 text-sm text-tinta focus:outline-none focus:border-verde-marca" 
              required
            />
          </div>
        </div>

        <button 
          type="submit" 
          class="w-full py-3.5 rounded-full bg-verde-marca text-crema text-sm font-medium hover:bg-acento hover:text-verde-marca transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 pt-2"
        >
          <span>INGRESAR AL PANEL</span>
          <PhArrowRight :size="16" weight="bold" />
        </button>
      </form>

    </div>
  </div>
</template>