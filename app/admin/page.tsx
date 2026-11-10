"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldAlert,
  ShieldCheck,
  LayoutDashboard,
  BookOpen,
  Users,
  HelpCircle,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Sparkles,
  Zap,
  Coins,
  Search,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  Video,
  FileText,
  HelpCircle as QuizIcon,
  Flame,
  ArrowRight,
  Loader2,
  RefreshCw,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";

type Tab = "overview" | "curriculum" | "learners" | "challenges";

export default function AdminPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  // Expanded courses in Curriculum view
  const [expandedCourses, setExpandedCourses] = useState<Record<string, boolean>>({});
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});

  // Search filters
  const [learnerSearch, setLearnerSearch] = useState("");
  const [challengeSearch, setChallengeSearch] = useState("");

  // Convex Reactive Queries
  const overview = useQuery(api.admin.getAdminOverview);
  const curriculum = useQuery(api.admin.getAdminCurriculum);
  const learners = useQuery(api.admin.getAdminLearners);
  const challenges = useQuery(api.admin.getAdminChallengesWithDetails);

  // Convex Mutations
  const createCourse = useMutation(api.admin.createAdminCourse);
  const updateCourse = useMutation(api.admin.updateAdminCourse);
  const toggleCoursePublished = useMutation(api.admin.toggleCoursePublished);
  const deleteCourse = useMutation(api.admin.deleteAdminCourse);

  const createModule = useMutation(api.admin.createAdminModule);
  const updateModule = useMutation(api.admin.updateAdminModule);
  const deleteModule = useMutation(api.admin.deleteAdminModule);

  const createLesson = useMutation(api.admin.createAdminLesson);
  const updateLesson = useMutation(api.admin.updateAdminLesson);
  const deleteLesson = useMutation(api.admin.deleteAdminLesson);

  const createChallenge = useMutation(api.admin.createAdminChallenge);
  const deleteChallenge = useMutation(api.admin.deleteAdminChallenge);

  const toggleUserAdmin = useMutation(api.admin.toggleUserAdminRole);
  const grantCredits = useMutation(api.admin.grantLearnerCredits);

  // Modals state
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<Id<"courses"> | null>(null);
  const [courseForm, setCourseForm] = useState({
    title: "",
    category: "engineering",
    level: "beginner" as "beginner" | "intermediate" | "advanced",
    imageSrc: "/track_engineering.svg",
    description: "",
    isPublished: true,
  });

  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [moduleCourseId, setModuleCourseId] = useState<Id<"courses"> | null>(null);
  const [moduleForm, setModuleForm] = useState({
    title: "",
    description: "",
  });

  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [lessonModuleId, setLessonModuleId] = useState<Id<"modules"> | null>(null);
  const [lessonForm, setLessonForm] = useState({
    title: "",
    type: "quiz" as "quiz" | "video" | "article" | "practice",
    estimatedMinutes: 5,
    markdown: "",
    videoUrl: "",
  });

  const [isChallengeModalOpen, setIsChallengeModalOpen] = useState(false);
  const [challengeLessonId, setChallengeLessonId] = useState<Id<"lessons"> | null>(null);
  const [challengeForm, setChallengeForm] = useState({
    question: "",
    type: "SELECT" as "SELECT" | "ASSIST",
    options: [
      { text: "", correct: true },
      { text: "", correct: false },
      { text: "", correct: false },
      { text: "", correct: false },
    ],
  });

  const [creditModalUser, setCreditModalUser] = useState<{ id: string; name: string } | null>(null);
  const [creditAmount, setCreditAmount] = useState(100);

  // Auth Guard: Admin access only
  if (authLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-y-4">
        <div className="relative h-14 w-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center p-2 animate-pulse shadow-md">
          <Image src="/mascot.svg" height={40} width={40} alt="Lantern" className="object-contain" />
        </div>
        <div className="flex items-center gap-x-2 text-sm font-bold text-slate-700 dark:text-slate-300">
          <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
          <span>Verifying Admin Studio permissions...</span>
        </div>
      </div>
    );
  }

  if (!user || !user.isAdmin) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <div className="h-14 w-14 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
            <ShieldAlert className="h-7 w-7" />
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">
            Admin Privileges Required
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Access to Lantern Admin Studio is restricted strictly to authorized platform administrators.
          </p>
          <div className="pt-2">
            <Link href="/dashboard">
              <Button className="rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs uppercase tracking-wider">
                ← Return to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Helper toggle functions
  const toggleCourseExpand = (id: string) => {
    setExpandedCourses((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleModuleExpand = (id: string) => {
    setExpandedModules((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Handlers for Courses
  const handleOpenCourseModal = (course?: any) => {
    if (course) {
      setEditingCourseId(course.id);
      setCourseForm({
        title: course.title,
        category: course.category || "engineering",
        level: course.level || "beginner",
        imageSrc: course.imageSrc || "/track_engineering.svg",
        description: course.description || "",
        isPublished: course.isPublished ?? true,
      });
    } else {
      setEditingCourseId(null);
      setCourseForm({
        title: "",
        category: "engineering",
        level: "beginner",
        imageSrc: "/track_engineering.svg",
        description: "",
        isPublished: true,
      });
    }
    setIsCourseModalOpen(true);
  };

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseForm.title.trim()) {
      toast.error("Please enter a course title.");
      return;
    }

    try {
      if (editingCourseId) {
        await updateCourse({
          id: editingCourseId,
          title: courseForm.title,
          category: courseForm.category,
          level: courseForm.level,
          imageSrc: courseForm.imageSrc,
          description: courseForm.description,
          isPublished: courseForm.isPublished,
        });
        toast.success("Course updated successfully!");
      } else {
        await createCourse({
          title: courseForm.title,
          category: courseForm.category,
          level: courseForm.level,
          imageSrc: courseForm.imageSrc,
          description: courseForm.description,
          isPublished: courseForm.isPublished,
        });
        toast.success("New track created successfully!");
      }
      setIsCourseModalOpen(false);
    } catch {
      toast.error("Failed to save course.");
    }
  };

  const handleDeleteCourse = async (id: Id<"courses">, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"? This will also delete all its modules, lessons, and challenges.`)) {
      try {
        await deleteCourse({ id });
        toast.success(`Deleted "${title}"`);
      } catch {
        toast.error("Failed to delete course.");
      }
    }
  };

  // Handlers for Modules
  const handleOpenModuleModal = (courseId: Id<"courses">) => {
    setModuleCourseId(courseId);
    setModuleForm({ title: "", description: "" });
    setIsModuleModalOpen(true);
  };

  const handleSaveModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!moduleCourseId || !moduleForm.title.trim()) return;

    try {
      await createModule({
        courseId: moduleCourseId,
        title: moduleForm.title,
        description: moduleForm.description,
      });
      toast.success("Module created!");
      setIsModuleModalOpen(false);
    } catch {
      toast.error("Failed to create module.");
    }
  };

  const handleDeleteModule = async (id: Id<"modules">, title: string) => {
    if (window.confirm(`Delete module "${title}"?`)) {
      try {
        await deleteModule({ id });
        toast.success("Module deleted.");
      } catch {
        toast.error("Failed to delete module.");
      }
    }
  };

  // Handlers for Lessons
  const handleOpenLessonModal = (moduleId: Id<"modules">) => {
    setLessonModuleId(moduleId);
    setLessonForm({
      title: "",
      type: "quiz",
      estimatedMinutes: 5,
      markdown: "",
      videoUrl: "",
    });
    setIsLessonModalOpen(true);
  };

  const handleSaveLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonModuleId || !lessonForm.title.trim()) return;

    try {
      await createLesson({
        moduleId: lessonModuleId,
        title: lessonForm.title,
        type: lessonForm.type,
        estimatedMinutes: Number(lessonForm.estimatedMinutes) || 5,
        markdown: lessonForm.markdown,
        videoUrl: lessonForm.videoUrl,
      });
      toast.success("Lesson created!");
      setIsLessonModalOpen(false);
    } catch {
      toast.error("Failed to create lesson.");
    }
  };

  const handleDeleteLesson = async (id: Id<"lessons">, title: string) => {
    if (window.confirm(`Delete lesson "${title}"?`)) {
      try {
        await deleteLesson({ id });
        toast.success("Lesson deleted.");
      } catch {
        toast.error("Failed to delete lesson.");
      }
    }
  };

  // Handlers for Challenges
  const handleOpenChallengeModal = (lessonId: Id<"lessons">) => {
    setChallengeLessonId(lessonId);
    setChallengeForm({
      question: "",
      type: "SELECT",
      options: [
        { text: "", correct: true },
        { text: "", correct: false },
        { text: "", correct: false },
        { text: "", correct: false },
      ],
    });
    setIsChallengeModalOpen(true);
  };

  const handleSaveChallenge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!challengeLessonId || !challengeForm.question.trim()) {
      toast.error("Please provide a question prompt.");
      return;
    }

    const validOptions = challengeForm.options.filter((o) => o.text.trim().length > 0);
    if (validOptions.length < 2) {
      toast.error("Please provide at least 2 challenge options.");
      return;
    }

    const hasCorrect = validOptions.some((o) => o.correct);
    if (!hasCorrect) {
      toast.error("Please mark at least one option as the correct answer.");
      return;
    }

    try {
      await createChallenge({
        lessonId: challengeLessonId,
        question: challengeForm.question.trim(),
        type: challengeForm.type,
        options: validOptions,
      });
      toast.success("Challenge added successfully!");
      setIsChallengeModalOpen(false);
    } catch {
      toast.error("Failed to create challenge.");
    }
  };

  const handleDeleteChallenge = async (id: Id<"challenges">) => {
    if (window.confirm("Delete this challenge question?")) {
      try {
        await deleteChallenge({ id });
        toast.success("Challenge removed.");
      } catch {
        toast.error("Failed to delete challenge.");
      }
    }
  };

  // Handlers for Learners
  const handleToggleAdminRole = async (userId: string, currentAdmin: boolean, name: string) => {
    try {
      await toggleUserAdmin({ userId, isAdmin: !currentAdmin });
      toast.success(
        !currentAdmin
          ? `Granted Admin Studio access to ${name}`
          : `Revoked Admin Studio access from ${name}`
      );
    } catch {
      toast.error("Failed to update role.");
    }
  };

  const handleGrantCredits = async () => {
    if (!creditModalUser) return;
    try {
      await grantCredits({
        userId: creditModalUser.id,
        amount: creditAmount,
      });
      toast.success(`Granted ${creditAmount} credits to ${creditModalUser.name}`);
      setCreditModalUser(null);
    } catch {
      toast.error("Failed to grant credits.");
    }
  };

  // Filtered lists
  const filteredLearners = (learners || []).filter(
    (l) =>
      l.name.toLowerCase().includes(learnerSearch.toLowerCase()) ||
      l.email.toLowerCase().includes(learnerSearch.toLowerCase())
  );

  const filteredChallenges = (challenges || []).filter(
    (c) =>
      c.question.toLowerCase().includes(challengeSearch.toLowerCase()) ||
      c.lessonTitle.toLowerCase().includes(challengeSearch.toLowerCase())
  );

  return (
    <div className="w-full space-y-8 pb-16">
      {/* 1. STUDIO HERO HEADER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500/15 via-amber-500/5 to-transparent border border-amber-500/30 p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-x-2.5">
              <span className="text-xs font-black uppercase tracking-wider text-amber-700 dark:text-amber-400 bg-amber-500/15 border border-amber-500/30 px-3 py-1 rounded-full flex items-center gap-x-1.5">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Admin Management Studio</span>
              </span>
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-x-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Live Convex Realtime</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Curriculum, Platform & Learner Operations
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
              Manage courses, structured units, multi-modal lessons, practice challenges, and learner accounts from a unified Lantern control plane.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-shrink-0">
            <Button
              onClick={() => handleOpenCourseModal()}
              className="rounded-2xl px-5 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs uppercase tracking-wider gap-x-2 shadow-sm"
            >
              <Plus className="h-4 w-4 stroke-[3]" />
              <span>Create New Track</span>
            </Button>
          </div>
        </div>

        {/* 2. NAVIGATION TABS */}
        <div className="flex items-center gap-2 mt-8 overflow-x-auto pb-1 no-scrollbar border-b border-amber-500/20">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-x-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${
              activeTab === "overview"
                ? "bg-slate-950 text-white dark:bg-amber-500 dark:text-slate-950 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5"
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Overview & KPIs</span>
          </button>

          <button
            onClick={() => setActiveTab("curriculum")}
            className={`flex items-center gap-x-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${
              activeTab === "curriculum"
                ? "bg-slate-950 text-white dark:bg-amber-500 dark:text-slate-950 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5"
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span>Curriculum & Tracks</span>
            {curriculum && (
              <span className="px-1.5 py-0.5 rounded-md bg-black/10 dark:bg-white/10 text-[10px]">
                {curriculum.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("learners")}
            className={`flex items-center gap-x-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${
              activeTab === "learners"
                ? "bg-slate-950 text-white dark:bg-amber-500 dark:text-slate-950 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5"
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Learners & Roles</span>
            {learners && (
              <span className="px-1.5 py-0.5 rounded-md bg-black/10 dark:bg-white/10 text-[10px]">
                {learners.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("challenges")}
            className={`flex items-center gap-x-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${
              activeTab === "challenges"
                ? "bg-slate-950 text-white dark:bg-amber-500 dark:text-slate-950 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5"
            }`}
          >
            <HelpCircle className="h-4 w-4" />
            <span>Question Bank</span>
            {challenges && (
              <span className="px-1.5 py-0.5 rounded-md bg-black/10 dark:bg-white/10 text-[10px]">
                {challenges.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* TAB 1: OVERVIEW & PLATFORM KPIS                              */}
      {/* ============================================================ */}
      {activeTab === "overview" && (
        <div className="space-y-8">
          {/* KPI Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                <span>Total Learners</span>
                <Users className="h-4 w-4 text-amber-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
                {overview?.metrics.totalLearners ?? 0}
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                {overview?.metrics.adminCount ?? 0} with Admin Privileges
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                <span>Active Tracks</span>
                <BookOpen className="h-4 w-4 text-sky-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
                {overview?.metrics.totalCourses ?? 0}
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                {overview?.metrics.totalModules ?? 0} curriculum units
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                <span>Lessons & Quizzes</span>
                <Sparkles className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
                {overview?.metrics.totalLessons ?? 0}
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                {overview?.metrics.totalChallenges ?? 0} interactive challenges
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                <span>Knowledge XP</span>
                <Zap className="h-4 w-4 text-amber-500 fill-amber-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
                {(overview?.metrics.totalXp ?? 0).toLocaleString()}
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                {(overview?.metrics.totalCreditsGranted ?? 0).toLocaleString()} total credits active
              </p>
            </div>
          </div>

          {/* Quick Track Summary & Recent Learners */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Tracks Overview */}
            <div className="lg:col-span-7 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E121B] p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
                    Curriculum Tracks Snapshot
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Overview of published learning paths and lesson depth
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("curriculum")}
                  className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-x-1"
                >
                  <span>Manage All</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="space-y-3 pt-2">
                {overview?.courses.map((c) => (
                  <div
                    key={c.id}
                    className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-x-3 min-w-0">
                      <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0 p-1.5">
                        <Image
                          src={c.imageSrc}
                          alt={c.title}
                          width={28}
                          height={28}
                          className="object-contain"
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                          {c.title}
                        </h4>
                        <div className="flex items-center gap-x-2 mt-1">
                          <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded-md">
                            {c.category}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {c.modulesCount} units • {c.lessonsCount} lessons
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span
                        className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${
                          c.isPublished
                            ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                            : "bg-slate-500/15 text-slate-500 dark:text-slate-400"
                        }`}
                      >
                        {c.isPublished ? "Published" : "Draft"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Recent Learners */}
            <div className="lg:col-span-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E121B] p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
                    Recent Learners
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Newly registered learners on Lantern
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("learners")}
                  className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-x-1"
                >
                  <span>Directory</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="space-y-3 pt-2">
                {overview?.recentUsers.map((u) => (
                  <div
                    key={u.id}
                    className="p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/40 dark:bg-slate-900/40"
                  >
                    <div className="flex items-center gap-x-3 min-w-0">
                      <div className="h-9 w-9 rounded-full overflow-hidden border border-amber-500/20 bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                        <Image
                          src={u.imageSrc}
                          alt={u.name}
                          width={36}
                          height={36}
                          className="h-full w-full object-contain"
                          unoptimized={u.imageSrc.startsWith("data:")}
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                          {u.name}
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate font-mono">
                          {u.email}
                        </p>
                      </div>
                    </div>
                    {u.isAdmin && (
                      <span className="text-[10px] font-black uppercase text-amber-600 dark:text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded-md flex-shrink-0">
                        Admin
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 2: CURRICULUM HIERARCHY BUILDER                         */}
      {/* ============================================================ */}
      {activeTab === "curriculum" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">
                Curriculum Tracks & Hierarchy
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Expand any track to view and manage its units, lessons, and interactive quiz challenges.
              </p>
            </div>
            <Button
              onClick={() => handleOpenCourseModal()}
              className="rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs uppercase tracking-wider gap-x-1.5"
            >
              <Plus className="h-4 w-4" />
              <span>Add Course Track</span>
            </Button>
          </div>

          {/* Curriculum Accordion Tree */}
          <div className="space-y-4">
            {curriculum?.map((course) => {
              const isCourseOpen = !!expandedCourses[course.id];
              return (
                <div
                  key={course.id}
                  className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E121B] shadow-xs overflow-hidden transition-all"
                >
                  {/* Course Header Bar */}
                  <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/40">
                    <div
                      onClick={() => toggleCourseExpand(course.id)}
                      className="flex items-center gap-x-3.5 min-w-0 cursor-pointer flex-1"
                    >
                      <button className="h-7 w-7 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                        {isCourseOpen ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>
                      <div className="h-12 w-12 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center p-2 flex-shrink-0">
                        <Image
                          src={course.imageSrc}
                          alt={course.title}
                          width={36}
                          height={36}
                          className="object-contain"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-x-2">
                          <h3 className="text-base font-black text-slate-900 dark:text-slate-100 truncate">
                            {course.title}
                          </h3>
                          <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded-md">
                            {course.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {course.modules.length} Units • {course.level} level
                        </p>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 flex-shrink-0 justify-end">
                      <button
                        onClick={() =>
                          toggleCoursePublished({
                            id: course.id,
                            isPublished: !course.isPublished,
                          })
                        }
                        title={course.isPublished ? "Unpublish Track" : "Publish Track"}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-x-1.5 transition-colors ${
                          course.isPublished
                            ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                            : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        {course.isPublished ? (
                          <>
                            <Eye className="h-3.5 w-3.5" />
                            <span>Published</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="h-3.5 w-3.5" />
                            <span>Draft</span>
                          </>
                        )}
                      </button>

                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleOpenModuleModal(course.id)}
                        className="rounded-xl text-xs font-bold gap-x-1"
                      >
                        <Plus className="h-3.5 w-3.5 text-amber-500" />
                        <span>Add Unit</span>
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenCourseModal(course)}
                        className="rounded-xl text-xs font-bold"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>

                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteCourse(course.id, course.title)}
                        className="rounded-xl text-xs font-bold"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>

                  {/* Expanded Modules List */}
                  {isCourseOpen && (
                    <div className="p-5 sm:p-6 space-y-4 border-t border-slate-200/80 dark:border-slate-800">
                      {course.modules.length === 0 ? (
                        <div className="py-8 text-center space-y-3">
                          <p className="text-xs text-slate-500 dark:text-slate-400">No units added to this track yet.</p>
                          <Button
                            size="sm"
                            onClick={() => handleOpenModuleModal(course.id)}
                            className="rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
                          >
                            + Add First Unit
                          </Button>
                        </div>
                      ) : (
                        course.modules.map((mod, modIdx) => {
                          const isModOpen = !!expandedModules[mod.id];
                          return (
                            <div
                              key={mod.id}
                              className="rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-slate-50/30 dark:bg-slate-900/20 overflow-hidden"
                            >
                              {/* Module Bar */}
                              <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div
                                  onClick={() => toggleModuleExpand(mod.id)}
                                  className="flex items-center gap-x-3 cursor-pointer flex-1 min-w-0"
                                >
                                  <button className="h-6 w-6 rounded-md bg-black/5 dark:bg-white/5 flex items-center justify-center text-slate-500 dark:text-slate-400">
                                    {isModOpen ? (
                                      <ChevronDown className="h-3.5 w-3.5" />
                                    ) : (
                                      <ChevronRight className="h-3.5 w-3.5" />
                                    )}
                                  </button>
                                  <span className="font-mono text-xs font-black text-amber-600 dark:text-amber-400">
                                    Unit {modIdx + 1}
                                  </span>
                                  <span className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                                    {mod.title}
                                  </span>
                                  <span className="text-xs text-slate-400">
                                    ({mod.lessons.length} lessons)
                                  </span>
                                </div>

                                <div className="flex items-center gap-2 flex-shrink-0">
                                  <Button
                                    variant="default"
                                    size="sm"
                                    onClick={() => handleOpenLessonModal(mod.id)}
                                    className="rounded-xl text-xs font-bold gap-x-1 h-8"
                                  >
                                    <Plus className="h-3.5 w-3.5 text-amber-500" />
                                    <span>Add Lesson</span>
                                  </Button>
                                  <button
                                    onClick={() => handleDeleteModule(mod.id, mod.title)}
                                    className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg transition-colors"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </div>

                              {/* Expanded Lessons List inside Module */}
                              {isModOpen && (
                                <div className="px-4 pb-4 pt-1 space-y-2 border-t border-slate-200/60 dark:border-slate-800/60">
                                  {mod.lessons.length === 0 ? (
                                    <p className="text-xs text-slate-400 py-3 text-center">
                                      No lessons inside this unit yet.
                                    </p>
                                  ) : (
                                    mod.lessons.map((les, lesIdx) => (
                                      <div
                                        key={les.id}
                                        className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between gap-3"
                                      >
                                        <div className="flex items-center gap-x-3 min-w-0">
                                          <div className="h-7 w-7 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center flex-shrink-0 text-xs font-bold">
                                            {les.type === "video" && <Video className="h-3.5 w-3.5" />}
                                            {les.type === "article" && <FileText className="h-3.5 w-3.5" />}
                                            {les.type === "quiz" && <QuizIcon className="h-3.5 w-3.5" />}
                                            {les.type === "practice" && <Sparkles className="h-3.5 w-3.5" />}
                                          </div>
                                          <div className="min-w-0">
                                            <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                                              {lesIdx + 1}. {les.title}
                                            </p>
                                            <p className="text-[10px] text-slate-400">
                                              {les.type.toUpperCase()} • ~{les.estimatedMinutes} mins • {les.challengesCount} questions
                                            </p>
                                          </div>
                                        </div>

                                        <div className="flex items-center gap-1.5 flex-shrink-0">
                                          <Link
                                            href={`/lesson/${les.id}`}
                                            target="_blank"
                                            className="p-1.5 text-slate-400 hover:text-amber-500 rounded-lg"
                                            title="Preview Live Lesson"
                                          >
                                            <ExternalLink className="h-3.5 w-3.5" />
                                          </Link>
                                          <button
                                            onClick={() => handleOpenChallengeModal(les.id)}
                                            className="px-2.5 py-1 text-[11px] font-bold text-amber-600 bg-amber-500/15 hover:bg-amber-500/25 rounded-lg transition-colors"
                                          >
                                            + Quiz Q
                                          </button>
                                          <button
                                            onClick={() => handleDeleteLesson(les.id, les.title)}
                                            className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg transition-colors"
                                          >
                                            <Trash2 className="h-3.5 w-3.5" />
                                          </button>
                                        </div>
                                      </div>
                                    ))
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 3: LEARNERS & ROLES DIRECTORY                           */}
      {/* ============================================================ */}
      {activeTab === "learners" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">
                Learner Roster & Role Permissions
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Manage registered user accounts, grant administrator privileges, or top-up learner credit balances.
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={learnerSearch}
                onChange={(e) => setLearnerSearch(e.target.value)}
                placeholder="Search name or email..."
                className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E121B] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <th className="py-3.5 px-5">Learner Profile</th>
                    <th className="py-3.5 px-4">Role</th>
                    <th className="py-3.5 px-4">Knowledge XP</th>
                    <th className="py-3.5 px-4">Credit Balance</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800">
                  {filteredLearners.map((learner) => (
                    <tr
                      key={learner.id}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-900/30 transition-colors"
                    >
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-x-3">
                          <div className="h-9 w-9 rounded-full overflow-hidden border border-amber-500/25 bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                            <Image
                              src={learner.imageSrc}
                              alt={learner.name}
                              width={36}
                              height={36}
                              className="h-full w-full object-contain"
                              unoptimized={learner.imageSrc.startsWith("data:")}
                            />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-slate-100">
                              {learner.name}
                            </p>
                            <p className="text-[11px] text-slate-400 font-mono">
                              {learner.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-x-1 px-2.5 py-0.5 rounded-full font-black text-[10px] uppercase tracking-wider ${
                            learner.isAdmin
                              ? "bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                          }`}
                        >
                          {learner.isAdmin ? (
                            <>
                              <ShieldCheck className="h-3 w-3" /> Admin
                            </>
                          ) : (
                            "Learner"
                          )}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-200">
                        <div className="flex items-center gap-x-1 text-amber-600 dark:text-amber-400">
                          <Zap className="h-3.5 w-3.5 fill-current" />
                          <span>{learner.points.toLocaleString()} XP</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-200">
                        <div className="flex items-center gap-x-1">
                          <Coins className="h-3.5 w-3.5 text-amber-500" />
                          <span>{learner.credits} Cr</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() =>
                              setCreditModalUser({ id: learner.id, name: learner.name })
                            }
                            className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-amber-700 dark:text-amber-400 bg-amber-500/15 hover:bg-amber-500/25 transition-colors"
                          >
                            + Credits
                          </button>
                          <button
                            onClick={() =>
                              handleToggleAdminRole(learner.id, learner.isAdmin, learner.name)
                            }
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                              learner.isAdmin
                                ? "text-rose-600 bg-rose-50 hover:bg-rose-100 dark:hover:bg-rose-950/40 dark:bg-rose-950/30"
                                : "text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
                            }`}
                          >
                            {learner.isAdmin ? "Revoke Admin" : "Make Admin"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 4: QUESTION & CHALLENGE BANK                            */}
      {/* ============================================================ */}
      {activeTab === "challenges" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">
                Interactive Challenge & Quiz Bank
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Browse questions, answer options, and evaluation criteria across all lessons.
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={challengeSearch}
                onChange={(e) => setChallengeSearch(e.target.value)}
                placeholder="Search questions..."
                className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredChallenges.map((ch) => (
              <div
                key={ch.id}
                className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E121B] shadow-xs space-y-3.5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded-md">
                      {ch.type}
                    </span>
                    <span className="text-xs text-slate-400 truncate max-w-[200px]">
                      {ch.lessonTitle}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {ch.question}
                  </h4>
                </div>

                {/* Options list */}
                <div className="space-y-1.5 pt-1">
                  {ch.options.map((opt) => (
                    <div
                      key={opt.id}
                      className={`px-3 py-2 rounded-xl text-xs flex items-center justify-between border ${
                        opt.correct
                          ? "border-emerald-500/40 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 font-bold"
                          : "border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      <span>{opt.text}</span>
                      {opt.correct && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />}
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-end">
                  <button
                    onClick={() => handleDeleteChallenge(ch.id)}
                    className="text-xs text-rose-500 hover:text-rose-600 font-bold flex items-center gap-x-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete Question</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 1: CREATE / EDIT COURSE TRACK                          */}
      {/* ============================================================ */}
      {isCourseModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#0E121B] border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-5 shadow-2xl animate-in fade-in-50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">
                {editingCourseId ? "Edit Course Track" : "Create New Track"}
              </h3>
              <button
                onClick={() => setIsCourseModalOpen(false)}
                className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Course Title
                </label>
                <input
                  type="text"
                  required
                  value={courseForm.title}
                  onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                  placeholder="e.g. Distributed Systems & Microservices"
                  className="w-full mt-1.5 px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Category Tag
                  </label>
                  <select
                    value={courseForm.category}
                    onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
                    className="w-full mt-1.5 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-bold uppercase text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="engineering">ENGINEERING</option>
                    <option value="ai">AI</option>
                    <option value="business">BUSINESS</option>
                    <option value="cloud">CLOUD</option>
                    <option value="design">DESIGN</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Difficulty Level
                  </label>
                  <select
                    value={courseForm.level}
                    onChange={(e) => setCourseForm({ ...courseForm, level: e.target.value as any })}
                    className="w-full mt-1.5 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Track Vector Cover
                </label>
                <select
                  value={courseForm.imageSrc}
                  onChange={(e) => setCourseForm({ ...courseForm, imageSrc: e.target.value })}
                  className="w-full mt-1.5 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-500"
                >
                  <option value="/track_engineering.svg">Engineering / Terminal</option>
                  <option value="/track_ai.svg">Artificial Intelligence</option>
                  <option value="/track_business.svg">Business & Strategy</option>
                  <option value="/track_cloud.svg">Cloud Architecture</option>
                  <option value="/track_design.svg">Product Design</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                  placeholder="Comprehensive learning track covering core concepts..."
                  className="w-full mt-1.5 px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsCourseModalOpen(false)}
                  className="rounded-xl text-xs font-bold"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs uppercase tracking-wider px-5"
                >
                  {editingCourseId ? "Update Track" : "Create Track"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 2: CREATE MODULE (UNIT)                                */}
      {/* ============================================================ */}
      {isModuleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#0E121B] border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
              Add New Unit to Track
            </h3>

            <form onSubmit={handleSaveModule} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Unit Title
                </label>
                <input
                  type="text"
                  required
                  value={moduleForm.title}
                  onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })}
                  placeholder="e.g. Unit 1: Foundations of System Architecture"
                  className="w-full mt-1.5 px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-bold focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={moduleForm.description}
                  onChange={(e) => setModuleForm({ ...moduleForm, description: e.target.value })}
                  placeholder="Key concepts and fundamental building blocks..."
                  className="w-full mt-1.5 px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsModuleModalOpen(false)}
                  className="rounded-xl text-xs font-bold"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs uppercase tracking-wider"
                >
                  Create Unit
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 3: CREATE LESSON                                       */}
      {/* ============================================================ */}
      {isLessonModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#0E121B] border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
              Add Lesson to Unit
            </h3>

            <form onSubmit={handleSaveLesson} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Lesson Title
                </label>
                <input
                  type="text"
                  required
                  value={lessonForm.title}
                  onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                  placeholder="e.g. Masterclass: Event-Driven Microservices"
                  className="w-full mt-1.5 px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-bold focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Lesson Format
                  </label>
                  <select
                    value={lessonForm.type}
                    onChange={(e) => setLessonForm({ ...lessonForm, type: e.target.value as any })}
                    className="w-full mt-1.5 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-bold focus:outline-none focus:border-amber-500"
                  >
                    <option value="quiz">Interactive Quiz</option>
                    <option value="video">Video Masterclass</option>
                    <option value="article">Technical Article</option>
                    <option value="practice">Hands-On Practice</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Est. Duration (Mins)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={120}
                    value={lessonForm.estimatedMinutes}
                    onChange={(e) =>
                      setLessonForm({ ...lessonForm, estimatedMinutes: Number(e.target.value) })
                    }
                    className="w-full mt-1.5 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {lessonForm.type === "video" && (
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Video Stream / Embed URL
                  </label>
                  <input
                    type="url"
                    value={lessonForm.videoUrl}
                    onChange={(e) => setLessonForm({ ...lessonForm, videoUrl: e.target.value })}
                    placeholder="https://www.youtube.com/embed/... or CDN URL"
                    className="w-full mt-1.5 px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Study Guide / Markdown Overview
                </label>
                <textarea
                  rows={3}
                  value={lessonForm.markdown}
                  onChange={(e) => setLessonForm({ ...lessonForm, markdown: e.target.value })}
                  placeholder="Core takeaways and theoretical concepts..."
                  className="w-full mt-1.5 px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsLessonModalOpen(false)}
                  className="rounded-xl text-xs font-bold"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs uppercase tracking-wider"
                >
                  Create Lesson
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 4: CREATE CHALLENGE / QUIZ QUESTION                   */}
      {/* ============================================================ */}
      {isChallengeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#0E121B] border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
              Add Quiz Challenge Question
            </h3>

            <form onSubmit={handleSaveChallenge} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Question Prompt
                </label>
                <input
                  type="text"
                  required
                  value={challengeForm.question}
                  onChange={(e) =>
                    setChallengeForm({ ...challengeForm, question: e.target.value })
                  }
                  placeholder="e.g. Which hook triggers after every DOM mutation?"
                  className="w-full mt-1.5 px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-bold focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center justify-between">
                  <span>Answer Options (Check correct answer)</span>
                </label>

                {challengeForm.options.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correctOption"
                      checked={opt.correct}
                      onChange={() => {
                        const newOptions = challengeForm.options.map((o, i) => ({
                          ...o,
                          correct: i === idx,
                        }));
                        setChallengeForm({ ...challengeForm, options: newOptions });
                      }}
                      className="h-4 w-4 text-amber-500 focus:ring-amber-500 accent-amber-500"
                    />
                    <input
                      type="text"
                      value={opt.text}
                      onChange={(e) => {
                        const newOptions = [...challengeForm.options];
                        newOptions[idx].text = e.target.value;
                        setChallengeForm({ ...challengeForm, options: newOptions });
                      }}
                      placeholder={`Option ${idx + 1}`}
                      className="flex-1 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsChallengeModalOpen(false)}
                  className="rounded-xl text-xs font-bold"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs uppercase tracking-wider"
                >
                  Save Question
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 5: GRANT CREDITS TO LEARNER                           */}
      {/* ============================================================ */}
      {creditModalUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-[#0E121B] border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
              Grant Credits: {creditModalUser.name}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select credit amount or type custom quantity to add to learner balance.
            </p>

            <div className="grid grid-cols-3 gap-2">
              {[50, 100, 250, 500, 1000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setCreditAmount(amt)}
                  className={`py-2 rounded-xl text-xs font-black transition-all border ${
                    creditAmount === amt
                      ? "bg-amber-500 text-slate-950 border-amber-500 shadow-xs"
                      : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  +{amt} Cr
                </button>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="ghost"
                onClick={() => setCreditModalUser(null)}
                className="rounded-xl text-xs font-bold"
              >
                Cancel
              </Button>
              <Button
                onClick={handleGrantCredits}
                className="rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs uppercase tracking-wider"
              >
                Grant {creditAmount} Credits
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
