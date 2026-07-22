export type UserRole = 'admin' | 'student';

export interface Profile {
  id: string; // uuid
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export interface Topic {
  id: string; // uuid
  name: string;
}

export interface Question {
  id: string; // uuid
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic_id: string; // uuid
  marks: number;
  negative_marks: number;
  created_at: string;
  updated_at: string;
}

export interface Test {
  id: string; // uuid
  user_id: string; // uuid
  start_time: string;
  end_time: string | null;
  score: number;
  negative_score: number;
  total_marks: number;
  status: 'ongoing' | 'completed';
  time_taken: number; // in seconds
  question_ids: string[]; // randomized list of questions for this test
  mock_series_id?: string;
  mock_series_title?: string;
  duration_min?: number;
}

export interface Answer {
  id: string; // uuid
  test_id: string; // uuid
  question_id: string; // uuid
  selected_option: 'A' | 'B' | 'C' | 'D' | null;
  is_correct: boolean | null;
  marks_awarded: number;
  negative_marks: number;
  marked_for_review?: boolean;
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  useRealSupabase: boolean;
}

export interface MockSeries {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Mixed';
  durationMin: number;
  questionCount: number;
  questionIds: string[];
  topics: string[];
}

