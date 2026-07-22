import React, { useState, useEffect } from 'react';
import { api } from '../lib/db';
import { Profile, Test, Topic, Question } from '../types';
import { Shield, Users, FileText, BarChart3, Trash2, Plus, X, BookOpen } from 'lucide-react';

interface AdminDashboardProps {
  profile: Profile;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ profile, onLogout }) => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [allTests, setAllTests] = useState<Test[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'questions' | 'topics'>('overview');
  const [newTopicName, setNewTopicName] = useState('');
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    question: '', option_a: '', option_b: '', option_c: '', option_d: '',
    correct_option: 'A', explanation: '', difficulty: 'Easy', topic_id: '', marks: 1, negative_marks: 0.25
  });

  useEffect(() => {
    const load = async () => {
      setProfiles(JSON.parse(localStorage.getItem('os_qbank_profiles') || '[]'));
      setAllTests(await api.getAllTests());
      setTopics(await api.getTopics());
      setQuestions(await api.getQuestions());
    };
    load();
  }, []);

  const handleAddTopic = async () => {
    if (!newTopicName.trim()) return;
    await api.addTopic(newTopicName.trim());
    setTopics(await api.getTopics());
    setNewTopicName('');
  };

  const handleAddQuestion = async () => {
    if (!newQuestion.question || !newQuestion.topic_id) return;
    await api.addQuestion(newQuestion as any);
    setQuestions(await api.getQuestions());
    setShowAddQuestion(false);
    setNewQuestion({ question: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_option: 'A', explanation: '', difficulty: 'Easy', topic_id: '', marks: 1, negative_marks: 0.25 });
  };

  const handleDeleteQuestion = async (id: string) => {
    await api.deleteQuestion(id);
    setQuestions(await api.getQuestions());
  };

  const totalStudents = profiles.filter((p) => p.role === 'student').length;
  const completedTests = allTests.filter((t) => t.status === 'completed').length;

  return (
    <div className="space-y-6">
      <div className="p-6 bg-brand rounded-2xl text-white flex items-center justify-between border border-border-app shadow-xl">
        <div className="space-y-1">
          <span className="px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider bg-white/10 text-brand-light rounded-full border border-white/20">Admin Panel</span>
          <h2 className="text-2xl font-serif font-bold tracking-tight">Welcome, {profile.name}</h2>
          <p className="text-xs text-brand-light/95">Manage questions, topics, and monitor student performance.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-bg-card border border-border-app rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-brand/10 text-brand rounded-xl"><Users className="w-6 h-6" /></div>
          <div><div className="text-xs font-semibold text-text-muted">Registered Students</div><div className="text-2xl font-serif font-black text-text-app mt-0.5">{totalStudents}</div></div>
        </div>
        <div className="p-4 bg-bg-card border border-border-app rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-accent-emerald/10 text-accent-emerald rounded-xl"><FileText className="w-6 h-6" /></div>
          <div><div className="text-xs font-semibold text-text-muted">Total Questions</div><div className="text-2xl font-serif font-black text-text-app mt-0.5">{questions.length}</div></div>
        </div>
        <div className="p-4 bg-bg-card border border-border-app rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-accent-gold/10 text-accent-gold rounded-xl"><BarChart3 className="w-6 h-6" /></div>
          <div><div className="text-xs font-semibold text-text-muted">Completed Tests</div><div className="text-2xl font-serif font-black text-text-app mt-0.5">{completedTests}</div></div>
        </div>
      </div>

      <div className="flex gap-2 border-b border-border-app pb-2">
        {(['overview', 'questions', 'topics'] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-xs font-bold rounded-t-lg transition cursor-pointer ${activeTab === tab ? 'bg-bg-card text-brand border border-border-app border-b-0' : 'text-text-muted hover:text-text-app'}`}>
            {tab === 'overview' ? 'Overview' : tab === 'questions' ? 'Questions' : 'Topics'}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="bg-bg-card border border-border-app rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-serif font-bold text-text-app mb-4">All Users & Tests</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border-app text-text-muted">
                  <th className="pb-2 font-semibold">Name</th>
                  <th className="pb-2 font-semibold">Email</th>
                  <th className="pb-2 font-semibold">Role</th>
                  <th className="pb-2 font-semibold">Tests Taken</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-app">
                {profiles.map((p) => {
                  const userTests = allTests.filter((t) => t.user_id === p.id);
                  return (
                    <tr key={p.id} className="hover:bg-bg-panel/50">
                      <td className="py-3 font-semibold text-text-app">{p.name}</td>
                      <td className="py-3 text-text-muted">{p.email}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${p.role === 'admin' ? 'bg-accent-emerald/10 text-accent-emerald' : 'bg-brand/10 text-brand'}`}>{p.role}</span>
                      </td>
                      <td className="py-3 font-semibold text-text-app">{userTests.length} ({userTests.filter((t) => t.status === 'completed').length} completed)</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'questions' && (
        <div className="bg-bg-card border border-border-app rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-serif font-bold text-text-app">Question Bank ({questions.length})</h3>
            <button onClick={() => setShowAddQuestion(!showAddQuestion)}
              className="px-3 py-1.5 bg-brand hover:bg-brand-hover text-white rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer">
              <Plus className="w-3.5 h-3.5" /> Add Question
            </button>
          </div>

          {showAddQuestion && (
            <div className="mb-4 p-4 bg-bg-panel border border-border-app rounded-xl space-y-3">
              <h4 className="text-xs font-bold text-text-app">New Question</h4>
              <textarea value={newQuestion.question} onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                className="w-full p-2 text-xs bg-bg-card border border-border-app rounded-lg text-text-app" rows={2} placeholder="Enter question text" />
              <div className="grid grid-cols-2 gap-2">
                {(['A', 'B', 'C', 'D'] as const).map((opt) => (
                  <input key={opt} value={newQuestion[`option_${opt.toLowerCase() as 'a' | 'b' | 'c' | 'd'}`]} onChange={(e) => setNewQuestion({ ...newQuestion, [`option_${opt.toLowerCase()}`]: e.target.value })}
                    className="p-2 text-xs bg-bg-card border border-border-app rounded-lg text-text-app" placeholder={`Option ${opt}`} />
                ))}
              </div>
              <div className="flex gap-2">
                <select value={newQuestion.correct_option} onChange={(e) => setNewQuestion({ ...newQuestion, correct_option: e.target.value })}
                  className="flex-1 p-2 text-xs bg-bg-card border border-border-app rounded-lg text-text-app">
                  <option value="A">Correct: A</option><option value="B">Correct: B</option><option value="C">Correct: C</option><option value="D">Correct: D</option>
                </select>
                <select value={newQuestion.difficulty} onChange={(e) => setNewQuestion({ ...newQuestion, difficulty: e.target.value })}
                  className="flex-1 p-2 text-xs bg-bg-card border border-border-app rounded-lg text-text-app">
                  <option value="Easy">Easy</option><option value="Medium">Medium</option><option value="Hard">Hard</option>
                </select>
                <select value={newQuestion.topic_id} onChange={(e) => setNewQuestion({ ...newQuestion, topic_id: e.target.value })}
                  className="flex-1 p-2 text-xs bg-bg-card border border-border-app rounded-lg text-text-app">
                  <option value="">Select Topic</option>
                  {topics.map((t) => (<option key={t.id} value={t.id}>{t.name}</option>))}
                </select>
              </div>
              <div className="flex gap-2">
                <input type="number" value={newQuestion.marks} onChange={(e) => setNewQuestion({ ...newQuestion, marks: Number(e.target.value) })}
                  className="w-20 p-2 text-xs bg-bg-card border border-border-app rounded-lg text-text-app" placeholder="Marks" />
                <input type="number" step="0.01" value={newQuestion.negative_marks} onChange={(e) => setNewQuestion({ ...newQuestion, negative_marks: Number(e.target.value) })}
                  className="w-20 p-2 text-xs bg-bg-card border border-border-app rounded-lg text-text-app" placeholder="Negative" />
              </div>
              <textarea value={newQuestion.explanation} onChange={(e) => setNewQuestion({ ...newQuestion, explanation: e.target.value })}
                className="w-full p-2 text-xs bg-bg-card border border-border-app rounded-lg text-text-app" rows={2} placeholder="Explanation" />
              <div className="flex gap-2">
                <button onClick={handleAddQuestion} className="px-3 py-1.5 bg-accent-emerald hover:bg-accent-emerald/90 text-white rounded-lg text-xs font-bold cursor-pointer">Save</button>
                <button onClick={() => setShowAddQuestion(false)} className="px-3 py-1.5 bg-bg-panel text-text-muted rounded-lg text-xs font-bold cursor-pointer">Cancel</button>
              </div>
            </div>
          )}

          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border-app text-text-muted">
                  <th className="pb-2 font-semibold">Question</th>
                  <th className="pb-2 font-semibold">Difficulty</th>
                  <th className="pb-2 font-semibold">Marks</th>
                  <th className="pb-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-app">
                {questions.map((q) => {
                  const topic = topics.find((t) => t.id === q.topic_id);
                  return (
                    <tr key={q.id} className="hover:bg-bg-panel/50">
                      <td className="py-2 text-text-app max-w-xs truncate">{q.question}</td>
                      <td className="py-2">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${q.difficulty === 'Easy' ? 'bg-accent-emerald/10 text-accent-emerald' : q.difficulty === 'Medium' ? 'bg-accent-gold/10 text-accent-gold' : 'bg-accent-rose/10 text-accent-rose'}`}>{q.difficulty}</span>
                        {topic && <span className="ml-1 text-[9px] text-text-muted">{topic.name}</span>}
                      </td>
                      <td className="py-2 text-text-app">{q.marks}/{q.negative_marks}</td>
                      <td className="py-2 text-right">
                        <button onClick={() => handleDeleteQuestion(q.id)} className="p-1 text-accent-rose hover:bg-accent-rose/10 rounded transition cursor-pointer">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'topics' && (
        <div className="bg-bg-card border border-border-app rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-serif font-bold text-text-app mb-4">Manage Topics</h3>
          <div className="flex gap-2 mb-4">
            <input value={newTopicName} onChange={(e) => setNewTopicName(e.target.value)}
              className="flex-1 p-2 text-xs bg-bg-panel border border-border-app rounded-lg text-text-app" placeholder="New topic name" />
            <button onClick={handleAddTopic} className="px-3 py-1.5 bg-brand hover:bg-brand-hover text-white rounded-lg text-xs font-bold transition cursor-pointer">
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {topics.map((t) => {
              const count = questions.filter((q) => q.topic_id === t.id).length;
              return (
                <div key={t.id} className="p-3 bg-bg-panel border border-border-app rounded-xl flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-text-app">{t.name}</div>
                    <div className="text-[10px] text-text-muted">{count} questions</div>
                  </div>
                  <BookOpen className="w-4 h-4 text-brand opacity-50" />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
