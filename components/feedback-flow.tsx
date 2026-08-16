"use client";
import { ExternalLink,Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect,useState } from "react";
import { useRouter } from "next/navigation";
import { copy,Locale } from "@/lib/i18n";
import { useMutation,useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const demoGoogleReviewUrl="https://g.page/r/CbYRI-aSFb10EBM/review";
const stateCopy={ka:{loading:"იტვირთება…",missing:"ეს შეფასების ბმული ვერ მოიძებნა.",unavailable:"ეს შეფასების ბმული ამჟამად მიუწვდომელია.",trial:"ამ ბიზნესის საცდელი ლიმიტი ამოიწურა.",google:"დატოვე შეფასება Google-ზე",retry:"გთხოვთ, სცადოთ თავიდან.",privatePrompt:"ვწუხვართ, რომ გამოცდილება იდეალური არ იყო. მოგვწერეთ რა მოხდა, რათა ბიზნესმა პრობლემის მოგვარება შეძლოს.",comment:"რა შეგვიძლია გავაუმჯობესოთ?",required:"კომენტარი სავალდებულოა",processing:"თქვენს უკუკავშირს ვაგზავნით…",close:"დახურვა"},en:{loading:"Loading…",missing:"This review link could not be found.",unavailable:"This review link is not available right now.",trial:"This business has reached its trial response limit.",google:"Leave a review on Google",retry:"Please try again.",privatePrompt:"We’re sorry your experience wasn’t ideal. Tell us what happened so the business can address it.",comment:"What could we improve?",required:"A comment is required",processing:"Sending your feedback…",close:"Close"},ru:{loading:"Загрузка…",missing:"Ссылка для отзывов не найдена.",unavailable:"Ссылка для отзывов сейчас недоступна.",trial:"Компания достигла лимита пробных ответов.",google:"Оставить отзыв в Google",retry:"Попробуйте ещё раз.",privatePrompt:"Нам жаль, что ваш опыт оказался неидеальным. Расскажите, что произошло, чтобы компания могла решить проблему.",comment:"Что мы можем улучшить?",required:"Комментарий обязателен",processing:"Отправляем ваш отзыв…",close:"Закрыть"}};

export function FeedbackFlow({locale,business:demoBusiness,slug}:{locale:Locale;business:string;slug:string}){
  const router=useRouter();
  const demo=slug==="demo",portal=useQuery(api.publicPortal.bySlug,demo?"skip":{slug}),submitFeedback=useMutation(api.feedback.submit),recordVisit=useMutation(api.publicPortal.visit),recordStar=useMutation(api.publicPortal.starSelected),recordRedirect=useMutation(api.publicPortal.redirected);
  const t=copy[locale],s=stateCopy[locale],[rating,setRating]=useState(0),[comment,setComment]=useState(""),[sent,setSent]=useState(false),[revealing,setRevealing]=useState(false),[busy,setBusy]=useState(false),[error,setError]=useState(""),[token,setToken]=useState("");
  useEffect(()=>{if(demo)return;void getVisitToken(slug).then(value=>{setToken(value);void recordVisit({slug,visitTokenHash:value})})},[demo,recordVisit,slug]);
  if(!demo&&portal===undefined)return <StateCard text={s.loading}/>;
  if(!demo&&portal?.state!=="ready")return <StateCard text={portal?.state==="missing"?s.missing:portal?.state==="trial-ended"?s.trial:s.unavailable}/>;
  const readyPortal=!demo&&portal?.state==="ready"?portal:null,business=demo?demoBusiness:readyPortal?.name??"ReviewPortal",prompt=demo?t.feedback:readyPortal?.prompt?.[locale]??t.feedback,destination=demo?demoGoogleReviewUrl:readyPortal?.destinationUrl;
  async function select(value:number){
    setRating(value);
    if(!demo&&token)await recordStar({slug,visitTokenHash:token,rating:value});
    if(value>=4&&destination){
      if(!demo&&token)await recordRedirect({slug,visitTokenHash:token});
      window.location.assign(destination);
    }
  }
  async function submit(){if(rating<1||rating>3||!comment.trim()){setError(s.required);return}setBusy(true);setError("");try{if(demo)await new Promise(resolve=>setTimeout(resolve,250));else await submitFeedback({slug,visitTokenHash:token||await getVisitToken(slug),rating,comment:comment.trim()});setRevealing(true);await new Promise(resolve=>setTimeout(resolve,2400));setSent(true)}catch(reason){setError(reason instanceof Error?reason.message:s.retry)}finally{setRevealing(false);setBusy(false)}}
  async function goToGoogle(){if(!destination)return;if(!demo&&token)await recordRedirect({slug,visitTokenHash:token});window.location.assign(destination)}
  function close(){if(window.history.length>1)router.back();else router.push(`/${locale}`)}
  return <main className={`feedback-page ${demo?"demo-feedback-page":""}`}><section className={`feedback-card ${demo?"demo-feedback-card":""}`} aria-live="polite" aria-busy={revealing}>{demo?<nav className="demo-locales" aria-label="Language">{(["ka","en","ru"] as const).map(item=><Link key={item} className={item===locale?"active":""} href={`/${item}/r/demo`}>{item.toUpperCase()}</Link>)}</nav>:null}<div className="portal-brand-mark">{demo?<Image src="/brand/secondary.svg" alt="ReviewPortal" width={46} height={46}/>:business.slice(0,1)}</div><h1 className="portal-title">{business}</h1>{revealing?<div className="feedback-transition" role="status"><span className="feedback-loader"><i/><i/><i/></span><h2 className="portal-thanks">{s.processing}</h2></div>:sent?<><div className="success-mark">✓</div><h2 className="portal-thanks">{t.thanks}</h2><p className="disclosure">{t.private}</p><button className="button full-button feedback-close" onClick={close}>{s.close}</button>{destination?<button className="google-review-link" onClick={()=>void goToGoogle()}>{s.google}<ExternalLink size={14}/></button>:null}</>:<><p className="portal-prompt">{prompt}</p><div className="stars" role="radiogroup" aria-label={prompt}>{[1,2,3,4,5].map(n=><button key={n} className={`star ${n<=rating?"active":""}`} onClick={()=>void select(n)} role="radio" aria-checked={rating===n} aria-label={`${n} out of 5`}><Star size={42} fill={n<=rating?"currentColor":"none"}/></button>)}</div>{rating>0&&rating<=3?<><p className="private-followup">{s.privatePrompt}</p><label htmlFor="comment" className="comment-label">{s.comment} <span aria-hidden="true">*</span></label><textarea id="comment" required aria-required="true" maxLength={1000} value={comment} onChange={e=>{setComment(e.target.value);if(e.target.value.trim())setError("")}}/><button className="button full-button" disabled={busy||!comment.trim()||(!demo&&!token)} onClick={submit}>{t.send}</button></>:null}{error?<p className="auth-error" role="alert">{error}</p>:null}<p className="disclosure">{t.private}<br/>Powered by ReviewPortal · <a href={`/${locale}/privacy`}>Privacy</a></p></>}</section></main>
}

function StateCard({text}:{text:string}){return <main className="feedback-page"><section className="feedback-card"><ImageMark/><h1 className="portal-thanks">{text}</h1><Link className="button secondary" href="/ka">ReviewPortal</Link></section></main>}
function ImageMark(){return <div className="phone-logo" style={{display:"grid",placeItems:"center",fontWeight:800,color:"var(--green)"}}>R</div>}
async function getVisitToken(slug:string){const key=`rp_visit_${slug}`,existing=localStorage.getItem(key);if(existing)return existing;const raw=crypto.randomUUID(),bytes=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(raw)),token=Array.from(new Uint8Array(bytes),byte=>byte.toString(16).padStart(2,"0")).join("");localStorage.setItem(key,token);return token}
