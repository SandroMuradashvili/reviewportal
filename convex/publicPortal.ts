import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const bySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const portal = await ctx.db
      .query("portals")
      .withIndex("slug", (q) => q.eq("slug", slug))
      .unique();
    if (!portal) return { state: "missing" as const };
    if (portal.status !== "live")
      return { state: portal.status as "draft" | "paused" | "archived" };
    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("owner", (q) => q.eq("ownerId", portal.ownerId))
      .unique();
    if (
      (subscription?.status ?? "trial") === "trial" &&
      portal.submissionCount >= (subscription?.trialLimit ?? 10)
    )
      return { state: "trial-ended" as const, name: portal.name };
    return {
      state: "ready" as const,
      name: portal.name,
      prompt: portal.prompt,
      destinationUrl: portal.destinationUrl,
      businessUrl: portal.businessUrl,
      logoUrl: portal.logoStorageId
        ? await ctx.storage.getUrl(portal.logoStorageId)
        : null,
      redirectThreshold: portal.redirectThreshold ?? 4,
    };
  },
});

export const visit = mutation({
  args: { slug: v.string(), visitTokenHash: v.string() },
  handler: async (ctx, args) => {
    const portal = await ctx.db
      .query("portals")
      .withIndex("slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (!portal || portal.status !== "live") return null;
    const existing = await ctx.db
        .query("visits")
        .withIndex("portal_token", (q) =>
          q.eq("portalId", portal._id).eq("tokenHash", args.visitTokenHash),
        )
        .unique(),
      now = Date.now();
    if (existing) {
      await ctx.db.patch(existing._id, {
        lastSeen: now,
        scanCount: existing.scanCount + 1,
      });
      return existing._id;
    }
    const visitId = await ctx.db.insert("visits", {
      portalId: portal._id,
      tokenHash: args.visitTokenHash,
      firstSeen: now,
      lastSeen: now,
      scanCount: 1,
      submitted: false,
      redirected: false,
    });
    await ctx.db.insert("events", {
      portalId: portal._id,
      visitId,
      type: "page_view",
      timestamp: now,
    });
    return visitId;
  },
});

export const starSelected = mutation({
  args: { slug: v.string(), visitTokenHash: v.string(), rating: v.number() },
  handler: async (ctx, args) => {
    if (!Number.isInteger(args.rating) || args.rating < 1 || args.rating > 5)
      return;
    const portal = await ctx.db
      .query("portals")
      .withIndex("slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (!portal || portal.status !== "live") return;
    const visit = await ctx.db
      .query("visits")
      .withIndex("portal_token", (q) =>
        q.eq("portalId", portal._id).eq("tokenHash", args.visitTokenHash),
      )
      .unique();
    if (visit)
      await ctx.db.insert("events", {
        portalId: portal._id,
        visitId: visit._id,
        type: "star_selected",
        rating: args.rating,
        timestamp: Date.now(),
      });
  },
});

export const redirected = mutation({
  args: { slug: v.string(), visitTokenHash: v.string() },
  handler: async (ctx, args) => {
    const portal = await ctx.db
      .query("portals")
      .withIndex("slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (!portal) return;
    const visit = await ctx.db
      .query("visits")
      .withIndex("portal_token", (q) =>
        q.eq("portalId", portal._id).eq("tokenHash", args.visitTokenHash),
      )
      .unique();
    if (!visit || visit.redirected) return;
    await ctx.db.patch(visit._id, { redirected: true, lastSeen: Date.now() });
    await ctx.db.insert("events", {
      portalId: portal._id,
      visitId: visit._id,
      type: "redirect_clicked",
      timestamp: Date.now(),
    });
  },
});
