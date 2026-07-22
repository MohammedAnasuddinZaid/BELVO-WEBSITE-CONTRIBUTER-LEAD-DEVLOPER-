import React, { useState } from 'react';
import { PdfNote, PDF_NOTES } from '../data/pdfNotes';
import { PDFNotes } from './PDFNotes';
import { FileText, BookOpen, Download, Calendar, User, HardDrive, ArrowRight, Search } from 'lucide-react';

export const PDFNotesLibrary: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const activeNote = activeNoteId ? PDF_NOTES.find((n) => n.id === activeNoteId) ?? null : null;

  if (activeNote) {
    return (
      <PDFNotes
        note={activeNote}
        onBack={() => setActiveNoteId(null)}
        allNotes={PDF_NOTES}
        onSelectNote={setActiveNoteId}
      />
    );
  }

  const filtered = PDF_NOTES.filter(
    (n) =>
      n.documentTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.moduleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.instructorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.keywords.some((k) => k.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 font-sans text-text-app">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-serif font-black text-text-app flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-brand" /> PDF Notes Library
          </h2>
          <p className="text-xs text-text-muted mt-0.5">Comprehensive study materials for Operating Systems</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-bg-card border border-border-app rounded-xl text-text-app focus:outline-none focus:ring-1 focus:ring-brand placeholder:text-text-muted/60"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((note) => (
          <NoteCard key={note.id} note={note} onOpen={() => setActiveNoteId(note.id)} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="p-12 text-center text-text-muted text-xs bg-bg-card border border-border-app rounded-2xl">
          <BookOpen className="w-10 h-10 mx-auto mb-2 opacity-30" />
          <p>No PDF notes match your search.</p>
        </div>
      )}
    </div>
  );
};

const NoteCard: React.FC<{ note: PdfNote; onOpen: () => void }> = ({ note, onOpen }) => (
  <div className="p-5 bg-bg-card border border-border-app rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col">
    <div className="flex items-start gap-3 mb-3">
      <div className="p-2.5 bg-brand/10 text-brand rounded-xl flex-shrink-0">
        <FileText className="w-5 h-5" />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="text-xs font-serif font-bold text-text-app leading-tight group-hover:text-brand transition-colors line-clamp-2">{note.documentTitle}</h3>
        <span className="text-[10px] text-text-muted font-semibold block mt-0.5">{note.moduleName}</span>
      </div>
    </div>

    <div className="space-y-1.5 mb-4 flex-1">
      <div className="flex items-center gap-2 text-[10px] text-text-muted">
        <User className="w-3 h-3" /> <span>{note.instructorName}</span>
      </div>
      <div className="flex items-center gap-2 text-[10px] text-text-muted">
        <Calendar className="w-3 h-3" /> <span>{note.uploadedDate}</span>
      </div>
      <div className="flex items-center gap-2 text-[10px] text-text-muted">
        <HardDrive className="w-3 h-3" /> <span>{note.fileSize} &middot; {note.totalPages} pages</span>
      </div>
    </div>

    <div className="flex flex-wrap gap-1 mb-4">
      {note.keywords.slice(0, 3).map((kw, idx) => (
        <span key={idx} className="px-1.5 py-0.5 bg-bg-panel border border-border-app text-[9px] font-medium rounded text-text-muted">{kw}</span>
      ))}
      {note.keywords.length > 3 && (
        <span className="px-1.5 py-0.5 text-[9px] text-text-muted">+{note.keywords.length - 3}</span>
      )}
    </div>

    <button onClick={onOpen}
      className="w-full px-3 py-2 bg-brand hover:bg-brand-hover text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer group-hover:scale-[1.01]">
      <BookOpen className="w-3.5 h-3.5" /> Open Notes <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
    </button>
  </div>
);
