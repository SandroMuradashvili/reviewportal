export const products = [
  { slug: "nfc-stand", image: "/products/stand.jpeg", name: { ka: "NFC + QR სტენდი", en: "NFC + QR stand", ru: "NFC + QR стенд" }, detail: { ka: "მაგიდისთვის — სწრაფი შეხება ან სკანირება", en: "For counters — a quick tap or scan", ru: "Для стойки — касание или сканирование" }, stock: 12 },
  { slug: "nfc-card", image: "/products/card.jpeg", name: { ka: "NFC ბარათი", en: "NFC card", ru: "NFC-карта" }, detail: { ka: "კომპაქტური ბარათი გუნდისთვის", en: "A compact card for your team", ru: "Компактная карта для вашей команды" }, stock: 8 },
  { slug: "starter-set", image: "/products/bundle.png", name: { ka: "საწყისი ნაკრები", en: "Starter bundle", ru: "Стартовый набор" }, detail: { ka: "სტენდი და ბარათი ერთ კომპლექტში", en: "A stand and card in one set", ru: "Стенд и карта в одном наборе" }, stock: 4 },
] as const;

export const whatsapp = (message: string) => `https://wa.me/995577665525?text=${encodeURIComponent(message)}`;
