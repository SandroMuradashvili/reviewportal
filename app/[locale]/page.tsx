import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, ScanLine, Star, TrendingUp } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { HeroRoutingCard } from "@/components/hero-routing-card";
import { copy, getLocale } from "@/lib/i18n";
import { products, whatsapp } from "@/lib/data";

export default async function Home({params}:{params:Promise<{locale:string}>}) {
  const locale=getLocale((await params).locale), t=copy[locale];
  return <><SiteHeader locale={locale}/><main>
    <section className="container hero"><div><div className="eyebrow">{t.eyebrow}</div><h1>{t.hero}</h1><p className="lede">{t.sub}</p><div className="hero-actions"><Link href={`/${locale}/sign-in`} className="button">{t.start}<ArrowRight size={17}/></Link><Link href={`/${locale}#how`} className="button secondary">{t.nav[0]}</Link></div><p className="trial-note">✓ No credit card required <span>•</span> 2-minute setup</p></div>
    <HeroRoutingCard locale={locale}/></section>
    <section id="how" className="section white"><div className="container"><div className="eyebrow">ReviewPortal</div><div className="section-head"><h2>{t.how}</h2><p className="lede">From a real-world moment to an insight you can act on.</p></div><div className="steps">{[[ScanLine,t.scan],[Star,t.rate],[TrendingUp,t.improve]].map(([Icon,label],i)=>{const I=Icon as typeof ScanLine;return <div className="card" key={String(label)}><div className="step-no">{i+1}</div><I size={28}/><h3 style={{marginTop:20}}>{String(label)}</h3><p>{i===0?"Place a card or stand wherever customers finish their experience.":i===1?"A focused, private and mobile-friendly flow takes only a few taps.":"See patterns, read comments and make your next decision with context."}</p></div>})}</div></div></section>
    <section className="section"><div className="container"><div className="section-head"><div><div className="eyebrow">Physical touchpoints</div><h2>{t.products}</h2></div><Link href={`/${locale}/products`} className="button secondary">{t.nav[1]}<ArrowRight size={16}/></Link></div><div className="product-grid">{products.map(p=><article className="card product" key={p.slug}><Image src={p.image} alt={p.name[locale]} width={700} height={525}/><div className="product-body"><span className="stock">In stock · {p.stock}</span><h3>{p.name[locale]}</h3><p>{p.detail[locale]}</p><a className="button" style={{marginTop:20}} target="_blank" rel="noreferrer" href={whatsapp(`Hello ReviewPortal, I'm interested in ${p.name[locale]}.`)}>{t.whatsapp}</a></div></article>)}</div></div></section>
    <section className="section white"><div className="container"><div className="section-head"><div><div className="eyebrow">Transparent from day one</div><h2>{t.pricing}</h2></div></div><div className="plans"><Plan locale={locale} title="Trial" price="₾0" items={["10 feedback responses","1 customer portal","QR download"]}/><Plan locale={locale} featured title="Growth" price="₾49" items={["Up to 5 portals","Feedback inbox & analytics","Email notifications"]}/><Plan locale={locale} title="Business" price="Let’s talk" items={["Everything in Growth","Priority setup support","Flexible duration"]}/></div></div></section>
    <section className="section"><div className="container cta"><div><div className="eyebrow" style={{color:"var(--lime)"}}>Ready when you are</div><h2>{t.hero}</h2></div><Link className="button light" href={`/${locale}/sign-in`}>{t.start}<ArrowRight size={17}/></Link></div></section>
  </main><SiteFooter locale={locale}/></>;
}

function Plan({locale,title,price,items,featured=false}:{locale:string;title:string;price:string;items:string[];featured?:boolean}) { return <div className={`card plan ${featured?"featured":""}`}><h3>{title}</h3><div className="price">{price}{price.startsWith("₾")&&<small> / month</small>}</div><ul className="checks">{items.map(x=><li key={x}><Check size={16} style={{verticalAlign:"middle",marginRight:8}}/>{x}</li>)}</ul><Link href={`/${locale}/sign-in`} className={`button ${featured?"light":""}`} style={{marginTop:18}}>Get started</Link></div> }
