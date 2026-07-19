import { useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
import ServiceDialog from "@/components/ServiceDialog";
import { SERVICES as SERVICE_ITEMS, type ServiceItem } from "@/content/services";
import { useTheme } from "@/contexts/ThemeContext";

interface Props {
  id: string;
}

const SERVICES = [
  { id: "seo-digital-marketing", category: "SEO Digital Marketing", keywords: ["SEO", "organic growth", "search ranking", "keyword strategy", "on-page/off-page"], desc: "We optimize your digital presence to rank higher on search engines. From keyword research to technical SEO and link building, we drive sustainable organic traffic that converts." },
  { id: "brand-outreach-pr", category: "Brand Outreach & PR", keywords: ["public relations", "brand awareness", "media coverage", "press", "outreach"], desc: "We craft compelling narratives and pitch your brand to the right publications and media houses — building credibility and expanding your brand's reach in the right circles." },
  { id: "branding", category: "Branding", keywords: ["brand identity", "logo", "brand guide", "visual language", "positioning"], desc: "From naming and logo design to a complete brand identity system, we build brands that are memorable, consistent, and strategically positioned for long-term growth." },
  { id: "social-media", category: "Social Media", keywords: ["content creation", "social strategy", "community management", "Instagram", "LinkedIn"], desc: "We manage and grow your social media presence with a data-driven content strategy — combining creative storytelling with platform-specific tactics to build loyal communities." },
  { id: "3d-cgi", category: "3D & CGI", keywords: ["3D rendering", "CGI", "product visualization", "architectural renders", "3D animation"], desc: "We create hyper-realistic 3D visuals and CGI content for products, architecture, ads, and campaigns — enabling stunning visuals before anything is physically built." },
  { id: "animation-vfx", category: "Animation & VFX", keywords: ["motion graphics", "visual effects", "2D/3D animation", "explainer videos"], desc: "From sleek motion graphics to full visual effects pipelines, we bring your stories to life through animation and VFX that captivate and communicate at the highest level." },
  { id: "graphics-designing", category: "Graphics Designing", keywords: ["graphic design", "visual content", "marketing creatives", "UI graphics", "print"], desc: "Our designers produce impactful visual content — from marketing creatives and social graphics to packaging and print — all aligned with your brand identity." },
  { id: "web-development", category: "Web Development", keywords: ["website design", "frontend", "backend", "responsive", "CMS", "custom web apps"], desc: "We build fast, beautiful, and fully responsive websites and web applications using modern tech stacks — engineered for performance, SEO, and exceptional user experience." },
  { id: "ecommerce-management", category: "E-Commerce Management", keywords: ["e-commerce", "Shopify", "WooCommerce", "product listings", "conversion rate", "store management"], desc: "End-to-end e-commerce solutions — from store setup and product management to CRO and scaling. We manage your online store so you can focus on growing your business." },
  { id: "performance-marketing", category: "Performance Marketing", keywords: ["paid ads", "Google Ads", "Meta Ads", "ROI", "ROAS", "PPC", "conversion campaigns"], desc: "We run data-driven paid media campaigns across Google, Meta, and beyond — optimizing every rupee spent for maximum ROI with transparent reporting and rapid iteration." },
  { id: "influencer-marketing", category: "Influencer Marketing", keywords: ["influencer outreach", "UGC", "creator campaigns", "brand collaborations", "micro-influencers"], desc: "We connect your brand with the right influencers — from macro to micro — to create authentic campaigns that reach your exact target audience and drive real results." },
  { id: "app-development", category: "App Development", keywords: ["mobile app", "iOS", "Android", "Flutter", "React Native", "UI/UX", "app design"], desc: "We design and develop intuitive mobile applications for iOS and Android — from concept and wireframing to launch and post-launch support, built for performance and scale." },
  { id: "software-development", category: "Software Development", keywords: ["custom software", "SaaS", "enterprise solutions", "API", "backend systems"], desc: "We engineer custom software solutions tailored to your business needs — scalable, secure, and built with clean architecture to solve complex problems efficiently." },
  { id: "crm-automation", category: "CRM & Automation", keywords: ["CRM setup", "workflow automation", "Zapier", "HubSpot", "customer retention", "lead management"], desc: "We implement and optimize CRM systems and automation workflows that streamline your sales, marketing, and operations — reducing manual work and improving customer retention." },
];

const easeOut = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 48 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.15 + i * 0.08, ease: easeOut } }),
};

const staggerCard = {
  hidden: { opacity: 0, y: 60, scale: 0.9 },
  visible: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.6, delay: 0.1 + i * 0.04, ease: easeOut },
  }),
};

function ServiceCard({ svc, i, isIvory, onOpen }: { svc: ServiceItem; i: number; isIvory: boolean; onOpen: (service: ServiceItem) => void }) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={ref}
      custom={i + 1}
      variants={staggerCard}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
    >
      <motion.div
        whileHover={{
          y: -6,
          borderColor: "rgba(157,78,221,0.4)",
          boxShadow: isIvory
            ? "0 8px 32px rgba(100,20,180,0.10)"
            : "0 8px 40px rgba(100,20,180,0.18)",
          transition: { duration: 0.25, ease: easeOut },
        }}
        style={{
          background: "var(--belvo-bg-card)",
          border: "1px solid var(--belvo-border-card)",
          borderRadius: "14px",
          padding: "28px",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
          cursor: "pointer",
          boxShadow: isIvory ? "0 2px 12px rgba(0,0,0,0.04)" : "none",
          transition: "border-color 0.3s, box-shadow 0.3s",
        }}
        onClick={() => onOpen(svc)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onOpen(svc);
          }
        }}
        tabIndex={0}
        role="button"
      >
        <img
          src={svc.image}
          alt={svc.title}
          style={{ width: "100%", aspectRatio: "16 / 9", objectFit: "cover", borderRadius: "10px", border: "1px solid var(--belvo-border-card)", display: "block" }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "8px",
              background: "linear-gradient(135deg, rgba(157,78,221,0.2), rgba(123,47,190,0.1))",
              border: "1px solid rgba(157,78,221,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.8rem",
              fontWeight: 700,
              color: "#9D4EDD",
              fontFamily: "'Inter', sans-serif",
              flexShrink: 0,
            }}
          >
            {String(i + 1).padStart(2, "0")}
          </div>

          <h3 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: "0.97rem", color: "var(--belvo-text-1)", margin: 0, lineHeight: 1.3 }}>
            {svc.title}
          </h3>
        </div>

        <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "0.85rem", lineHeight: 1.7, color: "var(--belvo-text-6)", margin: 0, flexGrow: 1 }}>
          {svc.desc}
        </p>

        <motion.div
          style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "4px" }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {svc.keywords.map((kw, ki) => (
            <motion.span
              key={kw}
              custom={ki}
              variants={{
                hidden: { opacity: 0, scale: 0.8 },
                visible: (j: number) => ({
                  opacity: 1,
                  scale: 1,
                  transition: { duration: 0.3, delay: 0.3 + j * 0.05 },
                }),
              }}
              style={{
                padding: "4px 10px",
                background: "rgba(157,78,221,0.08)",
                border: "1px solid rgba(157,78,221,0.15)",
                borderRadius: "6px",
                fontFamily: "'Inter',sans-serif",
                fontSize: "0.65rem",
                fontWeight: 500,
                color: "rgba(157,78,221,0.7)",
                letterSpacing: "0.02em",
                whiteSpace: "nowrap",
              }}
            >
              {kw}
            </motion.span>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default function ServicesSection({ id }: Props) {
  const { theme } = useTheme();
  const isIvory = theme === "ivory";
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true, margin: "-80px" });

  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], [0, -40]);

  const iconPositions = [
    { x: "10%", y: "15%", size: 20, delay: 0 },
    { x: "85%", y: "20%", size: 16, delay: 1 },
    { x: "15%", y: "70%", size: 14, delay: 0.5 },
    { x: "50%", y: "10%", size: 18, delay: 1.5 },
  ];

  return (
    <section id={id} ref={sectionRef} style={{ background: "var(--belvo-bg)", overflow: "hidden" }}>
      <div
        ref={heroRef}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          position: "relative",
          overflow: "hidden",
          padding: "24px 24px 16px",
          textAlign: "center",
        }}
      >
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translate(-50%,-50%)", width: "80vw", height: "60vh", background: "radial-gradient(ellipse at center, rgba(90,20,160,0.22) 0%, transparent 65%)", filter: "blur(60px)" }} />
          <div style={{ position: "absolute", bottom: 0, left: "15%", width: "50vw", height: "40vh", background: "radial-gradient(ellipse at center, rgba(100,20,180,0.12) 0%, transparent 70%)", filter: "blur(80px)" }} />
          <div style={{ position: "absolute", top: 0, right: "10%", width: "40vw", height: "35vh", background: "radial-gradient(ellipse at center, rgba(80,15,150,0.1) 0%, transparent 70%)", filter: "blur(70px)" }} />
          <div style={{ position: "absolute", inset: "0", background: isIvory ? "radial-gradient(ellipse 90% 80% at 50% 50%, transparent 30%, rgba(248,245,239,0.85) 100%)" : "radial-gradient(ellipse 90% 80% at 50% 50%, transparent 30%, rgba(4,0,14,0.6) 100%)" }} />
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "120px", background: isIvory ? "linear-gradient(to bottom, var(--belvo-bg), transparent)" : "linear-gradient(to bottom, rgba(4,0,14,0.9), transparent)" }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "140px", background: isIvory ? "linear-gradient(to top, var(--belvo-bg), transparent)" : "linear-gradient(to top, rgba(4,0,14,0.95), transparent)" }} />
        </div>

        {/* Floating icons */}
        {iconPositions.map((ic, i) => (
          <motion.div
            key={i}
            style={{
              position: "absolute",
              left: ic.x,
              top: ic.y,
              width: ic.size,
              height: ic.size,
              borderRadius: "50%",
              background: isIvory ? "rgba(157,78,221,0.08)" : "rgba(157,78,221,0.12)",
              border: `1px solid ${isIvory ? "rgba(157,78,221,0.15)" : "rgba(157,78,221,0.2)"}`,
              pointerEvents: "none",
              zIndex: 0,
            }}
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 5 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: ic.delay,
            }}
          />
        ))}

        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
          {[[120, 160], [310, 80], [490, 220], [680, 100], [870, 250], [1050, 130], [1230, 200], [1380, 90], [200, 700], [450, 760], [700, 680], [950, 750], [1150, 700], [1340, 760]].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r={i % 3 === 0 ? 1.5 : 1} fill={i % 2 === 0 ? "rgba(200,140,255,0.6)" : isIvory ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.35)"}>
              <animate attributeName="opacity" values="0.3;1;0.3" dur={`${3 + i % 4}s`} repeatCount="indefinite" />
            </circle>
          ))}
        </svg>

        <div style={{ position: "relative", zIndex: 1, maxWidth: "800px" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={heroInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.1 }} style={{ marginBottom: "18px" }}>
            <span
              style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                padding: "6px 18px",
                background: isIvory ? "rgba(123,47,190,0.08)" : "rgba(123,47,190,0.15)",
                border: "1px solid rgba(157,78,221,0.3)",
                borderRadius: "100px",
                fontFamily: "'Inter',sans-serif", fontSize: "0.68rem", fontWeight: 600,
                letterSpacing: "0.3em", textTransform: "uppercase", color: "#9D4EDD",
              }}
            >
              <Sparkles size={11} />
              Our Services
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] as const }}
            style={{ fontFamily: "'Inter',sans-serif", fontWeight: 900, fontSize: "clamp(2.4rem,6vw,5.5rem)", lineHeight: 1.04, color: "var(--belvo-text-1)", margin: "0 0 10px", letterSpacing: "-0.01em" }}
          >
            Full-Service{" "}
            <span style={{ color: "#9D4EDD" }}>
              Creative
            </span>{" "}
            Agency
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] as const }}
            style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(0.9rem,1.6vw,1.05rem)", lineHeight: 1.75, color: "var(--belvo-text-2)", margin: "0 auto 36px", maxWidth: "560px", letterSpacing: "0.01em" }}
          >
            From SEO and branding to web development and performance marketing — we offer
            14 specialised services designed to take your brand from zero to dominate.
          </motion.p>
        </div>
      </div>

      <div
        id="services-grid"
        style={{
          padding: "40px 24px 120px",
          position: "relative",
          overflow: "hidden",
          background: "var(--belvo-bg)",
        }}
      >
        <div style={{ height: "1px", background: "linear-gradient(90deg,transparent,rgba(130,40,200,0.4),rgba(201,163,65,0.18),transparent)", marginBottom: "0" }} />
        <motion.div
          style={{
            position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
            width: "70vw", height: "400px",
            background: "radial-gradient(ellipse at center, rgba(80,15,140,0.10) 0%, transparent 70%)",
            filter: "blur(60px)", pointerEvents: "none", y: bgY,
          }}
        />

        <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <motion.div
            custom={0} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}
            style={{ textAlign: "center", marginTop: "8px", marginBottom: "24px" }}
          >
            <h2 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 900, fontSize: "clamp(1.9rem,4.5vw,3.4rem)", lineHeight: 1.06, color: "var(--belvo-text-1)", margin: 0 }}>
              14 Services. <span style={{ color: "#9D4EDD" }}>One Mission.</span>
            </h2>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: "20px" }}>
            {SERVICE_ITEMS.map((svc, i) => (
              <ServiceCard key={svc.id} svc={svc} i={i} isIvory={isIvory} onOpen={setSelectedService} />
            ))}
          </div>
        </div>
      </div>
      <ServiceDialog service={selectedService} onClose={() => setSelectedService(null)} />
    </section>
  );
}
