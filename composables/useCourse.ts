import { CourseController } from '~/controllers/CourseController'
import type { Course } from '~/models/Course'

export const useCourse = () => {
  const { $db } = useNuxtApp()
  const { user } = useAuth()
  const courseController = new CourseController($db)
  
  const courses = ref<Course[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchCourses = async () => {
    if (!user.value) {
      console.log('[useCourse] User not authenticated, aborting fetchCourses')
      throw new Error('User must be authenticated to fetch courses')
    }

    try {
      console.log('[useCourse] Fetching courses...')
      loading.value = true
      error.value = null
      courses.value = await courseController.getAllCourses()
      console.log('[useCourse] Courses fetched:', courses.value)
    } catch (e: any) {
      error.value = e.message
      console.error('[useCourse] Error fetching courses:', e)
      throw e
    } finally {
      loading.value = false
      console.log('[useCourse] Loading finished')
    }
  }

  const fetchCourseById = async (id: string) => {
    console.log('[useCourse] fetchCourseById called for courseId:', id)
    try {
      const course = await courseController.getCourseDetails(id)
      console.log('[useCourse] Course fetched:', course)
      return course
    } catch (e: any) {
      console.error('[useCourse] Error fetching course:', e)
      throw e
    }
  }

  return {
    courses,
    loading,
    error,
    fetchCourses,
    fetchCourseById
  }
} 