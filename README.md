# Anushka Mishra — Premium 3D Portfolio

An immersive, high-performance 3D portfolio built with **TanStack Start**, **Three.js (R3F)**, and **Tailwind CSS 4**.

## ✨ Features

- **Immersive 3D Experience**: Powered by React Three Fiber and Custom GLSL shaders.
- **Scroll-Driven Storytelling**: A cinematic flight through different "digital universes" as you scroll.
- **Bento-Style Design**: Clean, modern UI using OKLCH color spaces and glassmorphism.
- **SEO Optimized**: Fully configured meta tags and structured data for search engines.
- **Tech Stack**:
  - **Framework**: TanStack Start (SSR/Hydration ready)
  - **3D Engine**: Three.js + @react-three/fiber + @react-three/drei
  - **Styling**: Tailwind CSS 4.0 (with @tailwindcss/vite)
  - **Routing**: TanStack Router
  - **Animations**: GSAP & CSS Animations

## 🛠 Project Structure

- `src/components/`: Core UI components.
  - `ImmersiveScene.tsx`: The main 3D canvas and camera controller.
  - `three/`: Individual 3D scenes (AICore, Particles, SkillsGalaxy, etc.)
  - `PortfolioPage.tsx`: The main page layout and text content.
- `src/routes/`: TanStack Router file-based routing.
- `src/styles.css`: Tailwind 4 configuration and global design system.
- `public/`: Static assets like photos and models.

## 🚀 Getting Started

### Local Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the dev server:
   ```bash
   npm run dev
   ```

### Deployment

This project is configured for **Cloudflare Pages** via `wrangler.jsonc`.

```bash
npm run build
npx wrangler pages deploy .output/public
```

## 💖 Lovable Integration

This project is "Lovable Ready". It includes the `@lovable.dev/vite-tanstack-config` which handles:
- Component tagging for the Lovable editor.
- Optimized build pipelines.
- Sandbox detection.

To continue development in Lovable:
1. Push this repository to GitHub.
2. Import the repository at [Lovable.dev](https://lovable.dev).

---
© 2026 Anushka Mishra
