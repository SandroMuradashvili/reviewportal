export const locales = ["ka", "en", "ru"] as const;
export type Locale = (typeof locales)[number];

export const copy = {
  ka: {
    nav: ["როგორ მუშაობს", "პროდუქტები", "ფასები"], demo: "დემო", login: "შესვლა", createAccount: "ანგარიშის შექმნა", profile: "პროფილი",
    hero: "მიიღეთ პირადი უკუკავშირი და Google შეფასებები.",
    sub: "კარგი გამოცდილებისთვის — სწრაფი Google გზა; პრობლემისთვის — პირადი უკუკავშირი და გამოსწორების შესაძლებლობა.",
    createReviewLink: "შექმენი შენი შეფასების ბმული", tryIt: "სცადე თავად",
    flowTitle: "როგორ მუშაობს ReviewPortal", flowIntro: "სწრაფი შეფასება და პრობლემების პირადად მოგვარება.",
    flow: [{title:"ყველა მომხმარებელი აფასებს",detail:"მომხმარებელი ხსნის თქვენს QR ან NFC ბმულს და გამოცდილებას 1-დან 5 ვარსკვლავამდე აფასებს."},{title:"1–3 ვარსკვლავი — პირადი პასუხი",detail:"კომენტარი თქვენს პირად პანელში ხვდება, რათა პრობლემა პირდაპირ მოაგვაროთ."},{title:"4–5 ვარსკვლავი — სწრაფი Google გზა",detail:"მომხმარებელი პირდაპირ ხსნის თქვენს Google შეფასების გვერდს; დაბალი შეფასების ავტორსაც შეუძლია Google-ზე გაგრძელება პასუხის გაგზავნის შემდეგ."}],
    how: "სამი მარტივი ნაბიჯი", scan: "მომხმარებელი ასკანერებს", rate: "აფასებს გამოცდილებას", improve: "შენ ხედავ და აუმჯობესებ",
    products: "NFC პროდუქტები", pricing: "მარტივი პაკეტები", feedback: "როგორ შეაფასებდით თქვენს გამოცდილებას?",
    comment: "გსურთ რაიმეს დამატება? (არასავალდებულო)", send: "უკუკავშირის გაგზავნა", thanks: "გმადლობთ — თქვენი უკუკავშირი მიღებულია.",
    private: "თქვენი პასუხი პირადია და გაეგზავნება ბიზნესს.", dashboard: "მართვის პანელი", whatsapp: "მოგვწერე WhatsApp-ზე",
  },
  en: {
    nav: ["How it works", "Products", "Pricing"], demo: "Demo", login: "Login", createAccount: "Create account", profile: "My profile",
    hero: "Collect private feedback and Google reviews.",
    sub: "A fast Google path for good experiences; private feedback and a chance to recover when something went wrong.",
    createReviewLink: "Create your review link", tryIt: "Try it yourself",
    flowTitle: "How ReviewPortal works", flowIntro: "Fast reviews and private service recovery.",
    flow: [{title:"Every customer rates",detail:"The customer opens your QR or NFC link and rates their experience from one to five stars."},{title:"1–3 stars: private response",detail:"Their comment reaches your private dashboard so you can understand and address the problem."},{title:"4–5 stars: fast Google path",detail:"The customer opens your Google review page immediately; lower-rating customers can also continue to Google after submitting feedback."}],
    how: "Three simple steps", scan: "Customers scan or tap", rate: "They rate the experience", improve: "You learn and improve",
    products: "NFC products", pricing: "Simple plans", feedback: "How would you rate your experience?",
    comment: "Anything you'd like to add? (optional)", send: "Send feedback", thanks: "Thank you — your feedback has been received.",
    private: "Your response is private and shared with the business.", dashboard: "Dashboard", whatsapp: "Ask on WhatsApp",
  },
  ru: {
    nav: ["Как это работает", "Продукты", "Тарифы"], demo: "Демо", login: "Войти", createAccount: "Создать аккаунт", profile: "Профиль",
    hero: "Получайте личную обратную связь и отзывы в Google.",
    sub: "Быстрый переход в Google после хорошего опыта; личный отзыв и возможность исправить проблему — после плохого.",
    createReviewLink: "Создать ссылку для отзывов", tryIt: "Попробовать",
    flowTitle: "Как работает ReviewPortal", flowIntro: "Быстрые отзывы и личное решение проблем.",
    flow: [{title:"Каждый клиент ставит оценку",detail:"Клиент открывает QR- или NFC-ссылку и оценивает впечатление от одного до пяти баллов."},{title:"1–3 звезды: личный ответ",detail:"Комментарий поступает в закрытую панель, чтобы вы могли разобраться и решить проблему."},{title:"4–5 звёзд: быстрый переход в Google",detail:"Клиент сразу открывает страницу отзывов Google; после личного ответа клиенты с низкой оценкой также могут перейти в Google."}],
    how: "Три простых шага", scan: "Клиент сканирует", rate: "Оценивает опыт", improve: "Вы видите и улучшаете",
    products: "NFC-продукты", pricing: "Простые тарифы", feedback: "Как вы оцените свой опыт?",
    comment: "Хотите что-нибудь добавить? (необязательно)", send: "Отправить отзыв", thanks: "Спасибо — ваш отзыв получен.",
    private: "Ваш ответ конфиденциален и будет передан компании.", dashboard: "Панель", whatsapp: "Написать в WhatsApp",
  },
};

export function getLocale(value: string): Locale {
  return locales.includes(value as Locale) ? (value as Locale) : "ka";
}
