import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { CalendarDays, FolderOpen, Newspaper } from "lucide-react";
import { BLOG_CATEGORIES, blogPosts } from "@/content/blogs";
import Footer from "@/sections/Footer";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export default function Blogs() {
  const postsRef = useRef(null);
  const postsInView = useInView(postsRef, { once: true, margin: "-80px" });

  return (
    <>
      <section
        style={{
          minHeight: "74vh",
          background: "var(--belvo-bg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          padding: "120px 24px 80px",
          textAlign: "center",
        }}
      >
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <div style={{ position: "absolute", top: "35%", left: "50%", transform: "translate(-50%,-50%)", width: "78vw", height: "58vh", background: "radial-gradient(ellipse at center, rgba(90,20,160,0.22) 0%, transparent 65%)", filter: "blur(60px)" }} />
          <div style={{ position: "absolute", bottom: 0, right: "12%", width: "42vw", height: "34vh", background: "radial-gradient(ellipse at center, rgba(100,20,180,0.10) 0%, transparent 70%)", filter: "blur(80px)" }} />
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 90% 80% at 50% 50%, transparent 30%, var(--belvo-vignette-4) 100%)" }} />
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "120px", background: "linear-gradient(to bottom, var(--belvo-vignette-2), transparent)" }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "140px", background: "linear-gradient(to top, var(--belvo-vignette-3), transparent)" }} />
        </div>

        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} viewBox="0 0 1440 760" preserveAspectRatio="xMidYMid slice">
          {[[120,160],[310,80],[520,220],[720,120],[930,250],[1110,130],[1250,220],[1360,90],[210,610],[490,660],[760,600],[1020,650],[1250,590]].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r={i % 3 === 0 ? 1.5 : 1} fill={i % 2 === 0 ? "rgba(200,140,255,0.6)" : "rgba(255,255,255,0.35)"} />
          ))}
        </svg>

        <div style={{ position: "relative", zIndex: 1, maxWidth: "760px" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} style={{ marginBottom: "18px" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 18px", background: "rgba(123,47,190,0.15)", border: "1px solid rgba(157,78,221,0.3)", borderRadius: "100px", fontFamily: "'Inter',sans-serif", fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.3em", textTransform: "uppercase", color: "#9D4EDD" }}>
              <Newspaper size={11} />
              Insights Hub
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] as const }}
            style={{ fontFamily: "'Inter',sans-serif", fontWeight: 900, fontSize: "clamp(2.4rem,6vw,5.5rem)", lineHeight: 1.04, color: "var(--belvo-text-1)", margin: "0 0 14px", letterSpacing: "-0.01em" }}
          >
            BELVO <span style={{ color: "#9D4EDD" }}>Blogs</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] as const }}
            style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(0.9rem,1.6vw,1.05rem)", lineHeight: 1.75, color: "var(--belvo-text-2)", margin: "0 auto", maxWidth: "560px", letterSpacing: "0.01em" }}
          >
            Thought leadership, case studies, and industry insights from the BELVO team.
          </motion.p>
        </div>
      </section>

      <section
        ref={postsRef}
        style={{ background: "var(--belvo-bg)", padding: "100px 24px 120px", position: "relative", overflow: "hidden" }}
      >
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg,transparent,rgba(130,40,200,0.4),rgba(201,163,65,0.18),transparent)" }} />
        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "70vw", height: "400px", background: "radial-gradient(ellipse at center, rgba(80,15,140,0.10) 0%, transparent 70%)", filter: "blur(60px)", pointerEvents: "none" }} />

        <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <motion.div custom={0} variants={fadeUp} initial="hidden" animate={postsInView ? "visible" : "hidden"} style={{ textAlign: "center", marginBottom: "52px" }}>
            <span style={{ display: "block", fontSize: "0.68rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "#9D4EDD", fontFamily: "'Inter',sans-serif", marginBottom: "14px" }}>
              Founder Approved Content
            </span>
            <h2 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 900, fontSize: "clamp(1.9rem,4.5vw,3.4rem)", lineHeight: 1.06, color: "var(--belvo-text-1)", margin: 0 }}>
              Latest <span style={{ color: "#9D4EDD" }}>Posts</span>
            </h2>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              style={{
                display: "inline-flex", alignItems: "center", gap: "10px",
                marginTop: "20px",
                padding: "10px 22px",
                background: "linear-gradient(135deg, rgba(255,154,201,0.12), rgba(157,78,221,0.08))",
                border: "1px solid rgba(255,154,201,0.2)",
                borderRadius: "100px",
                backdropFilter: "blur(8px)",
              }}
            >
              <span style={{ fontSize: "1.1rem" }}>✨</span>
              <span style={{
                fontFamily: "'Inter',sans-serif",
                fontSize: "0.78rem",
                fontWeight: 600,
                color: "var(--belvo-text-1)",
                letterSpacing: "0.02em",
              }}>
                A heartfelt welcome to the GenZ — this one's for you 💜
              </span>
              <img
                src="/genz-thumbnail.jpeg"
                alt="GenZ"
                style={{ width: "28px", height: "28px", borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(157,78,221,0.3)" }}
              />
            </motion.div>
          </motion.div>

          {blogPosts.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: "20px" }}>
              {blogPosts.map((post, i) => (
                <motion.article
                  key={post.slug}
                  custom={i + 1}
                  variants={fadeUp}
                  initial="hidden"
                  animate={postsInView ? "visible" : "hidden"}
                  data-testid={`card-blog-${post.slug}`}
                  style={{ background: "var(--belvo-bg-card)", border: "1px solid var(--belvo-border-card)", borderRadius: "14px", overflow: "hidden", transition: "border-color 0.3s, box-shadow 0.3s, transform 0.3s" }}
                  whileHover={{ y: -4, transition: { duration: 0.25 } }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(157,78,221,0.4)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 40px rgba(100,20,180,0.18)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--belvo-border-card)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
                >
                  <div style={{
                    aspectRatio: "16 / 10",
                    background: `linear-gradient(135deg, rgba(255,154,201,0.15), rgba(157,78,221,0.25), rgba(80,20,160,0.4)), url(${post.thumbnail})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    position: "relative",
                    overflow: "hidden",
                  }}>
                    <div style={{
                      position: "absolute", bottom: "10px", left: "10px",
                      display: "flex", gap: "4px",
                    }}>
                      <span style={{
                        padding: "3px 8px",
                        background: "rgba(0,0,0,0.6)",
                        backdropFilter: "blur(8px)",
                        borderRadius: "6px",
                        fontFamily: "'Inter',sans-serif",
                        fontSize: "0.55rem",
                        fontWeight: 600,
                        color: "#fff",
                        letterSpacing: "0.06em",
                      }}>
                        🔥 {post.category}
                      </span>
                    </div>
                  </div>
                  <div style={{ padding: "24px" }}>
                    <h3 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 800, fontSize: "1.05rem", color: "var(--belvo-text-1)", margin: "0 0 10px", lineHeight: 1.35 }}>
                      {post.title}
                    </h3>
                    <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "0.85rem", lineHeight: 1.7, color: "var(--belvo-text-6)", margin: 0 }}>
                      {post.excerpt}
                    </p>
                  </div>
                </motion.article>
              ))}
            </div>
          ) : (
            <motion.div
              custom={1}
              variants={fadeUp}
              initial="hidden"
              animate={postsInView ? "visible" : "hidden"}
              data-testid="blogs-empty-state"
              style={{ maxWidth: "720px", margin: "0 auto", background: "var(--belvo-bg-card)", border: "1px solid var(--belvo-border-card)", borderRadius: "16px", padding: "clamp(32px,6vw,58px)", textAlign: "center", backdropFilter: "blur(12px)" }}
            >
              <div style={{ width: 58, height: 58, borderRadius: "14px", background: "linear-gradient(135deg, rgba(123,47,190,0.24), rgba(157,78,221,0.08))", border: "1px solid rgba(157,78,221,0.24)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 22px" }}>
                <Newspaper size={24} style={{ color: "rgba(157,78,221,0.82)" }} />
              </div>
              <h3 style={{ color: "var(--belvo-text-1)", fontFamily: "'Inter',sans-serif", fontWeight: 800, fontSize: "clamp(1.35rem,3vw,2rem)", margin: "0 0 12px" }}>
                Coming Soon
              </h3>
              <p style={{ color: "var(--belvo-text-2)", fontFamily: "'Inter',sans-serif", fontSize: "0.92rem", lineHeight: 1.7, margin: "0 auto 26px", maxWidth: "470px" }}>
                Founder-approved BELVO posts will appear here once the first article is ready.
              </p>
              <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "8px" }}>
                {BLOG_CATEGORIES.map(category => (
                  <span key={category} style={{ fontFamily: "'Inter',sans-serif", fontSize: "0.7rem", fontWeight: 600, color: "var(--belvo-text-4)", background: "var(--belvo-bg-card)", border: "1px solid rgba(157,78,221,0.22)", borderRadius: "100px", padding: "5px 12px", letterSpacing: "0.05em" }}>
                    {category}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
