export interface LectureProgress {
  lectureId: string;
  completed: boolean;
  lastAccessedAt: Date;
  quizScore?: number; // Optional score for quiz-type lectures
}

export interface SectionProgress {
  sectionId: string;
  lectures: LectureProgress[];
  completed: boolean;
  lastAccessedAt: Date;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  sections: SectionProgress[];
  overallProgress: number; // Percentage of course completed
  enrolledAt: Date;
  lastAccessedAt: Date;
  completedAt?: Date; // Optional, set when course is fully completed
}

// Firestore Structure
/**
 * enrollments/{enrollmentId}
 * - userId: string (for querying by student)
 * - courseId: string (for querying by course)
 * - sections: {
 *     sectionId: {
 *       lectures: {
 *         lectureId: {
 *           completed: boolean,
 *           lastAccessedAt: timestamp,
 *           quizScore?: number
 *         }
 *       },
 *       completed: boolean,
 *       lastAccessedAt: timestamp
 *     }
 *   }
 * - overallProgress: number
 * - enrolledAt: timestamp
 * - lastAccessedAt: timestamp
 * - completedAt?: timestamp
 */ 