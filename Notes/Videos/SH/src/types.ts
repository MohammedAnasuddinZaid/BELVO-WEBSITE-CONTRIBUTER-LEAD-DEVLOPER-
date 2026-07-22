export type UserRole = 'admin' | 'student';

export interface Profile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export interface Topic {
  id: string;
  name: string;
}

export interface Question {
  id: string;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: string;
  explanation: string;
  difficulty: string;
  topic_id: string;
  marks: number;
  negative_marks: number;
  created_at: string;
  updated_at: string;
}

export interface Test {
  id: string;
  user_id: string;
  start_time: string;
  end_time: string | null;
  score: number;
  negative_score: number;
  total_marks: number;
  status: 'ongoing' | 'completed';
  time_taken: number;
  question_ids: string[];
  mock_series_id?: string;
  mock_series_title?: string;
  duration_min?: number;
}

export interface Answer {
  id: string;
  test_id: string;
  question_id: string;
  selected_option: string | null;
  is_correct: boolean | null;
  marks_awarded: number;
  negative_marks: number;
  marked_for_review?: boolean;
}

export interface MockSeries {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  durationMin: number;
  questionCount: number;
  questionIds: string[];
  topics: string[];
}
