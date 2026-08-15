"use client";

import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState,useSyncExternalStore } from "react";
import { getLocale } from "@/lib/i18n";

const version="2026-08-15";
const consentCopy={
  ka:{title:"სანამ გააგრძელებთ",body:"ReviewPortal-ის გამოყენებით ეთანხმებით კონფიდენციალურობის პოლიტიკასა და მომსახურების პირობებს.",privacy:"კონფიდენციალურობა",terms:"პირობები",check:"წავიკითხე და ვეთანხმები ორივე დოკუმენტს",accept:"ვეთანხმები და გაგრძელება"},
  en:{title:"Before you continue",body:"To use ReviewPortal, please review and accept our Privacy Policy and Terms of Service.",privacy:"Privacy Policy",terms:"Terms of Service",check:"I have read and accept both documents",accept:"Accept and continue"},
  ru:{title:"Перед продолжением",body:"Чтобы использовать ReviewPortal, ознакомьтесь и примите Политику конфиденциальности и Условия обслуживания.",privacy:"Конфиденциальность",terms:"Условия",check:"Я прочитал(а) и принимаю оба документа",accept:"Принять и продолжить"},
};

export function LegalConsent(){
  const path=usePathname(),locale=getLocale(path.split("/")[1]??"ka"),t=consentCopy[locale],accepted=useSyncExternalStore(subscribeConsent,getConsent,()=>false),[checked,setChecked]=useState(false);
  if(accepted)return null;
  return <div className="consent-backdrop" role="presentation"><section className="consent-modal" role="dialog" aria-modal="true" aria-labelledby="consent-title"><div className="consent-icon"><ShieldCheck size={26}/></div><h2 id="consent-title">{t.title}</h2><p>{t.body}</p><div className="consent-links"><Link href={`/${locale}/privacy`} target="_blank">{t.privacy}</Link><Link href={`/${locale}/terms`} target="_blank">{t.terms}</Link></div><label className="consent-check"><input type="checkbox" checked={checked} onChange={event=>setChecked(event.target.checked)}/><span>{t.check}</span></label><button className="button" disabled={!checked} onClick={()=>{localStorage.setItem("reviewportal_legal_consent",version);window.dispatchEvent(new Event("reviewportal-consent"))}}>{t.accept}</button></section></div>;
}

function getConsent(){return localStorage.getItem("reviewportal_legal_consent")===version}
function subscribeConsent(callback:()=>void){window.addEventListener("storage",callback);window.addEventListener("reviewportal-consent",callback);return()=>{window.removeEventListener("storage",callback);window.removeEventListener("reviewportal-consent",callback)}}
