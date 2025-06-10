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
    console.log('[useEnrollment] getAllEnrolledCourses called')
    if (!user.value) {
      console.error('[useEnrollment] User not authenticated')
      throw new Error('User not authenticated')
    }

    try {
      loading.value = true
      error.value = null
      console.log('[useEnrollment] Querying enrollments for user:', user.value.id)

      const enrollmentsQuery = query(
        collection($db, 'enrollments'),
        where('userId', '==', user.value.id),
        orderBy('enrolledAt', 'desc')
      )

      const enrollmentsSnapshot = await getDocs(enrollmentsQuery)
      console.log('[useEnrollment] Fetched enrollmentsSnapshot:', enrollmentsSnapshot.size)
      const enrollmentsData = enrollmentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Enrollment[]

      enrollments.value = enrollmentsData
      console.log('[useEnrollment] enrollments.value updated:', enrollmentsData)
      return enrollmentsData
    } catch (e: any) {
      error.value = e.message
      console.error('[useEnrollment] Error in getAllEnrolledCourses:', e)
      throw e
    } finally {
      loading.value = false
      console.log('[useEnrollment] getAllEnrolledCourses loading finished')
    }
  }

  // Get all student enrollments for a specific course (for teachers)
  const getAllStudentEnrollments = async (courseId: string) => {
    console.log('[useEnrollment] getAllStudentEnrollments called with courseId:', courseId)
    if (!user.value || user.value.role !== 'teacher') {
      console.error('[useEnrollment] Unauthorized access attempt by user:', user.value)
      throw new Error('Unauthorized: Only teachers can view all student enrollments')
    }

    try {
      loading.value = true
      error.value = null
      console.log('[useEnrollment] Querying enrollments for course:', courseId)

      const enrollmentsQuery = query(
        collection($db, 'enrollments'),
        where('courseId', '==', courseId),
        orderBy('enrolledAt', 'desc')
      )

      const enrollmentsSnapshot = await getDocs(enrollmentsQuery)
      console.log('[useEnrollment] Fetched enrollmentsSnapshot:', enrollmentsSnapshot.size)
      const enrollmentsData = enrollmentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Enrollment[]

      console.log('[useEnrollment] Returning enrollmentsData:', enrollmentsData)
      return enrollmentsData
    } catch (e: any) {
      error.value = e.message
      console.error('[useEnrollment] Error in getAllStudentEnrollments:', e)
      throw e
    } finally {
      loading.value = false
      console.log('[useEnrollment] getAllStudentEnrollments loading finished')
    }
  }

  // Get a single enrollment by ID
  const getEnrollment = async (enrollmentId: string) => {
    console.log('[useEnrollment] getEnrollment called with enrollmentId:', enrollmentId)
    try {
      loading.value = true
      error.value = null

      const enrollmentDoc = await getDoc(doc($db, 'enrollments', enrollmentId))
      if (!enrollmentDoc.exists()) {
        console.error('[useEnrollment] Enrollment not found for id:', enrollmentId)
        throw new Error('Enrollment not found')
      }

      const data = {
        id: enrollmentDoc.id,
        ...enrollmentDoc.data()
      } as Enrollment
      console.log('[useEnrollment] Returning enrollment:', data)
      return data
    } catch (e: any) {
      error.value = e.message
      console.error('[useEnrollment] Error in getEnrollment:', e)
      throw e
    } finally {
      loading.value = false
      console.log('[useEnrollment] getEnrollment loading finished')
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