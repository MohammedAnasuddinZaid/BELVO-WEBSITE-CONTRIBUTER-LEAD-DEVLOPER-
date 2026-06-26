export interface Answer {
  text: string;
  link?: { label: string; href: string };
}

export interface Intent {
  keywords: string[];
  answer: Answer;
}

export const INTENTS: Intent[] = [
  {
    keywords: ["who are you", "what is belvo", "about", "tell me about", "company", "agency"],
    answer: { text: "BELVO is a premium full-service creative agency founded by Hrishikesh Mishra. We help businesses scale globally by building brands from scratch — covering everything from branding and web development to performance marketing and influencer outreach. Our motto: 'We build brands that dominate.' We've worked with 100+ clients across 13 industries." },
  },
  {
    keywords: ["service", "what do you do", "offer", "capability"],
    answer: { text: "We offer 14 services: SEO Digital Marketing, Brand Outreach & PR, Branding, Social Media Management, 3D & CGI, Animation & VFX, Graphics Designing, Web Development, E-Commerce Management, Performance Marketing, Influencer Marketing, App Development, Software Development, and CRM & Automation. Whatever your brand needs, we've got you covered." },
  },
  {
    keywords: ["web development", "website", "web dev"],
    answer: { text: "Our Web Development team builds fast, responsive websites and web apps using modern stacks (React, Next.js, Tailwind, and more). We handle everything from brand websites to SaaS dashboards to e-commerce platforms." },
  },
  {
    keywords: ["app development", "mobile app", "ios", "android", "app dev"],
    answer: { text: "We build iOS and Android apps using Flutter and React Native — from concept to launch. Our team of 7 developers handles UI/UX, backend integration, and deployment." },
  },
  {
    keywords: ["branding", "brand identity", "logo"],
    answer: { text: "Our branding service covers naming, logo design, complete brand identity systems, brand guides, and visual language. We craft brands that stop people mid-scroll." },
  },
  {
    keywords: ["social media", "smm", "content", "instagram", "linkedin"],
    answer: { text: "We offer data-driven social media strategy, content creation, community management, and platform-specific tactics across Instagram, LinkedIn, and more. Our team helps brands build real engagement." },
  },
  {
    keywords: ["seo", "digital marketing", "search engine", "organic"],
    answer: { text: "Our SEO & Digital Marketing service optimizes your digital presence to rank higher on search engines and drive sustainable organic traffic — through keyword strategy, on-page/off-page SEO, and content marketing." },
  },
  {
    keywords: ["performance marketing", "paid ads", "google ads", "meta ads", "ppc", "roi"],
    answer: { text: "We run data-driven paid media campaigns across Google, Meta, and other platforms to maximize your ROI and ROAS. Every dollar is optimized for results." },
  },
  {
    keywords: ["influencer", "creator", "ugc"],
    answer: { text: "We connect brands with macro to micro influencers and UGC creators for authentic campaigns that drive real engagement and conversions." },
  },
  {
    keywords: ["ecommerce", "e-commerce", "shopify", "woocommerce"],
    answer: { text: "We offer end-to-end e-commerce management — from store setup and product listings to conversion rate optimization and scaling strategies." },
  },
  {
    keywords: ["crm", "automation", "zapier", "hubspot"],
    answer: { text: "We implement and optimize CRM systems and workflow automation (Zapier, HubSpot, etc.) to streamline your operations and improve customer retention." },
  },
  {
    keywords: ["graphic design", "graphics", "visual", "creative"],
    answer: { text: "Our graphics team creates marketing creatives, social graphics, packaging designs, print materials, and UI graphics that make your brand stand out." },
  },
  {
    keywords: ["3d", "cgi", "animation", "vfx", "motion"],
    answer: { text: "We produce hyper-realistic 3D visuals, CGI for products and architecture, motion graphics, visual effects, and 2D/3D explainer videos." },
  },
  {
    keywords: ["software", "saas", "custom software", "api"],
    answer: { text: "We build custom software, SaaS platforms, enterprise solutions, APIs, and backend systems tailored to your business needs." },
  },
  {
    keywords: ["pr", "outreach", "public relations", "press", "media coverage"],
    answer: { text: "Our Brand Outreach & PR service crafts compelling narratives and pitches to publications and media houses to get your brand the coverage it deserves." },
  },
  {
    keywords: ["team", "who works", "founder", "hrishikesh", "people"],
    answer: { text: "BELVO is led by founder & CEO Hrishikesh Mishra. Our team spans Web Development (10), App Development (7), Business & Data Analytics (5), Graphic Design (4), and Administration. We're a hungry, creative crew that's worked with 100+ clients." },
  },
  {
    keywords: ["contact", "email", "reach", "get in touch"],
    answer: { text: "You can reach us at contact.belvo@gmail.com or info.belvo@gmail.com. We're active on Instagram (@belvo_official) and LinkedIn (belvo.buzz). Expect a reply within 24 hours." },
  },
  {
    keywords: ["instagram", "social link"],
    answer: { text: "Follow us on Instagram: @belvo_official", link: { label: "Visit Instagram", href: "https://www.instagram.com/belvo_official/" } },
  },
  {
    keywords: ["linkedin"],
    answer: { text: "Connect with us on LinkedIn.", link: { label: "Visit LinkedIn", href: "https://www.linkedin.com/company/belvo.buzz/" } },
  },
  {
    keywords: ["whatsapp", "community"],
    answer: { text: "Join our WhatsApp community to stay updated.", link: { label: "Join WhatsApp", href: "https://chat.whatsapp.com/Is2DmjNcycI8vK7hJaWEaL" } },
  },
  {
    keywords: ["book a call", "free call", "consultation", "hire", "contact form"],
    answer: { text: "You can book a free call with us through the 'Book A Free Call' section on our website. We'll get back to you within 24 hours." },
  },
  {
    keywords: ["career", "job", "hiring", "vacancy", "apply", "position", "intern"],
    answer: { text: "We're hiring! Open positions: Social Media Management, Digital Marketing, Business Analyst, Web Developers, App Developers, HR, and Software Developers. Apply through our Careers page." },
  },
  {
    keywords: ["portfolio", "client", "work", "project", "brands worked"],
    answer: { text: "We've worked with 96+ brands across 13 industries including skincare, fashion, food & beverage, cafes, edtech, fintech, tech startups, jewellery, interior design, travel, healthcare, and salon/spa. Notable clients include Bewakoof, The Habitat Cafe, Fasset, Masia School, and many more." },
  },
  {
    keywords: ["blog", "article", "read", "content"],
    answer: { text: "Our blog covers Marketing, Branding, Tech, Agency Life, and Case Studies. Founder-approved posts will appear soon — stay tuned!" },
  },
  {
    keywords: ["pricing", "cost", "price", "budget", "how much"],
    answer: { text: "Our pricing depends on the scope of your project. You can book a free call where we'll discuss your needs and provide a tailored quote. Budget ranges start from under $1,000 and go up to $25,000+ for full brand builds." },
  },
  {
    keywords: ["timeline", "how long", "delivery", "deadline"],
    answer: { text: "Timelines vary by project. After our initial consultation, we'll provide a clear timeline. Most projects have regular check-ins so you always know where things stand." },
  },
  {
    keywords: ["process", "how you work", "methodology"],
    answer: { text: "Our process section is coming soon (section 04). Generally, we start with a deep discovery call, then move to strategy, creative execution, review, and launch — with you involved every step of the way." },
  },
  {
    keywords: ["testimonial", "review", "feedback"],
    answer: { text: "Client testimonials are coming soon (section 06). In the meantime, 100+ clients trust us — and our portfolio speaks for itself." },
  },
  {
    keywords: ["hello", "hi", "hey", "greetings", "good morning", "good evening"],
    answer: { text: "Hey there! 👋 Welcome to BELVO. I'm your virtual assistant. Ask me anything about our services, team, portfolio, careers, or how we can help your brand grow." },
  },
  {
    keywords: ["thank", "thanks", "appreciate"],
    answer: { text: "You're welcome! 😊 Feel free to ask if you have any more questions. We'd love to help your brand grow." },
  },
  {
    keywords: ["software developer", "software development"],
    answer: { text: "Our Software Development team builds custom software, SaaS platforms, enterprise solutions, APIs, and backend systems. We use modern frameworks and best practices to deliver scalable, maintainable code." },
  },
];

export const FALLBACK = "I'm not sure I understand. Could you rephrase your question? You can ask me about our services, team, portfolio, careers, pricing, or anything about BELVO!";

export const GREETING = "👋 Hi! I'm BELVO's virtual assistant. Ask me anything about our agency — services, team, portfolio, careers, or how we can help your brand grow.";
