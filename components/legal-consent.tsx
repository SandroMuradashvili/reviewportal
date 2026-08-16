"use client";
import { ShieldCheck } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { getLocale } from "@/lib/i18n";
const version="2026-08-16";
const consentCopy={
  ka:{title:"კონფიდენციალურობა და პირობები",body:"გთხოვთ, გაეცნოთ როგორ ვამუშავებთ მონაცემებს და რა წესები მოქმედებს ReviewPortal-ის გამოყენებისას.",privacy:"კონფიდენციალურობა",terms:"მომსახურების პირობები",acceptable:"მისაღები გამოყენება",continue:"გასაგებია"},
  en:{title:"Privacy and terms",body:"Please review how we handle data and the rules that apply when you use ReviewPortal.",privacy:"Privacy Policy",terms:"Terms of Service",acceptable:"Acceptable Use",continue:"Continue"},
  ru:{title:"Конфиденциальность и условия",body:"Ознакомьтесь с порядком обработки данных и правилами использования ReviewPortal.",privacy:"Конфиденциальность",terms:"Условия сервиса",acceptable:"Допустимое использование",continue:"Продолжить"},
};
export function LegalConsent(){
  const path=usePathname(),locale=getLocale(path.split("/")[1]??"ka"),t=consentCopy[locale];
  const accepted=useSyncExternalStore(subscribeConsent,getConsent,()=>false);
  if(accepted)return null;
  return <div className="consent-backdrop"><section className="consent-modal" role="dialog" aria-modal="true" aria-labelledby="consent-title" aria-describedby="consent-description">
    <div className="consent-icon"><ShieldCheck size={26}/></div>
    <h2 id="consent-title">{t.title}</h2>
    <p id="consent-description">{t.body}</p>
    <div className="consent-links"><Link href={`/${locale}/privacy`}>{t.privacy}</Link><Link href={`/${locale}/terms`}>{t.terms}</Link><Link href={`/${locale}/acceptable-use`}>{t.acceptable}</Link></div>
    <button className="button" onClick={()=>{localStorage.setItem("reviewportal_legal_consent",version);window.dispatchEvent(new Event("reviewportal-consent"))}}>{t.continue}</button>
  </section></div>;
}
function getConsent(){return localStorage.getItem("reviewportal_legal_consent")===version}
function subscribeConsent(callback:()=>void){window.addEventListener("storage",callback);window.addEventListener("reviewportal-consent",callback);return()=>{window.removeEventListener("storage",callback);window.removeEventListener("reviewportal-consent",callback)}}
