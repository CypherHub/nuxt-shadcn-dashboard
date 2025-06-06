export default defineNuxtRouteMiddleware(async (to) => {
  console.log('Auth middleware running for path:', to.path)
  const { $auth } = useNuxtApp()
  const user = useState('user')
  const isInitialized = useState('auth-initialized', () => false)

  // Skip auth check during SSR
  if (process.server) {
    console.log('Skipping auth check during SSR')
    return
  }

  // List of public routes that don't require authentication
  const publicRoutes = ['/login', '/signup', '/forgot-password', '/register']
  
  // If auth is not initialized yet, wait for it
  if (!isInitialized.value) {
    console.log('Waiting for auth initialization...')
    await new Promise((resolve) => {
      const unsubscribe = $auth.onAuthStateChanged((firebaseUser) => {
        user.value = firebaseUser
        isInitialized.value = true
        unsubscribe()
        resolve(true)
      })
    })
  }

  // If the route is public, allow access
  if (publicRoutes.includes(to.path)) {
    console.log('Public route, allowing access')
    return
  }

  // If user is not authenticated, redirect to loading page
  if (!user.value) {
    console.log('User not authenticated, redirecting to loading page')
    return navigateTo('/login')
  }
  
  if (user.value && to.path === '/login') {
    console.log('User authenticated, redirecting to dashboard')
    return navigateTo('/')
  }

  console.log('User authenticated, allowing access')
})