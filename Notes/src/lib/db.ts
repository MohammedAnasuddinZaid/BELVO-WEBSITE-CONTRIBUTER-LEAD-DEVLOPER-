import { Question, Topic, Test, Answer, Profile, UserRole } from '../types';
import { SEED_QUESTIONS, SEED_TOPICS } from '../data/questions';

const PROFILES_KEY = 'os_qbank_profiles';
const TOPICS_KEY = 'os_qbank_topics';
const QUESTIONS_KEY = 'os_qbank_questions';
const TESTS_KEY = 'os_qbank_tests';
const ANSWERS_KEY = 'os_qbank_answers';
const SESSION_KEY = 'os_qbank_session';

export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

class LocalDB {
  constructor() {
    this.init();
  }

  private init() {
    if (!localStorage.getItem(TOPICS_KEY)) {
      localStorage.setItem(TOPICS_KEY, JSON.stringify(SEED_TOPICS));
    }
    if (!localStorage.getItem(QUESTIONS_KEY)) {
      localStorage.setItem(QUESTIONS_KEY, JSON.stringify(SEED_QUESTIONS));
    }
    if (!localStorage.getItem(PROFILES_KEY)) {
      const defaultProfiles: Profile[] = [
        {
          id: 'u1-student',
          name: 'Shailender Dubey',
          email: 'student@osbank.com',
          role: 'student',
          created_at: new Date().toISOString(),
        },
        {
          id: 'u2-admin',
          name: 'Professor Admin',
          email: 'admin@osbank.com',
          role: 'admin',
          created_at: new Date().toISOString(),
        },
      ];
      localStorage.setItem(PROFILES_KEY, JSON.stringify(defaultProfiles));
    }
    if (!localStorage.getItem(TESTS_KEY)) {
      localStorage.setItem(TESTS_KEY, JSON.stringify([]));
    }
    if (!localStorage.getItem(ANSWERS_KEY)) {
      localStorage.setItem(ANSWERS_KEY, JSON.stringify([]));
    }
  }

  async login(email: string, rolePreference?: UserRole): Promise<{ profile: Profile | null; error: string | null }> {
    const profiles = this.getProfiles();
    let profile = profiles.find((p) => p.email.toLowerCase() === email.toLowerCase());

    if (!profile) {
      const role = rolePreference || (email.toLowerCase().includes('admin') ? 'admin' : 'student');
      const name = email.split('@')[0].split('.').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
      profile = {
        id: generateUUID(),
        name: name || 'Student User',
        email: email,
        role: role,
        created_at: new Date().toISOString(),
      };
      profiles.push(profile);
      localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
    }

    localStorage.setItem(SESSION_KEY, JSON.stringify(profile));
    return { profile, error: null };
  }

  logout() {
    localStorage.removeItem(SESSION_KEY);
  }

  getCurrentSession(): Profile | null {
    const session = localStorage.getItem(SESSION_KEY);
    if (session) {
      try {
        return JSON.parse(session);
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  getProfiles(): Profile[] {
    return JSON.parse(localStorage.getItem(PROFILES_KEY) || '[]');
  }

  getTopics(): Topic[] {
    return JSON.parse(localStorage.getItem(TOPICS_KEY) || '[]');
  }

  addTopic(name: string): Topic {
    const topics = this.getTopics();
    const newTopic: Topic = { id: generateUUID(), name };
    topics.push(newTopic);
    localStorage.setItem(TOPICS_KEY, JSON.stringify(topics));
    return newTopic;
  }

  getQuestions(): Question[] {
    return JSON.parse(localStorage.getItem(QUESTIONS_KEY) || '[]');
  }

  addQuestion(q: Omit<Question, 'id' | 'created_at' | 'updated_at'>): Question {
    const questions = this.getQuestions();
    const newQuestion: Question = {
      ...q,
      id: generateUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    questions.push(newQuestion);
    localStorage.setItem(QUESTIONS_KEY, JSON.stringify(questions));
    return newQuestion;
  }

  updateQuestion(id: string, updatedData: Partial<Question>): Question | null {
    const questions = this.getQuestions();
    const index = questions.findIndex((q) => q.id === id);
    if (index === -1) return null;
    questions[index] = { ...questions[index], ...updatedData, updated_at: new Date().toISOString() };
    localStorage.setItem(QUESTIONS_KEY, JSON.stringify(questions));
    return questions[index];
  }

  deleteQuestion(id: string): boolean {
    const questions = this.getQuestions();
    const filtered = questions.filter((q) => q.id !== id);
    if (filtered.length === questions.length) return false;
    localStorage.setItem(QUESTIONS_KEY, JSON.stringify(filtered));
    return true;
  }

  getTests(): Test[] {
    return JSON.parse(localStorage.getItem(TESTS_KEY) || '[]');
  }

  getTestsByUserId(userId: string): Test[] {
    return this.getTests().filter((t) => t.user_id === userId);
  }

  getTest(testId: string): Test | null {
    return this.getTests().find((t) => t.id === testId) || null;
  }

  createTest(userId: string, questionCount = 50, customQuestionIds?: string[], mockSeriesTitle?: string, mockSeriesId?: string, durationMin?: number): Test {
    const questions = this.getQuestions();
    let selected: Question[] = [];
    if (customQuestionIds && customQuestionIds.length > 0) {
      customQuestionIds.forEach((id) => {
        const found = questions.find((q) => q.id === id);
        if (found) selected.push(found);
      });
    } else {
      const shuffled = [...questions].sort(() => 0.5 - Math.random());
      selected = shuffled.slice(0, Math.min(questionCount, questions.length));
    }
    const questionIds = selected.map((q) => q.id);

    const newTest: Test = {
      id: generateUUID(),
      user_id: userId,
      start_time: new Date().toISOString(),
      end_time: null,
      score: 0,
      negative_score: 0,
      total_marks: 0,
      status: 'ongoing',
      time_taken: 0,
      question_ids: questionIds,
      mock_series_id: mockSeriesId,
      mock_series_title: mockSeriesTitle,
      duration_min: durationMin,
    };

    const tests = this.getTests();
    tests.push(newTest);
    localStorage.setItem(TESTS_KEY, JSON.stringify(tests));

    const answers = this.getAnswers();
    const testAnswers: Answer[] = selected.map((q) => ({
      id: generateUUID(),
      test_id: newTest.id,
      question_id: q.id,
      selected_option: null,
      is_correct: null,
      marks_awarded: 0,
      negative_marks: 0,
    }));
    localStorage.setItem(ANSWERS_KEY, JSON.stringify([...answers, ...testAnswers]));

    return newTest;
  }

  updateTest(id: string, data: Partial<Test>): Test | null {
    const tests = this.getTests();
    const index = tests.findIndex((t) => t.id === id);
    if (index === -1) return null;
    tests[index] = { ...tests[index], ...data };
    localStorage.setItem(TESTS_KEY, JSON.stringify(tests));
    return tests[index];
  }

  discardTest(testId: string): boolean {
    const tests = this.getTests();
    const filteredTests = tests.filter((t) => t.id !== testId);
    localStorage.setItem(TESTS_KEY, JSON.stringify(filteredTests));
    const answers = this.getAnswers();
    const filteredAnswers = answers.filter((a) => a.test_id !== testId);
    localStorage.setItem(ANSWERS_KEY, JSON.stringify(filteredAnswers));
    return true;
  }

  getAnswers(): Answer[] {
    return JSON.parse(localStorage.getItem(ANSWERS_KEY) || '[]');
  }

  getAnswersByTestId(testId: string): Answer[] {
    return this.getAnswers().filter((a) => a.test_id === testId);
  }

  saveAnswer(testId: string, questionId: string, selectedOption: 'A' | 'B' | 'C' | 'D' | null, markedForReview = false): Answer | null {
    const answers = this.getAnswers();
    const index = answers.findIndex((a) => a.test_id === testId && a.question_id === questionId);
    if (index === -1) return null;

    const questions = this.getQuestions();
    const question = questions.find((q) => q.id === questionId);

    let isCorrect: boolean | null = null;
    let marksAwarded = 0;
    let negativeMarks = 0;

    if (selectedOption && question) {
      isCorrect = selectedOption === question.correct_option;
      if (isCorrect) {
        marksAwarded = question.marks;
      } else {
        negativeMarks = question.negative_marks;
      }
    }

    answers[index] = {
      ...answers[index],
      selected_option: selectedOption,
      is_correct: isCorrect,
      marks_awarded: marksAwarded,
      negative_marks: negativeMarks,
      marked_for_review: markedForReview,
    };

    localStorage.setItem(ANSWERS_KEY, JSON.stringify(answers));
    return answers[index];
  }

  submitTest(testId: string, timeTakenSeconds: number): Test | null {
    const test = this.getTest(testId);
    if (!test) return null;

    const answers = this.getAnswersByTestId(testId);
    let totalScore = 0;
    let totalNegative = 0;
    let totalMarksAchievable = 0;

    const questions = this.getQuestions();

    answers.forEach((ans) => {
      const q = questions.find((qi) => qi.id === ans.question_id);
      if (q) {
        totalMarksAchievable += q.marks;
        if (ans.is_correct === true) {
          totalScore += q.marks;
        } else if (ans.is_correct === false) {
          totalNegative += q.negative_marks;
        }
      }
    });

    const finalScore = Number((totalScore - totalNegative).toFixed(2));

    const updatedTest = this.updateTest(testId, {
      status: 'completed',
      end_time: new Date().toISOString(),
      score: finalScore,
      negative_score: totalNegative,
      total_marks: totalMarksAchievable,
      time_taken: timeTakenSeconds,
    });

    return updatedTest;
  }
}

export const db = new LocalDB();

export const api = {
  getCurrentUser: async (): Promise<Profile | null> => {
    return db.getCurrentSession();
  },

  login: async (email: string, rolePreference?: UserRole): Promise<{ profile: Profile | null; error: string | null }> => {
    return db.login(email, rolePreference);
  },

  logout: async (): Promise<void> => {
    db.logout();
  },

  getTopics: async (): Promise<Topic[]> => {
    return db.getTopics();
  },

  addTopic: async (name: string): Promise<Topic> => {
    return db.addTopic(name);
  },

  getQuestions: async (): Promise<Question[]> => {
    return db.getQuestions();
  },

  addQuestion: async (q: Omit<Question, 'id' | 'created_at' | 'updated_at'>): Promise<Question> => {
    return db.addQuestion(q);
  },

  updateQuestion: async (id: string, q: Partial<Question>): Promise<Question | null> => {
    return db.updateQuestion(id, q);
  },

  deleteQuestion: async (id: string): Promise<boolean> => {
    return db.deleteQuestion(id);
  },

  getTests: async (userId: string): Promise<Test[]> => {
    return db.getTestsByUserId(userId);
  },

  getAllTests: async (): Promise<Test[]> => {
    return db.getTests();
  },

  getTest: async (id: string): Promise<Test | null> => {
    return db.getTest(id);
  },

  createTest: async (
    userId: string,
    questionCount = 50,
    customQuestionIds?: string[],
    mockSeriesTitle?: string,
    mockSeriesId?: string,
    durationMin?: number
  ): Promise<Test> => {
    return db.createTest(userId, questionCount, customQuestionIds, mockSeriesTitle, mockSeriesId, durationMin);
  },

  saveAnswer: async (testId: string, questionId: string, selectedOption: 'A' | 'B' | 'C' | 'D' | null, markedForReview = false): Promise<Answer | null> => {
    return db.saveAnswer(testId, questionId, selectedOption, markedForReview);
  },

  getAnswers: async (testId: string): Promise<Answer[]> => {
    return db.getAnswersByTestId(testId);
  },

  submitTest: async (testId: string, timeTakenSeconds: number): Promise<Test | null> => {
    return db.submitTest(testId, timeTakenSeconds);
  },

  discardTest: async (testId: string): Promise<boolean> => {
    return db.discardTest(testId);
  },
};
