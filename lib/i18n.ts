export const locales = ["ka", "en", "ru"] as const;
export type Locale = (typeof locales)[number];

export const copy = {
  ka: {
    nav: ["როგორ მუშაობს", "პროდუქტები", "ფასები"], signIn: "შესვლა", start: "დაიწყე უფასოდ",
    eyebrow: "უკუკავშირი და რეპუტაცია ერთ სივრცეში", hero: "უკუკავშირი აქციე უკეთეს მომსახურებად და ძლიერ რეპუტაციად",
    sub: "შეაგროვე პირადი უკუკავშირი, დროულად აღმოაჩინე პრობლემები, გაიგე რა სურთ მომხმარებლებს და ყველას გაუადვილე გულწრფელი შეფასების Google-ზე გაზიარება.",
    how: "სამი მარტივი ნაბიჯი", scan: "მომხმარებელი ასკანერებს", rate: "აფასებს გამოცდილებას", improve: "შენ ხედავ და აუმჯობესებ",
    products: "NFC პროდუქტები", pricing: "მარტივი პაკეტები", feedback: "როგორ შეაფასებდით თქვენს გამოცდილებას?",
    comment: "გსურთ რაიმეს დამატება? (არასავალდებულო)", send: "უკუკავშირის გაგზავნა", thanks: "გმადლობთ — თქვენი უკუკავშირი მიღებულია.",
    private: "თქვენი პასუხი პირადია და გაეგზავნება ბიზნესს.", dashboard: "მართვის პანელი", whatsapp: "მოგვწერე WhatsApp-ზე",
  },
  en: {
    nav: ["How it works", "Products", "Pricing"], signIn: "Sign in", start: "Start free",
    eyebrow: "Feedback and reputation in one place", hero: "Turn feedback into better service and a stronger reputation",
    sub: "Collect private feedback, catch service issues early, understand what customers need, and make it easy for every customer to share an honest Google review.",
    how: "Three simple steps", scan: "Customers scan or tap", rate: "They rate the experience", improve: "You learn and improve",
    products: "NFC products", pricing: "Simple plans", feedback: "How would you rate your experience?",
    comment: "Anything you'd like to add? (optional)", send: "Send feedback", thanks: "Thank you — your feedback has been received.",
    private: "Your response is private and shared with the business.", dashboard: "Dashboard", whatsapp: "Ask on WhatsApp",
  },
  ru: {
    nav: ["Как это работает", "Продукты", "Тарифы"], signIn: "Войти", start: "Начать бесплатно",
    eyebrow: "Отзывы и репутация в одном месте", hero: "Превратите обратную связь в лучший сервис и сильную репутацию",
    sub: "Собирайте личные отзывы, замечайте проблемы раньше, понимайте потребности клиентов и помогайте каждому поделиться честным отзывом в Google.",
    how: "Три простых шага", scan: "Клиент сканирует", rate: "Оценивает опыт", improve: "Вы видите и улучшаете",
    products: "NFC-продукты", pricing: "Простые тарифы", feedback: "Как вы оцените свой опыт?",
    comment: "Хотите что-нибудь добавить? (необязательно)", send: "Отправить отзыв", thanks: "Спасибо — ваш отзыв получен.",
    private: "Ваш ответ конфиденциален и будет передан компании.", dashboard: "Панель", whatsapp: "Написать в WhatsApp",
  },
};

export function getLocale(value: string): Locale {
  return locales.includes(value as Locale) ? (value as Locale) : "ka";
}
