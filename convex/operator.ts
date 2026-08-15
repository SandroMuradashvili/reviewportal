import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const setRoleByEmail=internalMutation({args:{email:v.string(),role:v.union(v.literal("owner"),v.literal("admin"))},handler:async(ctx,args)=>{const users=await ctx.db.query("users").withIndex("email",q=>q.eq("email",args.email.trim().toLowerCase())).collect();await Promise.all(users.map(user=>ctx.db.patch(user._id,{role:args.role,state:"active"})));return {updated:users.length,userIds:users.map(user=>user._id)}}});
