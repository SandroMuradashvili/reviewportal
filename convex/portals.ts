import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { requireUser, requirePortalOwner } from "./lib/auth";
import {
  normalizeGoogleDestination,
  normalizePortalSlug,
  slugFromBusinessName,
} from "../lib/portal-validation";
const validate = <T>(task: () => T) => {
  try {
    return task();
  } catch (error) {
    throw new ConvexError(
      error instanceof Error ? error.message : "Invalid portal settings",
    );
  }
};
export const listMine = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireUser(ctx);
    return ctx.db
      .query("portals")
      .withIndex("owner", (q) => q.eq("ownerId", user._id))
      .collect();
  },
});
export const create = mutation({
  args: {
    name: v.string(),
    slug: v.optional(v.string()),
    destinationUrl: v.optional(v.string()),
    businessUrl: v.optional(v.string()),
    logoStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx),
      subscription = await ctx.db.query("subscriptions").withIndex("owner",q=>q.eq("ownerId",user._id)).unique(),
      existing = await ctx.db
        .query("portals")
        .withIndex("owner", (q) => q.eq("ownerId", user._id))
        .collect();
    const portalLimit=subscription?.portalLimit??(subscription?.status==="active"?5:1);
    if (existing.length >= portalLimit) throw new ConvexError(`Portal limit reached (${portalLimit})`);
    const name = args.name.normalize("NFC").trim().slice(0, 100);
    if (name.length < 2) throw new ConvexError("Business name is too short");
    const base = validate(() =>
      normalizePortalSlug(
        args.slug?.trim() ||
          slugFromBusinessName(name) ||
          `business-${Date.now().toString(36)}`,
      ),
    );
    let slug = base,
      suffix = 2;
    while (
      await ctx.db
        .query("portals")
        .withIndex("slug", (q) => q.eq("slug", slug))
        .unique()
    ) {
      slug = `${base.slice(0, Math.max(1, 48 - String(suffix).length - 1))}-${suffix++}`;
    }
    return ctx.db.insert("portals", {
      ownerId: user._id,
      name,
      slug,
      status: "draft",
      prompt: {
        ka: "როგორ შეაფასებდით თქვენს გამოცდილებას?",
        en: "How would you rate your experience?",
        ru: "Как вы оцените свой опыт?",
      },
      destinationUrl: validate(() =>
        normalizeGoogleDestination(args.destinationUrl),
      ),
      businessUrl: validate(() => normalizeGoogleDestination(args.businessUrl)),
      logoStorageId: args.logoStorageId,
      notificationEnabled: false,
      submissionCount: 0,
    });
  },
});
export const setStatus = mutation({
  args: {
    portalId: v.id("portals"),
    status: v.union(
      v.literal("draft"),
      v.literal("live"),
      v.literal("paused"),
      v.literal("archived"),
    ),
  },
  handler: async (ctx, args) => {
    await requirePortalOwner(ctx, args.portalId);
    await ctx.db.patch(args.portalId, { status: args.status });
  },
});
export const update = mutation({
  args: {
    portalId: v.id("portals"),
    name: v.string(),
    slug: v.string(),
    destinationUrl: v.optional(v.string()),
    businessUrl: v.optional(v.string()),
    logoStorageId: v.optional(v.id("_storage")),
    removeLogo: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { portal } = await requirePortalOwner(ctx, args.portalId);
    const name = args.name.normalize("NFC").trim().slice(0, 100);
    if (name.length < 2) throw new ConvexError("Business name is too short");
    const slug = validate(() => normalizePortalSlug(args.slug)),
      taken = await ctx.db
        .query("portals")
        .withIndex("slug", (q) => q.eq("slug", slug))
        .unique();
    if (taken && taken._id !== portal._id)
      throw new ConvexError("This portal link is already in use");
    const destinationUrl = validate(() =>
        normalizeGoogleDestination(args.destinationUrl),
      ),
      businessUrl = validate(() =>
        normalizeGoogleDestination(args.businessUrl),
      ),
      nextLogo = args.removeLogo
        ? undefined
        : (args.logoStorageId ?? portal.logoStorageId);
    if (portal.logoStorageId && portal.logoStorageId !== nextLogo)
      await ctx.storage.delete(portal.logoStorageId);
    await ctx.db.patch(args.portalId, {
      name,
      slug,
      destinationUrl,
      businessUrl,
      logoStorageId: nextLogo,
      redirectThreshold: 4,
      notificationEnabled: false,
    });
  },
});
export const generateLogoUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await requireUser(ctx);
    return ctx.storage.generateUploadUrl();
  },
});
export const remove = mutation({
  args: { portalId: v.id("portals"), confirmation: v.string() },
  handler: async (ctx, args) => {
    const { portal } = await requirePortalOwner(ctx, args.portalId);
    if (args.confirmation !== portal.name)
      throw new ConvexError("Type the exact business name to confirm deletion");
    const feedback = await ctx.db
        .query("feedback")
        .withIndex("portal_date", (q) => q.eq("portalId", portal._id))
        .collect(),
      visits = await ctx.db
        .query("visits")
        .withIndex("portal", (q) => q.eq("portalId", portal._id))
        .collect(),
      events = await ctx.db
        .query("events")
        .withIndex("portal_date", (q) => q.eq("portalId", portal._id))
        .collect();
    for (const row of [...feedback, ...events, ...visits])
      await ctx.db.delete(row._id);
    if (portal.logoStorageId) await ctx.storage.delete(portal.logoStorageId);
    await ctx.db.delete(portal._id);
  },
});
