<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next'
import PasswordInput from '~/components/PasswordInput.vue'
import { toast } from '~/components/ui/toast'

const email = ref('')
const password = ref('')
const { loginWithEmail, loginWithGoogle, loading, error, user } = useAuth()

// Check for authentication on component mount
onMounted(() => {
  if (user.value) {
    navigateTo('/')
  }
})

async function onSubmit(event: Event) {
  event.preventDefault()
  if (!email.value || !password.value) {
    toast({
      title: "Error",
      description: "Please fill in all fields",
      variant: "destructive"
    })
    return
  }

  try {
    await loginWithEmail(email.value, password.value)
    toast({
      title: "Success",
      description: "Successfully logged in",
    })
    navigateTo('/')
  } catch (e: any) {
    toast({
      title: "Error",
      description: e.message || "Failed to login",
      variant: "destructive"
    })
  }
}

async function handleGoogleLogin() {
  try {
    await loginWithGoogle()
    toast({
      title: "Success",
      description: "Successfully logged in with Google",
    })
    navigateTo('/')
  } catch (e: any) {
    toast({
      title: "Error",
      description: e.message || "Failed to login with Google",
      variant: "destructive"
    })
  }
}
</script>

<template>
  <form class="grid gap-6" @submit="onSubmit">
    <div class="flex flex-col gap-4">
      <Button
        type="button"
        variant="outline"
        class="w-full gap-2"
        @click="handleGoogleLogin"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="size-4">
          <path
            d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
            fill="currentColor"
          />
        </svg>
        Login with Google
      </Button>
    </div>
    <Separator label="Or continue with" />
    <div class="grid gap-2">
      <Label for="email">Email</Label>
      <Input
        id="email"
        v-model="email"
        type="email"
        placeholder="name@example.com"
        :disabled="loading"
        auto-capitalize="none"
        auto-complete="email"
        auto-correct="off"
      />
    </div>
    <div class="grid gap-2">
      <div class="flex items-center">
        <Label for="password">Password</Label>
        <NuxtLink
          to="/forgot-password"
          class="ml-auto inline-block text-sm underline"
        >
          Forgot your password?
        </NuxtLink>
      </div>
      <PasswordInput id="password" v-model="password" />
    </div>
    <Button type="submit" class="w-full" :disabled="loading">
      <Loader2 v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
      Login
    </Button>
  </form>
  <div class="mt-4 text-center text-sm text-muted-foreground">
    Don't have an account?
    <NuxtLink to="/register" class="underline">
      Sign up
    </NuxtLink>
  </div>
</template>

<style scoped>

</style>
