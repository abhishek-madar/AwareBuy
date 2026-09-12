# ABuy - AI-Powered Price Tracker

ABuy is a modern, full-stack Next.js application that allows users to paste an Amazon product link to track its price history and instantly receive AI-generated pros and cons to help them buy at the perfect moment.

## Purpose & Learning Objectives

**ABuy** was developed as a hands-on capstone project specifically designed to **recap, reinforce, and integrate core modern full-stack development patterns**. Rather than learning individual concepts in isolation, this project served as an end-to-end sandbox to build a production-grade, practical application from scratch.

### Key Topics Recapped

* **Client-Side Data Extraction & Bot Mitigation:**
  * Bypassing anti-bot protections and CAPTCHAs via client-side DOM parsing (custom browser bookmarklet) rather than fragile server-side scraping APIs.
  * Writing resilient multi-selector fallback logic to handle dynamic, category-specific e-commerce page structures.

* **Relational Database Design & ORM (PostgreSQL & Prisma):**
  * Structuring one-to-many relationships (linking static product metadata to dynamic, chronological price snapshots).
  * Leveraging PostgreSQL array data types to store structured AI summaries directly in product records.
  * Using atomic `upsert` queries to prevent race conditions and duplicate product entries.

* **Full-Stack Next.js (App Router):**
  * Developing custom API route handlers (`/api/save`) to ingest external data payloads safely into the backend.
  * Managing state and dynamic routing for clean, individual product pages (`/product/[id]`).

* **Modern UI/UX & Data Visualization:**
  * Crafting dark-mode glassmorphic layouts using Tailwind CSS (`backdrop-blur`, ambient gradient glows, and translucent overlays).
  * Implementing advanced time-series data visualization using Recharts (step-line charts with statistical aggregation).
  * Handling media edge-cases, including dynamic CSS blend modes (`mix-blend-screen`) and custom SVG empty-state fallbacks.

* **Applied AI Engineering:**
  * Integrating the Vercel AI SDK to extract structured JSON data (Pros & Cons arrays) via Zod schemas.
  * Evaluating model orchestration options: local inference (Ollama) vs. cloud inference (Groq / Hugging Face Inference API).

* **Authentication & Identity Delegation:**
  * Implementing OAuth 2.0 through NextAuth.js / Auth.js with Google Provider.
  * Handling session states, client-side hooks (`useSession`), and role-based UI transitions.

* **Application Security & Environment Hygiene:**
  * Managing runtime secrets via `.env.local` and `.gitignore` to prevent credential exposure in public repositories.
  * Handling API keys and bearer token authorization for external model providers.

## Getting Started

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```

2. Duplicate `.env.example` to `.env.local` and add your secret keys (Database, OAuth, AI API Keys).

3. Run the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
