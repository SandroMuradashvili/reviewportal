import { mutation,query } from "./_generated/server";
import { v } from "convex/values";
import { requireUser } from "./lib/auth";

export const me=query({args:{},handler:async ctx=>{const user=await requireUser(ctx);const subscription=await ctx.db.query("subscriptions").withIndex("owner",q=>q.eq("ownerId",user._id)).unique();return {user,subscription:subscription??{status:"trial" as const,trialLimit:10}}}});

export const updateProfile=mutation({args:{name:v.string(),locale:v.union(v.literal("ka"),v.literal("en"),v.literal("ru"))},handler:async(ctx,args)=>{const user=await requireUser(ctx);const name=args.name.normalize("NFC").trim().slice(0,80);if(name.length<2)throw new Error("Name is too short");await ctx.db.patch(user._id,{name,locale:args.locale});return user._id}});
export const setLocale=mutation({args:{locale:v.union(v.literal("ka"),v.literal("en"),v.literal("ru"))},handler:async(ctx,args)=>{const user=await requireUser(ctx);await ctx.db.patch(user._id,{locale:args.locale});return user._id}});
