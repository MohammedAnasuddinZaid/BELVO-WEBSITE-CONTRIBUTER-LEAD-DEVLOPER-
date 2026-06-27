export const COMPANY_EMAIL = "contact.belvo@gmail.com";
import { supabase } from "./supabase";

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

export async function saveSubmission(
  type: SubmissionKind,
  payload: Record<string, unknown>
) {
  const record = {
    type,
    created_at: new Date().toISOString(),

    full_name: String(payload.fullName ?? ""),
    email: String(payload.email ?? ""),
    company: String(payload.company ?? ""),
    budget: String(payload.budget ?? ""),
    project_type: String(payload.projectType ?? ""),
    message: String(payload.message ?? ""),
  };

  const { data, error } = await supabase
    .from("book_calls")
    .insert([record]);

  if (error) {
    console.error(error);
    throw error;
  }

  return data;
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
