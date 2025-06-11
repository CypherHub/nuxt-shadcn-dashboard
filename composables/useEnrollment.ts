import type { Enrollment } from '~/models/Enrollment'
import { EnrollmentController } from '~/controllers/EnrollmentController'

export const useEnrollment = () => {
  const { $db } = useNuxtApp()
  const { user } = useUser()
  
  const enrollments = useState<Enrollment[]>('enrollments', () => [])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const enrollmentController = new EnrollmentController($db)

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
      const enrollmentsData = await enrollmentController.getUserEnrollments(user.value.id)
      enrollments.value = enrollmentsData
      return enrollmentsData
    } catch (e: any) {
      error.value = e.message
      console.error('[useEnrollment] Error in getAllEnrolledCourses:', e)
      throw e
    } finally {
      loading.value = false
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
      return await enrollmentController.getCourseEnrollments(courseId)
    } catch (e: any) {
      error.value = e.message
      console.error('[useEnrollment] Error in getAllStudentEnrollments:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  // Get a single enrollment by ID
  const getEnrollment = async (enrollmentId: string) => {
    console.log('[useEnrollment] getEnrollment called with enrollmentId:', enrollmentId)
    try {
      loading.value = true
      error.value = null
      return await enrollmentController.getEnrollment(enrollmentId)
    } catch (e: any) {
      error.value = e.message
      console.error('[useEnrollment] Error in getEnrollment:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  // Create a new enrollment
  const createEnrollment = async (courseId: string) => {
    console.log('[useEnrollment] createEnrollment called with courseId:', courseId)
    if (!user.value) {
      throw new Error('User not authenticated')
    }

    try {
      loading.value = true
      error.value = null
      return await enrollmentController.createEnrollment(user.value.id, courseId)
    } catch (e: any) {
      error.value = e.message
      console.error('[useEnrollment] Error in createEnrollment:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  // Update enrollment progress
  const updateEnrollmentProgress = async (
    enrollmentId: string,
    sections: Enrollment['sections'],
    overallProgress: number
  ) => {
    console.log('[useEnrollment] updateEnrollmentProgress called')
    try {
      loading.value = true
      error.value = null
      return await enrollmentController.updateEnrollmentProgress(
        enrollmentId,
        sections,
        overallProgress
      )
    } catch (e: any) {
      error.value = e.message
      console.error('[useEnrollment] Error in updateEnrollmentProgress:', e)
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
    getEnrollment,
    createEnrollment,
    updateEnrollmentProgress
  }
} 