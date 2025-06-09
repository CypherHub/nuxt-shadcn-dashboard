// /models/User.ts
export type UserRole = 'student' | 'teacher';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  enrolledCourses?: string[]; // optional for students
  teacherCourses?: string[]; // optional for teachers
  createdAt: Date;
  updatedAt: Date;
}
