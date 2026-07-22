import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, ArrowLeft, Mic } from "lucide-react";
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
function renderText(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <span key={i} style={{ color: "#9d4edd", fontWeight: 600 }}>{part.slice(2, -2)}</span>;
    }
    return <span key={i}>{part}</span>;
  });
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
function MicIcon({ size = 16 }: { size?: number }) {
  return <Mic size={size} />;
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
      className="flex items-center justify-center border-none cursor-pointer shrink-0 relative"
      style={{
        width: 40,
        height: 40,
        borderRadius: "50%",
        background: isListening ? "#9d4edd" : "#9d4edd",
        color: "#fff",
        border: "none",
        flexShrink: 0,
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
      <style>{`
        @keyframes chatLoaderCircle {
          0% { transform: rotate(90deg); box-shadow: 0 6px 12px 0 #38bdf8 inset, 0 12px 18px 0 #005dff inset, 0 36px 36px 0 #1e40af inset, 0 0 3px 1.2px rgba(56,189,248,0.3), 0 0 6px 1.8px rgba(0,93,255,0.2); }
          50% { transform: rotate(270deg); box-shadow: 0 6px 12px 0 #60a5fa inset, 0 12px 6px 0 #0284c7 inset, 0 24px 36px 0 #005dff inset, 0 0 3px 1.2px rgba(56,189,248,0.3), 0 0 6px 1.8px rgba(0,93,255,0.2); }
          100% { transform: rotate(450deg); box-shadow: 0 6px 12px 0 #4dc8fd inset, 0 12px 18px 0 #005dff inset, 0 36px 36px 0 #1e40af inset, 0 0 3px 1.2px rgba(56,189,248,0.3), 0 0 6px 1.8px rgba(0,93,255,0.2); }
        }
        .chat-toggle-loader {
          position: relative;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          background: linear-gradient(135deg, #7B2FBE, #9D4EDD);
          box-shadow: 0 0 20px rgba(157,78,221,0.4), 0 0 40px rgba(124,58,237,0.25);
        }
        .chat-toggle-loader::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 50%;
          animation: chatLoaderCircle 5s linear infinite;
        }
      `}</style>

      {/* ── Screen-reader live region for voice state changes ── */}
      <div aria-live="polite" aria-atomic="true" className="sr-only" id="belvo-voice-status">
        {isListening ? "Listening… speak now." : ""}
        {voiceError ? voiceError : ""}
      </div>

      {/* ── Floating Chat Toggle ── */}
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
          <div className="chat-toggle-loader">
            <MessageCircle size={22} color="white" style={{ position: "relative", zIndex: 1 }} />
          </div>
        )}
      </motion.button>

      {/* ── Chat panel ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="belvo-chat-panel"
            className="fixed bottom-22 left-8 z-[9998] flex flex-col overflow-hidden"
            style={{
              maxWidth: 400,
              width: "100%",
              height: "calc(100vh - 100px)",
              maxHeight: 780,
              borderRadius: "16px 16px 0 0",
              background: "#ffffff",
              boxShadow: "0 20px 40px -12px rgba(0,0,0,0.25), 0 8px 24px -6px rgba(0,0,0,0.08)",
            }}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          >
            {/* ── Header pitch black ── */}
            <div
              className="flex items-center gap-2 px-4 py-4 shrink-0"
              style={{ background: "#9d4edd" }}
            >
              <ArrowLeft size={20} color="#fff" style={{ marginRight: 2 }} />
              <div style={{ position: "relative", width: 38, height: 38, flexShrink: 0 }}>
                <img
                  src="/Belvo%20logo.png"
                  alt="Belvo"
                  style={{ width: 38, height: 38, borderRadius: "50%", objectFit: "cover", background: "#2c2c2e" }}
                />
                <span
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    width: 13,
                    height: 13,
                    background: "#9d4edd",
                    border: "2px solid #fff",
                    borderRadius: "50%",
                    boxShadow: "0 0 0 1px #fff",
                  }}
                />
              </div>
              <div style={{ flex: 1, marginLeft: 2 }}>
                <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: -0.2, color: "#fff" }}>
                  BELVO Assistant
                </div>
                <div style={{ fontSize: 11, color: "#fff", letterSpacing: 0.2 }}>
                  Online
                </div>
              </div>
              <button
                id="belvo-chat-close"
                onClick={() => setOpen(false)}
                className="bg-transparent border-none cursor-pointer"
                style={{
                  width: 32,
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  opacity: 0.7,
                }}
                aria-label="Close chat"
              >
                <CloseIcon size={18} />
              </button>
            </div>

            {/* ── Chat body ── */}
            <div
              className="flex-1 overflow-y-auto"
              style={{
                background: "#fcfcfc",
                padding: "18px 16px 12px",
                display: "flex",
                flexDirection: "column",
                gap: 12,
                scrollbarWidth: "thin",
              }}
            >
              {/* system notice */}
              <div
                style={{
                  textAlign: "center",
                  fontSize: 10,
                  color: "#808080",
                  letterSpacing: 0.2,
                  lineHeight: 1.5,
                  marginBottom: 4,
                  padding: "0 4px",
                }}
              >
                This chat is recorded using a cloud service and is subject to the terms of our{" "}
                <span style={{ textDecoration: "underline", textUnderlineOffset: 2, fontWeight: 500, color: "#5a5a5a" }}>
                  Privacy Notice
                </span>
                <span style={{ display: "inline-block", marginLeft: 3, fontSize: 10 }}>↗</span>
              </div>

              {/* timestamp */}
              <div style={{ textAlign: "center", fontSize: 10, color: "#9e9e9e", margin: "2px 0 6px", letterSpacing: 0.2 }}>
                1:17 PM
              </div>

              {/* sender label */}
              <div style={{ fontSize: 10, fontWeight: 600, color: "#1f1f1f", margin: "4px 0 2px", letterSpacing: -0.1 }}>
                Belvo AI Agent
              </div>

              {/* messages */}
              {messages.map((msg, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: msg.isUser ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    style={{
                      background: "#fff",
                      padding: "12px 18px",
                      borderRadius: msg.isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                      maxWidth: "90%",
                      fontSize: 13,
                      lineHeight: 1.5,
                      color: msg.isUser ? "#000" : "#1d1d1d",
                      border: msg.isUser ? "1px solid #9d4edd" : "1px solid #000",
                      wordBreak: "break-word",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
                    }}
                  >
                    {renderText(msg.text)}
                    {msg.link && (
                      <a
                        href={msg.link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "block",
                          marginTop: 8,
                          fontSize: 12,
                          fontWeight: 500,
                          textDecoration: "underline",
                          color: "#5a5a5a",
                        }}
                      >
                        {msg.link.label}
                      </a>
                    )}
                  </div>
                </div>
              ))}

              {/* AI loading indicator */}
              {isAILoading && (
                <div className="flex justify-start">
                  <div
                    style={{
                      background: "#f1f1f1",
                      padding: "12px 18px",
                      borderRadius: "18px 18px 18px 4px",
                    }}
                  >
                    <ThinkingDots />
                  </div>
                </div>
              )}

              {/* Voice error */}
              {voiceError && (
                <div style={{ display: "flex", justifyContent: "center", margin: "4px 0" }}>
                  <div
                    style={{
                      background: "#fff",
                      padding: "8px 16px",
                      borderRadius: 8,
                      fontSize: 12,
                      color: "#dc2626",
                      border: "1px solid #fca5a5",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      boxShadow: "0 2px 8px rgba(220,38,38,0.08)",
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    {voiceError}
                  </div>
                </div>
              )}

              {/* suggestion chips */}
              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, width: "100%" }}>
                <span style={{ fontSize: 11, color: "#9e9e9e", letterSpacing: 0.2, paddingRight: 4 }}>Just now</span>
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "flex-end", gap: 8, maxWidth: "100%" }}>
                  {FAQS.map((faq) => (
                    <span
                      key={faq.label}
                      onClick={() => handleSend(faq.prompt)}
                      style={{
                        background: "#ffffff",
                        border: "1px solid #9d4edd",
                        borderRadius: 50,
                        padding: "8px 18px",
                          fontSize: 12,
                          fontWeight: 500,
                          color: "#6b6b6b",
                          whiteSpace: "nowrap",
                          cursor: "pointer",
                          letterSpacing: -0.1,
                      }}
                    >
                      {faq.label}
                    </span>
                  ))}
                </div>
              </div>

              <div ref={endRef} />
            </div>

            {/* ── Input area ── */}
            <div
              className="shrink-0"
              style={{
                borderTop: "1px solid #e2e2e2",
                background: "#ffffff",
                padding: "14px 16px 12px",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <img src="/Belvo%20logo.png" alt="Belvo" style={{ width: 20, height: 20, borderRadius: "50%", objectFit: "cover", background: "#2c2c2e" }} />
                <input
                  ref={inputRef}
                  id="belvo-chat-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !isAILoading && handleSend(undefined, "text")}
                  placeholder={isListening ? "Listening… speak now" : "Type a message"}
                  disabled={isAILoading}
                  style={{
                    flex: 1,
                    border: "2px solid #9d4edd",
                    borderRadius: 50,
                    padding: "10px 16px",
                    fontSize: 13,
                    fontFamily: "inherit",
                    background: "#ffffff",
                    outline: "none",
                    color: "#1a1a1a",
                    minWidth: 0,
                    opacity: isAILoading ? 0.6 : 1,
                  }}
                />
                {speechRecognitionSupported && (
                  <MicButton isListening={isListening} onClick={handleMicToggle} />
                )}
                <motion.button
                  id="belvo-chat-send"
                  onClick={() => handleSend(undefined, "text")}
                  disabled={isAILoading}
                  className="flex items-center justify-center border-none shrink-0"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: "#9d4edd",
                    color: "#fff",
                    cursor: isAILoading ? "not-allowed" : "pointer",
                    opacity: isAILoading ? 0.4 : 1,
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
