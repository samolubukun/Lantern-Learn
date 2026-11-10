"use client";

import { toast } from "sonner";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useAuth } from "@/providers/auth-provider";

import { Card } from "./card";

type CourseItem = {
  _id: Id<"courses">;
  title: string;
  imageSrc: string;
  category: string;
  level: "beginner" | "intermediate" | "advanced";
  description?: string;
};

type Props = {
  courses: CourseItem[];
  activeCourseId?: string;
};

export const List = ({ courses, activeCourseId }: Props) => {
  const router = useRouter();
  const { token } = useAuth();
  const [pending, startTransition] = useTransition();
  const upsertUserProgress = useMutation(api.userProgress.upsertUserProgress);

  const onClick = (id: string) => {
    if (pending) return;

    if (id === activeCourseId) {
      return router.push("/learn");
    }

    startTransition(async () => {
      try {
        await upsertUserProgress({
          courseId: id as Id<"courses">,
          token: token || undefined,
        });
        router.push("/learn");
      } catch (error) {
        toast.error("Failed to select course. Please ensure you are logged in.");
      }
    });
  };

  return (
    <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-4">
      {courses.map((course) => (
        <Card
          key={course._id}
          id={course._id}
          title={course.title}
          imageSrc={course.imageSrc}
          category={course.category}
          level={course.level}
          onClick={onClick}
          disabled={pending}
          active={course._id === activeCourseId}
        />
      ))}
    </div>
  );
};
