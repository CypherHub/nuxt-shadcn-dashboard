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
    console.log(`[UserController] registerUser called with email: ${email}, firstName: ${firstName}, lastName: ${lastName}, role: ${role}`)
    try {
      // Create authentication user
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      )
      console.log(`[UserController] Firebase user created with UID: ${userCredential.user.uid}`)

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
      console.log(`[UserController] User document created in Firestore for UID: ${user.id}`)

      return user
    } catch (error) {
      console.error('[UserController] Error registering user:', error)
      throw error
    }
  }

  async getUserData(uid: string): Promise<User | null> {
    console.log(`[UserController] getUserData called with uid: ${uid}`)
    try {
      const userDoc = await getDoc(doc(this.db, 'users', uid))
      if (!userDoc.exists()) {
        console.log(`[UserController] No user found for UID: ${uid}`)
        return null
      }
      console.log(`[UserController] User data fetched for UID: ${uid}`)
      return userDoc.data() as User
    } catch (error) {
      console.error('[UserController] Error fetching user data:', error)
      throw error
    }
  }
} 