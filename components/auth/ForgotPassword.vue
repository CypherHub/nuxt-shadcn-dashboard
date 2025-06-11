<script setup lang="ts">
import { ref } from 'vue'
import { Loader2 } from 'lucide-vue-next'
import { useAuth } from '~/composables/useAuth'

const { sendResetEmail } = useAuth()

const email = ref('')
const isLoading = ref(false)
const message = ref('')
const errorMessage = ref('')

async function onSubmit(event: Event) {
  event.preventDefault()
  isLoading.value = true
  message.value = ''
  errorMessage.value = ''

  const result = await sendResetEmail(email.value)

  if (result.success) {
    message.value = '📩 Password reset email sent. Check your inbox.'
  } else {
    errorMessage.value = `❌ ${result.error}`
  }

  isLoading.value = false
}
</script>

<template>
  <form @submit="onSubmit">
    <div class="grid gap-4">
      <div class="grid gap-2">
        <Label for="email">
          Email
        </Label>
        <Input
          id="email"
          v-model="email"
          placeholder="name@example.com"
          type="email"
          auto-capitalize="none"
          auto-complete="email"
          auto-correct="off"
          :disabled="isLoading"
        />
      </div>

      <Button type="submit" :disabled="isLoading || !email">
        <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
        <span v-else>Submit</span>
      </Button>

      <!-- Success and Error Messages -->
      <p v-if="message" class="text-green-600 text-sm">{{ message }}</p>
      <p v-if="errorMessage" class="text-red-600 text-sm">{{ errorMessage }}</p>
    </div>
  </form>
</template>

<style scoped></style>
