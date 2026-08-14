import { ExternalLink, MessageSquareText, Star, Users } from "lucide-react";
import type { Locale } from "@/lib/i18n";

const routingCopy = {
  ka: { kicker:"უკუკავშირის ნაკადი",title:"მარტივი გზა ყოველი შეფასებისთვის",publicLabel:"ყველა შეფასება",publicTitle:"Google-ის ბმულის შეთავაზება",publicSub:"ყველა მომხმარებელი იღებს ერთსა და იმავე შესაძლებლობას.",privateLabel:"1–3 ვარსკვლავი",privateTitle:"პრობლემის პირადად მიღება",privateSub:"დაბალი შეფასება ინიშნება სწრაფი რეაგირებისთვის.",happy:"ნინომ 5 ვარსკვლავი შეაფასა",happySub:"Google-ის შეფასების ბმული გაიხსნა",issue:"გიორგიმ 2 ვარსკვლავი შეაფასა",issueSub:"პრობლემა მონიშნულია რეაგირებისთვის",visits:"ვიზიტი",opens:"ბმულის გახსნა",feedback:"პირადი უკუკავშირი" },
  en: { kicker:"Feedback flow",title:"One simple path for every rating",publicLabel:"All ratings",publicTitle:"Offer Google review link",publicSub:"Every customer gets the same opportunity.",privateLabel:"1–3 stars",privateTitle:"Capture the issue privately",privateSub:"Low ratings are flagged for quick follow-up.",happy:"Amina rated 5 stars",happySub:"Google review link opened",issue:"Omar rated 2 stars",issueSub:"Flagged for private follow-up",visits:"visits",opens:"link opens",feedback:"private feedback" },
  ru: { kicker:"Поток отзывов",title:"Простой путь для каждой оценки",publicLabel:"Все оценки",publicTitle:"Предложить ссылку Google",publicSub:"У каждого клиента одинаковая возможность.",privateLabel:"1–3 звезды",privateTitle:"Получить проблему лично",privateSub:"Низкие оценки отмечаются для быстрого ответа.",happy:"Амина поставила 5 звёзд",happySub:"Открыта ссылка на отзыв Google",issue:"Омар поставил 2 звезды",issueSub:"Отмечено для личного ответа",visits:"визитов",opens:"переходов",feedback:"личных отзывов" },
};

export function HeroRoutingCard({ locale }: { locale: Locale }) {
  const t = routingCopy[locale];
  return <article className="routing-card">
    <header className="routing-header"><span>{t.kicker}</span><h2>{t.title}</h2></header>
    <div className="routing-paths">
      <section className="route-item public-route"><span className="route-label"><ExternalLink size={14}/>{t.publicLabel}</span><h3>{t.publicTitle}</h3><p>{t.publicSub}</p></section>
      <section className="route-item private-route"><span className="route-label"><MessageSquareText size={14}/>{t.privateLabel}</span><h3>{t.privateTitle}</h3><p>{t.privateSub}</p></section>
    </div>
    <div className="routing-activity">
      <div><span><strong>{t.happy}</strong><small>{t.happySub}</small></span><span className="activity-pill public"><ExternalLink size={13}/> Google</span></div>
      <div><span><strong>{t.issue}</strong><small>{t.issueSub}</small></span><span className="activity-pill private"><MessageSquareText size={13}/> Private</span></div>
    </div>
    <footer className="routing-metrics">
      <div><Users size={19}/><strong>184</strong><span>{t.visits}</span></div>
      <div><ExternalLink size={19}/><strong>129</strong><span>{t.opens}</span></div>
      <div><Star size={19}/><strong>31</strong><span>{t.feedback}</span></div>
    </footer>
  </article>;
}
