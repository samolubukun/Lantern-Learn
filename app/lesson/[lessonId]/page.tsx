"use client";

import { redirect } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Loader2 } from "lucide-react";

import { Quiz } from "../quiz";
import { ArticleLesson } from "../article-lesson";
import { useAuth } from "@/providers/auth-provider";

type Props = {
  params: {
    lessonId: string;
  };
};

const LessonIdPage = ({ params }: Props) => {
  const { token } = useAuth();
  const lesson = useQuery(api.lessons.getLesson, {
    lessonId: params.lessonId as Id<"lessons">,
    token: token || undefined,
  });
  const userProgress = useQuery(api.userProgress.getUserProgress, token ? { token } : {});
  const userSubscription = useQuery(api.userSubscription.getUserSubscription, token ? { token } : {});

  if (lesson === undefined || userProgress === undefined) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
      </div>
    );
  }

  if (!lesson || !userProgress) {
    redirect("/learn");
  }

  if (lesson.type === "article" || lesson.type === "video") {
    return (
      <ArticleLesson
        lessonId={lesson._id}
        title={lesson.title}
        markdown={lesson.content?.markdown}
        videoUrl={lesson.content?.videoUrl}
        audioUrl={lesson.content?.audioUrl}
        resources={lesson.content?.resources}
        estimatedMinutes={lesson.estimatedMinutes}
        initialCompleted={lesson.completed}
        nextLessonId={lesson.nextLessonId}
        prevLessonId={lesson.prevLessonId}
      />
    );
  }

  const initialPercentage =
    lesson.challenges && lesson.challenges.length > 0
      ? (lesson.challenges.filter((c) => c.completed).length /
          lesson.challenges.length) *
        100
      : 0;

  const isPro = userProgress.isPro || !!userSubscription?.isActive;

  return (
    <Quiz
      initialLessonId={lesson._id}
      initialLessonChallenges={lesson.challenges || []}
      initialHearts={userProgress.hearts}
      initialPercentage={initialPercentage}
      userSubscription={isPro ? { isActive: true } : (userSubscription ?? null)}
    />
  );
};

export default LessonIdPage;
