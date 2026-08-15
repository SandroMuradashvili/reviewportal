import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ExternalLink, MessageSquareText, Star } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { StarDemo } from "@/components/star-demo";
import { ScrollReveal } from "@/components/scroll-reveal";
import { HeroRoutingCard } from "@/components/hero-routing-card";
import { PlanCatalog, ProductCatalog } from "@/components/catalog";
import { copy, getLocale } from "@/lib/i18n";

export default async function Home({params}:{params:Promise<{locale:string}>}) {
  const locale=getLocale((await params).locale), t=copy[locale];
  return <><SiteHeader locale={locale}/><main>
    <section className="container hero"><ScrollReveal className="hero-copy"><h1>{t.hero}</h1><p className="lede">{t.sub}</p><div className="hero-actions"><Link href={`/${locale}/sign-in`} className="button">{t.createReviewLink}<ArrowRight size={17}/></Link><Link href={`/${locale}/r/demo`} className="button secondary">{t.tryIt}</Link></div><p className="trial-note">✓ No credit card required <span>•</span> 2-minute setup</p></ScrollReveal>
    <ScrollReveal className="hero-visual" delay={120}><div className="portal-mock"><div className="phone"><Image className="phone-logo" src="/brand/secondary.svg" alt="ReviewPortal" width={56} height={56}/><strong>Gvino & Co.</strong><p style={{color:"var(--muted)",fontSize:14,marginTop:8}}>{t.feedback}</p><StarDemo/><div style={{height:8,borderRadius:10,background:"#edf0ed",margin:"30px 20px 10px"}}/><div style={{height:8,width:"65%",borderRadius:10,background:"#edf0ed",margin:"auto"}}/></div><HeroRoutingCard locale={locale}/></div></ScrollReveal></section>
    <section id="how" className="section white"><ScrollReveal className="container"><div className="eyebrow">ReviewPortal</div><div className="section-head"><h2>{t.flowTitle}</h2><p className="lede">{t.flowIntro}</p></div><div className="steps">{t.flow.map((step,i)=>{const icons=[Star,MessageSquareText,ExternalLink] as const,I=icons[i];return <div className="card flow-step" key={step.title}><div className="step-no">{i+1}</div><I size={28}/><h3>{step.title}</h3><p>{step.detail}</p></div>})}</div></ScrollReveal></section>
    <section className="section"><ScrollReveal className="container"><div className="section-head"><div><div className="eyebrow">Physical touchpoints</div><h2>{t.products}</h2></div><Link href={`/${locale}/products`} className="button secondary">{t.nav[1]}<ArrowRight size={16}/></Link></div><ProductCatalog locale={locale} compact/></ScrollReveal></section>
    <section className="section white"><ScrollReveal className="container"><div className="section-head"><div><div className="eyebrow">Transparent from day one</div><h2>{t.pricing}</h2></div></div><PlanCatalog locale={locale}/></ScrollReveal></section>
    <section className="section"><ScrollReveal className="container cta"><div><div className="eyebrow" style={{color:"var(--lime)"}}>Ready when you are</div><h2>{t.hero}</h2></div><Link className="button light" href={`/${locale}/sign-in`}>{t.createReviewLink}<ArrowRight size={17}/></Link></ScrollReveal></section>
  </main><SiteFooter locale={locale}/></>;
}
