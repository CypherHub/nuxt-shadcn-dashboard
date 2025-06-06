import { 
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  type User
} from 'firebase/auth'

export const useAuth = () => {
  const { $auth } = useNuxtApp()
  const user = useState<User | null>('user', () => null)
  const error = ref<string | null>(null)
  const loading = ref(false)

  const loginWithEmail = async (email: string, password: string) => {
    try {
      loading.value = true
      error.value = null
      const result = await signInWithEmailAndPassword($auth, email, password)
      user.value = result.user
      return result.user
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  const loginWithGoogle = async () => {
    try {
      loading.value = true
      error.value = null
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup($auth, provider)
      user.value = result.user
      return result.user
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      await signOut($auth)
      user.value = null
    } catch (e: any) {
      error.value = e.message
      throw e
    }
  }

  return {
    user,
    error,
    loading,
    loginWithEmail,
    loginWithGoogle,
    logout,
  }
} 