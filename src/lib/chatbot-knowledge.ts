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
    keywords: ["who are you", "what is belvo", "tell me about", "about company", "about agency"],
    answer: { text: "BELVO is a premium full-service creative agency founded by Hrishikesh Mishra. We help businesses scale globally by building brands from scratch — covering everything from branding and web development to performance marketing and influencer outreach. Our motto: 'We build brands that dominate.' We've worked with 100+ clients across 15+ industries. Our team spans across Goregaon, Mumbai, Maharashtra." },
  },
  {
    keywords: ["services", "what do you do", "what you offer", "service", "capabilities"],
    answer: { text: "We offer 14 services: SEO Digital Marketing, Brand Outreach & PR, Branding, Social Media Management, 3D & CGI, Animation & VFX, Graphics Designing, Web Development, E-Commerce Management, Performance Marketing, Influencer Marketing, App Development, Software Development, and CRM & Automation. Whatever your brand needs, we've got you covered." },
  },
  {
    keywords: ["web development", "website", "web dev", "web design"],
    answer: { text: "Our Web Development team builds fast, responsive websites and web apps using modern stacks (React, Next.js, Tailwind, and more). We handle everything from brand websites to SaaS dashboards to e-commerce platforms. Our process: discovery, wireframing, UI/UX design, frontend and backend development, content integration, testing, and deployment." },
  },
  {
    keywords: ["app development", "mobile app", "ios", "android", "app dev"],
    answer: { text: "We build iOS and Android apps using Flutter and React Native — from concept to launch. Our App Development team has 7 members: Anand, Anshika Srivastava, Aaryan, Suhani, Aman, Naveen Kumar, and Naveen K D. We handle UI/UX, backend integration, and deployment." },
  },
  {
    keywords: ["branding", "brand identity", "logo"],
    answer: { text: "Our branding service covers naming, logo design, complete brand identity systems, brand guides, and visual language. A full brand identity project includes: brand strategy and positioning, logo design (primary and secondary), color palette, typography system, brand guidelines document, stationery design, social media kit, and brand asset library. We craft brands that stop people mid-scroll." },
  },
  {
    keywords: ["social media", "smm", "content strategy", "instagram", "linkedin"],
    answer: { text: "We offer data-driven social media strategy, content creation, community management, and platform-specific tactics across Instagram, LinkedIn, and more. We handle content creation, posting schedules, community management, engagement strategies, and growth tactics to ensure your brand stays relevant." },
  },
  {
    keywords: ["seo", "digital marketing", "search engine", "organic traffic"],
    answer: { text: "Our SEO & Digital Marketing service optimizes your digital presence to rank higher on search engines and drive sustainable organic traffic — through keyword strategy, on-page/off-page SEO, technical SEO audits, content marketing, and performance tracking." },
  },
  {
    keywords: ["performance marketing", "paid ads", "google ads", "meta ads", "ppc", "roas"],
    answer: { text: "We run data-driven paid media campaigns across Google, Meta, and other platforms to maximize your ROI and ROAS. It includes campaign strategy, audience research, creative briefing, ad setup, continuous optimisation, and detailed monthly reporting with transparent ROAS tracking." },
  },
  {
    keywords: ["influencer", "creator", "ugc"],
    answer: { text: "We connect brands with macro to micro influencers and UGC creators for authentic campaigns that drive real engagement and conversions. Belvo identifies, vets, negotiates, and manages influencer campaigns ensuring authentic collaborations." },
  },
  {
    keywords: ["ecommerce", "e commerce", "shopify", "woocommerce"],
    answer: { text: "We offer end-to-end e-commerce management — from store setup, product listing optimization, inventory management, conversion rate optimization (CRO), and scaling strategies for platforms like Shopify and WooCommerce. We help D2C brands streamline operations and maximize revenue." },
  },
  {
    keywords: ["crm", "automation", "zapier", "hubspot"],
    answer: { text: "We implement and optimize CRM systems and workflow automation (Zapier, HubSpot, etc.) to streamline your operations, improve customer retention, and reduce manual work across sales, marketing, and operations." },
  },
  {
    keywords: ["graphic design", "graphics", "visual"],
    answer: { text: "Our graphics team creates marketing creatives, social graphics, packaging designs, print materials, and UI graphics that make your brand stand out. Our Graphic Designing team has 4 members: Anurag khushwaha, Rimi gosh, Sanskruti akare, and Deepak Sharma." },
  },
  {
    keywords: ["3d", "cgi", "animation", "vfx", "motion graphics"],
    answer: { text: "We produce hyper-realistic 3D visuals, CGI for products and architecture, motion graphics, visual effects, and 2D/3D explainer videos. We bring your stories to life through animation that captivate and communicate at the highest level." },
  },
  {
    keywords: ["software development", "saas", "custom software", "api"],
    answer: { text: "We build custom software, SaaS platforms, enterprise solutions, APIs, and backend systems tailored to your business needs — scalable, secure, and built with clean architecture." },
  },
  {
    keywords: ["pr", "outreach", "public relations", "press", "media coverage"],
    answer: { text: "Our Brand Outreach & PR service crafts compelling narratives and pitches to publications and media houses to get your brand the coverage it deserves. We build credibility and expand your brand's reach in the right circles." },
  },
  {
    keywords: ["team", "who works", "founder", "hrishikesh"],
    answer: { text: "BELVO is founded and led by CEO Hrishikesh Mishra. Our departments: Web Development (10 members: Lokesh, Sri Satya, Akhil, Mohammad Anasuddin Zaid, Ishwari, Sandali, Tamil Selvan, Ram Nath G K, Guru dutt, Shailender), App Development (7: Anand, Anshika Srivastava, Aaryan, Suhani, Aman, Naveen Kumar, Naveen K D), Cyber Security (3: Harsh, Sourav, Parv), Business & Data Analytics (5: Ishika, Obed, Sasikumar, Sharfudeen, Sibijan), Graphic Designing (4: Anurag khushwaha, Rimi gosh, Sanskruti akare, Deepak Sharma), Content Writer (1: Sheth Yamani), and Administration (3: Mohd Usaid Ali Khan, Raavula Vaibhav, Achintya Gurba)." },
  },
  {
    keywords: ["lokesh", "sri satya", "sri", "akhil", "mohammad anasuddin", "anasuddin", "zaid", "ishwari", "sandali", "tamil selvan", "tamil", "ram nath", "guru dutt", "guru", "shailender"],
    answer: { text: "That's part of our Web Development team! Members: Lokesh, Sri Satya, Akhil, Mohammad Anasuddin Zaid, Ishwari, Sandali, Tamil Selvan, Ram Nath G K, Guru dutt, and Shailender. They build fast, responsive websites and web apps using modern stacks like React, Next.js, and Tailwind." },
  },
  {
    keywords: ["anand", "anshika", "aaryan", "suhani", "aman", "naveen kumar", "naveen k d"],
    answer: { text: "That's part of our App Development team! Members: Anand, Anshika Srivastava, Aaryan, Suhani, Aman, Naveen Kumar, and Naveen K D. They build iOS and Android apps using Flutter and React Native." },
  },
  {
    keywords: ["harsh", "sourav", "parv"],
    answer: { text: "That's part of our Cyber Security team! Members: Harsh, Sourav, and Parv. They handle security and protect our clients' digital assets." },
  },
  {
    keywords: ["ishika", "obed", "sasikumar", "sharfudeen", "sibijan"],
    answer: { text: "That's part of our Business & Data Analytics team! Members: Ishika, Obed, Sasikumar, Sharfudeen, and Sibijan. They provide data-driven insights and strategies." },
  },
  {
    keywords: ["anurag", "rimi", "sanskruti", "deepak sharma"],
    answer: { text: "That's part of our Graphic Designing team! Members: Anurag khushwaha, Rimi gosh, Sanskruti akare, and Deepak Sharma. They create stunning visual content for our clients." },
  },
  {
    keywords: ["sheth yamani", "yamani"],
    answer: { text: "Sheth Yamani is our Content Writer. They craft compelling written content for brand stories, blogs, and marketing materials." },
  },
  {
    keywords: ["mohd usaid", "usaid ali", "raavula vaibhav", "vaibhav", "achintya"],
    answer: { text: "That's part of our Administration team! Members: Mohd Usaid Ali Khan, Raavula Vaibhav, and Achintya Gurba. They handle Operations, Team Coordination, Client Communication, and Internal Management." },
  },
  {
    keywords: ["hrishikesh mishra", "ceo", "founder", "hrishikesh"],
    answer: { text: "Hrishikesh Mishra is the Founder & CEO of BELVO. His vision: 'Building BELVO to deliver world-class digital solutions — one idea, one team, one product at a time.'" },
  },
  {
    keywords: ["pricing", "cost", "how much", "price", "budget", "rates", "package"],
    answer: { text: "Our pricing is project-based and tailored to your needs. Budget ranges: **Under $1,000**, **$1,000 - $5,000**, **$5,000 - $10,000**, **$10,000 - $25,000**, and **$25,000+**. Book a free call and we'll give you a custom quote within 24 hours." },
  },
  {
    keywords: ["contact", "email", "reach", "get in touch", "contact us"],
    answer: { text: "You can reach us at **contact.belvo@gmail.com** or **info.belvo@gmail.com** or **career.belvo@gmail.com** (for jobs). Call us at **+91 89284 66820** or **+91 98495 67122**. We're active on **Instagram (@belvo_official)** and **LinkedIn (belvo.buzz)**. Expect a reply within 24 hours. Our office is in Goregaon, Mumbai, Maharashtra." },
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
    answer: { text: "You can book a free call with us through the 'Book A Free Call' section on our website. We'll get back to you within 24 hours. The form asks for your Full Name, Email, Company Name, Budget (options: Under $1,000, $1,000-$5,000, $5,000-$10,000, $10,000-$25,000, $25,000+), Project Type (Brand Identity, Website Design, Social Media Strategy, Marketing & Growth, Full Brand Build, or Other), and a Message." },
  },
  {
    keywords: ["career", "job", "hiring", "vacancy", "apply", "position", "intern"],
    answer: { text: "We're hiring! 7 open positions: Social Media Management, Digital Marketing, Business Analyst, Web Developers, App Developers, HR, and Software Developers. Apply through our Careers page with your Full Name, Age, Role, Qualification, Education, Experience, Address, Message, Email, WhatsApp, and Resume (PDF/DOC/DOCX, max 5MB). Applications acknowledged within 48 hours. Email: career.belvo@gmail.com" },
  },
  {
    keywords: ["portfolio", "client", "project", "brands worked", "clients", "showcase"],
    answer: { text: "We've worked with 100+ brands across 15+ industries! Our portfolio includes: Skincare (Ghar Soaps, Clayco Beauty, Prowlactive, Skinvest, Grovya, Bentica, Mancode, The Skin Story, Beard Story, Arotatvika, Sen-Z, Illume), Fashion (Bewakoof, Vasa Indica, Ahankar Wear, Oje Living, Goodhand Jaipur, Pironi, Shop Sagel, Better Basics, Modern Saheli, Northstory, KSHM Earth), Food (Chakki Peesing, Beyond Snacks, The 1970 Shop, Greenify Foods, SIL Foods, Mangalam Homemade, Oh! Nuts), Cafes (The Habitat Cafe, The Nine Cafe, Cincin India, Meltado, Kathha Katte, Positano Mumbai, Cacao Love, 307 Bakehouse, Timber Cafe, Afterdunes, San Churro, 6 Degree North, Kapi Barr, Portal Mumbai, Amaru Mumbai), EdTech (Leaping Frogs, Trigr Exam, Educurria), FinTech (Fasset, Cready, Getepay), Jewellery (Sutra Fine Jewellery, Qlumsi, Pirohaa), Interior Design (Karan Desai A.D., Karan Desai Home), Travel (The Safarnama, Air Time Vacations), Healthcare (AK Clinics, Narayana One Health, Royal Dental Clinics), Salon/Spa (Envi Salon Spa, Daisy House), and Modeling (72 MG Studio, Venera Workshops, Ella Models India). Services delivered include PR, Influencer Marketing, Social Media Management, Graphic Design, Web Development, Research, Analytics, Brand Strategy, Community Management, DM Campaigns, Content Strategy, Growth Marketing, Brand Positioning, E-commerce Support, and Lead Generation." },
  },
  {
    keywords: ["bewakoof", "ghar soaps", "clayco", "fasset", "habitat cafe", "beyond snacks", "getepay", "narayana", "ak clinics"],
    answer: { text: "We've worked with these amazing brands! For detailed info, ask about our portfolio section." },
  },
  {
    keywords: ["blog", "article", "read", "blogs"],
    answer: { text: "Our blog has 5 categories: Marketing, Branding, Tech, Agency Life, and Case Studies. Published posts: 'Why Every Startup Needs Strong Branding' (Branding, Apr 2026), 'Top UI/UX Design Trends for 2026' (Tech, Mar 2026), 'Why Most Startups Get Branding Wrong' (Branding, Apr 2025), 'React Best Practices in 2026' (Tech, May 2026), and 'How to Grow Your Brand on Instagram in 2025' (Marketing, May 2025)." },
  },
  {
    keywords: ["pricing", "cost", "price", "budget", "how much"],
    answer: { text: "Our pricing is project-based and varies depending on scope, complexity, and deliverables. Budget ranges: Under $1,000, $1,000 - $5,000, $5,000 - $10,000, $10,000 - $25,000, and $25,000+. We offer custom quotes tailored to each client's needs. During your free discovery call, we'll discuss your requirements and provide a transparent pricing proposal with no hidden fees." },
  },
  {
    keywords: ["timeline", "how long", "delivery", "deadline"],
    answer: { text: "Timelines vary by project scope. A brand identity project typically takes 2-4 weeks. A full website design and development engagement runs 4-8 weeks. Performance marketing campaigns are set up within 1-2 weeks. We provide a clear timeline in your proposal after consultation." },
  },
  {
    keywords: ["process", "how you work", "methodology"],
    answer: { text: "We start with a deep discovery call, then move to strategy, creative execution, review, and launch — with you involved every step of the way. Each client is assigned a dedicated account manager as your single point of contact, backed by a multidisciplinary team of designers, developers, strategists, content creators, and marketers. We build revision cycles (2-3 rounds) into every project timeline." },
  },
  {
    keywords: ["testimonial", "review", "feedback", "reviews", "client say"],
    answer: { text: "Here's what our clients say:\n1. Sunny Jain (Ghar Soaps): 'BELVO understood exactly what we needed before we could even articulate it.'\n2. Niharika Kunal (ClayCo Beauty): 'We'd worked with three agencies before BELVO. The difference was immediate.'\n3. Prabhkiran Singh (Bewakoof): 'Our conversion rates improved within the first month of the redesign.'\n4. Manas Madhu (Beyond Snacks): 'BELVO pushed back when our ideas weren't quite right, offered smarter alternatives.'\n5. Mohammad Raafi Hossain (Fasset): 'Working with BELVO felt less like hiring a vendor and more like bringing on a team that actually cared.'\n6. Karan Desai (KDAK): 'The final outcome has genuinely elevated how people perceive us.'\n7. Prathamesh Choudhari (GatePay): 'BELVO brought a level of craft to our UI that we hadn't seen from any other agency.'\n8. Dr. Aman Dua (AK Clinics): 'BELVO's engineering team was thorough and communicative.'\n9. Dr. Devi Prasad Shetty (Narayana One Health): 'We left with something cohesive, confident, and compelling.'" },
  },
  {
    keywords: ["faq", "question", "answer", "help"],
    answer: { text: "We have 25+ FAQs covering topics like getting started, data security, business sizes, industries we serve, timelines, retainers, performance marketing, design & development, contact, pricing, social media, influencer marketing, SEO, e-commerce, branding, web development, mobile apps, content creation, reporting, team structure, international clients, revisions, and what makes us different. For a specific FAQ, just ask!" },
  },
  {
    keywords: ["data security", "secure", "nda", "confidential"],
    answer: { text: "Absolutely. We follow industry-standard security practices across all projects. All client data, assets, and communications are handled with strict confidentiality, and we're happy to sign NDAs before any project begins." },
  },
  {
    keywords: ["international", "global", "outside india", "us", "uk", "uae", "singapore", "australia"],
    answer: { text: "Yes — we work with clients across India, the US, the UK, UAE, Singapore, Australia, and beyond. Our team is experienced in serving global brands and understands the nuances of different markets, time zones, and cultural contexts. All communication and deliverables are in English." },
  },
  {
    keywords: ["revision", "feedback", "changes", "modify"],
    answer: { text: "We build revision cycles into every project timeline. After each deliverable, we present it for your review and collect structured feedback. Typically, projects include 2-3 rounds of revisions. We use collaborative tools like Figma, Trello, and Slack to ensure feedback is clear and organized." },
  },
  {
    keywords: ["retainer", "ongoing", "monthly", "long term"],
    answer: { text: "Yes — most of our clients move to monthly retainers after their initial project. Retainers cover ongoing social media management, performance marketing, content creation, SEO, or any combination of services your brand needs to keep growing." },
  },
  {
    keywords: ["events", "webinar", "workshop", "meetup", "upcoming events"],
    answer: { text: "Our upcoming events: 1. React Free Webinar (Online, Tomorrow) — modern React fundamentals, hooks, state management. 2. Flutter Workshop (Online, Next Sunday) — build cross-platform mobile apps. 3. Founders Meet-up (Offline, 15 July) — network with startup founders and entrepreneurs. Register at /event-register/1, /event-register/2, or /event-register/3. Contact: +91 89284 66820." },
  },
  {
    keywords: ["react webinar", "flutter workshop", "founders meetup"],
    answer: { text: "Our events include a React Free Webinar (online, tomorrow covering modern React), Flutter Workshop (online, next Sunday), and Founders Meet-up (offline, 15 July). Register at /event-register/1, 2, or 3!" },
  },
  {
    keywords: ["location", "office", "address", "goregaon", "mumbai"],
    answer: { text: "Our office is located in Goregaon, Mumbai, Maharashtra, India." },
  },
  {
    keywords: ["phone", "call", "number", "contact number"],
    answer: { text: "You can call us at +91 89284 66820 or +91 98495 67122." },
  },
  {
    keywords: ["portfolio pdf", "download", "brochure"],
    answer: { text: "You can download our portfolio PDF from the footer of our website.", link: { label: "Download Portfolio", href: "/Portfolio.pdf" } },
  },
  {
    keywords: ["about", "about belvo", "company story", "background"],
    answer: { text: "BELVO has worked with over 100+ clients. We've crafted brand identities, run performance campaigns, built websites, managed social media, launched e-commerce stores, written code, generated leads, and delivered research. Beyond numbers, we value relationships — every client is a new story. Our tagline: '100+ Clients. Countless Stories.'" },
  },
  {
    keywords: ["genz", "gen z", "genzatbelvo"],
    answer: { text: "#GenZatBELVO — 'A heartfelt welcome to the next gen of creators' — our initiative to welcome and nurture young talent." },
  },
  {
    keywords: ["thank", "thanks", "appreciate"],
    answer: { text: "You're welcome! Feel free to ask if you have any more questions. We'd love to help your brand grow." },
  },
  {
    keywords: ["projects delivered", "services delivered", "what we deliver"],
    answer: { text: "We deliver 15 services: Public Relations & Outreach, Influencer Marketing, Social Media Management, Graphic Design, Website Design & Development, Research & Competitor Analysis, Analytics & Performance Reporting, Brand Strategy, Community Management, Direct Marketing (DM Campaigns), Content Strategy, Growth Marketing, Brand Positioning, E-commerce Support, and Lead Generation." },
  },
];

export const FALLBACKS = [
  "I'm not sure I understand. Could you rephrase your question? You can ask me about our services, team members, portfolio clients, FAQs, careers, events, pricing, or anything about BELVO!",
  "Hmm, I don't have an answer for that yet. Try asking about our services, specific team members, our 100+ clients, upcoming events, or how we can help your brand grow.",
  "I didn't quite catch that. I can help with questions about BELVO's services, team members (like Lokesh, Anand, Harsh, etc.), clients (Bewakoof, Ghar Soaps, Fasset), careers, pricing, or events. What would you like to know?",
  "Sorry, I'm not able to answer that. Feel free to ask about our 14 services, any of our 30+ team members, our 100+ client portfolio, FAQ section, or how to get in touch with us!",
];

export const GREETINGS = [
  "Hey there! Welcome to BELVO. I'm your virtual assistant. Ask me anything about our services, team members, portfolio of 100+ clients, careers, events, or how we can help your brand grow.",
  "Hi! Great to have you here. I can answer questions about BELVO — our 30+ team members across 7 departments, 14 services, upcoming events, client portfolio, and more. What can I help you with?",
  "Hello! Welcome to BELVO. I'm here to help! Ask me about our agency, our founder Hrishikesh Mishra, specific team members, our 100+ clients, or how we can take your brand to the next level.",
];

export const GREETING_KEYWORDS = ["hello", "hi ", "hey", "greetings", "good morning", "good evening", "howdy", "whatsup", "sup "];
