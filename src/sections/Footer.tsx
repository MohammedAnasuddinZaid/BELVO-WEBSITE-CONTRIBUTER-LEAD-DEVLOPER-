import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Mail, Download } from "lucide-react";
import { CONTACT_TARGETS, COMPANY_EMAIL } from "@/lib/contact";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

const SOCIAL_LINKS = [
  {
    id: "whatsapp",
    label: "WhatsApp",
    href: CONTACT_TARGETS.whatsappCommunityUrl,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.134.558 4.133 1.535 5.866L.057 23.571a.75.75 0 0 0 .92.921l5.796-1.485A11.946 11.946 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.9 0-3.7-.497-5.267-1.37l-.378-.214-3.926 1.006 1.019-3.832-.234-.393A9.955 9.955 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
      </svg>
    ),
  },
  {
    id: "email",
    label: COMPANY_EMAIL,
    href: `mailto:${COMPANY_EMAIL}`,
    icon: <Mail size={18} />,
  },
  {
    id: "instagram",
    label: "Instagram",
    href: CONTACT_TARGETS.instagramUrl,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: CONTACT_TARGETS.linkedinUrl,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    id: "whatsapp-community",
    label: "WhatsApp Community",
    href: CONTACT_TARGETS.whatsappCommunityUrl,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.134.558 4.133 1.535 5.866L.057 23.571a.75.75 0 0 0 .92.921l5.796-1.485A11.946 11.946 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.9 0-3.7-.497-5.267-1.37l-.378-.214-3.926 1.006 1.019-3.832-.234-.393A9.955 9.955 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
      </svg>
    ),
  },
];

export default function Footer() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <footer
      ref={ref}
      id="footer"
      style={{ background: "var(--belvo-bg)", position: "relative", overflow: "hidden" }}
    >
      <div style={{
        height: "1px",
        background: "linear-gradient(90deg, transparent, var(--belvo-border-divider), rgba(201,163,65,0.25), transparent)",
      }} />

      <div style={{
        position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "60vw", height: "300px",
        background: "radial-gradient(ellipse at center bottom, var(--belvo-glow-blob) 0%, transparent 70%)",
        filter: "blur(50px)", pointerEvents: "none",
      }} />

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "72px 24px 48px", position: "relative", zIndex: 1 }}>
        <div style={{
          display: "flex", flexWrap: "wrap", gap: "48px",
          justifyContent: "space-between", alignItems: "flex-start",
          marginBottom: "56px",
        }}>
          {/* Brand */}
          <motion.div
            custom={0} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
            style={{ maxWidth: "320px" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
              <img src="/belvo-logo-transparent.png" alt="BELVO" style={{ height: "32px", width: "auto" }} />
              <span style={{
                fontFamily: "'Inter', sans-serif", fontWeight: 700,
                fontSize: "1.1rem", letterSpacing: "0.2em",
                color: "var(--belvo-text-1)", textTransform: "uppercase",
              }}>BELVO</span>
            </div>
            <p style={{
              fontFamily: "'Inter', sans-serif", fontSize: "0.875rem",
              color: "var(--belvo-text-3)", lineHeight: 1.7, letterSpacing: "0.01em",
            }}>
              We build brands that dominate. Premium creative agency helping
              businesses scale globally and compete at the highest level.
            </p>
            <motion.div custom={1} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} style={{ marginTop: "24px" }}>
              <button
                disabled
                data-testid="button-download-portfolio"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  padding: "10px 22px",
                  background: "var(--belvo-bg-btn-ghost)",
                  border: "1px solid var(--belvo-border-card)",
                  borderRadius: "8px",
                  color: "var(--belvo-text-4)",
                  fontFamily: "'Inter', sans-serif", fontWeight: 500,
                  fontSize: "0.78rem", letterSpacing: "0.14em",
                  textTransform: "uppercase", cursor: "not-allowed",
                }}
              >
                <Download size={13} />
                Portfolio — Coming Soon
              </button>
            </motion.div>
          </motion.div>

          {/* Social */}
          <motion.div
            custom={2} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
          >
            <p style={{
              fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase",
              color: "var(--belvo-text-4)", fontFamily: "'Inter', sans-serif",
              marginBottom: "20px",
            }}>Connect With Us</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {SOCIAL_LINKS.map((link, i) => (
                <motion.a
                  key={link.id}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid={`link-footer-${link.id}`}
                  custom={i + 3} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "12px",
                    color: "var(--belvo-text-2)",
                    fontFamily: "'Inter', sans-serif", fontSize: "0.875rem",
                    letterSpacing: "0.01em", textDecoration: "none",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#9D4EDD"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--belvo-text-2)"; }}
                >
                  <span style={{ color: "rgba(157,78,221,0.7)", display: "flex" }}>{link.icon}</span>
                  {link.label}
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <motion.div
          custom={9} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
          style={{
            paddingTop: "28px",
            borderTop: "1px solid var(--belvo-border-bottom)",
            display: "flex", flexWrap: "wrap", gap: "12px",
            justifyContent: "space-between", alignItems: "center",
          }}
        >
          <span style={{
            fontFamily: "'Inter', sans-serif", fontSize: "0.78rem",
            color: "var(--belvo-text-4)", letterSpacing: "0.04em",
          }}>
            © {new Date().getFullYear()} BELVO. All rights reserved.
          </span>
          <span style={{
            fontFamily: "'Inter', sans-serif", fontSize: "0.78rem",
            color: "rgba(157,78,221,0.45)", letterSpacing: "0.04em",
          }}>
            Growth Core
          </span>
        </motion.div>
      </div>
    </footer>
  );
}
