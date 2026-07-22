import React, { useState, useEffect } from 'react';
import { api } from '../lib/db';
import { Question, Topic } from '../types';
import { ArrowLeft, CheckCircle, XCircle, BrainCircuit, ChevronLeft, ChevronRight } from 'lucide-react';

interface PracticeScreenProps {
  topicId: string;
  onBackToDashboard: () => void;
}

export const PracticeScreen: React.FC<PracticeScreenProps> = ({ topicId, onBackToDashboard }) => {
  const [topic, setTopic] = useState<Topic | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [results, setResults] = useState<Record<string, { selected: string; correct: boolean }>>({});

  useEffect(() => {
    const load = async () => {
      const topics = await api.getTopics();
      const t = topics.find((tp) => tp.id === topicId);
      if (t) setTopic(t);
      const allQ = await api.getQuestions();
      const filtered = allQ.filter((q) => q.topic_id === topicId);
      setQuestions(filtered.sort(() => 0.5 - Math.random()));
    };
    load();
  }, [topicId]);

  const currentQuestion = questions[currentIndex];
  if (!currentQuestion) {
    return (
      <div className="max-w-3xl mx-auto">
        <button onClick={onBackToDashboard} className="flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-text-app transition cursor-pointer mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
        <div className="bg-bg-card border border-border-app rounded-2xl p-8 text-center shadow-sm">
          <BrainCircuit className="w-12 h-12 text-text-muted mx-auto mb-3 opacity-50" />
          <h3 className="text-sm font-serif font-bold text-text-app">No questions available</h3>
          <p className="text-xs text-text-muted mt-1">This topic has no practice questions yet.</p>
        </div>
      </div>
    );
  }

  const handleSelect = (opt: string) => {
    if (showResult) return;
    setSelectedOption(opt);
  };

  const handleCheck = () => {
    if (!selectedOption) return;
    setShowResult(true);
    const isCorrect = selectedOption === currentQuestion.correct_option;
    setResults((prev) => ({
      ...prev,
      [currentQuestion.id]: { selected: selectedOption, correct: isCorrect },
    }));
  };

  const handleNext = () => {
    setSelectedOption(null);
    setShowResult(false);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const currentResult = results[currentQuestion.id];
  const answeredCount = Object.keys(results).length;

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <button onClick={onBackToDashboard} className="flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-text-app transition cursor-pointer">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>

      <div className="bg-bg-card border border-border-app rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-border-app">
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-4 h-4 text-brand" />
            <span className="text-xs font-bold text-text-app">{topic?.name || 'Practice'} Mode</span>
          </div>
          <div className="flex items-center gap-3 text-[10px] text-text-muted">
            <span>Question {currentIndex + 1} of {questions.length}</span>
            <span className="font-semibold text-accent-emerald">{answeredCount} answered</span>
          </div>
        </div>

        <div className="mb-3">
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${currentQuestion.difficulty === 'Easy' ? 'bg-accent-emerald/10 text-accent-emerald' : currentQuestion.difficulty === 'Medium' ? 'bg-accent-gold/10 text-accent-gold' : 'bg-accent-rose/10 text-accent-rose'}`}>
            {currentQuestion.difficulty}
          </span>
          <span className="ml-2 text-[10px] text-text-muted">Marks: {currentQuestion.marks}</span>
        </div>

        <h3 className="text-sm font-serif font-bold text-text-app leading-relaxed mb-5">{currentQuestion.question}</h3>

        <div className="space-y-2">
          {(['A', 'B', 'C', 'D'] as const).map((opt) => {
            const isSelected = selectedOption === opt;
            const isCorrectOpt = currentQuestion.correct_option === opt;
            let className = 'w-full text-left p-3 rounded-xl border text-xs font-medium transition cursor-pointer ';
            if (!showResult) {
              className += isSelected ? 'bg-brand/10 border-brand text-brand' : 'bg-bg-panel border-border-app text-text-app hover:border-brand/50';
            } else {
              if (isCorrectOpt) className += 'bg-accent-emerald/10 border-accent-emerald text-accent-emerald';
              else if (isSelected && !isCorrectOpt) className += 'bg-accent-rose/10 border-accent-rose text-accent-rose';
              else className += 'bg-bg-panel border-border-app text-text-muted';
            }
            return (
              <button key={opt} onClick={() => handleSelect(opt)} className={className} disabled={showResult}>
                <span className="font-bold mr-2">{opt}.</span> {currentQuestion[`option_${opt.toLowerCase() as 'a' | 'b' | 'c' | 'd'}`]}
                {showResult && isCorrectOpt && <CheckCircle className="w-3.5 h-3.5 inline ml-1" />}
                {showResult && isSelected && !isCorrectOpt && <XCircle className="w-3.5 h-3.5 inline ml-1" />}
              </button>
            );
          })}
        </div>

        {showResult && (
          <div className="mt-4 p-3 bg-brand/5 border border-brand/10 rounded-xl">
            <p className="text-xs font-medium text-text-app"><span className="font-bold text-brand">Explanation: </span>{currentQuestion.explanation}</p>
          </div>
        )}

        <div className="flex items-center justify-between mt-5 pt-4 border-t border-border-app">
          <button onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))} disabled={currentIndex === 0}
            className="px-3 py-1.5 bg-bg-panel hover:bg-border-app disabled:opacity-40 text-text-app rounded-lg text-xs font-semibold transition flex items-center gap-1 cursor-pointer">
            <ChevronLeft className="w-3.5 h-3.5" /> Prev
          </button>

          {!showResult ? (
            <button onClick={handleCheck} disabled={!selectedOption}
              className="px-4 py-1.5 bg-brand hover:bg-brand-hover disabled:bg-border-app text-white rounded-lg text-xs font-bold transition cursor-pointer">
              Check Answer
            </button>
          ) : (
            <button onClick={handleNext} disabled={currentIndex === questions.length - 1}
              className="px-4 py-1.5 bg-accent-emerald hover:bg-accent-emerald/90 disabled:bg-border-app text-white rounded-lg text-xs font-bold transition cursor-pointer">
              Next Question
            </button>
          )}

          <button onClick={() => setCurrentIndex(Math.min(questions.length - 1, currentIndex + 1))} disabled={currentIndex === questions.length - 1}
            className="px-3 py-1.5 bg-bg-panel hover:bg-border-app disabled:opacity-40 text-text-app rounded-lg text-xs font-semibold transition flex items-center gap-1 cursor-pointer">
            Next <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="bg-bg-card border border-border-app rounded-2xl p-4 shadow-sm">
        <h4 className="text-xs font-bold text-text-app mb-2">Progress</h4>
        <div className="w-full bg-bg-panel rounded-full h-2">
          <div className="bg-brand rounded-full h-2 transition-all" style={{ width: `${(answeredCount / questions.length) * 100}%` }} />
        </div>
        <p className="text-[10px] text-text-muted mt-1">{answeredCount} of {questions.length} questions answered</p>
      </div>
    </div>
  );
};
