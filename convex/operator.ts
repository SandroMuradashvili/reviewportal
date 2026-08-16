import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const mergeDuplicateUsersByEmail=internalMutation({args:{email:v.string()},handler:async(ctx,args)=>{
  const email=args.email.trim().toLowerCase(),matches=(await ctx.db.query("users").collect()).filter(user=>user.email?.trim().toLowerCase()===email);
  if(matches.length<2)return {merged:0,primaryId:matches[0]?._id};
  const scored=await Promise.all(matches.map(async user=>({user,accounts:await ctx.db.query("authAccounts").withIndex("userIdAndProvider",q=>q.eq("userId",user._id)).collect(),portals:await ctx.db.query("portals").withIndex("owner",q=>q.eq("ownerId",user._id)).collect()})));
  scored.sort((a,b)=>(Number(Boolean(b.user.emailVerificationTime))*100+Number(Boolean(b.user.name))*20+b.portals.length*10+b.accounts.length)-(Number(Boolean(a.user.emailVerificationTime))*100+Number(Boolean(a.user.name))*20+a.portals.length*10+a.accounts.length));
  const primary=scored[0];
  for(const duplicate of scored.slice(1)){
    for(const portal of duplicate.portals)await ctx.db.patch(portal._id,{ownerId:primary.user._id});
    const duplicateSubs=await ctx.db.query("subscriptions").withIndex("owner",q=>q.eq("ownerId",duplicate.user._id)).collect(),primarySub=await ctx.db.query("subscriptions").withIndex("owner",q=>q.eq("ownerId",primary.user._id)).unique();
    for(const sub of duplicateSubs){if(!primarySub)await ctx.db.patch(sub._id,{ownerId:primary.user._id});else await ctx.db.delete(sub._id)}
    for(const account of duplicate.accounts)await ctx.db.patch(account._id,{userId:primary.user._id});
    for(const session of await ctx.db.query("authSessions").withIndex("userId",q=>q.eq("userId",duplicate.user._id)).collect())await ctx.db.patch(session._id,{userId:primary.user._id});
    for(const acceptance of await ctx.db.query("legalAcceptances").withIndex("user",q=>q.eq("userId",duplicate.user._id)).collect())await ctx.db.patch(acceptance._id,{userId:primary.user._id});
    await ctx.db.delete(duplicate.user._id);
  }
  await ctx.db.patch(primary.user._id,{email,name:primary.user.name??matches.find(user=>user.name)?.name,image:primary.user.image??matches.find(user=>user.image)?.image});
  return {merged:matches.length-1,primaryId:primary.user._id};
}});

export const setRoleByEmail=internalMutation({args:{email:v.string(),role:v.union(v.literal("owner"),v.literal("admin"))},handler:async(ctx,args)=>{const users=await ctx.db.query("users").withIndex("email",q=>q.eq("email",args.email.trim().toLowerCase())).collect();await Promise.all(users.map(user=>ctx.db.patch(user._id,{role:args.role,state:"active"})));return {updated:users.length,userIds:users.map(user=>user._id)}}});
