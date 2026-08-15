export const locales = ["ka", "en", "ru"] as const;
export type Locale = (typeof locales)[number];

export const copy = {
  ka: {
    nav: ["როგორ მუშაობს", "პროდუქტები", "ფასები"], demo: "დემო", login: "შესვლა", createAccount: "ანგარიშის შექმნა", profile: "პროფილი",
    hero: "აქციეთ უკუკავშირი 5-ვარსკვლავიან Google შეფასებებად.",
    sub: "კმაყოფილი მომხმარებლები Google-ზე, უკმაყოფილოები პირად უკუკავშირის არხზე.",
    createReviewLink: "შექმენი შენი შეფასების ბმული", tryIt: "სცადე თავად",
    flowTitle: "როგორ მუშაობს ReviewPortal", flowIntro: "მოაშორე ცუდი შეფასებები შენს ბიზნესს.",
    flow: [{title:"ყველა მომხმარებელი აფასებს",detail:"მომხმარებელი ხსნის თქვენს QR ან NFC ბმულს და გამოცდილებას 1-დან 5 ვარსკვლავამდე აფასებს."},{title:"დაბალი შეფასება პირადია",detail:"დაბალი შეფასება და კომენტარი თქვენს პირად პანელში ხვდება, რათა პრობლემა პირდაპირ მოაგვაროთ."},{title:"კმაყოფილი მომხმარებელი გადადის Google-ზე",detail:"კარგი შეფასების შემდეგ მომხმარებელს ეძლევა მკაფიო ღილაკი თქვენი Google შეფასების გვერდის გასახსნელად."}],
    how: "სამი მარტივი ნაბიჯი", scan: "მომხმარებელი ასკანერებს", rate: "აფასებს გამოცდილებას", improve: "შენ ხედავ და აუმჯობესებ",
    products: "NFC პროდუქტები", pricing: "მარტივი პაკეტები", feedback: "როგორ შეაფასებდით თქვენს გამოცდილებას?",
    comment: "გსურთ რაიმეს დამატება? (არასავალდებულო)", send: "უკუკავშირის გაგზავნა", thanks: "გმადლობთ — თქვენი უკუკავშირი მიღებულია.",
    private: "თქვენი პასუხი პირადია და გაეგზავნება ბიზნესს.", dashboard: "მართვის პანელი", whatsapp: "მოგვწერე WhatsApp-ზე",
  },
  en: {
    nav: ["How it works", "Products", "Pricing"], demo: "Demo", login: "Login", createAccount: "Create account", profile: "My profile",
    hero: "Turn feedback into 5-star Google reviews.",
    sub: "Send happy customers to Google and unhappy ones to a private feedback channel",
    createReviewLink: "Create your review link", tryIt: "Try it yourself",
    flowTitle: "How ReviewPortal works", flowIntro: "Keep bad reviews away from your business.",
    flow: [{title:"Every customer rates",detail:"The customer opens your QR or NFC link and rates their experience from one to five stars."},{title:"Low ratings stay private",detail:"Low ratings and comments go to your private dashboard so you can understand and resolve the issue directly."},{title:"Happy customers continue to Google",detail:"After a positive rating, the customer sees a clear button to open your Google review page."}],
    how: "Three simple steps", scan: "Customers scan or tap", rate: "They rate the experience", improve: "You learn and improve",
    products: "NFC products", pricing: "Simple plans", feedback: "How would you rate your experience?",
    comment: "Anything you'd like to add? (optional)", send: "Send feedback", thanks: "Thank you — your feedback has been received.",
    private: "Your response is private and shared with the business.", dashboard: "Dashboard", whatsapp: "Ask on WhatsApp",
  },
  ru: {
    nav: ["Как это работает", "Продукты", "Тарифы"], demo: "Демо", login: "Войти", createAccount: "Создать аккаунт", profile: "Профиль",
    hero: "Превратите отзывы в 5-звездочные оценки в Google.",
    sub: "Довольных клиентов в Google, недовольных в приватный канал обратной связи.",
    createReviewLink: "Создать ссылку для отзывов", tryIt: "Попробовать",
    flowTitle: "Как работает ReviewPortal", flowIntro: "Защитите свой бизнес от плохих отзывов.",
    flow: [{title:"Каждый клиент ставит оценку",detail:"Клиент открывает QR- или NFC-ссылку и оценивает впечатление от одного до пяти баллов."},{title:"Низкие оценки остаются личными",detail:"Низкие оценки и комментарии поступают в вашу закрытую панель, чтобы вы могли напрямую решить проблему."},{title:"Довольные клиенты переходят в Google",detail:"После высокой оценки клиент видит понятную кнопку для перехода на страницу отзывов Google."}],
    how: "Три простых шага", scan: "Клиент сканирует", rate: "Оценивает опыт", improve: "Вы видите и улучшаете",
    products: "NFC-продукты", pricing: "Простые тарифы", feedback: "Как вы оцените свой опыт?",
    comment: "Хотите что-нибудь добавить? (необязательно)", send: "Отправить отзыв", thanks: "Спасибо — ваш отзыв получен.",
    private: "Ваш ответ конфиденциален и будет передан компании.", dashboard: "Панель", whatsapp: "Написать в WhatsApp",
  },
};

export function getLocale(value: string): Locale {
  return locales.includes(value as Locale) ? (value as Locale) : "ka";
}
