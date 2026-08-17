"use client";
import { ExternalLink, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { copy, Locale } from "@/lib/i18n";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const demoGoogleReviewUrl = "https://g.page/r/CbYRI-aSFb10EBM/review";
const demoGoogleBusinessUrl = "https://g.page/r/CbYRI-aSFb10EBM";
const issueCategoryKeys = [
  "quality",
  "service",
  "value",
  "wait",
  "cleanliness",
  "atmosphere",
  "accuracy",
  "other",
] as const;
type IssueCategory = (typeof issueCategoryKeys)[number];
const stateCopy = {
  ka: {
    loading: "იტვირთება…",
    missing: "ეს შეფასების ბმული ვერ მოიძებნა.",
    unavailable: "ეს შეფასების ბმული ამჟამად მიუწვდომელია.",
    trial: "ამ ბიზნესის საცდელი ლიმიტი ამოიწურა.",
    business: "ბიზნესის ნახვა Google-ზე",
    retry: "გთხოვთ, სცადოთ თავიდან.",
    privatePrompt:
      "ვწუხვართ, რომ გამოცდილება იდეალური არ იყო. მოგვწერეთ რა მოხდა, რათა ბიზნესმა პრობლემის მოგვარება შეძლოს.",
    categoryTitle: "რა საჭიროებს გაუმჯობესებას?",
    categoryHint: "აირჩიეთ ერთი ან ორი",
    categories: {
      quality: "პროდუქტის ან საკვების ხარისხი",
      service: "მომსახურება",
      value: "ფასი და ღირებულება",
      wait: "ლოდინის დრო",
      cleanliness: "სისუფთავე",
      atmosphere: "გარემო",
      accuracy: "შეკვეთის სიზუსტე",
      other: "სხვა",
    },
    comment: "რა შეგვიძლია გავაუმჯობესოთ?",
    required: "შეავსეთ მონიშნული ველები",
    categoryRequired: "აირჩიეთ ერთი ან ორი საკითხი",
    commentRequired: "კომენტარის დაწერა სავალდებულოა",
    consentRequired: "გთხოვთ, მონიშნოთ თანხმობის ველი უკუკავშირის გაგზავნამდე",
    dataSummary: "როგორ იქნება გამოყენებული ჩემი უკუკავშირი?",
    dataBody:
      "თქვენი შეფასება, საკითხები და კომენტარი შეინახება და გაეზიარება ამ ბიზნესს საჩივრის განხილვის, მომსახურების გაუმჯობესებისა და კონფიდენციალურობის პოლიტიკაში აღწერილი უსაფრთხო ანალიტიკისთვის. ReviewPortal არ ითხოვს თქვენს ვინაობას, თუმცა იყენებს შემთხვევით მოწყობილობის ტოკენს დუბლირებული პასუხების შესამცირებლად. კომენტარში არ მიუთითოთ სახელი, ტელეფონი, ელფოსტა, ჯანმრთელობის ან სხვა საიდენტიფიკაციო მონაცემი.",
    dataConfirm:
      "წავიკითხე და მესმის, როგორ შეინახება და გაეზიარება ჩემი უკუკავშირი",
    processing: "თქვენს უკუკავშირს ვაგზავნით…",
    close: "დახურვა",
    language: "ენა",
    rating: (n: number) => `${n} ვარსკვლავი 5-დან`,
    powered: "შექმნილია ReviewPortal-ით",
    privacy: "კონფიდენციალურობა",
  },
  en: {
    loading: "Loading…",
    missing: "This review link could not be found.",
    unavailable: "This review link is not available right now.",
    trial: "This business has reached its trial response limit.",
    business: "View the business on Google",
    retry: "Please try again.",
    privatePrompt:
      "We’re sorry your experience wasn’t ideal. Tell us what happened so the business can address it.",
    categoryTitle: "What needs improvement?",
    categoryHint: "Choose one or two",
    categories: {
      quality: "Product or food quality",
      service: "Service",
      value: "Price and value",
      wait: "Waiting time",
      cleanliness: "Cleanliness",
      atmosphere: "Atmosphere",
      accuracy: "Order accuracy",
      other: "Other",
    },
    comment: "What could we improve?",
    required: "Complete the highlighted fields",
    categoryRequired: "Choose one or two issues",
    commentRequired: "A comment is required",
    consentRequired:
      "Please check the acknowledgement box before sending your feedback",
    dataSummary: "How will my feedback be used?",
    dataBody:
      "Your rating, issue categories and comment will be stored and shared with this business to handle the complaint, improve its service, and provide the secure analytics described in the Privacy Policy. ReviewPortal does not ask for your identity, but uses a random device token to reduce duplicate responses. Do not include your name, phone, email, health information, or other identifying data in the comment.",
    dataConfirm:
      "I have read and understand how my feedback will be stored and shared",
    processing: "Sending your feedback…",
    close: "Close",
    language: "Language",
    rating: (n: number) => `${n} out of 5`,
    powered: "Powered by ReviewPortal",
    privacy: "Privacy",
  },
  ru: {
    loading: "Загрузка…",
    missing: "Ссылка для отзывов не найдена.",
    unavailable: "Ссылка для отзывов сейчас недоступна.",
    trial: "Компания достигла лимита пробных ответов.",
    business: "Открыть компанию в Google",
    retry: "Попробуйте ещё раз.",
    privatePrompt:
      "Нам жаль, что ваш опыт оказался неидеальным. Расскажите, что произошло, чтобы компания могла решить проблему.",
    categoryTitle: "Что следует улучшить?",
    categoryHint: "Выберите один или два пункта",
    categories: {
      quality: "Качество продукта или еды",
      service: "Обслуживание",
      value: "Цена и ценность",
      wait: "Время ожидания",
      cleanliness: "Чистота",
      atmosphere: "Атмосфера",
      accuracy: "Точность заказа",
      other: "Другое",
    },
    comment: "Что мы можем улучшить?",
    required: "Заполните отмеченные поля",
    categoryRequired: "Выберите одну или две проблемы",
    commentRequired: "Комментарий обязателен",
    consentRequired: "Перед отправкой отзыва поставьте отметку в поле согласия",
    dataSummary: "Как будет использован мой отзыв?",
    dataBody:
      "Оценка, категории проблемы и комментарий сохраняются и передаются этой компании для рассмотрения жалобы, улучшения обслуживания и защищённой аналитики, описанной в Политике конфиденциальности. ReviewPortal не запрашивает вашу личность, но использует случайный токен устройства для уменьшения повторных ответов. Не указывайте имя, телефон, email, сведения о здоровье или другие идентифицирующие данные.",
    dataConfirm:
      "Я прочитал(а) и понимаю, как мой отзыв будет храниться и передаваться",
    processing: "Отправляем ваш отзыв…",
    close: "Закрыть",
    language: "Язык",
    rating: (n: number) => `${n} из 5`,
    powered: "Создано с помощью ReviewPortal",
    privacy: "Конфиденциальность",
  },
};

export function FeedbackFlow({
  locale,
  business: demoBusiness,
  slug,
}: {
  locale: Locale;
  business: string;
  slug: string;
}) {
  const router = useRouter();
  const demo = slug === "demo",
    portal = useQuery(api.publicPortal.bySlug, demo ? "skip" : { slug }),
    submitFeedback = useMutation(api.feedback.submit),
    recordVisit = useMutation(api.publicPortal.visit),
    recordStar = useMutation(api.publicPortal.starSelected),
    recordRedirect = useMutation(api.publicPortal.redirected);
  const t = copy[locale],
    s = stateCopy[locale],
    [rating, setRating] = useState(0),
    [categories, setCategories] = useState<IssueCategory[]>([]),
    [comment, setComment] = useState(""),
    [dataAcknowledged, setDataAcknowledged] = useState(false),
    [attempted, setAttempted] = useState(false),
    [sent, setSent] = useState(false),
    [revealing, setRevealing] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [token, setToken] = useState("");
  const dataPanelRef = useRef<HTMLDetailsElement>(null),
    consentRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (demo) return;
    void getVisitToken(slug).then((value) => {
      setToken(value);
      void recordVisit({ slug, visitTokenHash: value });
    });
  }, [demo, recordVisit, slug]);
  if (!demo && portal === undefined) return <StateCard text={s.loading} />;
  if (!demo && portal?.state !== "ready")
    return (
      <StateCard
        text={
          portal?.state === "missing"
            ? s.missing
            : portal?.state === "trial-ended"
              ? s.trial
              : s.unavailable
        }
      />
    );
  const readyPortal = !demo && portal?.state === "ready" ? portal : null,
    business = demo ? demoBusiness : (readyPortal?.name ?? "ReviewPortal"),
    prompt = demo ? t.feedback : (readyPortal?.prompt?.[locale] ?? t.feedback),
    reviewDestination = demo
      ? demoGoogleReviewUrl
      : readyPortal?.destinationUrl,
    businessDestination = demo
      ? demoGoogleBusinessUrl
      : readyPortal?.businessUrl,
    logoUrl = readyPortal?.logoUrl;
  async function select(value: number) {
    setRating(value);
    if (!demo && token)
      await recordStar({ slug, visitTokenHash: token, rating: value });
    if (value >= 4 && reviewDestination) {
      if (!demo && token) await recordRedirect({ slug, visitTokenHash: token });
      window.location.assign(reviewDestination);
    }
  }
  function toggleCategory(category: IssueCategory) {
    setCategories((current) =>
      current.includes(category)
        ? current.filter((item) => item !== category)
        : current.length < 2
          ? [...current, category]
          : current,
    );
    setError("");
  }
  async function submit() {
    setAttempted(true);
    if (
      rating < 1 ||
      rating > 3 ||
      categories.length < 1 ||
      categories.length > 2 ||
      !comment.trim() ||
      !dataAcknowledged
    ) {
      setError(s.required);
      if (!dataAcknowledged) {
        if (dataPanelRef.current) dataPanelRef.current.open = true;
        requestAnimationFrame(() => {
          consentRef.current?.focus();
          consentRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        });
      }
      return;
    }
    setBusy(true);
    setError("");
    try {
      if (demo) await new Promise((resolve) => setTimeout(resolve, 250));
      else
        await submitFeedback({
          slug,
          visitTokenHash: token || (await getVisitToken(slug)),
          rating,
          comment: comment.trim(),
          issueCategories: categories,
          dataAcknowledged,
        });
      setRevealing(true);
      await new Promise((resolve) => setTimeout(resolve, 4800));
      setSent(true);
    } catch {
      setError(s.retry);
    } finally {
      setRevealing(false);
      setBusy(false);
    }
  }
  async function goToBusiness() {
    if (!businessDestination) return;
    if (!demo && token) await recordRedirect({ slug, visitTokenHash: token });
    window.location.assign(businessDestination);
  }
  function close() {
    router.push(`/${locale}`);
  }
  return (
    <main className={`feedback-page ${demo ? "demo-feedback-page" : ""}`}>
      <section
        className={`feedback-card ${demo ? "demo-feedback-card" : ""}`}
        aria-live="polite"
        aria-busy={revealing}
      >
        <nav className="demo-locales" aria-label={s.language}>
          {(["ka", "en", "ru"] as const).map((item) => (
            <Link
              key={item}
              className={item === locale ? "active" : ""}
              href={`/${item}/r/${slug}`}
            >
              {item.toUpperCase()}
            </Link>
          ))}
        </nav>
        <div className="portal-brand-mark">
          {demo ? (
            <Image
              src="/brand/secondary.svg"
              alt="ReviewPortal"
              width={46}
              height={46}
            />
          ) : logoUrl ? (
            <Image src={logoUrl} alt="" width={58} height={58} />
          ) : (
            business.slice(0, 1)
          )}
        </div>
        <h1
          className={`portal-title ${sent ? "success-reveal success-delay-1" : ""}`}
        >
          {business}
        </h1>
        {revealing ? (
          <div className="feedback-transition" role="status">
            <span className="feedback-loader">
              <i />
              <i />
              <i />
            </span>
            <h2 className="portal-thanks">{s.processing}</h2>
          </div>
        ) : sent ? (
          <>
            <div className="success-mark success-reveal success-delay-2">✓</div>
            <h2 className="portal-thanks success-reveal success-delay-3">
              {t.thanks}
            </h2>
            <p className="disclosure success-reveal success-delay-4">
              {t.private}
            </p>
            <button
              className="button full-button feedback-close success-reveal success-delay-5"
              onClick={close}
            >
              {s.close}
            </button>
            {businessDestination ? (
              <button
                className="google-review-link success-reveal success-delay-6"
                onClick={() => void goToBusiness()}
              >
                {s.business}
                <ExternalLink size={14} />
              </button>
            ) : null}
          </>
        ) : (
          <>
            <p className="portal-prompt">{prompt}</p>
            <div className="stars" role="radiogroup" aria-label={prompt}>
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  className={`star ${n <= rating ? "active" : ""}`}
                  onClick={() => void select(n)}
                  role="radio"
                  aria-checked={rating === n}
                  aria-label={s.rating(n)}
                >
                  <Star
                    size={42}
                    fill={n <= rating ? "currentColor" : "none"}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && rating <= 3 ? (
              <>
                <p className="private-followup">{s.privatePrompt}</p>
                <fieldset
                  className={`issue-categories ${attempted && !categories.length ? "field-invalid" : ""}`}
                  aria-describedby={
                    attempted && !categories.length
                      ? "category-error"
                      : undefined
                  }
                >
                  <legend>
                    {s.categoryTitle} <span>{s.categoryHint}</span>
                  </legend>
                  <div>
                    {issueCategoryKeys.map((category) => (
                      <button
                        type="button"
                        key={category}
                        className={
                          categories.includes(category) ? "active" : ""
                        }
                        aria-pressed={categories.includes(category)}
                        onClick={() => toggleCategory(category)}
                      >
                        {s.categories[category]}
                      </button>
                    ))}
                  </div>
                  {attempted && !categories.length ? (
                    <p id="category-error" className="field-error">
                      {s.categoryRequired}
                    </p>
                  ) : null}
                </fieldset>
                <label htmlFor="comment" className="comment-label">
                  {s.comment} <span aria-hidden="true">*</span>
                </label>
                <textarea
                  id="comment"
                  className={
                    attempted && !comment.trim() ? "field-invalid" : ""
                  }
                  required
                  aria-required="true"
                  aria-invalid={attempted && !comment.trim()}
                  aria-describedby={
                    attempted && !comment.trim() ? "comment-error" : undefined
                  }
                  maxLength={1000}
                  value={comment}
                  onChange={(e) => {
                    setComment(e.target.value);
                    setError("");
                  }}
                />
                {attempted && !comment.trim() ? (
                  <p id="comment-error" className="field-error">
                    {s.commentRequired}
                  </p>
                ) : null}
                <details
                  ref={dataPanelRef}
                  className={`feedback-data-panel ${attempted && !dataAcknowledged ? "field-invalid" : ""}`}
                >
                  <summary>{s.dataSummary}</summary>
                  <p>{s.dataBody}</p>
                  <label>
                    <input
                      ref={consentRef}
                      type="checkbox"
                      checked={dataAcknowledged}
                      aria-invalid={attempted && !dataAcknowledged}
                      aria-describedby={
                        attempted && !dataAcknowledged
                          ? "consent-error"
                          : undefined
                      }
                      onChange={(e) => {
                        setDataAcknowledged(e.target.checked);
                        setError("");
                      }}
                    />
                    <span>{s.dataConfirm}</span>
                  </label>
                  {attempted && !dataAcknowledged ? (
                    <p id="consent-error" className="field-error" role="alert">
                      {s.consentRequired}
                    </p>
                  ) : null}
                </details>
                <button
                  className="button full-button"
                  disabled={busy || (!demo && !token)}
                  onClick={submit}
                >
                  {t.send}
                </button>
              </>
            ) : null}
            {error ? (
              <p className="auth-error" role="alert">
                {error}
              </p>
            ) : null}
            <p className="disclosure">
              {t.private}
              <br />
              {s.powered} · <a href={`/${locale}/privacy`}>{s.privacy}</a>
            </p>
          </>
        )}
      </section>
    </main>
  );
}

function StateCard({ text }: { text: string }) {
  return (
    <main className="feedback-page">
      <section className="feedback-card">
        <ImageMark />
        <h1 className="portal-thanks">{text}</h1>
        <Link className="button secondary" href="/ka">
          ReviewPortal
        </Link>
      </section>
    </main>
  );
}
function ImageMark() {
  return (
    <div
      className="phone-logo"
      style={{
        display: "grid",
        placeItems: "center",
        fontWeight: 800,
        color: "var(--green)",
      }}
    >
      R
    </div>
  );
}
async function getVisitToken(slug: string) {
  const key = `rp_visit_${slug}`,
    existing = localStorage.getItem(key);
  if (existing) return existing;
  const raw = crypto.randomUUID(),
    bytes = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(raw),
    ),
    token = Array.from(new Uint8Array(bytes), (byte) =>
      byte.toString(16).padStart(2, "0"),
    ).join("");
  localStorage.setItem(key, token);
  return token;
}
