@import url('https://fonts.googleapis.com/css2?family=Georgia&family=Inter:wght@400;500;600;700&display=swap');
@import "tailwindcss";

:root {
  --color-bg-app: #F5F5F2;
  --color-bg-card: #FFFFFF;
  --color-bg-sidebar: #E8E8E0;
  --color-bg-panel: #F0F0EB;
  --color-text-app: #2D2D2A;
  --color-text-muted: #7A7A72;
  --color-border-app: #E5E5DF;
  --color-brand: #5A5A40;
  --color-brand-hover: #484833;
  --color-brand-text: #FFFFFF;
  --color-brand-light: #F0F0EB;
  --color-accent-gold: #B8860B;
  --color-accent-gold-light: rgba(184, 134, 11, 0.1);
  --color-accent-rose: #A34A3E;
  --color-accent-emerald: #4E7C59;
}

.dark {
  --color-bg-app: #151512;
  --color-bg-card: #1D1D19;
  --color-bg-sidebar: #191916;
  --color-bg-panel: #262621;
  --color-text-app: #ECECE4;
  --color-text-muted: #9E9E92;
  --color-border-app: #35352F;
  --color-brand: #8A8A6D;
  --color-brand-hover: #9E9E80;
  --color-brand-text: #151512;
  --color-brand-light: #262621;
  --color-accent-gold: #D4AF37;
  --color-accent-gold-light: rgba(212, 175, 55, 0.15);
  --color-accent-rose: #E06C60;
  --color-accent-emerald: #69A778;
}

@theme {
  --color-bg-app: var(--color-bg-app);
  --color-bg-card: var(--color-bg-card);
  --color-bg-sidebar: var(--color-bg-sidebar);
  --color-bg-panel: var(--color-bg-panel);
  --color-text-app: var(--color-text-app);
  --color-text-muted: var(--color-text-muted);
  --color-border-app: var(--color-border-app);
  --color-brand: var(--color-brand);
  --color-brand-hover: var(--color-brand-hover);
  --color-brand-text: var(--color-brand-text);
  --color-brand-light: var(--color-brand-light);
  --color-accent-gold: var(--color-accent-gold);
  --color-accent-gold-light: var(--color-accent-gold-light);
  --color-accent-rose: var(--color-accent-rose);
  --color-accent-emerald: var(--color-accent-emerald);

  --font-serif: "Georgia", "Times New Roman", serif;
  --font-sans: "Inter", system-ui, -apple-system, sans-serif;
}

body {
  background-color: var(--color-bg-app);
  color: var(--color-text-app);
  font-family: var(--font-sans);
}
