import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.09, ease: [0.16, 1, 0.3, 1] as const },
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
  const panelId = `${id}-panel`;

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
        {/* Trigger Button */}
        <button
          id={id}
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
            padding: "22px 26px",
            background: "none",
            border: "none",
            cursor: "pointer",
            textAlign: "left",
            outline: "none",
          }}
          onFocus={(e) => {
            (e.currentTarget as HTMLButtonElement).style.outline =
              "2px solid rgba(157,78,221,0.5)";
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
              fontSize: "clamp(0.9rem, 2vw, 1rem)",
              color: "var(--belvo-text-1)",
              letterSpacing: "0.01em",
              lineHeight: 1.4,
              flex: 1,
            }}
          >
            {question}
          </span>

          {/* Animated Plus / Minus icon */}
          <span
            aria-hidden="true"
            style={{
              flexShrink: 0,
              width: "28px",
              height: "28px",
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
            {/* Horizontal bar */}
            <span
              style={{
                position: "absolute",
                width: "11px",
                height: "1.5px",
                background: isOpen ? "#9D4EDD" : "var(--belvo-text-3)",
                borderRadius: "2px",
                transition: "background 0.3s ease",
              }}
            />
            {/* Vertical bar (collapses when open) */}
            <span
              style={{
                position: "absolute",
                width: "1.5px",
                height: "11px",
                background: isOpen ? "#9D4EDD" : "var(--belvo-text-3)",
                borderRadius: "2px",
                transform: isOpen ? "rotate(90deg) scaleY(0)" : "rotate(0deg) scaleY(1)",
                transition: "transform 0.3s ease, background 0.3s ease",
              }}
            />
          </span>
        </button>

        {/* Collapsible Answer Panel */}
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              id={panelId}
              role="region"
              aria-labelledby={id}
              key="content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
              style={{ overflow: "hidden" }}
            >
              <div
                style={{
                  padding: "0 26px 24px",
                  borderTop: "1px solid rgba(130,40,200,0.12)",
                  paddingTop: "18px",
                }}
              >
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.9rem",
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

export default function FAQ() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [openId, setOpenId] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="faq"
      ref={ref}
      style={{
        background: "var(--belvo-bg)",
        position: "relative",
        overflow: "hidden",
        padding: "100px 24px 120px",
      }}
    >
      {/* Top divider line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background:
            "linear-gradient(90deg, transparent, var(--belvo-border-divider), rgba(201,163,65,0.2), transparent)",
        }}
      />

      {/* Ambient glow */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "65vw",
          height: "500px",
          background:
            "radial-gradient(ellipse at center, var(--belvo-glow-blob) 0%, transparent 70%)",
          filter: "blur(70px)",
          pointerEvents: "none",
        }}
      />

      {/* Ghost section number */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1.2, delay: 0.1 }}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: "clamp(8rem, 22vw, 18rem)",
          fontFamily: "'Inter', sans-serif",
          fontWeight: 900,
          color: "var(--belvo-ghost-num)",
          letterSpacing: "-0.06em",
          userSelect: "none",
          pointerEvents: "none",
          whiteSpace: "nowrap",
        }}
      >
        07
      </motion.div>

      <div
        style={{
          maxWidth: "780px",
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Heading */}
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          style={{ textAlign: "center", marginBottom: "64px" }}
        >
          <span
            style={{
              display: "block",
              fontSize: "0.7rem",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: "#9D4EDD",
              fontFamily: "'Inter', sans-serif",
              marginBottom: "16px",
            }}
          >
            Got Questions?
          </span>

          <h2
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 900,
              fontSize: "clamp(2rem, 5vw, 3.6rem)",
              lineHeight: 1.05,
              color: "var(--belvo-text-1)",
              margin: "0 0 20px",
            }}
          >
            Frequently Asked{" "}
            <span style={{ color: "#9D4EDD" }}>Questions</span>
          </h2>

          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.95rem",
              color: "var(--belvo-text-3)",
              lineHeight: 1.75,
              letterSpacing: "0.01em",
              maxWidth: "520px",
              margin: "0 auto",
            }}
          >
            Everything you need to know about Belvo. Can't find your answer?{" "}
            <button
              onClick={() =>
                document
                  .getElementById("book-a-call")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              style={{
                background: "none",
                border: "none",
                padding: 0,
                color: "#9D4EDD",
                fontFamily: "'Inter', sans-serif",
                fontSize: "inherit",
                cursor: "pointer",
                textDecoration: "underline",
                textDecorationColor: "rgba(157,78,221,0.4)",
                textUnderlineOffset: "3px",
              }}
            >
              Contact our team.
            </button>
          </p>
        </motion.div>

        {/* Accordion Items */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
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
    </section>
  );
}