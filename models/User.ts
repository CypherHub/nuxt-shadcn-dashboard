// /models/User.ts
export type UserRole = 'student' | 'teacher' | 'admin';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  enrolledCourses?: string[]; // optional for students
  teacherCourses?: string[]; // optional for teachers
  createdAt: Date;
  updatedAt: Date;
}
