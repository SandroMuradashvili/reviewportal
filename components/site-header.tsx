import Image from "next/image";
import Link from "next/link";
import { copy, Locale, locales } from "@/lib/i18n";

export function SiteHeader({ locale }: { locale: Locale }) {
  const t = copy[locale];
  return <header className="container nav">
    <Link className="brand" href={`/${locale}`}><Image src="/brand/secondary.svg" alt="" width={34} height={34}/>ReviewPortal</Link>
    <nav className="navlinks" aria-label="Primary"><Link href={`/${locale}#how`}>{t.nav[0]}</Link><Link href={`/${locale}/products`}>{t.nav[1]}</Link><Link href={`/${locale}/pricing`}>{t.nav[2]}</Link></nav>
    <div className="actions"><div className="locale">{locales.map(l=><Link className={l===locale?"current":""} key={l} href={`/${l}`}>{l.toUpperCase()}</Link>)}</div><Link className="button secondary" href={`/${locale}/sign-in`}>{t.signIn}</Link><Link className="button" href={`/${locale}/sign-in`}>{t.start}</Link></div>
  </header>;
}
