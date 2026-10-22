# Ember & Olive — Seasonal Mediterranean Restaurant

A contemporary neighborhood restaurant website specializing in seasonal Mediterranean cuisine. Built with a warm, atmospheric design that evokes the feeling of entering a real restaurant.

![Ember & Olive](https://image.qwenlm.ai/generated-images/582e5d35-c946-4ad6-b897-85aa0ef1dc23/_result.png)

## 🍽️ Overview

**Ember & Olive** is a boutique restaurant website designed to feel intimate, food-focused, and editorial — not like a generic template. The design uses deep olive green, cream, and terracotta tones with elegant serif headings, subtle textures, and large food photography.

## ✨ Features

### Sections
- **Hero** — Dramatic full-screen introduction with parallax scrolling, opening hours, and reservation CTA
- **Menu** — Editorial-style menu with animated category switching (Starters, Mains, Desserts, Drinks), prices, and dietary indicators (Vegetarian, Gluten Free)
- **Chef's Story** — Narrative section about the chef with seasonal ingredient highlights
- **Gallery** — Swipeable photo-led dining atmosphere gallery with thumbnails and navigation
- **Visit** — Location, contact details, opening hours, and directions
- **Reservations** — Full booking form with date, time, guest count, contact details, validation, and demo confirmation state

### Interactions & Motion
- Smooth scroll-triggered reveals with staggered content
- Parallax hero background
- Animated navigation with mobile menu overlay
- Menu category tab switching with animated transitions
- Swipeable gallery with touch gesture support
- Form validation with real-time error feedback
- Animated reservation confirmation state
- Button press feedback and hover states

### Accessibility & Mobile
- Mobile-first responsive design (320px → desktop)
- `prefers-reduced-motion` support
- Keyboard navigation with visible focus indicators
- Semantic HTML with ARIA labels
- Touch targets ≥ 44×44 CSS pixels
- No horizontal overflow at any viewport

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **React 18** | UI framework |
| **TypeScript** | Type safety |
| **Vite** | Build tool & dev server |
| **Tailwind CSS v4** | Utility-first styling with custom design tokens |
| **Framer Motion** | Animations & transitions |
| **Lucide React** | Icon library |
| **Google Fonts** | Playfair Display (serif) + Inter (sans) |

## 🎨 Design Tokens

The color palette is defined as CSS custom properties via Tailwind's `@theme` directive:

- **Olive** — `#1a2e1a` → `#f5f9f5` (primary brand color)
- **Cream** — `#FFFDF8` → `#C9B99A` (backgrounds & surfaces)
- **Terracotta** — `#FEF5F0` → `#5C2512` (accents & CTAs)
- **Charcoal** — `#F5F5F5` → `#0F0F0F` (text & dark sections)
- **Typography** — Playfair Display (headings) + Inter (body)

## 📦 Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Type check
npm run typecheck
```

The dev server runs at `http://localhost:3000`.

## 📁 Project Structure

```
├── index.html              # HTML entry point with meta tags & fonts
├── src/
│   ├── main.tsx            # React entry point
│   ├── App.tsx             # Main application (all sections & components)
│   └── index.css           # Tailwind config, design tokens, global styles
├── package.json
├── tsconfig.json
└── vite.config.js
```

## 🖼️ Image Assets

Images are AI-generated and served from CDN URLs:

| Image | Description |
|---|---|
| Hero | Overhead shot of grilled octopus with Mediterranean garnishes |
| Interior | Restaurant interior with warm candlelight and olive branches |
| Chef | Chef's hands arranging fresh herbs on a dish |
| Table | Mediterranean table setting with multiple small plates |

## ⚠️ Demo Notice

The reservation form is a **demo only**. No actual booking is submitted to any backend. The form validates input and shows a confirmation state, but explicitly labels itself as a demo to avoid misleading users.

## 📱 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile Safari (iOS 14+)
- Chrome for Android

## 📄 License

This project is for demonstration purposes only.
