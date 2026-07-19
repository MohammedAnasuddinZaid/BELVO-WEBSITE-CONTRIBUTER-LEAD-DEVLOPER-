import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import multer from "multer";
import { TOOLS_CATALOG } from "./data/tools.js";
import { authenticateToken, getJWTSecret } from "./middleware/auth.js";
import { supabase, isDbReady } from "./db.js";

const app = express();
const PORT = process.env.PORT || 3001;

// ── Middleware ──────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ── Multer setup for image uploads ─────────────────────
const storage = multer.diskStorage({
  destination: path.join(__dirname, "uploads"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `member-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG, WebP, and GIF images are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// ── Admin credentials ─────────────────────────────────
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "belvo@2024";

// ── Auth Routes ────────────────────────────────────────
app.post("/admin/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: "Username and password are required" });
    }

    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { username, role: "admin" },
      getJWTSecret(),
      { expiresIn: "7d" }
    );

    res.json({ success: true, token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// ── Health Check ───────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    db: isDbReady() ? "connected" : "not configured",
    timestamp: new Date().toISOString(),
  });
});

// ── Team Routes ────────────────────────────────────────

// GET /api/team — List all members
app.get("/api/team", async (req, res) => {
  try {
    if (!isDbReady()) {
      return res.status(500).json({ success: false, message: "Database not configured" });
    }

    const { data, error } = await supabase
      .from("team_members")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });

    if (error) throw error;

    res.json({ success: true, members: data });
  } catch (err) {
    console.error("GET /api/team error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch team members" });
  }
});

// ── Tools Registration ──────────────────────────────────
app.post("/api/tools-register", async (req, res) => {
  try {
    const { toolId, name, email, whatsapp } = req.body;

    if (!toolId || !name || !email || !whatsapp) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!isDbReady()) {
      return res.status(500).json({
        success: false,
        message: "Database not configured",
      });
    }

    const selectedTool = TOOLS_CATALOG[toolId];

    if (!selectedTool || !selectedTool.active) {
      return res.status(400).json({
        success: false,
        message: "Invalid or unavailable tool",
      });
    }

    const { data, error } = await supabase
      .from("tool_orders")
      .insert([
        {
          customer_name: name.trim(),
          customer_email: email.trim().toLowerCase(),
          whatsapp: whatsapp.trim(),

          tool_name: selectedTool.name,
          plan_name: selectedTool.plan,

          amount: selectedTool.amount,
          currency: selectedTool.currency,

          payment_status: "pending",
          fulfilment_status: "pending",
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json({
      success: true,
      message: "Registration received",
      order: {
        id: data.id,
        toolId: selectedTool.id,
        toolName: data.tool_name,
        planName: data.plan_name,
        amount: data.amount,
        currency: data.currency,
        paymentStatus: data.payment_status,
        fulfilmentStatus: data.fulfilment_status,
      },
    });
  } catch (err) {
    console.error("POST /api/tools-register error:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to save registration",
    });
  }
});

// POST /api/departments — Create a department
app.post("/api/departments", authenticateToken, async (req, res) => {
  try {
    if (!isDbReady()) {
      return res.status(500).json({ success: false, message: "Database not configured" });
    }

    const { id, name, color, lightColor, sortOrder } = req.body;

    if (!id || !name) {
      return res.status(400).json({ success: false, message: "ID and name are required" });
    }

    const { data, error } = await supabase
      .from("departments")
      .insert([{
        id,
        name,
        color: color || "#7B2FBE",
        light_color: lightColor || color || "#9D4EDD",
        sort_order: sortOrder || 0,
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ success: true, department: data });
  } catch (err) {
    console.error("POST /api/departments error:", err);
    res.status(500).json({ success: false, message: "Failed to create department" });
  }
});

// PUT /api/departments/:id — Update a department
app.put("/api/departments/:id", authenticateToken, async (req, res) => {
  try {
    if (!isDbReady()) {
      return res.status(500).json({ success: false, message: "Database not configured" });
    }

    const { id } = req.params;
    const { name, color, lightColor, sortOrder } = req.body;

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (color !== undefined) updates.color = color;
    if (lightColor !== undefined) updates.light_color = lightColor;
    if (sortOrder !== undefined) updates.sort_order = sortOrder;
    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("departments")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ success: false, message: "Department not found" });
    }

    res.json({ success: true, department: data });
  } catch (err) {
    console.error("PUT /api/departments/:id error:", err);
    res.status(500).json({ success: false, message: "Failed to update department" });
  }
});

// DELETE /api/departments/:id — Delete a department
app.delete("/api/departments/:id", authenticateToken, async (req, res) => {
  try {
    if (!isDbReady()) {
      return res.status(500).json({ success: false, message: "Database not configured" });
    }

    const { id } = req.params;

    // Check if department has members
    const { count } = await supabase
      .from("team_members")
      .select("*", { count: "exact", head: true })
      .eq("team_id", id);

    if (count && count > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete — ${count} member(s) still in this department`,
      });
    }

    const { error } = await supabase
      .from("departments")
      .delete()
      .eq("id", id);

    if (error) throw error;

    res.json({ success: true, message: "Department deleted" });
  } catch (err) {
    console.error("DELETE /api/departments/:id error:", err);
    res.status(500).json({ success: false, message: "Failed to delete department" });
  }
});

// ── Upload Route ───────────────────────────────────────

app.post("/api/upload", authenticateToken, (req, res) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({ success: false, message: "File too large. Max 5MB." });
        }
        return res.status(400).json({ success: false, message: err.message });
      }
      return res.status(400).json({ success: false, message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const url = `/uploads/${req.file.filename}`;
    res.json({ success: true, url });
  });
});

// ── Error handling ─────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ success: false, message: "Internal server error" });
});

// ── Start ──────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n  ✦ BELVO API server running on http://localhost:${PORT}`);
  console.log(`  ✦ Database: ${isDbReady() ? "✅ Connected" : "⚠️  Not configured (set Supabase env vars)"}`);
  console.log(`  ✦ Health:   http://localhost:${PORT}/api/health\n`);
});
