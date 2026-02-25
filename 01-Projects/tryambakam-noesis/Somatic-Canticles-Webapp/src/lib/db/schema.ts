export interface User {
  id: string;
  email: string;
  name: string;
  birthDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Chapter {
  id: string;
  title: string;
  description: string;
  order: number;
  audioUrl?: string;
  unlockRequirements?: {
    physicalMin?: number;
    emotionalMin?: number;
    intellectualMin?: number;
  };
  createdAt: Date;
}

export interface UserProgress {
  id: string;
  userId: string;
  chapterId: string;
  isCompleted: boolean;
  completedAt?: Date;
  createdAt: Date;
}
