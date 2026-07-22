import React, { useState, useEffect } from 'react';
import { api } from '../lib/db';
import { Question, Topic, Test, Profile } from '../types';
import { MOCK_SERIES_TESTS } from '../data/questions';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BookOpen, Award, TrendingUp, AlertCircle, CheckCircle, Clock, Play, GraduationCap, ArrowRight, BrainCircuit, Target, ListTodo } from 'lucide-react';

interface StudentDashboardProps {
  profile: Profile;
  onStartTest: (
    questionCount?: number,
    customQuestionIds?: string[],
    mockSeriesTitle?: string,
    mockSeriesId?: string,
    durationMin?: number
  ) => void;
  onStartPractice: (topicId: string) => void;
  onResumeTest: (testId: string) => void;
  onViewResult: (testId: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  profile,
  onStartTest,
  onStartPractice,
  onResumeTest,
  onViewResult,
}) => {
  const [tests, setTests] = useState<Test[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [stats, setStats] = useState({
    totalTests: 0,
    averageScore: 0,
    highestScore: 0,
    weakTopics: [] as { topicName: string; pct: number }[],
    strongTopics: [] as { topicName: string; pct: number }[],
    topicStats: [] as { topicName: string; score: number; total: number; pct: number }[],
  });
  const [selectedTopicPractice, setSelectedTopicPractice] = useState('');
  const [activeOngoingTest, setActiveOngoingTest] = useState<Test | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      const allTests = await api.getTests(profile.id);
      const allTopics = await api.getTopics();
      const allQuestions = await api.getQuestions();

      setTests(allTests);
      setTopics(allTopics);
      setQuestions(allQuestions);

      const ongoing = allTests.find((t) => t.status === 'ongoing');
      setActiveOngoingTest(ongoing || null);

      const completedTests = allTests.filter((t) => t.status === 'completed');
      const totalTests = completedTests.length;

      let averageScore = 0;
      let highestScore = 0;

      if (totalTests > 0) {
        const scores = completedTests.map((t) => {
          return t.total_marks > 0 ? (t.score / t.total_marks) * 100 : 0;
        });
        averageScore = Math.round(scores.reduce((a, b) => a + b, 0) / totalTests);
        highestScore = Math.round(Math.max(...scores));
      }

      const answersKey = localStorage.getItem('os_qbank_answers');
      const allAnswers = answersKey ? JSON.parse(answersKey) : [];
      const studentAnswers = allAnswers.filter((ans: any) =>
        completedTests.some((t) => t.id === ans.test_id)
      );

      const topicMap: Record<string, { correct: number; total: number }> = {};
      allTopics.forEach((topic) => {
        topicMap[topic.id] = { correct: 0, total: 0 };
      });

      studentAnswers.forEach((ans: any) => {
        const question = allQuestions.find((q) => q.id === ans.question_id);
        if (question && topicMap[question.topic_id]) {
          topicMap[question.topic_id].total += question.marks;
          if (ans.is_correct) {
            topicMap[question.topic_id].correct += question.marks;
          }
        }
      });

      const parsedTopicStats = allTopics.map((topic) => {
        const data = topicMap[topic.id];
        const pct = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
        return { topicName: topic.name, score: data.correct, total: data.total, pct };
      }).filter((t) => t.total > 0);

      const strongTopics = parsedTopicStats.filter((t) => t.pct >= 70).sort((a, b) => b.pct - a.pct);
      const weakTopics = parsedTopicStats.filter((t) => t.pct < 50).sort((a, b) => a.pct - b.pct);

      setStats({ totalTests, averageScore, highestScore, weakTopics, strongTopics, topicStats: parsedTopicStats });
    };

    loadDashboardData();
  }, [profile.id]);

  const completedTests = tests
    .filter((t) => t.status === 'completed')
    .slice().reverse()
    .map((t, index) => ({
      name: `Test ${index + 1}`,
      score: Math.round(t.total_marks > 0 ? (t.score / t.total_marks) * 100 : 0),
    }));

  return (
    <div className="space-y-6 font-sans text-text-app">
      <div className="p-6 bg-brand rounded-2xl text-white flex flex-col md:flex-row md:items-center justify-between gap-4 border border-border-app shadow-xl">
        <div className="space-y-1">
          <span className="px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider bg-white/10 text-brand-light rounded-full border border-white/20">Student Profile</span>
          <h2 className="text-2xl font-serif font-bold tracking-tight">Welcome back, {profile.name}!</h2>
          <p className="text-xs text-brand-light/95 max-w-md">Your OS preparation is underway. Start a new evaluation test or practice specific topics.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {activeOngoingTest ? (
            <button onClick={() => onResumeTest(activeOngoingTest.id)}
              className="px-4 py-2 bg-accent-gold hover:opacity-90 text-white text-xs font-bold rounded-xl transition flex items-center gap-2 cursor-pointer shadow-lg shadow-accent-gold/20">
              <Clock className="w-4 h-4 animate-spin" /> Resume Interrupted Test
            </button>
          ) : (
            <button onClick={() => onStartTest(50)}
              className="px-5 py-2.5 bg-brand-light hover:bg-white text-brand text-xs font-bold rounded-xl transition flex items-center gap-2 cursor-pointer shadow-lg shadow-brand-light/20 group border border-border-app">
              <Play className="w-4 h-4 fill-current" /> Start Full 50-MCQ Test <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-bg-card border border-border-app rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-brand/10 text-brand rounded-xl"><ListTodo className="w-6 h-6" /></div>
          <div>
            <div className="text-xs font-semibold text-text-muted">Total Completed Tests</div>
            <div className="text-2xl font-serif font-black text-text-app mt-0.5">{stats.totalTests}</div>
          </div>
        </div>
        <div className="p-4 bg-bg-card border border-border-app rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-accent-emerald/10 text-accent-emerald rounded-xl"><TrendingUp className="w-6 h-6" /></div>
          <div>
            <div className="text-xs font-semibold text-text-muted">Average Percentage</div>
            <div className="text-2xl font-serif font-black text-text-app mt-0.5">{stats.averageScore}%</div>
          </div>
        </div>
        <div className="p-4 bg-bg-card border border-border-app rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-accent-gold/10 text-accent-gold rounded-xl"><Award className="w-6 h-6" /></div>
          <div>
            <div className="text-xs font-semibold text-text-muted">Personal Best Score</div>
            <div className="text-2xl font-serif font-black text-text-app mt-0.5">{stats.highestScore}%</div>
          </div>
        </div>
      </div>

      <div className="p-6 bg-bg-card border border-border-app rounded-2xl shadow-sm space-y-4">
        <div>
          <h3 className="text-sm font-serif font-bold text-text-app flex items-center gap-2">
            <Target className="w-4 h-4 text-accent-gold" /> OS Academic Mock Series Tests
          </h3>
          <p className="text-[11px] text-text-muted mt-0.5">Academically rigorous, time-bound exam modules.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {MOCK_SERIES_TESTS.map((mock) => {
            const previousAttempts = tests.filter((t) => t.mock_series_id === mock.id && t.status === 'completed');
            const bestScore = previousAttempts.length > 0
              ? Math.max(...previousAttempts.map((t) => Math.round(t.total_marks > 0 ? (t.score / t.total_marks) * 100 : 0)))
              : null;
            return (
              <div key={mock.id} className="p-5 bg-bg-panel hover:bg-bg-panel/80 border border-border-app rounded-xl flex flex-col justify-between transition-all duration-300 group hover:shadow-md">
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${mock.difficulty === 'Easy' ? 'bg-accent-emerald/10 text-accent-emerald border border-accent-emerald/20' : mock.difficulty === 'Medium' ? 'bg-accent-gold/10 text-accent-gold border border-accent-gold/20' : mock.difficulty === 'Hard' ? 'bg-accent-rose/10 text-accent-rose border border-accent-rose/20' : 'bg-brand/10 text-brand border border-brand/20'}`}>{mock.difficulty}</span>
                    <div className="flex items-center gap-1 text-[10px] text-text-muted font-bold"><Clock className="w-3 h-3" />{mock.durationMin} Min</div>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-serif font-bold text-text-app tracking-tight leading-tight group-hover:text-brand transition-colors">{mock.title}</h4>
                    <p className="text-[11px] text-text-muted leading-relaxed line-clamp-3">{mock.description}</p>
                  </div>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {mock.topics.map((t, idx) => (
                      <span key={idx} className="px-1.5 py-0.5 bg-bg-card border border-border-app text-[9px] font-medium rounded text-text-muted">{t}</span>
                    ))}
                  </div>
                </div>
                <div className="mt-5 pt-3 border-t border-border-app/50 flex items-center justify-between gap-3">
                  <div className="text-[10px] text-text-muted">
                    {bestScore !== null ? <div className="flex items-center gap-1 font-semibold text-accent-emerald"><Award className="w-3 h-3" />Best: {bestScore}%</div> : <span className="italic">No attempt yet</span>}
                  </div>
                  <button onClick={() => onStartTest(mock.questionCount, mock.questionIds, mock.title, mock.id, mock.durationMin)}
                    className="px-3 py-1.5 bg-brand hover:bg-brand-hover text-white text-[11px] font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer group-hover:scale-[1.02]">
                    <Play className="w-2.5 h-2.5 fill-current" /> Start Series ({mock.questionCount} Qs)
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 bg-bg-card border border-border-app rounded-2xl shadow-sm">
          <h3 className="text-sm font-serif font-bold text-text-app mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-brand" />Performance Progress Chart</h3>
          {completedTests.length > 0 ? (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={completedTests} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-app)" />
                  <XAxis dataKey="name" stroke="var(--color-text-muted)" fontSize={11} />
                  <YAxis domain={[0, 100]} stroke="var(--color-text-muted)" fontSize={11} />
                  <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px', backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border-app)', color: 'var(--color-text-app)' }} />
                  <Line type="monotone" dataKey="score" stroke="var(--color-brand)" strokeWidth={3} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-text-muted text-xs">
              <p>No test data available yet.</p>
              <p className="text-[10px] text-text-muted mt-1">Complete your first test to initialize the progress chart.</p>
            </div>
          )}
        </div>

        <div className="p-5 bg-bg-card border border-border-app rounded-2xl shadow-sm space-y-4">
          <h3 className="text-sm font-serif font-bold text-text-app flex items-center gap-2"><BrainCircuit className="w-4 h-4 text-brand" />Automated OS Topic Analyzer</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3 bg-accent-emerald/5 border border-accent-emerald/20 rounded-xl space-y-2">
              <div className="flex items-center gap-1.5 text-accent-emerald text-xs font-bold"><CheckCircle className="w-4 h-4" />Strong Areas (70%)</div>
              {stats.strongTopics.length > 0 ? (
                <div className="space-y-1.5">
                  {stats.strongTopics.slice(0, 4).map((t, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs"><span className="text-text-app truncate max-w-[120px]">{t.topicName}</span><span className="font-bold text-accent-emerald">{t.pct}%</span></div>
                  ))}
                </div>
              ) : (<p className="text-[10px] text-text-muted italic">No topics analyzed as strong yet.</p>)}
            </div>
            <div className="p-3 bg-accent-rose/5 border border-accent-rose/20 rounded-xl space-y-2">
              <div className="flex items-center gap-1.5 text-accent-rose text-xs font-bold"><AlertCircle className="w-4 h-4" />Weak Areas (&lt; 50%)</div>
              {stats.weakTopics.length > 0 ? (
                <div className="space-y-1.5">
                  {stats.weakTopics.slice(0, 4).map((t, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs"><span className="text-text-app truncate max-w-[120px]">{t.topicName}</span><span className="font-bold text-accent-rose">{t.pct}%</span></div>
                  ))}
                </div>
              ) : (<p className="text-[10px] text-text-muted italic">No critical weak spots detected.</p>)}
            </div>
          </div>
          <div className="p-3 border border-border-app rounded-xl bg-bg-panel">
            <h4 className="text-xs font-serif font-bold text-text-app mb-1">Targeted Topic Practice</h4>
            <p className="text-[10px] text-text-muted mb-2 leading-relaxed">Launch an untimed learning flow.</p>
            <div className="flex gap-2">
              <select value={selectedTopicPractice} onChange={(e) => setSelectedTopicPractice(e.target.value)}
                className="flex-1 px-2.5 py-1.5 text-xs bg-bg-card border border-border-app rounded-lg text-text-app focus:outline-none">
                <option value="">-- Choose a Topic --</option>
                {topics.map((t) => (<option key={t.id} value={t.id}>{t.name}</option>))}
              </select>
              <button disabled={!selectedTopicPractice} onClick={() => onStartPractice(selectedTopicPractice)}
                className="px-3 py-1.5 bg-brand hover:bg-brand-hover disabled:bg-border-app disabled:text-text-muted text-white rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer">
                <BrainCircuit className="w-3.5 h-3.5" /> Study
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 bg-bg-card border border-border-app rounded-2xl shadow-sm">
        <h3 className="text-sm font-serif font-bold text-text-app mb-4 flex items-center gap-2"><BookOpen className="w-4 h-4 text-brand" />Test Attempt History</h3>
        {tests.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border-app text-text-muted">
                  <th className="pb-2 font-semibold">Test Details</th>
                  <th className="pb-2 font-semibold">Status</th>
                  <th className="pb-2 font-semibold">Final Score</th>
                  <th className="pb-2 font-semibold">Negative Loss</th>
                  <th className="pb-2 font-semibold">Time Spent</th>
                  <th className="pb-2 font-semibold">Date</th>
                  <th className="pb-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-app">
                {tests.map((test) => {
                  const durationMin = Math.floor(test.time_taken / 60);
                  const durationSec = test.time_taken % 60;
                  const dateString = new Date(test.start_time).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
                  return (
                    <tr key={test.id} className="hover:bg-bg-panel/50">
                      <td className="py-3 font-semibold text-text-app">
                        {test.mock_series_title ? <div className="space-y-0.5"><span className="font-bold text-text-app block">{test.mock_series_title}</span><span className="text-[9px] text-text-muted font-bold uppercase tracking-wider">Mock Series Test</span></div> : `${test.question_ids.length} MCQs Random`}
                      </td>
                      <td className="py-3">
                        {test.status === 'completed' ? <span className="px-2 py-0.5 bg-accent-emerald/10 text-accent-emerald rounded text-[10px] font-bold">Submitted</span> : <span className="px-2 py-0.5 bg-accent-gold/10 text-accent-gold rounded text-[10px] font-bold animate-pulse">Ongoing</span>}
                      </td>
                      <td className="py-3 font-bold text-text-app">{test.status === 'completed' ? `${test.score} / ${test.total_marks}` : '--'}</td>
                      <td className="py-3 text-accent-rose font-semibold">{test.status === 'completed' ? `-${test.negative_score}` : '--'}</td>
                      <td className="py-3 text-text-muted">{test.status === 'completed' ? `${durationMin}m ${durationSec}s` : '--'}</td>
                      <td className="py-3 text-text-muted">{dateString}</td>
                      <td className="py-3 text-right">
                        {test.status === 'completed' ? (
                          <button onClick={() => onViewResult(test.id)} className="px-3 py-1 bg-brand/10 hover:bg-brand/20 text-brand font-semibold rounded text-[11px] transition cursor-pointer">Review Result</button>
                        ) : (
                          <button onClick={() => onResumeTest(test.id)} className="px-3 py-1 bg-accent-gold hover:opacity-95 text-white font-bold rounded text-[11px] transition cursor-pointer">Resume</button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center text-text-muted text-xs">
            <BookOpen className="w-8 h-8 mx-auto text-text-muted mb-2 opacity-50" />
            <p>You have not taken any tests yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};
