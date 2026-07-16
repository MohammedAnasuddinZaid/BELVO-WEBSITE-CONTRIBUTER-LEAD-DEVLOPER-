/**
 * useVoiceAssistant — Web Speech API (zero npm deps, no async speak).
 *
 * The critical Chrome rules this implementation respects:
 *  1. speechSynthesis.speak() MUST be called synchronously — making it async breaks it.
 *  2. Voices load asynchronously; we cache them at module level via voiceschanged.
 *  3. Cancel any in-flight utterance before speaking a new one.
 */

import { useState, useCallback, useRef, useEffect } from "react";

// ── Global type shims ─────────────────────────────────────────────────────────
declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
  }
}

// ── Feature detection ─────────────────────────────────────────────────────────
const SR_CTOR: (new () => SpeechRecognition) | null =
  typeof window !== "undefined"
    ? (window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null)
    : null;

const SS_SUPPORTED =
  typeof window !== "undefined" && "speechSynthesis" in window;

// ── Module-level voice cache (survives re-renders, loads once) ───────────────
// This is the key fix: voices are cached at module level so speak() stays sync.
let _cachedVoices: SpeechSynthesisVoice[] = [];

if (SS_SUPPORTED) {
  const syncVoices = () => {
    const v = window.speechSynthesis.getVoices();
    if (v.length > 0) _cachedVoices = v;
  };
  syncVoices(); // try immediately (works in Firefox, some Safari)
  window.speechSynthesis.addEventListener("voiceschanged", syncVoices); // Chrome fires this async
}

// ── Pick best English voice ───────────────────────────────────────────────────
function pickVoice(): SpeechSynthesisVoice | null {
  if (!_cachedVoices.length) return null;
  // Priority: en-IN local > en-US local > any en-* local > any en-*
  return (
    _cachedVoices.find((v) => v.lang === "en-IN" && v.localService) ??
    _cachedVoices.find((v) => v.lang === "en-US" && v.localService) ??
    _cachedVoices.find((v) => v.lang.startsWith("en-") && v.localService) ??
    _cachedVoices.find((v) => v.lang.startsWith("en-")) ??
    _cachedVoices[0]
  );
}

// ── Strip markdown before TTS ─────────────────────────────────────────────────
function stripMarkdown(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // [label](url) → label
    .replace(/https?:\/\/\S+/g, "link")       // bare URLs → "link"
    .replace(/[*_`~>#]/g, "")                 // markdown symbols
    .replace(/\n+/g, ". ")                    // newlines → pause
    .replace(/\s{2,}/g, " ")
    .trim();
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export interface UseVoiceAssistantReturn {
  speechRecognitionSupported: boolean;
  speechSynthesisSupported: boolean;
  isListening: boolean;
  isMuted: boolean;
  voiceError: string | null;
  startListening: (
    onInterim: (transcript: string) => void,
    onFinal: (transcript: string) => void
  ) => void;
  stopListening: () => void;
  speak: (text: string) => void;
  cancelSpeech: () => void;
  toggleMute: () => void;
}

export function useVoiceAssistant(): UseVoiceAssistantReturn {
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [langFallback, setLangFallback] = useState(false);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  // Ref mirrors state so speak() (which has [] deps) can read the current value
  const isMutedRef = useRef(false);

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  // Cleanup
  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
      if (SS_SUPPORTED) window.speechSynthesis.cancel();
    };
  }, []);

  // ── cancelSpeech ─────────────────────────────────────────────────────────────
  const cancelSpeech = useCallback(() => {
    if (SS_SUPPORTED) window.speechSynthesis.cancel();
  }, []);

  // ── speak — MUST remain synchronous so Chrome allows it ──────────────────────
  const speak = useCallback((text: string) => {
    if (!SS_SUPPORTED) return;
    if (isMutedRef.current) return;

    const clean = stripMarkdown(text);
    if (!clean) return;

    // Cancel any in-flight utterance first
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(clean);

    // Assign the best available voice (uses module-level cache, loaded by voiceschanged)
    const voice = pickVoice();
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else {
      utterance.lang = "en-IN"; // let browser pick a default
    }

    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    window.speechSynthesis.speak(utterance);
  }, []); // stable ref — reads isMutedRef and _cachedVoices (both external refs)

  // ── toggleMute ───────────────────────────────────────────────────────────────
  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      if (next && SS_SUPPORTED) window.speechSynthesis.cancel();
      return next;
    });
  }, []);

  // ── stopListening ─────────────────────────────────────────────────────────────
  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  // ── startListening ────────────────────────────────────────────────────────────
  const startListening = useCallback(
    (
      onInterim: (transcript: string) => void,
      onFinal: (transcript: string) => void
    ) => {
      if (!SR_CTOR) return;

      // Stop any in-flight speech so it doesn't interfere with mic
      if (SS_SUPPORTED) window.speechSynthesis.cancel();

      recognitionRef.current?.abort();
      setVoiceError(null);

      const recognition = new SR_CTOR();
      recognition.lang = langFallback ? "en-US" : "en-IN";
      recognition.interimResults = true;
      recognition.continuous = false;
      recognition.maxAlternatives = 1;

      recognitionRef.current = recognition;
      setIsListening(true);

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interim = "";
        let final = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const t = event.results[i][0].transcript;
          if (event.results[i].isFinal) final += t;
          else interim += t;
        }
        if (interim) onInterim(interim);
        if (final) onFinal(final.trim());
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        setIsListening(false);
        recognitionRef.current = null;
        switch (event.error) {
          case "no-speech":
            setVoiceError("No speech detected — please try again.");
            break;
          case "not-allowed":
          case "service-not-allowed":
            setVoiceError("Mic access denied — allow it in browser settings.");
            break;
          case "language-not-supported":
            if (!langFallback) setLangFallback(true);
            else setVoiceError("Voice input not supported in this browser.");
            break;
          case "network":
            setVoiceError("Network error with speech recognition.");
            break;
          default:
            setVoiceError("Voice input error — please type instead.");
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        recognitionRef.current = null;
      };

      try {
        recognition.start();
      } catch {
        setIsListening(false);
        setVoiceError("Could not start voice input — please type instead.");
      }
    },
    [langFallback]
  );

  return {
    speechRecognitionSupported: !!SR_CTOR,
    speechSynthesisSupported: SS_SUPPORTED,
    isListening,
    isMuted,
    voiceError,
    startListening,
    stopListening,
    speak,
    cancelSpeech,
    toggleMute,
  };
}
