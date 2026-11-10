<div align="center">

<img src="./public/lantern-banner.jpg" alt="Lantern Banner" width="100%" />

<br /><br />

# Lantern
### Illuminate Your Path, Master Any Skill.
#### The modern, domain-agnostic learning experience platform (LMS / LXP) engineered for deep retention.

A universal, gamified learning platform featuring bite-sized daily challenges, multi-modal lessons (interactive quizzes, embedded video masterclasses, rich markdown study guides), personal cloud notebooks, streak momentum, a native credit-based economy, and a full administrative studio to author curricula in **any field or discipline**.

<br />

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14.1-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js 14" />&nbsp;
  <img src="https://img.shields.io/badge/React-18-087EA4?style=for-the-badge&logo=react&logoColor=white" alt="React 18" />&nbsp;
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />&nbsp;
  <img src="https://img.shields.io/badge/Convex-Realtime_Cloud-FF7A00?style=for-the-badge&logo=convex&logoColor=white" alt="Convex Cloud" />&nbsp;
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />&nbsp;
  <img src="https://img.shields.io/badge/Native_Auth-SHA--256_Salted-10B981?style=for-the-badge&logo=auth0&logoColor=white" alt="Native Auth" />&nbsp;
  <img src="https://img.shields.io/badge/Web_Speech-TTS_Audio-F59E0B?style=for-the-badge&logo=google-chrome&logoColor=white" alt="Web Speech" />&nbsp;
  <img src="https://img.shields.io/badge/Stripe-Optional_Billing-6366F1?style=for-the-badge&logo=stripe&logoColor=white" alt="Stripe" />&nbsp;
  <img src="https://img.shields.io/badge/Radix_UI-Primitives-161618?style=for-the-badge&logo=radix-ui&logoColor=white" alt="Radix UI" />&nbsp;
  <img src="https://img.shields.io/badge/Zustand-State_Store-4338CA?style=for-the-badge&logo=redux&logoColor=white" alt="Zustand" />&nbsp;
  <img src="https://img.shields.io/badge/Lucide-Icons-F43F5E?style=for-the-badge&logo=feather&logoColor=white" alt="Lucide" />
</p>

</div>

---

## Overview

Lantern is a modern, domain-agnostic Learning Experience Platform (LMS / LXP) engineered to make learning in **any discipline** engaging, durable, and self-directed. While it ships with a pre-configured seed catalog of 5 technology and venture tracks to showcase its capabilities out-of-the-box, the underlying architecture is universally designed to host courses on **any topic**—from languages, law, and medical sciences to test prep, arts, and executive training:

- **Unified Command Dashboard (`/dashboard`)**: Instant high-level learner command center displaying real-time streak momentum, knowledge score (XP), focus energy (hearts), and credit balance, alongside an active course progress tracker, "Up Next" lesson launcher, and 1-click course switcher.
- **Multi-Modal Learning Formats**:
  - **Interactive Knowledge Checks**: Bite-sized, gamified multiple-choice challenges with instant evaluation, audio SFX, and numbered keyboard shortcuts (`1`, `2`, `3`).
  - **Deep-Dive Reading Guides**: Rich markdown lessons with syntax-highlighted code blocks, tables, one-click copying, and downloadable external resources.
  - **Video Masterclasses**: Responsive embedded video lectures (YouTube, Vimeo, or direct MP4/WebM) with integrated completion tracking.
- **Universal Curriculum Architecture (Seeded Reference Demo)**:
  - *Full-Stack React 19 & Next.js App Router* (Server Primitives, Streaming SSR, Optimistic UI)
  - *AI & Applied LLM Engineering* (Structured Outputs, RAG, Tool Calling, Vector Search)
  - *Tech Startup Strategy & SaaS Finance* (Unit Economics, CAC Payback, Term Sheets & SAFEs)
  - *Cloud Architecture & High Scalability* (CAP Theorem, Raft Consensus, Resilient Queues)
  - *UI/UX Product Design & Systems* (8pt Grid, Design Tokens, WCAG AA Accessibility)
  - *(Easily create custom courses for any domain via the Admin Studio or API)*
- **Administrative Control Plane (`/admin`)**: Built-in curriculum authoring studio to create, update, and manage custom courses, modules, lessons, and challenge question banks for any field of study.
- **Personal Study Notebook (`/notebook`)**: Cloud-synced learner notebook auto-saving takeaways, notes, and reflections per lesson directly to Convex.
- **Zero-Clerk Native Authentication**: In-database email and password authentication stored in Convex (`users` & `sessions`) with SHA-256 password hashing + 16-byte random salt, zero external auth provider lock-in, and humanized error handling.
- **Gamification & Retention Engine**:
  - Focus energy system (5 hearts) with practice review mode to regenerate energy.
  - Daily streaks, XP milestones, and daily quests (`/quests`).
  - Real-time reactive leaderboard (`/leaderboard`) with track-specific vs global rankings.
  - Built-in credit economy with 100 free welcome credits on signup for Pro upgrades or refills.

---

## Universal Curriculum Architecture & Seed Showcase

Lantern is completely domain-agnostic. Educators, organizations, and platform admins can author, structure, and publish courses on **practically any subject or skill**. To demonstrate the full breadth of the multi-modal lesson engine upon initial installation, Lantern includes 5 comprehensive reference tracks:

<table>
  <tr>
    <td align="center" width="160">
      <img src="./public/track_engineering.svg" width="48" height="48" alt="Full-Stack Engineering" /><br />
      <sub><b>Full-Stack Engineering</b><br/>React 19, Next.js, RSC & Convex</sub>
    </td>
    <td align="center" width="160">
      <img src="./public/track_ai.svg" width="48" height="48" alt="Applied AI" /><br />
      <sub><b>Applied AI Engineering</b><br/>LLMs, RAG, Tool Calling & Zod</sub>
    </td>
    <td align="center" width="160">
      <img src="./public/track_business.svg" width="48" height="48" alt="Startup Strategy" /><br />
      <sub><b>Startup Strategy & SaaS</b><br/>CAC Payback, Cap Tables & SAFEs</sub>
    </td>
    <td align="center" width="160">
      <img src="./public/track_cloud.svg" width="48" height="48" alt="Cloud Architecture" /><br />
      <sub><b>Cloud & Scalability</b><br/>CAP Theorem, Raft & Microservices</sub>
    </td>
    <td align="center" width="160">
      <img src="./public/track_design.svg" width="48" height="48" alt="Product Design" /><br />
      <sub><b>UI/UX Design Systems</b><br/>8pt Grid, Tokens & WCAG AA</sub>
    </td>
  </tr>
</table>

---

## Reactive Cloud Architecture

Lantern features a clean, reactive architecture powered by Next.js 14 App Router and Convex Cloud with live WebSocket subscriptions:

```mermaid
flowchart TD
    %% Styling Classes
    classDef client fill:#f8fafc,stroke:#334155,stroke-width:2px,color:#0f172a;
    classDef authLayer fill:#fff7ed,stroke:#ea580c,stroke-width:2px,color:#9a3412;
    classDef db fill:#ecfdf5,stroke:#059669,stroke-width:2px,color:#065f46;
    classDef lmsCluster fill:#f5f3ff,stroke:#7c3aed,stroke-width:2px,color:#4c1d95;
    classDef extCluster fill:#fef3c7,stroke:#d97706,stroke-width:2px,color:#78350f;

    subgraph Tier1 ["1. Client & Presentation Layer"]
        UI["Lantern Web Application<br/><i>Next.js 14 App Router • React 18 • Tailwind CSS</i>"]
        DashboardView["Unified Learner Dashboard (`/dashboard`)<br/><i>Momentum KPIs • Active Track Showcase • Fast Switcher</i>"]
        LessonRunner["Multi-Modal Lesson Viewer (`/lesson/[id]`)<br/><i>Quiz Challenges • Markdown Reader • Video Masterclasses</i>"]
    end

    subgraph Tier2 ["2. Real-Time State & Native Auth Engine"]
        AuthProvider["AuthProvider & Session Manager<br/><i>LocalStorage Token • 7s Graceful Fallback</i>"]
        Convex_DB[("Convex Realtime Database<br/>• Live WebSocket Subscriptions (Zero Polling)<br/>• End-to-End TypeScript Validation")]
        AuthEngine["Native Cryptographic Engine (`convex/auth.ts`)<br/>• SHA-256 Hashing + 16-Byte Random Salt<br/>• Users & Sessions Tables (Zero Clerk Lock-in)"]
    end

    subgraph Tier3 ["3. Core LMS & Progression Engine"]
        direction TB
        ModulesEngine["Curriculum & Content Engine<br/>• Courses, Modules, Lessons, Challenges<br/>• Universal Course Catalog (Any Discipline)"]
        GamificationEngine["Gamification & Retention Engine<br/>• Hearts Economy (5 Max) & Practice Recovery<br/>• XP Points & Daily Streaks • Reactive Leaderboards"]
        NotebookEngine["Personal Study Notebook Engine (`convex/notes.ts`)<br/>• Real-Time Cloud Notes per Lesson • Markdown Storage"]
        EconomyEngine["Credit & Billing Engine (`convex/credits.ts`)<br/>• 100 Welcome Starter Credits • Refills & Pro Unlock"]
    end

    subgraph Tier4 ["4. Integrations & Audio Subsystems"]
        SpeechTTS["Web Speech API Synthesis<br/><i>Dynamic In-Browser Voice Engine</i>"]
        StripeGateway["Optional Stripe Billing Adapter<br/><i>Pluggable Adapter (`lib/payments/`)</i>"]
    end

    %% Client Interactions
    UI -->|"Session Auth"| AuthProvider
    AuthProvider <-->|"Mutations & Queries"| AuthEngine
    AuthEngine <-->|"Users & Sessions"| Convex_DB

    UI <-->|"Reactive Subscriptions"| Convex_DB
    Convex_DB -.->|"Live State Sync"| DashboardView
    Convex_DB -.->|"Progress & Notes"| LessonRunner

    %% Backend Engine Routing
    Convex_DB <-->|"Syllabus Queries"| ModulesEngine
    Convex_DB <-->|"XP & Hearts Mutations"| GamificationEngine
    Convex_DB <-->|"Saved Notes"| NotebookEngine
    Convex_DB <-->|"Credit Ledger"| EconomyEngine

    %% External Systems
    LessonRunner -.->|"Dynamic Pronunciation"| SpeechTTS
    EconomyEngine -.->|"Optional Checkout"| StripeGateway

    class UI,DashboardView,LessonRunner client;
    class AuthProvider,AuthEngine authLayer;
    class Convex_DB db;
    class ModulesEngine,GamificationEngine,NotebookEngine,EconomyEngine lmsCluster;
    class SpeechTTS,StripeGateway extCluster;
```

<br />

### Architectural Highlights
1. **Zero External Auth Vendor Lock-In**: Complete replacement of third-party auth (Clerk) with an in-database salted SHA-256 cryptographic engine stored inside Convex (`users` and `sessions` tables).
2. **Live WebSocket State Sync**: All course progress, XP tallies, heart decrements, notes, and leaderboards update in real time with zero client polling.
3. **Multi-Modal Content Ingestion**: Supports interactive quiz challenges (`SELECT`, `ASSIST`), rich markdown articles with syntax highlighting, and responsive video players across any created course.
4. **Pluggable Payment Engine**: Runs smoothly on internal credit tokens (100 welcome credits granted on signup) with optional Stripe checkout adapter.

---

## Product Showcase & Platform Walkthrough

A visual walkthrough of the Lantern platform across learner workflows and administrative operations:

<table>
  <tr>
    <td width="50%" valign="top">
      <img src="./public/screenshots/01-landing-hero.jpg" alt="Marketing Portal & 3D Beacon Hero" width="100%" />
      <br /><br />
      <b>01. Landing page (<code>/</code>)</b><br />
      <sub>Dark-mode landing experience featuring radiant Solar Amber beacon artwork, track highlights, platform stats, and one-click onboarding.</sub>
    </td>
    <td width="50%" valign="top">
      <img src="./public/screenshots/02-dashboard-overview.jpg" alt="Learner Command Dashboard" width="100%" />
      <br /><br />
      <b>02. Unified Learner Command Dashboard (<code>/dashboard</code>)</b><br />
      <sub>Central learning command hub displaying active track progress, one-click track switcher cards, streak momentum, XP metrics, and next lesson launcher.</sub>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <img src="./public/screenshots/03-course-catalog.jpg" alt="Course Catalog & Tracks" width="100%" />
      <br /><br />
      <b>03. Multi-Domain Course Catalog (<code>/courses</code>)</b><br />
      <sub>Searchable curriculum library displaying all active courses with level filters and instant enrollment (pre-loaded with 5 reference tracks).</sub>
    </td>
    <td width="50%" valign="top">
      <img src="./public/screenshots/04-curriculum-learning.jpg" alt="Curriculum Syllabus & Roadmap" width="100%" />
      <br /><br />
      <b>04. Curriculum Syllabus & Learning Roadmap (<code>/learn</code>)</b><br />
      <sub>Structured unit progression with multi-modal lesson waypoints, completion counters, right-rail Pro pass access, and milestone quests.</sub>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <img src="./public/screenshots/05-leaderboard.jpg" alt="Community Leaderboard" width="100%" />
      <br /><br />
      <b>05. Reactive Learner Leaderboard (<code>/leaderboard</code>)</b><br />
      <sub>Competitive platform rankings powered by live Convex WebSocket subscriptions, tracking XP milestones, streak leaders, and global learner progress.</sub>
    </td>
    <td width="50%" valign="top">
      <img src="./public/screenshots/06-settings-profile.jpg" alt="Account Settings & Avatar Studio" width="100%" />
      <br /><br />
      <b>06. Account Settings & Avatar Studio (<code>/settings</code>)</b><br />
      <sub>Learner profile customization featuring 9 curated built-in vector avatars, custom photo upload with client-side canvas optimization, and credential security.</sub>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top" colspan="2">
      <img src="./public/screenshots/07-admin-studio.jpg" alt="Admin Management Studio" width="100%" />
      <br /><br />
      <b>07. Admin Management Studio & Control Plane (<code>/admin</code>)</b><br />
      <sub>Unified platform operations hub with high-level KPIs, visual curriculum hierarchy tree builder, interactive quiz question bank, and learner role management.</sub>
    </td>
  </tr>
</table>

---

## Core Product Capabilities Breakdown

### 1. Unified Dashboard (`/dashboard`)
- **4 Metric Cards**: Instant visibility over Daily Streak (🔥), Total XP (⚡), Focus Energy (💖), and Learning Credits (🪙).
- **Active Track Showcase**: Shows current track artwork, title, description, and percentage completion bar.
- **Up Next Action**: Displays the next unfinished lesson title, estimated time, and direct link.
- **Track Switcher**: Easily switch between enrolled courses with 1-click.

### 2. Multi-Modal Lesson Viewer (`/lesson/[lessonId]`)
- **Interactive Quizzes**:
  - Multiple-choice options with shortcut keys (`1`, `2`, `3`).
  - Active selection glow in Lantern Solar Amber (`#F59E0B`).
  - Correct answers highlighted in vibrant emerald; errors highlighted in rose with heart loss.
  - Success chime, error buzzer, and victory confetti celebration upon lesson completion.
- **Architecture Articles**:
  - Rendered with zero-dependency `MarkdownRenderer` supporting H1, H2, H3, lists, bold, blockquotes, and inline code.
  - Formatted code snippets with a 1-click **Copy** button.
  - Downloadable resource links and external documentation references.
- **Video Masterclasses**:
  - Responsive embedded video player supporting YouTube, Vimeo, and direct MP4/WebM files.

### 3. Personal Study Notebook (`/notebook`)
- **Integrated Tab**: Write notes directly while viewing lessons or review all notes in the central `/notebook` hub.
- **Instant Cloud Sync**: Notes save automatically to Convex (`notes` table) with zero risk of lost work.
- **Search & Navigation**: Search notes by keyword and click through directly to the originating lesson.

### 4. Zero-Clerk Native Authentication
- **Secure Storage**: Passwords hashed using standard Web Cryptography (`SHA-256`) with unique 16-byte random hex salts.
- **Session Management**: Cryptographically secure session tokens stored in Convex `sessions` and client `localStorage`.
- **Automatic Onboarding**: New users automatically receive 100 free Lantern welcome credits and enrollment in the introductory course.
- **Humanized Error Handling**: Replaces raw server exception stacks with friendly messages.

---

## Deployment & Setup Guide

### 1. Prerequisites
- **Node.js**: `v18.17.0` or higher (Node 20+ recommended)
- **npm**: `v9.0.0` or higher
- **Convex Account**: Free cloud real-time backend ([convex.dev](https://convex.dev))

---

### 2. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
# Application Host
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Convex Real-Time Cloud Backend
CONVEX_DEPLOYMENT=dev:<your-deployment-name>
NEXT_PUBLIC_CONVEX_URL=https://<your-deployment-name>.convex.cloud

# Optional: Stripe Integration (leave empty to use Credit-based economy)
STRIPE_API_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

---

### 3. Install Dependencies

```bash
npm install
```

---

### 4. Start the Convex Real-Time Backend

In a dedicated terminal, launch the Convex development daemon:

```bash
npm run convex:dev
```

*This will connect to your Convex deployment, generate TypeScript types, and watch `convex/` for changes.*

---

### 5. Seed the Multi-Domain Curriculum

Populate the database with the 5 comprehensive tracks, modules, lessons, and challenges:

```bash
npm run convex:seed
```

---

### 6. Launch the Next.js Development Server

In a second terminal, start Next.js:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

### 7. Production Build Verification

To verify full static generation and type safety across all 23 routes:

```bash
npm run build
```

---

## Project Structure

```
lantern/
├── app/                  # Next.js App Router (Landing, Dashboard, Curriculum, Admin, Lesson Runner)
│   ├── (auth)/           # Native authentication (login & registration)
│   ├── (landing)/        # Marketing portal & hero experience
│   ├── (main)/           # Core learner views (dashboard, courses, learn, leaderboard, settings, shop)
│   ├── admin/            # Unified platform administration studio & curriculum operations
│   └── lesson/           # Multi-modal interactive lesson runner (quizzes, articles, video)
├── components/           # UI primitives, responsive sidebars, headers, and modal dialogs
├── convex/               # Convex real-time cloud backend (schema, auth, gamification, seed data)
├── lib/                  # Helper utilities, avatar presets, and error formatters
├── providers/            # Client providers (AuthProvider, ConvexClientProvider, ModalProvider)
└── public/               # Vector assets, track badges, avatars, audio SFX, and screenshots
```

---



<p align="center">
  <sub>Lantern — Illuminate Your Path, Master Any Skill. A universal, gamified learning platform built for deep retention and self-paced mastery across any discipline.</sub>
</p>
