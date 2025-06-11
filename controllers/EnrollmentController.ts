import { doc, setDoc, collection, query, where, getDocs, getDoc, orderBy } from 'firebase/firestore'
import type { Enrollment } from '~/models/Enrollment'

export class EnrollmentController {
  constructor(private db: any) {}

  async createEnrollment(userId: string, courseId: string): Promise<Enrollment> {
    console.log('[EnrollmentController] createEnrollment called with userId:', userId, 'courseId:', courseId)
    try {
      const enrollmentRef = doc(collection(this.db, 'enrollments'))
      const enrollment: Enrollment = {
        id: enrollmentRef.id,
        userId,
        courseId,
        sections: [],
        overallProgress: 0,
        enrolledAt: new Date(),
        lastAccessedAt: new Date()
      }

      await setDoc(enrollmentRef, enrollment)
      console.log('[EnrollmentController] Enrollment created with ID:', enrollment.id)
      return enrollment
    } catch (error) {
      console.error('[EnrollmentController] Error creating enrollment:', error)
      throw error
    }
  }

  async getUserEnrollments(userId: string): Promise<Enrollment[]> {
    console.log('[EnrollmentController] getUserEnrollments called for userId:', userId)
    try {
      const enrollmentsQuery = query(
        collection(this.db, 'enrollments'),
        where('userId', '==', userId),
        orderBy('enrolledAt', 'desc')
      )

      const enrollmentsSnapshot = await getDocs(enrollmentsQuery)
      const enrollments = enrollmentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Enrollment[]

      console.log('[EnrollmentController] Fetched', enrollments.length, 'enrollments')
      return enrollments
    } catch (error) {
      console.error('[EnrollmentController] Error fetching user enrollments:', error)
      throw error
    }
  }

  async getCourseEnrollments(courseId: string): Promise<Enrollment[]> {
    console.log('[EnrollmentController] getCourseEnrollments called for courseId:', courseId)
    try {
      const enrollmentsQuery = query(
        collection(this.db, 'enrollments'),
        where('courseId', '==', courseId),
        orderBy('enrolledAt', 'desc')
      )

      const enrollmentsSnapshot = await getDocs(enrollmentsQuery)
      const enrollments = enrollmentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Enrollment[]

      console.log('[EnrollmentController] Fetched', enrollments.length, 'enrollments')
      return enrollments
    } catch (error) {
      console.error('[EnrollmentController] Error fetching course enrollments:', error)
      throw error
    }
  }

  async getEnrollment(enrollmentId: string): Promise<Enrollment> {
    console.log('[EnrollmentController] getEnrollment called for enrollmentId:', enrollmentId)
    try {
      const enrollmentDoc = await getDoc(doc(this.db, 'enrollments', enrollmentId))
      if (!enrollmentDoc.exists()) {
        throw new Error('Enrollment not found')
      }

      const enrollment = {
        id: enrollmentDoc.id,
        ...enrollmentDoc.data()
      } as Enrollment

      console.log('[EnrollmentController] Fetched enrollment:', enrollment)
      return enrollment
    } catch (error) {
      console.error('[EnrollmentController] Error fetching enrollment:', error)
      throw error
    }
  }

}
