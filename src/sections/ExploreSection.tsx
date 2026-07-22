import { motion, useInView } from "framer-motion";
import {
  Clapperboard,
  Pause,
  Play,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useRef, useState } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

const showcaseVideos = [
  {
    src: "/videos/belvo-showcase-01.mp4",
    title: "Stories made to be watched.",
    copy: "Quick cuts, bold ideas, zero boring bits. Tap in for Belvo's latest video work.",
    rotate: true,
  },
  {
    src: "/videos/belvo-showcase-03.mp4",
    title: "The process deserves screen time.",
    copy: "Good work isn't magic—it's sharp thinking, clean execution, and a team that cares.",
    rotate: false,
  },
  {
    src: "/videos/belvo-showcase-04.mp4",
    title: "Co-founder chaos, decoded.",
    copy: "Building together works better when the roles, trust, and hard conversations are clear from day one.",
    rotate: false,
  },
  {
    src: "/videos/belvo-showcase-05.mp4",
    title: "Content without the chaos.",
    copy: "Break the big plan into a system your team can actually create, repeat, and grow with.",
    rotate: false,
  },
  {
    src: "/videos/belvo-showcase-06.mp4",
    title: "Built for right now.",
    copy: "Fresh thinking, sharp execution, and content that understands the moment before the moment moves on.",
    rotate: false,
  },
] as const;

function FeaturedVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const activeVideo = showcaseVideos[activeVideoIndex];

  const togglePlayback = async () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      try {
        await video.play();
      } catch {
        setIsPlaying(false);
      }
    } else {
      video.pause();
    }
  };

  return (
    <div
      id="belvo-videos"
      className="grid lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)]"
      style={{
        marginTop: "28px",
        border: "1px solid var(--belvo-border-card)",
        borderRadius: "28px",
        overflow: "hidden",
        background: "var(--belvo-bg-card)",
        boxShadow: "0 28px 80px rgba(39, 8, 68, 0.16)",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          minWidth: 0,
          aspectRatio: "16 / 9",
          minHeight: "280px",
          overflow: "hidden",
          background: "#0b0714",
        }}
      >
        <video
          key={activeVideo.src}
          ref={videoRef}
          src={activeVideo.src}
          preload="metadata"
          playsInline
          muted={isMuted}
          disablePictureInPicture
          disableRemotePlayback
          controlsList="nodownload noplaybackrate noremoteplayback"
          data-testid="video-showcase-player"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
          onClick={togglePlayback}
          aria-label={`Belvo featured video ${activeVideoIndex + 1}`}
          style={activeVideo.rotate ? rotatedVideoStyle : horizontalVideoStyle}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "linear-gradient(180deg, rgba(4,0,14,0.36) 0%, transparent 34%, rgba(4,0,14,0.44) 100%)",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: "18px",
            left: "18px",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "7px 12px",
            borderRadius: "999px",
            color: "white",
            background: "rgba(4, 0, 14, 0.6)",
            border: "1px solid rgba(255,255,255,0.18)",
            backdropFilter: "blur(14px)",
            fontSize: "0.68rem",
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}
        >
          <Clapperboard size={14} />
          Video {String(activeVideoIndex + 1).padStart(2, "0")}
        </div>

        {!isPlaying && (
          <button
            type="button"
            onClick={togglePlayback}
            aria-label="Play video"
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: "66px",
              height: "66px",
              display: "grid",
              placeItems: "center",
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.38)",
              color: "white",
              background: "rgba(91,26,138,0.82)",
              boxShadow: "0 12px 36px rgba(4,0,14,0.34)",
              backdropFilter: "blur(16px)",
              cursor: "pointer",
            }}
          >
            <Play size={22} fill="currentColor" style={{ marginLeft: "3px" }} />
          </button>
        )}

        <div
          style={{
            position: "absolute",
            right: "16px",
            bottom: "16px",
            display: "flex",
            gap: "8px",
          }}
        >
          {isPlaying && (
            <button
              type="button"
              onClick={togglePlayback}
              aria-label="Pause video"
              style={controlButtonStyle}
            >
              <Pause size={16} fill="currentColor" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsMuted((muted) => !muted)}
            aria-label={isMuted ? "Unmute video" : "Mute video"}
            style={controlButtonStyle}
          >
            {isMuted ? <VolumeX size={17} /> : <Volume2 size={17} />}
          </button>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "clamp(28px, 5vw, 54px)",
          borderLeft: "1px solid var(--belvo-border-card)",
        }}
      >
        <span
          style={{
            color: "#9D4EDD",
            fontSize: "0.68rem",
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            marginBottom: "14px",
          }}
        >
          Featured watch
        </span>
        <h3
          style={{
            color: "var(--belvo-text-1)",
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(1.8rem, 3vw, 2.7rem)",
            fontWeight: 700,
            lineHeight: 1.05,
            margin: "0 0 16px",
          }}
        >
          {activeVideo.title}
        </h3>
        <p
          style={{
            color: "var(--belvo-text-2)",
            fontSize: "0.94rem",
            lineHeight: 1.75,
            margin: 0,
          }}
        >
          {activeVideo.copy}
        </p>

        <div
          aria-label="Choose a featured video"
          style={{ display: "flex", gap: "9px", marginTop: "24px" }}
        >
          {showcaseVideos.map((video, index) => {
            const isActive = index === activeVideoIndex;
            return (
              <button
                key={video.src}
                type="button"
                aria-pressed={isActive}
                aria-label={`Show video ${index + 1}`}
                data-testid={`button-video-select-${index + 1}`}
                onClick={() => {
                  videoRef.current?.pause();
                  setIsPlaying(false);
                  setActiveVideoIndex(index);
                }}
                style={{
                  minWidth: "56px",
                  height: "38px",
                  padding: "0 14px",
                  borderRadius: "999px",
                  border: isActive
                    ? "1px solid rgba(157,78,221,0.72)"
                    : "1px solid var(--belvo-border-card)",
                  color: isActive ? "#ffffff" : "var(--belvo-text-2)",
                  background: isActive
                    ? "linear-gradient(135deg, #7B2FBE, #9D4EDD)"
                    : "var(--belvo-bg-card-2)",
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  letterSpacing: "0.12em",
                  cursor: "pointer",
                }}
              >
                {String(index + 1).padStart(2, "0")}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const rotatedVideoStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  width: "56.25%",
  height: "177.78%",
  maxWidth: "none",
  objectFit: "cover",
  transform: "translate(-50%, -50%) rotate(-90deg)",
  cursor: "pointer",
} as const;

const horizontalVideoStyle = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  cursor: "pointer",
} as const;

const controlButtonStyle = {
  width: "42px",
  height: "42px",
  display: "grid",
  placeItems: "center",
  borderRadius: "50%",
  border: "1px solid rgba(255,255,255,0.2)",
  color: "white",
  background: "rgba(4,0,14,0.68)",
  backdropFilter: "blur(14px)",
  cursor: "pointer",
} as const;

export default function ExploreSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-90px" });

  return (
    <section
      ref={sectionRef}
      id="explore"
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "90px 24px 120px",
        background: "var(--belvo-bg)",
        borderTop: "1px solid var(--belvo-border-bottom)",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          width: "560px",
          height: "560px",
          right: "-220px",
          top: "-220px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(157,78,221,0.11), transparent 68%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", zIndex: 1, maxWidth: "1180px", margin: "0 auto" }}>
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          style={{ maxWidth: "700px", marginBottom: "36px" }}
        >
          <span
            style={{
              color: "#9D4EDD",
              fontSize: "0.68rem",
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            Belvo on screen
          </span>
          <h2
            style={{
              color: "var(--belvo-text-1)",
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2.2rem, 4.8vw, 4rem)",
              fontWeight: 700,
              lineHeight: 1.02,
              margin: "12px 0 14px",
            }}
          >
            Press play. We'll do the rest.
          </h2>
          <p style={{ color: "var(--belvo-text-2)", lineHeight: 1.75, margin: 0 }}>
            Campaign moments, creative experiments, and work that simply hits better in motion.
          </p>
        </motion.div>

        <motion.div
          custom={0.08}
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <FeaturedVideo />
        </motion.div>
      </div>
    </section>
  );
}
