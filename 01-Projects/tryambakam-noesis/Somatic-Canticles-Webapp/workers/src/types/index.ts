export interface Env {
  DB: D1Database;
  ENVIRONMENT: string;
}

// User types
export interface User {
  id: string;
  email: string;
  name: string | null;
  birth_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateUserInput {
  email: string;
  name?: string;
  birth_date?: string;
}

// Chapter types
export interface Chapter {
  id: string;
  book_number: number;
  chapter_number: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface CreateChapterInput {
  book_number: number;
  chapter_number: number;
  title: string;
  content: string;
}

// Progress types
export interface Progress {
  id: string;
  user_id: string;
  chapter_id: string;
  is_completed: boolean;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateProgressInput {
  user_id: string;
  chapter_id: string;
  is_completed?: boolean;
}

export interface UpdateProgressInput {
  is_completed: boolean;
}

// Biorhythm types
export interface BiorhythmSnapshot {
  id: string;
  user_id: string;
  physical: number;
  emotional: number;
  intellectual: number;
  calculated_at: string;
  created_at: string;
}

export interface BiorhythmData {
  physical: number;
  emotional: number;
  intellectual: number;
  days: {
    physical: number;
    emotional: number;
    intellectual: number;
  };
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Auth types
export interface AuthPayload {
  userId: string;
  email: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  name?: string;
  birth_date?: string;
}
