import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { Mail, Download, Phone } from "lucide-react";
import { CONTACT_TARGETS } from "@/lib/contact";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

const FAQ_ITEMS = [
  {
    id: "faq-1",
    question: "What is Belvo?",
    answer:
      "Belvo is an AI-powered platform that helps businesses streamline operations, automate workflows, and improve productivity through intelligent digital solutions.",
  },
  {
    id: "faq-2",
    question: "How do I get started?",
    answer:
      "Simply sign up, explore the platform, and book a demo if you'd like personalized guidance from our team.",
  },
  {
    id: "faq-3",
    question: "Is my data secure?",
    answer:
      "Absolutely. We use industry-standard security practices and encryption to protect your data and ensure privacy.",
  },
  {
    id: "faq-4",
    question: "Can I use Belvo for my business?",
    answer:
      "Yes. Belvo is designed for startups, small businesses, and enterprises looking to improve efficiency using modern technology.",
  },
  {
    id: "faq-5",
    question: "Do you offer customer support?",
    answer:
      "Yes. Our support team is available to assist you whenever you need help.",
  },
  {
    id: "faq-6",
    question: "How can I contact Belvo?",
    answer:
      "You can reach us through the Contact section or the information provided in the website footer.",
  },
];

const SOCIAL_LINKS = [
  {
    id: "email-info",
    label: "info.belvo@gmail.com",
    href: "mailto:info.belvo@gmail.com",
    icon: <Mail size={18} />,
  },
  {
    id: "email-contact",
    label: "contact.belvo@gmail.com",
    href: "mailto:contact.belvo@gmail.com",
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
    id: "phone-1",
    label: "+91 89284 66820",
    href: "tel:+918928466820",
    icon: <Phone size={18} />,
  },
  {
    id: "phone-2",
    label: "+91 98495 67122",
    href: "tel:+919849567122",
    icon: <Phone size={18} />,
  },
];

interface FAQItemProps {
  id: string;
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
  inView: boolean;
}

function FAQItem({ id, question, answer, isOpen, onToggle, index, inView }: FAQItemProps) {
  const panelId = `footer-${id}-panel`;
  const btnId = `footer-${id}`;

  return (
    <motion.div
      custom={index + 2}
      variants={fadeUp}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      <div
        style={{
          background: isOpen ? "var(--belvo-bg-card-2)" : "var(--belvo-bg-card)",
          border: `1px solid ${isOpen ? "rgba(157,78,221,0.35)" : "var(--belvo-border-card)"}`,
          borderRadius: "12px",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          overflow: "hidden",
          transition: "border-color 0.3s ease, background 0.3s ease, box-shadow 0.3s ease",
          boxShadow: isOpen
            ? "0 0 32px rgba(130,40,200,0.12), 0 4px 24px rgba(0,0,0,0.25)"
            : "0 2px 12px rgba(0,0,0,0.15)",
        }}
      >
        <button
          id={btnId}
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={onToggle}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onToggle();
            }
          }}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
            padding: "20px 24px",
            background: "none",
            border: "none",
            cursor: "pointer",
            textAlign: "left",
            outline: "none",
          }}
          onFocus={(e) => {
            (e.currentTarget as HTMLButtonElement).style.outline = "2px solid rgba(157,78,221,0.5)";
            (e.currentTarget as HTMLButtonElement).style.outlineOffset = "-2px";
          }}
          onBlur={(e) => {
            (e.currentTarget as HTMLButtonElement).style.outline = "none";
          }}
          onMouseEnter={(e) => {
            if (!isOpen) {
              const parent = e.currentTarget.closest("div") as HTMLElement;
              if (parent) parent.style.borderColor = "rgba(157,78,221,0.22)";
            }
          }}
          onMouseLeave={(e) => {
            if (!isOpen) {
              const parent = e.currentTarget.closest("div") as HTMLElement;
              if (parent) parent.style.borderColor = "var(--belvo-border-card)";
            }
          }}
        >
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              fontSize: "clamp(0.875rem, 1.8vw, 0.95rem)",
              color: "var(--belvo-text-1)",
              letterSpacing: "0.01em",
              lineHeight: 1.4,
              flex: 1,
            }}
          >
            {question}
          </span>

          <span
            aria-hidden="true"
            style={{
              flexShrink: 0,
              width: "26px",
              height: "26px",
              borderRadius: "50%",
              border: `1px solid ${isOpen ? "rgba(157,78,221,0.5)" : "var(--belvo-border-card)"}`,
              background: isOpen
                ? "linear-gradient(135deg, rgba(123,47,190,0.25), rgba(157,78,221,0.15))"
                : "var(--belvo-bg-btn-ghost)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.3s ease",
              position: "relative",
            }}
          >
            <span
              style={{
                position: "absolute",
                width: "10px",
                height: "1.5px",
                background: isOpen ? "#9D4EDD" : "var(--belvo-text-3)",
                borderRadius: "2px",
                transition: "background 0.3s ease",
              }}
            />
            <span
              style={{
                position: "absolute",
                width: "1.5px",
                height: "10px",
                background: isOpen ? "#9D4EDD" : "var(--belvo-text-3)",
                borderRadius: "2px",
                transform: isOpen ? "rotate(90deg) scaleY(0)" : "rotate(0deg) scaleY(1)",
                transition: "transform 0.3s ease, background 0.3s ease",
              }}
            />
          </span>
        </button>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              key="content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
              style={{ overflow: "hidden" }}
            >
              <div
                style={{
                  padding: "0 24px 22px",
                  borderTop: "1px solid rgba(130,40,200,0.12)",
                  paddingTop: "16px",
                }}
              >
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.875rem",
                    color: "var(--belvo-text-2)",
                    lineHeight: 1.75,
                    letterSpacing: "0.01em",
                    margin: 0,
                  }}
                >
                  {answer}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function Footer() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [openId, setOpenId] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <footer
      ref={ref}
      id="footer"
      style={{ background: "var(--belvo-bg)", position: "relative", overflow: "hidden" }}
    >
      {/* Top border line */}
      <div style={{
        height: "1px",
        background: "linear-gradient(90deg, transparent, var(--belvo-border-divider), rgba(201,163,65,0.25), transparent)",
      }} />

      {/* Ambient glow blob */}
      <div style={{
        position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "60vw", height: "300px",
        background: "radial-gradient(ellipse at center bottom, var(--belvo-glow-blob) 0%, transparent 70%)",
        filter: "blur(50px)", pointerEvents: "none",
      }} />

      {/* ── FAQ AREA ── */}
      <div
        id="faq"
        style={{
          maxWidth: "860px",
          margin: "0 auto",
          padding: "80px 24px 72px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* FAQ ambient glow */}
        <div style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "65vw",
          height: "400px",
          background: "radial-gradient(ellipse at center, var(--belvo-glow-blob) 0%, transparent 70%)",
          filter: "blur(70px)",
          pointerEvents: "none",
        }} />

        {/* FAQ Heading */}
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          style={{ textAlign: "center", marginBottom: "52px", position: "relative", zIndex: 1 }}
        >
          <span style={{
            display: "block",
            fontSize: "0.68rem",
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            color: "#9D4EDD",
            fontFamily: "'Inter', sans-serif",
            marginBottom: "14px",
          }}>
            Got Questions?
          </span>
          <h2 style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 900,
            fontSize: "clamp(1.8rem, 4.5vw, 3rem)",
            lineHeight: 1.05,
            color: "var(--belvo-text-1)",
            margin: "0 0 18px",
          }}>
            Frequently Asked{" "}
            <span style={{ color: "#9D4EDD" }}>Questions</span>
          </h2>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.9rem",
            color: "var(--belvo-text-3)",
            lineHeight: 1.75,
            letterSpacing: "0.01em",
            maxWidth: "480px",
            margin: "0 auto",
          }}>
            Everything you need to know about Belvo. Can't find your answer?{" "}
            <button
              onClick={() => document.getElementById("book-a-call")?.scrollIntoView({ behavior: "smooth" })}
              style={{
                background: "none", border: "none", padding: 0,
                color: "#9D4EDD", fontFamily: "'Inter', sans-serif",
                fontSize: "inherit", cursor: "pointer",
                textDecoration: "underline",
                textDecorationColor: "rgba(157,78,221,0.4)",
                textUnderlineOffset: "3px",
              }}
            >
              Contact our team.
            </button>
          </p>
        </motion.div>

        {/* Accordion */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", position: "relative", zIndex: 1 }}>
          {FAQ_ITEMS.map((item, index) => (
            <FAQItem
              key={item.id}
              id={item.id}
              question={item.question}
              answer={item.answer}
              isOpen={openId === item.id}
              onToggle={() => handleToggle(item.id)}
              index={index}
              inView={inView}
            />
          ))}
        </div>
      </div>

      {/* ── DIVIDER between FAQ and footer links ── */}
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "0 24px",
        position: "relative",
        zIndex: 1,
      }}>
        <div style={{
          height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(157,78,221,0.18), rgba(201,163,65,0.15), transparent)",
        }} />
      </div>

      {/* ── FOOTER LINKS AREA ── */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "64px 24px 48px", position: "relative", zIndex: 1 }}>
        <div style={{
          display: "flex", flexWrap: "wrap", gap: "48px",
          justifyContent: "space-between", alignItems: "flex-start",
          marginBottom: "56px",
        }}>

          {/* Brand */}
          <motion.div
            custom={10} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
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
            <motion.div custom={11} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} style={{ marginTop: "24px" }}>
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

          {/* Offices */}
          <motion.div
            custom={12} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
          >
            <p style={{
              fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase",
              color: "var(--belvo-text-4)", fontFamily: "'Inter', sans-serif",
              marginBottom: "20px",
            }}>Our Offices</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              {[
                { city: "Goregaon", label: "Mumbai, Maharashtra" },
                { city: "Mumbai", label: "Maharashtra, India" },
              ].map((office, i) => (
                <motion.div
                  key={office.city}
                  custom={i + 13} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
                  style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}
                >
                  <span style={{ color: "rgba(157,78,221,0.7)", display: "flex", marginTop: "2px", flexShrink: 0 }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="15" height="15">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                      <circle cx="12" cy="9" r="2.5" />
                    </svg>
                  </span>
                  <div>
                    <p style={{
                      fontFamily: "'Inter', sans-serif", fontSize: "0.875rem",
                      fontWeight: 600, color: "var(--belvo-text-2)",
                      margin: 0, letterSpacing: "0.01em",
                    }}>{office.city}</p>
                    <p style={{
                      fontFamily: "'Inter', sans-serif", fontSize: "0.78rem",
                      color: "var(--belvo-text-4)", margin: "2px 0 0",
                      letterSpacing: "0.02em",
                    }}>{office.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            custom={15} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
          >
            <p style={{
              fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase",
              color: "var(--belvo-text-4)", fontFamily: "'Inter', sans-serif",
              marginBottom: "20px",
            }}>Quick Links</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {[
                { label: "About", id: "about" },
                { label: "Services", id: "services" },
                { label: "Portfolio", id: "portfolio" },
                { label: "FAQ", id: "faq" },
                { label: "Book A Call", id: "book-a-call" },
              ].map((link, i) => (
                <motion.button
                  key={link.id}
                  custom={i + 16} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
                  onClick={() => document.getElementById(link.id)?.scrollIntoView({ behavior: "smooth" })}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "8px",
                    background: "none", border: "none", padding: 0, cursor: "pointer",
                    color: "var(--belvo-text-2)",
                    fontFamily: "'Inter', sans-serif", fontSize: "0.875rem",
                    letterSpacing: "0.01em", textAlign: "left",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#9D4EDD"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--belvo-text-2)"; }}
                >
                  <span style={{ color: "rgba(157,78,221,0.5)", fontSize: "0.6rem" }}>▶</span>
                  {link.label}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Social & Contact */}
          <motion.div
            custom={22} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
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
                  target={link.href.startsWith("tel") || link.href.startsWith("mailto") ? "_self" : "_blank"}
                  rel="noopener noreferrer"
                  data-testid={`link-footer-${link.id}`}
                  custom={i + 23} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
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
          custom={30} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
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
