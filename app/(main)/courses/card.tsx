import Image from "next/image";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  id: string;
  imageSrc: string;
  onClick: (id: string) => void;
  disabled?: boolean;
  active?: boolean;
  category?: string;
  level?: string;
};

export const Card = ({
  title,
  id,
  imageSrc,
  disabled,
  onClick,
  active,
  category,
  level,
}: Props) => {
  return (
    <div
      onClick={() => onClick(id)}
      className={cn(
        "h-full w-full min-w-0 border-2 rounded-xl border-b-4 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer active:border-b-2 flex flex-col items-center justify-between p-3 pb-5 min-h-[200px] transition-all relative",
        disabled && "pointer-events-none opacity-50"
      )}
    >
      <div className="w-full flex items-center justify-between min-h-[24px]">
        {level && (
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {level}
          </span>
        )}
        {active && (
          <div className="rounded-md bg-amber-500 flex items-center justify-center p-1.5 ml-auto shadow-sm">
            <Check className="text-white stroke-[4] h-4 w-4" />
          </div>
        )}
      </div>
      <div className="my-2 flex items-center justify-center">
        <Image
          src={imageSrc}
          alt={title}
          height={70}
          width={93.33}
          className="rounded-lg drop-shadow-md border object-cover"
        />
      </div>
      <div className="text-center w-full">
        <p className="text-neutral-700 dark:text-slate-200 font-bold">
          {title}
        </p>
        {category && (
          <p className="text-xs text-neutral-400 capitalize mt-0.5">
            {category}
          </p>
        )}
      </div>
    </div>
  );
};
