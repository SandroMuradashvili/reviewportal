"use client";
import { ShieldCheck } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect,useRef,useState,useSyncExternalStore } from "react";
import { getLocale,Locale } from "@/lib/i18n";
import { legalContent } from "@/lib/legal";

const version="2026-08-16";
const consentCopy={
  ka:{title:"კონფიდენციალურობა და პირობები",body:"გთხოვთ, გაეცნოთ როგორ ვამუშავებთ მონაცემებს და რა წესები მოქმედებს ReviewPortal-ის გამოყენებისას.",hint:"გასაგრძელებლად ჩამოსქროლეთ ბოლომდე",accept:"ვეთანხმები და ვაგრძელებ",full:"სრულ გვერდზე გახსნა",language:"ენა"},
  en:{title:"Privacy and terms",body:"Please review how we handle data and the rules that apply when you use ReviewPortal.",hint:"Scroll to the end to continue",accept:"Accept and continue",full:"Open full pages",language:"Language"},
  ru:{title:"Конфиденциальность и условия",body:"Ознакомьтесь с порядком обработки данных и правилами использования ReviewPortal.",hint:"Прокрутите до конца, чтобы продолжить",accept:"Принять и продолжить",full:"Открыть полные страницы",language:"Язык"},
};
const legalPaths=new Set(["privacy","terms","acceptable-use"]);

export function LegalConsent(){
  const path=usePathname(),pathLocale=getLocale(path.split("/")[1]??"ka");
  const [locale,setLocale]=useState<Locale>(pathLocale),[scrolledToEnd,setScrolledToEnd]=useState(false);
  const accepted=useSyncExternalStore(subscribeConsent,getConsent,()=>false),scrollRef=useRef<HTMLDivElement>(null),t=consentCopy[locale];
  const legalRoute=legalPaths.has(path.split("/")[2]??"");
  useEffect(()=>{
    const frame=requestAnimationFrame(()=>{
      const el=scrollRef.current;
      if(el){el.scrollTop=0;setScrolledToEnd(el.scrollHeight<=el.clientHeight+2)}
    });
    return()=>cancelAnimationFrame(frame);
  },[locale]);
  if(accepted||legalRoute)return null;
  function onScroll(){const el=scrollRef.current;if(el&&el.scrollHeight-el.scrollTop-el.clientHeight<24)setScrolledToEnd(true)}
  return <div className="consent-backdrop"><section className="consent-modal consent-modal-lg" role="dialog" aria-modal="true" aria-labelledby="consent-title" aria-describedby="consent-description">
    <div className="consent-top"><div className="consent-icon"><ShieldCheck size={26}/></div><div className="consent-locales" aria-label={t.language}>{(["ka","en","ru"] as const).map(item=><button key={item} className={item===locale?"active":""} aria-pressed={item===locale} onClick={()=>{setScrolledToEnd(false);setLocale(item)}}>{item.toUpperCase()}</button>)}</div></div>
    <h2 id="consent-title">{t.title}</h2>
    <p id="consent-description">{t.body}</p>
    <div className="consent-scroll" ref={scrollRef} onScroll={onScroll} tabIndex={0}>
      {(["privacy","terms","acceptable-use"] as const).map(key=>{const doc=legalContent[key][locale];return <article key={key} className="consent-doc"><h3>{doc.title}</h3><p className="consent-doc-intro">{doc.intro}</p>{doc.sections.map(([heading,body])=><section key={heading} className="consent-doc-section"><h4>{heading}</h4><p>{body}</p></section>)}</article>})}
    </div>
    <div className="consent-full-links"><span>{t.full}:</span><Link href={`/${locale}/privacy`}>{legalContent.privacy[locale].title}</Link><Link href={`/${locale}/terms`}>{legalContent.terms[locale].title}</Link><Link href={`/${locale}/acceptable-use`}>{legalContent["acceptable-use"][locale].title}</Link></div>
    {!scrolledToEnd?<p className="consent-scroll-hint">{t.hint}</p>:null}
    <button className="button" disabled={!scrolledToEnd} onClick={()=>{localStorage.setItem("reviewportal_legal_consent",version);window.dispatchEvent(new Event("reviewportal-consent"))}}>{t.accept}</button>
  </section></div>;
}
function getConsent(){return localStorage.getItem("reviewportal_legal_consent")===version}
function subscribeConsent(callback:()=>void){window.addEventListener("storage",callback);window.addEventListener("reviewportal-consent",callback);return()=>{window.removeEventListener("storage",callback);window.removeEventListener("reviewportal-consent",callback)}}
