export const locales = ["ka", "en", "ru"] as const;
export type Locale = (typeof locales)[number];

export const copy = {
  ka: {
    nav: ["როგორ მუშაობს", "პროდუქტები", "ფასები"], demo: "დემო", login: "შესვლა", createAccount: "ანგარიშის შექმნა", profile: "პროფილი",
    hero: "მიიღეთ გულწრფელი უკუკავშირი და Google შეფასებები.",
    sub: "ყველა მომხმარებელს შეუძლია პირადი უკუკავშირის გაზიარება და Google-ზე შეფასების დატოვება.",
    createReviewLink: "შექმენი შენი შეფასების ბმული", tryIt: "სცადე თავად",
    flowTitle: "როგორ მუშაობს ReviewPortal", flowIntro: "მოუსმინეთ ყველა მომხმარებელს თანაბრად.",
    flow: [{title:"ყველა მომხმარებელი აფასებს",detail:"მომხმარებელი ხსნის თქვენს QR ან NFC ბმულს და გამოცდილებას 1-დან 5 ვარსკვლავამდე აფასებს."},{title:"უკუკავშირი პირადად გეგზავნებათ",detail:"ნებისმიერი შეფასება და კომენტარი თქვენს პირად პანელში ხვდება, რათა მომსახურება გააუმჯობესოთ."},{title:"Google ყველასთვის ხელმისაწვდომია",detail:"ყველა მომხმარებელი, შეფასების მიუხედავად, ხედავს ერთნაირ ღილაკს თქვენი Google შეფასების გვერდისთვის."}],
    how: "სამი მარტივი ნაბიჯი", scan: "მომხმარებელი ასკანერებს", rate: "აფასებს გამოცდილებას", improve: "შენ ხედავ და აუმჯობესებ",
    products: "NFC პროდუქტები", pricing: "მარტივი პაკეტები", feedback: "როგორ შეაფასებდით თქვენს გამოცდილებას?",
    comment: "გსურთ რაიმეს დამატება? (არასავალდებულო)", send: "უკუკავშირის გაგზავნა", thanks: "გმადლობთ — თქვენი უკუკავშირი მიღებულია.",
    private: "თქვენი პასუხი პირადია და გაეგზავნება ბიზნესს.", dashboard: "მართვის პანელი", whatsapp: "მოგვწერე WhatsApp-ზე",
  },
  en: {
    nav: ["How it works", "Products", "Pricing"], demo: "Demo", login: "Login", createAccount: "Create account", profile: "My profile",
    hero: "Collect honest feedback and Google reviews.",
    sub: "Every customer can share private feedback and choose whether to review you on Google.",
    createReviewLink: "Create your review link", tryIt: "Try it yourself",
    flowTitle: "How ReviewPortal works", flowIntro: "Listen to every customer equally.",
    flow: [{title:"Every customer rates",detail:"The customer opens your QR or NFC link and rates their experience from one to five stars."},{title:"Feedback reaches you privately",detail:"Any rating and comment can reach your private dashboard so you can improve the experience."},{title:"Google is open to everyone",detail:"Every customer sees the same option to open your Google review page, regardless of their rating."}],
    how: "Three simple steps", scan: "Customers scan or tap", rate: "They rate the experience", improve: "You learn and improve",
    products: "NFC products", pricing: "Simple plans", feedback: "How would you rate your experience?",
    comment: "Anything you'd like to add? (optional)", send: "Send feedback", thanks: "Thank you — your feedback has been received.",
    private: "Your response is private and shared with the business.", dashboard: "Dashboard", whatsapp: "Ask on WhatsApp",
  },
  ru: {
    nav: ["Как это работает", "Продукты", "Тарифы"], demo: "Демо", login: "Войти", createAccount: "Создать аккаунт", profile: "Профиль",
    hero: "Получайте честную обратную связь и отзывы в Google.",
    sub: "Каждый клиент может отправить личный отзыв и сам решить, публиковать ли отзыв в Google.",
    createReviewLink: "Создать ссылку для отзывов", tryIt: "Попробовать",
    flowTitle: "Как работает ReviewPortal", flowIntro: "Слушайте каждого клиента на равных.",
    flow: [{title:"Каждый клиент ставит оценку",detail:"Клиент открывает QR- или NFC-ссылку и оценивает впечатление от одного до пяти баллов."},{title:"Обратная связь поступает лично",detail:"Любая оценка и комментарий поступают в закрытую панель, помогая улучшать обслуживание."},{title:"Google доступен каждому",detail:"Каждый клиент видит одинаковую возможность открыть страницу отзывов Google независимо от оценки."}],
    how: "Три простых шага", scan: "Клиент сканирует", rate: "Оценивает опыт", improve: "Вы видите и улучшаете",
    products: "NFC-продукты", pricing: "Простые тарифы", feedback: "Как вы оцените свой опыт?",
    comment: "Хотите что-нибудь добавить? (необязательно)", send: "Отправить отзыв", thanks: "Спасибо — ваш отзыв получен.",
    private: "Ваш ответ конфиденциален и будет передан компании.", dashboard: "Панель", whatsapp: "Написать в WhatsApp",
  },
};

export function getLocale(value: string): Locale {
  return locales.includes(value as Locale) ? (value as Locale) : "ka";
}
