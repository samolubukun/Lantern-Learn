"use client";

import { toast } from "sonner";
import Image from "next/image";
import { useTransition } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Coins, Sparkles, Check, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { POINTS_TO_REFILL } from "@/constants";
import { createCheckoutUrl } from "@/actions/user-subscription";
import { useAuth } from "@/providers/auth-provider";
import { formatFriendlyErrorMessage } from "@/lib/errors";

type Props = {
  hearts: number;
  points: number;
  credits?: number;
  hasActiveSubscription: boolean;
};

export const Items = ({
  hearts,
  points,
  credits = 100,
  hasActiveSubscription,
}: Props) => {
  const { token, user } = useAuth();
  const [pending, startTransition] = useTransition();
  const refillHeartsMutation = useMutation(api.userProgress.refillHearts);
  const unlockProMutation = useMutation(api.credits.unlockProWithCredits);
  const refillWithCreditsMutation = useMutation(api.credits.spendCreditsForHearts);
  const addCreditsMutation = useMutation(api.credits.addCredits);

  const onRefillHeartsWithPoints = () => {
    if (pending || hearts === 5 || points < POINTS_TO_REFILL) return;

    startTransition(async () => {
      try {
        await refillHeartsMutation({ token: token || undefined });
        toast.success("Hearts refilled with points!");
      } catch (err: any) {
        toast.error(formatFriendlyErrorMessage(err, "Could not refill hearts"));
      }
    });
  };

  const onRefillHeartsWithCredits = () => {
    if (pending || hearts === 5 || credits < 10) return;

    startTransition(async () => {
      try {
        await refillWithCreditsMutation({ costInCredits: 10, token: token || undefined });
        toast.success("Hearts refilled with 10 credits!");
      } catch (err: any) {
        toast.error(formatFriendlyErrorMessage(err, "Not enough credits"));
      }
    });
  };

  const onUnlockProWithCredits = () => {
    if (pending || credits < 50) {
      toast.error("You need at least 50 credits to unlock Lantern Pro.");
      return;
    }

    startTransition(async () => {
      try {
        await unlockProMutation({ durationDays: 30, costInCredits: 50, token: token || undefined });
        toast.success("🎉 Lantern Pro unlocked for 30 days! Unlimited hearts activated.");
      } catch (err: any) {
        toast.error(formatFriendlyErrorMessage(err, "Failed to unlock Pro"));
      }
    });
  };

  const onTopUp = (creditsToAdd: number, priceInCents: number) => {
    startTransition(async () => {
      try {
        const response = await createCheckoutUrl({
          credits: creditsToAdd,
          priceInCents,
          title: `Lantern Pack: ${creditsToAdd} Credits`,
          userId: user?.id,
          userEmail: user?.email,
        });

        if (response.simulated) {
          toast.success(response.message || `Added ${creditsToAdd} credits to your account!`);
        } else if (response.data) {
          window.location.href = response.data;
        }
      } catch {
        // Fallback directly to Convex mutation if server action fails
        await addCreditsMutation({
          amount: creditsToAdd,
          description: `Direct credit top-up: ${creditsToAdd} credits`,
          type: "purchase",
          token: token || undefined,
        });
        toast.success(`Successfully added ${creditsToAdd} Lantern Credits!`);
      }
    });
  };

  return (
    <div className="w-full space-y-6">
      {/* Current Balance Banner */}
      <div className="bg-gradient-to-r from-amber-50 dark:from-amber-950/30 to-orange-50 dark:to-orange-950/20 border border-amber-200 dark:border-amber-900/60 rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-x-3">
          <div className="p-3 bg-amber-500 rounded-xl text-white shadow-sm">
            <Coins className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-amber-700 uppercase tracking-wider">
              Credit Balance
            </p>
            <h3 className="text-2xl font-extrabold text-neutral-800 dark:text-slate-100">
              {credits} <span className="text-sm font-normal text-muted-foreground">Credits</span>
            </h3>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Free starter grant</p>
          <span className="text-xs font-semibold text-amber-600 bg-amber-50 dark:bg-amber-950/30 px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-900/60">
            Active
          </span>
        </div>
      </div>

      <div className="w-full space-y-4">
        {/* Item 1: Refill Hearts */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center gap-x-3.5 min-w-0">
            <div className="h-12 w-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center flex-shrink-0">
              <Image src="/heart.svg" alt="Heart" height={28} width={28} className="object-contain" />
            </div>
            <div className="min-w-0">
              <h4 className="text-slate-900 dark:text-slate-100 text-base font-bold">
                Refill Hearts
              </h4>
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-0.5 leading-relaxed">
                Restore your hearts to maximum (5) using points or credits.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-x-2 w-full sm:w-auto justify-end flex-shrink-0">
            <Button
              onClick={onRefillHeartsWithPoints}
              disabled={pending || hearts === 5 || points < POINTS_TO_REFILL}
              variant="default"
              size="sm"
              className="text-xs font-bold"
            >
              {hearts === 5 ? (
                "Full"
              ) : (
                <div className="flex items-center">
                  <Zap className="h-3.5 w-3.5 text-amber-500 fill-amber-500 mr-1" />
                  {POINTS_TO_REFILL} pts
                </div>
              )}
            </Button>
            {hearts < 5 && (
              <Button
                onClick={onRefillHeartsWithCredits}
                disabled={pending || credits < 10}
                variant="secondary"
                size="sm"
                className="gap-x-1 text-xs font-bold"
              >
                <Coins className="h-3.5 w-3.5 text-amber-500" /> 10 Cr
              </Button>
            )}
          </div>
        </div>

        {/* Item 2: Lantern Pro Pass with Credits */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl border border-amber-300 dark:border-amber-900/60 bg-gradient-to-br from-amber-50/60 dark:from-amber-950/20 via-amber-50/30 dark:via-transparent to-transparent dark:bg-amber-950/20 shadow-xs">
          <div className="flex items-center gap-x-3.5 min-w-0">
            <div className="h-12 w-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
              <Zap className="h-6 w-6 text-amber-500 fill-amber-500" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-x-2">
                <h4 className="text-slate-900 dark:text-slate-100 text-base font-bold">
                  Lantern Pro (30 Days)
                </h4>
                <span className="text-[10px] bg-amber-500 text-slate-950 font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Best Value
                </span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-0.5 leading-relaxed">
                Unlimited hearts, access to video masterclasses, and certified study tracks.
              </p>
            </div>
          </div>
          <div className="w-full sm:w-auto flex justify-end flex-shrink-0">
            <button
              onClick={onUnlockProWithCredits}
              disabled={pending || hasActiveSubscription || credits < 50}
              className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-x-1.5 shadow-xs ${
                hasActiveSubscription
                  ? "bg-emerald-500 text-white cursor-default"
                  : "bg-slate-950 dark:bg-amber-500 text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-amber-400 disabled:opacity-50 disabled:pointer-events-none"
              }`}
            >
              {hasActiveSubscription ? (
                <span className="flex items-center gap-x-1">
                  <Check className="h-4 w-4 stroke-[3]" /> Active Pro
                </span>
              ) : (
                <span className="flex items-center gap-x-1.5">
                  <Sparkles className="h-3.5 w-3.5" /> 50 Credits
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Item 3: Credit Top-up Packs (Pluggable Provider) */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-5">
          <div>
            <h4 className="font-black text-slate-900 dark:text-slate-100 flex items-center gap-x-2 text-base">
              <Zap className="h-5 w-5 text-amber-500 fill-amber-500" />
              <span>Top-Up Credit Packs</span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
              Recharge credits via credit card, Stripe, or instant simulated credit pack.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Pack A: Explorer */}
            <div className="h-full border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col justify-between text-center hover:border-amber-400/80 transition-all bg-slate-50/50 dark:bg-slate-900/40">
              <div className="flex flex-col items-center">
                <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
                  <Coins className="h-5 w-5" />
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
                  100
                </div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                  Explorer Pack
                </p>
              </div>
              <button
                type="button"
                disabled={pending}
                onClick={() => onTopUp(100, 499)}
                className="w-full mt-4 py-2.5 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-amber-500 hover:text-amber-600 dark:hover:text-amber-400 text-slate-800 dark:text-slate-200 text-xs font-bold uppercase tracking-wider transition-all shadow-2xs"
              >
                +100 CR ($4.99)
              </button>
            </div>

            {/* Pack B: Scholar (Popular) */}
            <div className="h-full border-2 border-amber-400 dark:border-amber-500 bg-amber-50/40 dark:bg-amber-950/20 rounded-2xl p-5 flex flex-col justify-between text-center relative shadow-sm">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 text-[10px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                Popular
              </span>
              <div className="flex flex-col items-center pt-1">
                <div className="h-10 w-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center mb-3 shadow-xs">
                  <Coins className="h-5 w-5" />
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
                  250
                </div>
                <p className="text-xs font-bold text-amber-800 dark:text-amber-300 mt-0.5">
                  Scholar Pack
                </p>
              </div>
              <button
                type="button"
                disabled={pending}
                onClick={() => onTopUp(250, 999)}
                className="w-full mt-4 py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black uppercase tracking-wider transition-all shadow-xs"
              >
                +250 CR ($9.99)
              </button>
            </div>

            {/* Pack C: Master */}
            <div className="h-full border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col justify-between text-center hover:border-amber-400/80 transition-all bg-slate-50/50 dark:bg-slate-900/40">
              <div className="flex flex-col items-center">
                <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
                  <Coins className="h-5 w-5" />
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
                  600
                </div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                  Master Pack
                </p>
                <span className="inline-block text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 rounded-full mt-1 uppercase tracking-wide">
                  +20% Bonus
                </span>
              </div>
              <button
                type="button"
                disabled={pending}
                onClick={() => onTopUp(600, 1999)}
                className="w-full mt-4 py-2.5 px-3 rounded-xl bg-slate-950 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-black uppercase tracking-wider transition-all shadow-xs"
              >
                +600 CR ($19.99)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
