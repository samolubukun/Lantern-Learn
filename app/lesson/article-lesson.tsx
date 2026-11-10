"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import {
  BookOpen,
  CheckCircle,
  FileText,
  ArrowLeft,
  Save,
  ChevronRight,
  ChevronLeft,
  Headphones,
  Paperclip,
  ExternalLink,
  FileDown,
  Github,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import { useAuth } from "@/providers/auth-provider";
import { MarkdownRenderer } from "@/components/markdown-renderer";

type ResourceItem = {
  title: string;
  url: string;
  type: string; // "pdf" | "link" | "github" | "doc"
};

type Props = {
  lessonId: string;
  title: string;
  markdown?: string;
  videoUrl?: string;
  audioUrl?: string;
  resources?: ResourceItem[];
  estimatedMinutes?: number;
  initialCompleted?: boolean;
  nextLessonId?: string | null;
  prevLessonId?: string | null;
};

function resolveVideoMedia(url?: string): { isDirectVideo: boolean; embedUrl?: string } {
  if (!url) return { isDirectVideo: false };

  // Direct MP4 / WebM / OGG video file
  if (url.match(/\.(mp4|webm|ogg)(\?.*)?$/i)) {
    return { isDirectVideo: true, embedUrl: url };
  }

  // YouTube standard / shorts / share URL
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([\w-]{11})/);
  if (ytMatch && ytMatch[1]) {
    return {
      isDirectVideo: false,
      embedUrl: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?rel=0&modestbranding=1`,
    };
  }

  // Vimeo URL
  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      isDirectVideo: false,
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
    };
  }

  return { isDirectVideo: false, embedUrl: url };
}

export const ArticleLesson = ({
  lessonId,
  title,
  markdown,
  videoUrl,
  audioUrl,
  resources,
  estimatedMinutes,
  initialCompleted,
  nextLessonId,
  prevLessonId,
}: Props) => {
  const router = useRouter();
  const { token } = useAuth();
  const { width, height } = useWindowSize();
  const [completed, setCompleted] = useState(!!initialCompleted);
  const [showConfetti, setShowConfetti] = useState(false);
  const [activeTab, setActiveTab] = useState<"content" | "notes">("content");

  const completeLessonMutation = useMutation(api.lessons.completeLesson);
  const saveNoteMutation = useMutation(api.notes.saveNote);
  const existingNote = useQuery(api.notes.getNote, {
    lessonId: lessonId as Id<"lessons">,
    token: token || undefined,
  });

  const [noteContent, setNoteContent] = useState<string | null>(null);
  const currentNote = noteContent !== null ? noteContent : existingNote?.content || "";

  const onComplete = async () => {
    try {
      await completeLessonMutation({
        lessonId: lessonId as Id<"lessons">,
        token: token || undefined,
      });
      setCompleted(true);
      setShowConfetti(true);
      toast.success("Lesson completed! You earned 15 XP!");
    } catch {
      toast.error("Failed to mark lesson completed");
    }
  };

  const onSaveNote = async () => {
    try {
      await saveNoteMutation({
        lessonId: lessonId as Id<"lessons">,
        content: currentNote,
        token: token || undefined,
      });
      toast.success("Notes saved to your Lantern Notebook!");
    } catch {
      toast.error("Failed to save note");
    }
  };

  const videoMedia = resolveVideoMedia(videoUrl);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900/60">
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={400}
        />
      )}

      {/* Top Navigation */}
      <header className="h-16 border-b bg-white dark:bg-slate-900 px-3 sm:px-6 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-x-2 sm:gap-x-3 min-w-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/learn")}
            className="px-2 sm:px-3 flex-shrink-0"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-1" />
            <span className="hidden xs:inline">Back</span>
          </Button>
          <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-700 flex-shrink-0" />
          <div className="flex items-center gap-x-2 min-w-0">
            {videoUrl ? (
              <Video className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500 flex-shrink-0" />
            ) : (
              <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500 flex-shrink-0" />
            )}
            <h1 className="font-bold text-neutral-800 dark:text-slate-100 text-sm sm:text-base md:text-lg truncate max-w-[120px] xs:max-w-[200px] sm:max-w-md">
              {title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-x-2 sm:gap-x-3 flex-shrink-0">
          {estimatedMinutes && (
            <span className="text-xs text-muted-foreground hidden sm:inline">
              Est. {estimatedMinutes} mins
            </span>
          )}
          {completed ? (
            <div className="flex items-center gap-x-1.5 text-amber-600 font-bold text-xs sm:text-sm bg-amber-50 dark:bg-amber-950/30 px-2.5 sm:px-3 py-1.5 rounded-full border border-amber-200 dark:border-amber-900/60">
              <CheckCircle className="h-4 w-4" />
              <span>Completed</span>
            </div>
          ) : (
            <Button
              onClick={onComplete}
              variant="secondary"
              size="sm"
              className="font-bold text-xs"
            >
              <span className="hidden sm:inline">Complete & Earn 15 XP</span>
              <span className="sm:hidden">Complete +15 XP</span>
            </Button>
          )}
        </div>
      </header>

      {/* Main Body */}
      <div className="max-w-4xl mx-auto w-full flex-1 p-3.5 sm:p-6 md:p-10">
        {/* Tab selection */}
        <div className="flex gap-x-3 mb-6 border-b pb-2">
          <button
            onClick={() => setActiveTab("content")}
            className={`flex items-center gap-x-2 pb-2 px-1 text-sm font-bold border-b-2 transition-all ${activeTab === "content"
                ? "border-amber-500 text-amber-600"
                : "border-transparent text-neutral-500 dark:text-slate-400 hover:text-neutral-800 dark:hover:text-slate-100"
              }`}
          >
            <BookOpen className="h-4 w-4" /> Lesson Content
          </button>
          <button
            onClick={() => setActiveTab("notes")}
            className={`flex items-center gap-x-2 pb-2 px-1 text-sm font-bold border-b-2 transition-all ${activeTab === "notes"
                ? "border-amber-500 text-amber-600"
                : "border-transparent text-neutral-500 dark:text-slate-400 hover:text-neutral-800 dark:hover:text-slate-100"
              }`}
          >
            <FileText className="h-4 w-4" /> My Study Notes
          </button>
        </div>

        {activeTab === "content" ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border p-4 sm:p-8 shadow-sm">
            {/* Embedded Video Player */}
            {videoMedia.embedUrl && (
              <div className="aspect-video w-full mb-8 rounded-xl overflow-hidden bg-black shadow-md">
                {videoMedia.isDirectVideo ? (
                  <video controls className="w-full h-full">
                    <source src={videoMedia.embedUrl} />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <iframe
                    src={videoMedia.embedUrl}
                    title={title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )}
              </div>
            )}

            {/* Embedded Audio Player */}
            {audioUrl && (
              <div className="mb-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 flex flex-col gap-y-2">
                <div className="flex items-center gap-x-2 text-amber-900 dark:text-amber-200 text-sm font-semibold">
                  <Headphones className="h-4 w-4 text-amber-600" />
                  Spoken Lecture & Audio Guide
                </div>
                <audio controls className="w-full">
                  <source src={audioUrl} />
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}

            {/* Markdown Text Reader */}
            <div className="pt-2">
              <MarkdownRenderer content={markdown} />
            </div>

            {/* Downloadable Resources & Links */}
            {resources && resources.length > 0 && (
              <div className="mt-8 pt-6 border-t">
                <h3 className="font-bold text-neutral-800 dark:text-slate-100 text-sm mb-3 flex items-center gap-x-2">
                  <Paperclip className="h-4 w-4 text-amber-500" />
                  Downloadable Resources & References
                </h3>
                <div className="flex flex-wrap gap-2">
                  {resources.map((res, i) => (
                    <a
                      key={i}
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-x-2 px-3 py-1.5 rounded-lg border bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-neutral-700 dark:text-slate-200 transition"
                    >
                      {res.type === "github" ? (
                        <Github className="h-3.5 w-3.5 text-neutral-800 dark:text-slate-100" />
                      ) : res.type === "pdf" ? (
                        <FileDown className="h-3.5 w-3.5 text-rose-500" />
                      ) : (
                        <ExternalLink className="h-3.5 w-3.5 text-emerald-600" />
                      )}
                      {res.title}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation & Progression */}
            <div className="mt-10 pt-6 border-t flex items-center justify-between">
              {prevLessonId ? (
                <Button
                  onClick={() => router.push(`/lesson/${prevLessonId}`)}
                  variant="ghost"
                  size="sm"
                  className="gap-x-1 text-muted-foreground"
                >
                  <ChevronLeft className="h-4 w-4" /> Previous
                </Button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-x-3">
                {!completed ? (
                  <Button onClick={onComplete} variant="secondary" size="lg">
                    Mark as Complete
                  </Button>
                ) : nextLessonId ? (
                  <Button
                    onClick={() => router.push(`/lesson/${nextLessonId}`)}
                    variant="secondary"
                    size="lg"
                    className="gap-x-1"
                  >
                    Next Lesson <ChevronRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={() => router.push("/learn")}
                    variant="primary"
                    size="lg"
                  >
                    Return to Track
                  </Button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-neutral-800 dark:text-slate-100">Lesson Notebook</h2>
                <p className="text-xs text-muted-foreground">
                  Take notes as you learn. Saved automatically to your personal profile.
                </p>
              </div>
              <Button onClick={onSaveNote} size="sm" variant="ghost" className="gap-x-1">
                <Save className="h-4 w-4" /> Save
              </Button>
            </div>
            <textarea
              value={currentNote}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Write your key takeaways, questions, or architecture notes here..."
              className="w-full h-80 p-4 border rounded-xl font-mono text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>
        )}
      </div>
    </div>
  );
};
