"use client";
import { ShieldCheck } from "lucide-react";
import { usePathname } from "next/navigation";
import { useRef,useState,useSyncExternalStore } from "react";
import { getLocale } from "@/lib/i18n";
import { legalContent } from "@/lib/legal";
const version="2026-08-15";
const consentCopy={
  ka:{title:"სანამ გააგრძელებთ",body:"ReviewPortal-ის გამოყენებით ეთანხმებით კონფიდენციალურობის პოლიტიკასა და მომსახურების პირობებს.",scrollHint:"გთხოვთ ჩამოაქროლოთ ბოლომდე დასათანხმებლად",accept:"ვეთანხმები და გაგრძელება"},
  en:{title:"Before you continue",body:"To use ReviewPortal, please review our Privacy Policy and Terms of Service below.",scrollHint:"Scroll to the end to enable Accept",accept:"Accept and continue"},
  ru:{title:"Перед продолжением",body:"Чтобы использовать ReviewPortal, ознакомьтесь с Политикой конфиденциальности и Условиями обслуживания ниже.",scrollHint:"Прокрутите до конца, чтобы включить кнопку",accept:"Принять и продолжить"},
};
export function LegalConsent(){
  const path=usePathname(),locale=getLocale(path.split("/")[1]??"ka"),t=consentCopy[locale];
  const accepted=useSyncExternalStore(subscribeConsent,getConsent,()=>false);
  const [scrolledToEnd,setScrolledToEnd]=useState(false);
  const scrollRef=useRef<HTMLDivElement>(null);
  if(accepted)return null;
  function onScroll(){
    const el=scrollRef.current;if(!el)return;
    const reachedEnd=el.scrollHeight-el.scrollTop-el.clientHeight<24;
    if(reachedEnd)setScrolledToEnd(true);
  }
  return <div className="consent-backdrop" role="presentation"><section className="consent-modal consent-modal-lg" role="dialog" aria-modal="true" aria-labelledby="consent-title">
    <div className="consent-icon"><ShieldCheck size={26}/></div>
    <h2 id="consent-title">{t.title}</h2>
    <p>{t.body}</p>
    <div className="consent-scroll" ref={scrollRef} onScroll={onScroll}>
      {(["privacy","terms","acceptable-use"] as const).map(key=>{const doc=legalContent[key][locale];return <div key={key} className="consent-doc"><h3>{doc.title}</h3><p className="consent-doc-intro">{doc.intro}</p>{doc.sections.map(([h,p])=><div key={h} className="consent-doc-section"><h4>{h}</h4><p>{p}</p></div>)}</div>})}
    </div>
    {!scrolledToEnd?<p className="consent-scroll-hint">{t.scrollHint}</p>:null}
    <button className="button" disabled={!scrolledToEnd} onClick={()=>{localStorage.setItem("reviewportal_legal_consent",version);window.dispatchEvent(new Event("reviewportal-consent"))}}>{t.accept}</button>
  </section></div>;
}
function getConsent(){return localStorage.getItem("reviewportal_legal_consent")===version}
function subscribeConsent(callback:()=>void){window.addEventListener("storage",callback);window.addEventListener("reviewportal-consent",callback);return()=>{window.removeEventListener("storage",callback);window.removeEventListener("reviewportal-consent",callback)}}
