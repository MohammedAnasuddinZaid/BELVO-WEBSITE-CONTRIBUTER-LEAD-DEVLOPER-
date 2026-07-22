import { useRef, useState, type ElementType } from "react";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  FileText,
  FolderKanban,
  Newspaper,
  Sparkles,
} from "lucide-react";
import { blogPosts, type BlogPost } from "@/content/blogs";
import { caseStudies, type CaseStudy } from "@/content/case-studies";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Footer from "@/sections/Footer";

type ResourceType = "blogs" | "newsletters" | "case-studies";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.58,
      delay: index * 0.07,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  }),
};

const resourceTypes: Array<{
  id: ResourceType;
  title: string;
  eyebrow: string;
  description: string;
  detail: string;
  icon: typeof Newspaper;
}> = [
  {
    id: "blogs",
    title: "Blogs",
    eyebrow: "Ideas & opinions",
    description: "Punchy, practical reads on the digital work that helps brands stay relevant.",
    detail: "Top posts & archive",
    icon: Newspaper,
  },
  {
    id: "newsletters",
    title: "Newsletters",
    eyebrow: "Stories & playbooks",
    description: "Six recurring content pillars for founders, teams, and curious builders.",
    detail: "1 issue & 6 pillars",
    icon: BookOpen,
  },
  {
    id: "case-studies",
    title: "Case Studies",
    eyebrow: "Work & outcomes",
    description: "Evergreen client stories built around the challenge, the work, and the result.",
    detail: "14 case studies",
    icon: BriefcaseBusiness,
  },
];

const newsletterPillars = [
  {
    number: "01",
    title: "Behind the Build",
    description: "Client and project stories shaped from Belvo's published updates.",
    label: "Client stories",
  },
  {
    number: "02",
    title: "Playbook: Start a Company From Scratch",
    description: "A stage-by-stage founder guide from the first idea to long-term brand building.",
    label: "First series",
  },
  {
    number: "03",
    title: "Myth Busting",
    description: "Clear, useful answers to the marketing claims founders hear most often.",
    label: "5 topics",
  },
  {
    number: "04",
    title: "Employment Perks",
    description: "A closer look at Belvo's culture, benefits, and developer experience.",
    label: "People & culture",
  },
  {
    number: "05",
    title: "Growth Story of Belvo",
    description: "The milestones, lessons, and decisions behind Belvo's journey.",
    label: "Company story",
  },
  {
    number: "06",
    title: "Team Story of Belvo",
    description: "Team spotlights, short interviews, and stories from the people building Belvo.",
    label: "Team spotlight",
  },
];

const workplaceNewsletter: BlogPost = {
  slug: "belvo-gen-z-workplace-perks",
  title: "Inside Belvo: Workplace Perks That Actually Get Gen Z",
  date: "2026-07-22",
  category: "Employment Perks",
  excerpt: "Blinkit rewards, useful subscriptions, gym access, paid projects, hackathons, and a culture where interns help shape the fun - not just watch it.",
  thumbnail: "/newsletter-covers/gen-z-workplace-perks.svg",
  content: `# Inside Belvo: Workplace Perks That Actually Get Gen Z

A workplace perk should do more than look cute in an onboarding deck. It should make work easier, reward real effort, and give people more ways to learn, create, and enjoy the team they are part of.

## Rewards That Show Up in Real Life

Good work deserves more than a thumbs-up reaction. Belvo's Blinkit reward system and voucher system turn appreciation into something interns and employees can actually use.

## Your Subscriptions Are Part of the Toolkit

The right tools help people work smarter and stay inspired. Team access can include platforms such as Spotify, Netflix, Claude, Amazon Prime, GPT, and other useful services depending on the work and program.

## Work Hard, Move Too

Gym membership support makes wellbeing part of the routine instead of something that gets pushed to next Monday.

## Intern Does Not Mean Side Character

Interns get opportunities to join partnership programs, contribute to paid projects, and participate in hackathons. The goal is real exposure, real ownership, and work that belongs in a portfolio.

## The Culture Lives Beyond Meetings

The team uses its Instagram group for fun conversations, video calls, shared moments, and the kind of casual interaction that makes a remote or hybrid workplace feel human.

## Interns Help Create the Vibe

Interns also create content for Belvo's Instagram in their own fun, relevant style. They do not just experience the culture - they help communicate it.

## A Complete Gen Z Workplace

Belvo is building a workplace around access, recognition, wellbeing, creativity, and community. The work stays professional. The environment does not have to feel outdated.

The best workplace perk is feeling trusted enough to contribute and supported enough to grow.`,
};

const caseStudySteps = [
  {
    title: "Challenge",
    description: "The client context, the real constraint, and what needed to change.",
  },
  {
    title: "What Belvo Did",
    description: "The strategy, creative choices, and execution behind the work.",
  },
  {
    title: "Result",
    description: "The outcome, supported by clear numbers wherever they are available.",
  },
];

function openPdf(pdfPath: string) {
  if (typeof window === "undefined") return;

  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
  window.location.assign(`${basePath}${pdfPath}`);
}

function renderBlogContent(content: string) {
  const blocks = content
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  return blocks.map((block, index) => {
    const headingMatch = block.match(/^(#{1,6})\s+(.*)$/);

    if (headingMatch) {
      const HeadingTag = `h${Math.min(headingMatch[1].length, 4)}` as ElementType;
      return (
        <HeadingTag
          key={`heading-${index}`}
          style={{
            color: "var(--belvo-text-1)",
            fontFamily: "'Inter', sans-serif",
            fontWeight: 800,
            margin: "12px 0 6px",
          }}
        >
          {headingMatch[2]}
        </HeadingTag>
      );
    }

    if (block.split("\n").every((line) => line.startsWith("- "))) {
      return (
        <ul
          key={`list-${index}`}
          style={{ color: "var(--belvo-text-2)", lineHeight: 1.75, margin: "0 0 12px", paddingLeft: 22 }}
        >
          {block.split("\n").map((line) => (
            <li key={line}>{line.replace(/^-\s*/, "")}</li>
          ))}
        </ul>
      );
    }

    return (
      <p
        key={`paragraph-${index}`}
        style={{
          color: "var(--belvo-text-2)",
          fontFamily: "'Inter', sans-serif",
          fontSize: "0.96rem",
          lineHeight: 1.8,
          margin: "0 0 12px",
        }}
      >
        {block}
      </p>
    );
  });
}

function ResourceSelector({
  activeResource,
  onSelect,
}: {
  activeResource: ResourceType;
  onSelect: (resource: ResourceType) => void;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
        gap: 16,
      }}
    >
      {resourceTypes.map((resource, index) => {
        const Icon = resource.icon;
        const isActive = activeResource === resource.id;

        return (
          <motion.button
            key={resource.id}
            type="button"
            custom={index}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.99 }}
            aria-pressed={isActive}
            onClick={() => onSelect(resource.id)}
            data-testid={`resource-selector-${resource.id}`}
            style={{
              appearance: "none",
              background: isActive
                ? "linear-gradient(145deg, rgba(157,78,221,0.2), rgba(255,154,201,0.08))"
                : "var(--belvo-bg-card)",
              border: isActive ? "1px solid rgba(187,120,244,0.62)" : "1px solid var(--belvo-border-card)",
              borderRadius: 22,
              boxShadow: isActive ? "0 18px 55px rgba(92,31,148,0.2)" : "none",
              color: "var(--belvo-text-1)",
              cursor: "pointer",
              minHeight: 250,
              padding: 26,
              textAlign: "left",
              transition: "border-color 220ms ease, box-shadow 220ms ease, background 220ms ease",
            }}
          >
            <div
              style={{
                alignItems: "center",
                background: isActive ? "rgba(157,78,221,0.2)" : "rgba(157,78,221,0.09)",
                border: "1px solid rgba(157,78,221,0.25)",
                borderRadius: 14,
                color: "#b87cff",
                display: "flex",
                height: 48,
                justifyContent: "center",
                marginBottom: 28,
                width: 48,
              }}
            >
              <Icon size={22} />
            </div>
            <span
              style={{
                color: "#b87cff",
                display: "block",
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.64rem",
                fontWeight: 700,
                letterSpacing: "0.18em",
                marginBottom: 9,
                textTransform: "uppercase",
              }}
            >
              {resource.eyebrow}
            </span>
            <h2
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "1.48rem",
                fontWeight: 850,
                letterSpacing: "-0.02em",
                margin: "0 0 10px",
              }}
            >
              {resource.title}
            </h2>
            <p
              style={{
                color: "var(--belvo-text-6)",
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.86rem",
                lineHeight: 1.65,
                margin: "0 0 24px",
              }}
            >
              {resource.description}
            </p>
            <span
              style={{
                alignItems: "center",
                color: isActive ? "#c996ff" : "var(--belvo-text-2)",
                display: "inline-flex",
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.72rem",
                fontWeight: 650,
                gap: 8,
              }}
            >
              {resource.detail} <ArrowRight size={14} />
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}

function BlogCard({ post, index, onOpen }: { post: BlogPost; index: number; onOpen: (post: BlogPost) => void }) {
  const handleOpen = () => {
    if (post.pdfPath) {
      openPdf(post.pdfPath);
      return;
    }

    onOpen(post);
  };

  return (
    <motion.article
      custom={index}
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -5 }}
      onClick={handleOpen}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleOpen();
        }
      }}
      role="button"
      tabIndex={0}
      data-testid={`card-blog-${post.slug}`}
      style={{
        background: "var(--belvo-bg-card)",
        border: "1px solid var(--belvo-border-card)",
        borderRadius: 18,
        cursor: "pointer",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          aspectRatio: "16 / 9",
          backgroundImage: `url(${post.thumbnail})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          borderBottom: "1px solid var(--belvo-border-card)",
          position: "relative",
        }}
      >
        <span
          style={{
            backdropFilter: "blur(10px)",
            background: "rgba(12,7,23,0.72)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 999,
            bottom: 12,
            color: "#fff",
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.62rem",
            fontWeight: 700,
            left: 12,
            letterSpacing: "0.06em",
            padding: "5px 10px",
            position: "absolute",
            textTransform: "uppercase",
          }}
        >
          {post.category}
        </span>
      </div>
      <div style={{ padding: 23 }}>
        <h3
          style={{
            color: "var(--belvo-text-1)",
            fontFamily: "'Inter', sans-serif",
            fontSize: "1.03rem",
            fontWeight: 800,
            lineHeight: 1.42,
            margin: "0 0 10px",
          }}
        >
          {post.title}
        </h3>
        <p
          style={{
            color: "var(--belvo-text-6)",
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.83rem",
            lineHeight: 1.68,
            margin: "0 0 18px",
          }}
        >
          {post.excerpt}
        </p>
        <span
          style={{
            alignItems: "center",
            color: "#b87cff",
            display: "inline-flex",
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.73rem",
            fontWeight: 700,
            gap: 7,
          }}
        >
          {post.pdfPath ? "Open stage PDF" : "Read article"} <ArrowRight size={14} />
        </span>
      </div>
    </motion.article>
  );
}

function CaseStudyCard({ study, index }: { study: CaseStudy; index: number }) {
  const handleOpen = () => openPdf(study.pdfPath);

  return (
    <motion.article
      custom={index}
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -5 }}
      onClick={handleOpen}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleOpen();
        }
      }}
      role="button"
      tabIndex={0}
      data-testid={`card-case-study-${study.slug}`}
      style={{
        background: "var(--belvo-bg-card)",
        border: "1px solid var(--belvo-border-card)",
        borderRadius: 18,
        cursor: "pointer",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          aspectRatio: "4 / 3",
          background: "#f7f3f8",
          borderBottom: "1px solid var(--belvo-border-card)",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <img
          src={study.cover}
          alt={`${study.title} case study cover`}
          loading="lazy"
          style={{ height: "100%", objectFit: "cover", objectPosition: "top", opacity: 1, width: "100%" }}
        />
        <span
          style={{
            backdropFilter: "blur(10px)",
            background: "rgba(12,7,23,0.76)",
            border: "1px solid rgba(255,255,255,0.16)",
            borderRadius: 999,
            color: "#fff",
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.62rem",
            fontWeight: 800,
            left: 12,
            letterSpacing: "0.08em",
            padding: "6px 10px",
            position: "absolute",
            top: 12,
          }}
        >
          {String(study.sequence).padStart(2, "0")}
        </span>
      </div>
      <div style={{ padding: 22 }}>
        <span
          style={{
            color: "#b87cff",
            display: "block",
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.62rem",
            fontWeight: 750,
            letterSpacing: "0.08em",
            marginBottom: 8,
            textTransform: "uppercase",
          }}
        >
          {study.focus}
        </span>
        <h3
          style={{
            color: "var(--belvo-text-1)",
            fontFamily: "'Inter', sans-serif",
            fontSize: "1.08rem",
            fontWeight: 820,
            margin: "0 0 10px",
          }}
        >
          {study.title}
        </h3>
        <p
          style={{
            color: "var(--belvo-text-6)",
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.82rem",
            lineHeight: 1.65,
            margin: "0 0 18px",
          }}
        >
          {study.excerpt}
        </p>
        <span
          style={{
            alignItems: "center",
            color: "#b87cff",
            display: "inline-flex",
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.73rem",
            fontWeight: 700,
            gap: 7,
          }}
        >
          Open case study PDF <ArrowRight size={14} />
        </span>
      </div>
    </motion.article>
  );
}

export default function Blogs() {
  const contentRef = useRef<HTMLElement | null>(null);
  const contentInView = useInView(contentRef, { once: true, margin: "-80px" });
  const [activeResource, setActiveResource] = useState<ResourceType>("blogs");
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const genZSlugs = [
    "gen-z-website-is-giving-2016",
    "gen-z-seo-isnt-dead",
    "gen-z-nobody-wants-your-logo",
  ];

  const genZPosts = blogPosts
    .filter((post) => genZSlugs.includes(post.slug))
    .sort((a, b) => {
      return genZSlugs.indexOf(a.slug) - genZSlugs.indexOf(b.slug);
    });

  const earlierPosts = blogPosts.filter(
    (post) => post.category !== "Startup Playbook" && !genZSlugs.includes(post.slug),
  );

  const startupPosts = blogPosts
    .filter((post) => post.category === "Startup Playbook")
    .sort((a, b) => a.slug.localeCompare(b.slug));

  const handleResourceSelect = (resource: ResourceType) => {
    setActiveResource(resource);
    window.requestAnimationFrame(() => {
      contentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  return (
    <>
      <section
        style={{
          alignItems: "center",
          background:
            "radial-gradient(circle at 18% 20%, rgba(255,154,201,0.16), transparent 28%), radial-gradient(circle at 82% 30%, rgba(157,78,221,0.34), transparent 30%), linear-gradient(145deg, #0a0512 0%, #1b0b30 52%, #08050e 100%)",
          display: "flex",
          justifyContent: "center",
          minHeight: "68vh",
          overflow: "hidden",
          padding: "132px 24px 92px",
          position: "relative",
          textAlign: "center",
        }}
      >
        <div
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.22) 0.7px, transparent 0.7px)",
            backgroundSize: "28px 28px",
            inset: 0,
            maskImage: "linear-gradient(to bottom, black, transparent 82%)",
            opacity: 0.22,
            pointerEvents: "none",
            position: "absolute",
          }}
        />
        <div style={{ maxWidth: 840, position: "relative", zIndex: 1 }}>
          <motion.span
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              alignItems: "center",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.14)",
              borderRadius: 999,
              color: "rgba(255,255,255,0.78)",
              display: "inline-flex",
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.67rem",
              fontWeight: 700,
              gap: 8,
              letterSpacing: "0.2em",
              marginBottom: 24,
              padding: "8px 15px",
              textTransform: "uppercase",
            }}
          >
            <FolderKanban size={13} /> Belvo knowledge hub
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08 }}
            style={{
              color: "#fff",
              fontFamily: "'Inter', sans-serif",
              fontSize: "clamp(2.7rem, 7vw, 6rem)",
              fontWeight: 900,
              letterSpacing: "-0.055em",
              lineHeight: 0.98,
              margin: "0 0 22px",
            }}
          >
            Ideas, stories &amp;
            <span
              style={{
                background: "linear-gradient(90deg, #c794ff, #ffb4d5)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {" "}proof.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.18 }}
            style={{
              color: "rgba(255,255,255,0.67)",
              fontFamily: "'Inter', sans-serif",
              fontSize: "clamp(0.94rem, 1.8vw, 1.1rem)",
              lineHeight: 1.75,
              margin: "0 auto",
              maxWidth: 650,
            }}
          >
            Explore Belvo's blogs, recurring newsletters, and client case studies from one focused resource page.
          </motion.p>
        </div>
      </section>

      <section
        style={{
          background: "var(--belvo-bg)",
          padding: "78px 24px 36px",
          position: "relative",
        }}
      >
        <div style={{ margin: "0 auto", maxWidth: 1180 }}>
          <div style={{ marginBottom: 34, maxWidth: 650 }}>
            <span
              style={{
                color: "#b87cff",
                display: "block",
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.66rem",
                fontWeight: 750,
                letterSpacing: "0.22em",
                marginBottom: 12,
                textTransform: "uppercase",
              }}
            >
              Top pickups from each section
            </span>
            <h2
              style={{
                color: "var(--belvo-text-1)",
                fontFamily: "'Inter', sans-serif",
                fontSize: "clamp(1.85rem, 4vw, 3.1rem)",
                fontWeight: 880,
                letterSpacing: "-0.04em",
                lineHeight: 1.08,
                margin: 0,
              }}
            >
              One page. Three useful libraries.
            </h2>
          </div>
          <ResourceSelector activeResource={activeResource} onSelect={handleResourceSelect} />
        </div>
      </section>

      <section
        ref={contentRef}
        id="resource-content"
        style={{
          background: "var(--belvo-bg)",
          padding: "74px 24px 118px",
          position: "relative",
        }}
      >
        <div style={{ margin: "0 auto", maxWidth: 1180 }}>
          {activeResource === "blogs" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: contentInView ? 1 : 0 }}>
              <div style={{ marginBottom: 38, maxWidth: 720 }}>
                <span
                  style={{
                    alignItems: "center",
                    color: "#b87cff",
                    display: "inline-flex",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.66rem",
                    fontWeight: 750,
                    gap: 8,
                    letterSpacing: "0.2em",
                    marginBottom: 13,
                    textTransform: "uppercase",
                  }}
                >
                  <Sparkles size={13} /> Gen Z trial series
                </span>
                <h2
                  style={{
                    color: "var(--belvo-text-1)",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "clamp(1.8rem, 4vw, 3rem)",
                    fontWeight: 880,
                    letterSpacing: "-0.04em",
                    lineHeight: 1.1,
                    margin: "0 0 13px",
                  }}
                >
                  Fresh thinking, without the corporate fog.
                </h2>
                <p
                  style={{
                    color: "var(--belvo-text-6)",
                    fontFamily: "'Inter', sans-serif",
                    lineHeight: 1.72,
                    margin: 0,
                    maxWidth: 630,
                  }}
                >
                  The first three posts test a playful but professional voice before the full series is expanded.
                </p>
              </div>
              <div
                style={{
                  display: "grid",
                  gap: 20,
                  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 310px), 1fr))",
                }}
              >
                {genZPosts.map((post, index) => (
                  <BlogCard key={post.slug} post={post} index={index} onOpen={setSelectedPost} />
                ))}
              </div>

              <div style={{ marginTop: 68 }}>
                <span
                  style={{
                    color: "#b87cff",
                    display: "block",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.66rem",
                    fontWeight: 750,
                    letterSpacing: "0.2em",
                    marginBottom: 11,
                    textTransform: "uppercase",
                  }}
                >
                  From the archive
                </span>
                <h3
                  style={{
                    color: "var(--belvo-text-1)",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "clamp(1.45rem, 3vw, 2.2rem)",
                    fontWeight: 850,
                    letterSpacing: "-0.03em",
                    margin: "0 0 25px",
                  }}
                >
                  Earlier Belvo blogs
                </h3>
                <div
                  style={{
                    display: "grid",
                    gap: 20,
                    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 310px), 1fr))",
                  }}
                >
                  {earlierPosts.map((post, index) => (
                    <BlogCard key={post.slug} post={post} index={index} onOpen={setSelectedPost} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeResource === "newsletters" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <div style={{ marginBottom: 38, maxWidth: 760 }}>
                <span
                  style={{
                    alignItems: "center",
                    color: "#b87cff",
                    display: "inline-flex",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.66rem",
                    fontWeight: 750,
                    gap: 8,
                    letterSpacing: "0.2em",
                    marginBottom: 13,
                    textTransform: "uppercase",
                  }}
                >
                  <CalendarDays size={13} /> Newsletter framework
                </span>
                <h2
                  style={{
                    color: "var(--belvo-text-1)",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "clamp(1.8rem, 4vw, 3rem)",
                    fontWeight: 880,
                    letterSpacing: "-0.04em",
                    lineHeight: 1.1,
                    margin: "0 0 13px",
                  }}
                >
                  Six pillars. One consistent point of view.
                </h2>
                <p
                  style={{
                    color: "var(--belvo-text-6)",
                    fontFamily: "'Inter', sans-serif",
                    lineHeight: 1.72,
                    margin: 0,
                  }}
                >
                  The startup playbook leads the calendar while Belvo's client, culture, growth, and team stories build the wider series.
                </p>
              </div>

              <div style={{ marginBottom: 58 }}>
                <span
                  style={{
                    color: "#b87cff",
                    display: "block",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.66rem",
                    fontWeight: 750,
                    letterSpacing: "0.2em",
                    marginBottom: 11,
                    textTransform: "uppercase",
                  }}
                >
                  Latest newsletter
                </span>
                <h3
                  style={{
                    color: "var(--belvo-text-1)",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "clamp(1.45rem, 3vw, 2.2rem)",
                    fontWeight: 850,
                    letterSpacing: "-0.03em",
                    margin: "0 0 24px",
                  }}
                >
                  A complete Gen Z workplace
                </h3>
                <div style={{ maxWidth: 520 }}>
                  <BlogCard post={workplaceNewsletter} index={0} onOpen={setSelectedPost} />
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gap: 15,
                  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 330px), 1fr))",
                  marginBottom: 58,
                }}
              >
                {newsletterPillars.map((pillar, index) => (
                  <motion.article
                    key={pillar.number}
                    custom={index}
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    style={{
                      background: pillar.number === "02"
                        ? "linear-gradient(145deg, rgba(157,78,221,0.17), rgba(255,154,201,0.06))"
                        : "var(--belvo-bg-card)",
                      border: pillar.number === "02"
                        ? "1px solid rgba(157,78,221,0.46)"
                        : "1px solid var(--belvo-border-card)",
                      borderRadius: 18,
                      minHeight: 225,
                      padding: 24,
                    }}
                  >
                    <div style={{ alignItems: "center", display: "flex", justifyContent: "space-between", marginBottom: 30 }}>
                      <span
                        style={{
                          color: "rgba(184,124,255,0.72)",
                          fontFamily: "'Inter', sans-serif",
                          fontSize: "0.72rem",
                          fontWeight: 800,
                          letterSpacing: "0.12em",
                        }}
                      >
                        {pillar.number}
                      </span>
                      <span
                        style={{
                          background: "rgba(157,78,221,0.1)",
                          border: "1px solid rgba(157,78,221,0.2)",
                          borderRadius: 999,
                          color: "var(--belvo-text-2)",
                          fontFamily: "'Inter', sans-serif",
                          fontSize: "0.62rem",
                          fontWeight: 650,
                          padding: "5px 9px",
                        }}
                      >
                        {pillar.label}
                      </span>
                    </div>
                    <h3
                      style={{
                        color: "var(--belvo-text-1)",
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "1.03rem",
                        fontWeight: 800,
                        lineHeight: 1.42,
                        margin: "0 0 10px",
                      }}
                    >
                      {pillar.title}
                    </h3>
                    <p
                      style={{
                        color: "var(--belvo-text-6)",
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "0.82rem",
                        lineHeight: 1.68,
                        margin: 0,
                      }}
                    >
                      {pillar.description}
                    </p>
                  </motion.article>
                ))}
              </div>

              <div
                style={{
                  alignItems: "flex-end",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 18,
                  justifyContent: "space-between",
                  marginBottom: 26,
                }}
              >
                <div style={{ maxWidth: 700 }}>
                  <span
                    style={{
                      color: "#b87cff",
                      display: "block",
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.66rem",
                      fontWeight: 750,
                      letterSpacing: "0.2em",
                      marginBottom: 11,
                      textTransform: "uppercase",
                    }}
                  >
                    Complete founder series
                  </span>
                  <h3
                    style={{
                      color: "var(--belvo-text-1)",
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "clamp(1.45rem, 3vw, 2.2rem)",
                      fontWeight: 850,
                      letterSpacing: "-0.03em",
                      margin: 0,
                    }}
                  >
                    Start a Company From Scratch
                  </h3>
                </div>
                <span
                  style={{
                    alignItems: "center",
                    color: "var(--belvo-text-2)",
                    display: "inline-flex",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.73rem",
                    gap: 7,
                  }}
                >
                  <CheckCircle2 color="#b87cff" size={15} /> All 9 stages ready
                </span>
              </div>
              <div
                style={{
                  display: "grid",
                  gap: 20,
                  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 310px), 1fr))",
                }}
              >
                {startupPosts.map((post, index) => (
                  <BlogCard key={post.slug} post={post} index={index} onOpen={setSelectedPost} />
                ))}
              </div>
            </motion.div>
          )}

          {activeResource === "case-studies" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <div style={{ marginBottom: 38, maxWidth: 760 }}>
                <span
                  style={{
                    alignItems: "center",
                    color: "#b87cff",
                    display: "inline-flex",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.66rem",
                    fontWeight: 750,
                    gap: 8,
                    letterSpacing: "0.2em",
                    marginBottom: 13,
                    textTransform: "uppercase",
                  }}
                >
                  <BriefcaseBusiness size={13} /> Case study library
                </span>
                <h2
                  style={{
                    color: "var(--belvo-text-1)",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "clamp(1.8rem, 4vw, 3rem)",
                    fontWeight: 880,
                    letterSpacing: "-0.04em",
                    lineHeight: 1.1,
                    margin: "0 0 13px",
                  }}
                >
                  Real work, explained clearly.
                </h2>
                <p
                  style={{
                    color: "var(--belvo-text-6)",
                    fontFamily: "'Inter', sans-serif",
                    lineHeight: 1.72,
                    margin: 0,
                  }}
                >
                  Each client story is an evergreen resource focused on the problem, Belvo's response, and the measurable outcome.
                </p>
              </div>

              <div
                style={{
                  background: "linear-gradient(145deg, rgba(157,78,221,0.12), rgba(255,154,201,0.045))",
                  border: "1px solid rgba(157,78,221,0.28)",
                  borderRadius: 24,
                  overflow: "hidden",
                  padding: "clamp(26px, 5vw, 46px)",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gap: 16,
                    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))",
                  }}
                >
                  {caseStudySteps.map((step, index) => (
                    <div
                      key={step.title}
                      style={{
                        background: "var(--belvo-bg-card)",
                        border: "1px solid var(--belvo-border-card)",
                        borderRadius: 16,
                        minHeight: 185,
                        padding: 22,
                      }}
                    >
                      <span
                        style={{
                          alignItems: "center",
                          background: "rgba(157,78,221,0.12)",
                          borderRadius: 10,
                          color: "#b87cff",
                          display: "flex",
                          fontFamily: "'Inter', sans-serif",
                          fontSize: "0.7rem",
                          fontWeight: 800,
                          height: 34,
                          justifyContent: "center",
                          marginBottom: 22,
                          width: 34,
                        }}
                      >
                        {index + 1}
                      </span>
                      <h3
                        style={{
                          color: "var(--belvo-text-1)",
                          fontFamily: "'Inter', sans-serif",
                          fontSize: "1rem",
                          fontWeight: 800,
                          margin: "0 0 9px",
                        }}
                      >
                        {step.title}
                      </h3>
                      <p
                        style={{
                          color: "var(--belvo-text-6)",
                          fontFamily: "'Inter', sans-serif",
                          fontSize: "0.81rem",
                          lineHeight: 1.67,
                          margin: 0,
                        }}
                      >
                        {step.description}
                      </p>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    alignItems: "center",
                    borderTop: "1px solid rgba(157,78,221,0.18)",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 16,
                    justifyContent: "space-between",
                    marginTop: 30,
                    paddingTop: 26,
                  }}
                >
                  <div style={{ alignItems: "center", display: "flex", gap: 12 }}>
                    <div
                      style={{
                        alignItems: "center",
                        background: "rgba(157,78,221,0.12)",
                        borderRadius: 12,
                        color: "#b87cff",
                        display: "flex",
                        height: 42,
                        justifyContent: "center",
                        width: 42,
                      }}
                    >
                      <FileText size={19} />
                    </div>
                    <div>
                      <strong
                        style={{
                          color: "var(--belvo-text-1)",
                          display: "block",
                          fontFamily: "'Inter', sans-serif",
                          fontSize: "0.86rem",
                        }}
                      >
                        14 reviewed case studies
                      </strong>
                      <span
                        style={{
                          color: "var(--belvo-text-6)",
                          fontFamily: "'Inter', sans-serif",
                          fontSize: "0.73rem",
                        }}
                      >
                        Open any card below to read the complete case study PDF.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 48 }}>
                <div
                  style={{
                    alignItems: "flex-end",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 16,
                    justifyContent: "space-between",
                    marginBottom: 25,
                  }}
                >
                  <div>
                    <span
                      style={{
                        color: "#b87cff",
                        display: "block",
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "0.66rem",
                        fontWeight: 750,
                        letterSpacing: "0.2em",
                        marginBottom: 10,
                        textTransform: "uppercase",
                      }}
                    >
                      In the supplied sequence
                    </span>
                    <h3
                      style={{
                        color: "var(--belvo-text-1)",
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "clamp(1.45rem, 3vw, 2.2rem)",
                        fontWeight: 850,
                        letterSpacing: "-0.03em",
                        margin: 0,
                      }}
                    >
                      Client case studies
                    </h3>
                  </div>
                  <span
                    style={{
                      color: "var(--belvo-text-2)",
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.73rem",
                    }}
                  >
                    Ordered as supplied
                  </span>
                </div>
                <div
                  style={{
                    display: "grid",
                    gap: 20,
                    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 310px), 1fr))",
                  }}
                >
                  {caseStudies.map((study, index) => (
                    <CaseStudyCard key={study.slug} study={study} index={index} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      <Dialog open={Boolean(selectedPost)} onOpenChange={(open) => { if (!open) setSelectedPost(null); }}>
        <DialogContent
          style={{
            background: "var(--belvo-bg-card)",
            border: "1px solid rgba(157,78,221,0.24)",
            borderRadius: 22,
            boxShadow: "0 24px 80px rgba(0,0,0,0.36)",
            maxHeight: "88vh",
            maxWidth: 900,
            overflowY: "auto",
            padding: 0,
            width: "min(92vw, 900px)",
          }}
        >
          {selectedPost && (
            <div>
              <div
                style={{
                  aspectRatio: "16 / 7",
                  backgroundImage: `url(${selectedPost.thumbnail})`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  borderBottom: "1px solid var(--belvo-border-card)",
                }}
              />
              <div style={{ padding: "28px clamp(22px, 5vw, 42px) 38px" }}>
                <DialogHeader style={{ marginBottom: 22 }}>
                  <DialogTitle
                    style={{
                      color: "var(--belvo-text-1)",
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "clamp(1.35rem, 3vw, 2rem)",
                      fontWeight: 850,
                      lineHeight: 1.25,
                    }}
                  >
                    {selectedPost.title}
                  </DialogTitle>
                  <DialogDescription
                    style={{
                      alignItems: "center",
                      color: "var(--belvo-text-2)",
                      display: "flex",
                      flexWrap: "wrap",
                      fontFamily: "'Inter', sans-serif",
                      gap: 8,
                    }}
                  >
                    <span>{selectedPost.category}</span>
                    <span aria-hidden="true">•</span>
                    <span>{selectedPost.date}</span>
                  </DialogDescription>
                </DialogHeader>
                <div>{renderBlogContent(selectedPost.content)}</div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </>
  );
}
