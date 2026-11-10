import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
  value: number;
  variant: "points" | "hearts";
};

export const ResultCard = ({ value, variant }: Props) => {
  const imageSrc = variant === "hearts" ? "/heart.svg" : "/points.svg";

  return (
    <div className={cn(
      "rounded-2xl border-2 w-full shadow-xs",
      variant === "points" && "bg-amber-500 border-amber-500",
      variant === "hearts" && "bg-rose-500 border-rose-500",
    )}>
      <div className={cn(
        "p-1.5 text-white rounded-t-xl font-black text-center uppercase text-xs tracking-wider",
        variant === "hearts" && "bg-rose-500",
        variant === "points" && "bg-amber-500"
      )}>
        {variant === "hearts" ? "Focus Energy" : "Total XP"}
      </div>
      <div className={cn(
        "rounded-2xl bg-white dark:bg-slate-900 items-center flex justify-center p-6 font-black text-xl gap-x-2",
        variant === "hearts" && "text-rose-500",
        variant === "points" && "text-amber-500"
      )}>
        <Image
          alt={variant}
          src={imageSrc}
          height={28}
          width={28}
          className="mr-1.5 object-contain"
        />
        <span>{value}</span>
      </div>
    </div>
  );
};
