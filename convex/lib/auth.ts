import type { QueryCtx,MutationCtx } from "../_generated/server";
import type { Id } from "../_generated/dataModel";
import { getAuthUserId } from "@convex-dev/auth/server";
export async function requireUser(ctx:QueryCtx|MutationCtx){const userId=await getAuthUserId(ctx);if(!userId)throw new Error("Unauthenticated");const user=await ctx.db.get(userId);if(!user)throw new Error("User profile not found");if(user.state==="suspended")throw new Error("Account suspended");return user}
export async function requirePortalOwner(ctx:QueryCtx|MutationCtx,portalId:Id<"portals">){const user=await requireUser(ctx),portal=await ctx.db.get(portalId);if(!portal||portal.ownerId!==user._id)throw new Error("Portal not found");return {user,portal}}
export async function requireAdmin(ctx:QueryCtx|MutationCtx){const user=await requireUser(ctx);if(user.role!=="admin")throw new Error("Forbidden");return user}
