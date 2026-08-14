"use client";
import { ConvexAuthNextjsProvider } from "@convex-dev/auth/nextjs";
import { ConvexReactClient } from "convex/react";

const url=process.env.NEXT_PUBLIC_CONVEX_URL;
const client=url?new ConvexReactClient(url):null;
export function ConvexProvider({children}:{children:React.ReactNode}){
  return client?<ConvexAuthNextjsProvider client={client}>{children}</ConvexAuthNextjsProvider>:children;
}
