import React, { useState, useRef, useCallback } from 'react';
import { PdfNote } from '../data/pdfNotes';
import {
  FileText, ZoomIn, ZoomOut, Maximize, RotateCw,
  Download, Printer, BookOpen, User, Calendar,
  HardDrive, Layers, ChevronLeft, ChevronRight,
  PanelRightClose, Tag, Target, ArrowLeft,
  Shrink, Minimize2, ScanLine
} from 'lucide-react';

interface PDFNotesProps {
  note: PdfNote;
  onBack: () => void;
  allNotes: PdfNote[];
  onSelectNote: (id: string) => void;
}

export const PDFNotes: React.FC<PDFNotesProps> = ({ note, onBack, allNotes, onSelectNote }) => {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [fitToWidth, setFitToWidth] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showInfo, setShowInfo] = useState(true);
  const viewerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = useCallback(() => {
    setZoom((prev) => Math.min(prev + 10, 200));
    setFitToWidth(false);
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((prev) => Math.max(prev - 10, 50));
    setFitToWidth(false);
  }, []);

  const handleRotate = useCallback(() => {
    setRotation((prev) => (prev + 90) % 360);
  }, []);

  const handleFitToWidth = useCallback(() => {
    setFitToWidth(true);
    setZoom(100);
  }, []);

  const handleFullscreen = useCallback(async () => {
    if (!viewerRef.current) return;
    if (!isFullscreen) {
      try {
        await viewerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } catch { }
    } else {
      try {
        await document.exitFullscreen();
        setIsFullscreen(false);
      } catch { }
    }
  }, [isFullscreen]);

  const handleDownload = useCallback(() => {
    const link = document.createElement('a');
    link.href = note.pdfUrl;
    link.download = `${note.documentTitle.replace(/\s+/g, '_')}.pdf`;
    link.target = '_blank';
    link.click();
  }, [note]);

  const handlePrint = useCallback(() => {
    const printWindow = window.open(note.pdfUrl, '_blank');
    if (printWindow) {
      printWindow.onload = () => {
        try { printWindow.print(); } catch { }
      };
    }
  }, [note]);

  React.useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  React.useEffect(() => {
    setCurrentPage(1);
    setZoom(100);
    setRotation(0);
    setFitToWidth(false);
  }, [note.id]);

  return (
    <div className="space-y-6 font-sans text-text-app">
      <div className="flex items-center justify-between gap-4">
        <button onClick={onBack}
          className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-text-muted hover:text-text-app bg-bg-card border border-border-app rounded-xl hover:bg-bg-panel transition cursor-pointer">
          <ArrowLeft className="w-4 h-4" /> Back to Notes Library
        </button>
        <div className="flex items-center gap-2">
          {allNotes.filter((n) => n.id !== note.id).slice(0, 3).map((n) => (
            <button key={n.id} onClick={() => onSelectNote(n.id)}
              className="px-2.5 py-1.5 text-[11px] font-bold text-text-muted hover:text-text-app bg-bg-card border border-border-app rounded-lg hover:bg-bg-panel transition truncate max-w-[160px] cursor-pointer">
              {n.documentTitle}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className={`xl:col-span-3 space-y-4 ${!showInfo ? 'xl:col-span-4' : ''}`}>
          <div className="p-4 bg-bg-card border border-border-app rounded-2xl shadow-sm">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2 min-w-0">
                <div className="p-1.5 bg-brand/10 text-brand rounded-lg flex-shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <h2 className="text-sm font-serif font-bold text-text-app truncate">{note.documentTitle}</h2>
              </div>
              <span className="px-2 py-0.5 bg-bg-panel border border-border-app text-[10px] font-bold text-text-muted rounded-lg flex-shrink-0">
                Page {currentPage} of {note.totalPages}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-border-app">
              <div className="flex items-center gap-1">
                <button onClick={handleZoomOut}
                  className="p-1.5 bg-bg-panel hover:bg-border-app rounded-lg transition cursor-pointer" title="Zoom Out">
                  <ZoomOut className="w-4 h-4 text-text-app" />
                </button>
                <span className="w-12 text-center text-[11px] font-bold text-text-app tabular-nums">{zoom}%</span>
                <button onClick={handleZoomIn}
                  className="p-1.5 bg-bg-panel hover:bg-border-app rounded-lg transition cursor-pointer" title="Zoom In">
                  <ZoomIn className="w-4 h-4 text-text-app" />
                </button>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={handleRotate}
                  className="p-1.5 bg-bg-panel hover:bg-border-app rounded-lg transition cursor-pointer" title="Rotate">
                  <RotateCw className="w-4 h-4 text-text-app" />
                </button>
                <button onClick={handleFitToWidth}
                  className={`p-1.5 rounded-lg transition cursor-pointer ${fitToWidth ? 'bg-brand text-white' : 'bg-bg-panel hover:bg-border-app text-text-app'}`} title="Fit to Width">
                  <ScanLine className="w-4 h-4" />
                </button>
                <button onClick={handleFullscreen}
                  className="p-1.5 bg-bg-panel hover:bg-border-app rounded-lg transition cursor-pointer" title="Full Screen">
                  {isFullscreen ? <Minimize2 className="w-4 h-4 text-text-app" /> : <Maximize className="w-4 h-4 text-text-app" />}
                </button>
                <div className="w-px h-5 bg-border-app mx-1" />
                <button onClick={handleDownload}
                  className="p-1.5 bg-bg-panel hover:bg-border-app rounded-lg transition cursor-pointer" title="Download PDF">
                  <Download className="w-4 h-4 text-text-app" />
                </button>
                <button onClick={handlePrint}
                  className="p-1.5 bg-bg-panel hover:bg-border-app rounded-lg transition cursor-pointer" title="Print PDF">
                  <Printer className="w-4 h-4 text-text-app" />
                </button>
              </div>
              <button onClick={() => setShowInfo(!showInfo)}
                className={`p-1.5 rounded-lg transition cursor-pointer xl:hidden ${showInfo ? 'bg-brand text-white' : 'bg-bg-panel hover:bg-border-app text-text-muted'}`} title="Toggle Info Panel">
                <PanelRightClose className="w-4 h-4" />
              </button>
            </div>

            <div ref={viewerRef} className="relative bg-bg-panel border border-border-app rounded-xl overflow-hidden">
              <div className="flex items-center justify-center" style={{ minHeight: '480px' }}>
                <div
                  className="bg-white shadow-lg transition-all duration-200 origin-center"
                  style={{
                    transform: `rotate(${rotation}deg)`,
                    width: fitToWidth ? '100%' : `${zoom}%`,
                    maxWidth: fitToWidth ? '100%' : '800px',
                    aspectRatio: '8.5 / 11',
                  }}
                >
                  <iframe
                    src={`${note.pdfUrl}#page=${currentPage}`}
                    className="w-full h-full border-0"
                    title={note.documentTitle}
                    style={{ pointerEvents: 'auto' }}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 mt-3">
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-text-muted font-semibold">Go to page:</span>
                <div className="flex items-center gap-1">
                  <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage <= 1}
                    className="p-1 bg-bg-panel hover:bg-border-app rounded-md transition disabled:opacity-30 cursor-pointer">
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <input
                    type="number"
                    value={currentPage}
                    onChange={(e) => {
                      const v = Math.min(note.totalPages, Math.max(1, Number(e.target.value) || 1));
                      setCurrentPage(v);
                    }}
                    className="w-14 text-center text-xs font-bold bg-bg-panel border border-border-app rounded-lg py-1 text-text-app focus:outline-none focus:ring-1 focus:ring-brand"
                    min={1} max={note.totalPages}
                  />
                  <button onClick={() => setCurrentPage((p) => Math.min(note.totalPages, p + 1))} disabled={currentPage >= note.totalPages}
                    className="p-1 bg-bg-panel hover:bg-border-app rounded-md transition disabled:opacity-30 cursor-pointer">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <span className="text-[10px] text-text-muted font-semibold">
                Page {currentPage} of {note.totalPages}
              </span>
            </div>
          </div>
        </div>

        {showInfo && (
          <div className="xl:col-span-1 space-y-4">
            <div className="p-4 bg-bg-card border border-border-app rounded-2xl shadow-sm space-y-3">
              <h3 className="text-xs font-serif font-bold text-text-app flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5 text-brand" /> Notes Information
              </h3>
              <div className="space-y-2.5">
                <InfoRow icon={<FileText className="w-3.5 h-3.5" />} label="Document Title" value={note.documentTitle} />
                <InfoRow icon={<Layers className="w-3.5 h-3.5" />} label="Module" value={note.moduleName} />
                <InfoRow icon={<User className="w-3.5 h-3.5" />} label="Instructor" value={note.instructorName} />
                <InfoRow icon={<Calendar className="w-3.5 h-3.5" />} label="Uploaded" value={note.uploadedDate} />
                <InfoRow icon={<HardDrive className="w-3.5 h-3.5" />} label="File Size" value={note.fileSize} />
                <InfoRow icon={<Layers className="w-3.5 h-3.5" />} label="Total Pages" value={`${note.totalPages}`} />
                <InfoRow icon={<Calendar className="w-3.5 h-3.5" />} label="Last Updated" value={note.lastUpdated} />
              </div>
            </div>

            <div className="p-4 bg-bg-card border border-border-app rounded-2xl shadow-sm space-y-3">
              <h3 className="text-xs font-serif font-bold text-text-app flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-brand" /> Description
              </h3>
              <div className="space-y-3">
                <div>
                  <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Overview</h4>
                  <p className="text-[11px] text-text-app leading-relaxed">{note.overview}</p>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1.5">Topics Covered</h4>
                  <ul className="space-y-1">
                    {note.topicsCovered.map((topic, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 text-[11px] text-text-app">
                        <span className="w-1 h-1 rounded-full bg-brand mt-1.5 flex-shrink-0" />
                        {topic}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1.5">Learning Objectives</h4>
                  <ul className="space-y-1">
                    {note.learningObjectives.map((obj, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 text-[11px] text-text-app">
                        <Target className="w-3 h-3 text-accent-gold mt-0.5 flex-shrink-0" />
                        {obj}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1.5">Keywords / Tags</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {note.keywords.map((kw, idx) => (
                      <span key={idx}
                        className="px-2 py-0.5 bg-bg-panel border border-border-app text-[10px] font-medium text-text-muted rounded-lg">
                        <Tag className="w-2.5 h-2.5 inline mr-0.5" />
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const InfoRow: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="flex items-start gap-2">
    <div className="p-1 bg-bg-panel rounded-lg text-text-muted flex-shrink-0 mt-0.5">{icon}</div>
    <div className="min-w-0">
      <span className="block text-[9px] font-bold text-text-muted uppercase tracking-wider">{label}</span>
      <span className="block text-[11px] font-semibold text-text-app truncate">{value}</span>
    </div>
  </div>
);
