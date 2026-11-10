import Image from "next/image";
import { Sparkles } from "lucide-react";

type Props = {
  question: string;
};

export const QuestionBubble = ({ question }: Props) => {
  return (
    <div className="flex items-center gap-x-4 mb-6 p-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200/90 dark:border-slate-800/90 shadow-sm">
      <div className="relative shrink-0 p-2 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/50 shadow-xs">
        <Image
          src="/mascot.svg"
          alt="Lantern"
          height={48}
          width={48}
          className="h-10 w-10 lg:h-12 lg:w-12"
        />
      </div>
      <div className="space-y-1 flex-1">
        <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-amber-600">
          <Sparkles className="h-3 w-3" /> Knowledge Check
        </div>
        <p className="text-sm lg:text-base font-bold text-neutral-800 dark:text-slate-100 leading-snug">
          {question}
        </p>
      </div>
    </div>
  );
};
