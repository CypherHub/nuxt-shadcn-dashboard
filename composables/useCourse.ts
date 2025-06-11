import { CourseController } from '~/controllers/CourseController'
import type { Course } from '~/models/Course'
import type { Section } from '~/models/Section'
import type { Lecture } from '~/models/Lecture'

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

  const updateCourse = async (id: string, courseData: Partial<Omit<Course, 'id' | 'createdAt' | 'updatedAt'>>) => {
    if (!user.value) {
      console.log('[useCourse] User not authenticated, aborting updateCourse')
      throw new Error('User must be authenticated to update courses')
    }

    try {
      console.log('[useCourse] Updating course:', id)
      loading.value = true
      error.value = null
      const updatedCourse = await courseController.updateCourse(id, courseData)
      
      // Update the course in the local state if it exists
      const index = courses.value.findIndex(c => c.id === id)
      if (index !== -1) {
        courses.value[index] = updatedCourse
      }
      
      console.log('[useCourse] Course updated successfully:', updatedCourse)
      return updatedCourse
    } catch (e: any) {
      error.value = e.message
      console.error('[useCourse] Error updating course:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  const deleteLecture = async (courseId: string, sectionId: string, lectureId: string) => {
    if (!user.value) {
      console.log('[useCourse] User not authenticated, aborting deleteLecture')
      throw new Error('User must be authenticated to delete lectures')
    }

    try {
      console.log('[useCourse] Deleting lecture:', lectureId)
      loading.value = true
      error.value = null
      await courseController.deleteLecture(courseId, sectionId, lectureId)
      
      // Update the local state by removing the lecture
      const courseIndex = courses.value.findIndex(c => c.id === courseId)
      if (courseIndex !== -1) {
        const sectionIndex = courses.value[courseIndex].sections.findIndex(s => s.id === sectionId)
        if (sectionIndex !== -1) {
          courses.value[courseIndex].sections[sectionIndex].lectures = 
            courses.value[courseIndex].sections[sectionIndex].lectures.filter(l => l.id !== lectureId)
        }
      }
      
      console.log('[useCourse] Lecture deleted successfully')
    } catch (e: any) {
      error.value = e.message
      console.error('[useCourse] Error deleting lecture:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  const deleteSection = async (courseId: string, sectionId: string) => {
    if (!user.value) {
      console.log('[useCourse] User not authenticated, aborting deleteSection')
      throw new Error('User must be authenticated to delete sections')
    }

    try {
      console.log('[useCourse] Deleting section:', sectionId)
      loading.value = true
      error.value = null
      await courseController.deleteSection(courseId, sectionId)
      
      // Update the local state by removing the section
      const courseIndex = courses.value.findIndex(c => c.id === courseId)
      if (courseIndex !== -1) {
        courses.value[courseIndex].sections = 
          courses.value[courseIndex].sections.filter(s => s.id !== sectionId)
      }
      
      console.log('[useCourse] Section deleted successfully')
    } catch (e: any) {
      error.value = e.message
      console.error('[useCourse] Error deleting section:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  const createCourse = async (courseData: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user.value) {
      console.log('[useCourse] User not authenticated, aborting createCourse')
      throw new Error('User must be authenticated to create courses')
    }

    try {
      console.log('[useCourse] Creating course...')
      loading.value = true
      error.value = null
      const newCourse = await courseController.createCourse(courseData)
      
      // Add the new course to the local state
      courses.value.push(newCourse)
      
      console.log('[useCourse] Course created successfully:', newCourse)
      return newCourse
    } catch (e: any) {
      error.value = e.message
      console.error('[useCourse] Error creating course:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  const addSection = async (courseId: string, sectionData: Omit<Section, 'id' | 'lectures'>) => {
    if (!user.value) {
      console.log('[useCourse] User not authenticated, aborting addSection')
      throw new Error('User must be authenticated to add sections')
    }

    try {
      console.log('[useCourse] Adding section to course:', courseId)
      loading.value = true
      error.value = null
      const newSection = await courseController.addSection(courseId, sectionData)
      
      // Update the local state by adding the new section
      const courseIndex = courses.value.findIndex(c => c.id === courseId)
      if (courseIndex !== -1) {
        courses.value[courseIndex].sections.push(newSection)
      }
      
      console.log('[useCourse] Section added successfully:', newSection)
      return newSection
    } catch (e: any) {
      error.value = e.message
      console.error('[useCourse] Error adding section:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  const addLecture = async (courseId: string, sectionId: string, lectureData: Omit<Lecture, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user.value) {
      console.log('[useCourse] User not authenticated, aborting addLecture')
      throw new Error('User must be authenticated to add lectures')
    }

    try {
      console.log('[useCourse] Adding lecture to section:', sectionId)
      loading.value = true
      error.value = null
      const newLecture = await courseController.addLecture(courseId, sectionId, lectureData)
      
      // Update the local state by adding the new lecture
      const courseIndex = courses.value.findIndex(c => c.id === courseId)
      if (courseIndex !== -1) {
        const sectionIndex = courses.value[courseIndex].sections.findIndex(s => s.id === sectionId)
        if (sectionIndex !== -1) {
          courses.value[courseIndex].sections[sectionIndex].lectures.push(newLecture)
        }
      }
      
      console.log('[useCourse] Lecture added successfully:', newLecture)
      return newLecture
    } catch (e: any) {
      error.value = e.message
      console.error('[useCourse] Error adding lecture:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    courses,
    loading,
    error,
    fetchCourses,
    fetchCourseById,
    updateCourse,
    deleteLecture,
    deleteSection,
    createCourse,
    addSection,
    addLecture
  }
} 