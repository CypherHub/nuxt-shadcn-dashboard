// middleware/auth.global.ts
import { onAuthStateChanged } from 'firebase/auth'

export default defineNuxtRouteMiddleware(async (to) => {
  // Skip auth check during SSR
  if (process.server) {
    console.log('Skipping auth check during SSR')
    return
  }

  console.log('Middleware running for path:', to.path)
  
  const { $auth } = useNuxtApp()
  console.log('Auth instance:', $auth)
  
  // List of public routes that don't require authentication
  const publicRoutes = ['/login', '/signup', '/forgot-password', '/register']
  
  // If the route is public, allow access
  if (publicRoutes.includes(to.path)) {
    console.log('Public route, allowing access')
    return
  }

  // Check auth state
  try {
    console.log('Checking auth state...')
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged($auth, (user) => {
        console.log('Auth state changed:', user)
        unsubscribe() // Clean up the listener
        
        if (!user) {
          console.log('No user found, redirecting to login')
          resolve(navigateTo('/login'))
        } else {
          resolve() // Allow the navigation to proceed
        }
      })
    })
  } catch (error) {
    console.error('Auth error:', error)
    return navigateTo('/login')
  }
})