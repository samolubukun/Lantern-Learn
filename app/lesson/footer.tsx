import { useKey, useMedia } from "react-use";
import { CheckCircle, XCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Props = {
  onCheck: () => void;
  status: "correct" | "wrong" | "none" | "completed";
  disabled?: boolean;
  lessonId?: number | string;
};

export const Footer = ({
  onCheck,
  status,
  disabled,
  lessonId,
}: Props) => {
  useKey("Enter", onCheck, {}, [onCheck]);
  const isMobile = useMedia("(max-width: 1024px)");

  return (
    <footer className={cn(
      "lg:h-[130px] h-[88px] sm:h-[100px] border-t-2 transition-colors",
      status === "correct" && "border-transparent bg-emerald-100/90 dark:bg-emerald-950/40",
      status === "wrong" && "border-transparent bg-rose-100/90 dark:bg-rose-950/40",
    )}>
      <div className="max-w-[1140px] h-full mx-auto flex items-center justify-between px-3.5 sm:px-6 lg:px-10">
        {status === "correct" && (
          <div className="text-emerald-700 dark:text-emerald-300 font-extrabold text-xs sm:text-base lg:text-xl flex items-center">
            <CheckCircle className="h-5 w-5 sm:h-7 sm:w-7 mr-2 sm:mr-3 stroke-[2.5] flex-shrink-0" />
            <span>Spot on! Knowledge verified.</span>
          </div>
        )}
        {status === "wrong" && (
          <div className="text-rose-700 dark:text-rose-300 font-extrabold text-xs sm:text-base lg:text-xl flex items-center">
            <XCircle className="h-5 w-5 sm:h-7 sm:w-7 mr-2 sm:mr-3 stroke-[2.5] flex-shrink-0" />
            <span>Not quite right. Let&apos;s review.</span>
          </div>
        )}
        {status === "completed" && (
          <Button
            variant="default"
            size={isMobile ? "sm" : "lg"}
            onClick={() => window.location.href = `/lesson/${lessonId}`}
          >
            Practice again
          </Button>
        )}
        <Button
          disabled={disabled}
          className="ml-auto"
          onClick={onCheck}
          size={isMobile ? "sm" : "lg"}
          variant={status === "wrong" ? "danger" : "secondary"}
        >
          {status === "none" && "Check"}
          {status === "correct" && "Next"}
          {status === "wrong" && "Retry"}
          {status === "completed" && "Continue"}
        </Button>
      </div>
    </footer>
  );
};
