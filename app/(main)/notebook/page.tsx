"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import {
  BookMarked,
  Search,
  ExternalLink,
  Save,
  BookOpen,
  Calendar,
  Loader2,
} from "lucide-react";

import { FeedWrapper } from "@/components/feed-wrapper";
import { UserProgress } from "@/components/user-progress";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { Promo } from "@/components/promo";
import { Quests } from "@/components/quests";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";

const NotebookPage = () => {
  const { token } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState("");

  const userProgress = useQuery(api.userProgress.getUserProgress, token ? { token } : {});
  const userSubscription = useQuery(api.userSubscription.getUserSubscription, token ? { token } : {});
  const notes = useQuery(api.notes.getAllUserNotes, token ? { token } : {});
  const saveNoteMutation = useMutation(api.notes.saveNote);

  if (userProgress === undefined || notes === undefined) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
      </div>
    );
  }

  const isPro = userProgress?.isPro || !!userSubscription?.isActive;

  const filteredNotes = notes.filter((n) => {
    const q = searchQuery.toLowerCase();
    return (
      n.content.toLowerCase().includes(q) ||
      n.lessonTitle.toLowerCase().includes(q) ||
      n.courseTitle.toLowerCase().includes(q) ||
      n.moduleTitle.toLowerCase().includes(q)
    );
  });

  const onStartEdit = (noteId: string, currentContent: string) => {
    setEditingNoteId(noteId);
    setEditedContent(currentContent);
  };

  const onSaveEdit = async (lessonId: Id<"lessons">) => {
    try {
      await saveNoteMutation({
        lessonId,
        content: editedContent,
        token: token || undefined,
      });
      setEditingNoteId(null);
      toast.success("Note updated successfully!");
    } catch {
      toast.error("Failed to update note");
    }
  };

  return (
    <div className="flex flex-col xl:flex-row-reverse gap-6 xl:gap-8 w-full min-w-0">
      <StickyWrapper>
        {userProgress?.activeCourse && (
          <UserProgress
            activeCourse={userProgress.activeCourse}
            hearts={userProgress.hearts}
            points={userProgress.points}
            credits={userProgress.credits}
            hasActiveSubscription={isPro}
          />
        )}
        {!isPro && <Promo />}
        {userProgress && <Quests points={userProgress.points} />}
      </StickyWrapper>

      <FeedWrapper>
        <div className="w-full space-y-6 pb-12">
          {/* Header */}
          <div className="border-b pb-4">
            <div className="flex items-center gap-x-3">
              <div className="p-3 bg-amber-500 rounded-2xl text-white shadow-sm">
                <BookMarked className="h-7 w-7" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-neutral-800 dark:text-slate-100">
                  Learner Notebook
                </h1>
                <p className="text-muted-foreground text-sm">
                  Review and organize notes captured during your lessons and masterclasses.
                </p>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative mt-5">
              <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes by keyword, lesson, or course..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
              />
            </div>
          </div>

          {/* Notes List */}
          {filteredNotes.length === 0 ? (
            <div className="text-center py-16 px-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border-2 border-dashed">
              <BookOpen className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-lg font-bold text-neutral-700 dark:text-slate-200">No notes found</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto mt-1 mb-5">
                {searchQuery
                  ? "No notes matched your search criteria."
                  : "You haven't saved any study notes yet. Open any reading lesson or masterclass to capture key takeaways!"}
              </p>
              <Button asChild variant="secondary" size="sm">
                <Link href="/learn">Go to Lessons</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredNotes.map((note) => {
                const isEditing = editingNoteId === note._id;
                const formattedDate = new Date(note.updatedAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });

                return (
                  <div
                    key={note._id}
                    className="border-2 rounded-2xl p-5 hover:border-amber-300 dark:hover:border-amber-700 transition-all bg-white dark:bg-slate-900 shadow-xs space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-x-2">
                        {note.courseTitle && (
                          <span className="text-[11px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-2.5 py-0.5 rounded-full">
                            {note.courseTitle}
                          </span>
                        )}
                        <h4 className="font-bold text-neutral-800 dark:text-slate-100 text-base">
                          {note.lessonTitle}
                        </h4>
                      </div>
                      <div className="flex items-center gap-x-2">
                        <span className="text-xs text-muted-foreground flex items-center gap-x-1">
                          <Calendar className="h-3 w-3" /> {formattedDate}
                        </span>
                        <Button
                          asChild
                          variant="ghost"
                          size="sm"
                          className="text-xs text-neutral-600 dark:text-slate-300 gap-x-1 h-8 px-2"
                        >
                          <Link href={`/lesson/${note.lessonId}`}>
                            <ExternalLink className="h-3.5 w-3.5" /> Open Lesson
                          </Link>
                        </Button>
                      </div>
                    </div>

                    {isEditing ? (
                      <div className="space-y-2 pt-1">
                        <textarea
                          value={editedContent}
                          onChange={(e) => setEditedContent(e.target.value)}
                          className="w-full h-32 p-3 text-sm font-mono border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                        />
                        <div className="flex justify-end gap-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingNoteId(null)}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => onSaveEdit(note.lessonId)}
                            className="gap-x-1 font-bold"
                          >
                            <Save className="h-4 w-4" /> Save
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => onStartEdit(note._id, note.content)}
                        className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-neutral-700 dark:text-slate-200 text-sm whitespace-pre-wrap font-sans cursor-pointer hover:bg-slate-100/70 dark:hover:bg-slate-800/70 transition-colors"
                        title="Click to edit note"
                      >
                        {note.content}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </FeedWrapper>
    </div>
  );
};

export default NotebookPage;

