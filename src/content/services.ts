export interface ServiceItem {
  id: string;
  category: string;
  title: string;
  image: string;
  keywords: string[];
  desc: string;
}

const serviceDefinitions = [
  {
    id: "seo-digital-marketing",
    category: "SEO Digital Marketing",
    image: "/ServicesImages/seo.png",
    keywords: ["SEO", "organic growth", "search ranking", "keyword strategy", "on-page/off-page"],
    desc: "We optimize your digital presence to rank higher on search engines. From keyword research to technical SEO and link building, we drive sustainable organic traffic that converts.",
  },
  {
    id: "brand-outreach-pr",
    category: "Brand Outreach & PR",
    image: "/ServicesImages/pr.png",
    keywords: ["public relations", "brand awareness", "media coverage", "press", "outreach"],
    desc: "We craft compelling narratives and pitch your brand to the right publications and media houses - building credibility and expanding your brand's reach in the right circles.",
  },
  {
    id: "branding",
    category: "Branding",
    image: "/ServicesImages/brand.png",
    keywords: ["brand identity", "logo", "brand guide", "visual language", "positioning"],
    desc: "From naming and logo design to a complete brand identity system, we build brands that are memorable, consistent, and strategically positioned for long-term growth.",
  },
  {
    id: "social-media",
    category: "Social Media",
    image: "/ServicesImages/social.png",
    keywords: ["content creation", "social strategy", "community management", "Instagram", "LinkedIn"],
    desc: "We manage and grow your social media presence with a data-driven content strategy - combining creative storytelling with platform-specific tactics to build loyal communities.",
  },
  {
    id: "3d-cgi",
    category: "3D & CGI",
    image: "/ServicesImages/3d.png",
    keywords: ["3D rendering", "CGI", "product visualization", "architectural renders", "3D animation"],
    desc: "We create hyper-realistic 3D visuals and CGI content for products, architecture, ads, and campaigns - enabling stunning visuals before anything is physically built.",
  },
  {
    id: "animation-vfx",
    category: "Animation & VFX",
    image: "/ServicesImages/vfx.png",
    keywords: ["motion graphics", "visual effects", "2D/3D animation", "explainer videos"],
    desc: "From sleek motion graphics to full visual effects pipelines, we bring your stories to life through animation and VFX that captivate and communicate at the highest level.",
  },
  {
    id: "graphics-designing",
    category: "Graphics Designing",
    image: "/ServicesImages/graphic.png",
    keywords: ["graphic design", "visual content", "marketing creatives", "UI graphics", "print"],
    desc: "Our designers produce impactful visual content - from marketing creatives and social graphics to packaging and print - all aligned with your brand identity.",
  },
  {
    id: "web-development",
    category: "Web Development",
    image: "/ServicesImages/web-dev.png",
    keywords: ["website design", "frontend", "backend", "responsive", "CMS", "custom web apps"],
    desc: "We build fast, beautiful, and fully responsive websites and web applications using modern tech stacks - engineered for performance, SEO, and exceptional user experience.",
  },
  {
    id: "ecommerce-management",
    category: "E-Commerce Management",
    image: "/ServicesImages/e-comm.png",
    keywords: ["e-commerce", "Shopify", "WooCommerce", "product listings", "conversion rate", "store management"],
    desc: "End-to-end e-commerce solutions - from store setup and product management to CRO and scaling. We manage your online store so you can focus on growing your business.",
  },
  {
    id: "performance-marketing",
    category: "Performance Marketing",
    image: "/ServicesImages/performance.png",
    keywords: ["paid ads", "Google Ads", "Meta Ads", "ROI", "ROAS", "PPC", "conversion campaigns"],
    desc: "We run data-driven paid media campaigns across Google, Meta, and beyond - optimizing every rupee spent for maximum ROI with transparent reporting and rapid iteration.",
  },
  {
    id: "influencer-marketing",
    category: "Influencer Marketing",
    image: "/ServicesImages/influencer.png",
    keywords: ["influencer outreach", "UGC", "creator campaigns", "brand collaborations", "micro-influencers"],
    desc: "We connect your brand with the right influencers - from macro to micro - to create authentic campaigns that reach your exact target audience and drive real results.",
  },
  {
    id: "app-development",
    category: "App Development",
    image: "/ServicesImages/app.png",
    keywords: ["mobile app", "iOS", "Android", "Flutter", "React Native", "UI/UX", "app design"],
    desc: "We design and develop intuitive mobile applications for iOS and Android - from concept and wireframing to launch and post-launch support, built for performance and scale.",
  },
  {
    id: "software-development",
    category: "Software Development",
    image: "/ServicesImages/Software.png",
    keywords: ["custom software", "SaaS", "enterprise solutions", "API", "backend systems"],
    desc: "We engineer custom software solutions tailored to your business needs - scalable, secure, and built with clean architecture to solve complex problems efficiently.",
  },
  {
    id: "crm-automation",
    category: "CRM & Automation",
    image: "/ServicesImages/crm.png",
    keywords: ["CRM setup", "workflow automation", "Zapier", "HubSpot", "customer retention", "lead management"],
    desc: "We implement and optimize CRM systems and automation workflows that streamline your sales, marketing, and operations - reducing manual work and improving customer retention.",
  },
];

export const SERVICES: ServiceItem[] = serviceDefinitions.map((service) => ({
  ...service,
  title: service.category,
}));
