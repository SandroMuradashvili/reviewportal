import Link from "next/link";
import { Locale } from "@/lib/i18n";
export function SiteFooter({locale}:{locale:Locale}) { return <footer className="footer"><div className="container footer-row"><div className="brand">ReviewPortal</div><div className="footer-links"><Link href={`/${locale}/privacy`}>Privacy</Link><Link href={`/${locale}/terms`}>Terms</Link><Link href={`/${locale}/acceptable-use`}>Acceptable use</Link><Link href={`/${locale}/contact`}>Contact</Link><span>© 2026 ReviewPortal</span></div></div></footer> }
