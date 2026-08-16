import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireUser } from "./lib/auth";
import { ConvexError } from "convex/values";

export const me = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireUser(ctx);
    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("owner", (q) => q.eq("ownerId", user._id))
      .unique();
    return {
      user,
      subscription: subscription ? {...subscription,status:subscription.expiresAt!==undefined&&subscription.expiresAt<=Date.now()?"expired" as const:subscription.status} : {
        status: "trial" as const,
        trialLimit: 10,
      },
    };
  },
});

export const updateProfile = mutation({
  args: {
    name: v.string(),
    locale: v.union(v.literal("ka"), v.literal("en"), v.literal("ru")),
  },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    const name = args.name.normalize("NFC").trim().slice(0, 80);
    if (name.length < 2) throw new Error("Name is too short");
    await ctx.db.patch(user._id, { name, locale: args.locale });
    return user._id;
  },
});
export const setLocale = mutation({
  args: { locale: v.union(v.literal("ka"), v.literal("en"), v.literal("ru")) },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    await ctx.db.patch(user._id, { locale: args.locale });
    return user._id;
  },
});
export const deleteAccount = mutation({
  args: { confirmation: v.string() },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    if (args.confirmation !== "DELETE MY ACCOUNT")
      throw new ConvexError("Type DELETE MY ACCOUNT exactly");
    const portals = await ctx.db
      .query("portals")
      .withIndex("owner", (q) => q.eq("ownerId", user._id))
      .collect();
    for (const portal of portals) {
      const feedback = await ctx.db
        .query("feedback")
        .withIndex("portal_date", (q) => q.eq("portalId", portal._id))
        .collect();
      for (const row of feedback) await ctx.db.delete(row._id);
      const events = await ctx.db
        .query("events")
        .withIndex("portal_date", (q) => q.eq("portalId", portal._id))
        .collect();
      for (const row of events) await ctx.db.delete(row._id);
      const visits = await ctx.db
        .query("visits")
        .withIndex("portal", (q) => q.eq("portalId", portal._id))
        .collect();
      for (const row of visits) await ctx.db.delete(row._id);
      if (portal.logoStorageId) await ctx.storage.delete(portal.logoStorageId);
      await ctx.db.delete(portal._id);
    }
    const subscriptions = await ctx.db
      .query("subscriptions")
      .withIndex("owner", (q) => q.eq("ownerId", user._id))
      .collect();
    for (const row of subscriptions) await ctx.db.delete(row._id);
    const acceptances = await ctx.db
      .query("legalAcceptances")
      .withIndex("user", (q) => q.eq("userId", user._id))
      .collect();
    for (const row of acceptances) await ctx.db.delete(row._id);
    const notifications=await ctx.db.query("notifications").withIndex("user_date",q=>q.eq("userId",user._id)).collect();
    for(const row of notifications)await ctx.db.delete(row._id);
    const logs = await ctx.db.query("auditLogs").collect();
    for (const row of logs)
      if (row.actorId === user._id || row.targetId === user._id)
        await ctx.db.delete(row._id);
    const accounts = await ctx.db
      .query("authAccounts")
      .withIndex("userIdAndProvider", (q) => q.eq("userId", user._id))
      .collect();
    for (const account of accounts) {
      const codes = await ctx.db
        .query("authVerificationCodes")
        .withIndex("accountId", (q) => q.eq("accountId", account._id))
        .collect();
      for (const code of codes) await ctx.db.delete(code._id);
      await ctx.db.delete(account._id);
    }
    const sessions = await ctx.db
      .query("authSessions")
      .withIndex("userId", (q) => q.eq("userId", user._id))
      .collect();
    for (const session of sessions) {
      const tokens = await ctx.db
        .query("authRefreshTokens")
        .withIndex("sessionId", (q) => q.eq("sessionId", session._id))
        .collect();
      for (const token of tokens) await ctx.db.delete(token._id);
      const verifiers = await ctx.db.query("authVerifiers").collect();
      for (const verifier of verifiers)
        if (verifier.sessionId === session._id)
          await ctx.db.delete(verifier._id);
      await ctx.db.delete(session._id);
    }
    if (user.email) {
      const limits = await ctx.db
        .query("authRateLimits")
        .withIndex("identifier", (q) => q.eq("identifier", user.email!))
        .collect();
      for (const limit of limits) await ctx.db.delete(limit._id);
    }
    await ctx.db.delete(user._id);
    return true;
  },
});
