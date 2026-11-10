/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as admin from "../admin.js";
import type * as auth from "../auth.js";
import type * as authHelper from "../authHelper.js";
import type * as challenges from "../challenges.js";
import type * as courses from "../courses.js";
import type * as credits from "../credits.js";
import type * as leaderboard from "../leaderboard.js";
import type * as lessons from "../lessons.js";
import type * as modules from "../modules.js";
import type * as notes from "../notes.js";
import type * as seed from "../seed.js";
import type * as userProgress from "../userProgress.js";
import type * as userSubscription from "../userSubscription.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  admin: typeof admin;
  auth: typeof auth;
  authHelper: typeof authHelper;
  challenges: typeof challenges;
  courses: typeof courses;
  credits: typeof credits;
  leaderboard: typeof leaderboard;
  lessons: typeof lessons;
  modules: typeof modules;
  notes: typeof notes;
  seed: typeof seed;
  userProgress: typeof userProgress;
  userSubscription: typeof userSubscription;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
