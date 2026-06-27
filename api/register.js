// Vercel Serverless Function — /api/register
// Saves event registration to Supabase + sends email notification

import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";

const EVENTS = {
  1: "React Free Webinar",
  2: "Flutter Workshop",
  3: "Founders Meet-up",
};

export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ success: false, message: "Method not allowed" });
    return;
  }

  try {
    // Parse body
    let body = "";
    await new Promise((resolve) => {
      req.on("data", (chunk) => (body += chunk));
      req.on("end", resolve);
    });
    const { eventId, name, email, whatsapp } = JSON.parse(body);

    // Validate
    if (!eventId || !name || !email || !whatsapp) {
      res.status(400).json({ success: false, message: "All fields are required" });
      return;
    }

    const eventTitle = EVENTS[eventId] || `Event #${eventId}`;
    const timestamp = new Date().toISOString();

    // ── 1. Save to Supabase ──────────────────────────────
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      await supabase.from("book_calls").insert([{
        type: "event-registration",
        created_at: timestamp,
        full_name: name,
        email: email,
        message: `Registered for ${eventTitle} (ID: ${eventId}) | WhatsApp: ${whatsapp}`,
      }]);
    }

    // ── 2. Send email notification ───────────────────────
    // Falls back to embedded values for now. Override via Vercel env vars anytime.
    const smtpUser = process.env.SMTP_USER || "amalakotaakhil@gmail.com";
    const smtpPass = process.env.SMTP_PASS || "wher wadf jzdr vhwb";
    const notifyEmail = process.env.NOTIFY_EMAIL || "amalakotaakhil@gmail.com";

    if (smtpUser && smtpPass && notifyEmail) {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: { user: smtpUser, pass: smtpPass },
      });

      await transporter.sendMail({
        from: `"Belvo Registrations" <${smtpUser}>`,
        to: notifyEmail,
        subject: `New Registration — ${name} for ${eventTitle}`,
        html: `
          <div style="font-family: Inter, Arial; max-width:560px; margin:auto; background:#fff; border-radius:16px; overflow:hidden; box-shadow:0 2px 12px rgba(0,0,0,0.08);">
            <div style="background:linear-gradient(135deg,#7B2FBE,#9D4EDD); padding:32px 28px; text-align:center;">
              <h1 style="margin:0; color:#fff; font-size:22px;">New Event Registration</h1>
              <p style="margin:6px 0 0; color:rgba(255,255,255,0.75); font-size:13px;">${eventTitle}</p>
            </div>
            <div style="padding:28px;">
              <table style="width:100%; border-collapse:collapse;">
                <tr><td style="padding:10px 0; font-size:12px; color:#888; text-transform:uppercase; letter-spacing:0.1em;">Name</td></tr>
                <tr><td style="padding:0 0 16px; font-size:16px; font-weight:600; color:#222;">${name}</td></tr>
                <tr><td style="padding:10px 0; font-size:12px; color:#888; text-transform:uppercase; letter-spacing:0.1em; border-top:1px solid #eee;">Email</td></tr>
                <tr><td style="padding:0 0 16px; font-size:16px; font-weight:600; color:#222;">${email}</td></tr>
                <tr><td style="padding:10px 0; font-size:12px; color:#888; text-transform:uppercase; letter-spacing:0.1em; border-top:1px solid #eee;">WhatsApp</td></tr>
                <tr><td style="padding:0 0 16px; font-size:16px; font-weight:600; color:#222;">${whatsapp}</td></tr>
                <tr><td style="padding:10px 0; font-size:12px; color:#888; text-transform:uppercase; letter-spacing:0.1em; border-top:1px solid #eee;">Time</td></tr>
                <tr><td style="padding:0 0 16px; font-size:16px; font-weight:600; color:#222;">${new Date(timestamp).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</td></tr>
              </table>
            </div>
            <div style="text-align:center; padding:16px; background:#fafafa; font-size:12px; color:#aaa;">BELVO — belvo.buzz</div>
          </div>
        `,
      });
    }

    res.status(201).json({
      success: true,
      message: "Registration successful!",
      registration: { name, eventTitle, registeredAt: timestamp },
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ success: false, message: "Something went wrong. Please try again." });
  }
}
