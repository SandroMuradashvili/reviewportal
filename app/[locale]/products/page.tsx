import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProductCatalog } from "@/components/catalog";
import { copy, getLocale } from "@/lib/i18n";
export default async function Products({params}:{params:Promise<{locale:string}>}) { const locale=getLocale((await params).locale),t=copy[locale]; return <><SiteHeader locale={locale}/><main className="section"><div className="container"><div className="eyebrow">Tap. Scan. Listen.</div><h1 style={{fontSize:"clamp(44px,6vw,70px)"}}>{t.products}</h1><p className="lede">Durable branded touchpoints that connect the moment of service to your private feedback portal.</p><div style={{marginTop:50}}><ProductCatalog locale={locale}/></div></div></main><SiteFooter locale={locale}/></> }
