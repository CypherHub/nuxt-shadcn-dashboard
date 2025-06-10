import { doc, setDoc, collection, addDoc, updateDoc, getDocs } from 'firebase/firestore'
import type { Course, Section, Lecture } from '../models/Course'

export class CourseController {
  constructor(private db: any) {}

  async createCourse(courseData: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>): Promise<Course> {
    console.log('[CourseController] createCourse called with:', courseData)
    try {
      const courseRef = doc(collection(this.db, 'courses'))
      const course: Course = {
        ...courseData,
        id: courseRef.id,
        createdAt: new Date(),
        teacherIds: courseData.teacherIds,
        updatedAt: new Date(),
      }

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
} 