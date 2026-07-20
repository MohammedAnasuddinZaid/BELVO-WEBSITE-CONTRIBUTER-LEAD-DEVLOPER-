import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { INTENTS, FALLBACKS, GREETINGS, GREETING_KEYWORDS, type Answer } from "@/lib/chatbot-knowledge";
import { useVoiceAssistant } from "@/hooks/useVoiceAssistant";

// ── Constants ─────────────────────────────────────────────────────────────────
const AI_CALL_LIMIT = 15; // max AI-fallback calls per browser session
const AI_CACHE_PREFIX = "belvo_ai_"; // sessionStorage key prefix
const AI_COUNTER_KEY = "belvo_ai_count";
const CHAT_SESSION_KEY = "belvo-chat-session-id";
const FAQS = [
  {
    label: "Services",
    prompt: "What services does Belvo provide?",
  },
  {
    label: "Pricing",
    prompt: "How much does website development cost?",
  },
  {
    label: "AI Solutions",
    prompt: "Do you provide AI solutions?",
  },
  {
    label: "Book a Call",
    prompt: "How can I book a free consultation?",
  },
  {
    label: "Contact",
    prompt: "How can I contact Belvo?",
  },
];

// ── Message type ──────────────────────────────────────────────────────────────
interface Message {
  text: string;
  isUser: boolean;
  link?: { label: string; href: string };
  /** "voice" = sent via mic; "text" = sent via keyboard/button. Bot replies inherit the source of the user message they answer. */
  source?: "voice" | "text";
}

// ── Local keyword matching utilities (copied verbatim from original) ───────────
function tokenize(text: string): string[] {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/).filter(Boolean);
}

function isGreeting(input: string): boolean {
  const tokens = tokenize(input);
  if (tokens.length > 6) return false;
  const lower = input.toLowerCase();
  for (const kw of GREETING_KEYWORDS) {
    if (lower.includes(kw)) return true;
  }
  const greetingTokens = new Set(["hello", "hi", "hey", "greetings", "howdy", "sup", "yo", "heyo"]);
  const matchCount = tokens.filter((t) => greetingTokens.has(t)).length;
  return matchCount >= 1 && tokens.length <= 3;
}

function wordsContainPhrase(words: string[], phrase: string): boolean {
  const phraseWords = phrase.toLowerCase().split(/\s+/);
  for (let i = 0; i <= words.length - phraseWords.length; i++) {
    let match = true;
    for (let j = 0; j < phraseWords.length; j++) {
      if (words[i + j] !== phraseWords[j]) { match = false; break; }
    }
    if (match) return true;
  }
  return false;
}

function findAnswer(input: string): Answer | null {
  const words = tokenize(input);
  if (words.length === 0) return null;

  let best: { answer: Answer; score: number } | null = null;

  for (const intent of INTENTS) {
    let score = 0;
    for (const kw of intent.keywords) {
      const kwWords = kw.toLowerCase().split(/\s+/);
      if (kwWords.length === 1) {
        if (words.includes(kwWords[0])) score += 1;
      } else {
        if (wordsContainPhrase(words, kw)) score += kwWords.length;
      }
    }
    if (score > 0 && (!best || score > best.score)) {
      best = { answer: intent.answer, score };
    }
  }

  return best?.answer ?? null;
}



let fallbackIndex = 0;
function nextFallback(): string {
  const msg = FALLBACKS[fallbackIndex % FALLBACKS.length];
  fallbackIndex++;
  return msg;
}

let greetingIndex = 0;
function nextGreeting(): string {
  const msg = GREETINGS[greetingIndex % GREETINGS.length];
  greetingIndex++;
  return msg;
}

// ── Session AI cache helpers ──────────────────────────────────────────────────
function cacheKey(question: string): string {
  return AI_CACHE_PREFIX + question.toLowerCase().trim();
}
function getCached(question: string): string | null {
  try { return sessionStorage.getItem(cacheKey(question)); } catch { return null; }
}
function setCached(question: string, answer: string): void {
  try { sessionStorage.setItem(cacheKey(question), answer); } catch { /* quota exceeded — ignore */ }
}
function getAICount(): number {
  try { return parseInt(sessionStorage.getItem(AI_COUNTER_KEY) ?? "0", 10) || 0; } catch { return 0; }
}
function incrementAICount(): void {
  try { sessionStorage.setItem(AI_COUNTER_KEY, String(getAICount() + 1)); } catch { /* ignore */ }
}

// ── Icons ─────────────────────────────────────────────────────────────────────
function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}
function CloseIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
function ChatIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
function MicIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  );
}
function MuteIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  );
}
function SpeakerIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
}

// ── Mic button with Framer Motion pulse animation ────────────────────────────
function MicButton({
  isListening,
  onClick,
}: {
  isListening: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      id="belvo-mic-btn"
      onClick={onClick}
      aria-label={isListening ? "Stop voice input" : "Start voice input"}
      title={isListening ? "Stop voice input" : "Start voice input"}
      className="rounded-xl w-10 h-10 flex items-center justify-center border-none cursor-pointer shrink-0 relative"
      style={{
        background: isListening ? "rgba(157,78,221,0.25)" : "rgba(157,78,221,0.12)",
        color: isListening ? "#9D4EDD" : "rgba(240,230,255,0.6)",
        border: isListening ? "1.5px solid #9D4EDD" : "1.5px solid rgba(157,78,221,0.2)",
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.93 }}
    >
      {isListening && (
        <motion.span
          className="absolute inset-0 rounded-xl"
          style={{ border: "2px solid #9D4EDD", borderRadius: "0.75rem" }}
          animate={{ scale: [1, 1.45, 1], opacity: [0.7, 0, 0.7] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      <MicIcon />
    </motion.button>
  );
}

// ── Thinking dots (shown while /api/ask is pending) ──────────────────────────
function ThinkingDots() {
  return (
    <div className="flex gap-1 items-center px-1 py-1" aria-label="Thinking…">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          style={{ width: 6, height: 6, borderRadius: "50%", background: "#9D4EDD", display: "block" }}
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -4, 0] }}
          transition={{ duration: 0.9, delay: i * 0.18, repeat: Infinity }}
        />
      ))}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [sessionId] = useState(() => {
  let id = localStorage.getItem(CHAT_SESSION_KEY);

  if (!id) {
    id = Date.now().toString();
    localStorage.setItem(CHAT_SESSION_KEY, id);
  }

  return id;
  });
  const storageKey = `belvo-chat-${sessionId}`;

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem(storageKey);

    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }

    return [];
  });
  const [input, setInput] = useState("");
  const [isAILoading, setIsAILoading] = useState(false);
  

  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    speechRecognitionSupported,
    speechSynthesisSupported,
    isListening,
    isMuted,
    voiceError,
    startListening,
    stopListening,
    speak,
    cancelSpeech,
    toggleMute,
  } = useVoiceAssistant();

  // Auto-scroll on new messages
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input on open
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);
  
  useEffect(() => {
  localStorage.setItem(storageKey, JSON.stringify(messages));
  }, [messages, storageKey]);


  // Cancel speech on close
  useEffect(() => {
    if (!open) {
      cancelSpeech();
      stopListening();
    }
  }, [open, cancelSpeech, stopListening]);

  // ── AI fallback via /api/ask ─────────────────────────────────────────────
  const fetchAIAnswer = useCallback(async (question: string): Promise<string | null> => {
    // 1. Check session cache
    const cached = getCached(question);
    if (cached) return cached;

    // 2. Check per-session call limit
    if (getAICount() >= AI_CALL_LIMIT) return null;

    // 3. Fire one request — no client-side retries
    try {
      setIsAILoading(true);
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      if (data.success && data.answer) {
        incrementAICount();
        setCached(question, data.answer);
        return data.answer;
      }
      return null;
    } catch {
      return null;
    } finally {
      setIsAILoading(false);
    }
  }, []);

  // ── Core send handler ────────────────────────────────────────────────────
  // source="voice" → bot reply will be spoken via TTS.
  // source="text"  → bot reply is silent (same as original behaviour).
  const handleSend = useCallback(async (textOverride?: string, source: "voice" | "text" = "text") => {
    const text = (textOverride ?? input).trim();
    if (!text) return;
    setInput("");
    setMessages((m) => [...m, { text, isUser: true, source }]);

    const shouldSpeak = source === "voice";

    const answer = findAnswer(text);

    if (answer) {
      // Local match — instant, free, no API
      setTimeout(() => {
        setMessages((m) => [...m, { text: answer.text, isUser: false, link: answer.link, source }]);
        if (shouldSpeak) speak(answer.text);
      }, 400);
      return;
    }

    if (isGreeting(text)) {
      const greet = nextGreeting();
      setTimeout(() => {
        setMessages((m) => [...m, { text: greet, isUser: false, source }]);
        if (shouldSpeak) speak(greet);
      }, 400);
      return;
    }

    // Last resort: AI fallback
    const aiAnswer = await fetchAIAnswer(text);
    if (aiAnswer) {
      setMessages((m) => [...m, { text: aiAnswer, isUser: false, source }]);
      if (shouldSpeak) speak(aiAnswer);
    } else {
      const fallback = nextFallback();
      setMessages((m) => [...m, { text: fallback, isUser: false, source }]);
      if (shouldSpeak) speak(fallback);
    }
  }, [input, fetchAIAnswer, speak]);

  // ── Mic toggle ────────────────────────────────────────────────────────────
  const handleMicToggle = useCallback(() => {
    if (isListening) {
      stopListening();
      return;
    }
    startListening(
      (interim) => setInput(interim),    // stream interim into input box live
      (final) => {
        setInput("");                     // clear interim text
        handleSend(final, "voice");      // auto-submit — reply will be spoken
      }
    );
  }, [isListening, startListening, stopListening, handleSend]);

  return (
    <>
      {/* ── Screen-reader live region for voice state changes ── */}
      <div aria-live="polite" aria-atomic="true" className="sr-only" id="belvo-voice-status">
        {isListening ? "Listening… speak now." : ""}
        {voiceError ? voiceError : ""}
      </div>

      {/* ── Floating Siri Spectrum Orb Toggle ── */}
      <motion.button
        id="belvo-chat-toggle"
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-8 left-8 z-[9998] cursor-pointer border-none"
        style={{
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: "transparent",
          padding: 0,
          outline: "none",
        }}
        whileTap={{ scale: 0.93 }}
        aria-label={open ? "Close chat" : "Open chat"}
      >
        {open ? (
          <CloseIcon size={24} />
        ) : (
          <div
            style={{
              position: "relative",
              width: 60,
              height: 60,
              borderRadius: "50%",
              overflow: "hidden",
              background: [
                "radial-gradient(ellipse at 75% 25%, #d4498f 0%, transparent 55%)",
                "radial-gradient(ellipse at 50% 40%, #ed7fe3 0%, transparent 45%)",
                "radial-gradient(ellipse at 30% 65%, #ba9aca 0%, transparent 50%)",
                "radial-gradient(ellipse at 45% 80%, #ffffff 0%, transparent 30%)",
                "#7c3aed",
              ].join(","),
              boxShadow: "0 0 30px rgba(76,29,149,0.3), 0 0 15px rgba(236,72,153,0.12), inset 0 0 20px rgba(0,0,0,0.4)",
            }}
          >
            <div style={{ animation: "guillotine-spin 14s linear infinite" }}>
              <svg
                viewBox="0 0 120 120"
                style={{
                  display: "block",
                  width: 120,
                  height: 120,
                }}
              >
                <defs>
                  {Array.from({ length: 16 }).map((_, i) => (
                    <linearGradient key={i} id={`wave-${i}`} x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="rgba(255,255,255,0)" />
                      <stop offset="25%" stopColor={`rgba(255,255,255,${0.12 + i * 0.015})`} />
                      <stop offset="50%" stopColor={`rgba(255,255,255,${0.25 + i * 0.02})`} />
                      <stop offset="75%" stopColor={`rgba(255,255,255,${0.12 + i * 0.015})`} />
                      <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                    </linearGradient>
                  ))}
                </defs>
                {Array.from({ length: 24 }).map((_, i) => {
                  const phase = i * 0.4 + Math.sin(i * 0.2) * 0.3;
                  const amp = 10 + Math.sin(i * 0.5) * 5;
                  const freq = 0.06 + Math.sin(i * 0.25) * 0.02;
                  const yOff = 5 + i * 4.8 + Math.sin(i * 0.6) * 2;
                  const opacity = 0.12 + Math.sin(i * 0.3) * 0.08 + 0.1;
                  const strokeW = 0.25 + Math.sin(i * 0.5) * 0.12 + 0.15;

                  const d = Array.from({ length: 140 }, (_, x) => {
                    const t = x * 1.2;
                    const ny = yOff
                      + Math.sin(t * freq + phase) * amp
                      + Math.sin(t * 0.03 + i * 0.4) * 5
                      + Math.sin(t * 0.008 + i * 0.7) * 3;
                    return `${x === 0 ? "M" : "L"} ${t - 10} ${ny}`;
                  }).join(" ");

                  return (
                    <path
                      key={i}
                      d={d}
                      fill="none"
                      stroke={`url(#wave-${i % 16})`}
                      strokeWidth={strokeW}
                      opacity={opacity}
                      style={{ filter: "blur(0.4px)" }}
                    />
                  );
                })}
                {Array.from({ length: 16 }).map((_, i) => {
                  const phase = i * 0.6 + 1.5 + Math.cos(i * 0.3) * 0.4;
                  const amp = 9 + Math.cos(i * 0.7) * 4;
                  const freq = 0.05 + Math.cos(i * 0.35) * 0.018;
                  const xOff = 5 + i * 6.5 + Math.cos(i * 0.5) * 2.5;
                  const opacity = 0.06 + Math.cos(i * 0.4) * 0.05 + 0.05;
                  const strokeW = 0.2 + Math.cos(i * 0.6) * 0.08 + 0.12;

                  const d = Array.from({ length: 140 }, (_, y) => {
                    const t = y * 1.2;
                    const nx = xOff
                      + Math.sin(t * freq + phase) * amp
                      + Math.sin(t * 0.025 + i * 0.5) * 4
                      + Math.sin(t * 0.007 + i * 0.8) * 2.5;
                    return `${y === 0 ? "M" : "L"} ${nx} ${t - 10}`;
                  }).join(" ");

                  return (
                    <path
                      key={`cross-${i}`}
                      d={d}
                      fill="none"
                      stroke="rgba(255,255,255,0.05)"
                      strokeWidth={strokeW}
                      opacity={opacity}
                      style={{ filter: "blur(0.3px)" }}
                    />
                  );
                })}
              </svg>
            </div>
          </div>
        )}
      </motion.button>

      {/* ── Chat panel ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="belvo-chat-panel"
            className="fixed bottom-22 left-8 z-[9998] w-[420px] h-[calc(100vh-120px)] max-w-[calc(100vw-2rem)] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            style={{
              background: "var(--belvo-chat-bg)",
              border: "1px solid var(--belvo-border-card, rgba(157,78,221,0.2))",
            }}
            initial={{ opacity: 0, scale: 0.9, y: 20, originX: 0, originY: 1 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          >
            {/* ── Header ── */}
            <div
              className="flex items-center gap-3 px-5 py-4"
              style={{ background: "linear-gradient(135deg, #7B2FBE, #9D4EDD)" }}
            >
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm">
                B
              </div>
              <div>
                <div className="text-white font-semibold text-sm">BELVO Assistant</div>
                <div className="text-white/70 text-xs flex items-center gap-1.5">
                  {isListening ? (
                    <>
                      <motion.span
                        style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", display: "inline-block" }}
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 0.9, repeat: Infinity }}
                      />
                      Listening…
                    </>
                  ) : isAILoading ? (
                    <>
                      <motion.span
                        style={{ width: 6, height: 6, borderRadius: "50%", background: "#facc15", display: "inline-block" }}
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 0.9, repeat: Infinity }}
                      />
                      Thinking…
                    </>
                  ) : "Online"}
                </div>
              </div>

              {/* Mute / unmute speaker (only if synthesis supported) */}
              {speechSynthesisSupported && (
                <button
                  id="belvo-mute-btn"
                  onClick={toggleMute}
                  className="ml-auto text-white/70 hover:text-white cursor-pointer bg-transparent border-none p-1"
                  aria-label={isMuted ? "Unmute voice" : "Mute voice"}
                  title={isMuted ? "Unmute voice" : "Mute voice"}
                >
                  {isMuted ? <MuteIcon /> : <SpeakerIcon />}
                </button>
              )}

              <button
                id="belvo-chat-close"
                onClick={() => setOpen(false)}
                className={`${speechSynthesisSupported ? "" : "ml-auto"} text-white/70 hover:text-white cursor-pointer bg-transparent border-none`}
                aria-label="Close chat"
              >
                <CloseIcon />
              </button>
            </div>
            <div className="flex flex-wrap gap-2 px-4 py-3 border-b"
              style={{
                borderColor: "var(--belvo-border-card)",
              }}
            >
              {FAQS.map((faq) => (
                <button
                  key={faq.label}
                  onClick={() => handleSend(faq.prompt)}
                  className="rounded-full px-4 py-2 text-sm font-medium transition-all duration-200"
                  style={{
                    background: "#9D4EDD",
                    color: "var(--belvo-text-1)",
                    border: "1.5px solid var(--belvo-border-card)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#9D4EDD";
                    e.currentTarget.style.background = "rgba(157,78,221,0.08)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--belvo-border-card)";
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  {faq.label}
                </button>
              ))}
            </div>

            {/* ── Message list ── */}
            <div
              className="chat-scroll flex-1 overflow-y-auto px-4 py-4 space-y-4"
              style={{ scrollbarWidth: "thin" }}
            >
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-md transition-all duration-200 ${msg.isUser
                        ? "rounded-br-md"
                        : "rounded-bl-md backdrop-blur-md"
                      }`}
                    style={{
                      background: msg.isUser
                        ? "linear-gradient(135deg, #7B2FBE, #9D4EDD)"
                        : "var(--belvo-bg-card)",
                      color: msg.isUser ? "#fff" : "var(--belvo-text-1)",
                      border: msg.isUser
                        ? "none"
                        : "1px solid rgba(157,78,221,0.2)",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    }}
                  >
                    {msg.text}

                    {msg.link && (
                      <a
                        href={msg.link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block mt-2 text-xs font-medium underline"
                        style={{ color: "#C084FC" }}
                      >
                        {msg.link.label} →
                      </a>
                    )}
                  </div>
                </div>
              ))}

              {/* AI loading indicator */}
              {isAILoading && (
                <div className="flex justify-start">
                  <div
                    className="max-w-[85%] rounded-2xl rounded-bl-md px-4 py-2.5"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.12)",
                    }}
                  >
                    <ThinkingDots />
                  </div>
                </div>
              )}

              {/* Voice error inline message */}
              {voiceError && (
                <div className="flex justify-start">
                  <div
                    className="max-w-[85%] rounded-2xl rounded-bl-md px-4 py-2.5 text-xs"
                    style={{
                      background: "rgba(239,68,68,0.12)",
                      border: "1px solid rgba(239,68,68,0.3)",
                      color: "#fca5a5",
                    }}
                  >
                    🎤 {voiceError}
                  </div>
                </div>
              )}

              <div ref={endRef} />
            </div>

            {/* ── Input row ── */}
            <div className="px-4 py-3 border-t" style={{ borderColor: "var(--belvo-border-card, rgba(157,78,221,0.15))" }}>
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  id="belvo-chat-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !isAILoading && handleSend(undefined, "text")}
                  placeholder={isListening ? "Listening… speak now" : "Ask me anything…"}
                  disabled={isAILoading}
                  className="flex-1 rounded-xl px-4 py-2.5 text-sm outline-none"
                  style={{
                    background: "var(--belvo-bg-card)",
                    color: "var(--belvo-text-1, #f0e6ff)",
                    border: `1px solid ${isListening ? "#9D4EDD" : "var(--belvo-border-card, rgba(157,78,221,0.2))"}`,
                    transition: "border-color 0.2s",
                    opacity: isAILoading ? 0.6 : 1,
                  }}
                />

                {/* Mic button — hidden if recognition not supported */}
                {speechRecognitionSupported && (
                  <MicButton isListening={isListening} onClick={handleMicToggle} />
                )}

                {/* Send button — always text source */}
                <motion.button
                  id="belvo-chat-send"
                  onClick={() => handleSend(undefined, "text")}
                  disabled={isAILoading}
                  className="rounded-xl w-10 h-10 flex items-center justify-center border-none cursor-pointer shrink-0"
                  style={{
                    background: isAILoading ? "rgba(157,78,221,0.4)" : "#9D4EDD",
                    color: "#fff",
                    cursor: isAILoading ? "not-allowed" : "pointer",
                  }}
                  whileHover={isAILoading ? {} : { scale: 1.05 }}
                  whileTap={isAILoading ? {} : { scale: 0.95 }}
                  aria-label="Send message"
                >
                  <SendIcon />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
