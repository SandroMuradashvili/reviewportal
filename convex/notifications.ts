import { mutation,query } from "./_generated/server";
import { v } from "convex/values";
import { requireUser } from "./lib/auth";

export const mine=query({args:{},handler:async ctx=>{const user=await requireUser(ctx);return ctx.db.query("notifications").withIndex("user_date",q=>q.eq("userId",user._id)).order("desc").take(100)}});
export const markRead=mutation({args:{notificationId:v.id("notifications")},handler:async(ctx,args)=>{const user=await requireUser(ctx),row=await ctx.db.get(args.notificationId);if(!row||row.userId!==user._id)throw new Error("Notification not found");await ctx.db.patch(row._id,{readAt:Date.now()})}});
export const markAllRead=mutation({args:{},handler:async ctx=>{const user=await requireUser(ctx),rows=await ctx.db.query("notifications").withIndex("user_date",q=>q.eq("userId",user._id)).collect();for(const row of rows)if(!row.readAt)await ctx.db.patch(row._id,{readAt:Date.now()})}});
