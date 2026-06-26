import React, { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useForm } from "react-hook-form";
import { ArrowUpRight, Briefcase, Upload, CheckCircle2 } from "lucide-react";
import Footer from "@/sections/Footer";

const ROLES = [
  {
    id: "social-media",
    title: "Social Media Management",
    desc: "Craft and execute social strategies that grow our clients' brands across every major platform.",
    icon: "📱",
  },
  {
    id: "digital-marketing",
    title: "Digital Marketing",
    desc: "Drive measurable growth through data-driven campaigns and creative performance marketing.",
    icon: "📈",
  },
  {
    id: "business-analyst",
    title: "Business Analyst",
    desc: "Bridge client goals and creative execution by turning market insights into actionable strategies.",
    icon: "📊",
  },
  {
    id: "web-developer",
    title: "Web Developers",
    desc: "Build exceptional web experiences with clean code, pixel-perfect precision, and modern frameworks.",
    icon: "🌐",
  },
  {
    id: "app-developer",
    title: "App Developers",
    desc: "Create seamless mobile experiences across iOS and Android that users love and businesses rely on.",
    icon: "📲",
  },
  {
    id: "hr",
    title: "HR",
    desc: "Build and nurture the BELVO team by attracting, retaining, and developing top creative talent.",
    icon: "🤝",
  },
  {
    id: "software-developer",
    title: "Software Developers",
    desc: "Engineer the tools and systems that power BELVO's growing suite of digital products.",
    icon: "💻",
  },
];

type ApplicationData = {
  fullName: string;
  age: string;
  role: string;
  qualification: string;
  experience: string;
  education: string;
  address: string;
  message: string;
  email: string;
  whatsapp: string;
  resume: FileList;
};

const inputBase: React.CSSProperties = {
  width: "100%",
  background: "var(--belvo-bg-input)",
  border: "1px solid var(--belvo-border-input)",
  borderRadius: "8px",
  padding: "14px 18px",
  color: "var(--belvo-text-1)",
  fontFamily: "'Inter', sans-serif",
  fontSize: "0.875rem",
  letterSpacing: "0.01em",
  outline: "none",
  transition: "border-color 0.2s, box-shadow 0.2s",
  boxSizing: "border-box",
};

const inputErr: React.CSSProperties = {
  ...inputBase,
  border: "1px solid rgba(239,68,68,0.6)",
};

function focusIn(
  e: React.FocusEvent<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >
) {
  e.currentTarget.style.borderColor = "rgba(157,78,221,0.7)";
  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(130,40,200,0.12)";
}
function focusOut(
  e: React.FocusEvent<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >,
  err: boolean
) {
  e.currentTarget.style.borderColor = err
    ? "rgba(239,68,68,0.6)"
    : "var(--belvo-border-input)";
  e.currentTarget.style.boxShadow = "none";
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <label
        style={{
          fontSize: "0.72rem",
          fontFamily: "'Inter',sans-serif",
          fontWeight: 500,
          letterSpacing: "0.09em",
          textTransform: "uppercase",
          color: "var(--belvo-text-2)",
        }}
      >
        {label}
      </label>
      {children}
      {error && (
        <span
          style={{
            fontSize: "0.74rem",
            color: "rgba(239,100,100,0.9)",
            fontFamily: "'Inter',sans-serif",
          }}
        >
          {error}
        </span>
      )}
    </div>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay: i * 0.09,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

export default function Careers() {
  const formRef = useRef<HTMLDivElement>(null);
  const positionsRef = useRef(null);
  const formSectionRef = useRef(null);
  const positionsInView = useInView(positionsRef, {
    once: true,
    margin: "-80px",
  });
  const formInView = useInView(formSectionRef, { once: true, margin: "-80px" });

  const [selectedRole, setSelectedRole] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
    reset,
    setValue,
  } = useForm<ApplicationData>();

  const onSubmit = (_data: ApplicationData) => {
    setTimeout(() => reset(), 3500);
  };

  const handleApplyNow = (roleTitle: string) => {
    setSelectedRole(roleTitle);
    setValue("role", roleTitle);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      {/* HERO */}
      <section
        style={{
          minHeight: "100vh",
          background: "var(--belvo-bg)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          padding: "100px 24px 80px",
          textAlign: "center",
        }}
      >
        {/* Ambient glows */}
        <div
          style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
        >
          <div
            style={{
              position: "absolute",
              top: "30%",
              left: "50%",
              transform: "translate(-50%,-50%)",
              width: "80vw",
              height: "60vh",
              background:
                "radial-gradient(ellipse at center, rgba(90,20,160,0.22) 0%, transparent 65%)",
              filter: "blur(60px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: "15%",
              width: "50vw",
              height: "40vh",
              background:
                "radial-gradient(ellipse at center, rgba(100,20,180,0.12) 0%, transparent 70%)",
              filter: "blur(80px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: "0",
              background:
                "radial-gradient(ellipse 90% 80% at 50% 50%, transparent 30%, var(--belvo-vignette-1) 100%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "120px",
              background:
                "linear-gradient(to bottom, var(--belvo-vignette-2), transparent)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "140px",
              background:
                "linear-gradient(to top, var(--belvo-vignette-3), transparent)",
            }}
          />
        </div>

        {/* Scattered dots */}
        <svg
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
          }}
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
        >
          {[
            [120, 160],
            [310, 80],
            [490, 220],
            [680, 100],
            [870, 250],
            [1050, 130],
            [1230, 200],
            [1380, 90],
            [200, 700],
            [450, 760],
            [700, 680],
            [950, 750],
            [1150, 700],
            [1340, 760],
          ].map(([cx, cy], i) => (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={i % 3 === 0 ? 1.5 : 1}
              fill={
                i % 2 === 0
                  ? "rgba(200,140,255,0.6)"
                  : "rgba(157,78,221,0.35)"
              }
            />
          ))}
        </svg>

        <div
          style={{ position: "relative", zIndex: 1, maxWidth: "760px" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{ marginBottom: "18px" }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 18px",
                background: "rgba(123,47,190,0.15)",
                border: "1px solid rgba(157,78,221,0.3)",
                borderRadius: "100px",
                fontFamily: "'Inter',sans-serif",
                fontSize: "0.68rem",
                fontWeight: 600,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "#9D4EDD",
              }}
            >
              <Briefcase size={11} />
              We're Hiring
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: "'Inter',sans-serif",
              fontWeight: 900,
              fontSize: "clamp(2.4rem,6vw,5.5rem)",
              lineHeight: 1.04,
              color: "var(--belvo-text-1)",
              margin: "0 0 10px",
              letterSpacing: "-0.01em",
            }}
          >
            Join the <span style={{ color: "#9D4EDD" }}>BELVO</span> Team
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: "'Inter',sans-serif",
              fontSize: "clamp(0.9rem,1.6vw,1.05rem)",
              lineHeight: 1.75,
              color: "var(--belvo-text-2)",
              margin: "0 auto 36px",
              maxWidth: "520px",
              letterSpacing: "0.01em",
            }}
          >
            Be part of a premium creative agency that builds brands that
            dominate. We're looking for driven, talented people to help scale
            businesses globally.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <button
              onClick={() =>
                formRef.current?.scrollIntoView({ behavior: "smooth" })
              }
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                padding: "14px 36px",
                background: "linear-gradient(135deg,#7B2FBE,#9D4EDD)",
                border: "none",
                borderRadius: "8px",
                color: "#ffffff",
                fontFamily: "'Inter',sans-serif",
                fontWeight: 600,
                fontSize: "0.82rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                cursor: "pointer",
                boxShadow: "0 0 32px rgba(130,40,200,0.38)",
                transition: "box-shadow 0.3s, transform 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 0 52px rgba(157,78,221,0.55)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 0 32px rgba(130,40,200,0.38)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              View Open Positions <ArrowUpRight size={14} strokeWidth={2.5} />
            </button>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          style={{
            position: "absolute",
            bottom: "28px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <div
            style={{
              width: "26px",
              height: "42px",
              borderRadius: "100px",
              border: "1px solid var(--belvo-border-card)",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "center",
              paddingTop: "8px",
            }}
          >
            <motion.div
              style={{
                width: "4px",
                height: "8px",
                borderRadius: "100px",
                background: "rgba(157,78,221,0.8)",
              }}
              animate={{ y: [0, 10, 0], opacity: [1, 0, 1] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          <span
            style={{
              fontSize: "9px",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "var(--belvo-text-4)",
              fontFamily: "'Inter',sans-serif",
            }}
          >
            Scroll
          </span>
        </motion.div>
      </section>

      {/* OPEN POSITIONS */}
      <section
        id="positions"
        ref={positionsRef}
        style={{
          background: "var(--belvo-bg)",
          padding: "100px 24px 120px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "1px",
            background:
              "linear-gradient(90deg,transparent,var(--belvo-border-divider),rgba(201,163,65,0.18),transparent)",
            marginBottom: "0",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "70vw",
            height: "400px",
            background:
              "radial-gradient(ellipse at center, var(--belvo-glow-blob) 0%, transparent 70%)",
            filter: "blur(60px)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            position: "relative",
            zIndex: 1,
          }}
        >
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate={positionsInView ? "visible" : "hidden"}
            style={{ textAlign: "center", marginBottom: "64px" }}
          >
            <span
              style={{
                display: "block",
                fontSize: "0.68rem",
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                color: "#9D4EDD",
                fontFamily: "'Inter',sans-serif",
                marginBottom: "14px",
              }}
            >
              Open Positions
            </span>
            <h2
              style={{
                fontFamily: "'Inter',sans-serif",
                fontWeight: 900,
                fontSize: "clamp(1.9rem,4.5vw,3.4rem)",
                lineHeight: 1.06,
                color: "var(--belvo-text-1)",
                margin: 0,
              }}
            >
              Where Will You{" "}
              <span style={{ color: "#9D4EDD" }}>Grow?</span>
            </h2>
          </motion.div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))",
              gap: "20px",
            }}
          >
            {ROLES.map((role, i) => (
              <motion.div
                key={role.id}
                custom={i + 1}
                variants={fadeUp}
                initial="hidden"
                animate={positionsInView ? "visible" : "hidden"}
                style={{
                  background: "var(--belvo-bg-card)",
                  border: "1px solid var(--belvo-border-card)",
                  borderRadius: "14px",
                  padding: "28px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  transition:
                    "border-color 0.3s, box-shadow 0.3s",
                  cursor: "default",
                }}
                whileHover={{ y: -4, transition: { duration: 0.25 } }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "rgba(157,78,221,0.4)";
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 8px 40px rgba(100,20,180,0.18)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "var(--belvo-border-card)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "10px",
                      background:
                        "linear-gradient(135deg,rgba(123,47,190,0.22),rgba(157,78,221,0.08))",
                      border: "1px solid rgba(157,78,221,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.2rem",
                      flexShrink: 0,
                    }}
                  >
                    {role.icon}
                  </div>
                  <h3
                    style={{
                      fontFamily: "'Inter',sans-serif",
                      fontWeight: 700,
                      fontSize: "0.97rem",
                      color: "var(--belvo-text-1)",
                      margin: 0,
                      lineHeight: 1.3,
                    }}
                  >
                    {role.title}
                  </h3>
                </div>

                <p
                  style={{
                    fontFamily: "'Inter',sans-serif",
                    fontSize: "0.85rem",
                    lineHeight: 1.7,
                    color: "var(--belvo-text-3)",
                    margin: 0,
                    flexGrow: 1,
                  }}
                >
                  {role.desc}
                </p>

                <button
                  onClick={() => handleApplyNow(role.title)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "7px",
                    padding: "10px 20px",
                    background: "rgba(123,47,190,0.12)",
                    border: "1px solid rgba(157,78,221,0.28)",
                    borderRadius: "7px",
                    color: "#9D4EDD",
                    fontFamily: "'Inter',sans-serif",
                    fontWeight: 600,
                    fontSize: "0.76rem",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    transition: "background 0.2s, border-color 0.2s",
                    alignSelf: "flex-start",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      "rgba(157,78,221,0.2)";
                    e.currentTarget.style.borderColor =
                      "rgba(157,78,221,0.5)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      "rgba(123,47,190,0.12)";
                    e.currentTarget.style.borderColor =
                      "rgba(157,78,221,0.28)";
                  }}
                >
                  Apply Now <ArrowUpRight size={12} strokeWidth={2.5} />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* APPLICATION FORM */}
      <section
        id="apply"
        ref={formSectionRef}
        style={{
          background: "var(--belvo-bg)",
          padding: "0 24px 120px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "70vw",
            height: "400px",
            background:
              "radial-gradient(ellipse at center, var(--belvo-glow-blob) 0%, transparent 70%)",
            filter: "blur(60px)",
            pointerEvents: "none",
          }}
        />

        <div
          ref={formRef}
          style={{
            maxWidth: "860px",
            margin: "0 auto",
            position: "relative",
            zIndex: 1,
            paddingTop: "100px",
          }}
        >
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate={formInView ? "visible" : "hidden"}
            style={{ textAlign: "center", marginBottom: "52px" }}
          >
            <span
              style={{
                display: "block",
                fontSize: "0.68rem",
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                color: "#9D4EDD",
                fontFamily: "'Inter',sans-serif",
                marginBottom: "14px",
              }}
            >
              Ready to Apply?
            </span>
            <h2
              style={{
                fontFamily: "'Inter',sans-serif",
                fontWeight: 900,
                fontSize: "clamp(1.9rem,4.5vw,3.4rem)",
                lineHeight: 1.06,
                color: "var(--belvo-text-1)",
                margin: "0 0 14px",
              }}
            >
              Submit Your{" "}
              <span style={{ color: "#9D4EDD" }}>Application</span>
            </h2>
            <p
              style={{
                color: "var(--belvo-text-3)",
                fontFamily: "'Inter',sans-serif",
                fontSize: "0.9rem",
                lineHeight: 1.7,
              }}
            >
              Tell us about yourself. We'll get back within 48 hours.
            </p>
          </motion.div>

          <motion.div
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate={formInView ? "visible" : "hidden"}
            style={{
              background: "var(--belvo-bg-card)",
              border: "1px solid var(--belvo-border-card)",
              borderRadius: "16px",
              padding: "clamp(28px,5vw,52px)",
              backdropFilter: "blur(12px)",
            }}
          >
            {isSubmitSuccessful ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ textAlign: "center", padding: "48px 0" }}
              >
                <div
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg,#7B2FBE,#9D4EDD)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 20px",
                  }}
                >
                  <CheckCircle2 size={28} color="#fff" />
                </div>
                <h3
                  style={{
                    color: "var(--belvo-text-1)",
                    fontFamily: "'Inter',sans-serif",
                    fontWeight: 700,
                    fontSize: "1.3rem",
                    margin: "0 0 8px",
                  }}
                >
                  Application Submitted!
                </h3>
                <p
                  style={{
                    color: "var(--belvo-text-3)",
                    fontFamily: "'Inter',sans-serif",
                    fontSize: "0.9rem",
                  }}
                >
                  We've received your application and will be in touch within
                  48 hours.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                {/* Row: Full Name + Age */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit,minmax(200px,1fr))",
                    gap: "20px",
                    marginBottom: "20px",
                  }}
                >
                  <Field
                    label="Full Name"
                    error={errors.fullName?.message}
                  >
                    <input
                      placeholder="John Smith"
                      style={errors.fullName ? inputErr : inputBase}
                      {...register("fullName", {
                        required: "Full name is required",
                      })}
                      onFocus={focusIn}
                      onBlur={(e) => focusOut(e, !!errors.fullName)}
                    />
                  </Field>
                  <Field label="Age" error={errors.age?.message}>
                    <input
                      type="number"
                      min="16"
                      max="65"
                      placeholder="24"
                      style={errors.age ? inputErr : inputBase}
                      {...register("age", {
                        required: "Age is required",
                        min: { value: 16, message: "Must be at least 16" },
                        max: {
                          value: 65,
                          message: "Must be 65 or under",
                        },
                      })}
                      onFocus={focusIn}
                      onBlur={(e) => focusOut(e, !!errors.age)}
                    />
                  </Field>
                </div>

                {/* Role */}
                <div style={{ marginBottom: "20px" }}>
                  <Field
                    label="Role Applying For"
                    error={errors.role?.message}
                  >
                    <select
                      value={selectedRole}
                      style={{
                        ...(errors.role ? inputErr : inputBase),
                        appearance: "none",
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='rgba(157,78,221,0.8)' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 16px center",
                        paddingRight: "40px",
                      }}
                      {...register("role", {
                        required: "Please select a role",
                      })}
                      onChange={(e) => {
                        setSelectedRole(e.target.value);
                      }}
                      onFocus={focusIn}
                      onBlur={(e) => focusOut(e, !!errors.role)}
                    >
                      <option
                        value=""
                        style={{ background: "var(--belvo-bg)" }}
                      >
                        Select a role
                      </option>
                      {ROLES.map((r) => (
                        <option
                          key={r.id}
                          value={r.title}
                          style={{ background: "var(--belvo-bg)" }}
                        >
                          {r.title}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>

                {/* Row: Qualification + Education */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit,minmax(200px,1fr))",
                    gap: "20px",
                    marginBottom: "20px",
                  }}
                >
                  <Field
                    label="Highest Qualification"
                    error={errors.qualification?.message}
                  >
                    <input
                      placeholder="e.g. B.Tech, MBA, BCA…"
                      style={errors.qualification ? inputErr : inputBase}
                      {...register("qualification", {
                        required: "Qualification is required",
                      })}
                      onFocus={focusIn}
                      onBlur={(e) => focusOut(e, !!errors.qualification)}
                    />
                  </Field>
                  <Field
                    label="School / College / University"
                    error={errors.education?.message}
                  >
                    <input
                      placeholder="e.g. IIT Mumbai"
                      style={errors.education ? inputErr : inputBase}
                      {...register("education", {
                        required: "Education is required",
                      })}
                      onFocus={focusIn}
                      onBlur={(e) => focusOut(e, !!errors.education)}
                    />
                  </Field>
                </div>

                {/* Row: Email + WhatsApp */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit,minmax(200px,1fr))",
                    gap: "20px",
                    marginBottom: "20px",
                  }}
                >
                  <Field label="Email ID" error={errors.email?.message}>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      style={errors.email ? inputErr : inputBase}
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Enter a valid email",
                        },
                      })}
                      onFocus={focusIn}
                      onBlur={(e) => focusOut(e, !!errors.email)}
                    />
                  </Field>
                  <Field
                    label="WhatsApp Number"
                    error={errors.whatsapp?.message}
                  >
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      style={errors.whatsapp ? inputErr : inputBase}
                      {...register("whatsapp", {
                        required: "WhatsApp number is required",
                        pattern: {
                          value: /^[+\d\s\-()]{7,20}$/,
                          message: "Enter a valid number",
                        },
                      })}
                      onFocus={focusIn}
                      onBlur={(e) => focusOut(e, !!errors.whatsapp)}
                    />
                  </Field>
                </div>

                {/* Past Work Experience */}
                <div style={{ marginBottom: "20px" }}>
                  <Field
                    label="Past Work Experience"
                    error={errors.experience?.message}
                  >
                    <textarea
                      placeholder="Describe your relevant experience, roles, and achievements…"
                      style={{
                        ...(errors.experience ? inputErr : inputBase),
                        resize: "none",
                        minHeight: "110px",
                      }}
                      {...register("experience", {
                        required: "Please describe your experience",
                      })}
                      onFocus={focusIn}
                      onBlur={(e) => focusOut(e, !!errors.experience)}
                    />
                  </Field>
                </div>

                {/* Current Address */}
                <div style={{ marginBottom: "20px" }}>
                  <Field
                    label="Current Address"
                    error={errors.address?.message}
                  >
                    <textarea
                      placeholder="City, State, Country"
                      style={{
                        ...(errors.address ? inputErr : inputBase),
                        resize: "none",
                        minHeight: "90px",
                      }}
                      {...register("address", {
                        required: "Address is required",
                      })}
                      onFocus={focusIn}
                      onBlur={(e) => focusOut(e, !!errors.address)}
                    />
                  </Field>
                </div>

                {/* Quick Message */}
                <div style={{ marginBottom: "20px" }}>
                  <Field
                    label="Quick Message for Recruiter"
                    error={errors.message?.message}
                  >
                    <textarea
                      placeholder="Tell us why you're the perfect fit for BELVO…"
                      style={{
                        ...(errors.message ? inputErr : inputBase),
                        resize: "none",
                        minHeight: "110px",
                      }}
                      {...register("message", {
                        required: "Please write a message",
                        minLength: {
                          value: 20,
                          message: "At least 20 characters",
                        },
                      })}
                      onFocus={focusIn}
                      onBlur={(e) => focusOut(e, !!errors.message)}
                    />
                  </Field>
                </div>

                {/* Resume Upload */}
                <div style={{ marginBottom: "36px" }}>
                  <Field label="Resume / CV" error={errors.resume?.message}>
                    <label
                      htmlFor="resume-upload"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "14px",
                        width: "100%",
                        background: "var(--belvo-bg-input)",
                        border: "1px dashed var(--belvo-border-input)",
                        borderRadius: "8px",
                        padding: "18px 20px",
                        cursor: "pointer",
                        transition: "border-color 0.2s, background 0.2s",
                        boxSizing: "border-box",
                      }}
                      onMouseEnter={(e) => {
                        (
                          e.currentTarget as HTMLElement
                        ).style.borderColor = "rgba(157,78,221,0.6)";
                        (
                          e.currentTarget as HTMLElement
                        ).style.background = "rgba(157,78,221,0.04)";
                      }}
                      onMouseLeave={(e) => {
                        (
                          e.currentTarget as HTMLElement
                        ).style.borderColor = "var(--belvo-border-input)";
                        (
                          e.currentTarget as HTMLElement
                        ).style.background = "var(--belvo-bg-input)";
                      }}
                    >
                      <Upload
                        size={18}
                        style={{
                          color: "rgba(157,78,221,0.7)",
                          flexShrink: 0,
                        }}
                      />
                      <div>
                        <p
                          style={{
                            margin: 0,
                            fontFamily: "'Inter',sans-serif",
                            fontSize: "0.85rem",
                            color: "var(--belvo-text-2)",
                          }}
                        >
                          Click to upload your resume
                        </p>
                        <p
                          style={{
                            margin: "3px 0 0",
                            fontFamily: "'Inter',sans-serif",
                            fontSize: "0.72rem",
                            color: "var(--belvo-text-4)",
                          }}
                        >
                          PDF, DOC, DOCX — max 5 MB
                        </p>
                      </div>
                    </label>
                    <input
                      id="resume-upload"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      style={{ display: "none" }}
                      {...register("resume", {
                        required: "Please upload your resume",
                        validate: {
                          fileSize: (v) =>
                            !v?.[0] ||
                            v[0].size <= 5_000_000 ||
                            "File must be under 5 MB",
                        },
                      })}
                    />
                  </Field>
                </div>

                {/* Submit */}
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <button
                    type="submit"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "14px 48px",
                      background:
                        "linear-gradient(135deg,#7B2FBE,#9D4EDD)",
                      border: "none",
                      borderRadius: "8px",
                      color: "#ffffff",
                      fontFamily: "'Inter',sans-serif",
                      fontWeight: 600,
                      fontSize: "0.84rem",
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      cursor: "pointer",
                      boxShadow: "0 0 32px rgba(130,40,200,0.35)",
                      transition: "box-shadow 0.3s, transform 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow =
                        "0 0 52px rgba(157,78,221,0.55)";
                      e.currentTarget.style.transform = "translateY(-1px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow =
                        "0 0 32px rgba(130,40,200,0.35)";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    Apply Now <ArrowUpRight size={15} strokeWidth={2.5} />
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
}
