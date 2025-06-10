export interface Lecture {
  id: string;
  title: string;
  isVideo: boolean;
  isHTML: boolean;
  isPDF: boolean;
  isQuiz: boolean;
  videoUrl: string | null;
  html: string | null;
  pdfUrl: string | null;
  quizId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Section {
  id: string;
  title: string;
  lectures: Lecture[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  sections: Section[];
  createdAt: Date;
  updatedAt: Date;
}

//Firestore Structure
/**
 * courses/{courseId}/sections/{sectionId}/lectures/{lectureId}
 * 
 */
