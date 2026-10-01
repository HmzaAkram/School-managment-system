# Skoolms — Premium Landing Page Redesign Prompt
### Complete Design & Code Specification for AI Frontend Generation

> **Best Model to Use for This Task:** → **Claude Opus 4.6 (Thinking)**
> It handles long-context design prompts, writes clean React + Tailwind + Framer Motion code, reasons through layout decisions, and produces production-level output without skipping sections. For pure frontend styling with complex animations and multi-section pages, Opus 4.6 Thinking is the strongest choice among all models listed.
> **Second choice:** Claude Sonnet 4.6 (Thinking) — faster, still excellent for structured UI code.

---

## 🎯 Task Overview

You are a **world-class UI/UX designer and senior frontend engineer**.

Redesign the existing Skoolms School Management System landing page into a **PREMIUM, MODERN, HIGH-END SaaS landing page** that looks like it was designed by the teams behind Apple.com, Stripe.com, Linear.app, and Vercel.com.

The audience is **school principals and academic decision-makers** — so the design must feel **professional, trustworthy, clean, and impressive**. This is not a student project. This should look like a **billion-dollar SaaS product**.

**Current site for reference:** https://school-managment-system-seven.vercel.app/

---

## 🧱 Tech Stack (REQUIRED — Do Not Change)

```
- Next.js (App Router) with TypeScript — files use .tsx extension
- Tailwind CSS (utility-first)
- GSAP + ScrollTrigger (for ALL scroll-driven animations)
- Lenis (smooth scroll — modern, lightweight, better than Locomotive)
- Framer Motion (ONLY for simple mount/hover where GSAP is overkill)
- No external UI libraries (no shadcn, no MUI, no Chakra)
- Google Fonts via next/font/google in app/layout.tsx (NOT @import)
- All icons: use inline SVG or lucide-react only
```

### ⚠️ Critical Next.js App Router Rules

**EVERY component that uses GSAP, Lenis, useState, useEffect, or any browser API MUST have this as the very first line of the file:**
```tsx
"use client";
```

This applies to ALL components in `components/landing/` since they all use GSAP or Lenis.
Without `"use client"`, the build will fail with a hydration or server component error.

### ⚠️ Critical GSAP + Next.js Rules

- **NEVER run GSAP outside `useEffect` or `useGSAP`** — GSAP touches the DOM and crashes SSR
- **ALWAYS use `gsap.context()` and return a cleanup** — prevents memory leaks on route change
- **Register ScrollTrigger ONCE globally** — do it inside the Lenis provider, not every component
- **Call `ScrollTrigger.refresh()`** after Lenis initializes and after fonts load
- **Do NOT use `document.querySelector` inside GSAP** — use `useRef` and pass the ref element

### File & Folder Structure
```
app/
  layout.tsx              ← Fonts + wrap with LenisProvider
  globals.css             ← CSS variables in :root {}
  page.tsx                ← Import and assemble all landing components

components/
  landing/
    Navbar.tsx
    Hero.tsx
    StatsBar.tsx
    ProblemSolution.tsx
    Features.tsx
    DashboardPreview.tsx
    HowItWorks.tsx
    Testimonials.tsx
    Pricing.tsx
    FinalCTA.tsx
    Footer.tsx
  providers/
    LenisProvider.tsx     ← Lenis smooth scroll + GSAP ScrollTrigger setup

hooks/
  useGSAP.ts              ← Reusable GSAP context hook (cleanup safe)
  useScrollReveal.ts      ← Reusable scroll-triggered reveal hook
  useMagneticButton.ts    ← Magnetic hover effect hook
```

### Font Setup (app/layout.tsx) — Full File
```tsx
import type { Metadata } from 'next';
import { Sora, DM_Sans, DM_Mono } from 'next/font/google';
import './globals.css';

const sora = Sora({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-sora',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-dm-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Skoolms — School Management System',
  description: 'The all-in-one platform trusted by 500+ schools. Manage students, fees, attendance, staff, and reports from one beautiful dashboard.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${dmSans.variable} ${dmMono.variable} scroll-smooth`}
    >
      <body className="antialiased">{children}</body>
    </html>
  );
}
```

### Tailwind Config (tailwind.config.ts) — Full File
```ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sora:  ['var(--font-sora)', 'sans-serif'],
        sans:  ['var(--font-dm-sans)', 'sans-serif'],
        mono:  ['var(--font-dm-mono)', 'monospace'],
      },
      colors: {
        primary:      '#3B4FE8',
        'primary-soft':'#EEF0FD',
        accent:       '#7C3AED',
        'accent-cyan':'#06B6D4',
      },
    },
  },
  plugins: [],
};

export default config;
```

---

## 🎨 Design System — Follow Exactly

### Typography
```
Display / Hero Font:    "Sora" (Google Fonts) — weights 700, 800
Body Font:              "DM Sans" (Google Fonts) — weights 400, 500
Mono / Label Font:      "DM Mono" (Google Fonts) — weight 400

Hero Headline:          font-size: clamp(3rem, 7vw, 6rem), font-weight: 800
Section Headline:       font-size: clamp(2rem, 4vw, 3.5rem), font-weight: 700
Subheadline / Body:     font-size: 1.1rem–1.25rem, font-weight: 400, line-height: 1.75
Label / Tag text:       DM Mono, 0.75rem, letter-spacing: 0.15em, UPPERCASE
```

### Color Palette — CSS Variables Setup
**Put all of these inside `app/globals.css` in a `:root {}` block:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --color-bg:           #F8F9FE;
  --color-bg-dark:      #0A0D1A;
  --color-surface:      #FFFFFF;
  --color-surface-dark: #111827;
  --color-primary:      #3B4FE8;
  --color-primary-soft: #EEF0FD;
  --color-accent:       #7C3AED;
  --color-accent-cyan:  #06B6D4;
  --color-text:         #0F172A;
  --color-text-muted:   #64748B;
  --color-border:       #E2E8F0;
}

body {
  background-color: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-dm-sans), sans-serif;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-sora), sans-serif;
}
```
```
Gradient 1 (hero bg):   linear-gradient(135deg, #3B4FE8 0%, #7C3AED 100%)
Gradient 2 (CTA):       linear-gradient(135deg, #6366F1 0%, #06B6D4 100%)
Gradient 3 (text):      background-clip: text on linear-gradient(90deg, #3B4FE8, #7C3AED)
Gradient 4 (dark bg):   linear-gradient(180deg, #0A0D1A 0%, #0F172A 100%)
```

### Spacing & Radius
```
Section padding:        py-24 to py-32 (96px–128px top/bottom)
Container max-width:    max-w-7xl, mx-auto, px-6
Card border-radius:     rounded-2xl (16px) or rounded-3xl (24px)
Button border-radius:   rounded-full (pill shape) or rounded-xl
Shadow (cards):         shadow-[0_8px_30px_rgba(0,0,0,0.06)]
Shadow (hover):         shadow-[0_20px_60px_rgba(59,79,232,0.15)]
Glass card:             backdrop-blur-xl bg-white/70 border border-white/30
```

---

## 🧩 SECTIONS — Build All of These (In Order)

---

### SECTION 1 — Navigation Bar

**Design:**
- Fixed top bar, full width
- Background: `bg-white/80 backdrop-blur-xl border-b border-slate-100`
- Logo: "BS" monogram in gradient box + "Skoolms" text in Sora bold
- Nav links: Home, Features, Pricing, About, Contact — DM Sans, text-slate-600, hover:text-primary with underline animation
- Right side: "Sign In" ghost button + "Get Demo" filled pill button (gradient bg)
- Mobile: hamburger menu with smooth slide-down panel

**Framer Motion:**
- Fade in + slide down from top on page load (duration 0.4s)
- Nav links stagger in with 0.05s delay each

---

### SECTION 2 — Hero Section ⭐ MOST IMPORTANT

**Layout:** Centered, full viewport height (`min-h-screen`)

**Background:**
- White base
- Large soft gradient blob (blue-purple) positioned top-right, `opacity-20`, `blur-3xl`, `rounded-full`, `absolute`, `pointer-events-none`
- Second blob (cyan) bottom-left, `opacity-10`
- Subtle dot grid pattern overlay (CSS `radial-gradient` pattern)

**Content (centered):**
```
[LABEL TAG]  🎓  "SCHOOL MANAGEMENT PLATFORM"   ← DM Mono, uppercase, gradient pill badge

[HEADLINE]
"Run Your School
 Smarter with
 Skoolms"
← Sora 800, clamp(3.5rem, 7vw, 6rem)
← "Smarter" word has gradient text (blue→purple)
← Line height: 1.1

[SUBTEXT]
"The all-in-one platform trusted by 500+ schools worldwide.
 Manage students, fees, attendance, staff, and reports —
 all from one beautiful dashboard."
← DM Sans, 1.2rem, text-slate-500, max-w-2xl, mx-auto

[CTA BUTTONS — side by side, centered]
  Primary:  "Get Free Demo"  — gradient bg (#3B4FE8→#7C3AED), white text, px-8 py-4, rounded-full, shadow-lg
  Secondary: "Watch How It Works ▶"  — transparent, border border-slate-200, text-slate-700, px-8 py-4, rounded-full

[TRUST LINE below buttons]
  ✓ No credit card required   ✓ Setup in 7 days   ✓ Free onboarding support
  ← DM Sans, text-sm, text-slate-400, flex gap-6

[DASHBOARD MOCKUP]
- Below the text, a large browser-frame mockup showing a fake dashboard
- Frame: rounded-2xl, shadow-[0_40px_100px_rgba(59,79,232,0.2)], border border-slate-200
- Inside: recreate a mini analytics dashboard with:
    - Sidebar with nav items
    - Top bar with "Good morning, Principal!"
    - 4 stat cards: Total Students, Attendance Rate, Fees Collected, Staff Count
    - A fake line chart area
    - A recent activity list
- This should be CODED IN JSX (div-based mockup, not an image)
- Add a subtle floating animation: translateY(-8px to 0) looping, 3s ease-in-out
```

**Framer Motion:**
- Badge fades in first (delay 0)
- Headline words slide up staggered (delay 0.1s each word)
- Subtext fades in (delay 0.4s)
- Buttons slide up (delay 0.5s)
- Trust line fades in (delay 0.6s)
- Dashboard mockup slides up + fades in (delay 0.7s, duration 0.8s)

---

### SECTION 3 — Social Proof / Stats Bar

**Layout:** Full-width band, `bg-slate-900` dark background

**Content:**
```
[Left side — bold stats in a row]
  500+          50,000+          98%            7 Days
  Schools       Students         Satisfaction   Avg Setup Time

[Right side — "Trusted by schools in:" + 5 fake school logo placeholders]
  Each logo: rounded pill, bg-white/10, text-white/50, px-4 py-2
  Names: "Sunrise Academy", "Al-Noor School", "City Public High", "Excel Institute", "Bright Minds"
```

**Design:** Stats in Sora 800, white. Labels in DM Sans, text-slate-400. Dividers between stats.

**Framer Motion:** Count-up animation on numbers when section scrolls into view.

**Count-up implementation pattern:**
```tsx
"use client";
import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

function CountUp({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 1800;
    const step = (timestamp: number, startTime: number) => {
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame((t) => step(t, startTime));
      else setCount(target);
    };
    requestAnimationFrame((t) => step(t, t));
  }, [isInView, target]);

  return <span ref={ref}>{count}{suffix}</span>;
}
```

---

### SECTION 4 — Problem → Solution Section

**Headline:** "Schools Run on Paperwork. Until Now."

**Layout:** Two columns side by side

**LEFT COLUMN — "The Old Way" (Problems)**
```
Background: bg-red-50, border border-red-100, rounded-3xl, p-8

List of 5 problems, each with ❌ icon:
❌ Manual attendance sheets — lost, inaccurate
❌ Fee collection via cash — no records, no reminders
❌ WhatsApp groups for parent updates — unprofessional
❌ Excel gradebooks — no analysis, easy to corrupt
❌ Staff records in filing cabinets — impossible to search
```

**RIGHT COLUMN — "The Skoolms Way" (Solutions)**
```
Background: gradient bg (primary-soft), border border-blue-100, rounded-3xl, p-8

List of 5 solutions, each with ✅ icon:
✅ One-click digital attendance with parent alerts
✅ Online fee portal with auto-reminders and receipts
✅ Professional parent portal with real-time updates
✅ Smart gradebook with auto GPA and report cards
✅ Centralized staff profiles, payroll, and leave management
```

**Framer Motion:** Left column slides in from left, right column slides in from right, triggered on scroll.

---

### SECTION 5 — Features Grid Section

**Headline:** "Everything Your School Needs"
**Subtext:** "Built for principals, loved by teachers, trusted by parents."

**Layout:** 3-column grid (responsive: 1 col mobile, 2 col tablet, 3 col desktop)

**6 Feature Cards:**

```
1. 👨‍🎓 Student Management
   "Complete student profiles, enrollment, academic history, and document storage in one place."

2. 📋 Attendance Tracking
   "One-click digital attendance with instant SMS/email alerts to parents for absences."

3. 💰 Fee Management
   "Online payment portal, auto-invoicing, overdue reminders, and full financial reports."

4. 📊 Reports & Analytics
   "Real-time dashboards, performance trends, attendance reports, and at-risk student alerts."

5. 💬 Communication Portal
   "In-app messaging, school announcements, and parent portal — all in one secure place."

6. 👨‍🏫 Staff Management
   "HR profiles, payroll, leave management, and performance evaluation for all staff."
```

**Card Design:**
```
- bg-white, rounded-2xl, p-8, border border-slate-100
- shadow-[0_4px_20px_rgba(0,0,0,0.05)]
- Top: icon in a gradient pill box (48x48, rounded-xl, gradient bg)
- Title: Sora 600, 1.2rem
- Description: DM Sans, text-slate-500
- Bottom: "Learn more →" link in primary color

Hover state:
  - translateY(-6px) transform
  - shadow-[0_20px_60px_rgba(59,79,232,0.12)]
  - border-color: primary
  - transition: all 0.3s ease
```

**Framer Motion:** Cards stagger fade-up on scroll with 0.08s delay between each.

---

### SECTION 6 — Dashboard Preview Section

**Background:** `bg-slate-900` dark section, full width

**Headline:** "See Skoolms in Action" (white text, gradient word "Skoolms")
**Subtext:** "A modern, intuitive dashboard your entire team will love from day one." (text-slate-400)

**Main Visual:**
- Large laptop/screen frame (CSS-drawn, not image)
- Inside: animated dashboard mockup built with divs
  - Left sidebar: dark, nav icons + labels
  - Main area: header + grid of stat cards + a chart placeholder + a data table
- Floating badge overlays on the screen (absolute positioned):
  - Top-right: "📈 Attendance Up 12%" — white glass card
  - Bottom-left: "✅ 47 Fees Collected Today" — white glass card
  - These badges have a floating up-down CSS animation

**Framer Motion:**
- Section fades in on scroll
- Floating badges animate in with spring effect

---

### SECTION 7 — How It Works (3 Steps)

**Headline:** "Up and Running in 3 Simple Steps"

**Layout:** Horizontal 3-step flow with connecting line between steps

```
Step 1 — Setup (⚙️)
Title: "Set Up Your School"
Desc: "Add your classes, teachers, and students. Import existing data via CSV in minutes."

Step 2 — Manage (📊)
Title: "Manage Everything"
Desc: "Track attendance, collect fees, communicate with parents, and generate reports."

Step 3 — Grow (🚀)
Title: "Watch Your School Grow"
Desc: "Use analytics to identify what's working, act on insights, and improve outcomes."
```

**Design:**
- Each step: numbered circle (gradient bg), title, description
- Connecting dashed line between steps (CSS border-dashed)
- Cards: bg-white, rounded-2xl, shadow soft

**Framer Motion:** Steps reveal left to right with 0.2s stagger on scroll.

---

### SECTION 8 — Testimonials

**Headline:** "Trusted by School Leaders Worldwide"

**Layout:** 3-column card grid

**3 Testimonials:**

```
1.
Name: "Mr. Ahmad Raza"
Role: "Principal, Al-Noor Secondary School"
Avatar: Initials "AR" in gradient circle
Quote: "Skoolms completely transformed how we manage our school.
        Fee collection alone saves us 10 hours a week. I can't imagine going back."
Stars: ⭐⭐⭐⭐⭐

2.
Name: "Ms. Sarah Malik"
Role: "Head of Administration, Sunrise Academy"
Avatar: Initials "SM"
Quote: "The parent portal changed everything. Parents now trust us more
        because they can see their child's attendance and grades in real time."
Stars: ⭐⭐⭐⭐⭐

3.
Name: "Mr. Tariq Hussain"
Role: "Director, Excel Public School System"
Avatar: Initials "TH"
Quote: "We manage 3 school branches on one platform. The reports dashboard
        gives me a bird's-eye view of all three campuses instantly."
Stars: ⭐⭐⭐⭐⭐
```

**Card Design:**
- bg-white, rounded-2xl, p-8, border border-slate-100, shadow soft
- Quote in italic, DM Sans, text-slate-600
- Avatar: 48px circle, gradient bg, white initials, Sora bold

**Framer Motion:** Cards fade up with stagger on scroll.

---

### SECTION 9 — Pricing Section

**Headline:** "Simple, Transparent Pricing"
**Subtext:** "No hidden fees. Cancel anytime. Start free."

**3 Pricing Tiers:**

```
TIER 1 — Starter
Price: $49/month
Label: "For small schools"
Features:
  ✅ Up to 200 students
  ✅ Attendance & Gradebook
  ✅ Basic fee management
  ✅ Email support
  ❌ Parent portal
  ❌ Advanced analytics
CTA: "Start Free Trial" (outline button)

TIER 2 — Professional  ← HIGHLIGHT THIS (Best Value badge)
Price: $99/month
Label: "For growing schools"
Badge: "Most Popular" in gradient pill, top-right of card
Card style: gradient border, deeper shadow, slightly larger scale
Features:
  ✅ Up to 1,000 students
  ✅ All Starter features
  ✅ Parent portal
  ✅ Advanced analytics
  ✅ Staff management
  ✅ Priority support
CTA: "Get Started" (gradient filled button)

TIER 3 — Enterprise
Price: "Custom"
Label: "For large institutions"
Features:
  ✅ Unlimited students
  ✅ All Professional features
  ✅ Multi-branch management
  ✅ Custom integrations
  ✅ Dedicated account manager
  ✅ SLA guarantee
CTA: "Contact Sales" (outline button)
```

**Card Design:** rounded-2xl, p-8, bg-white. Professional tier: ring-2 ring-primary, shadow-[0_20px_60px_rgba(59,79,232,0.15)], scale-[1.03]

---

### SECTION 10 — Final CTA Section

**Background:** Full-width gradient `linear-gradient(135deg, #3B4FE8, #7C3AED)` — deep rich gradient

**Content (centered):**
```
[Headline — white, Sora 800]
"Your School Deserves Better.
 Start Today — Free."

[Subtext — white/70]
"Join 500+ schools already using Skoolms.
 Setup takes less than a week. No IT team required."

[2 CTA Buttons]
  Primary:   "Get Free Demo"       — white bg, primary text, rounded-full, px-8 py-4
  Secondary: "Talk to Our Team →"  — transparent, border white/30, white text, rounded-full

[Trust icons below]
  🔒 Secure & Encrypted   ☁️ Cloud-Based   🌍 Used in 20+ Countries   ⚡ 99.9% Uptime
```

**Framer Motion:** Headline words scale up on scroll. Buttons slide up. Trust icons fade in stagger.

---

### SECTION 11 — Footer

**Layout:** 4-column grid

```
Column 1: Logo + tagline + social icons (Twitter, LinkedIn, Instagram — SVG icons)
Column 2: Product links (Features, Pricing, Demo, Changelog)
Column 3: Company links (About, Blog, Careers, Press)
Column 4: Contact (email, phone, address)

Bottom bar: © 2026 Skoolms · Privacy Policy · Terms of Service
```

**Design:** bg-slate-900, text-slate-400, links hover:text-white

---

## ⚡ Animation System — GSAP + Lenis

### Animation Philosophy
```
✅ Slow + smooth (duration 0.8s–1.2s minimum)
✅ Only animate what matters — not everything at once
✅ Scroll is the timeline — tell a story as user scrolls
✅ Calm, trustworthy motion — this is school software, not a game
❌ No bouncy springs
❌ No fast flashes
❌ No more than 2 things animating simultaneously
```

---

### STEP 1 — LenisProvider (components/providers/LenisProvider.tsx)

This is the foundation. Build this FIRST before any other animations.

```tsx
"use client";

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenisRef.current = lenis;

    // Connect Lenis to GSAP ticker so ScrollTrigger stays in sync
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // Refresh ScrollTrigger after Lenis is ready
    lenis.on('scroll', ScrollTrigger.update);
    ScrollTrigger.refresh();

    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
    };
  }, []);

  return <>{children}</>;
}
```

**Add to `app/layout.tsx`:** Wrap `{children}` with `<LenisProvider>`:
```tsx
<body className="antialiased">
  <LenisProvider>{children}</LenisProvider>
</body>
```

---

### STEP 2 — Reusable Hooks (hooks/)

**hooks/useScrollReveal.ts** — Use this in every section component:
```tsx
"use client";

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.from(el, {
        y: 60,
        opacity: 0,
        duration: 1.0,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true,
        },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return ref;
}
```

**hooks/useMagneticButton.ts** — Magnetic cursor effect for CTA buttons:
```tsx
"use client";

import { useRef, useEffect } from 'react';
import gsap from 'gsap';

export function useMagneticButton() {
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(el, { x: x * 0.3, y: y * 0.3, duration: 0.4, ease: 'power2.out' });
    };

    const handleMouseLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return ref;
}
```

---

### STEP 3 — Scroll Progress Bar

Add this as a fixed top bar in `Navbar.tsx`:
```tsx
useEffect(() => {
  const ctx = gsap.context(() => {
    gsap.to('#scroll-progress', {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.3,
      },
    });
  });
  return () => ctx.revert();
}, []);

// JSX — place inside Navbar, above everything:
<div
  id="scroll-progress"
  className="fixed top-0 left-0 right-0 h-[2px] z-[9999] origin-left scale-x-0"
  style={{ background: 'linear-gradient(90deg, #3B4FE8, #7C3AED)' }}
/>
```

---

### STEP 4 — Hero Section Animations (Hero.tsx)

```tsx
useEffect(() => {
  const ctx = gsap.context(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // 1. Badge fades in
    tl.from('#hero-badge', { y: 20, opacity: 0, duration: 0.7 });

    // 2. Headline words stagger up (split headline into <span> per word)
    tl.from('.hero-word', { y: 80, opacity: 0, stagger: 0.06, duration: 0.9 }, '-=0.3');

    // 3. Subtext
    tl.from('#hero-sub', { y: 30, opacity: 0, duration: 0.8 }, '-=0.4');

    // 4. Buttons
    tl.from('.hero-btn', { y: 20, opacity: 0, stagger: 0.1, duration: 0.7 }, '-=0.4');

    // 5. Trust line
    tl.from('#hero-trust', { y: 15, opacity: 0, duration: 0.6 }, '-=0.3');

    // 6. Dashboard mockup scales in + fades
    tl.from('#hero-dashboard', { y: 60, opacity: 0, scale: 0.96, duration: 1.2 }, '-=0.3');

    // 7. Background gradient blob subtle parallax
    gsap.to('#hero-blob-1', {
      y: -60,
      ease: 'none',
      scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1.5 },
    });
    gsap.to('#hero-blob-2', {
      y: -30,
      ease: 'none',
      scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 2 },
    });
  });

  return () => ctx.revert();
}, []);
```

**How to split hero headline into words (JSX):**
```tsx
const headline = "Run Your School Smarter with Skoolms";
const words = headline.split(' ');

<h1>
  {words.map((word, i) => (
    <span key={i} style={{ overflow: 'hidden', display: 'inline-block' }}>
      <span className="hero-word inline-block">
        {word === 'Smarter' ? (
          <span style={{ background: 'linear-gradient(90deg,#3B4FE8,#7C3AED)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
            {word}
          </span>
        ) : word}
      </span>
      {i < words.length - 1 ? '\u00A0' : ''}
    </span>
  ))}
</h1>
```

---

### STEP 5 — Pinned Features Section (Features.tsx)

This is the Apple-style pin: section stays fixed, content changes as user scrolls.

```tsx
useEffect(() => {
  const ctx = gsap.context(() => {
    const cards = gsap.utils.toArray<HTMLElement>('.feature-card');

    // Pin the features section
    ScrollTrigger.create({
      trigger: '#features-section',
      start: 'top top',
      end: `+=${cards.length * 300}`,
      pin: true,
      pinSpacing: true,
    });

    // Cards stagger in as user scrolls through pinned section
    cards.forEach((card, i) => {
      gsap.from(card, {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '#features-section',
          start: `top+=${i * 300} top`,
          end: `top+=${i * 300 + 200} top`,
          scrub: 0.5,
        },
      });
    });
  });

  return () => ctx.revert();
}, []);
```

---

### STEP 6 — Dashboard Preview Parallax (DashboardPreview.tsx)

```tsx
useEffect(() => {
  const ctx = gsap.context(() => {
    // Main screen subtle scale on scroll
    gsap.fromTo('#dashboard-screen', { scale: 0.95, opacity: 0.6 }, {
      scale: 1,
      opacity: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: '#dashboard-preview',
        start: 'top 80%',
        end: 'top 20%',
        scrub: 1,
      },
    });

    // Floating badge 1 — moves up faster than screen
    gsap.to('#float-badge-1', {
      y: -25,
      ease: 'none',
      scrollTrigger: {
        trigger: '#dashboard-preview',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.2,
      },
    });

    // Floating badge 2 — moves at different speed
    gsap.to('#float-badge-2', {
      y: -40,
      ease: 'none',
      scrollTrigger: {
        trigger: '#dashboard-preview',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 2,
      },
    });

    // Subtle rotate on scroll
    gsap.to('#dashboard-screen', {
      rotateX: 2,
      ease: 'none',
      scrollTrigger: {
        trigger: '#dashboard-preview',
        start: 'top bottom',
        end: 'center center',
        scrub: 1,
      },
    });
  });

  return () => ctx.revert();
}, []);
```

---

### STEP 7 — Standard Scroll Reveal (All Other Sections)

Use this pattern in StatsBar, ProblemSolution, HowItWorks, Testimonials, Pricing, FinalCTA:

```tsx
useEffect(() => {
  const ctx = gsap.context(() => {

    // Section headline reveal
    gsap.from('.section-headline', {
      y: 50,
      opacity: 0,
      duration: 1.0,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.section-headline', start: 'top 85%', once: true },
    });

    // Cards / items stagger
    gsap.from('.stagger-item', {
      y: 60,
      opacity: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: 'power2.out',
      scrollTrigger: { trigger: '.stagger-item', start: 'top 85%', once: true },
    });

  });
  return () => ctx.revert();
}, []);
```

---

### STEP 8 — Final CTA Animation (FinalCTA.tsx)

```tsx
useEffect(() => {
  const ctx = gsap.context(() => {
    const tl = gsap.timeline({
      scrollTrigger: { trigger: '#final-cta', start: 'top 75%', once: true },
    });

    tl.from('#cta-headline', { y: 50, opacity: 0, duration: 1.0, ease: 'power3.out' })
      .from('#cta-sub', { y: 30, opacity: 0, duration: 0.8 }, '-=0.5')
      .from('.cta-btn', { y: 20, opacity: 0, stagger: 0.15, duration: 0.7 }, '-=0.4')
      .from('.cta-trust', { y: 15, opacity: 0, stagger: 0.1, duration: 0.6 }, '-=0.3');

    // Gradient background subtle animation (CSS keyframes, not GSAP)
    // Add class "animate-gradient-shift" on the section bg div
  });
  return () => ctx.revert();
}, []);
```

Add this to `globals.css` for the gradient shift:
```css
@keyframes gradientShift {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.animate-gradient-shift {
  background-size: 200% 200%;
  animation: gradientShift 8s ease infinite;
}
```

---

### Animation Timing Reference

| Element | Duration | Ease | Delay/Stagger |
|---|---|---|---|
| Hero badge | 0.7s | power3.out | 0 |
| Hero headline words | 0.9s | power3.out | 0.06s per word |
| Hero subtext | 0.8s | power3.out | after words |
| Hero buttons | 0.7s | power3.out | 0.1s stagger |
| Hero dashboard | 1.2s | power3.out | last |
| Section headlines | 1.0s | power3.out | on scroll |
| Cards stagger | 0.8s | power2.out | 0.12s per card |
| Dashboard parallax | scrub 1–2 | none | scroll-driven |
| Floating badges | scrub 1.2–2 | none | scroll-driven |
| CTA section | 1.0s | power3.out | on scroll |
| Magnetic button snap-back | 0.6s | elastic.out | on mouseleave |

---

## 📱 Responsive Breakpoints (Tailwind)

```
Mobile (default):  Single column, reduced font sizes, stacked buttons
Tablet (md: 768px): 2-column grids, medium font sizes
Desktop (lg: 1024px): Full layout as described above
Wide (xl: 1280px): max-w-7xl container, more generous spacing
```

---

## 📦 Installation — Run These First

```bash
npm install gsap
npm install @gsap/react
npm install lenis
npm install lucide-react
npm install framer-motion@^11
```

> ⚠️ **package.json note:** All five must appear under `dependencies`, NOT `devDependencies`.
> GSAP free tier includes ScrollTrigger — no Club GreenSock license needed for this project.

Verify `tailwind.config.ts` includes `fontFamily` config as shown above.
Verify `app/globals.css` has `@tailwind base/components/utilities` directives.

---

## ✅ Quality Checklist — Your Output Must Pass All Of These

- [ ] `"use client"` is the first line in EVERY component in `components/landing/`
- [ ] Fonts loaded via `next/font/google` in `app/layout.tsx` (NOT @import)
- [ ] CSS variables defined in `app/globals.css` under `:root {}`
- [ ] `tailwind.config.ts` has `fontFamily` mapped to CSS variables
- [ ] `LenisProvider` wraps children in `app/layout.tsx`
- [ ] `gsap.registerPlugin(ScrollTrigger)` called ONCE inside `LenisProvider`
- [ ] Lenis connected to GSAP ticker (`gsap.ticker.add`)
- [ ] `ScrollTrigger.refresh()` called after Lenis init
- [ ] Every GSAP animation uses `gsap.context()` with cleanup (`return () => ctx.revert()`)
- [ ] Scroll progress bar visible at top of page (fixed, 2px, gradient)
- [ ] Hero headline split into words, each animates up with stagger
- [ ] Hero background blobs have parallax on scroll (scrub)
- [ ] Features section is pinned with ScrollTrigger (Apple-style)
- [ ] Dashboard preview has parallax + scale on scroll (scrub)
- [ ] Floating badges animate at different speeds (different scrub values)
- [ ] All CTA buttons have magnetic hover effect
- [ ] All section headlines use scroll reveal
- [ ] All cards use staggered scroll reveal (0.12s stagger)
- [ ] Final CTA gradient has CSS animation (gradientShift keyframe)
- [ ] Hero section fills full viewport height
- [ ] All fonts are Sora (headings) and DM Sans (body)
- [ ] Gradient colors used exactly as specified in the color palette
- [ ] Dashboard mockup is coded in JSX divs (NOT an img tag)
- [ ] Feature cards have hover lift + glow shadow
- [ ] Pricing middle card is visually elevated (scale + ring + shadow)
- [ ] Footer is dark (bg-slate-900)
- [ ] Fully responsive (animations disabled or simplified on mobile)
- [ ] No placeholder images — all visuals are CSS/JSX coded
- [ ] `npm run build` passes with zero TypeScript or linting errors

---

## 🚫 What NOT To Do

- Do NOT use `<img>` tags for the dashboard — code it with divs
- Do NOT use shadcn/ui, MUI, or Chakra
- Do NOT use Arial, Roboto, or system fonts
- Do NOT use flat/plain purple-on-white gradients (use the exact palette above)
- Do NOT skip any section listed above
- Do NOT add unnecessary text — keep copy tight and punchy
- Do NOT forget mobile responsiveness
- Do NOT use stock photo placeholders — use initials avatars and icon-based graphics
- Do NOT run GSAP code outside `useEffect` — it will crash Next.js SSR
- Do NOT forget `ctx.revert()` cleanup in every GSAP `useEffect`
- Do NOT register `ScrollTrigger` in multiple components — only once in `LenisProvider`
- Do NOT use `document.querySelector` in GSAP — always use `useRef`
- Do NOT make animations fast or bouncy — slow, premium, calm only
- Do NOT animate everything — only headlines, cards, and key visuals
- Do NOT add `"use client"` to `app/page.tsx` — it is a server component and that's correct

---

## 📦 Output Format — Next.js File Structure

Deliver files matching this exact structure:

```
app/layout.tsx                    ← Font setup + LenisProvider wrapper
app/globals.css                   ← CSS variables + gradientShift keyframe
app/page.tsx                      ← Imports and assembles all components (server component)

components/
  providers/
    LenisProvider.tsx             ← Lenis init + GSAP ScrollTrigger registration
  landing/
    Navbar.tsx                    ← "use client" + scroll progress bar
    Hero.tsx                      ← "use client" + full GSAP hero timeline
    StatsBar.tsx                  ← "use client" + count-up + scroll reveal
    ProblemSolution.tsx           ← "use client" + slide-in from sides
    Features.tsx                  ← "use client" + ScrollTrigger pin
    DashboardPreview.tsx          ← "use client" + parallax scrub
    HowItWorks.tsx                ← "use client" + stagger reveal
    Testimonials.tsx              ← "use client" + stagger reveal
    Pricing.tsx                   ← "use client" + scroll reveal
    FinalCTA.tsx                  ← "use client" + GSAP timeline + CSS gradient anim
    Footer.tsx                    ← no "use client" needed (static, no animations)

hooks/
  useScrollReveal.ts              ← Reusable scroll reveal hook
  useMagneticButton.ts            ← Magnetic cursor hook for CTA buttons
```

**Template for every component file:**
```tsx
"use client";

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ComponentName() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // All GSAP animations go here
    }, sectionRef);

    return () => ctx.revert(); // ALWAYS clean up
  }, []);

  return (
    <section ref={sectionRef}>
      {/* content */}
    </section>
  );
}
```

**app/page.tsx template (server component — NO "use client"):**
```tsx
import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import StatsBar from '@/components/landing/StatsBar';
import ProblemSolution from '@/components/landing/ProblemSolution';
import Features from '@/components/landing/Features';
import DashboardPreview from '@/components/landing/DashboardPreview';
import HowItWorks from '@/components/landing/HowItWorks';
import Testimonials from '@/components/landing/Testimonials';
import Pricing from '@/components/landing/Pricing';
import FinalCTA from '@/components/landing/FinalCTA';
import Footer from '@/components/landing/Footer';

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <StatsBar />
      <ProblemSolution />
      <Features />
      <DashboardPreview />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <FinalCTA />
      <Footer />
    </main>
  );
}
```

Each file should be clean, readable, and production-ready.

---

*This prompt was prepared for Skoolms School Management System — a platform serving schools worldwide.*
*© 2026 Skoolms. All rights reserved.*