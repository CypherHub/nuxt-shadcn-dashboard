import { doc, setDoc, collection, addDoc, updateDoc, getDocs, getDoc, deleteDoc, query, where } from 'firebase/firestore'
import type { Course, Section, Lecture } from '../models/Course'

export class CourseController {
  constructor(private db: any) {}

  private async hasEnrollments(courseId: string): Promise<boolean> {
    const enrollmentsQuery = query(
      collection(this.db, 'enrollments'),
      where('courseId', '==', courseId)
    )
    const enrollmentsSnapshot = await getDocs(enrollmentsQuery)
    return !enrollmentsSnapshot.empty
  }

  async createCourse(courseData: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>): Promise<Course> {
    console.log('[CourseController] createCourse called with:', courseData)
    try {
      const courseRef = doc(collection(this.db, 'courses'))
      const course: Course = {
        ...courseData,
        id: courseRef.id,
        createdAt: new Date(),
        teacherIds: [],
        updatedAt: new Date(),
      }

      console.log('[CourseController] Course: ', course)
      await setDoc(courseRef, course)
      console.log('[CourseController] Course created with ID:', course.id)
      return course
    } catch (error) {
      console.error('Error creating course:', error)
      throw error
    }
  }

  async addSection(courseId: string, sectionData: Omit<Section, 'id' | 'lectures'>): Promise<Section> {
    console.log('[CourseController] addSection called for courseId:', courseId, 'with:', sectionData)
    try {
      const sectionRef = doc(collection(this.db, `courses/${courseId}/sections`))
      const section: Section = {
        ...sectionData,
        id: sectionRef.id,
        lectures: [],
      }

      await setDoc(sectionRef, section)
      console.log('[CourseController] Section added with ID:', section.id, 'to courseId:', courseId)
      return section
    } catch (error) {
      console.error('Error adding section:', error)
      throw error
    }
  }

  async addLecture(
    courseId: string,
    sectionId: string,
    lectureData: Omit<Lecture, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Lecture> {
    console.log('[CourseController] addLecture called for courseId:', courseId, 'sectionId:', sectionId, 'with:', lectureData)
    try {
      const lectureRef = doc(collection(this.db, `courses/${courseId}/sections/${sectionId}/lectures`))
      const lecture: Lecture = {
        ...lectureData,
        id: lectureRef.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      await setDoc(lectureRef, lecture)
      console.log('[CourseController] Lecture added with ID:', lecture.id, 'to sectionId:', sectionId, 'courseId:', courseId)
      return lecture
    } catch (error) {
      console.error('Error adding lecture:', error)
      throw error
    }
  }

  async getAllCourses(): Promise<Course[]> {
    console.log('[CourseController] getAllCourses called')
    try {
      const coursesRef = collection(this.db, 'courses')
      const coursesSnapshot = await getDocs(coursesRef)
      
      const courses: Course[] = []
      coursesSnapshot.forEach((doc) => {
        const courseData = doc.data()
        // Convert Firestore timestamps to Date objects
        courses.push({
          ...courseData,
          createdAt: courseData.createdAt?.toDate(),
          updatedAt: courseData.updatedAt?.toDate(),
        } as Course)
      })

      console.log('[CourseController] getAllCourses fetched', courses.length, 'courses')
      return courses
    } catch (error) {
      console.error('Error fetching courses:', error)
      throw error
    }
  }

  async getCourseDetails(id: string): Promise<Course> {
    console.log('[CourseController] getCourseDetails called for courseId:', id)
    try {
      const courseRef = doc(this.db, 'courses', id)
      const courseDoc = await getDoc(courseRef)
      if (!courseDoc.exists()) {
        console.error('[CourseController] Course not found for id:', id)
        throw new Error('Course not found')
      }
      const courseData = courseDoc.data()

      // Fetch sections
      const sectionsRef = collection(this.db, `courses/${id}/sections`)
      const sectionsSnapshot = await getDocs(sectionsRef)
      const sections: Section[] = []

      // Fetch lectures for each section
      for (const sectionDoc of sectionsSnapshot.docs) {
        const sectionData = sectionDoc.data()
        const lecturesRef = collection(this.db, `courses/${id}/sections/${sectionDoc.id}/lectures`)
        const lecturesSnapshot = await getDocs(lecturesRef)
        const lectures: Lecture[] = []

        lecturesSnapshot.forEach((lectureDoc) => {
          const lectureData = lectureDoc.data()
          lectures.push({
            ...lectureData,
            id: lectureDoc.id,
            createdAt: lectureData.createdAt?.toDate(),
            updatedAt: lectureData.updatedAt?.toDate(),
          } as Lecture)
        })

        sections.push({
          ...sectionData,
          id: sectionDoc.id,
          lectures,
        } as Section)
      }

      return {
        ...courseData,
        id: courseDoc.id,
        sections,
        createdAt: courseData.createdAt?.toDate(),
        updatedAt: courseData.updatedAt?.toDate(),
      } as Course
    } catch (error) {
      console.error('Error fetching course details:', error)
      throw error
    }
  }

  async updateCourse(id: string, courseData: Partial<Omit<Course, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Course> {
    console.log('[CourseController] updateCourse called for courseId:', id, 'with:', courseData)
    try {
      const hasEnrollments = await this.hasEnrollments(id)
      if (hasEnrollments) {
        throw new Error('Cannot modify course: Course has active enrollments')
      }

      const courseRef = doc(this.db, 'courses', id)
      const courseDoc = await getDoc(courseRef)
      
      if (!courseDoc.exists()) {
        console.error('[CourseController] Course not found for id:', id)
        throw new Error('Course not found')
      }

      const updateData = {
        ...courseData,
        updatedAt: new Date(),
      }

      await updateDoc(courseRef, updateData)
      console.log('[CourseController] Course updated successfully for id:', id)
      
      return this.getCourseDetails(id)
    } catch (error) {
      console.error('Error updating course:', error)
      throw error
    }
  }

  async deleteLecture(courseId: string, sectionId: string, lectureId: string): Promise<void> {
    console.log('[CourseController] deleteLecture called for courseId:', courseId, 'sectionId:', sectionId, 'lectureId:', lectureId)
    try {
      const hasEnrollments = await this.hasEnrollments(courseId)
      if (hasEnrollments) {
        throw new Error('Cannot delete lecture: Course has active enrollments')
      }

      const lectureRef = doc(this.db, `courses/${courseId}/sections/${sectionId}/lectures`, lectureId)
      const lectureDoc = await getDoc(lectureRef)
      
      if (!lectureDoc.exists()) {
        console.error('[CourseController] Lecture not found for id:', lectureId)
        throw new Error('Lecture not found')
      }

      await deleteDoc(lectureRef)
      console.log('[CourseController] Lecture deleted successfully for id:', lectureId)
    } catch (error) {
      console.error('Error deleting lecture:', error)
      throw error
    }
  }

  async deleteSection(courseId: string, sectionId: string): Promise<void> {
    console.log('[CourseController] deleteSection called for courseId:', courseId, 'sectionId:', sectionId)
    try {
      const hasEnrollments = await this.hasEnrollments(courseId)
      if (hasEnrollments) {
        throw new Error('Cannot delete section: Course has active enrollments')
      }

      const sectionRef = doc(this.db, `courses/${courseId}/sections`, sectionId)
      const sectionDoc = await getDoc(sectionRef)
      
      if (!sectionDoc.exists()) {
        console.error('[CourseController] Section not found for id:', sectionId)
        throw new Error('Section not found')
      }

      // First delete all lectures in the section
      const lecturesRef = collection(this.db, `courses/${courseId}/sections/${sectionId}/lectures`)
      const lecturesSnapshot = await getDocs(lecturesRef)
      
      const deletePromises = lecturesSnapshot.docs.map(doc => deleteDoc(doc.ref))
      await Promise.all(deletePromises)

      // Then delete the section itself
      await deleteDoc(sectionRef)
      console.log('[CourseController] Section and its lectures deleted successfully for id:', sectionId)
    } catch (error) {
      console.error('Error deleting section:', error)
      throw error
    }
  }
} 