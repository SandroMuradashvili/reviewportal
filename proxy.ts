import { convexAuthNextjsMiddleware,createRouteMatcher,nextjsMiddlewareRedirect } from "@convex-dev/auth/nextjs/server";

const dashboard=createRouteMatcher(["/dashboard(.*)"]);
export const proxy=process.env.NEXT_PUBLIC_CONVEX_URL
  ? convexAuthNextjsMiddleware(async(request,{convexAuth})=>{
      if(dashboard(request)&&!(await convexAuth.isAuthenticated()))return nextjsMiddlewareRedirect(request,"/sign-in");
    })
  : function proxy(){};

export const config={matcher:["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp)$).*)"]};
