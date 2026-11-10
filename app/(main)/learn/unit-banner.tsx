import Link from "next/link";
import { NotebookText } from "lucide-react";

import { Button } from "@/components/ui/button";

type Props = {
  title: string;
  description: string;
};

export const UnitBanner = ({
  title,
  description,
}: Props) => {
  return (
    <div className="w-full rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 p-6 text-white flex items-center justify-between shadow-lg shadow-amber-500/10 border border-amber-400/20">
      <div className="space-y-2.5">
        <h3 className="text-2xl font-black tracking-tight">
          {title}
        </h3>
        <p className="text-base text-amber-100 font-medium">
          {description}
        </p>
      </div>
      <Link href="/lesson">
        <Button
          size="lg"
          variant="default"
          className="hidden xl:flex border-2 border-b-4 active:border-b-2 bg-white dark:bg-slate-900 text-amber-900 dark:text-amber-200 hover:bg-amber-50 dark:hover:bg-amber-950/30 border-amber-200 dark:border-amber-900/60"
        >
          <NotebookText className="mr-2 h-5 w-5 text-amber-600" />
          Continue
        </Button>
      </Link>
    </div>
  );
};
