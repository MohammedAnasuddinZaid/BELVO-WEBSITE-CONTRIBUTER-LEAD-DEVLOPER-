import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "belvo@2026";

function verifyToken(token) {
  try {
    const [payload, signature] = token.split(".");
    if (!payload || !signature) return null;

    const expected = crypto
      .createHmac("sha256", ADMIN_PASSWORD)
      .update(payload)
      .digest("hex");
    if (signature !== expected) return null;

    const { exp } = JSON.parse(Buffer.from(payload, "base64").toString());
    if (Date.now() > exp) return null;

    return true;
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "GET") {
    res.status(405).json({ success: false, message: "Method not allowed" });
    return;
  }

  // Verify auth
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token || !verifyToken(token)) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return;
  }

  try {
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      res.status(500).json({ success: false, message: "Supabase not configured" });
      return;
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase
      .from("book_calls")
      .select("*")
      .eq("type", "event-registration")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase fetch error:", error);
      res.status(500).json({ success: false, message: "Failed to fetch registrations" });
      return;
    }

    res.json({ success: true, registrations: data || [] });
  } catch (err) {
    console.error("Admin registrations error:", err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
}
