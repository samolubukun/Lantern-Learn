"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader2, Search } from "lucide-react";

import { List } from "./list";
import { useAuth } from "@/providers/auth-provider";

const CoursesPage = () => {
  const { token } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const courses = useQuery(api.courses.getCourses, {});
  const userProgress = useQuery(api.userProgress.getUserProgress, token ? { token } : {});

  if (courses === undefined) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
      </div>
    );
  }

  const categories = [
    { id: "all", label: "All Tracks" },
    { id: "engineering", label: "Full-Stack & Web" },
    { id: "ai", label: "AI & LLMs" },
    { id: "business", label: "Business & Startups" },
    { id: "cloud", label: "Cloud & Systems" },
    { id: "design", label: "Product & UX" },
  ];

  const filteredCourses = courses.filter((c) => {
    const matchesCategory =
      selectedCategory === "all" || c.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      c.title.toLowerCase().includes(q) ||
      (c.description && c.description.toLowerCase().includes(q)) ||
      (c.tags && c.tags.some((tag) => tag.toLowerCase().includes(q)));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="h-full max-w-[912px] px-3 mx-auto pb-10">
      <div className="pt-2">
        <h1 className="text-2xl font-bold text-neutral-700 dark:text-slate-200">
          Lantern Course Catalog & Tracks
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Explore interactive engineering tracks, AI masterclasses, and modern skill accelerators.
        </p>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="mt-5 space-y-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tracks by skill, title, or topic (e.g. Next.js, AI, SaaS, Cloud, Design)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 border-b pb-3 pt-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition-colors ${selectedCategory === cat.id
                  ? "bg-amber-500 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-neutral-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
            >
              {cat.label}
            </button>
          ))}
          <span className="ml-auto text-xs text-muted-foreground">
            {filteredCourses.length} {filteredCourses.length === 1 ? "track" : "tracks"} available
          </span>
        </div>
      </div>

      <List
        courses={filteredCourses}
        activeCourseId={userProgress?.activeCourseId}
      />
    </div>
  );
};

export default CoursesPage;
