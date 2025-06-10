import { doc, setDoc, collection, addDoc, updateDoc } from 'firebase/firestore'
import type { Course, Section, Lecture } from '../models/Course'

export class CourseController {
  constructor(private db: any) {}

  async createCourse(courseData: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>): Promise<Course> {
    try {
      const courseRef = doc(collection(this.db, 'courses'))
      const course: Course = {
        ...courseData,
        id: courseRef.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      await setDoc(courseRef, course)
      return course
    } catch (error) {
      console.error('Error creating course:', error)
      throw error
    }
  }

  async addSection(courseId: string, sectionData: Omit<Section, 'id' | 'lectures'>): Promise<Section> {
    try {
      const sectionRef = doc(collection(this.db, `courses/${courseId}/sections`))
      const section: Section = {
        ...sectionData,
        id: sectionRef.id,
        lectures: [],
      }

      await setDoc(sectionRef, section)
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
    try {
      const lectureRef = doc(collection(this.db, `courses/${courseId}/sections/${sectionId}/lectures`))
      const lecture: Lecture = {
        ...lectureData,
        id: lectureRef.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      await setDoc(lectureRef, lecture)
      return lecture
    } catch (error) {
      console.error('Error adding lecture:', error)
      throw error
    }
  }
} 