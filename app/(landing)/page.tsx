"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Brain,
  Check,
  Compass,
  Flame,
  Rocket,
  Sparkles,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import { Header } from "./header";
import { useAuth } from "@/providers/auth-provider";

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */

const STEPS = [
  {
    title: "Pick a track",
    body: "Choose from programming, AI, business, cloud, or design. Start at any level.",
  },
  {
    title: "Practice in short sessions",
    body: "Quizzes, readings, and drills give instant feedback so concepts stick.",
  },
  {
    title: "Keep your momentum",
    body: "Build a daily streak, earn XP, and save what you learn to your notebook.",
  },
];

const TRACKS = [
  {
    title: "Full-Stack Web Development",
    tag: "Engineering",
    image: "/track_engineering.svg",
    body: "React, the Next.js App Router, real-time data, and server actions from first principles.",
  },
  {
    title: "Applied AI & Agents",
    tag: "AI & ML",
    image: "/track_ai.svg",
    body: "Prompt design, structured outputs, tool-calling loops, and semantic search.",
  },
  {
    title: "Startup Economics & Growth",
    tag: "Business",
    image: "/track_business.svg",
    body: "SaaS metrics, cap tables, acquisition funnels, and product-led growth.",
  },
  {
    title: "Cloud Architecture",
    tag: "Systems",
    image: "/track_cloud.svg",
    body: "Distributed consensus, fault tolerance, queues, and zero-downtime databases.",
  },
  {
    title: "Product Design Systems",
    tag: "Design",
    image: "/track_design.svg",
    body: "Design tokens, spacing systems, type scales, and accessible interfaces.",
  },
];

const AUDIENCES: { icon: LucideIcon; title: string; body: string; point: string }[] = [
  {
    icon: Compass,
    title: "Curious beginners",
    body: "Guided tracks break complex ideas into small, clear steps you can follow from day one.",
    point: "Step-by-step guidance",
  },
  {
    icon: Rocket,
    title: "Career builders",
    body: "Practical, current material in engineering, AI, and product that you can apply at work.",
    point: "Modern technical tracks",
  },
  {
    icon: Brain,
    title: "Lifelong learners",
    body: "Five to ten minutes a day keeps your streak alive and your knowledge compounding.",
    point: "Daily micro-learning",
  },
];

const STATS = [
  { value: "5", label: "Learning tracks" },
  { value: "100", label: "Free credits on signup" },
  { value: "5 min", label: "Typical daily session" },
  { value: "$0", label: "To get started" },
];

/* ------------------------------------------------------------------ */
/* Small building blocks                                               */
/* ------------------------------------------------------------------ */

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-600 dark:text-amber-400">{children}</p>
);

const SectionHeading = ({
  eyebrow,
  title,
  body,
  center = false,
}: {
  eyebrow: string;
  title: string;
  body?: string;
  center?: boolean;
}) => (
  <div className={center ? "text-center max-w-2xl mx-auto" : "max-w-2xl"}>
    <Eyebrow>{eyebrow}</Eyebrow>
    <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-950 dark:text-white text-balance">
      {title}
    </h2>
    {body && <p className="mt-4 text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">{body}</p>}
  </div>
);

const PrimaryButton = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link
    href={href}
    className="group inline-flex items-center justify-center gap-x-2 h-12 px-6 rounded-xl bg-amber-400 text-zinc-950 text-[15px] font-semibold shadow-[0_0_0_1px_rgba(251,191,36,0.4),0_8px_30px_-6px_rgba(251,191,36,0.45)] hover:bg-amber-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#08090C]"
  >
    {children}
    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
  </Link>
);

const SecondaryButton = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link
    href={href}
    className="inline-flex items-center justify-center h-12 px-6 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/[0.03] text-[15px] font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/[0.07] hover:text-zinc-950 dark:hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
  >
    {children}
  </Link>
);

/** Hero illustration with a soft amber glow behind it. */
const HeroArt = () => (
  <div className="relative mx-auto flex w-full max-w-[460px] items-center justify-center">
    <div
      aria-hidden
      className="absolute h-[320px] w-[320px] sm:h-[420px] sm:w-[420px] rounded-full bg-[radial-gradient(closest-side,rgba(245,158,11,0.35),transparent)] blur-2xl"
    />
    <div aria-hidden className="absolute h-[300px] w-[300px] sm:h-[400px] sm:w-[400px] rounded-full border border-zinc-200/70 dark:border-white/[0.06]" />
    <div aria-hidden className="absolute h-[220px] w-[220px] sm:h-[300px] sm:w-[300px] rounded-full border border-zinc-200 dark:border-white/[0.08]" />
    <Image
      src="/hero.svg"
      alt="Lantern illustration"
      width={400}
      height={400}
      priority
      className="relative h-64 w-64 sm:h-[22rem] sm:w-[22rem] object-contain drop-shadow-[0_20px_50px_rgba(245,158,11,0.25)] motion-safe:transition-transform motion-safe:duration-700 hover:scale-[1.03]"
    />
  </div>
);

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function LandingPage() {
  const { user } = useAuth();
  const startHref = user ? "/dashboard" : "/register";

  return (
    <div className="w-full flex flex-col">
      <Header />

      <main>
        {/* ======================= HERO ======================= */}
        <section id="about" className="relative isolate overflow-hidden pt-32 sm:pt-40 pb-20 sm:pb-28">
          {/* Background: grid + top glow */}
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.05)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]"
          />
          <div
            aria-hidden
            className="absolute left-1/2 top-0 -z-10 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(245,158,11,0.22),transparent)]"
          />

          <div className="max-w-6xl mx-auto px-5 sm:px-8 grid lg:grid-cols-2 gap-16 lg:gap-12 items-center">
            <div className="text-center lg:text-left motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-700">
              <Link
                href="#tracks"
                className="inline-flex max-w-full items-center gap-x-1.5 sm:gap-x-2 whitespace-nowrap rounded-full border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/[0.03] pl-1 sm:pl-1.5 pr-2.5 sm:pr-3 py-1 text-[11px] sm:text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-white/20 transition-colors"
              >
                <span className="shrink-0 rounded-full bg-amber-400/15 text-amber-700 dark:text-amber-300 px-2 py-0.5 font-semibold">New</span>
                <span>Five tracks, from code to design</span>
                <ArrowRight className="h-3 w-3 shrink-0 text-zinc-500" />
              </Link>

              <h1 className="mt-6 text-[2.6rem] leading-[1.05] sm:text-6xl lg:text-[4.25rem] font-semibold tracking-[-0.035em] text-zinc-950 dark:text-white text-balance">
                Illuminate your path,{" "}
                <span className="bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 dark:from-amber-200 dark:via-amber-400 dark:to-orange-500 bg-clip-text text-transparent">
                  master any skill.
                </span>
              </h1>

              <p className="mt-6 text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Lantern turns hard subjects into short, interactive lessons. Practice daily, get instant
                feedback, and watch your skills build up.
              </p>

              <div className="mt-9 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <PrimaryButton href={startHref}>
                  {user ? "Continue learning" : "Start learning free"}
                </PrimaryButton>
                <SecondaryButton href="#how-it-works">See how it works</SecondaryButton>
              </div>

              <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 justify-center lg:justify-start text-sm text-zinc-500">
                {["Free to start", "100 starter credits", "No credit card"].map((t) => (
                  <li key={t} className="flex items-center gap-x-1.5">
                    <Check className="h-4 w-4 text-amber-600 dark:text-amber-400" /> {t}
                  </li>
                ))}
              </ul>
            </div>

            <div className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-6 motion-safe:duration-1000">
              <HeroArt />
            </div>
          </div>
        </section>

        {/* ================== TRACK STRIP ================== */}
        <section aria-label="Available tracks" className="border-y border-zinc-200/70 dark:border-white/[0.06] bg-zinc-50/70 dark:bg-white/[0.015]">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8 flex flex-col md:flex-row items-center gap-6 md:gap-10">
            <p className="text-sm text-zinc-500 shrink-0">Tracks available today</p>
            <ul className="flex flex-wrap justify-center md:justify-between flex-1 gap-x-8 gap-y-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              {TRACKS.map((t) => (
                <li key={t.tag} className="flex items-center gap-x-2">
                  <Image src={t.image} alt="" width={28} height={21} className="rounded" />
                  {t.tag}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ================== HOW IT WORKS ================== */}
        <section id="how-it-works" className="scroll-mt-20 py-24 sm:py-32">
          <div className="max-w-6xl mx-auto px-5 sm:px-8">
            <SectionHeading
              eyebrow="How it works"
              title="Built for the time you actually have"
              body="No hour-long lectures. Each session is short, focused, and ends with something you can remember."
            />

            <ol className="mt-14 grid md:grid-cols-3 gap-px rounded-2xl overflow-hidden border border-zinc-200 dark:border-white/[0.08] bg-zinc-200 dark:bg-white/[0.08]">
              {STEPS.map((step, i) => (
                <li key={step.title} className="bg-white dark:bg-[#0C0D11] p-7 sm:p-8">
                  <span className="font-mono text-sm text-amber-600 dark:text-amber-400">0{i + 1}</span>
                  <h3 className="mt-4 text-lg font-semibold text-zinc-950 dark:text-white">{step.title}</h3>
                  <p className="mt-2 text-[15px] text-zinc-600 dark:text-zinc-400 leading-relaxed">{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ===================== FEATURES (BENTO) ===================== */}
        <section id="features" className="scroll-mt-20 pb-24 sm:pb-32">
          <div className="max-w-6xl mx-auto px-5 sm:px-8">
            <SectionHeading
              eyebrow="Features"
              title="Everything you need to make learning a habit"
            />

            <div className="mt-14 grid grid-cols-1 md:grid-cols-6 gap-4">
              {/* Interactive challenges */}
              <div className="md:col-span-4 relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-white/[0.08] bg-gradient-to-b from-zinc-50 dark:from-zinc-900/80 to-white dark:to-zinc-950 p-7 sm:p-8">
                <Sparkles className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                <h3 className="mt-4 text-lg font-semibold text-zinc-950 dark:text-white">Interactive challenges</h3>
                <p className="mt-2 max-w-md text-[15px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Multiple choice, fill-in, and reading lessons with immediate feedback. Mistakes become
                  practice, not penalties.
                </p>
                <div className="mt-8 flex flex-wrap gap-2">
                  {["Quizzes", "Article lessons", "Practice mode", "Instant feedback"].map((c) => (
                    <span
                      key={c}
                      className="rounded-lg border border-zinc-200 dark:border-white/[0.08] bg-zinc-50 dark:bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              {/* Streaks */}
              <div className="md:col-span-2 rounded-2xl border border-zinc-200 dark:border-white/[0.08] bg-zinc-50/70 dark:bg-zinc-900/50 p-7 sm:p-8">
                <Flame className="h-5 w-5 text-orange-500 dark:text-orange-400" />
                <h3 className="mt-4 text-lg font-semibold text-zinc-950 dark:text-white">Daily streaks</h3>
                <p className="mt-2 text-[15px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  A small daily goal that keeps you coming back.
                </p>
                <div className="mt-6 flex gap-1.5" aria-hidden>
                  {Array.from({ length: 7 }).map((_, i) => (
                    <span
                      key={i}
                      className={`h-8 flex-1 rounded-md ${i < 5 ? "bg-orange-400/80" : "bg-zinc-200 dark:bg-zinc-800"}`}
                    />
                  ))}
                </div>
              </div>

              {/* Notebook */}
              <div className="md:col-span-3 rounded-2xl border border-zinc-200 dark:border-white/[0.08] bg-zinc-50/70 dark:bg-zinc-900/50 p-7 sm:p-8">
                <BookOpen className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                <h3 className="mt-4 text-lg font-semibold text-zinc-950 dark:text-white">Personal notebook</h3>
                <p className="mt-2 text-[15px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Save key takeaways as you go and review them anytime, synced to your account.
                </p>
              </div>

              {/* Quests & leaderboard */}
              <div className="md:col-span-3 rounded-2xl border border-zinc-200 dark:border-white/[0.08] bg-zinc-50/70 dark:bg-zinc-900/50 p-7 sm:p-8">
                <Trophy className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="mt-4 text-lg font-semibold text-zinc-950 dark:text-white">Quests and leaderboard</h3>
                <p className="mt-2 text-[15px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Earn XP, complete milestones, and see how you rank against other learners.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ======================== TRACKS ======================== */}
        <section id="tracks" className="scroll-mt-20 pb-24 sm:pb-32">
          <div className="max-w-6xl mx-auto px-5 sm:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
              <SectionHeading
                eyebrow="Tracks"
                title="What you can learn"
                body="Curated paths that build real intuition, one unit at a time."
              />
              <Link
                href="/courses"
                className="group inline-flex items-center gap-x-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white shrink-0"
              >
                Browse all courses
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>

            <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {TRACKS.map((track) => (
                <Link
                  key={track.title}
                  href="/courses"
                  className="group rounded-2xl border border-zinc-200 dark:border-white/[0.08] bg-white dark:bg-zinc-900/40 overflow-hidden hover:border-zinc-300 dark:hover:border-white/20 hover:bg-zinc-50 dark:hover:bg-zinc-900/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60"
                >
                  <div className="aspect-[16/9] relative overflow-hidden border-b border-zinc-200/70 dark:border-white/[0.06]">
                    <Image
                      src={track.image}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="p-6">
                    <span className="text-xs font-medium text-zinc-500">{track.tag}</span>
                    <h3 className="mt-1.5 text-base font-semibold text-zinc-950 dark:text-white flex items-center justify-between gap-x-2">
                      {track.title}
                      <ArrowUpRight className="h-4 w-4 text-zinc-500 dark:text-zinc-600 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors shrink-0" />
                    </h3>
                    <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{track.body}</p>
                  </div>
                </Link>
              ))}

              {/* Catalog card */}
              <Link
                href="/courses"
                className="group rounded-2xl border border-dashed border-zinc-300 dark:border-white/15 p-6 flex flex-col justify-between min-h-[260px] hover:border-amber-400/50 hover:bg-amber-400/[0.03] transition-colors"
              >
                <Compass className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                <div>
                  <h3 className="text-base font-semibold text-zinc-950 dark:text-white">Explore the full catalog</h3>
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Search by topic or jump straight into any unit.
                  </p>
                  <span className="mt-5 inline-flex items-center gap-x-1.5 text-sm font-medium text-amber-600 dark:text-amber-400">
                    View courses
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* ===================== WHO IT'S FOR ===================== */}
        <section id="who-it-is-for" className="scroll-mt-20 pb-24 sm:pb-32">
          <div className="max-w-6xl mx-auto px-5 sm:px-8">
            <SectionHeading
              center
              eyebrow="Who it's for"
              title="For anyone who wants to keep growing"
            />

            <div className="mt-14 grid md:grid-cols-3 gap-10 md:gap-8">
              {AUDIENCES.map(({ icon: Icon, title, body, point }) => (
                <div key={title} className="text-center md:text-left">
                  <div className="mx-auto md:mx-0 h-11 w-11 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/[0.03] flex items-center justify-center">
                    <Icon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-zinc-950 dark:text-white">{title}</h3>
                  <p className="mt-2 text-[15px] text-zinc-600 dark:text-zinc-400 leading-relaxed">{body}</p>
                  <p className="mt-4 inline-flex items-center gap-x-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> {point}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ======================== STATS ======================== */}
        <section aria-label="Lantern at a glance" className="pb-24 sm:pb-32">
          <div className="max-w-6xl mx-auto px-5 sm:px-8">
            <dl className="grid grid-cols-2 lg:grid-cols-4 gap-px rounded-2xl overflow-hidden border border-zinc-200 dark:border-white/[0.08] bg-zinc-200 dark:bg-white/[0.08]">
              {STATS.map((s) => (
                <div key={s.label} className="bg-white dark:bg-[#08090C] p-7 sm:p-8">
                  <dt className="text-sm text-zinc-500">{s.label}</dt>
                  <dd className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-950 dark:text-white tabular-nums">
                    {s.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ========================= CTA ========================= */}
        <section className="pb-24 sm:pb-32">
          <div className="max-w-6xl mx-auto px-5 sm:px-8">
            <div className="relative isolate overflow-hidden rounded-3xl border border-amber-400/20 bg-zinc-50 dark:bg-zinc-900 px-6 py-16 sm:px-16 sm:py-20 text-center">
              <div
                aria-hidden
                className="absolute left-1/2 top-full -z-10 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(245,158,11,0.35),transparent)]"
              />
              <Image src="/mascot.svg" alt="" width={56} height={56} className="mx-auto" />
              <h2 className="mt-6 text-3xl sm:text-5xl font-semibold tracking-tight text-zinc-950 dark:text-white text-balance">
                Your next skill starts today
              </h2>
              <p className="mt-4 text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-lg mx-auto">
                Create a free account, get 100 starter credits, and finish your first lesson in minutes.
              </p>
              <div className="mt-9 flex flex-col sm:flex-row gap-3 justify-center">
                <PrimaryButton href={user ? "/learn" : "/register"}>
                  {user ? "Go to my lessons" : "Create free account"}
                </PrimaryButton>
                <SecondaryButton href="/courses">Browse courses</SecondaryButton>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ======================== FOOTER ======================== */}
      <footer className="border-t border-zinc-200/70 dark:border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14 grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-x-2">
              <Image src="/mascot.svg" alt="" width={26} height={26} />
              <span className="text-base font-bold tracking-tight text-zinc-950 dark:text-white">Lantern</span>
            </Link>
            <p className="mt-4 text-sm text-zinc-500 max-w-xs leading-relaxed">
              Short, interactive lessons that help you learn something real every day.
            </p>
          </div>

          <nav aria-label="Product">
            <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">Product</h3>
            <ul className="mt-4 space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
              <li><Link href="#how-it-works" className="hover:text-zinc-950 dark:hover:text-white transition-colors">How it works</Link></li>
              <li><Link href="#features" className="hover:text-zinc-950 dark:hover:text-white transition-colors">Features</Link></li>
              <li><Link href="/courses" className="hover:text-zinc-950 dark:hover:text-white transition-colors">Courses</Link></li>
            </ul>
          </nav>

          <nav aria-label="Account">
            <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">Account</h3>
            <ul className="mt-4 space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
              <li><Link href="/login" className="hover:text-zinc-950 dark:hover:text-white transition-colors">Log in</Link></li>
              <li><Link href="/register" className="hover:text-zinc-950 dark:hover:text-white transition-colors">Create account</Link></li>
              <li><Link href="/dashboard" className="hover:text-zinc-950 dark:hover:text-white transition-colors">Dashboard</Link></li>
            </ul>
          </nav>
        </div>
        <div className="border-t border-zinc-200/70 dark:border-white/[0.06]">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-zinc-500 dark:text-zinc-600">
            <p>© {new Date().getFullYear()} Lantern. All rights reserved.</p>
            <p>
              Designed and developed by{" "}
              <a
                href="https://samuelolubukun.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-zinc-600 dark:text-zinc-400 underline-offset-4 hover:text-amber-600 dark:hover:text-amber-400 hover:underline transition-colors"
              >
                Samuel Olubukun
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
