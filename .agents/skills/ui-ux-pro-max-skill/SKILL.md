---
name: ui-ux-pro-max-skill
description: >-
  Advanced UI/UX Pro Max design intelligence system. Provides 161+ design rules,
  67+ UI styles (Glassmorphism, Neumorphism, Bento Grid, Modern SaaS), 161+ color palettes,
  57+ typography pairings, accessibility rules (WCAG 2.1 AA), and zero-overlap responsive layout standards.
---

# UI/UX Pro Max Skill Instructions

You are equipped with the **UI/UX Pro Max Skill**, an advanced design intelligence engine that enforces world-class aesthetic quality, functional accessibility, responsive fluidity, and pixel-perfect design hierarchy across all web applications.

--------------------------------------------------------------------------------

## 1. Core Principles

1. **Function-Driven Aesthetics**: Beauty serves utility. Every interface element must have a clear visual hierarchy, frictionless interaction model, and instant legibility.
2. **Zero-Overlap Architecture**: Elements must NEVER collide, clip, or overflow awkward bounds. Dynamic heights, container padding, flexible flex/grid gaps, and responsive breakpoints are mandatory.
3. **Color Contrast & Accessibility (WCAG 2.1 AA)**: Text contrast ratio $\ge 4.5:1$ against backgrounds ($3:1$ for large text). Touch targets $\ge 44 \times 44\text{px}$. Focus rings and keyboard accessibility required on all interactive elements.
4. **Fluid Micro-Animations**: Use smooth cubic-bezier transitions (`cubic-bezier(0.16, 1, 0.3, 1)` or Framer Motion spring physics `stiffness: 300, damping: 30`) for tab switches, card entrances, hover lifts, and modal triggers.
5. **Forbidden Cliché Tropes**:
   - ❌ NO unreadable purple text on dark backgrounds.
   - ❌ NO cluttered bento boxes stuffed with irrelevant icons.
   - ❌ NO grid line mesh overlays or noisy particle backgrounds.
   - ❌ NO nested cards inside 3+ levels of inner cards.
   - ❌ NO unformatted raw json outputs or static minimum viable products.

--------------------------------------------------------------------------------

## 2. Design Systems & Styles

### A. Glassmorphic Modern Dark
- **Background**: Deep Slate `#090D16` / `#0B0F17`
- **Panel Surface**: `rgba(21, 28, 44, 0.7)` with `backdrop-filter: blur(12px)`
- **Borders**: `1px solid rgba(255, 255, 255, 0.08)`
- **Hover Glow**: `box-shadow: 0 10px 30px -10px rgba(99, 102, 241, 0.25)`

### B. Clean Minimalist SaaS (Light / Dark Adaptive)
- **Primary**: Slate 900 `#0F172A` / Slate 50 `#F8FAFC`
- **Accent**: Indigo `#6366F1` or Cyan `#06B6D4`
- **Card**: Elevated background with subtle `$1\text{px}$` border `#E2E8F0` / `#1E293B`

--------------------------------------------------------------------------------

## 3. Typography & Hierarchy

- **Primary Font Pairings**:
  - Headings: `Plus Jakarta Sans`, `Inter`, `Outfit`, or `Cal Sans`
  - Body: `Inter` or system sans-serif
  - Monospace / Code / Metrics: `JetBrains Mono` or `Fira Code`
- **Type Scale Rules**:
  - Display / Hero: `3xl` to `4xl` (`font-extrabold`, `tracking-tight`)
  - Section Titles: `xl` to `2xl` (`font-bold`)
  - Subheadings: `sm` to `base` (`font-semibold`)
  - Body Copy: `sm` (`text-slate-300`, `leading-relaxed`)
  - Badges / Meta: `xs` to `[10px]` (`font-bold`, `uppercase`, `tracking-wider`)

--------------------------------------------------------------------------------

## 4. Layout & Responsive Guidelines

- **Container Boundaries**: Always wrap modules in max-width containers (`max-w-7xl`, `max-w-5xl`, etc.) with responsive padding (`px-4 md:px-8 py-6`).
- **Flex & Grid Gaps**: Standardize gaps to `gap-4` or `gap-6`. Avoid tight hardcoded offsets.
- **Card Constraints**: Maintain consistent internal padding (`p-5 md:p-8`) and rounded corners (`rounded-2xl` or `rounded-xl`).

--------------------------------------------------------------------------------

## 5. Component Patterns

- **Buttons**:
  - Primary: Gradient accent fill (`from-indigo-600 to-cyan-500`), smooth hover scale (`whileHover={{ scale: 1.02 }}`), shadow elevation (`shadow-lg shadow-indigo-500/20`).
  - Secondary: Glass panel background (`bg-slate-800/80 border border-slate-700 hover:bg-slate-700`).
- **Status Badges**:
  - Success / Match: `bg-emerald-500/10 text-emerald-300 border border-emerald-500/30`
  - Warning / Gap: `bg-amber-500/10 text-amber-300 border border-amber-500/30`
  - Error / Alert: `bg-rose-500/10 text-rose-300 border border-rose-500/30`
- **Progress Gauges & Rings**:
  - SVG animated circular arcs (`strokeDashoffset` transition).
  - Ambient radial background glow (`blur-2xl opacity-20`).

--------------------------------------------------------------------------------

## 6. Execution Workflow

When fulfilling any user design or UI implementation request:
1. **Analyze Purpose & Target Role**: Choose appropriate visual style and color system.
2. **Build Glassmorphic Foundations**: Establish background token, panel surfaces, border colors, and fonts.
3. **Assemble Component Tree**: Ensure clean modular layout with Framer Motion animations.
4. **Audit Overlaps & Responsiveness**: Test at mobile (`375px`), tablet (`768px`), and desktop (`1440px`) boundaries.
