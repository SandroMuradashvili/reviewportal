"use client";
import { useAuthActions } from "@convex-dev/auth/react";
import { Chrome } from "lucide-react";

export function SignInForm(){const {signIn}=useAuthActions();return <button className="button google" onClick={()=>void signIn("google",{redirectTo:"/dashboard"})}><Chrome size={19}/>Continue with Google</button>}
export function AuthNotConfigured(){return <div><button className="button google" disabled><Chrome size={19}/>Continue with Google</button><p className="trial" style={{lineHeight:1.5}}>Google sign-in is ready for credentials. Follow <strong>docs/GOOGLE_OAUTH_SETUP.md</strong> after the production URL is created.</p></div>}
