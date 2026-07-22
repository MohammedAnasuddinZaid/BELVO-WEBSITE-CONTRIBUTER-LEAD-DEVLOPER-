import React, { useState, useEffect, useRef, useCallback } from 'react';
import { api } from '../lib/db';
import { Test, Question, Answer } from '../types';
import { Clock, AlertCircle, CheckCircle, ChevronLeft, ChevronRight, Flag, Play, Pause } from 'lucide-react';

interface TestScreenProps {
  testId: string;
  onTestSubmitted: (testId: string) => void;
  onCancelTest: () => void;
}

export const TestScreen: React.FC<TestScreenProps> = ({ testId, onTestSubmitted, onCancelTest }) => {
  const [test, setTest] = useState<Test | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    const loadTest = async () => {
      const t = await api.getTest(testId);
      if (!t) return;
      setTest(t);
      const allQ = await api.getQuestions();
      const qs = allQ.filter((q) => t.question_ids.includes(q.id));
      setQuestions(qs);
      const ans = await api.getAnswers(testId);
      setAnswers(ans);
      if (t.duration_min) {
        setTimeLeft(t.duration_min * 60);
      }
      startTimeRef.current = Date.now();
    };
    loadTest();
  }, [testId]);

  useEffect(() => {
    if (timeLeft !== null && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === null || prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timeLeft !== null]);

  const currentQuestion = questions[currentIndex];
  const currentAnswer = answers.find((a) => a.question_id === currentQuestion?.id);

  const handleSelectOption = async (option: 'A' | 'B' | 'C' | 'D') => {
    if (!test) return;
    const updated = await api.saveAnswer(test.id, currentQuestion.id, option);
    if (updated) {
      setAnswers((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    }
  };

  const handleToggleReview = async () => {
    if (!test || !currentAnswer) return;
    const currentMarked = currentAnswer.marked_for_review || false;
    const updated = await api.saveAnswer(test.id, currentQuestion.id, currentAnswer.selected_option as any, !currentMarked);
    if (updated) {
      setAnswers((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    }
  };

  const handleSubmit = useCallback(async () => {
    if (!test || isSubmitting) return;
    setIsSubmitting(true);
    if (timerRef.current) clearInterval(timerRef.current);
    const timeTaken = Math.floor((Date.now() - startTimeRef.current) / 1000);
    await api.submitTest(test.id, timeTaken);
    onTestSubmitted(test.id);
  }, [test, isSubmitting, onTestSubmitted]);

  const answeredCount = answers.filter((a) => a.selected_option !== null).length;
  const reviewedCount = answers.filter((a) => a.marked_for_review).length;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!test || !currentQuestion) {
    return (
      <div className="min-h-screen bg-bg-app flex items-center justify-center">
        <div className="text-text-muted text-sm">Loading test...</div>
      </div>
    );
  }

  const getStatusColor = (idx: number) => {
    const ans = answers.find((a) => a.question_id === questions[idx]?.id);
    if (ans?.marked_for_review) return 'bg-accent-gold text-white';
    if (ans?.selected_option) return 'bg-accent-emerald text-white';
    return 'bg-bg-panel text-text-muted';
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 min-h-[600px]">
      <div className="flex-1 bg-bg-card border border-border-app rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-border-app">
          <div className="flex items-center gap-2 text-xs font-semibold text-text-muted">
            <span className="px-2 py-0.5 bg-brand/10 text-brand rounded">{currentIndex + 1}/{questions.length}</span>
            <span className="hidden sm:inline">{test.mock_series_title || 'Random Test'}</span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            {timeLeft !== null && (
              <span className={`flex items-center gap-1 font-bold ${timeLeft < 60 ? 'text-accent-rose animate-pulse' : 'text-text-muted'}`}>
                <Clock className="w-4 h-4" /> {formatTime(timeLeft)}
              </span>
            )}
            <span className="text-text-muted">Answered: {answeredCount}/{questions.length}</span>
          </div>
        </div>

        <div className="mb-2">
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${currentQuestion.difficulty === 'Easy' ? 'bg-accent-emerald/10 text-accent-emerald' : currentQuestion.difficulty === 'Medium' ? 'bg-accent-gold/10 text-accent-gold' : 'bg-accent-rose/10 text-accent-rose'}`}>
            {currentQuestion.difficulty}
          </span>
          <span className="ml-2 text-[10px] text-text-muted">Marks: {currentQuestion.marks} | Neg: -{currentQuestion.negative_marks}</span>
        </div>

        <h3 className="text-sm font-serif font-bold text-text-app leading-relaxed mb-5">{currentQuestion.question}</h3>

        <div className="space-y-2">
          {(['A', 'B', 'C', 'D'] as const).map((opt) => (
            <button key={opt} onClick={() => handleSelectOption(opt)}
              className={`w-full text-left p-3 rounded-xl border text-xs font-medium transition cursor-pointer ${currentAnswer?.selected_option === opt ? 'bg-brand/10 border-brand text-brand' : 'bg-bg-panel border-border-app text-text-app hover:border-brand/50'}`}>
              <span className="font-bold mr-2">{opt}.</span> {currentQuestion[`option_${opt.toLowerCase() as 'a' | 'b' | 'c' | 'd'}`]}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-border-app">
          <div className="flex gap-2">
            <button onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))} disabled={currentIndex === 0}
              className="px-3 py-1.5 bg-bg-panel hover:bg-border-app disabled:opacity-40 text-text-app rounded-lg text-xs font-semibold transition flex items-center gap-1 cursor-pointer">
              <ChevronLeft className="w-3.5 h-3.5" /> Prev
            </button>
            <button onClick={() => setCurrentIndex(Math.min(questions.length - 1, currentIndex + 1))} disabled={currentIndex === questions.length - 1}
              className="px-3 py-1.5 bg-bg-panel hover:bg-border-app disabled:opacity-40 text-text-app rounded-lg text-xs font-semibold transition flex items-center gap-1 cursor-pointer">
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex gap-2">
            <button onClick={handleToggleReview}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1 cursor-pointer ${currentAnswer?.marked_for_review ? 'bg-accent-gold/20 text-accent-gold' : 'bg-bg-panel text-text-muted hover:bg-accent-gold/10'}`}>
              <Flag className="w-3.5 h-3.5" /> {currentAnswer?.marked_for_review ? 'Flagged' : 'Flag'}
            </button>
            <button onClick={handleSubmit} disabled={isSubmitting}
              className="px-4 py-1.5 bg-accent-rose hover:bg-accent-rose/90 text-white rounded-lg text-xs font-bold transition cursor-pointer disabled:opacity-50">
              Submit Test
            </button>
          </div>
        </div>
      </div>

      <div className="lg:w-64 bg-bg-card border border-border-app rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold text-text-app">Question Navigator</h4>
          <span className="text-[10px] text-text-muted">{reviewedCount} flagged</span>
        </div>
        <div className="grid grid-cols-5 gap-1.5">
          {questions.map((_, idx) => (
            <button key={idx} onClick={() => setCurrentIndex(idx)}
              className={`w-full aspect-square rounded-lg text-[11px] font-bold transition cursor-pointer ${idx === currentIndex ? 'ring-2 ring-brand ring-offset-1 ring-offset-bg-card' : ''} ${getStatusColor(idx)}`}>
              {idx + 1}
            </button>
          ))}
        </div>
        <div className="mt-4 pt-3 border-t border-border-app space-y-1.5 text-[10px] text-text-muted">
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-accent-emerald" /> Answered</div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-accent-gold" /> Flagged</div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-bg-panel border border-border-app" /> Not answered</div>
        </div>
      </div>
    </div>
  );
};
