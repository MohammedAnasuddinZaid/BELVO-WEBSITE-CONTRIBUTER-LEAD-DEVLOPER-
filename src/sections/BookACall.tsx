import { useForm } from "react-hook-form";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";

type FormData = {
  fullName: string;
  email: string;
  company: string;
  budget: string;
  projectType: string;
  message: string;
};

const BUDGETS = [
  "Under $1,000", "$1,000 – $5,000", "$5,000 – $10,000",
  "$10,000 – $25,000", "$25,000+",
];

const PROJECT_TYPES = [
  "Brand Identity", "Website Design", "Social Media Strategy",
  "Marketing & Growth", "Full Brand Build", "Other",
];

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
  }),
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
};

const inputError: React.CSSProperties = {
  ...inputBase,
  border: "1px solid rgba(239,68,68,0.6)",
};

function GlassInput({ error, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { error?: boolean }) {
  return (
    <input
      {...props}
      style={error ? inputError : inputBase}
      onFocus={e => {
        e.currentTarget.style.borderColor = "rgba(157,78,221,0.7)";
        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(130,40,200,0.12)";
        props.onFocus?.(e);
      }}
      onBlur={e => {
        e.currentTarget.style.borderColor = error ? "rgba(239,68,68,0.6)" : "var(--belvo-border-input)";
        e.currentTarget.style.boxShadow = "none";
        props.onBlur?.(e);
      }}
    />
  );
}

function GlassSelect({ error, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { error?: boolean }) {
  return (
    <select
      {...props}
      style={{
        ...(error ? inputError : inputBase),
        appearance: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='rgba(157,78,221,0.8)' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 16px center",
        paddingRight: "40px",
        cursor: "pointer",
      }}
      onFocus={e => {
        e.currentTarget.style.borderColor = "rgba(157,78,221,0.7)";
        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(130,40,200,0.12)";
        props.onFocus?.(e);
      }}
      onBlur={e => {
        e.currentTarget.style.borderColor = error ? "rgba(239,68,68,0.6)" : "var(--belvo-border-input)";
        e.currentTarget.style.boxShadow = "none";
        props.onBlur?.(e);
      }}
    >
      {children}
    </select>
  );
}

function GlassTextarea({ error, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: boolean }) {
  return (
    <textarea
      {...props}
      style={{ ...(error ? inputError : inputBase), resize: "none", minHeight: "130px" }}
      onFocus={e => {
        e.currentTarget.style.borderColor = "rgba(157,78,221,0.7)";
        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(130,40,200,0.12)";
        props.onFocus?.(e);
      }}
      onBlur={e => {
        e.currentTarget.style.borderColor = error ? "rgba(239,68,68,0.6)" : "var(--belvo-border-input)";
        e.currentTarget.style.boxShadow = "none";
        props.onBlur?.(e);
      }}
    />
  );
}

export default function BookACall() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const { register, handleSubmit, formState: { errors, isSubmitSuccessful }, reset } = useForm<FormData>();
  const onSubmit = (_data: FormData) => { setTimeout(() => reset(), 3000); };

  return (
    <section
      id="book-a-call"
      ref={ref}
      style={{ background: "var(--belvo-bg)", position: "relative", overflow: "hidden" }}
    >
      <div style={{
        height: "1px",
        background: "linear-gradient(90deg, transparent, var(--belvo-border-divider), rgba(201,163,65,0.2), transparent)",
      }} />

      <div style={{
        position: "absolute", top: "0", left: "50%", transform: "translateX(-50%)",
        width: "70vw", height: "400px",
        background: "radial-gradient(ellipse at center, var(--belvo-glow-blob) 0%, transparent 70%)",
        filter: "blur(60px)", pointerEvents: "none",
      }} />

      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "100px 24px 120px", position: "relative", zIndex: 1 }}>

        {/* Heading */}
        <motion.div
          custom={0} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
          style={{ textAlign: "center", marginBottom: "56px" }}
        >
          <span style={{
            display: "block", fontSize: "0.7rem", letterSpacing: "0.35em",
            textTransform: "uppercase", color: "#9D4EDD",
            fontFamily: "'Inter', sans-serif", marginBottom: "16px",
          }}>
            Let's Work Together
          </span>
          <h2 style={{
            fontFamily: "'Inter', sans-serif", fontWeight: 900,
            fontSize: "clamp(2rem, 5vw, 3.8rem)", lineHeight: 1.05,
            color: "var(--belvo-text-1)", margin: 0,
          }}>
            Book A{" "}
            <span style={{ color: "#9D4EDD" }}>Free Call</span>
          </h2>
          <p style={{
            marginTop: "16px", color: "var(--belvo-text-3)",
            fontSize: "0.95rem", letterSpacing: "0.01em", lineHeight: 1.7,
            fontFamily: "'Inter', sans-serif",
          }}>
            Tell us about your project and we'll get back to you within 24 hours.
          </p>
        </motion.div>

        {/* Form card */}
        <motion.div
          custom={1} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
          style={{
            background: "var(--belvo-bg-card)",
            border: "1px solid var(--belvo-border-card)",
            borderRadius: "16px",
            padding: "clamp(28px, 5vw, 52px)",
            backdropFilter: "blur(12px)",
          }}
        >
          {isSubmitSuccessful ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              style={{ textAlign: "center", padding: "40px 0" }}
            >
              <div style={{
                width: 56, height: 56, borderRadius: "50%",
                background: "linear-gradient(135deg, #7B2FBE, #9D4EDD)",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 20px", fontSize: "1.4rem",
              }}>✓</div>
              <h3 style={{
                color: "var(--belvo-text-1)", fontFamily: "'Inter', sans-serif",
                fontWeight: 700, fontSize: "1.3rem", marginBottom: 8,
              }}>We'll be in touch!</h3>
              <p style={{ color: "var(--belvo-text-3)", fontSize: "0.9rem" }}>
                Your message has been received. Expect a reply within 24 hours.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginBottom: "20px" }}>
                <Field label="Full Name" error={errors.fullName?.message}>
                  <GlassInput placeholder="John Smith" error={!!errors.fullName} data-testid="input-full-name"
                    {...register("fullName", { required: "Full name is required" })} />
                </Field>
                <Field label="Email Address" error={errors.email?.message}>
                  <GlassInput type="email" placeholder="john@company.com" error={!!errors.email} data-testid="input-email"
                    {...register("email", { required: "Email is required", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email" } })} />
                </Field>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginBottom: "20px" }}>
                <Field label="Company Name" error={errors.company?.message}>
                  <GlassInput placeholder="Acme Inc." error={!!errors.company} data-testid="input-company"
                    {...register("company", { required: "Company name is required" })} />
                </Field>
                <Field label="Budget" error={errors.budget?.message}>
                  <GlassSelect error={!!errors.budget} data-testid="select-budget"
                    {...register("budget", { required: "Please select a budget" })}>
                    <option value="" style={{ background: "var(--belvo-bg)" }}>Select budget range</option>
                    {BUDGETS.map(b => <option key={b} value={b} style={{ background: "var(--belvo-bg)" }}>{b}</option>)}
                  </GlassSelect>
                </Field>
              </div>
              <div style={{ marginBottom: "20px" }}>
                <Field label="Project Type" error={errors.projectType?.message}>
                  <GlassSelect error={!!errors.projectType} data-testid="select-project-type"
                    {...register("projectType", { required: "Please select a project type" })}>
                    <option value="" style={{ background: "var(--belvo-bg)" }}>Select project type</option>
                    {PROJECT_TYPES.map(t => <option key={t} value={t} style={{ background: "var(--belvo-bg)" }}>{t}</option>)}
                  </GlassSelect>
                </Field>
              </div>
              <div style={{ marginBottom: "32px" }}>
                <Field label="Message / Brief" error={errors.message?.message}>
                  <GlassTextarea
                    placeholder="Tell us about your project, goals, and timeline..."
                    error={!!errors.message} data-testid="textarea-message"
                    {...register("message", { required: "Please write a brief message", minLength: { value: 20, message: "At least 20 characters" } })} />
                </Field>
              </div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <motion.button
                  type="submit"
                  data-testid="button-submit-form"
                  whileHover={{ y: -2, boxShadow: "0 0 56px rgba(157,78,221,0.55)" }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "10px",
                    padding: "14px 40px",
                    background: "linear-gradient(135deg, #7B2FBE, #9D4EDD)",
                    border: "none", borderRadius: "8px", color: "#ffffff",
                    fontFamily: "'Inter', sans-serif", fontWeight: 600,
                    fontSize: "0.85rem", letterSpacing: "0.18em",
                    textTransform: "uppercase", cursor: "pointer",
                    boxShadow: "0 0 32px rgba(130,40,200,0.35)",
                  }}
                >
                  Send Message
                  <ArrowUpRight size={15} strokeWidth={2.5} />
                </motion.button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <label style={{
        fontSize: "0.75rem", fontFamily: "'Inter', sans-serif",
        fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase",
        color: "var(--belvo-text-2)",
      }}>
        {label}
      </label>
      {children}
      {error && <span style={{ fontSize: "0.75rem", color: "rgba(239,100,100,0.9)", fontFamily: "'Inter', sans-serif" }}>{error}</span>}
    </div>
  );
}
