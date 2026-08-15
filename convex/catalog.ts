import { query } from "./_generated/server";

export const products=query({args:{},handler:async ctx=>(await ctx.db.query("products").collect()).filter(item=>item.available).sort((a,b)=>a.sortOrder-b.sortOrder)});
export const packages=query({args:{},handler:async ctx=>(await ctx.db.query("packages").collect()).filter(item=>item.visible).sort((a,b)=>(a.sortOrder??0)-(b.sortOrder??0))});
