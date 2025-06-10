import { config } from 'dotenv';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { User, UserRole } from '../models/User';

// Load environment variables from .env.test
config({ path: '.env.test' });

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

describe('Teacher Signup and Firestore Integration', () => {
  const testTeacher = {
    email: 'teacher@example.com',
    password: 'testPassword1234',
    firstName: 'Test',
    lastName: 'Teacher',
    role: 'teacher' as const,
  };

  afterAll(async () => {
    // Clean up: Delete the test user from Firebase Auth
    if (auth.currentUser) {
      //delete the user from firestore
      console.log('Deleting test user from firestore', auth.currentUser.uid);
      await deleteDoc(doc(db, 'users', auth.currentUser.uid));
      
      console.log('Deleting test user', auth.currentUser.uid);
      await auth.currentUser.delete();
    }
  });

  test('should create a new teacher user and store in Firestore', async () => {
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      testTeacher.email,
      testTeacher.password
    );

    // Create user document in Firestore
    const userData: User = {
      id: userCredential.user.uid,
      firstName: testTeacher.firstName,
      lastName: testTeacher.lastName,
      email: testTeacher.email,
      role: testTeacher.role as UserRole,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await setDoc(doc(db, 'users', userCredential.user.uid), userData);

    // Verify user was created in Firestore
    const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
    expect(userDoc.exists()).toBe(true);
    
    const storedUser = userDoc.data() as User;
    expect(storedUser.email).toBe(testTeacher.email);
    expect(storedUser.firstName).toBe(testTeacher.firstName);
    expect(storedUser.lastName).toBe(testTeacher.lastName);
    expect(storedUser.role).toBe(testTeacher.role);
  });
}); 