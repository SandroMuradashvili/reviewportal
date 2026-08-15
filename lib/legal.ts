// lib/legal.ts
export type LegalSection = [string, string];

export type LegalDoc = {
  title: string;
  intro: string;
  sections: LegalSection[];
};

export type MultilingualLegalContent = {
  [key: string]: {
    ka: LegalDoc;
    en: LegalDoc;
    ru: LegalDoc;
  };
};

export const legalContent: MultilingualLegalContent = {
  "privacy": {
    ka: {
      title: "კონფიდენციალურობის პოლიტიკა",
      intro: "თქვენი კონფიდენციალურობა ჩვენთვის მნიშვნელოვანია.",
      sections: [["მონაცემთა შეგროვება", "ჩვენ ვაგროვებთ მხოლოდ საჭირო ინფორმაციას..."]]
    },
    en: {
      title: "Privacy Policy",
      intro: "Your privacy is important to us.",
      sections: [["Data Collection", "We only collect necessary information..."]]
    },
    ru: {
      title: "Политика конфиденциальности",
      intro: "Ваша конфиденциальность важна для нас.",
      sections: [["Сбор данных", "Мы собираем только необходимую информацию..."]]
    }
  },
  "terms": {
    ka: {
      title: "მომსახურების პირობები",
      intro: "ReviewPortal-ის გამოყენებით თქვენ ეთანხმებით ამ პირობებს.",
      sections: [["ზოგადი", "ეს წესები არეგულირებს..."]]
    },
    en: {
      title: "Terms of Service",
      intro: "By using ReviewPortal, you agree to these terms.",
      sections: [["General", "These rules govern the use..."]]
    },
    ru: {
      title: "Условия использования",
      intro: "Используя ReviewPortal, вы соглашаетесь с этими условиями.",
      sections: [["Общие положения", "Эти правила регулируют..."]]
    }
  },
  "acceptable-use": {
    ka: {
      title: "მისაღები გამოყენების წესები",
      intro: "ReviewPortal-ის გამოყენების სახელმძღვანელო.",
      sections: [["აკრძალვები", "აკრძალულია სპამი და ფეიკ შეფასებები..."]]
    },
    en: {
      title: "Acceptable Use Policy",
      intro: "Guidelines for using ReviewPortal.",
      sections: [["Prohibitions", "Spam and fake reviews are prohibited..."]]
    },
    ru: {
      title: "Правила допустимого использования",
      intro: "Руководство по использованию ReviewPortal.",
      sections: [["Запреты", "Спам и фальшивые отзывы запрещены..."]]
    }
  }
};