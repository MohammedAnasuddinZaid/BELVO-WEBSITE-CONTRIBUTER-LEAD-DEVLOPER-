import jwt from "jsonwebtoken";

function getJwtSecret() {
  return process.env.JWT_SECRET || "belvo-dev-secret-change-in-production";
}

export function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, getJwtSecret());
    req.user = decoded;
    next();
  } catch {
    return res.status(403).json({ success: false, message: "Invalid or expired token." });
  }
}

export function getJWTSecret() {
  return getJwtSecret();
}
