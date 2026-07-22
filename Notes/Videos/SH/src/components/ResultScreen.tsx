import React, { useState, useEffect } from 'react';
import { api } from '../lib/db';
import { Test, Question, Answer } from '../types';
import { Award, TrendingUp, AlertTriangle, CheckCircle, XCircle, Clock, ArrowLeft, BarChart3 } from 'lucide-react';

interface ResultScreenProps {
  testId: string;
  onBackToDashboard: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({ testId, onBackToDashboard }) => {
  const [test, setTest] = useState<Test | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);

  useEffect(() => {
    const load = async () => {
      const t = await api.getTest(testId);
      if (!t) return;
      setTest(t);
      const allQ = await api.getQuestions();
      const qs = allQ.filter((q) => t.question_ids.includes(q.id));
      setQuestions(qs);
      const ans = await api.getAnswers(testId);
      setAnswers(ans);
    };
    load();
  }, [testId]);

  if (!test) {
    return <div className="text-text-muted text-sm p-8">Loading results...</div>;
  }

  const correctCount = answers.filter((a) => a.is_correct === true).length;
  const incorrectCount = answers.filter((a) => a.is_correct === false).length;
  const unansweredCount = answers.filter((a) => a.selected_option === null).length;
  const percentage = test.total_marks > 0 ? Math.round((test.score / test.total_marks) * 100) : 0;
  const durationMin = Math.floor(test.time_taken / 60);
  const durationSec = test.time_taken % 60;

  const getGrade = (pct: number) => {
    if (pct >= 90) return { label: 'Outstanding', color: 'text-accent-emerald' };
    if (pct >= 75) return { label: 'Excellent', color: 'text-accent-emerald' };
    if (pct >= 60) return { label: 'Good', color: 'text-accent-gold' };
    if (pct >= 40) return { label: 'Average', color: 'text-accent-gold' };
    return { label: 'Needs Improvement', color: 'text-accent-rose' };
  };

  const grade = getGrade(percentage);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button onClick={onBackToDashboard} className="flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-text-app transition cursor-pointer">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>

      <div className="bg-bg-card border border-border-app rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative">
            <div className="w-28 h-28 rounded-full bg-brand/10 border-4 border-brand flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-serif font-black text-brand">{percentage}%</div>
                <div className="text-[9px] uppercase font-bold text-text-muted tracking-wider">Score</div>
              </div>
            </div>
            <div className="absolute -top-1 -right-1 bg-bg-card rounded-full p-1 shadow-sm border border-border-app">
              <Award className="w-5 h-5 text-accent-gold" />
            </div>
          </div>
          <div className="flex-1 text-center md:text-left space-y-1">
            <h2 className="text-lg font-serif font-bold text-text-app">
              {test.mock_series_title || 'Test'} - <span className={grade.color}>{grade.label}</span>
            </h2>
            <p className="text-xs text-text-muted">{test.mock_series_title ? 'Mock Series Assessment' : 'Random MCQ Test'}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-3 bg-accent-emerald/5 rounded-xl border border-accent-emerald/20">
              <div className="text-lg font-bold text-accent-emerald">{test.score.toFixed(1)}</div>
              <div className="text-[9px] uppercase font-bold text-text-muted tracking-wider">Final Score</div>
            </div>
            <div className="p-3 bg-accent-rose/5 rounded-xl border border-accent-rose/20">
              <div className="text-lg font-bold text-accent-rose">-{test.negative_score.toFixed(1)}</div>
              <div className="text-[9px] uppercase font-bold text-text-muted tracking-wider">Negative</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-border-app">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-accent-emerald font-bold"><CheckCircle className="w-4 h-4" /> {correctCount}</div>
            <div className="text-[9px] uppercase tracking-wider text-text-muted font-semibold mt-0.5">Correct</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-accent-rose font-bold"><XCircle className="w-4 h-4" /> {incorrectCount}</div>
            <div className="text-[9px] uppercase tracking-wider text-text-muted font-semibold mt-0.5">Incorrect</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-text-muted font-bold"><AlertTriangle className="w-4 h-4" /> {unansweredCount}</div>
            <div className="text-[9px] uppercase tracking-wider text-text-muted font-semibold mt-0.5">Unanswered</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-text-muted font-bold"><Clock className="w-4 h-4" /> {durationMin}m {durationSec}s</div>
            <div className="text-[9px] uppercase tracking-wider text-text-muted font-semibold mt-0.5">Duration</div>
          </div>
        </div>
      </div>

      <div className="bg-bg-card border border-border-app rounded-2xl p-5 shadow-sm">
        <h3 className="text-sm font-serif font-bold text-text-app mb-4 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-brand" />Detailed Question Review
        </h3>
        <div className="space-y-3">
          {questions.map((q, idx) => {
            const ans = answers.find((a) => a.question_id === q.id);
            const isCorrect = ans?.is_correct === true;
            const isWrong = ans?.is_correct === false;
            const isUnanswered = !ans?.selected_option;
            return (
              <div key={q.id} className={`p-4 rounded-xl border ${isCorrect ? 'bg-accent-emerald/5 border-accent-emerald/20' : isWrong ? 'bg-accent-rose/5 border-accent-rose/20' : 'bg-bg-panel border-border-app'}`}>
                <div className="flex items-start gap-3">
                  <span className={`text-xs font-bold mt-0.5 ${isCorrect ? 'text-accent-emerald' : isWrong ? 'text-accent-rose' : 'text-text-muted'}`}>
                    {isCorrect ? <CheckCircle className="w-4 h-4" /> : isWrong ? <XCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-text-muted">Q{idx + 1}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${q.difficulty === 'Easy' ? 'bg-accent-emerald/10 text-accent-emerald' : q.difficulty === 'Medium' ? 'bg-accent-gold/10 text-accent-gold' : 'bg-accent-rose/10 text-accent-rose'}`}>{q.difficulty}</span>
                    </div>
                    <p className="text-xs font-medium text-text-app leading-relaxed">{q.question}</p>
                    <div className="mt-2 space-y-1">
                      {(['A', 'B', 'C', 'D'] as const).map((opt) => {
                        const isSelected = ans?.selected_option === opt;
                        const isCorrectOpt = q.correct_option === opt;
                        return (
                          <div key={opt} className={`text-[11px] px-2 py-1 rounded ${isCorrectOpt ? 'bg-accent-emerald/10 text-accent-emerald font-semibold' : isSelected && !isCorrectOpt ? 'bg-accent-rose/10 text-accent-rose font-semibold' : 'text-text-muted'}`}>
                            {opt}. {q[`option_${opt.toLowerCase() as 'a' | 'b' | 'c' | 'd'}`]}
                            {isCorrectOpt && <CheckCircle className="w-3 h-3 inline ml-1" />}
                            {isSelected && !isCorrectOpt && <XCircle className="w-3 h-3 inline ml-1" />}
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-2 p-2 bg-brand/5 rounded-lg border border-brand/10">
                      <p className="text-[10px] text-text-muted"><span className="font-bold text-brand">Explanation: </span>{q.explanation}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
