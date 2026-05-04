# CLAUDE.md — Client Website Build Rules

Production rules for building bespoke client websites from a shared template. Speed comes from the template; soul comes from these rules.

**The vibe:** calm, healing, welcoming, premium. Sites should feel like a deep breath — warm neutrals, soft motion, considered typography, purposeful density. Never sterile, never loud, never gappy.

**The bar:** FAANG-grade. Lighthouse 90+, WCAG 2.1 AA, fully responsive across mobile/tablet/desktop, SEO-structured, zero console noise. Every interactive element has four states. No exceptions.

---

## Always Do First
- **Invoke the `frontend-design` skill** before writing any frontend code. Every session.
- **Read everything in `assets/`** — screenshots of the client's current site, brand assets, inspiration. Whatever the client provided, ingest it before designing.
- **Identify the build mode** (below) before touching code.
- **Start `serve.mjs`** in the background. Don't start a second instance if it's running.

---

## Reference Folders

Check these at the start of every project:

- `assets/screenshots/` — the client's **current website** screenshots. The redesign reference (Mode A).
- `assets/brand/` (or any `brand_assets/` folder) — logos, color palettes, fonts, photography. **Authoritative** for identity. If a brand color, font, or logo is defined here, use it. Don't invent.
- `assets/inspiration/` — only present in Mode B. Sites the client wants to match exactly.

If both a screenshot folder and a brand folder exist, the brand folder wins for color, type, and logo. The screenshots win for content and structure.

---

## Build Modes

### Mode A — Redesign from client reference (DEFAULT)

The most common case. Screenshots in `assets/screenshots/` are the client's **current website** — context for the redesign, **not** a target to reproduce. You are improving on what they have, not cloning it.

**What to extract from the screenshots:**
- Information architecture: pages, sections, navigation structure.
- Content: headlines, body copy, service offerings, testimonials, contact info, hours, locations.
- Trust signals: credentials, certifications, awards, partner logos.
- Calls to action and conversion points.
- Brand hints: any logo, color cues, photography style (only authoritative if confirmed in `assets/brand/`).
- Business context: what they sell, who they serve, what they emphasize.

**What to ignore from the screenshots:**
- Their existing layout — you're redesigning it.
- Their existing typography choices.
- Their existing color choices (unless `assets/brand/` confirms them as canonical).
- Anything dated, generic, or low-craft.

**Freedom to redesign:**
- Hero section: redesign freely. Reuse the headline copy or write a stronger version (flag rewrites).
- Page structure and section order: reorganize for clarity and flow.
- Footer: redesign with all contact / legal / nav info preserved.
- Blog cards, service cards, testimonials, pricing tables: redesign freely.
- Navigation: simplify if cluttered. Combine pages if overlapping.
- Page titles and section titles: reword if the original is weak. Keep core meaning.
- Blog post layout: redesign freely. Body copy stays.

**What stays the client's, untouched:**
- Business facts: services, prices, hours, addresses, names, credentials, contact info.
- Brand colors and logo if defined in `assets/brand/`.
- Legal / regulatory copy (HIPAA notices, terms, privacy text).
- Any copy the client has explicitly flagged as approved.
- Testimonial wording (you can restyle, not rewrite).

If you're unsure whether to redesign or preserve something, **ask**.

### Mode B — Match an inspiration site

Rare. Triggered when the user explicitly says "make it look like [site]" or provides reference under `assets/inspiration/`.

- Match layout, spacing, typography, color, hierarchy **exactly**.
- Swap in client content from `assets/screenshots/` or the brief.
- Do not improve or add to the inspiration design.
- Run the screenshot comparison loop. Minimum 2 rounds.

### Mode C — From-scratch text brief

No reference at all. Design DNA does the heavy lifting.
- Default to the calm/healing aesthetic unless the brief says otherwise.
- Self-critique your output before declaring done.

If reference and text brief conflict in any mode, **ask** — don't guess.

---

## Logo Rules

- **Always use the SVG** from `assets/brand/` or `brand_assets/`. Never use a PNG with a white background in the nav.
- If the SVG has a hardcoded `<rect fill="white"/>` or `background="white"`, remove it — the logo mark must sit on transparent.
- Nav logo: `<img src="logo.svg" alt="[Clinic Name]" width="..." height="..." />` with explicit dimensions to prevent layout shift.
- If using Next.js `<Image>`, set `priority={true}` — it's above the fold.
- Logo must sit cleanly on the nav background with no bounding box, no white square, no border artifact.

---

## Hero Section — Non-Negotiable Pattern

The hero is the most important section on the site. It must be immediately compelling, above the fold, and load fast. One clear message. One clear action.

### Required layout: Full-width background image, text overlaid

```html
<section class="relative min-h-[92vh] flex items-end md:items-center">

  <!-- 1. Background image — fills edge to edge, no gaps -->
  <img
    src="hero.jpg"
    alt="Registered massage therapist treating a patient in a warm, sunlit room"
    width="1920" height="1080"
    class="absolute inset-0 w-full h-full object-cover object-center"
    fetchpriority="high"
  />

  <!-- 2. Gradient overlay — dark at bottom/left for text legibility -->
  <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/35 to-black/10
              md:bg-gradient-to-r md:from-black/65 md:via-black/30 md:to-transparent">
  </div>

  <!-- 3. Optional: subtle warm color wash over the image -->
  <div class="absolute inset-0 bg-[#304830]/20 mix-blend-multiply"></div>

  <!-- 4. Content — left-aligned desktop, bottom-anchored mobile -->
  <div class="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pb-24 md:pb-0">
    <p class="eyebrow text-white/70 mb-4">01 — Vancouver · Burrard Street</p>
    <h1 class="display-heading text-white max-w-2xl mb-6">
      Registered massage therapy, <em class="text-[#C0D878]">considered.</em>
    </h1>
    <p class="text-white/80 text-lg max-w-xl mb-10 leading-relaxed">
      Five RMTs delivering deep, individualized treatment plans on Burrard Street.
    </p>
    <div class="flex flex-wrap gap-4">
      <a href="#booking" class="btn-primary">Book on Jane App</a>
      <a href="tel:6043419060" class="btn-ghost-light">604.341.9060</a>
    </div>
  </div>

  <!-- 5. Trust bar — inside the hero, overlaid at bottom -->
  <div class="absolute bottom-0 left-0 right-0 z-10
              bg-gradient-to-t from-black/60 to-transparent
              px-6 md:px-12 py-5">
    <div class="max-w-7xl mx-auto flex flex-wrap gap-8 md:gap-16">
      <div>
        <span class="text-white text-2xl font-semibold">5</span>
        <span class="text-white/60 text-xs uppercase tracking-widest ml-2">Registered RMTs</span>
      </div>
      <div>
        <span class="text-white text-2xl font-semibold">7/7</span>
        <span class="text-white/60 text-xs uppercase tracking-widest ml-2">Open every day</span>
      </div>
      <div>
        <span class="text-white text-2xl font-semibold">14h</span>
        <span class="text-white/60 text-xs uppercase tracking-widest ml-2">7:30am – 9:30pm</span>
      </div>
    </div>
  </div>

</section>
```

### Hero Rules

**Layout:**
- `min-h-[92vh]` on desktop. Never a short banner. It must fill the viewport.
- Text left-aligned on desktop, bottom-anchored on mobile.
- Trust bar is **part of the hero** — overlaid at the bottom inside the same `<section>`, not a separate block. This eliminates the gap between hero and next section.
- No floating cards, decorative panels, abstract SVG shapes, or illustration columns beside the text.
- **No split layout. No image on the right. No image column. The image IS the background.**

**Image:**
- `object-cover object-center` — fills 100% of the section at all viewports.
- Explicit `width`/`height` on `<img>` to prevent CLS.
- `fetchpriority="high"` — this is the LCP element. Must load first.
- Never `loading="lazy"` on the hero image.
- Placeholder: `https://placehold.co/1920x1080/304830/C0D878` — brand palette so it looks intentional.
- Mobile: `object-position: center top` to keep faces in frame.

**Overlay:**
- Always a gradient overlay — text on an unprotected image is inaccessible.
- Mobile: `from-black/70` bottom-up (text is at the bottom).
- Desktop: `from-black/65` left-to-right (text is on the left).
- Optional warm wash: `bg-[#304830]/20 mix-blend-multiply` to pull image into brand palette.

**Typography on hero:**
- Headline: `text-white` or bone `#F4EFE6`.
- Italic accent word: `text-[#C0D878]` (leaf) or `text-[#B8634A]` (clay) — pops on dark.
- Subheadline: `text-white/80`.
- Eyebrow: `text-white/60`.

**Fallback (no client photo):**
```html
<div class="absolute inset-0"
     style="background: radial-gradient(ellipse at 30% 50%, #4a6741 0%, #304830 40%, #1c2e1a 100%)">
</div>
<svg class="absolute inset-0 w-full h-full opacity-[0.04]">
  <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3"/></filter>
  <rect width="100%" height="100%" filter="url(#grain)"/>
</svg>
```

---

## Footer — Non-Negotiable Pattern

The footer is a trust signal and navigation safety net. Apple/Stripe/Patagonia pattern: organized columns, dark contrast, every important link present, no clutter.

### Required layout

```html
<footer class="bg-[#1C1F1B] text-[#A09880]">

  <!-- Pre-footer CTA strip -->
  <div class="border-b border-white/10 py-12 px-6 md:px-12">
    <div class="max-w-7xl mx-auto flex flex-col md:flex-row
                items-start md:items-center justify-between gap-6">
      <div>
        <h2 class="text-white text-2xl font-semibold mb-1">Ready to feel better?</h2>
        <p class="text-white/50 text-sm">Book online in under a minute.</p>
      </div>
      <a href="#booking" class="btn-primary flex-shrink-0">Book on Jane App</a>
    </div>
  </div>

  <!-- Main footer grid -->
  <div class="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-16
              grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">

    <!-- Brand -->
    <div class="col-span-2 md:col-span-1">
      <img src="logo.svg" alt="RMT Corner" width="120" height="40"
           class="mb-4 brightness-0 invert opacity-80" />
      <p class="text-sm leading-relaxed mb-6">
        Registered massage therapy on Vancouver's Burrard Street.
      </p>
    </div>

    <!-- Navigate -->
    <div>
      <h3 class="text-white/90 text-xs uppercase tracking-widest mb-4">Navigate</h3>
      <ul class="space-y-2 text-sm">
        <li><a href="/" class="hover:text-white/80 transition-colors duration-200">Home</a></li>
        <li><a href="/therapists" class="hover:text-white/80 transition-colors duration-200">Therapists</a></li>
        <li><a href="/pricing" class="hover:text-white/80 transition-colors duration-200">Pricing</a></li>
        <li><a href="/about" class="hover:text-white/80 transition-colors duration-200">About</a></li>
        <li><a href="/journal" class="hover:text-white/80 transition-colors duration-200">Journal</a></li>
        <li><a href="/contact" class="hover:text-white/80 transition-colors duration-200">Contact</a></li>
      </ul>
    </div>

    <!-- Visit -->
    <div>
      <h3 class="text-white/90 text-xs uppercase tracking-widest mb-4">Visit</h3>
      <address class="not-italic text-sm leading-loose">
        1160 Burrard St, Suite 308<br>
        Vancouver, BC V6Z 2E8<br>
        <a href="tel:6043419060" class="hover:text-white/80 transition-colors duration-200">604.341.9060</a><br>
        Mon–Sun · 7:30am – 9:30pm
      </address>
    </div>

    <!-- Book -->
    <div>
      <h3 class="text-white/90 text-xs uppercase tracking-widest mb-4">Book</h3>
      <ul class="space-y-2 text-sm">
        <li><a href="#" target="_blank" rel="noopener" class="hover:text-white/80 transition-colors duration-200">Jane App Booking</a></li>
        <li><a href="/pricing" class="hover:text-white/80 transition-colors duration-200">Session Pricing</a></li>
        <li><a href="/contact" class="hover:text-white/80 transition-colors duration-200">Send a message</a></li>
      </ul>
    </div>
  </div>

  <!-- Bottom bar -->
  <div class="border-t border-white/10 px-6 md:px-12 py-5">
    <div class="max-w-7xl mx-auto flex flex-col sm:flex-row
                justify-between items-center gap-3 text-xs text-white/30">
      <span>© 2025 RMT Corner. All rights reserved.</span>
      <div class="flex gap-6">
        <a href="/privacy" class="hover:text-white/60 transition-colors duration-200">Privacy Policy</a>
        <a href="/terms" class="hover:text-white/60 transition-colors duration-200">Terms</a>
      </div>
    </div>
  </div>

</footer>
```

### Footer Rules

**Color:**
- Background: dark brand tone, not pure black. Use `#1C1F1B` (ink), `#22271F`, or `#2A2D26`.
- Body text: `#A09880` — muted warm, never `text-gray-400` (too cool).
- Column headings: `text-white/90` · Links: `text-white/50` default → `text-white/80` hover.
- Never a white footer. Never the same color as the page — it must visually close it.

**Structure:**
- Pre-footer CTA strip (border-separated) — converts users who scrolled to the bottom.
- 4-column grid desktop · 2-column tablet · 1-column mobile.
- Column headings: `text-xs uppercase tracking-widest`.
- Links: `space-y-2` — tight, not sprawling.
- Bottom bar: `border-t border-white/10` — copyright + legal only.

**Logo in footer:**
- `brightness-0 invert opacity-80` — renders any logo as muted white. Clean.

**What belongs:**
- Brand mark + tagline + social icons.
- Full nav (all pages).
- Physical address, phone, hours in `<address>`.
- Booking link + secondary CTAs.
- Copyright, Privacy, Terms.

**What does NOT belong:**
- Long copy blocks · Testimonials · Hero photography · Redundant CTAs.

---

## Spacing — Purposeful Density, Not Random Gaps

The #1 mistake: defaulting to `py-24`/`py-32` everywhere, creating a loose, unfinished feel. FAANG sites use **purposeful density** — sections feel complete, not padded for padding's sake.

### Section padding scale
```
Mobile:  py-12  (48px)
Tablet:  py-16  (64px)
Desktop: py-20  (80px)  ← maximum for standard sections
Hero:    min-h-[92vh]   ← fills viewport, no section padding
Footer:  py-12 / py-16  ← fixed, tight
```

**Never use `py-24` or `py-32` as a default.** Reserve these only for deliberate editorial "breathing" moments (a full-bleed pull quote, a centered brand manifesto). All other sections: `py-16 md:py-20`.

### Eliminating gaps between sections
- Hero trust bar is **inside** the hero section — no gap between hero and next content.
- `<section>` elements have **zero** `mt-` or `mb-`. Spacing is padding inside, never margin between.
- Cards: `gap-4 md:gap-6`. Not `gap-8` unless cards are large feature blocks.
- Column gaps: `gap-6 md:gap-8`.

---

## Local Server
- Static builds: `node serve.mjs` → `http://localhost:3000`. Never `file:///`.
- Next.js builds: `npm run dev` → `http://localhost:3000`. No serve.mjs needed.

## Screenshot Workflow
- Puppeteer at `C:/Users/nateh/AppData/Local/Temp/puppeteer-test/`.
- Always screenshot localhost: `node screenshot.mjs http://localhost:3000`
- Saves to `./temporary screenshots/screenshot-N.png`.
- Optional label: `node screenshot.mjs http://localhost:3000 hero`
- Read PNG with the Read tool after every shot.
- **Comparison must be specific:** "heading is 32px, reference is 24px" — not "looks close."
- **Required viewports every pass:** 375px · 768px · 1280px.

---

## Design DNA — Calm, Healing, Welcoming, Premium

### Color
- **Base:** `#FBF9F6`, `#F5F1EC`, `#EFE9E1`, `#E8E0D5`. **Never pure `#FFFFFF`.**
- **Brand hues:** muted, earthy — sage, dusty rose, terracotta, ochre, forest, warm sand.
- **Text:** `#1F1A14`, `#2A241D`, `#3A3128` body. `#6B5F52` secondary.
- **Forbidden:** Tailwind blue/indigo as primary · neon · pure black on pure white.

### Typography
- Always two fonts: serif display + humanist sans.
- **Headings:** Fraunces, Cormorant, EB Garamond, Newsreader.
- **Body:** DM Sans, Inter, IBM Plex Sans.
- Display tracking: `-0.02em` to `-0.04em`. Line-height: `1.05–1.15`.
- Body: `16–18px`, `line-height: 1.65–1.8`, `max-w-[65ch]`.
- Weight: `500–600` headings (not 700+). `400` body.
- Italics on serif for soft emphasis.
- Fluid type with `clamp()`.

### Surfaces & Depth
- Shadows: `box-shadow: 0 24px 48px -16px rgba(60, 50, 40, 0.12)`.
- Borders: `1px solid rgba(0,0,0,0.06)`.
- Radius: `12–20px` cards · `8–12px` buttons.
- Hero grain: SVG noise at 2–4% opacity.

### Motion
- `transform` and `opacity` only. **Never `transition-all`.**
- `300–500ms` · `cubic-bezier(0.22, 1, 0.36, 1)`.
- Honor `prefers-reduced-motion: reduce`.

---

## Responsive Design

### Breakpoints
Base 375px · `sm:` 640px · `md:` 768px · `lg:` 1024px · `xl:` 1280px · `2xl:` 1536px

### Mobile rules
- Touch targets: 44×44px minimum.
- Form inputs: `font-size: 16px` minimum.
- No horizontal scroll. Ever.
- Hamburger nav at `md:`. Sticky header max 56–64px.

---

## SEO Structure

Every page: `<html lang="en">`, unique `<title>` (50–60 chars), unique `<meta name="description">` (150–160 chars), `<link rel="canonical">`, Open Graph tags, Twitter card, `<meta name="theme-color">`.

JSON-LD in `<head>`: `LocalBusiness`, `WebSite`, `BlogPosting`, `FAQPage`, `Service`, `Person`, `BreadcrumbList` — add what fits the page.

One `<h1>` per page. Sequential heading hierarchy. Descriptive `alt` on every image. Descriptive anchor text. `rel="noopener"` on external links.

---

## Quality Bar

**Lighthouse mobile:** 90+ Performance · 95+ Accessibility · 95+ Best Practices · 95+ SEO.
**Core Web Vitals:** LCP < 2.5s · CLS < 0.1 · INP < 200ms.

Hero image: `fetchpriority="high"`, explicit dimensions, no `loading="lazy"`.
Below-fold images: `loading="lazy"`, explicit dimensions.

WCAG 2.1 AA: semantic HTML, 4.5:1 contrast body, 3:1 large text, skip-to-content link, keyboard navigable, visible focus states, `<label>` on all form fields.

**Four states on every interactive element:** default · hover · focus-visible · active.

---

## Hard Rules

- Do **not** clone the client's current site (Mode A = redesign).
- Do **not** use a PNG with white background for the nav logo — use SVG.
- Do **not** build a hero with text-left + image/shape-right split layout.
- Do **not** build a hero shorter than `min-h-[85vh]`.
- Do **not** put the trust bar as a separate section below the hero — embed it inside.
- Do **not** use `py-24` or `py-32` as default section padding.
- Do **not** add `mt-` or `mb-` to `<section>` elements.
- Do **not** use a white or page-colored footer — it must be dark and distinct.
- Do **not** use `transition-all`.
- Do **not** use Tailwind blue/indigo as primary.
- Do **not** use pure `#FFFFFF` for page backgrounds.
- Do **not** ship with console errors or warnings.
- Do **not** invent brand colors when `assets/brand/` defines them.
- Do **not** rewrite client business facts.
- Do **not** skip `focus-visible` on any interactive element.
- Do **not** ship without JSON-LD structured data.
- Do **not** stop after one screenshot pass.
- If reference and brief conflict, **ask** — don't guess.

---

## Project Kickoff Checklist

1. Read `assets/screenshots/`, `assets/brand/`, `assets/inspiration/`.
2. Confirm build mode (A / B / C).
3. Verify SVG logo in `assets/brand/` — confirm no white background rect.
4. List pages and sections to build.
5. Pull business facts: services, contact, hours, credentials, booking URL.
6. Confirm brand hero color; derive the ramp.
7. Confirm type pairing (display + sans).
8. Decide JSON-LD schemas.
9. Start dev server.
10. **Build mobile-first at 375px.**
11. Hero first — full-viewport background image, gradient overlay, text on top, trust bar embedded inside at bottom.
12. Layer up: 768px → 1280px.
13. Footer — dark background, 4-column grid, pre-footer CTA strip, tight spacing.
14. Screenshot at 375 / 768 / 1280 → compare → fix → repeat. Minimum 2 rounds.
15. Lighthouse on mobile. Fix below-bar scores.
16. Final pass: hover, focus-visible, active on every interactive element.
17. Validate: one `<h1>`, sequential headings, alt text, JSON-LD, SVG logo in nav, no console errors.
