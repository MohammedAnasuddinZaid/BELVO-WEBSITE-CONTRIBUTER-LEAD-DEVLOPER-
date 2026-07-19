import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { smoothScrollToElement } from "@/lib/smoothScroll";

const easeOut = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.09, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

const FAQ_CATEGORIES = [
  {
    id: "about-belvo",
    title: "About Belvo",
    description: "Who we are, what we do, and what makes us different.",
    items: [
      { id: "faq-1", question: "What is Belvo?", answer: "Belvo is a full-service digital growth agency that helps businesses build their brand, scale their marketing, and compete globally. From branding and web development to performance marketing and social media, we handle every aspect of your digital presence." },
      { id: "faq-4", question: "Can Belvo work with businesses of any size?", answer: "Yes. We work with early-stage startups, scaling D2C brands, and established enterprises. Our engagement models are flexible — whether you need a one-time project or a long-term growth partner, we can structure something that fits." },
      { id: "faq-5", question: "What industries does Belvo specialise in?", answer: "We've delivered results across 15+ industries including e-commerce, fashion, skincare, F&B, EdTech, FinTech, healthcare, hospitality, and more. Our portfolio of 100+ brands speaks to the depth and breadth of our industry experience." },
      { id: "faq-25", question: "What makes Belvo different from other agencies?", answer: "Belvo is built on three pillars: strategy, creativity, and execution. Unlike agencies that focus on just one area, we provide end-to-end solutions under one roof. Our team is young, hungry, and constantly pushing boundaries. We treat every client as a true partner, not just a project number." },
      { id: "faq-26", question: "Do you support founders who are still validating their idea?", answer: "Absolutely. We often work with founders in the early validation stage to sharpen positioning, define messaging, and create a simple launch plan before investing heavily in design or growth." },
    ],
  },
  {
    id: "getting-started",
    title: "Getting Started",
    description: "How to begin your project and what to expect.",
    items: [
      { id: "faq-2", question: "How do I get started with Belvo?", answer: "Getting started is simple — book a free discovery call through our contact section. We'll learn about your business, goals, and challenges, then put together a tailored proposal within 48 hours. No pressure, no obligation." },
      { id: "faq-6", question: "How long does a typical project take?", answer: "Timelines vary by scope. A brand identity project typically takes 2–4 weeks. A full website design and development engagement runs 4–8 weeks. Performance marketing campaigns are set up within 1–2 weeks. We'll give you a clear timeline in your proposal." },
      { id: "faq-10", question: "How do I contact Belvo if I have more questions?", answer: "You can reach us through the Book a Free Call section on this page, or drop us a message via the contact details in the footer. Our team typically responds within 24 hours on business days." },
      { id: "faq-24", question: "How does Belvo handle revisions and feedback?", answer: "We build revision cycles into every project timeline. After each deliverable, we present it for your review and collect structured feedback. Typically, projects include 2-3 rounds of revisions. We use collaborative tools like Figma, Trello, and Slack to ensure feedback is clear, organized, and actionable." },
    ],
  },
  {
    id: "growth-services",
    title: "Growth & Marketing",
    description: "Performance marketing, SEO, social media, and content.",
    items: [
      { id: "faq-8", question: "What does Belvo's performance marketing service include?", answer: "Our performance marketing service covers paid advertising across Google, Meta, Instagram, and other relevant platforms. It includes campaign strategy, audience research, creative briefing, ad setup, continuous optimisation, and detailed monthly reporting with transparent ROAS tracking." },
      { id: "faq-12", question: "Does Belvo offer social media management?", answer: "Yes — social media management is one of our core services. We handle content creation, posting schedules, community management, engagement strategies, and growth tactics across Instagram, LinkedIn, Twitter, Facebook, and emerging platforms to ensure your brand stays relevant and top-of-mind." },
      { id: "faq-13", question: "What is influencer marketing and how does Belvo execute it?", answer: "Influencer marketing involves partnering with content creators and personalities who have engaged audiences aligned with your brand. Belvo identifies, vets, negotiates, and manages influencer campaigns — from nano to macro influencers — ensuring authentic collaborations that drive awareness, trust, and conversions." },
      { id: "faq-14", question: "Can Belvo help with SEO and organic growth?", answer: "Absolutely. Our SEO services include technical SEO audits, on-page optimization, keyword research, content strategy, link building, and performance tracking. We focus on sustainable organic growth that helps your website rank higher, attract quality traffic, and reduce dependency on paid ads." },
      { id: "faq-27", question: "Do you create ad creatives and landing pages too?", answer: "Yes. We can create campaign creatives, landing page copy, conversion-focused UI, and messaging systems that align with your paid strategy so the funnel feels consistent from click to conversion." },
    ],
  },
  {
    id: "design-development",
    title: "Design & Development",
    description: "Branding, web development, mobile apps, and product experiences.",
    items: [
      { id: "faq-9", question: "Can Belvo handle both design and development?", answer: "Yes — we're a full-service agency with in-house designers and developers. We build everything from brand identities and UI/UX designs to websites, mobile apps, and custom software. Having both under one roof means faster delivery and tighter collaboration between creative and technical teams." },
      { id: "faq-16", question: "What does a typical brand identity project include?", answer: "A full brand identity project at Belvo includes brand strategy and positioning, logo design (primary and secondary), color palette, typography system, brand guidelines document, stationery design, social media kit, and brand asset library. We ensure every element is cohesive and strategically aligned with your business goals." },
      { id: "faq-17", question: "How does Belvo approach web development?", answer: "We follow a structured process: discovery and requirements gathering, wireframing and UI/UX design, frontend and backend development, content integration, testing and QA, and deployment. We use modern tech stacks like React, Next.js, Node.js, and ensure every site is fully responsive, fast, and SEO-optimized." },
      { id: "faq-18", question: "Can Belvo develop mobile apps?", answer: "Yes — we design and develop native and cross-platform mobile applications using Flutter and React Native. Our app development services include concept validation, UI/UX design, development, testing, App Store/Play Store deployment, and post-launch support with regular updates." },
    ],
  },
  {
    id: "delivery-pricing",
    title: "Delivery & Pricing",
    description: "Pricing, retainers, reporting, and working with us day to day.",
    items: [
      { id: "faq-3", question: "Is my data secure when working with Belvo?", answer: "Absolutely. We follow industry-standard security practices across all projects. All client data, assets, and communications are handled with strict confidentiality, and we're happy to sign NDAs before any project begins." },
      { id: "faq-7", question: "Do you offer ongoing retainer services?", answer: "Yes — in fact, most of our clients move to monthly retainers after their initial project. Retainers cover ongoing social media management, performance marketing, content creation, SEO, or any combination of services your brand needs to keep growing." },
      { id: "faq-11", question: "What is the cost of Belvo's services?", answer: "Our pricing is project-based and varies depending on scope, complexity, and deliverables. We offer custom quotes tailored to each client's needs. During your free discovery call, we'll discuss your requirements and provide a transparent pricing proposal with no hidden fees." },
      { id: "faq-21", question: "How does Belvo measure success and report results?", answer: "We believe in transparent, data-backed reporting. Depending on the service, we track KPIs like website traffic, conversion rates, engagement metrics, ROAS, follower growth, brand mentions, and more. Clients receive detailed monthly reports with insights, learnings, and optimization recommendations for continuous improvement." },
    ],
  },
];

interface FAQQuestionProps {
  id: string;
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
  inView: boolean;
}

function FAQQuestionItem({ id, question, answer, isOpen, onToggle, index, inView }: FAQQuestionProps) {
  const panelId = `${id}-panel`;

  return (
    <motion.div
      custom={index + 2}
      variants={fadeUp}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      <motion.div
        whileHover={isOpen ? {} : { y: -2, borderColor: "rgba(157,78,221,0.25)", boxShadow: "0 4px 20px rgba(0,0,0,0.2)", transition: { duration: 0.2, ease: easeOut } }}
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
            padding: "16px 20px",
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
        >
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              fontSize: "clamp(0.88rem, 1.8vw, 0.95rem)",
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
              width: "24px",
              height: "24px",
              borderRadius: "50%",
              border: `1px solid ${isOpen ? "rgba(157,78,221,0.5)" : "var(--belvo-border-card)"}`,
              background: isOpen ? "linear-gradient(135deg, rgba(123,47,190,0.25), rgba(157,78,221,0.15))" : "var(--belvo-bg-btn-ghost)",
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
                width: "9px",
                height: "1.3px",
                background: isOpen ? "#9D4EDD" : "var(--belvo-text-3)",
                borderRadius: "2px",
                transition: "background 0.3s ease",
              }}
            />
            <span
              style={{
                position: "absolute",
                width: "1.3px",
                height: "9px",
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
              aria-labelledby={id}
              key="content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              style={{ overflow: "hidden" }}
            >
              <div style={{ padding: "0 20px 16px", borderTop: "1px solid rgba(130,40,200,0.12)", paddingTop: "12px" }}>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", color: "var(--belvo-text-2)", lineHeight: 1.75, letterSpacing: "0.01em", margin: 0 }}>
                  {answer}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

interface FAQCategoryBlockProps {
  category: (typeof FAQ_CATEGORIES)[number];
  isOpen: boolean;
  onToggle: () => void;
  activeFaqId: string | null;
  onToggleFaq: (faqId: string) => void;
  index: number;
  inView: boolean;
}

function FAQCategoryBlock({ category, isOpen, onToggle, activeFaqId, onToggleFaq, index, inView }: FAQCategoryBlockProps) {
  return (
    <motion.div
      custom={index + 1}
      variants={fadeUp}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(157,78,221,0.16)", borderRadius: "18px", overflow: "hidden", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
    >
      <button
        onClick={onToggle}
        style={{ width: "100%", padding: "20px 22px", background: "none", border: "none", textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}
      >
        <div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: "1rem", color: "var(--belvo-text-1)", marginBottom: "4px" }}>{category.title}</div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.84rem", color: "var(--belvo-text-3)", lineHeight: 1.5 }}>{category.description}</div>
        </div>
        <span style={{ width: "32px", height: "32px", borderRadius: "50%", background: isOpen ? "linear-gradient(135deg, rgba(123,47,190,0.25), rgba(157,78,221,0.15))" : "var(--belvo-bg-btn-ghost)", border: "1px solid rgba(157,78,221,0.24)", display: "flex", alignItems: "center", justifyContent: "center", color: "#9D4EDD", fontSize: "1rem", fontWeight: 700 }}>
          {isOpen ? "−" : "+"}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: "hidden", borderTop: "1px solid rgba(157,78,221,0.12)" }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "14px" }}>
              {category.items.map((item, itemIndex) => (
                <FAQQuestionItem
                  key={item.id}
                  id={item.id}
                  question={item.question}
                  answer={item.answer}
                  isOpen={activeFaqId === item.id}
                  onToggle={() => onToggleFaq(item.id)}
                  index={itemIndex}
                  inView={inView}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [openCategory, setOpenCategory] = useState<string | null>("about-belvo");
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  const handleToggleCategory = (id: string) => {
    setOpenCategory((prev) => (prev === id ? null : id));
    setOpenFaqId(null);
  };

  const handleToggleFaq = (id: string) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="faq"
      ref={ref}
      style={{
        background: "var(--belvo-bg)",
        position: "relative",
        overflow: "hidden",
        padding: "80px 24px 80px",
      }}
    >
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
          08
        </motion.div>

        <div
          style={{
            maxWidth: "780px",
            margin: "0 auto",
            position: "relative",
            zIndex: 1,
          }}
        >
          <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          style={{ textAlign: "center", marginBottom: "52px" }}
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
              onClick={() => smoothScrollToElement("book-a-call")}
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

        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {FAQ_CATEGORIES.map((category, index) => (
            <FAQCategoryBlock
              key={category.id}
              category={category}
              isOpen={openCategory === category.id}
              onToggle={() => handleToggleCategory(category.id)}
              activeFaqId={openFaqId}
              onToggleFaq={handleToggleFaq}
              index={index}
              inView={inView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
