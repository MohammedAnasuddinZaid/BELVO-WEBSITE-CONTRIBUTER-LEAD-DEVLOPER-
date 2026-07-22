import React, { useState, useEffect } from 'react';
import { getSupabaseConfig, saveSupabaseConfig } from '../lib/db';
import { SupabaseConfig } from '../types';
import { Database, Copy, Check, Info, Settings, ShieldCheck } from 'lucide-react';

export const SupabaseConfigPanel: React.FC = () => {
  const [config, setConfig] = useState<SupabaseConfig>(getSupabaseConfig());
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showSQL, setShowSQL] = useState(false);

  const handleSave = () => {
    saveSupabaseConfig(config);
    alert('Supabase configuration saved successfully. Refreshing connection...');
    window.location.reload();
  };

  const handleCopySQL = () => {
    const sqlText = `-- Copy-paste into Supabase SQL Editor:
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Table: profiles
create table public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    name text not null,
    email text not null,
    role text not null check (role in ('admin', 'student')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: topics
create table public.topics (
    id uuid primary key default uuid_generate_v4(),
    name text not null unique
);

-- Table: questions
create table public.questions (
    id uuid primary key default uuid_generate_v4(),
    question text not null,
    option_a text not null,
    option_b text not null,
    option_c text not null,
    option_d text not null,
    correct_option text not null check (correct_option in ('A', 'B', 'C', 'D')),
    explanation text not null,
    difficulty text not null check (difficulty in ('Easy', 'Medium', 'Hard')),
    topic_id uuid references public.topics(id) on delete cascade,
    marks integer not null,
    negative_marks numeric not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);`;
    navigator.clipboard.writeText(sqlText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="supabase-config-section" className="mb-4">
      <button
        id="toggle-supabase-settings-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md text-slate-700 bg-slate-100 dark:text-slate-300 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
      >
        <Settings className="w-3.5 h-3.5" />
        Supabase Config
        {config.useRealSupabase && (
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        )}
      </button>

      {isOpen && (
        <div className="mt-3 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg text-sm text-slate-800 dark:text-slate-200 max-w-2xl transition-all">
          <div className="flex items-center justify-between mb-3 border-b border-slate-100 dark:border-slate-800 pb-2">
            <h3 className="font-semibold flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-500" />
              Supabase Database Settings
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              ✕ Close
            </button>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
            By default, this application operates in **Sandbox Mode** using local high-fidelity state management pre-seeded with 100 questions. To connect your live Supabase cloud database, provide your API credentials below.
          </p>

          <div className="space-y-3 mb-4">
            <div className="flex items-center gap-2">
              <input
                id="use-real-supabase-checkbox"
                type="checkbox"
                checked={config.useRealSupabase}
                onChange={(e) => setConfig({ ...config, useRealSupabase: e.target.checked })}
                className="rounded border-gray-300 text-emerald-500 focus:ring-emerald-500"
              />
              <label htmlFor="use-real-supabase-checkbox" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Enable Active Connection to Supabase Cloud
              </label>
            </div>

            {config.useRealSupabase && (
              <>
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                    Supabase Project URL
                  </label>
                  <input
                    type="text"
                    value={config.url}
                    onChange={(e) => setConfig({ ...config, url: e.target.value })}
                    placeholder="https://your-project.supabase.co"
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded focus:outline-none focus:border-emerald-500 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                    Supabase Anon API Key
                  </label>
                  <input
                    type="password"
                    value={config.anonKey}
                    onChange={(e) => setConfig({ ...config, anonKey: e.target.value })}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded focus:outline-none focus:border-emerald-500 dark:text-white"
                  />
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold transition"
            >
              Apply Settings
            </button>
            <button
              onClick={() => setShowSQL(!showSQL)}
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded text-xs font-medium transition flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
              {showSQL ? 'Hide SQL Code' : 'View SQL Setup'}
            </button>
          </div>

          {showSQL && (
            <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 relative">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[11px] font-mono text-slate-400">PostgreSQL Migration Script</span>
                <button
                  onClick={handleCopySQL}
                  className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition text-xs flex items-center gap-1 text-slate-600 dark:text-slate-300"
                  title="Copy SQL Code"
                >
                  {copied ? (
                    <Check className="w-3 h-3 text-emerald-500" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <pre className="text-[10px] font-mono overflow-x-auto max-h-40 leading-relaxed text-slate-600 dark:text-slate-400">
{`-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Table: profiles
create table public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    name text not null,
    email text not null,
    role text not null check (role in ('admin', 'student')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: topics
create table public.topics (
    id uuid primary key default uuid_generate_v4(),
    name text not null unique
);

-- Table: questions
create table public.questions (
    id uuid primary key default uuid_generate_v4(),
    question text not null,
    option_a text not null,
    option_b text not null,
    option_c text not null,
    option_d text not null,
    correct_option text not null check (correct_option in ('A', 'B', 'C', 'D')),
    explanation text not null,
    difficulty text not null check (difficulty in ('Easy', 'Medium', 'Hard')),
    topic_id uuid references public.topics(id) on delete cascade,
    marks integer not null,
    negative_marks numeric not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);`}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
