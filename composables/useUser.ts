import type { User } from '~/models/User'
import { doc, getDoc } from 'firebase/firestore'

export const useUser = () => {
  const { $db } = useNuxtApp()
  const user = useState<User | null>('user', () => null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchUserData = async (uid: string) => {
    try {
      loading.value = true
      error.value = null
      
      console.log('fetching user data for uid', uid)
      const userDoc = await getDoc(doc($db, 'users', uid))
      if (!userDoc.exists()) {
        throw new Error('User not found')
      }
      
      user.value = userDoc.data() as User
      return user.value
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  const clearUser = () => {
    user.value = null
    error.value = null
  }

  return {
    user,
    loading,
    error,
    fetchUserData,
    clearUser
  }
} 