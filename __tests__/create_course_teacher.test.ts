import { config } from 'dotenv';
import { initializeApp, deleteApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { CourseController } from '../controllers/CourseController';
import { Lecture, Section, Course } from '../models/Course';

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

describe('Teacher Course Creation', () => {
  let courseController: CourseController;
  let teacherId: string;

  beforeAll(async () => {
    // Sign in with existing teacher
    await signInWithEmailAndPassword(
      auth,
      'teacher@example.com',
      'testPassword1234'
    );
    teacherId = auth.currentUser?.uid as string;
    courseController = new CourseController(db);
  });

  afterAll(async () => {
    // Sign out
    await auth.signOut();
    
    // Clean up Firebase app
    await deleteApp(app);
  });

  test('should throw error when teacher tries to create a course', async () => {
    // Create course data
    const courseData: Course = {
      title: 'Test Course',
      description: 'A test course',
      id: 'test-course-id',
      teacherIds: [teacherId],
      sections: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      courseImageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&h=300&fit=cropnull',
    };

    // Attempt to create course and expect it to fail
    await expect(courseController.createCourse(courseData)).rejects.toThrow('7 PERMISSION_DENIED: Missing or insufficient permissions.');
  });
});