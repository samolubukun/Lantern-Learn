import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  title: string;
};

export const Header = ({ title }: Props) => {
  return (
    <div className="sticky top-0 bg-white/80 dark:bg-[#0A0D14]/80 backdrop-blur-md pb-3 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 mb-5 text-slate-800 dark:text-slate-100 z-20">
      <Link href="/courses">
        <Button variant="ghost" size="sm" className="gap-x-2 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
          <ArrowLeft className="h-4 w-4 stroke-[2.5]" />
          <span>Courses</span>
        </Button>
      </Link>
      <h1 className="font-black text-base sm:text-lg truncate max-w-md">
        {title}
      </h1>
      <div className="w-16" />
    </div>
  );
};
