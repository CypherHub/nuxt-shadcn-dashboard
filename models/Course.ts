export interface Lecture {
  id: string;
  title: string;
  type: 'video' | 'quiz';
  content: string;
  duration?: number;
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
