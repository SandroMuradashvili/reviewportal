import { ExternalLink, MessageSquareText, Users } from "lucide-react";
import type { Locale } from "@/lib/i18n";

const routingCopy = {
  ka: { publicStars:"ყველა შეფასება",publicTitle:"Google-ზე გადასვლა",publicDetail:"Google-ის ბმული ყველასთვის თანაბრად ხელმისაწვდომია.",privateStars:"1–5 ვარსკვლავი",privateTitle:"პირადი უკუკავშირი",privateDetail:"უკუკავშირი პირადად გიზიარდებათ.",visits:"ვიზიტი",redirects:"გადასვლა",feedback:"პირადი პასუხი" },
  en: { publicStars:"Every rating",publicTitle:"Continue to Google",publicDetail:"The Google link is equally available to everyone.",privateStars:"1–5 stars",privateTitle:"Private feedback",privateDetail:"Feedback is shared with you privately.",visits:"visits",redirects:"redirects",feedback:"private feedback" },
  ru: { publicStars:"Любая оценка",publicTitle:"Перейти в Google",publicDetail:"Ссылка Google одинаково доступна каждому.",privateStars:"1–5 звёзд",privateTitle:"Личная обратная связь",privateDetail:"Отзыв передаётся вам лично.",visits:"визитов",redirects:"переходов",feedback:"личных отзывов" },
} satisfies Record<Locale, Record<string, string>>;

export function HeroRoutingCard({ locale }: { locale: Locale }) {
  const t = routingCopy[locale];
  return <div className="hero-routing" aria-label="Review routing example">
    <div className="hero-route hero-route-public"><span className="hero-route-icon"><ExternalLink size={16}/></span><div><small>{t.publicStars}</small><strong>{t.publicTitle}</strong><p>{t.publicDetail}</p></div></div>
    <div className="hero-route hero-route-private"><span className="hero-route-icon"><MessageSquareText size={16}/></span><div><small>{t.privateStars}</small><strong>{t.privateTitle}</strong><p>{t.privateDetail}</p></div></div>
    <div className="hero-routing-metrics">
      <div><Users size={15}/><strong>184</strong><span>{t.visits}</span></div>
      <div><ExternalLink size={15}/><strong>129</strong><span>{t.redirects}</span></div>
      <div><MessageSquareText size={15}/><strong>31</strong><span>{t.feedback}</span></div>
    </div>
  </div>;
}
