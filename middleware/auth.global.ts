// middleware/auth.global.ts
import { onAuthStateChanged } from 'firebase/auth'

export default defineNuxtRouteMiddleware(async (to) => {
  console.log('Middleware running for path:', to.path)
  
  const { $auth } = useNuxtApp()
  console.log('Auth instance:', $auth)
  
  const user = ref(null)
  const loading = ref(true)

  // List of public routes that don't require authentication
  const publicRoutes = ['/login', '/signup', '/forgot-password']
  
  // If the route is public, allow access
  if (publicRoutes.includes(to.path)) {
    console.log('Public route, allowing access')
    return
  }

  // Check auth state
  try {
    console.log('Checking auth state...')
    const unsubscribe = onAuthStateChanged($auth, (newUser) => {
      console.log('Auth state changed:', newUser)
      user.value = newUser
      loading.value = false
    })
    
    // Wait for initial auth state
    await new Promise(resolve => setTimeout(resolve, 100))
    
    if (!user.value) {
      console.log('No user found, redirecting to login')
      return navigateTo('/login')
    }
  } catch (error) {
    console.error('Auth error:', error)
    return navigateTo('/login')
  }
})