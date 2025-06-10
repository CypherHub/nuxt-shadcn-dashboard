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
      throw new Error('User must be authenticated to fetch courses')
    }

    try {
      loading.value = true
      error.value = null
      courses.value = await courseController.getAllCourses()
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    courses,
    loading,
    error,
    fetchCourses
  }
} 