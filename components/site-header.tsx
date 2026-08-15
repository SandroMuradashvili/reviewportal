"use client";

import Image from "next/image";
import Link from "next/link";
import { UserRound } from "lucide-react";
import { useConvexAuth,useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { copy, Locale, locales } from "@/lib/i18n";

export function SiteHeader({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const {isAuthenticated,isLoading}=useConvexAuth(),me=useQuery(api.users.me,isAuthenticated?{}:"skip");
  return <header className="container nav">
    <Link className="brand" href={isAuthenticated?"/dashboard":`/${locale}`}><Image src="/brand/secondary.svg" alt="" width={34} height={34}/>ReviewPortal</Link>
    <nav className="navlinks" aria-label="Primary"><Link href={`/${locale}#how`}>{t.nav[0]}</Link><Link href={`/${locale}/r/demo`}>{t.demo}</Link><Link href={`/${locale}/products`}>{t.nav[1]}</Link><Link href={`/${locale}/pricing`}>{t.nav[2]}</Link></nav>
    <div className="actions"><div className="locale">{locales.map(l=><Link className={l===locale?"current":""} key={l} href={`/${l}`}>{l.toUpperCase()}</Link>)}</div>{!isLoading&&isAuthenticated?<Link className="button profile-button" href="/dashboard"><UserRound size={17}/>{me?.user.name||t.profile}</Link>:!isLoading?<><Link className="button" href={`/${locale}/sign-in`}>{t.createAccount}</Link><Link className="button secondary" href={`/${locale}/sign-in`}>{t.login}</Link></>:null}</div>
  </header>;
}
