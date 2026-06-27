import crypto from "crypto";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "belvo@2026";

export default async function handler(req, res) {
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
    let body = "";
    await new Promise((resolve) => {
      req.on("data", (chunk) => (body += chunk));
      req.on("end", resolve);
    });
    const { password } = JSON.parse(body);

    if (!password || password !== ADMIN_PASSWORD) {
      res.status(401).json({ success: false, message: "Invalid password" });
      return;
    }

    // Create a signed token: payload.signature
    const payload = Buffer.from(
      JSON.stringify({ user: "admin", exp: Date.now() + 8 * 60 * 60 * 1000 })
    ).toString("base64");
    const signature = crypto
      .createHmac("sha256", ADMIN_PASSWORD)
      .update(payload)
      .digest("hex");
    const token = payload + "." + signature;

    res.json({ success: true, token });
  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
}
