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
  let createdCourseId: string;

  beforeAll(async () => {
    // Sign in with existing teacher
    await signInWithEmailAndPassword(
      auth,
      'teacher@example.com',
      'testPassword1234'
    );
    courseController = new CourseController(db);
  });

  afterAll(async () => {
    // Clean up the test course if it was created
    // if (createdCourseId) {
    //   await courseController.deleteCourse(createdCourseId);
    // }
    
    // Sign out
    await auth.signOut();
    
    // Clean up Firebase app
    await deleteApp(app);
  });

  test('should create a course with a section and lecture', async () => {
    // Create course
    const courseData: Course = {
      title: 'Test Course',
      description: 'A test course',
      id: 'test-course-id',
      sections: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      courseImageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&h=300&fit=cropnull',
    };

    const course = await courseController.createCourse(courseData);
    createdCourseId = course.id; // Store the course ID for cleanup
    expect(course.id).toBeDefined();
    expect(course.title).toBe(courseData.title);

    // Create section
    const sectionData: Section = {
      title: 'Test Section',
      id: 'test-section-id',
      lectures: [],
    };

    const section = await courseController.addSection(course.id, sectionData);
    expect(section.id).toBeDefined();
    expect(section.title).toBe(sectionData.title);

    // Create lecture
    const lectureData: Lecture = {
      title: 'Test Lecture',
      isVideo: false,
      isHTML: true,
      isPDF: false,
      isQuiz: false,
      videoUrl: null,
      html: '<p>Test lecture content</p>',
      pdfUrl: null,
      quizId: null,
      id: 'test-lecture-id',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const lecture = await courseController.addLecture(course.id, section.id, lectureData);
    expect(lecture.id).toBeDefined();
    expect(lecture.title).toBe(lectureData.title);
    expect(lecture.isHTML).toBe(true);
    expect(lecture.html).toContain('Test lecture content');
  });
});