import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const seed = mutation({
  args: {
    force: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    // If force is not true, check if courses already exist
    const existing = await ctx.db.query("courses").first();
    if (existing && !args.force) {
      return { message: "Database already has courses seeded. Pass force: true to reseed." };
    }

    // Clean up existing catalog data if force reseeding
    if (existing && args.force) {
      const allCourses = await ctx.db.query("courses").collect();
      for (const c of allCourses) await ctx.db.delete(c._id);

      const allModules = await ctx.db.query("modules").collect();
      for (const m of allModules) await ctx.db.delete(m._id);

      const allLessons = await ctx.db.query("lessons").collect();
      for (const l of allLessons) await ctx.db.delete(l._id);

      const allChallenges = await ctx.db.query("challenges").collect();
      for (const ch of allChallenges) await ctx.db.delete(ch._id);

      const allOptions = await ctx.db.query("challengeOptions").collect();
      for (const o of allOptions) await ctx.db.delete(o._id);
    }

    // ====================================================================
    // 1. TRACK 1: Full-Stack React 19 & Next.js App Router (Engineering)
    // ====================================================================
    const courseEngId = await ctx.db.insert("courses", {
      title: "Full-Stack React 19 & Next.js",
      description: "Master modern full-stack web applications with React 19 Server Components, App Router streaming, and Convex real-time reactive sync.",
      imageSrc: "/track_engineering.svg",
      category: "engineering",
      level: "intermediate",
      isPublished: true,
      order: 1,
      tags: ["React 19", "Next.js 14", "Convex", "TypeScript", "Tailwind CSS"],
    });

    const engMod1Id = await ctx.db.insert("modules", {
      courseId: courseEngId,
      title: "Unit 1: Reactive Web Architecture & Server Primitives",
      description: "Master React Server Components, transactional mutations, and live WebSocket subscriptions.",
      order: 1,
    });

    const engMod2Id = await ctx.db.insert("modules", {
      courseId: courseEngId,
      title: "Unit 2: Edge Streaming, Suspense & Performance",
      description: "Optimize high-concurrency web apps with progressive streaming SSR and optimistic rollbacks.",
      order: 2,
    });

    // Lesson 1.1: Quiz
    const engL1Id = await ctx.db.insert("lessons", {
      moduleId: engMod1Id,
      title: "React 19 Server Components & Actions Quiz",
      order: 1,
      type: "quiz",
      estimatedMinutes: 5,
    });

    const engCh1Id = await ctx.db.insert("challenges", {
      lessonId: engL1Id,
      type: "SELECT",
      question: "Which Convex React hook subscribes to real-time database updates over WebSockets?",
      order: 1,
    });
    await ctx.db.insert("challengeOptions", {
      challengeId: engCh1Id,
      text: "useQuery(api.data.get)",
      correct: true,
    });
    await ctx.db.insert("challengeOptions", {
      challengeId: engCh1Id,
      text: "useEffect(() => fetch('/api'))",
      correct: false,
    });
    await ctx.db.insert("challengeOptions", {
      challengeId: engCh1Id,
      text: "usePollingInterval(1000)",
      correct: false,
    });

    const engCh2Id = await ctx.db.insert("challenges", {
      lessonId: engL1Id,
      type: "ASSIST",
      question: "What is the primary architectural benefit of React Server Components (RSC)?",
      order: 2,
    });
    await ctx.db.insert("challengeOptions", {
      challengeId: engCh2Id,
      text: "Zero client-side JS bundle cost for non-interactive server rendering",
      correct: true,
    });
    await ctx.db.insert("challengeOptions", {
      challengeId: engCh2Id,
      text: "They replace CSS stylesheets entirely with compiler tokens",
      correct: false,
    });
    await ctx.db.insert("challengeOptions", {
      challengeId: engCh2Id,
      text: "They run exclusively inside browser web workers on mobile",
      correct: false,
    });

    const engCh3Id = await ctx.db.insert("challenges", {
      lessonId: engL1Id,
      type: "SELECT",
      question: "Where should sensitive auth keys, database credentials, and API secrets be stored?",
      order: 3,
    });
    await ctx.db.insert("challengeOptions", {
      challengeId: engCh3Id,
      text: "Strictly in server environment variables (e.g. CONVEX_DEPLOYMENT, API secrets)",
      correct: true,
    });
    await ctx.db.insert("challengeOptions", {
      challengeId: engCh3Id,
      text: "In public client-side localStorage",
      correct: false,
    });
    await ctx.db.insert("challengeOptions", {
      challengeId: engCh3Id,
      text: "Hardcoded directly into git-tracked client components",
      correct: false,
    });

    // Lesson 1.2: Architecture Article
    await ctx.db.insert("lessons", {
      moduleId: engMod1Id,
      title: "Deep Dive: Architecting Real-Time Backends with Convex & Next.js",
      order: 2,
      type: "article",
      estimatedMinutes: 8,
      content: {
        markdown: `# Architecting Reactive Applications with Next.js & Convex

Traditional client-server web apps rely on request-response patterns (REST or GraphQL) that force the frontend to constantly poll or invalidate cache tags to show fresh data.

## Why Convex Changes the Game
1. **Automatic Subscriptions**: Query functions are live by default. When the underlying database records change, Convex pushes updates directly to connected components via WebSocket.
2. **End-to-End Type Safety**: Schema validators compile to TypeScript types, preventing runtime mismatch between backend queries and UI components.
3. **Zero ORM Configuration**: Forget migrations and connection pooling bottlenecks—Convex scales natively without managing Postgres pools.

\`\`\`tsx
// Modern Convex query hook in React 19
const userProgress = useQuery(api.userProgress.getUserProgress);
const courses = useQuery(api.courses.getCourses, {});
\`\`\`

## Key Takeaways
- Mutations in Convex run transactionally with serializable isolation.
- Use internal actions for outbound HTTP requests and heavy LLM inference to keep database mutations sub-millisecond.`,
        resources: [
          {
            title: "Convex + Next.js App Router Quickstart",
            url: "https://docs.convex.dev/quickstart/nextjs",
            type: "doc",
          },
          {
            title: "Official Next.js Production Starter Kit",
            url: "https://github.com/vercel/next.js",
            type: "code",
          },
          {
            title: "React 19 RSC Architecture Specification",
            url: "https://react.dev/reference/rsc/server-components",
            type: "pdf",
          },
        ],
      },
    });

    // Lesson 1.3: Video Masterclass
    await ctx.db.insert("lessons", {
      moduleId: engMod1Id,
      title: "Video Masterclass: Real-Time State & Optimistic UI Updates",
      order: 3,
      type: "video",
      estimatedMinutes: 12,
      content: {
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        markdown: `### Session Highlights & Architecture Checklist:
- Structuring your Next.js App Router folders with Convex Client Providers.
- Protecting routes and syncing identities with secure SHA-256 session tokens.
- Implementing instant optimistic updates on the client before backend commits.
- Best practices for reducing cumulative layout shifts (CLS) during streaming hydration.`,
        resources: [
          {
            title: "Optimistic State Management Patterns",
            url: "https://docs.convex.dev/client/react/optimistic-updates",
            type: "doc",
          },
          {
            title: "Live Interactive Demo Sandbox",
            url: "https://stackblitz.com",
            type: "code",
          },
        ],
      },
    });

    // Module 2 Lessons for Track 1
    await ctx.db.insert("lessons", {
      moduleId: engMod2Id,
      title: "Architecture Guide: Streaming SSR & Suspense Boundaries",
      order: 1,
      type: "article",
      estimatedMinutes: 7,
      content: {
        markdown: `# Streaming SSR & Suspense Boundaries in Production

Next.js App Router allows progressive streaming of HTML from the edge directly to the browser.

## The Mental Model
Instead of waiting for all database queries and external APIs to resolve before serving HTML, the server renders the structural skeleton instantly and streams content chunks as they become ready.

\`\`\`tsx
<Suspense fallback={<CourseGridSkeleton />}>
  <AsyncCourseCatalog />
</Suspense>
\`\`\`

### Production Rules of Thumb
- Place Suspense boundaries close to the dynamic data leaf nodes to avoid layout jumps.
- Avoid cascading fetches by parallelizing backend queries.`,
        resources: [
          {
            title: "Next.js Streaming Architecture Guide",
            url: "https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming",
            type: "doc",
          },
        ],
      },
    });

    const engMod2L2 = await ctx.db.insert("lessons", {
      moduleId: engMod2Id,
      title: "Next.js Edge Performance & Suspense Quiz",
      order: 2,
      type: "quiz",
      estimatedMinutes: 5,
    });

    const engCh4 = await ctx.db.insert("challenges", {
      lessonId: engMod2L2,
      type: "SELECT",
      question: "Which component pattern allows rendering critical UI first while deferred data streams in?",
      order: 1,
    });
    await ctx.db.insert("challengeOptions", {
      challengeId: engCh4,
      text: "<Suspense fallback={<Skeleton />} />",
      correct: true,
      imageSrc: "/track_engineering.svg",
    });
    await ctx.db.insert("challengeOptions", {
      challengeId: engCh4,
      text: "window.requestAnimationFrame()",
      correct: false,
    });
    await ctx.db.insert("challengeOptions", {
      challengeId: engCh4,
      text: "Synchronous blocking XMLHttpRequests",
      correct: false,
    });

    const engCh5 = await ctx.db.insert("challenges", {
      lessonId: engMod2L2,
      type: "ASSIST",
      question: "What happens when an unhandled error is thrown inside an App Router Server Component?",
      order: 2,
    });
    await ctx.db.insert("challengeOptions", {
      challengeId: engCh5,
      text: "It gets caught by the nearest error.tsx error boundary gracefully",
      correct: true,
    });
    await ctx.db.insert("challengeOptions", {
      challengeId: engCh5,
      text: "The entire server process crashes and terminates permanently",
      correct: false,
    });
    await ctx.db.insert("challengeOptions", {
      challengeId: engCh5,
      text: "The browser window immediately closes",
      correct: false,
    });


    // ====================================================================
    // 2. TRACK 2: AI Engineering & Applied LLM Systems (AI)
    // ====================================================================
    const courseAiId = await ctx.db.insert("courses", {
      title: "AI & Applied LLM Engineering",
      description: "From prompt engineering and token dynamics to structured JSON outputs, function calling, and production RAG pipelines.",
      imageSrc: "/track_ai.svg",
      category: "ai",
      level: "beginner",
      isPublished: true,
      order: 2,
      tags: ["AI", "Prompting", "LLMs", "RAG", "Function Calling", "Embeddings"],
    });

    const aiMod1Id = await ctx.db.insert("modules", {
      courseId: courseAiId,
      title: "Unit 1: LLM Foundations & Prompt Optimization",
      description: "Understand tokens, temperature, system instructions, and deterministic outputs.",
      order: 1,
    });

    const aiMod2Id = await ctx.db.insert("modules", {
      courseId: courseAiId,
      title: "Unit 2: RAG, Embeddings & Vector Search",
      description: "Architect semantic retrieval pipelines, chunking strategies, and hybrid vector search.",
      order: 2,
    });

    // Lesson 2.1: Quiz
    const aiL1Id = await ctx.db.insert("lessons", {
      moduleId: aiMod1Id,
      title: "Prompt Engineering Essentials Quiz",
      order: 1,
      type: "quiz",
      estimatedMinutes: 5,
    });

    const aiCh1Id = await ctx.db.insert("challenges", {
      lessonId: aiL1Id,
      type: "SELECT",
      question: "What parameter controls randomness and creativity in LLM completions?",
      order: 1,
    });
    await ctx.db.insert("challengeOptions", {
      challengeId: aiCh1Id,
      text: "Temperature (0.0 for deterministic, 1.0+ for creative)",
      correct: true,
    });
    await ctx.db.insert("challengeOptions", {
      challengeId: aiCh1Id,
      text: "Max Tokens",
      correct: false,
    });
    await ctx.db.insert("challengeOptions", {
      challengeId: aiCh1Id,
      text: "Batch Size",
      correct: false,
    });

    const aiCh2Id = await ctx.db.insert("challenges", {
      lessonId: aiL1Id,
      type: "ASSIST",
      question: "What does RAG stand for in modern AI application architecture?",
      order: 2,
    });
    await ctx.db.insert("challengeOptions", {
      challengeId: aiCh2Id,
      text: "Retrieval-Augmented Generation",
      correct: true,
    });
    await ctx.db.insert("challengeOptions", {
      challengeId: aiCh2Id,
      text: "Random Automated Gradient",
      correct: false,
    });
    await ctx.db.insert("challengeOptions", {
      challengeId: aiCh2Id,
      text: "Recursive Agent Graph",
      correct: false,
    });

    const aiCh3Id = await ctx.db.insert("challenges", {
      lessonId: aiL1Id,
      type: "SELECT",
      question: "Which technique guarantees structured JSON output matching a strict schema from an LLM?",
      order: 3,
    });
    await ctx.db.insert("challengeOptions", {
      challengeId: aiCh3Id,
      text: "Constrained decoding with JSON schema or Zod enforcement",
      correct: true,
    });
    await ctx.db.insert("challengeOptions", {
      challengeId: aiCh3Id,
      text: "Asking politely in the user prompt",
      correct: false,
    });
    await ctx.db.insert("challengeOptions", {
      challengeId: aiCh3Id,
      text: "Increasing the model temperature to 2.0",
      correct: false,
    });

    // Lesson 2.2: Article
    await ctx.db.insert("lessons", {
      moduleId: aiMod1Id,
      title: "Production Guide: Structured JSON Outputs & Tool Calling",
      order: 2,
      type: "article",
      estimatedMinutes: 8,
      content: {
        markdown: `# Mastering Structured Outputs with LLMs

Modern AI development has evolved beyond freeform chat completions. Production applications require strictly typed, deterministic responses.

## Key Techniques
1. **JSON Schema Enforcement**: Specify exact Pydantic or Zod schemas to guarantee valid JSON formatting from the model.
2. **Few-Shot Examples**: Give 2–3 paired examples of input and ideal structured output to establish format consistency.
3. **Chain-of-Thought (CoT)**: Instruct the model to reason in an internal scratchpad before generating the final JSON payload.

## Tool Calling (Function Calling)
Tool calling allows an LLM to invoke external tools (calculators, SQL queries, web scrapers) and reason across the responses:

\`\`\`json
{
  "name": "lookup_user_credits",
  "description": "Returns current credit balance for a user",
  "parameters": {
    "type": "object",
    "properties": {
      "userId": { "type": "string" }
    },
    "required": ["userId"]
  }
}
\`\`\``,
        resources: [
          {
            title: "OpenAI Structured Outputs Specification",
            url: "https://platform.openai.com/docs/guides/structured-outputs",
            type: "doc",
          },
          {
            title: "Anthropic Tool Use & Agent Cookbook",
            url: "https://github.com/anthropics/anthropic-cookbook",
            type: "code",
          },
          {
            title: "LLM Hallucination Mitigation Cheatsheet",
            url: "https://deeplearning.ai",
            type: "pdf",
          },
        ],
      },
    });

    // Lesson 2.3: Video Masterclass
    await ctx.db.insert("lessons", {
      moduleId: aiMod1Id,
      title: "Video Masterclass: Building Autonomous AI Agents with Tool Calling",
      order: 3,
      type: "video",
      estimatedMinutes: 14,
      content: {
        videoUrl: "https://www.youtube.com/watch?v=sal78ACtGTc",
        markdown: `### What You Will Learn in this Masterclass:
- The ReAct (Reasoning + Acting) execution loop in depth.
- Managing memory across multi-turn tool calling sessions.
- Handling rate limits, fallbacks, and token budgeting in production.
- Guardrails to prevent prompt injections and infinite recursion loops.`,
        resources: [
          {
            title: "LangChain & Vercel AI SDK Architecture Guide",
            url: "https://sdk.vercel.ai/docs",
            type: "doc",
          },
        ],
      },
    });

    // Module 2 for AI
    await ctx.db.insert("lessons", {
      moduleId: aiMod2Id,
      title: "Vector Embeddings & Semantic Search Guide",
      order: 1,
      type: "article",
      estimatedMinutes: 7,
      content: {
        markdown: `# Vector Embeddings, Cosine Similarity & Chunking

Vector embeddings map high-dimensional semantic relationships into numerical arrays.

## Chunking Best Practices
- **Chunk Size**: 256 to 512 tokens is typically the sweet spot for retrieval accuracy.
- **Overlap**: 10-20% chunk overlap prevents contextual fragmentation at split boundaries.
- **Hybrid Search**: Combine dense vector embeddings with sparse BM25 keyword search to get the best of both worlds.`,
        resources: [
          {
            title: "Vector Database Benchmarking Whitepaper",
            url: "https://qdrant.tech/benchmarks",
            type: "pdf",
          },
        ],
      },
    });

    const aiMod2L2 = await ctx.db.insert("lessons", {
      moduleId: aiMod2Id,
      title: "Vector Search & Retrieval Mechanics Quiz",
      order: 2,
      type: "quiz",
      estimatedMinutes: 5,
    });

    const aiCh4 = await ctx.db.insert("challenges", {
      lessonId: aiMod2L2,
      type: "SELECT",
      question: "Which metric is most commonly used to measure semantic similarity between normalized embedding vectors?",
      order: 1,
    });
    await ctx.db.insert("challengeOptions", {
      challengeId: aiCh4,
      text: "Cosine Similarity",
      correct: true,
      imageSrc: "/track_ai.svg",
    });
    await ctx.db.insert("challengeOptions", {
      challengeId: aiCh4,
      text: "Euclidean Manhattan Taxicab distance",
      correct: false,
    });
    await ctx.db.insert("challengeOptions", {
      challengeId: aiCh4,
      text: "Hamming bitwise distance",
      correct: false,
    });


    // ====================================================================
    // 3. TRACK 3: Tech Startup Strategy & SaaS Finance (Business)
    // ====================================================================
    const courseBizId = await ctx.db.insert("courses", {
      title: "Tech Startup Strategy & SaaS Finance",
      description: "Master SaaS unit economics, runway, cap tables, YC SAFEs, product-market fit metrics, and enterprise pricing models.",
      imageSrc: "/track_business.svg",
      category: "business",
      level: "intermediate",
      isPublished: true,
      order: 3,
      tags: ["Startups", "SaaS", "Unit Economics", "Venture Capital", "Pricing", "Runway"],
    });

    const bizMod1Id = await ctx.db.insert("modules", {
      courseId: courseBizId,
      title: "Unit 1: SaaS Metrics, Unit Economics & Runway",
      description: "Deconstruct CAC, LTV, Net Dollar Retention, and cash runway calculations.",
      order: 1,
    });

    const bizMod2Id = await ctx.db.insert("modules", {
      courseId: courseBizId,
      title: "Unit 2: Go-To-Market & Product-Led Growth (PLG)",
      description: "Optimize user activation, self-serve funnels, and enterprise sales motions.",
      order: 2,
    });

    // Lesson 3.1: Quiz
    const bizL1Id = await ctx.db.insert("lessons", {
      moduleId: bizMod1Id,
      title: "SaaS Financial Health & Growth Metrics Quiz",
      order: 1,
      type: "quiz",
      estimatedMinutes: 5,
    });

    const bizCh1Id = await ctx.db.insert("challenges", {
      lessonId: bizL1Id,
      type: "SELECT",
      question: "What is Customer Acquisition Cost (CAC) Payback Period?",
      order: 1,
    });
    await ctx.db.insert("challengeOptions", {
      challengeId: bizCh1Id,
      text: "The number of months of gross margin required to recover the cost of acquiring a customer",
      correct: true,
    });
    await ctx.db.insert("challengeOptions", {
      challengeId: bizCh1Id,
      text: "The total revenue earned across a customer's entire lifetime",
      correct: false,
    });
    await ctx.db.insert("challengeOptions", {
      challengeId: bizCh1Id,
      text: "The annual customer churn rate percentage",
      correct: false,
    });

    const bizCh2Id = await ctx.db.insert("challenges", {
      lessonId: bizL1Id,
      type: "ASSIST",
      question: "What is considered a world-class Net Dollar Retention (NDR) rate for enterprise B2B SaaS?",
      order: 2,
    });
    await ctx.db.insert("challengeOptions", {
      challengeId: bizCh2Id,
      text: ">120% (expansion revenue significantly exceeds customer churn and contraction)",
      correct: true,
    });
    await ctx.db.insert("challengeOptions", {
      challengeId: bizCh2Id,
      text: "<50% annual retention",
      correct: false,
    });
    await ctx.db.insert("challengeOptions", {
      challengeId: bizCh2Id,
      text: "Exactly 0% net expansion",
      correct: false,
    });

    const bizCh3Id = await ctx.db.insert("challenges", {
      lessonId: bizL1Id,
      type: "SELECT",
      question: "How is Startup Runway mathematically calculated?",
      order: 3,
    });
    await ctx.db.insert("challengeOptions", {
      challengeId: bizCh3Id,
      text: "Total available cash reserves divided by monthly net burn rate",
      correct: true,
    });
    await ctx.db.insert("challengeOptions", {
      challengeId: bizCh3Id,
      text: "Total registered users multiplied by seed valuation",
      correct: false,
    });
    await ctx.db.insert("challengeOptions", {
      challengeId: bizCh3Id,
      text: "Annual gross GMV divided by engineering headcount",
      correct: false,
    });

    // Lesson 3.2: Article
    await ctx.db.insert("lessons", {
      moduleId: bizMod1Id,
      title: "The Founder's Playbook: Term Sheets, Cap Tables & SAFEs",
      order: 2,
      type: "article",
      estimatedMinutes: 9,
      content: {
        markdown: `# The Founder's Guide to Venture Deals & SAFEs

Raising early-stage capital requires a rock-solid grasp of dilution, valuation caps, and instrument mechanics.

## Post-Money SAFEs (Y Combinator Standard)
A Post-Money Simple Agreement for Future Equity (SAFE) converts into preferred stock during a priced equity round (e.g. Series A).

$$\\text{Investor Ownership} = \\frac{\\text{Investment Amount}}{\\text{Post-Money Valuation Cap}}$$

### Key Terms to Understand
- **Valuation Cap**: The maximum effective company valuation at which the SAFE converts into equity.
- **Discount Rate**: Typically 20% discount if the priced round valuation is below the cap.
- **Pro-Rata Rights**: The right of an early investor to participate in future rounds to prevent ownership dilution.`,
        resources: [
          {
            title: "Y Combinator Standard SAFE Financing Documents",
            url: "https://www.ycombinator.com/documents",
            type: "doc",
          },
          {
            title: "a16z SaaS Metrics 2.0 Benchmarks",
            url: "https://a16z.com/saas-metrics-2-0/",
            type: "doc",
          },
          {
            title: "Cap Table Dilution Financial Model Spreadsheet",
            url: "https://www.angelcapitalassociation.org",
            type: "pdf",
          },
        ],
      },
    });

    // Lesson 3.3: Video Masterclass
    await ctx.db.insert("lessons", {
      moduleId: bizMod1Id,
      title: "Video Masterclass: Modern Software & API Pricing Strategies",
      order: 3,
      type: "video",
      estimatedMinutes: 11,
      content: {
        videoUrl: "https://www.youtube.com/watch?v=1tVb5hR_k8A",
        markdown: `### Core Strategies from this Session:
- Why per-seat pricing is dying in the AI era and usage/credit-based models are winning.
- Determining your core 'Value Metric' (API calls, active contacts, compute minutes).
- Packaging tiered plans: Starter, Growth, and Custom Enterprise.
- Implementing reverse trials to drive self-serve conversions.`,
        resources: [
          {
            title: "SaaS Pricing Model Calculation Template",
            url: "https://openviewpartners.com/blog/saas-pricing-strategy/",
            type: "doc",
          },
        ],
      },
    });

    // Module 2 for Business
    await ctx.db.insert("lessons", {
      moduleId: bizMod2Id,
      title: "Product-Led Growth & High-Converting Onboarding",
      order: 1,
      type: "article",
      estimatedMinutes: 6,
      content: {
        markdown: `# Designing High-Converting Self-Serve Product Onboarding

In Product-Led Growth (PLG), the software experience is the primary salesperson.

## Time to Value (TTV)
The #1 cause of user dropoff is delayed gratification. Shorten the number of clicks between signup and the core 'Aha!' moment.

### Principles:
- Don't require credit cards upfront for initial exploration.
- Use progressive profiling instead of massive 10-field registration forms.
- Pre-populate demo environments with realistic mock data.`,
        resources: [
          {
            title: "Product-Led Growth Playbook",
            url: "https://productled.com",
            type: "doc",
          },
        ],
      },
    });

    const bizMod2L2 = await ctx.db.insert("lessons", {
      moduleId: bizMod2Id,
      title: "Product-Led Growth & Activation Funnels Quiz",
      order: 2,
      type: "quiz",
      estimatedMinutes: 5,
    });

    const bizCh4 = await ctx.db.insert("challenges", {
      lessonId: bizMod2L2,
      type: "SELECT",
      question: "What is the primary objective of Product-Led Growth (PLG)?",
      order: 1,
    });
    await ctx.db.insert("challengeOptions", {
      challengeId: bizCh4,
      text: "Using the software product itself as the primary engine for user acquisition, retention, and expansion",
      correct: true,
      imageSrc: "/track_business.svg",
    });
    await ctx.db.insert("challengeOptions", {
      challengeId: bizCh4,
      text: "Hiring 500 cold callers to dial enterprise leads manually",
      correct: false,
    });
    await ctx.db.insert("challengeOptions", {
      challengeId: bizCh4,
      text: "Spending 100% of revenue on highway billboard ads",
      correct: false,
    });


    // ====================================================================
    // 4. TRACK 4: Cloud Architecture & High Scalability (Cloud)
    // ====================================================================
    const courseCloudId = await ctx.db.insert("courses", {
      title: "Cloud Architecture & High Scalability",
      description: "Architect globally distributed systems, CAP theorem trade-offs, resilient message queues, idempotent APIs, and sharded databases.",
      imageSrc: "/track_cloud.svg",
      category: "cloud",
      level: "advanced",
      isPublished: true,
      order: 4,
      tags: ["Cloud", "Distributed Systems", "Kafka", "Idempotency", "CAP Theorem", "Microservices"],
    });

    const cloudMod1Id = await ctx.db.insert("modules", {
      courseId: courseCloudId,
      title: "Unit 1: Distributed Consensus & Fault-Tolerant Systems",
      description: "Master CAP theorem, consensus protocols, and idempotent event architectures.",
      order: 1,
    });

    const cloudMod2Id = await ctx.db.insert("modules", {
      courseId: courseCloudId,
      title: "Unit 2: Zero-Downtime Database Scalability & Sharding",
      description: "Horizontal partitioning, read replicas, connection pooling, and cross-shard queries.",
      order: 2,
    });

    // Lesson 4.1: Quiz
    const cloudL1Id = await ctx.db.insert("lessons", {
      moduleId: cloudMod1Id,
      title: "CAP Theorem & Consistency Models Quiz",
      order: 1,
      type: "quiz",
      estimatedMinutes: 5,
    });

    const cloudCh1Id = await ctx.db.insert("challenges", {
      lessonId: cloudL1Id,
      type: "SELECT",
      question: "According to the CAP Theorem, when a network partition (P) occurs, what must a distributed system trade off?",
      order: 1,
    });
    await ctx.db.insert("challengeOptions", {
      challengeId: cloudCh1Id,
      text: "Choose between Consistency (C) and Availability (A)",
      correct: true,
    });
    await ctx.db.insert("challengeOptions", {
      challengeId: cloudCh1Id,
      text: "Choose between CPU clock speed and RAM memory",
      correct: false,
    });
    await ctx.db.insert("challengeOptions", {
      challengeId: cloudCh1Id,
      text: "Drop all incoming TLS connections permanently",
      correct: false,
    });

    const cloudCh2Id = await ctx.db.insert("challenges", {
      lessonId: cloudL1Id,
      type: "ASSIST",
      question: "What makes an API endpoint idempotent?",
      order: 2,
    });
    await ctx.db.insert("challengeOptions", {
      challengeId: cloudCh2Id,
      text: "Making multiple identical requests produces the exact same side-effects as making a single request",
      correct: true,
    });
    await ctx.db.insert("challengeOptions", {
      challengeId: cloudCh2Id,
      text: "It responds in strictly under 5 milliseconds",
      correct: false,
    });
    await ctx.db.insert("challengeOptions", {
      challengeId: cloudCh2Id,
      text: "It requires no authentication headers or bearer tokens",
      correct: false,
    });

    const cloudCh3Id = await ctx.db.insert("challenges", {
      lessonId: cloudL1Id,
      type: "SELECT",
      question: "Which protocol is the industry standard for distributed leader election and state machine replication?",
      order: 3,
    });
    await ctx.db.insert("challengeOptions", {
      challengeId: cloudCh3Id,
      text: "Raft / Paxos consensus",
      correct: true,
    });
    await ctx.db.insert("challengeOptions", {
      challengeId: cloudCh3Id,
      text: "FTP file transfer protocol",
      correct: false,
    });
    await ctx.db.insert("challengeOptions", {
      challengeId: cloudCh3Id,
      text: "Simple Mail Transfer Protocol (SMTP)",
      correct: false,
    });

    // Lesson 4.2: Article
    await ctx.db.insert("lessons", {
      moduleId: cloudMod1Id,
      title: "Architecting Resilient Message Queues & Event-Driven Pipelines",
      order: 2,
      type: "article",
      estimatedMinutes: 9,
      content: {
        markdown: `# Architecting Event-Driven Distributed Pipelines

In high-throughput microservice ecosystems, direct synchronous HTTP calls between services cause cascading failures and tight coupling.

## Event Streams vs Task Queues
- **Task Queues (SQS, RabbitMQ)**: Point-to-point task dispatch. Messages are deleted once acknowledged by a worker.
- **Event Log Streams (Kafka, Kinesis)**: Append-only distributed immutable commit log. Consumers maintain their own read offsets.

## Handling Failures Gracefully
1. **Dead Letter Queues (DLQ)**: Route messages that fail processing after $N$ retry attempts into a DLQ for offline analysis.
2. **Idempotency Keys**: Assign unique UUID keys (e.g. \`idempotency-key: ord_91823\`) to ensure duplicate webhook deliveries do not double-charge customers.
3. **Exponential Backoff with Jitter**: Avoid 'thundering herd' spikes on recovering databases by adding randomized jitter to retry intervals.`,
        resources: [
          {
            title: "Amazon Builders' Library: Reliable Distributed Systems",
            url: "https://aws.amazon.com/builders-library/",
            type: "doc",
          },
          {
            title: "The Raft Consensus Algorithm Interactive Visualization",
            url: "https://raft.github.io/",
            type: "link",
          },
          {
            title: "Event-Driven System Architecture Whitepaper",
            url: "https://martinfowler.com/articles/201701-event-driven.html",
            type: "pdf",
          },
        ],
      },
    });

    // Lesson 4.3: Video Masterclass
    await ctx.db.insert("lessons", {
      moduleId: cloudMod1Id,
      title: "Video Masterclass: Handling 1 Million Concurrent WebSocket Connections",
      order: 3,
      type: "video",
      estimatedMinutes: 15,
      content: {
        videoUrl: "https://www.youtube.com/watch?v=0w5uU4P2r-0",
        markdown: `### Key Engineering Architecture Points:
- Linux kernel socket buffer tuning (\`sysctl.conf\`, \`somaxconn\`, \`file-max\`).
- Memory footprint per open TCP connection (from 2KB to 32KB).
- Distributed pub/sub backplanes using Redis cluster and NATS.
- Heartbeats, TCP Keep-Alive, and connection draining during zero-downtime rolling deploys.`,
        resources: [
          {
            title: "High-Performance WebSocket Benchmark Repository",
            url: "https://github.com/uNetworking/uWebSockets",
            type: "code",
          },
        ],
      },
    });

    // Module 2 for Cloud
    await ctx.db.insert("lessons", {
      moduleId: cloudMod2Id,
      title: "Horizontal Partitioning & Connection Pooling Guide",
      order: 1,
      type: "article",
      estimatedMinutes: 8,
      content: {
        markdown: `# Database Scalability: Sharding, Replicas & Pooling

Relational databases like PostgreSQL excel at relational consistency, but scale vertically unless architected with partitioning.

## Core Scalability Patterns
- **Read Replicas**: Direct all read-only analytics and dashboard queries to asynchronous read replicas to protect the write primary.
- **Connection Pooling**: Use PgBouncer or serverless connection routers to multiplex 10,000 application requests across 50 physical database worker threads.
- **Sharding**: Horizontally split tables across discrete database instances based on a consistent hash of the tenant/user ID.`,
        resources: [
          {
            title: "PostgreSQL High Performance Connection Pooling",
            url: "https://www.pgbouncer.org",
            type: "doc",
          },
        ],
      },
    });

    const cloudMod2L2 = await ctx.db.insert("lessons", {
      moduleId: cloudMod2Id,
      title: "Database Scalability & Partitioning Strategies Quiz",
      order: 2,
      type: "quiz",
      estimatedMinutes: 5,
    });

    const cloudCh4 = await ctx.db.insert("challenges", {
      lessonId: cloudMod2L2,
      type: "SELECT",
      question: "Why does connection pooling significantly improve database performance under massive request concurrency?",
      order: 1,
    });
    await ctx.db.insert("challengeOptions", {
      challengeId: cloudCh4,
      text: "It reuses warm TCP connections instead of paying the heavy TLS handshake and thread spawn cost per query",
      correct: true,
      imageSrc: "/track_cloud.svg",
    });
    await ctx.db.insert("challengeOptions", {
      challengeId: cloudCh4,
      text: "It automatically deletes table rows older than 7 days",
      correct: false,
    });
    await ctx.db.insert("challengeOptions", {
      challengeId: cloudCh4,
      text: "It converts relational SQL tables into unstructured JSON files",
      correct: false,
    });


    // ====================================================================
    // 5. TRACK 5: Product Design & Scalable Design Systems (Design)
    // ====================================================================
    const courseDesignId = await ctx.db.insert("courses", {
      title: "Product Design & Scalable Design Systems",
      description: "Master 8pt spatial rhythm, WCAG AAA accessibility, semantic design tokens, Figma-to-code pipelines, and physics-based micro-interactions.",
      imageSrc: "/track_design.svg",
      category: "design",
      level: "beginner",
      isPublished: true,
      order: 5,
      tags: ["Design Systems", "UI/UX", "Figma", "Accessibility", "Tailwind CSS", "Motion"],
    });

    const desMod1Id = await ctx.db.insert("modules", {
      courseId: courseDesignId,
      title: "Unit 1: Atomic Design, Spatial Systems & Typography",
      description: "Master 8pt grids, modular typographic scales, and semantic design tokens.",
      order: 1,
    });

    const desMod2Id = await ctx.db.insert("modules", {
      courseId: courseDesignId,
      title: "Unit 2: Micro-Interactions & Deliberate Delight",
      description: "Physics-based spring curves, reduced motion accessibility, and cognitive load reduction.",
      order: 2,
    });

    // Lesson 5.1: Quiz
    const desL1Id = await ctx.db.insert("lessons", {
      moduleId: desMod1Id,
      title: "8pt Spatial Grids & Typography Scale Quiz",
      order: 1,
      type: "quiz",
      estimatedMinutes: 5,
    });

    const desCh1Id = await ctx.db.insert("challenges", {
      lessonId: desL1Id,
      type: "SELECT",
      question: "Why is the 8pt (and 4pt half-step) grid system the universal standard in modern product design?",
      order: 1,
    });
    await ctx.db.insert("challengeOptions", {
      challengeId: desCh1Id,
      text: "Most screen resolutions are divisible by 8, preventing subpixel blur and ensuring proportional harmony across viewports",
      correct: true,
    });
    await ctx.db.insert("challengeOptions", {
      challengeId: desCh1Id,
      text: "Because 8 is considered a lucky number in software engineering",
      correct: false,
    });
    await ctx.db.insert("challengeOptions", {
      challengeId: desCh1Id,
      text: "It was an arbitrary convention created by early web browsers",
      correct: false,
    });

    const desCh2Id = await ctx.db.insert("challenges", {
      lessonId: desL1Id,
      type: "ASSIST",
      question: "What is the minimum WCAG 2.1 AA contrast ratio required for normal body text against its background?",
      order: 2,
    });
    await ctx.db.insert("challengeOptions", {
      challengeId: desCh2Id,
      text: "4.5:1 (or 3:1 for large text 18pt and above)",
      correct: true,
    });
    await ctx.db.insert("challengeOptions", {
      challengeId: desCh2Id,
      text: "1.5:1 minimum contrast",
      correct: false,
    });
    await ctx.db.insert("challengeOptions", {
      challengeId: desCh2Id,
      text: "10:1 mandatory contrast for all UI elements",
      correct: false,
    });

    const desCh3Id = await ctx.db.insert("challenges", {
      lessonId: desL1Id,
      type: "SELECT",
      question: "What is a 'Design Token' in modern scalable design systems?",
      order: 3,
    });
    await ctx.db.insert("challengeOptions", {
      challengeId: desCh3Id,
      text: "A semantic, platform-agnostic variable (color, spacing, font) that synchronizes design in Figma with code in CSS/Tailwind",
      correct: true,
    });
    await ctx.db.insert("challengeOptions", {
      challengeId: desCh3Id,
      text: "A cryptocurrency reward distributed to UI designers",
      correct: false,
    });
    await ctx.db.insert("challengeOptions", {
      challengeId: desCh3Id,
      text: "A physical RFID badge used to enter design studios",
      correct: false,
    });

    // Lesson 5.2: Article
    await ctx.db.insert("lessons", {
      moduleId: desMod1Id,
      title: "Design Tokens in Practice: Bridging Figma and Tailwind CSS",
      order: 2,
      type: "article",
      estimatedMinutes: 8,
      content: {
        markdown: `# Design Tokens: From Figma Styles to Code

Design tokens replace hardcoded values (like hex colors \`#10b981\` or pixel widths \`16px\`) with named variables that capture design intent.

## The Three Tiers of Design Tokens
1. **Global (Primitive) Tokens**: \`color.emerald.500 = #10b981\`
2. **Semantic (Contextual) Tokens**: \`color.accent.primary = {color.emerald.500}\`
3. **Component Tokens**: \`button.primary.background = {color.accent.primary}\`

### Tailwind Integration
Mapping tokens to \`tailwind.config.ts\` ensures that dark mode, branding re-themes, and brand refreshes update instantaneously across thousands of components without touching individual TSX files.`,
        resources: [
          {
            title: "W3C Design Token Community Group Specification",
            url: "https://design-tokens.github.io/community-group/format/",
            type: "doc",
          },
          {
            title: "The A11Y Project WCAG Accessible Checklist",
            url: "https://www.a11yproject.com/checklist/",
            type: "link",
          },
          {
            title: "Tailwind CSS Design System Customization Blueprint",
            url: "https://tailwindcss.com/docs/customizing-colors",
            type: "code",
          },
        ],
      },
    });

    // Lesson 5.3: Video Masterclass
    await ctx.db.insert("lessons", {
      moduleId: desMod1Id,
      title: "Video Masterclass: Building Accessible, WCAG AAA-Compliant UI Components",
      order: 3,
      type: "video",
      estimatedMinutes: 13,
      content: {
        videoUrl: "https://www.youtube.com/watch?v=204C9yCzN3U",
        markdown: `### Masterclass Key Takeaways:
- Keyboard navigation: handling \`Tab\`, \`Shift+Tab\`, \`Enter\`, and \`Escape\` for modals.
- ARIA landmarks (\`role="dialog"\`, \`aria-live="polite"\`, \`aria-expanded\`).
- Visible, high-contrast focus rings that satisfy WCAG 2.4.7.
- Color blindness simulation (Protanopia, Deuteranopia, Tritanopia) during UI audits.`,
        resources: [
          {
            title: "Radix UI Primitives & Accessibility Spec",
            url: "https://www.radix-ui.com/primitives",
            type: "doc",
          },
        ],
      },
    });

    // Module 2 for Design
    await ctx.db.insert("lessons", {
      moduleId: desMod2Id,
      title: "Physics-Based Spring Animations & Haptic Micro-Feedback",
      order: 1,
      type: "article",
      estimatedMinutes: 6,
      content: {
        markdown: `# Crafting Physics-Based Spring Animations

In real life, objects have mass, tension, and momentum. Linear animations feel robotic; physics springs feel tactile and organic.

## Spring Parameters
- **Stiffness**: How aggressively the spring pulls back to its equilibrium position.
- **Damping**: How much friction opposes motion (prevents endless oscillation).
- **Mass**: The inertia of the object.

\`\`\`tsx
// Framer Motion spring configuration
const springConfig = {
  type: "spring",
  stiffness: 400,
  damping: 28,
  mass: 0.8,
};
\`\`\`

Always respect the \`prefers-reduced-motion\` media query to accommodate users with vestibular conditions.`,
        resources: [
          {
            title: "Framer Motion Spring Physics Documentation",
            url: "https://www.framer.com/motion/spring/",
            type: "doc",
          },
        ],
      },
    });

    const desMod2L2 = await ctx.db.insert("lessons", {
      moduleId: desMod2Id,
      title: "Motion Design Principles & Cognitive Load Quiz",
      order: 2,
      type: "quiz",
      estimatedMinutes: 5,
    });

    const desCh4 = await ctx.db.insert("challenges", {
      lessonId: desMod2L2,
      type: "SELECT",
      question: "What is the recommended duration range for functional UI micro-interactions (e.g. dropdowns, button presses)?",
      order: 1,
    });
    await ctx.db.insert("challengeOptions", {
      challengeId: desCh4,
      text: "150ms to 300ms (fast enough to feel instantaneous, smooth enough to provide spatial continuity)",
      correct: true,
      imageSrc: "/track_design.svg",
    });
    await ctx.db.insert("challengeOptions", {
      challengeId: desCh4,
      text: "3 to 5 seconds per interaction",
      correct: false,
    });
    await ctx.db.insert("challengeOptions", {
      challengeId: desCh4,
      text: "50 milliseconds or less",
      correct: false,
    });

    return {
      success: true,
      message: "Lantern comprehensive 5-track multi-modal LMS catalog seeded successfully! Zero legacy Spanish content.",
    };
  },
});

export const seedCredits = mutation({
  args: {
    amount: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const amount = args.amount ?? 150;
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      const allProgress = await ctx.db.query("userProgress").collect();
      for (const p of allProgress) {
        await ctx.db.patch(p._id, { credits: (p.credits ?? 0) + amount });
      }
      return { success: true, message: `Seeded ${amount} credits to ${allProgress.length} users` };
    }

    const userId = identity.subject;
    const progress = await ctx.db
      .query("userProgress")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (progress) {
      await ctx.db.patch(progress._id, {
        credits: (progress.credits ?? 0) + amount,
      });
    }

    await ctx.db.insert("creditTransactions", {
      userId,
      amount,
      type: "grant",
      description: `Seeded ${amount} test credits`,
      provider: "seed_grant",
      createdAt: Date.now(),
    });

    return { success: true, message: `Seeded ${amount} credits for user ${userId}` };
  },
});
