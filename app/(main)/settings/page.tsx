"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  ShieldCheck,
  KeyRound,
  Camera,
  Upload,
  Check,
  Eye,
  EyeOff,
  Sparkles,
  Loader2,
  RefreshCw,
  Lock,
  ArrowRight,
  LogOut,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

import { useAuth } from "@/providers/auth-provider";
import { FeedWrapper } from "@/components/feed-wrapper";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { UserProgress } from "@/components/user-progress";
import { Quests } from "@/components/quests";
import { Promo } from "@/components/promo";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BUILT_IN_AVATARS } from "@/lib/avatars";

export default function SettingsPage() {
  const router = useRouter();
  const { user, token, isLoading: authLoading, updateProfile, updatePassword, logout } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const userProgress = useQuery(
    api.userProgress.getUserProgress,
    token ? { token } : {}
  );
  const userSubscription = useQuery(
    api.userSubscription.getUserSubscription,
    token ? { token } : {}
  );

  // Form states
  const [name, setName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("/mascot.svg");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Password update states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  // Custom image URL input
  const [customUrlInput, setCustomUrlInput] = useState("");
  const [showUrlField, setShowUrlField] = useState(false);

  // Initialize with current user details
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setSelectedAvatar(user.imageSrc || "/mascot.svg");
    }
  }, [user]);

  // Handle client-side file upload & automatic resize to lightweight WebP/JPEG data URL
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (PNG, JPG, WebP, or SVG).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image file is too large. Please select an image under 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;

      // Resize image to max 256x256 using an off-screen canvas for speed & storage efficiency
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxDimension = 256;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const optimizedDataUrl = canvas.toDataURL("image/jpeg", 0.88);
          setSelectedAvatar(optimizedDataUrl);
          toast.success("Custom avatar image loaded! Click 'Save Profile' to apply.");
        } else {
          setSelectedAvatar(dataUrl);
        }
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleApplyCustomUrl = () => {
    const trimmed = customUrlInput.trim();
    if (!trimmed) {
      toast.error("Please enter a valid image URL.");
      return;
    }
    setSelectedAvatar(trimmed);
    setShowUrlField(false);
    toast.success("Avatar image URL applied! Click 'Save Profile' to apply.");
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || name.trim().length < 2) {
      toast.error("Name must be at least 2 characters.");
      return;
    }

    setIsSavingProfile(true);
    try {
      const res = await updateProfile({
        name: name.trim(),
        imageSrc: selectedAvatar,
      });

      if (res.success) {
        toast.success(res.message || "Profile updated successfully!");
      } else {
        toast.error(res.error || "Failed to update profile.");
      }
    } catch {
      toast.error("An unexpected error occurred while saving profile.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.error("Please enter your current password.");
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    setIsSavingPassword(true);
    try {
      const res = await updatePassword({
        currentPassword,
        newPassword,
      });

      if (res.success) {
        toast.success(res.message || "Password updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(res.error || "Failed to update password.");
      }
    } catch {
      toast.error("An unexpected error occurred while updating password.");
    } finally {
      setIsSavingPassword(false);
    }
  };

  if (authLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 text-amber-500 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="w-full max-w-xl mx-auto py-16 text-center space-y-4">
        <div className="h-16 w-16 rounded-3xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center mx-auto">
          <Lock className="h-8 w-8 stroke-[2.2]" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">
          Sign In Required
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          Please log in to your Lantern account to manage your profile, customize your avatar, or update your password.
        </p>
        <div className="pt-2">
          <Link href="/login">
            <Button className="rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black">
              Sign In to Lantern
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const isPro = userProgress?.isPro || !!userSubscription?.isActive;
  const hasProfileChanges = name.trim() !== (user.name || "") || selectedAvatar !== (user.imageSrc || "/mascot.svg");

  return (
    <div className="flex flex-col xl:flex-row-reverse gap-6 xl:gap-8 w-full min-w-0 pb-16">
      {/* Sticky Right Sidebar (XP, Hearts, Streak, Quests) */}
      {userProgress && userProgress.activeCourse && (
        <StickyWrapper>
          <UserProgress
            activeCourse={userProgress.activeCourse}
            hearts={userProgress.hearts}
            points={userProgress.points}
            credits={userProgress.credits}
            hasActiveSubscription={isPro}
          />
          {!isPro && <Promo />}
          <Quests points={userProgress.points} />
        </StickyWrapper>
      )}

      {/* Main Settings Feed */}
      <FeedWrapper>
        <div className="w-full max-w-3xl space-y-8">
          {/* 1. Header Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/25 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Profile Avatar Beacon Preview */}
              <div className="relative group">
                <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border-2 border-amber-500/40 p-1.5 shadow-lg shadow-amber-500/10 flex items-center justify-center">
                  <Image
                    src={selectedAvatar}
                    alt={user.name || "Learner"}
                    width={112}
                    height={112}
                    className="h-full w-full object-contain rounded-2xl"
                    unoptimized={selectedAvatar.startsWith("data:")}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  title="Upload Custom Photo"
                  className="absolute -bottom-2 -right-2 h-9 w-9 rounded-full bg-slate-950 text-amber-400 hover:bg-amber-500 hover:text-slate-950 flex items-center justify-center shadow-md transition-all border-2 border-white dark:border-slate-800"
                >
                  <Camera className="h-4 w-4 stroke-[2.5]" />
                </button>
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center sm:text-left min-w-0">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
                  <span className="text-xs font-black uppercase tracking-wider text-amber-700 dark:text-amber-400 bg-amber-500/15 border border-amber-500/30 px-3 py-1 rounded-full">
                    {user.isAdmin ? "Platform Admin" : "Learner"}
                  </span>
                  {isPro && (
                    <span className="text-xs font-black uppercase tracking-wider text-slate-950 bg-amber-400 px-3 py-1 rounded-full flex items-center gap-x-1 shadow-xs">
                      <Sparkles className="h-3 w-3" /> Pro Member
                    </span>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight truncate">
                  {name || user.name}
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-mono truncate">
                  {user.email}
                </p>

                {hasProfileChanges && (
                  <div className="mt-3 inline-flex items-center gap-x-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-100/60 dark:bg-amber-950/60 px-3 py-1 rounded-lg">
                    <Info className="h-3.5 w-3.5" />
                    <span>You have unsaved profile changes</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 2. Avatar Selection & Upload Section */}
          <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E121B] p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-slate-100 flex items-center gap-x-2">
                  <Sparkles className="h-5 w-5 text-amber-500 fill-amber-500" />
                  <span>Choose Your Avatar</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Pick from our curated built-in avatars or upload a custom profile picture.
                </p>
              </div>

              {/* Upload & URL Buttons */}
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-xl gap-x-1.5 text-xs font-bold border-slate-300 dark:border-slate-700 hover:border-amber-500"
                >
                  <Upload className="h-3.5 w-3.5 text-amber-500" />
                  <span>Upload Image</span>
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowUrlField(!showUrlField)}
                  className="rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400"
                >
                  Image URL
                </Button>
              </div>
            </div>

            {/* Optional URL Input Field */}
            {showUrlField && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Direct Image URL (HTTPS)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={customUrlInput}
                    onChange={(e) => setCustomUrlInput(e.target.value)}
                    placeholder="https://example.com/avatar.png"
                    className="flex-1 px-3.5 py-2 rounded-xl text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-amber-500"
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleApplyCustomUrl}
                    className="rounded-xl bg-slate-950 dark:bg-amber-500 text-white dark:text-slate-950 text-xs font-bold"
                  >
                    Apply URL
                  </Button>
                </div>
              </div>
            )}

            {/* Curated Built-in Avatars Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3.5">
              {BUILT_IN_AVATARS.map((av) => {
                const isSelected = selectedAvatar === av.src;
                return (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => setSelectedAvatar(av.src)}
                    className={`relative group p-3 rounded-2xl border transition-all duration-200 flex flex-col items-center justify-between text-center ${
                      isSelected
                        ? "border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 shadow-sm ring-2 ring-amber-500/30 scale-102"
                        : "border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40 hover:border-slate-300 dark:hover:border-slate-700 hover:scale-101"
                    }`}
                  >
                    {/* Active check pill */}
                    {isSelected && (
                      <span className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-xs">
                        <Check className="h-3 w-3 stroke-[3]" />
                      </span>
                    )}

                    <div className="relative h-14 w-14 sm:h-16 sm:w-16 rounded-xl overflow-hidden flex items-center justify-center p-1">
                      <Image
                        src={av.src}
                        alt={av.label}
                        width={64}
                        height={64}
                        className="object-contain"
                      />
                    </div>
                    <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 mt-2 truncate w-full">
                      {av.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* 3. Personal Information Form */}
          <form
            onSubmit={handleSaveProfile}
            className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E121B] p-6 sm:p-8 space-y-6 shadow-xs"
          >
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-slate-100 flex items-center gap-x-2">
                <User className="h-5 w-5 text-amber-500" />
                <span>Personal Information</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Update your display name visible across leaderboards and activity feeds.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 text-sm font-semibold focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                />
              </div>

              {/* Email Address (Read-only) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Email Address
                  </label>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-900/60 flex items-center gap-x-1">
                    <ShieldCheck className="h-3 w-3" /> Verified
                  </span>
                </div>
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-900/30 text-slate-500 dark:text-slate-400 text-sm font-mono cursor-not-allowed"
                />
              </div>
            </div>

            <div className="flex items-center justify-end pt-2">
              <Button
                type="submit"
                disabled={isSavingProfile || !hasProfileChanges}
                className="rounded-xl px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs uppercase tracking-wider transition-all disabled:opacity-50"
              >
                {isSavingProfile ? (
                  <div className="flex items-center gap-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Saving Changes...</span>
                  </div>
                ) : (
                  <span>Save Profile</span>
                )}
              </Button>
            </div>
          </form>

          {/* 4. Security & Password Update Section */}
          <form
            onSubmit={handleSavePassword}
            className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E121B] p-6 sm:p-8 space-y-6 shadow-xs"
          >
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-slate-100 flex items-center gap-x-2">
                <KeyRound className="h-5 w-5 text-amber-500" />
                <span>Security & Password</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Update your account password. Requires your current password for security verification.
              </p>
            </div>

            <div className="space-y-4">
              {/* Current Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPass ? "text" : "password"}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter your current password"
                    className="w-full px-4 py-2.5 pr-11 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showCurrentPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* New Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPass ? "text" : "password"}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full px-4 py-2.5 pr-11 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showNewPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end pt-2">
              <Button
                type="submit"
                disabled={isSavingPassword || !currentPassword || !newPassword}
                className="rounded-xl px-6 py-2.5 bg-slate-950 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-black text-xs uppercase tracking-wider transition-all disabled:opacity-50"
              >
                {isSavingPassword ? (
                  <div className="flex items-center gap-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Updating Password...</span>
                  </div>
                ) : (
                  <span>Update Password</span>
                )}
              </Button>
            </div>
          </form>

          {/* 5. Account Overview & Session */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E121B] p-6 sm:p-8 space-y-4 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Session & Sign Out
            </h2>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Signed in as <strong className="text-slate-800 dark:text-slate-200">{user.email}</strong>
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  User ID: <span className="font-mono">{user.id}</span>
                </p>
              </div>
              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={() => logout()}
                className="rounded-xl gap-x-2 text-xs font-bold"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out of Lantern</span>
              </Button>
            </div>
          </div>
        </div>
      </FeedWrapper>
    </div>
  );
}
