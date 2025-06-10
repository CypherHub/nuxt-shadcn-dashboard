import type { Enrollment } from '~/models/Enrollment'
import type { Course } from '~/models/Course'
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore'

export const useEnrollment = () => {
  const { $db } = useNuxtApp()
  const { user } = useUser()
  
  const enrollments = useState<Enrollment[]>('enrollments', () => [])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Get all courses the logged-in user is enrolled in
  const getAllEnrolledCourses = async () => {
    if (!user.value) {
      throw new Error('User not authenticated')
    }

    try {
      loading.value = true
      error.value = null

      const enrollmentsQuery = query(
        collection($db, 'enrollments'),
        where('userId', '==', user.value.id),
        orderBy('enrolledAt', 'desc')
      )

      const enrollmentsSnapshot = await getDocs(enrollmentsQuery)
      const enrollmentsData = enrollmentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Enrollment[]

      enrollments.value = enrollmentsData
      return enrollmentsData
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  // Get all student enrollments for a specific course (for teachers)
  const getAllStudentEnrollments = async (courseId: string) => {
    if (!user.value || user.value.role !== 'teacher') {
      throw new Error('Unauthorized: Only teachers can view all student enrollments')
    }

    try {
      loading.value = true
      error.value = null

      const enrollmentsQuery = query(
        collection($db, 'enrollments'),
        where('courseId', '==', courseId),
        orderBy('enrolledAt', 'desc')
      )

      const enrollmentsSnapshot = await getDocs(enrollmentsQuery)
      const enrollmentsData = enrollmentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Enrollment[]

      return enrollmentsData
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  // Get a single enrollment by ID
  const getEnrollment = async (enrollmentId: string) => {
    try {
      loading.value = true
      error.value = null

      const enrollmentDoc = await getDoc(doc($db, 'enrollments', enrollmentId))
      if (!enrollmentDoc.exists()) {
        throw new Error('Enrollment not found')
      }

      return {
        id: enrollmentDoc.id,
        ...enrollmentDoc.data()
      } as Enrollment
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }


  return {
    enrollments,
    loading,
    error,
    getAllEnrolledCourses,
    getAllStudentEnrollments,
    getEnrollment
  }
} 