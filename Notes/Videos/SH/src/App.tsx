import { useState, useEffect } from 'react';
import { api } from './lib/db';
import { Profile } from './types';
import { ThemeToggle } from './components/ThemeToggle';
import { AuthScreen } from './components/AuthScreen';
import { StudentDashboard } from './components/StudentDashboard';
import { TestScreen } from './components/TestScreen';
import { ResultScreen } from './components/ResultScreen';
import { PracticeScreen } from './components/PracticeScreen';
import { AdminDashboard } from './components/AdminDashboard';
import { GraduationCap, LogOut, Terminal, Layers } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<Profile | null>(null);
  const [activeTestId, setActiveTestId] = useState<string | null>(null);
  const [activeResultId, setActiveResultId] = useState<string | null>(null);
  const [activePracticeTopicId, setActivePracticeTopicId] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const currentUser = await api.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (e) {
        console.error('Error restoring session', e);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  const handleLoginSuccess = (profile: Profile) => {
    setUser(profile);
    setActiveTestId(null);
    setActiveResultId(null);
    setActivePracticeTopicId(null);
  };

  const handleLogout = async () => {
    await api.logout();
    setUser(null);
    setActiveTestId(null);
    setActiveResultId(null);
    setActivePracticeTopicId(null);
  };

  const handleStartTest = async (
    questionCount = 50,
    customQuestionIds?: string[],
    mockSeriesTitle?: string,
    mockSeriesId?: string,
    durationMin?: number
  ) => {
    if (!user) return;
    setLoading(true);
    const newTest = await api.createTest(
      user.id,
      questionCount,
      customQuestionIds,
      mockSeriesTitle,
      mockSeriesId,
      durationMin
    );
    setActiveTestId(newTest.id);
    setActiveResultId(null);
    setActivePracticeTopicId(null);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-app flex flex-col items-center justify-center text-text-muted">
        <GraduationCap className="w-12 h-12 text-brand animate-bounce mb-3" />
        <div className="text-sm font-serif font-bold text-text-app">OS Question Bank</div>
        <div className="text-xs text-text-muted mt-1">Booting microkernel...</div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-bg-app text-text-app flex flex-col transition-colors duration-200`}>
      <header className="sticky top-0 z-40 bg-bg-card/95 backdrop-blur-md border-b border-border-app transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-brand rounded-xl text-white">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm font-serif font-black tracking-tight flex items-center gap-1 text-text-app">OS Question Bank</h1>
              <span className="text-[10px] text-text-muted block -mt-0.5 font-bold uppercase tracking-wider">Practice & Evaluation Portal</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {user && (
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-bold text-text-app">{user.name}</span>
                <span className="text-[9px] uppercase font-bold text-brand tracking-wider">{user.role}</span>
              </div>
            )}
            <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
            {user && (
              <button onClick={handleLogout}
                className="p-2 rounded-lg bg-accent-rose/10 hover:bg-accent-rose/20 text-accent-rose transition cursor-pointer"
                title="Logout Account">
                <LogOut className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {!user ? (
          <AuthScreen onLoginSuccess={handleLoginSuccess} />
        ) : user.role === 'admin' ? (
          <AdminDashboard profile={user} onLogout={handleLogout} />
        ) : (
          <div>
            {activeTestId ? (
              <TestScreen
                testId={activeTestId}
                onTestSubmitted={(testId) => { setActiveTestId(null); setActiveResultId(testId); }}
                onCancelTest={() => setActiveTestId(null)}
              />
            ) : activeResultId ? (
              <ResultScreen testId={activeResultId} onBackToDashboard={() => setActiveResultId(null)} />
            ) : activePracticeTopicId ? (
              <PracticeScreen topicId={activePracticeTopicId} onBackToDashboard={() => setActivePracticeTopicId(null)} />
            ) : (
              <StudentDashboard
                profile={user}
                onStartTest={handleStartTest}
                onStartPractice={(topicId) => setActivePracticeTopicId(topicId)}
                onResumeTest={(testId) => setActiveTestId(testId)}
                onViewResult={(testId) => setActiveResultId(testId)}
              />
            )}
          </div>
        )}
      </main>

      <footer className="bg-bg-card border-t border-border-app py-6 transition-colors duration-200 text-text-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-[11px] gap-3">
          <div className="flex items-center gap-1.5 font-bold">
            <Layers className="w-3.5 h-3.5 text-brand" />
            <span>© 2026 OS Question Bank. Developed for Academic Excellence.</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 font-mono">
              <Terminal className="w-3.5 h-3.5 text-accent-emerald" />
              <span>STABLE RELEASE v1.2</span>
            </div>
            <span>|</span>
            <span>Offline Mode</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
