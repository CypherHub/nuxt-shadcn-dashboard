// composables/useAuth.ts
import { 
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    type User
  } from 'firebase/auth'
  
  export const useAuth = () => {
    const { $auth } = useNuxtApp()
    const user = ref<User | null>(null)
    const loading = ref(true)
  
    onAuthStateChanged($auth, (newUser) => {
      user.value = newUser
      loading.value = false
    })
  
    const login = async (email: string, password: string) => {
      try {
        const userCredential = await signInWithEmailAndPassword($auth, email, password)
        return { success: true, user: userCredential.user }
      } catch (error) {
        return { success: false, error }
      }
    }
  
    const logout = async () => {
      try {
        await firebaseSignOut($auth)
        return { success: true }
      } catch (error) {
        return { success: false, error }
      }
    }
  
    return {
      user,
      loading,
      login,
      logout,
    }
  }