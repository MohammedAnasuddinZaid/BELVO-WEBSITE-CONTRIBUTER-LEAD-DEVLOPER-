// Vercel Serverless Function — /api/ask
// Free-tier LLM fallback for unmatched chatbot questions.
// Supports Groq (llama-3.1-8b-instant) and Gemini (gemini-2.0-flash).
// Keys are read server-side only — never exposed to the client bundle.

// ── System prompt built from the same facts in chatbot-knowledge.ts ──────────
const SYSTEM_PROMPT = `You are the BELVO website assistant. BELVO is a premium full-service creative agency founded and led by CEO Hrishikesh Mishra, based in Goregaon, Mumbai, Maharashtra.

Key facts you may use:
- 14 services: SEO Digital Marketing, Brand Outreach & PR, Branding, Social Media Management, 3D & CGI, Animation & VFX, Graphics Designing, Web Development, E-Commerce Management, Performance Marketing, Influencer Marketing, App Development, Software Development, CRM & Automation.
- 100+ clients across 15+ industries including skincare, fashion, food, cafes, edtech, fintech, jewellery, interior design, travel, healthcare.
- Team: 30+ members across 7 departments (Web Dev, App Dev, Cyber Security, Business & Data Analytics, Graphic Designing, Content, Administration).
- Contact: contact.belvo@gmail.com, +91 89284 66820, Instagram @belvo_official, LinkedIn belvo.buzz, office in Goregaon Mumbai.
- Pricing is project-based: Under $1,000 / $1,000-$5,000 / $5,000-$10,000 / $10,000-$25,000 / $25,000+.
- Services page, Careers page (7 open roles), Blog (5 categories), Events (React Webinar, Flutter Workshop, Founders Meet-up).

Answer in 1–2 short sentences using ONLY these facts. If the answer is not in these facts, say you are not sure and suggest visiting the Contact page at the BELVO website. Never invent services, prices, team members, or clients not listed above.`;

// ── Provider implementations ──────────────────────────────────────────────────

async function callGroq(question, apiKey) {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: question },
      ],
      max_tokens: 80,
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Groq error ${response.status}: ${err}`);
  }

  const data = await response.json();
  const answer = data?.choices?.[0]?.message?.content?.trim();
  if (!answer) throw new Error("Groq returned empty answer");
  return answer;
}

async function callGemini(question, apiKey) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [{ role: "user", parts: [{ text: question }] }],
      generationConfig: {
        maxOutputTokens: 80,
        temperature: 0.3,
      },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini error ${response.status}: ${err}`);
  }

  const data = await response.json();
  const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  if (!answer) throw new Error("Gemini returned empty answer");
  return answer;
}

// ── Handler ───────────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  // CORS headers — same pattern as api/register.js
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

    const { question } = JSON.parse(body);

    if (!question || typeof question !== "string" || question.trim().length === 0) {
      res.status(400).json({ success: false, message: "question is required" });
      return;
    }

    const sanitizedQuestion = question.trim().slice(0, 300); // guard against giant inputs

    const groqKey = process.env.GROQ_API_KEY || "";
    const geminiKey = process.env.GEMINI_API_KEY || "";
    const provider = (process.env.AI_PROVIDER || "groq").toLowerCase();

    // If neither key is configured — graceful no-op; frontend will use static fallback
    if (!groqKey && !geminiKey) {
      res.status(200).json({ success: false, message: "no_ai_configured" });
      return;
    }

    let answer = null;
    let lastError = null;

    if (provider === "gemini") {
      // Primary: Gemini; secondary: Groq
      if (geminiKey) {
        try {
          answer = await callGemini(sanitizedQuestion, geminiKey);
        } catch (e) {
          lastError = e;
          console.warn("Gemini primary failed, trying Groq fallback:", e.message);
        }
      }
      if (!answer && groqKey) {
        try {
          answer = await callGroq(sanitizedQuestion, groqKey);
        } catch (e) {
          lastError = e;
          console.warn("Groq secondary failed:", e.message);
        }
      }
    } else {
      // Default: Groq primary; secondary: Gemini
      if (groqKey) {
        try {
          answer = await callGroq(sanitizedQuestion, groqKey);
        } catch (e) {
          lastError = e;
          console.warn("Groq primary failed, trying Gemini fallback:", e.message);
        }
      }
      if (!answer && geminiKey) {
        try {
          answer = await callGemini(sanitizedQuestion, geminiKey);
        } catch (e) {
          lastError = e;
          console.warn("Gemini secondary failed:", e.message);
        }
      }
    }

    if (answer) {
      res.status(200).json({ success: true, answer });
    } else {
      // Both providers failed — return graceful signal; frontend uses static fallback
      console.error("All AI providers failed. Last error:", lastError?.message);
      res.status(200).json({ success: false, message: "ai_unavailable" });
    }
  } catch (err) {
    console.error("ask handler error:", err);
    res.status(500).json({ success: false, message: "Something went wrong. Please try again." });
  }
}
