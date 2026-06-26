import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { INTENTS, FALLBACKS, GREETINGS, GREETING_KEYWORDS, type Answer } from "@/lib/chatbot-knowledge";

interface Message {
  text: string;
  isUser: boolean;
  link?: { label: string; href: string };
}

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

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
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

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{ text: nextGreeting(), isUser: false }]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    setMessages((m) => [...m, { text, isUser: true }]);
    const answer = findAnswer(text);
    if (answer) {
      setTimeout(() => {
        setMessages((m) => [...m, { text: answer.text, isUser: false, link: answer.link }]);
      }, 400);
    } else if (isGreeting(text)) {
      setTimeout(() => {
        setMessages((m) => [...m, { text: nextGreeting(), isUser: false }]);
      }, 400);
    } else {
      setTimeout(() => {
        setMessages((m) => [...m, { text: nextFallback(), isUser: false }]);
      }, 400);
    }
  };

  return (
    <>
      <motion.button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-8 left-8 z-[9998] flex items-center justify-center w-14 h-14 rounded-full cursor-pointer border-none shadow-xl"
        style={{ background: "var(--belvo-accent, #9D4EDD)", color: "#fff" }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{ rotate: open ? 90 : 0 }}
      >
        {open ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed bottom-24 left-8 z-[9998] w-[360px] max-w-[calc(100vw-2rem)] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            style={{
              background: "var(--belvo-bg-card, #0D0A1A)",
              border: "1px solid var(--belvo-border-card, rgba(157,78,221,0.2))",
              maxHeight: "520px",
            }}
            initial={{ opacity: 0, scale: 0.9, y: 20, originX: 0, originY: 1 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          >
            <div
              className="flex items-center gap-3 px-5 py-4"
              style={{ background: "linear-gradient(135deg, #7B2FBE, #9D4EDD)" }}
            >
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm">
                B
              </div>
              <div>
                <div className="text-white font-semibold text-sm">BELVO Assistant</div>
                <div className="text-white/70 text-xs">Online</div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="ml-auto text-white/70 hover:text-white cursor-pointer bg-transparent border-none"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3" style={{ scrollbarWidth: "thin" }}>
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      msg.isUser
                        ? "rounded-br-md"
                        : "rounded-bl-md"
                    }`}
                    style={{
                      background: msg.isUser ? "#9D4EDD" : "var(--belvo-bg, #04000e)",
                      color: msg.isUser ? "#fff" : "var(--belvo-text-1, #f0e6ff)",
                      border: msg.isUser ? "none" : "1px solid var(--belvo-border-card, rgba(157,78,221,0.15))",
                    }}
                  >
                    {msg.text}
                    {msg.link && (
                      <a
                        href={msg.link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block mt-2 text-xs font-medium underline"
                        style={{ color: "#9D4EDD" }}
                      >
                        {msg.link.label} →
                      </a>
                    )}
                  </div>
                </div>
              ))}
              <div ref={endRef} />
            </div>

            <div className="px-4 py-3 border-t" style={{ borderColor: "var(--belvo-border-card, rgba(157,78,221,0.15))" }}>
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask me anything..."
                  className="flex-1 rounded-xl px-4 py-2.5 text-sm outline-none"
                  style={{
                    background: "var(--belvo-bg, #04000e)",
                    color: "var(--belvo-text-1, #f0e6ff)",
                    border: "1px solid var(--belvo-border-card, rgba(157,78,221,0.2))",
                  }}
                />
                <motion.button
                  onClick={handleSend}
                  className="rounded-xl w-10 h-10 flex items-center justify-center border-none cursor-pointer shrink-0"
                  style={{ background: "#9D4EDD", color: "#fff" }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
