import type { User } from '~/models/User'
import { doc, getDoc } from 'firebase/firestore'

export const useUser = () => {
  const { $db, $auth } = useNuxtApp()
  const user = useState<User | null>('user', () => null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchUserData = async () => {
    try {
      loading.value = true
      error.value = null
      
      const currentUser = $auth.currentUser
      if (!currentUser) {
        throw new Error('No authenticated user found')
      }
      
      console.log('fetching user data for uid', currentUser.uid)
      const userDoc = await getDoc(doc($db, 'users', currentUser.uid))
      if (!userDoc.exists()) {
        throw new Error('User not found')
      }
      
      const data = userDoc.data() as User
      
      user.value = {
        ...data,
        id: data.id ?? userDoc.id
      }
      console.log("[useUser] user.value", user.value);
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