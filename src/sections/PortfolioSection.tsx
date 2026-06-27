import { useRef, useState } from "react";
import { motion, useInView, useAnimationFrame } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";

interface Props {
  id: string;
}

interface Brand {
  name: string;
  url: string;
  logo?: string;
}

interface Category {
  name: string;
  count: number;
  color: string;
  brands: Brand[];
}

const CATEGORIES: Category[] = [
  { name: "Skincare, Beauty & Personal Care", count: 12, color: "#E11D48", brands: [
    { name: "Ghar Soaps", url: "https://www.instagram.com/gharsoaps?igsh=MW9rMm1hOWNxMG9yYw==" },{ name: "Clayco Beauty", url: "https://www.instagram.com/claycobeauty?igsh=MXU0OHV1ZG0ybXl0bw==" },{ name: "Prowlactive", url: "https://www.instagram.com/prowlactive?igsh=MTAyMTlxNXJxaXh0bw==" },{ name: "Skinvest Skincare", url: "https://www.instagram.com/skinvest.skincare?igsh=eTAwNWhpa3F4dDhy" },{ name: "Grovya Organics", url: "https://www.instagram.com/grovyaorganics?igsh=MTVpN2J0MmljMWR0MA==" },{ name: "Bentica Skincare", url: "https://www.instagram.com/bentica.skincare?igsh=anR0aHhmNXJrbmZi" },{ name: "Mancode", url: "https://www.instagram.com/mancode.official?igsh=MWcxaXpyN2puaWE0YQ==" },{ name: "The Skin Story", url: "https://www.instagram.com/theskinstory_official?igsh=MTUxcTMwcGR0cnBjbQ==" },{ name: "Beard Story", url: "https://www.instagram.com/beardstory_official?igsh=MXczczEzano4OHRpdQ==" },{ name: "Arotatvika", url: "https://www.instagram.com/arotatvika?igsh=dmUyYzhodTBjN200" },{ name: "Sen-Z by FDNH", url: "https://www.instagram.com/senzbyfdnh.co?igsh=dmVxb3BveDFkOHpw" },{ name: "Illume Skin Care", url: "https://www.instagram.com/illumeskin.care?igsh=MWxjNnNwMXF1dHVnaw==" },
  ]},
  { name: "Fashion, Apparel & Lifestyle", count: 11, color: "#F97316", brands: [
    { name: "Bewakoof", url: "https://www.instagram.com/bewakoofofficial?igsh=eXB2dDllbXM2dXVo" },{ name: "Vasa Indica", url: "https://www.instagram.com/vasaindica?igsh=aDBiZHloZmphdTVq" },{ name: "Ahankar Wear", url: "https://www.instagram.com/ahankarwear?igsh=MWNlODVzamhzNzVscg==" },{ name: "Oje Living", url: "https://www.instagram.com/oje.living?igsh=MjdycjEwczd3eTE2" },{ name: "Goodhand Jaipur", url: "https://www.instagram.com/goodhand_jaipur?igsh=MTh6d3dxMmZ1bXl0cw==" },{ name: "Pironi", url: "https://www.instagram.com/pironi.official?igsh=MWc4czQxb3ZidmswdQ==" },{ name: "Shop Sagel", url: "https://www.instagram.com/shop.sagel?igsh=Mm1sZHJ0M3I1enMz" },{ name: "Better Basics", url: "https://www.instagram.com/betterbasics_in?igsh=MXFzcGVtNWNycTNsMw==" },{ name: "Modern Saheli", url: "https://www.instagram.com/modernsaheli?igsh=MThoaTdwM2xncXM1Zw==" },{ name: "Northstory", url: "https://www.instagram.com/northstory.shop?igsh=Y3lzejB6OGt3cWpp" },{ name: "KSHM Earth", url: "https://www.instagram.com/kshm.earth?igsh=YWN0M2ViOHFydnNw" },
  ]},
  { name: "Food, Snacks & FMCG", count: 7, color: "#F59E0B", brands: [
    { name: "Chakki Peesing", url: "https://www.instagram.com/chakki.peesing?igsh=Z28zaXc1a2x1cTV5" },{ name: "Beyond Snacks", url: "https://www.instagram.com/beyondsnacks?igsh=dWxjejJqcGI4YW96" },{ name: "The 1970 Shop", url: "https://www.instagram.com/the1970shop?igsh=MWxvMml4eTZlNTUzdg==" },{ name: "Greenify Foods", url: "https://www.instagram.com/greenifyfoods_jaipur?igsh=ZmplczNkY3NkcWp2" },{ name: "SIL Foods", url: "https://www.instagram.com/silfoods?igsh=MWphMnNlNnlsMXdicQ==" },{ name: "Mangalam Homemade", url: "https://www.instagram.com/___mangalamhomemade_?igsh=Z2pneXgxbHg2ODU2" },{ name: "Oh! Nuts", url: "https://www.instagram.com/ohnuts?igsh=NXlmdnZiaXhoM3Uw" },
  ]},
  { name: "Cafés, Restro & Hospitality", count: 15, color: "#0D9488", brands: [
    { name: "The Habitat Café", url: "https://www.instagram.com/thehabitatcafe?igsh=NDJieWgya3FydnB1" },{ name: "The Nine Cafe", url: "https://www.instagram.com/theninecafe?igsh=dGVtejF0emowZmlw" },{ name: "Cincin India", url: "https://www.instagram.com/cincinindia?igsh=MTBpaDh6NTFvMzBlNw==" },{ name: "Meltado", url: "https://www.instagram.com/meltado_?igsh=M3Y5d3BoamV2dXBh" },{ name: "Kathha Katte", url: "https://www.instagram.com/katthakatte?igsh=eHpuMWt5dG8xYzE0" },{ name: "Positano Mumbai", url: "https://www.instagram.com/positano_mumbai?igsh=aTA0aWFrcmtyejhw" },{ name: "Cacao Love by Ashrita", url: "https://www.instagram.com/cacaolovebyashrita?igsh=N2QybXF3YnlrZTR4" },{ name: "307 Bakehouse", url: "https://www.instagram.com/307bakehouse?igsh=ZHhvM2pia3I2aWJq" },{ name: "Timber Cafe", url: "https://www.instagram.com/timber_cafe?igsh=MTBsZWNrZWZ6OHo0aw==" },{ name: "Afterdunes Cafe", url: "https://www.instagram.com/afterdunescafe?igsh=MThyZnc0cDRmMjFnOQ==" },{ name: "San Churro Bandra", url: "https://www.instagram.com/sanchurro_bandra?igsh=YmZ3dGdjZnhqZXN0" },{ name: "6 Degree North", url: "https://www.instagram.com/6degreenorth?igsh=MTdkZTJremoycjBiZQ==" },{ name: "Kapi Barr", url: "https://www.instagram.com/kapi.barr?igsh=Y2Y5OXNjdGFpenQz" },{ name: "Portal Mumbai", url: "https://www.instagram.com/portal.mumbai?igsh=cWpsaWZ0MXF2eGZh" },{ name: "Amaru Mumbai", url: "https://www.instagram.com/amaru_mumbai?igsh=MTliZ2R1c3NrMDZ6Nw==" },
  ]},
  { name: "EdTech", count: 3, color: "#2563EB", brands: [
    { name: "Leaping Frogs", url: "https://www.instagram.com/leapingfrogs.theschool?igsh=" },{ name: "Trigr Exam", url: "https://www.instagram.com/trigrexam?igsh=MXF3ZTF5Y3Fka3Jydg==" },{ name: "Educurria", url: "https://www.instagram.com/educuria?igsh=MzBoZDRtZWM4NDh6" },
  ]},
  { name: "FinTech", count: 3, color: "#059669", brands: [
    { name: "Fasset", url: "https://www.instagram.com/fasset_official?igsh=MXZ2dGZwbGlzdmc1cw==" },{ name: "Cready", url: "https://www.instagram.com/cready_official?igsh=aXBqdGpjd2t3cmhz" },{ name: "Getepay", url: "https://www.instagram.com/getepay.in?igsh=MW0ycmd1MDFrZDUydw==" },
  ]},
  { name: "Modeling", count: 3, color: "#EC4899", brands: [
    { name: "72 MG Studio", url: "https://www.instagram.com/72mgstudio?igsh=MWk2ZTBtMmlleWMyaA==" },{ name: "Venera Workshops", url: "https://www.instagram.com/venera_workshops?igsh=MXNubGZuMmlzcDhmMA==" },{ name: "Ella Models India", url: "https://www.instagram.com/ellamodelsindia?igsh=MXUxaWhrazNhanM0bw==" },
  ]},
  { name: "Jewellery & Luxury Accessories", count: 3, color: "#D97706", brands: [
    { name: "Sutra Fine Jewellery", url: "https://www.instagram.com/sutrafinejewellery?igsh=bWZ2aDM5N3l2bHVs" },{ name: "Qlumsi Jewelry", url: "https://www.instagram.com/qlumsi.jewelry?igsh=MTF0aDBwYXRzaXR0Mg==" },{ name: "Pirohaa Jewellery", url: "https://www.instagram.com/pirohaa_jewellery?igsh=MXJ1NjA2aWd6NDhkZw==" },
  ]},
  { name: "Interior Design & Architecture", count: 2, color: "#6366F1", brands: [
    { name: "Karan Desai A.D.", url: "https://www.instagram.com/karandesai_a.d?igsh=MTN1c3phaDY5OWdoNQ==" },{ name: "Karan Desai Home", url: "https://www.instagram.com/karandesaihome?igsh=MXQ4aThiaHprc28wbg==" },
  ]},
  { name: "Travels & Tourism", count: 2, color: "#0284C7", brands: [
    { name: "The Safarnama", url: "https://www.instagram.com/thesafarnama?igsh=MXRrMnppMmp4MGhvZA==" },{ name: "Air Time Vacations", url: "https://www.instagram.com/airtimevacations?igsh=b2ZrNXE3dWg1a2Y=" },
  ]},
  { name: "Healthcare, Hospitals & Clinics", count: 3, color: "#DC2626", brands: [
    { name: "AK Clinics", url: "https://www.instagram.com/ak.clinics?igsh=dDJnMWhoYnZlN256" },{ name: "Narayana One Health", url: "https://www.instagram.com/narayanaonehealth?igsh=Nnp1cnAxMDMzMmw4" },{ name: "Royal Dental Clinics", url: "https://www.instagram.com/royaldentalclinics?igsh=MXBieXJyNXkwbHNzcg==" },
  ]},
  { name: "Salon, Spa & Aesthetics", count: 2, color: "#8B5CF6", brands: [
    { name: "Envi Salon Spa", url: "https://www.instagram.com/envisalonspa?igsh=MWMyZDBubjduaHpibQ==" },{ name: "Daisy House", url: "https://www.instagram.com/daisyhouseofficial_?igsh=MTY5Nnlnd3ptamU0dg==" },
  ]},
];

const SERVICES_DELIVERED = [
  "Public Relations (PR) & Outreach", "Influencer Marketing", "Social Media Management",
  "Graphic Design", "Website Design & Development", "Research & Competitor Analysis",
  "Analytics & Performance Reporting", "Brand Strategy", "Community Management",
  "Direct Marketing (DM Campaigns)", "Content Strategy", "Growth Marketing",
  "Brand Positioning", "E-commerce Support", "Lead Generation",
];

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
   visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.08 + i * 0.05, ease: [0.16, 1, 0.3, 1] as const } }),
};

const CATEGORY_FOLDERS: Record<string, string> = {
  "Skincare, Beauty & Personal Care": "SKINCARE, BEAUTY & WELLNESS",
  "Fashion, Apparel & Lifestyle": "Fahion",
  "Cafés, Restro & Hospitality": "Cafe",
  "Food, Snacks & FMCG": "Food",
  "EdTech": "EdTech",
  "FinTech": "Fintech",
  "Modeling": "Model",
  "Jewellery & Luxury Accessories": "Jwel",
  "Interior Design & Architecture": "Interior",
  "Travels & Tourism": "Tour",
  "Healthcare, Hospitals & Clinics": "Health",
  "Salon, Spa & Aesthetics": "Spa",
};

function getLogoPath(categoryName: string, url: string): string | undefined {
  const folder = CATEGORY_FOLDERS[categoryName];
  if (!folder || !url) return undefined;
  let handle = url.replace(/\/+$/, "").split("/").pop()?.split("?")[0];
  if (!handle) return undefined;
  const FIXES: Record<string, string> = {};
  if (handle in FIXES) {
    if (!FIXES[handle]) return undefined;
    handle = FIXES[handle];
  }
  return `/PortfoilioLogos/${folder}/${handle}.jpg`;
}

function hexToRgb(hex: string): string {
  const v = parseInt(hex.replace("#", ""), 16);
  return `${(v >> 16) & 255},${(v >> 8) & 255},${v & 255}`;
}

function BrandBadge({ logoSrc, initial, color, rgb }: { logoSrc: string | undefined; initial: string; color: string; rgb: string }) {
  const [showLetter, setShowLetter] = useState(false);
  const containerStyle: React.CSSProperties = {
    width: "60px", height: "60px", borderRadius: "14px",
    flexShrink: 0, overflow: "hidden",
    background: `linear-gradient(135deg,rgba(${rgb},0.22),rgba(${rgb},0.08))`,
    border: `1px solid rgba(${rgb},0.2)`,
    display: "inline-flex", alignItems: "center", justifyContent: "center",
  };

  if (logoSrc && !showLetter) {
    return (
      <span style={containerStyle}>
        <img
          src={logoSrc}
          alt={initial}
          style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "14px" }}
          onError={() => setShowLetter(true)}
        />
      </span>
    );
  }

  return (
    <span style={{
      ...containerStyle,
      fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: "1.1rem",
      color: color,
    }}>
      {initial}
    </span>
  );
}

function BrandRow({ catName, brands, color, isIvory }: { catName: string; brands: Brand[]; color: string; isIvory: boolean }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const xRef = useRef(0);

  useAnimationFrame((time, delta) => {
    if (paused || !trackRef.current) return;
    const speed = 0.2;
    xRef.current -= speed * (delta / 16);
    const halfW = trackRef.current.scrollWidth / 2;
    if (Math.abs(xRef.current) >= halfW) {
      xRef.current = 0;
    }
    trackRef.current.style.transform = `translateX(${xRef.current}px)`;
  });

  const rgb = hexToRgb(color);

  function BrandItem({ brand, i }: { brand: Brand; i: number }) {
    const initial = brand.name.replace(/['"]/g, "").charAt(0).toUpperCase();
    const logoSrc = getLogoPath(catName, brand.url) || undefined;
    const badge = <BrandBadge logoSrc={logoSrc} initial={initial} color={color} rgb={rgb} />;
    const baseStyle: React.CSSProperties = {
      display: "inline-flex", alignItems: "center", gap: "10px",
      padding: "8px 18px 8px 12px",
      background: isIvory
        ? `linear-gradient(135deg, rgba(${rgb},0.07), rgba(${rgb},0.03))`
        : `linear-gradient(135deg, rgba(${rgb},0.09), rgba(${rgb},0.03))`,
      border: `1px solid rgba(${rgb},0.12)`,
      borderRadius: "100px",
      fontFamily: "'Inter',sans-serif", fontSize: "0.85rem", fontWeight: 500,
      color: "var(--belvo-text-1)",
      whiteSpace: "nowrap",
      flexShrink: 0,
      transition: "background 0.2s, border-color 0.2s",
    };
    const inner = (
      <>
        {badge}
        <span style={{ position: "relative", top: "1px" }}>{brand.name}</span>
      </>
    );
    if (brand.url) {
      return (
        <a
          key={`${brand.name}-${i}`}
          href={brand.url}
          target="_blank"
          rel="noopener noreferrer"
          title={brand.name}
          style={{ ...baseStyle, textDecoration: "none" }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLElement;
            el.style.background = `rgba(${rgb},0.15)`;
            el.style.borderColor = `rgba(${rgb},0.35)`;
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLElement;
            el.style.background = isIvory
              ? `linear-gradient(135deg, rgba(${rgb},0.07), rgba(${rgb},0.03))`
              : `linear-gradient(135deg, rgba(${rgb},0.09), rgba(${rgb},0.03))`;
            el.style.borderColor = `rgba(${rgb},0.12)`;
          }}
        >
          {inner}
        </a>
      );
    }
    return <span key={`${brand.name}-${i}`} title={brand.name} style={baseStyle}>{inner}</span>;
  }

  return (
    <div
      style={{ overflow: "hidden", width: "100%", position: "relative" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0, width: "60px", zIndex: 2,
        background: `linear-gradient(to right, var(--belvo-bg), transparent)`,
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", right: 0, top: 0, bottom: 0, width: "60px", zIndex: 2,
        background: `linear-gradient(to left, var(--belvo-bg), transparent)`,
        pointerEvents: "none",
      }} />

      <div
        ref={trackRef}
        style={{ display: "flex", gap: "12px", willChange: "transform", width: "fit-content" }}
      >
        {[...brands, ...brands].map((brand, i) => (
          <BrandItem key={`${brand.name}-${i}`} brand={brand} i={i} />
        ))}
      </div>
    </div>
  );
}

export default function PortfolioSection({ id }: Props) {
  const { theme } = useTheme();
  const isIvory = theme === "ivory";
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-80px" });

  return (
    <section
      id={id}
      style={{
        background: "var(--belvo-bg)",
        padding: "120px 0 140px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{
        position: "absolute", top: "10%", left: "5%", width: "50vw", height: "60vh",
        background: isIvory
          ? "radial-gradient(ellipse at center, rgba(123,47,190,0.05) 0%, transparent 70%)"
          : "radial-gradient(ellipse at center, rgba(80,15,140,0.10) 0%, transparent 70%)",
        filter: "blur(100px)", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "15%", right: "0%", width: "40vw", height: "50vh",
        background: isIvory
          ? "radial-gradient(ellipse at center, rgba(157,78,221,0.04) 0%, transparent 70%)"
          : "radial-gradient(ellipse at center, rgba(157,78,221,0.06) 0%, transparent 70%)",
        filter: "blur(100px)", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `radial-gradient(rgba(130,40,200,${isIvory ? "0.04" : "0.06"}) 1px, transparent 1px)`,
        backgroundSize: "28px 28px",
        pointerEvents: "none",
      }} />

      <div style={{ position: "absolute", top: "0px", left: "0px", right: "0px", height: "1px", background: "linear-gradient(90deg, transparent, var(--belvo-border-divider), transparent)" }} />

      <div ref={headerRef} style={{ padding: "0 24px", maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate={headerInView ? "visible" : "hidden"}
          style={{ textAlign: "center", marginBottom: "64px" }}
        >
          <span style={{
            display: "inline-block",
            fontFamily: "'Inter',sans-serif", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#9D4EDD",
            padding: "6px 16px",
            borderRadius: "100px",
            background: `rgba(157,78,221,${isIvory ? "0.08" : "0.1"})`,
            border: `1px solid rgba(157,78,221,${isIvory ? "0.15" : "0.18"})`,
            marginBottom: "20px",
          }}>
            Our Portfolio
          </span>
          <h2 style={{
            fontFamily: "'Cormorant Garamond',serif", fontWeight: 700,
            fontSize: "clamp(2rem,4.5vw,3.4rem)",
            lineHeight: 1.08,
            whiteSpace: "nowrap",
            color: "var(--belvo-text-1)",
            margin: "0 0 16px",
          }}>
            From skincare to startups —{" "}
            <span style={{ color: "#9D4EDD" }}>
              <span style={{ fontFamily: "'Inter',sans-serif", fontWeight: 750, fontSize: "90%" }}>60+ Brands, </span> 
            </span>{" "}
            <span style={{ fontFamily: "'Inter',sans-serif", fontWeight: 750, fontSize: "90%", color: "#9D4EDD" }}>12+ Industries</span> 
          </h2>
          <p style={{
            fontFamily: "'Inter',sans-serif", fontSize: "0.88rem", lineHeight: 1.8,
            color: "var(--belvo-text-6)", maxWidth: "540px", margin: "0 auto",
          }}>
            Real brands, real industries — helping each one scale with strategy that works.
          </p>
        </motion.div>
      </div>

      {/* ── CATEGORY ROWS ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "40px", position: "relative", zIndex: 1 }}>
        {CATEGORIES.map((cat, ci) => (
          <motion.div
            key={cat.name}
            custom={ci + 1}
            variants={fadeUp}
            initial="hidden"
            animate={headerInView ? "visible" : "hidden"}
          >
            {/* Category heading */}
            <div style={{ padding: "0 24px", maxWidth: "1200px", margin: "0 auto 16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{
                  width: "5px", height: "20px", borderRadius: "3px",
                  background: cat.color, flexShrink: 0,
                }} />
                <h3 style={{
                  fontFamily: "'Inter',sans-serif", fontWeight: 700,
                  fontSize: "0.85rem", color: "var(--belvo-text-1)", margin: 0,
                  letterSpacing: "0.02em",
                }}>
                  {cat.name}
                </h3>
                <span style={{
                  fontFamily: "'Inter',sans-serif", fontSize: "0.65rem", fontWeight: 600,
                  color: cat.color,
                  background: `rgba(${hexToRgb(cat.color)},0.1)`,
                  border: `1px solid rgba(${hexToRgb(cat.color)},0.18)`,
                  borderRadius: "100px", padding: "2px 10px",
                  whiteSpace: "nowrap",
                }}>
                  {cat.count}
                </span>
              </div>
            </div>
            <BrandRow catName={cat.name} brands={cat.brands} color={cat.color} isIvory={isIvory} />
          </motion.div>
        ))}
      </div>

      {/* ── SERVICES DELIVERED ── */}
      <div style={{ padding: "0 24px", maxWidth: "1200px", margin: "72px auto 0", position: "relative", zIndex: 1 }}>
        <motion.div
          custom={CATEGORIES.length + 1}
          variants={fadeUp}
          initial="hidden"
          animate={headerInView ? "visible" : "hidden"}
          style={{
            background: isIvory
              ? "linear-gradient(135deg, rgba(157,78,221,0.04), rgba(123,47,190,0.02))"
              : "linear-gradient(135deg, rgba(157,78,221,0.06), rgba(80,15,140,0.04))",
            border: `1px solid rgba(157,78,221,${isIvory ? "0.1" : "0.12"})`,
            borderRadius: "18px",
            padding: "32px",
            marginBottom: "48px",
            backdropFilter: "blur(4px)",
          }}
        >
          <h3 style={{
            fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: "0.8rem",
            color: "#9D4EDD", margin: "0 0 20px",
            letterSpacing: "0.12em", textTransform: "uppercase",
          }}>
            Services Delivered
          </h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {SERVICES_DELIVERED.map((svc) => (
              <span key={svc} style={{
                padding: "6px 14px",
                background: isIvory ? `rgba(157,78,221,0.06)` : `rgba(157,78,221,0.08)`,
                border: `1px solid rgba(157,78,221,${isIvory ? "0.1" : "0.12"})`,
                borderRadius: "8px",
                fontFamily: "'Inter',sans-serif", fontSize: "0.75rem", fontWeight: 500,
                color: "var(--belvo-text-1)",
              }}>
                {svc}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          custom={CATEGORIES.length + 2}
          variants={fadeUp}
          initial="hidden"
          animate={headerInView ? "visible" : "hidden"}
          style={{ textAlign: "center" }}
        >
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "20px",
            padding: "14px 32px",
            background: isIvory
              ? "linear-gradient(135deg, rgba(157,78,221,0.06), rgba(123,47,190,0.03))"
              : "linear-gradient(135deg, rgba(157,78,221,0.08), rgba(80,15,140,0.05))",
            border: `1px solid rgba(157,78,221,${isIvory ? "0.12" : "0.15"})`,
            borderRadius: "100px",
            backdropFilter: "blur(4px)",
          }}>
            <span style={{
              fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: "0.7rem",
              letterSpacing: "0.15em", textTransform: "uppercase", color: "#9D4EDD",
            }}>
              Total Reach
            </span>
            <span style={{ width: "1px", height: "14px", background: `rgba(157,78,221,${isIvory ? "0.15" : "0.2"})` }} />
            <span style={{ fontFamily: "'Inter',sans-serif", fontWeight: 600, fontSize: "0.78rem", color: "var(--belvo-text-1)" }}>60+ Brands</span>
            <span style={{ width: "1px", height: "14px", background: `rgba(157,78,221,${isIvory ? "0.15" : "0.2"})` }} />
            <span style={{ fontFamily: "'Inter',sans-serif", fontWeight: 600, fontSize: "0.78rem", color: "var(--belvo-text-1)" }}>12+ Industries</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
