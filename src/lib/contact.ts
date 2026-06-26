export const COMPANY_EMAIL = "contact.belvo@gmail.com";

type ContactTargets = {
  founderWhatsappNumber: string;
  instagramUrl: string;
  linkedinUrl: string;
  whatsappCommunityUrl: string;
  portfolioUrl: string;
};

export const CONTACT_TARGETS: ContactTargets = {
  founderWhatsappNumber: "",
  instagramUrl: "https://www.instagram.com/belvo_official/",
  linkedinUrl: "https://www.linkedin.com/company/belvo.buzz/",
  whatsappCommunityUrl: "https://chat.whatsapp.com/Is2DmjNcycI8vK7hJaWEaL?s=cl&p=a&ilr=4&amv=3",
  portfolioUrl: "",
};

export type SubmissionKind = "career-application" | "free-call";

type SubmissionRecord = {
  id: string;
  type: SubmissionKind;
  createdAt: string;
  payload: Record<string, string>;
};

const STORAGE_KEY = "belvo-form-submissions";

function createSubmissionId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `belvo-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function normalizePayload(payload: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(payload).map(([key, value]) => [key, String(value ?? "")]),
  );
}

export function saveSubmission(type: SubmissionKind, payload: Record<string, unknown>) {
  if (typeof window === "undefined") {
    return null;
  }

  const record: SubmissionRecord = {
    id: createSubmissionId(),
    type,
    createdAt: new Date().toISOString(),
    payload: normalizePayload(payload),
  };

  try {
    const existing = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    const submissions = Array.isArray(existing) ? existing : [];
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([record, ...submissions].slice(0, 75)));
  } catch {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([record]));
  }

  return record.id;
}

export function composeMailto(subject: string, bodyLines: string[]) {
  const body = bodyLines.filter(Boolean).join("\n");

  return `mailto:${COMPANY_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function openEmailDraft(subject: string, bodyLines: string[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.location.href = composeMailto(subject, bodyLines);
}

export function openFounderWhatsAppDraft(message: string) {
  if (typeof window === "undefined" || !CONTACT_TARGETS.founderWhatsappNumber) {
    return false;
  }

  const phone = CONTACT_TARGETS.founderWhatsappNumber.replace(/[^\d]/g, "");
  if (!phone) {
    return false;
  }

  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  return true;
}
