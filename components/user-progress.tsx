import Link from "next/link";
import Image from "next/image";
import { InfinityIcon, Coins, Zap, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

type Course = {
  imageSrc: string;
  title: string;
};

type Props = {
  activeCourse: Course;
  hearts: number;
  points: number;
  credits?: number;
  hasActiveSubscription: boolean;
};

export const UserProgress = ({ 
  activeCourse, 
  points, 
  hearts, 
  credits = 100,
  hasActiveSubscription
}: Props) => {
  return (
    <div className="flex items-center justify-between gap-x-2 w-full p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
      <Link href="/courses" title={activeCourse.title}>
        <Button variant="ghost" size="sm" className="p-1 h-auto">
          <div className="relative h-7 w-7 rounded-lg overflow-hidden border border-amber-500/20 bg-amber-500/10 flex items-center justify-center">
            <Image
              src={activeCourse.imageSrc}
              alt={activeCourse.title}
              width={20}
              height={20}
              className="object-contain"
            />
          </div>
        </Button>
      </Link>
      <Link href="/shop" title="Available Credits">
        <Button variant="ghost" size="sm" className="text-amber-500 font-bold px-2 h-8 text-xs">
          <Coins className="h-4 w-4 mr-1 text-amber-500" />
          {credits}
        </Button>
      </Link>
      <Link href="/leaderboard" title="Knowledge Score">
        <Button variant="ghost" size="sm" className="text-amber-600 dark:text-amber-400 font-bold px-2 h-8 text-xs">
          <Zap className="h-4 w-4 mr-1 fill-current" />
          {points}
        </Button>
      </Link>
      <Link href="/shop" title="Focus Energy">
        <Button variant="ghost" size="sm" className="text-rose-500 font-bold px-2 h-8 text-xs">
          <Heart className="h-4 w-4 mr-1 fill-current" />
          {hasActiveSubscription 
            ? <InfinityIcon className="h-3.5 w-3.5 stroke-[3]" /> 
            : hearts
          }
        </Button>
      </Link>
    </div>
  );
};
