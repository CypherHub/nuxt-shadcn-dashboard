import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import type { User } from '~/models/User'

export class UserController {
  constructor(
    private auth: any,
    private db: any
  ) {}

  async registerUser(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role: 'student' | 'teacher' = 'student'
  ): Promise<User> {
    try {
      // Create authentication user
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      )

      // Create user document in Firestore
      const user: User = {
        id: userCredential.user.uid,
        firstName,
        lastName,
        email,
        role,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      // Save user data to Firestore
      await setDoc(doc(this.db, 'users', user.id), user)

      return user
    } catch (error) {
      console.error('Error registering user:', error)
      throw error
    }
  }

  async getUserData(uid: string): Promise<User | null> {
    try {
      const userDoc = await getDoc(doc(this.db, 'users', uid))
      if (!userDoc.exists()) {
        return null
      }
      return userDoc.data() as User
    } catch (error) {
      console.error('Error fetching user data:', error)
      throw error
    }
  }
} 