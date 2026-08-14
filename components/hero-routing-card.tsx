import { ArrowDown, BarChart3, ExternalLink, Inbox, MessageSquareText, Star } from "lucide-react";
import type { Locale } from "@/lib/i18n";

const routingCopy={
  ka:{title:"ჭკვიანი უკუკავშირის ნაკადი",input:"ყველა შეფასება",inputSub:"ერთი სწრაფი, პირადი უკუკავშირის ნაბიჯი",publicTitle:"Google შეფასების ბმული",publicSub:"ერთი და იგივე შესაძლებლობა ყველა მომხმარებლისთვის",privateTitle:"პრობლემის შეტყობინება",privateSub:"დაბალი შეფასება მონიშნულია სწრაფი რეაგირებისთვის",measure:"რას გაზომავ",visits:"ვიზიტები",opens:"ბმულის გახსნა",feedback:"პირადი უკუკავშირი"},
  en:{title:"Smart feedback flow",input:"Every rating",inputSub:"One fast, private feedback step",publicTitle:"Offer Google review link",publicSub:"The same opportunity for every customer",privateTitle:"Flag service issues",privateSub:"Low ratings are highlighted for fast follow-up",measure:"What you can measure",visits:"Total visits",opens:"Review-link opens",feedback:"Private feedback"},
  ru:{title:"Умный поток отзывов",input:"Каждая оценка",inputSub:"Один быстрый шаг личной обратной связи",publicTitle:"Ссылка на отзыв Google",publicSub:"Одинаковая возможность для каждого клиента",privateTitle:"Сигнал о проблеме",privateSub:"Низкие оценки отмечаются для быстрого ответа",measure:"Что вы измеряете",visits:"Все визиты",opens:"Переходы по ссылке",feedback:"Личные отзывы"},
};

export function HeroRoutingCard({locale}:{locale:Locale}){
  const t=routingCopy[locale];
  return <div className="routing-stage"><article className="routing-card">
    <header className="routing-header"><span className="routing-mark"><BarChart3 size={17}/></span><div><span className="routing-kicker">ReviewPortal</span><h2>{t.title}</h2></div><span className="live-badge"><i/> Live</span></header>
    <div className="rating-input"><div><strong>{t.input}</strong><small>{t.inputSub}</small></div><div className="mini-stars" aria-label="Example: four out of five stars">{[1,2,3,4,5].map(n=><Star key={n} size={18} fill={n<5?"currentColor":"none"}/>)}</div></div>
    <div className="flow-arrow"><ArrowDown size={17}/></div>
    <div className="routing-paths">
      <section className="route-item public-route"><span className="route-icon"><ExternalLink size={19}/></span><div><span className="route-label">All ratings</span><h3>{t.publicTitle}</h3><p>{t.publicSub}</p></div></section>
      <section className="route-item private-route"><span className="route-icon"><MessageSquareText size={19}/></span><div><span className="route-label">1–3 stars</span><h3>{t.privateTitle}</h3><p>{t.privateSub}</p></div></section>
    </div>
    <footer className="routing-metrics"><span className="metrics-title">{t.measure}</span><div className="metric-list"><span><BarChart3 size={16}/>{t.visits}</span><span><ExternalLink size={16}/>{t.opens}</span><span><Inbox size={16}/>{t.feedback}</span></div></footer>
  </article></div>;
}
