"use client";

import { useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  ArrowUpRight,
  BookMarked,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Compass,
  FileText,
  Flame,
  HelpCircle,
  Loader2,
  Lock,
  Play,
  Sparkles,
  Target,
  Trophy,
  Video,
  Zap,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/providers/auth-provider";
import { toast } from "sonner";
import { quests } from "@/constants";

export default function DashboardPage() {
  const router = useRouter();
  const { user, token } = useAuth();
  const [isPending, startTransition] = useTransition();

  const userProgress = useQuery(
    api.userProgress.getUserProgress,
    token ? { token } : {}
  );
  const modules = useQuery(
    api.modules.getModulesByCourse,
    token ? { token } : {}
  );
  const allCourses = useQuery(api.courses.getCourses, {});
  const upsertProgress = useMutation(api.userProgress.upsertUserProgress);

  if (userProgress === undefined || modules === undefined || allCourses === undefined) {
    return (
      <div className="h-[70vh] w-full flex flex-col items-center justify-center gap-y-3">
        <Loader2 className="h-8 w-8 text-amber-500 animate-spin" />
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Loading your learning dashboard...</p>
      </div>
    );
  }

  // Calculate course completion progress
  let totalLessons = 0;
  let completedLessons = 0;
  let nextLesson: any = null;

  if (modules && modules.length > 0) {
    for (const mod of modules) {
      if (mod.lessons) {
        for (const les of mod.lessons) {
          totalLessons++;
          if (les.completed) {
            completedLessons++;
          } else if (!nextLesson) {
            nextLesson = les;
          }
        }
      }
    }
  }

  const completionPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  // Find active module (the module with next unfinished lesson, or first module)
  const currentModule =
    modules?.find((m) => m.lessons.some((l: any) => !l.completed)) ||
    modules?.[0];

  const moduleTotal = currentModule?.lessons?.length || 0;
  const moduleCompleted = currentModule?.lessons?.filter((l: any) => l.completed).length || 0;
  const modulePercent = moduleTotal > 0 ? Math.round((moduleCompleted / moduleTotal) * 100) : 0;

  const handleSelectCourse = (courseId: string) => {
    startTransition(async () => {
      try {
        await upsertProgress({
          courseId: courseId as Id<"courses">,
          token: token || undefined,
        });
        toast.success("Switched active course track!");
      } catch (err: any) {
        toast.error("Failed to switch course.");
      }
    });
  };

  const activeCourse = userProgress?.activeCourse;
  const currentPoints = userProgress?.points ?? 0;
  // Get 3 showcase courses for the numbered cards
  const topTracks = allCourses?.slice(0, 3) || [];

  const firstName = user?.name ? user.name.split(" ")[0] : "Learner";

  return (
    <div className="flex flex-col gap-y-8 pb-16">
      {/* ============================================================ */}
      {/* 1. HERO WEEKLY PROGRESS STAGE (Filko Reference Inspired)      */}
      {/* ============================================================ */}
      <div className="relative overflow-hidden rounded-3xl bg-[#F5EFE6] dark:bg-[#121620] border border-amber-900/10 dark:border-white/10 p-4 sm:p-8 lg:p-10 shadow-sm transition-all">
        {/* Subtle decorative curved background lines */}
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          {/* Left Column: Greeting, Big Headline & CTA */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-5 sm:space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                Hello, {firstName}!
              </span>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1] mt-2">
                {completedLessons > 0
                  ? `You've completed ${completedLessons} ${completedLessons === 1 ? "lesson" : "lessons"} this week`
                  : `Start your learning journey this week`}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2.5 sm:mt-3 font-medium leading-relaxed max-w-md">
                {activeCourse
                  ? `Active Track: ${activeCourse.title}. Complete bite-sized sessions to build lasting mastery.`
                  : "Explore our interactive technical curriculum to build verifiable engineering and design skills."}
              </p>
            </div>

            <div className="pt-1 flex flex-col xs:flex-row items-stretch xs:items-center gap-2.5 sm:gap-3">
              <Link
                href={nextLesson ? `/lesson/${nextLesson._id}` : "/learn"}
                className="px-6 py-3.5 rounded-full bg-slate-950 dark:bg-amber-500 hover:bg-slate-800 dark:hover:bg-amber-400 text-white dark:text-slate-950 text-xs font-black uppercase tracking-wider transition-all duration-200 shadow-md hover:scale-105 inline-flex items-center justify-center gap-x-2"
              >
                <span>{nextLesson ? "Continue Learning" : "View Curriculum"}</span>
                <ArrowUpRight className="h-4 w-4 stroke-[2.5]" />
              </Link>
              <Link
                href="/courses"
                className="px-5 py-3.5 rounded-full border border-slate-300 dark:border-slate-700 hover:border-slate-900 dark:hover:border-white text-slate-800 dark:text-slate-200 text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-x-1.5"
              >
                <span>Explore Tracks</span>
              </Link>
            </div>
          </div>

          {/* Right Column: 3 Horizontal Numbered Track Cards (01, 02, 03) */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {topTracks.map((track, idx) => {
              const num = String(idx + 1).padStart(2, "0");
              const isSelected = track._id === activeCourse?._id;

              // Distinct card color schemes matching the reference
              const cardThemes = [
                // 01: Warm Ivory / Sand
                "bg-white/90 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-700",
                // 02: Solar Amber / Gold
                "bg-[#F7B731] text-slate-950 border-amber-600/30",
                // 03: Deep Royal Violet
                "bg-[#5F27CD] text-white border-violet-800/40",
              ];

              const currentTheme = cardThemes[idx % cardThemes.length];

              return (
                <div
                  key={track._id}
                  onClick={() => handleSelectCourse(track._id)}
                  className={`relative cursor-pointer rounded-2xl p-4 sm:p-5 border transition-all duration-200 hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between min-h-[190px] ${currentTheme} ${
                    isSelected ? "ring-2 ring-slate-950 dark:ring-amber-400 shadow-md" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-black opacity-70">
                      {num}
                    </span>
                    {isSelected && (
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-black/20 text-current">
                        Active
                      </span>
                    )}
                  </div>

                  <div className="mt-3 flex-1 flex flex-col justify-center">
                    <h4 className="font-black text-[13px] sm:text-sm leading-snug break-words">
                      {track.title}
                    </h4>
                    <div className="mt-2">
                      <span className="inline-block text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-black/15 dark:bg-white/15">
                        {track.category}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-[10px] font-black uppercase tracking-wider">
                    <span>{isSelected ? "Current" : "Switch"}</span>
                    <ArrowUpRight className="h-3 w-3 stroke-[3]" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. LOWER WORKSPACE: 2/3 COLUMN (TIMELINE) & 1/3 (UP NEXT)    */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: ACTIVE MODULE & LESSON TIMELINE (2/3) */}
        <div className="lg:col-span-8 flex flex-col space-y-6">
          {currentModule ? (
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0A0D14] p-4 sm:p-8 shadow-xs">
              {/* Module Header Strip */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800/80">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    Module {currentModule.order}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight mt-0.5">
                    {currentModule.title}
                  </h2>
                  {currentModule.description && (
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl leading-relaxed">
                      {currentModule.description}
                    </p>
                  )}
                </div>

                {/* Progress Indicator */}
                <div className="flex items-center gap-x-3 w-full sm:w-48 flex-shrink-0">
                  <div className="flex-1">
                    <Progress value={modulePercent} className="h-2.5 bg-slate-100 dark:bg-slate-800" />
                  </div>
                  <span className="text-xs font-black text-slate-700 dark:text-slate-300">
                    {modulePercent}%
                  </span>
                </div>
              </div>

              {/* Vertical Lesson Item List (Filko Table Design) */}
              <div className="mt-6 divide-y divide-slate-100 dark:divide-slate-800/80">
                {currentModule.lessons?.map((les: any, i: number) => {
                  const isCompleted = les.completed;
                  const isCurrent = les._id === nextLesson?._id;

                  // Format Badge Text & Icon
                  const formatDetails =
                    les.type === "video"
                      ? { label: "Video Masterclass", icon: <Video className="h-3.5 w-3.5 text-purple-500" /> }
                      : les.type === "article"
                      ? { label: "Architecture Guide", icon: <FileText className="h-3.5 w-3.5 text-sky-500" /> }
                      : { label: "Interactive Quiz", icon: <HelpCircle className="h-3.5 w-3.5 text-amber-500" /> };

                  return (
                    <Link
                      key={les._id}
                      href={`/lesson/${les._id}`}
                      className="group py-4 px-2 sm:px-3 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-900/60"
                    >
                      <div className="flex items-start sm:items-center gap-x-4 min-w-0">
                        {/* Squircle Status Badge */}
                        <div
                          className={`h-11 w-11 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all ${
                            isCompleted
                              ? "bg-amber-400 text-slate-950 font-black shadow-xs"
                              : isCurrent
                              ? "bg-slate-950 dark:bg-amber-500 text-white dark:text-slate-950 font-black ring-4 ring-amber-500/20"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700"
                          }`}
                        >
                          {isCompleted ? (
                            <Check className="h-5 w-5 stroke-[3]" />
                          ) : isCurrent ? (
                            <Play className="h-4 w-4 fill-current ml-0.5" />
                          ) : (
                            <span className="font-mono text-xs font-bold">{i + 1}</span>
                          )}
                        </div>

                        {/* Title & Summary */}
                        <div className="min-w-0">
                          <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                            {les.title}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1 leading-relaxed">
                            {les.type === "quiz"
                              ? "Knowledge check challenges, instant scoring & XP verification."
                              : les.type === "video"
                              ? "Real-time masterclass lecture with architectural code walkthrough."
                              : "Deep-dive technical documentation with syntax-highlighted code blocks."}
                          </p>
                        </div>
                      </div>

                      {/* Format Pill & Time */}
                      <div className="flex items-center gap-x-3 self-end sm:self-auto flex-shrink-0">
                        <div className="flex items-center gap-x-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-400">
                          {formatDetails.icon}
                          <span>{formatDetails.label}</span>
                          {les.estimatedMinutes && (
                            <span className="text-slate-400 dark:text-slate-500">
                              • {les.estimatedMinutes}m
                            </span>
                          )}
                        </div>

                        <div className="h-8 w-8 rounded-full flex items-center justify-center text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white group-hover:translate-x-1 transition-all">
                          <ChevronRight className="h-4 w-4" />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-700 p-8 text-center bg-white dark:bg-[#0A0D14]">
              <Compass className="h-10 w-10 text-amber-500 mx-auto mb-2" />
              <h3 className="font-bold text-slate-800 dark:text-slate-200">No Course Active</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                Explore our courses catalog to enroll in Full-Stack, AI, Cloud, or Design tracks.
              </p>
              <Link
                href="/courses"
                className="mt-4 inline-flex items-center gap-x-2 px-5 py-2.5 rounded-full bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider"
              >
                Browse Catalog
              </Link>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: UP NEXT & COMPANION HUBS (1/3) */}
        <div className="lg:col-span-4 flex flex-col space-y-6">
          {/* 1. UP NEXT / SCHEDULED CARD */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0A0D14] p-4 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-sm uppercase tracking-wider text-slate-900 dark:text-slate-100">
                Scheduled / Up Next
              </h3>
              <Link
                href="/learn"
                className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline"
              >
                See all
              </Link>
            </div>

            {nextLesson ? (
              <div className="p-4 rounded-2xl bg-[#FBF8F3] dark:bg-slate-900/60 border border-amber-900/10 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-[11px] font-bold text-amber-700 dark:text-amber-400">
                  <span className="flex items-center gap-x-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    Today • Ready Now
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-800 dark:text-amber-300 uppercase text-[9px] font-black">
                    {activeCourse?.category || "Course"}
                  </span>
                </div>

                <div>
                  <h4 className="font-black text-sm text-slate-900 dark:text-slate-100">
                    {nextLesson.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Est. {nextLesson.estimatedMinutes || 5} mins • {nextLesson.type === "quiz" ? "Interactive Quiz" : "Masterclass Article"}
                  </p>
                </div>

                <Link
                  href={`/lesson/${nextLesson._id}`}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-950 dark:bg-amber-500 hover:bg-slate-800 dark:hover:bg-amber-400 text-white dark:text-slate-950 text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-x-2"
                >
                  <Play className="h-3 w-3 fill-current" />
                  <span>Start Challenge</span>
                </Link>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 text-center py-6">
                <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  All current lessons completed!
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">Explore other tracks or review in practice mode.</p>
              </div>
            )}
          </div>

          {/* 2. DAILY MILESTONES MINI WIDGET */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0A0D14] p-4 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-sm uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-x-2">
                <Target className="h-4 w-4 text-amber-500" />
                Daily Milestones
              </h3>
              <Link
                href="/quests"
                className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline"
              >
                Quests →
              </Link>
            </div>

            <div className="space-y-4">
              {quests.slice(0, 2).map((q) => {
                const prog = Math.min((currentPoints / q.value) * 100, 100);
                return (
                  <div key={q.title} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800 dark:text-slate-200">{q.title}</span>
                      <span className="text-[11px] font-mono text-slate-400">
                        {Math.min(currentPoints, q.value)} / {q.value} XP
                      </span>
                    </div>
                    <Progress value={prog} className="h-2 bg-slate-100 dark:bg-slate-800" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. PERSONAL NOTEBOOK QUICK LAUNCHER */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0A0D14] p-4 sm:p-6 shadow-xs flex flex-col justify-between">
            <div className="flex items-center gap-x-3 mb-3">
              <div className="h-9 w-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <BookMarked className="h-4 w-4 stroke-[2.2]" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  Study Notebook
                </h4>
                <p className="text-[11px] text-slate-400">Auto-saved code & takeaways</p>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Review personal architectural notes, code snippets, and reflections across all lessons.
            </p>

            <Link
              href="/notebook"
              className="mt-4 w-full py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-amber-500 text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 transition-colors flex items-center justify-center gap-x-1.5"
            >
              <span>Open Notebook</span>
              <ArrowUpRight className="h-3 w-3 stroke-[2.5]" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
