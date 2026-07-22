import { useState, useEffect } from 'react';
import { ThemeToggle } from './components/ThemeToggle';
import { PDFNotesLibrary } from './components/PDFNotesLibrary';
import { BookOpen, Layers, Terminal } from 'lucide-react';

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(true);

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-bg-app text-text-app flex flex-col transition-colors duration-200">
      <header className="sticky top-0 z-40 bg-bg-card/95 backdrop-blur-md border-b border-border-app transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-brand rounded-xl text-white">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm font-serif font-black tracking-tight flex items-center gap-1 text-text-app">PDF Notes Library</h1>
              <span className="text-[10px] text-text-muted block -mt-0.5 font-bold uppercase tracking-wider">Study Resources</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <PDFNotesLibrary onBack={() => {}} />
      </main>

      <footer className="bg-bg-card border-t border-border-app py-6 transition-colors duration-200 text-text-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-[11px] gap-3">
          <div className="flex items-center gap-1.5 font-bold">
            <Layers className="w-3.5 h-3.5 text-brand" />
            <span>© 2026 PDF Notes Library.</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 font-mono">
              <Terminal className="w-3.5 h-3.5 text-accent-emerald" />
              <span>v1.0</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
