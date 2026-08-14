import type { QueryCtx,MutationCtx } from "../_generated/server";
import type { Id } from "../_generated/dataModel";
export async function requireUser(ctx:QueryCtx|MutationCtx){const identity=await ctx.auth.getUserIdentity();if(!identity)throw new Error("Unauthenticated");const user=await ctx.db.query("users").withIndex("email",q=>q.eq("email",identity.email)).unique();if(!user)throw new Error("User profile not found");if(user.state==="suspended")throw new Error("Account suspended");return user}
export async function requirePortalOwner(ctx:QueryCtx|MutationCtx,portalId:Id<"portals">){const user=await requireUser(ctx),portal=await ctx.db.get(portalId);if(!portal||portal.ownerId!==user._id)throw new Error("Portal not found");return {user,portal}}
export async function requireAdmin(ctx:QueryCtx|MutationCtx){const user=await requireUser(ctx);if(user.role!=="admin")throw new Error("Forbidden");return user}
