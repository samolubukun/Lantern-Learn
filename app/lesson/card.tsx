"use client";

import Image from "next/image";
import { useCallback } from "react";
import { useAudio, useKey } from "react-use";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  id: string | number;
  imageSrc: string | null;
  audioSrc: string | null;
  text: string;
  shortcut: string;
  selected?: boolean;
  onClick: () => void;
  disabled?: boolean;
  status?: "correct" | "wrong" | "none";
  type: "SELECT" | "ASSIST";
};

export const Card = ({
  id,
  imageSrc,
  audioSrc,
  text,
  shortcut,
  selected,
  onClick,
  status = "none",
  disabled,
  type,
}: Props) => {
  const [audio, _, controls] = useAudio({ src: audioSrc || "" });

  // Exclude legacy generic gamification SVGs from appearing inside option cards
  const isGenericSvg =
    imageSrc &&
    (imageSrc.includes("/learn.svg") ||
      imageSrc.includes("/points.svg") ||
      imageSrc.includes("/unlimited.svg") ||
      imageSrc.includes("/quests.svg") ||
      imageSrc.includes("/next.svg") ||
      imageSrc.includes("/leaderboard.svg") ||
      imageSrc.includes("/shop.svg") ||
      imageSrc.includes("/track_") ||
      imageSrc.includes("/man.svg") ||
      imageSrc.includes("/woman.svg") ||
      imageSrc.includes("/boy.svg") ||
      imageSrc.includes("/girl.svg") ||
      imageSrc.includes("/robot.svg") ||
      imageSrc.includes("/zombie.svg"));

  const showImage = !!(imageSrc && !isGenericSvg);

  const handleClick = useCallback(() => {
    if (disabled) return;

    if (audioSrc) {
      if (audioSrc === "tts" && typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.95;
        window.speechSynthesis.speak(utterance);
      } else {
        try {
          controls.play();
        } catch {
          // Ignore playback errors
        }
      }
    }

    onClick();
  }, [disabled, onClick, controls, audioSrc, text]);

  useKey(shortcut, handleClick, {}, [handleClick]);

  const isCorrect = selected && status === "correct";
  const isWrong = selected && status === "wrong";

  return (
    <div
      onClick={handleClick}
      className={cn(
        "relative w-full rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 cursor-pointer transition-all duration-150 flex items-center gap-x-4 shadow-sm hover:border-amber-400 hover:shadow-md active:scale-[0.99]",
        selected &&
          "border-amber-500 bg-amber-50/60 dark:bg-amber-950/30 ring-2 ring-amber-500/20 shadow-md",
        isCorrect &&
          "border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 ring-2 ring-emerald-500/30 shadow-md",
        isWrong &&
          "border-rose-500 bg-rose-50/80 dark:bg-rose-950/40 ring-2 ring-rose-500/30 shadow-md",
        disabled && "pointer-events-none opacity-80"
      )}
    >
      {audio}

      {/* Shortcut Badge / Option Letter */}
      <div
        className={cn(
          "h-8 w-8 rounded-xl border-2 font-black text-xs sm:text-sm flex items-center justify-center flex-shrink-0 transition-colors",
          "border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800",
          selected && "border-amber-500 bg-amber-500 text-slate-950 font-black",
          isCorrect && "border-emerald-500 bg-emerald-500 text-white",
          isWrong && "border-rose-500 bg-rose-500 text-white"
        )}
      >
        {shortcut}
      </div>

      {/* Optional Real Question Diagram (only if non-generic image) */}
      {showImage && (
        <div className="relative h-12 w-12 flex-shrink-0 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
          <Image src={imageSrc!} fill alt={text} className="object-contain p-1" />
        </div>
      )}

      {/* Option Text */}
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "text-sm sm:text-base font-semibold leading-relaxed transition-colors",
            "text-slate-800 dark:text-slate-100",
            selected && "text-amber-950 dark:text-amber-200 font-bold",
            isCorrect && "text-emerald-800 dark:text-emerald-200 font-bold",
            isWrong && "text-rose-800 dark:text-rose-200 font-bold"
          )}
        >
          {text}
        </p>
      </div>

      {/* Selection / Result State Icon */}
      <div className="flex-shrink-0">
        {isCorrect ? (
          <div className="h-6 w-6 rounded-full bg-emerald-500 text-white flex items-center justify-center">
            <Check className="h-4 w-4 stroke-[3]" />
          </div>
        ) : isWrong ? (
          <div className="h-6 w-6 rounded-full bg-rose-500 text-white flex items-center justify-center">
            <X className="h-4 w-4 stroke-[3]" />
          </div>
        ) : (
          <div
            className={cn(
              "h-5 w-5 rounded-full border-2 transition-colors",
              selected
                ? "border-amber-500 bg-amber-500"
                : "border-slate-300 dark:border-slate-700"
            )}
          />
        )}
      </div>
    </div>
  );
};
