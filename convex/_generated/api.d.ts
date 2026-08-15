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
import type * as catalog from "../catalog.js";
import type * as dashboardData from "../dashboardData.js";
import type * as feedback from "../feedback.js";
import type * as http from "../http.js";
import type * as lib_auth from "../lib/auth.js";
import type * as operator from "../operator.js";
import type * as portals from "../portals.js";
import type * as publicPortal from "../publicPortal.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  admin: typeof admin;
  auth: typeof auth;
  catalog: typeof catalog;
  dashboardData: typeof dashboardData;
  feedback: typeof feedback;
  http: typeof http;
  "lib/auth": typeof lib_auth;
  operator: typeof operator;
  portals: typeof portals;
  publicPortal: typeof publicPortal;
  users: typeof users;
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
