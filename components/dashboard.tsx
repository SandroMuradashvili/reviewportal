"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuthActions } from "@convex-dev/auth/react";
import { type ReactMutation, useMutation, useQuery } from "convex/react";
import type { FunctionReturnType } from "convex/server";
import { api } from "@/convex/_generated/api";
import {
  LayoutDashboard,
  Building2,
  LogOut,
  Settings,
  QrCode,
  Plus,
  ExternalLink,
  ShieldCheck,
  Copy,
  CheckCircle2,
  PackageOpen,
  ShoppingBag,
  Trash2,
  X,
  HelpCircle,
  LifeBuoy,
  Download,
  MessageSquareText,
  Star,
  Users,
  Route,
  CreditCard,
} from "lucide-react";
import QRCode from "qrcode";
import { type CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import { Locale } from "@/lib/i18n";
import { slugFromBusinessName } from "@/lib/portal-validation";
import { legalContent } from "@/lib/legal";
import { PlanCatalog, ProductCatalog } from "@/components/catalog";
import { whatsapp } from "@/lib/data";

type View = "overview" | "portals" | "subscriptions" | "products" | "profile" | "support" | "admin";
type DashboardData = FunctionReturnType<typeof api.dashboardData.overview>;
type Portal = DashboardData["portals"][number];
type FeedbackRow = DashboardData["recent"][number];
type User = FunctionReturnType<typeof api.users.me>["user"];
type Subscription = FunctionReturnType<typeof api.users.me>["subscription"] & {startsAt?:number;expiresAt?:number;packageName?:string};
type AdminUsers = FunctionReturnType<typeof api.admin.users>;
type AdminCatalog = FunctionReturnType<typeof api.admin.catalog>;
type Act = (task: () => Promise<unknown>, success: string) => Promise<boolean>;

const dashboardCopy = {
  ka: {
    loading: "თქვენი სივრცე იტვირთება…",
    overview: "პანელი",
    portals: "პორტალები",
    feedback: "უკუკავშირი",
    qr: "QR და ბმული",
    settings: "პარამეტრები",
    admin: "ადმინისტრირება",
    signOut: "გასვლა",
    owner: "მფლობელის სივრცე",
    administrator: "ადმინისტრატორი",
    welcome: "კეთილი იყოს თქვენი მობრძანება",
    adminAccess: "ადმინისტრატორის წვდომა",
    trial: (left: number, total: number) =>
      `${left} / ${total} საცდელი პასუხი დარჩა`,
    active: "აქტიური პაკეტი",
    language: "პანელის ენა",
    saved: "ენა შენახულია",
    create: "პორტალის შექმნა",
    configure: "გამართვა",
    publish: "გამოქვეყნება",
    pause: "შეჩერება",
    published: "პორტალი გამოქვეყნდა.",
    paused: "პორტალი შეჩერებულია.",
    portalTitle: "პორტალები",
    portalIntro: "შექმენით და მართეთ მომხმარებლის შეფასების ბმულები.",
    createTitle: "ახალი პორტალის შექმნა",
    editTitle: "პორტალის გამართვა",
    businessName: "ბიზნესის სახელი",
    businessHelp: "ეს სახელი გამოჩნდება მომხმარებლის შეფასების გვერდზე.",
    slug: "პორტალის ბმული",
    slugHelp:
      "ბმულის მოკლე, უნიკალური ნაწილი. სახელიდან ავტომატურად იქმნება და შეგიძლიათ შეცვალოთ.",
    reviewUrl: "4–5 ვარსკვლავის დანიშნულების ბმული",
    reviewHelp:
      "მაღალი შეფასების შემდეგ მომხმარებელი პირდაპირ ამ HTTPS ბმულზე გადავა.",
    businessUrl: "1–3 ვარსკვლავის არასავალდებულო ბმული",
    businessHelpUrl:
      "პირადი უკუკავშირის შემდეგ მომხმარებელს ეს არასავალდებულო HTTPS ბმული გამოუჩნდება.",
    cancel: "გაუქმება",
    save: "შენახვა",
    createSave: "პორტალის შექმნა",
    created: "პორტალი შეიქმნა. მზადყოფნისას გამოაქვეყნეთ.",
    updated: "პორტალის პარამეტრები შენახულია.",
    status: {
      draft: "მონახაზი",
      live: "აქტიური",
      paused: "შეჩერებული",
      archived: "არქივი",
    },
    profileTitle: "ანგარიშის პარამეტრები",
    profileIntro: "თქვენი ანგარიშის სახელი და ელფოსტა.",
    name: "სახელი",
    email: "ელფოსტა",
    saveProfile: "პროფილის შენახვა",
    profileSaved: "პროფილი განახლდა.",
    error: "რაღაც შეცდომა მოხდა",
  },
  en: {
    loading: "Loading your workspace…",
    overview: "Dashboard",
    portals: "Portals",
    feedback: "Feedback",
    qr: "QR & Link",
    settings: "Settings",
    admin: "Admin",
    signOut: "Sign out",
    owner: "Owner workspace",
    administrator: "Administrator",
    welcome: "Welcome",
    adminAccess: "Admin access",
    trial: (left: number, total: number) =>
      `${left} of ${total} trial responses remaining`,
    active: "Active plan",
    language: "Dashboard language",
    saved: "Language saved",
    create: "Create portal",
    configure: "Configure",
    publish: "Publish",
    pause: "Pause",
    published: "Portal published.",
    paused: "Portal paused.",
    portalTitle: "Portals",
    portalIntro: "Create and manage your customer feedback links.",
    createTitle: "Create a new portal",
    editTitle: "Configure portal",
    businessName: "Business name",
    businessHelp: "This is the name customers see on the feedback page.",
    slug: "Portal link",
    slugHelp:
      "The short, unique part of the link. It is generated from the business name and remains editable.",
    reviewUrl: "4–5 star destination URL",
    reviewHelp:
      "Customers with a high rating continue directly to this HTTPS destination.",
    businessUrl: "Optional 1–3 star destination URL",
    businessHelpUrl:
      "After private feedback, customers see this optional HTTPS destination.",
    cancel: "Cancel",
    save: "Save changes",
    createSave: "Create portal",
    created: "Portal created. Publish it when ready.",
    updated: "Portal settings saved.",
    status: {
      draft: "Draft",
      live: "Live",
      paused: "Paused",
      archived: "Archived",
    },
    profileTitle: "Account settings",
    profileIntro: "Your account name and email address.",
    name: "Name",
    email: "Email",
    saveProfile: "Save profile",
    profileSaved: "Profile updated.",
    error: "Something went wrong",
  },
  ru: {
    loading: "Загружаем рабочее пространство…",
    overview: "Панель",
    portals: "Порталы",
    feedback: "Отзывы",
    qr: "QR и ссылка",
    settings: "Настройки",
    admin: "Администрирование",
    signOut: "Выйти",
    owner: "Пространство владельца",
    administrator: "Администратор",
    welcome: "Добро пожаловать",
    adminAccess: "Доступ администратора",
    trial: (left: number, total: number) =>
      `Осталось ${left} из ${total} пробных ответов`,
    active: "Активный тариф",
    language: "Язык панели",
    saved: "Язык сохранён",
    create: "Создать портал",
    configure: "Настроить",
    publish: "Опубликовать",
    pause: "Приостановить",
    published: "Портал опубликован.",
    paused: "Портал приостановлен.",
    portalTitle: "Порталы",
    portalIntro: "Создавайте и управляйте ссылками для отзывов клиентов.",
    createTitle: "Создать новый портал",
    editTitle: "Настроить портал",
    businessName: "Название компании",
    businessHelp: "Это название увидят клиенты на странице отзыва.",
    slug: "Ссылка портала",
    slugHelp:
      "Короткая уникальная часть ссылки. Создаётся из названия компании, но её можно изменить.",
    reviewUrl: "Адрес назначения для 4–5 звёзд",
    reviewHelp:
      "После высокой оценки клиент сразу перейдёт по этому HTTPS-адресу.",
    businessUrl: "Необязательный адрес для 1–3 звёзд",
    businessHelpUrl:
      "После личного отзыва клиент увидит этот необязательный HTTPS-адрес.",
    cancel: "Отмена",
    save: "Сохранить",
    createSave: "Создать портал",
    created: "Портал создан. Опубликуйте его, когда он будет готов.",
    updated: "Настройки портала сохранены.",
    status: {
      draft: "Черновик",
      live: "Активен",
      paused: "Приостановлен",
      archived: "Архив",
    },
    profileTitle: "Настройки аккаунта",
    profileIntro: "Имя аккаунта и адрес электронной почты.",
    name: "Имя",
    email: "Email",
    saveProfile: "Сохранить профиль",
    profileSaved: "Профиль обновлён.",
    error: "Произошла ошибка",
  },
};
type DashboardCopy = (typeof dashboardCopy)[Locale];
function errorMessage(reason: unknown, fallback: string) {
  if (
    reason &&
    typeof reason === "object" &&
    "data" in reason &&
    typeof reason.data === "string"
  )
    return reason.data;
  return reason instanceof Error
    ? reason.message
        .replace(/^\[CONVEX[^\]]*\]\s*/, "")
        .replace(/\s*Called by client[\s\S]*$/, "")
    : fallback;
}
const tr = (locale: Locale, ka: string, en: string, ru: string) =>
  locale === "ka" ? ka : locale === "ru" ? ru : en;

export function Dashboard({ siteUrl }: { siteUrl: string }) {
  const data = useQuery(api.dashboardData.overview),
    me = useQuery(api.users.me),
    legalUpdate = useQuery(api.legalDocuments.latest),
    adminUsers = useQuery(
      api.admin.users,
      me?.user.role === "admin" ? {} : "skip",
    ),
    adminCatalog = useQuery(
      api.admin.catalog,
      me?.user.role === "admin" ? {} : "skip",
    );
  const createPortal = useMutation(api.portals.create),
    setPortalStatus = useMutation(api.portals.setStatus),
    updatePortal = useMutation(api.portals.update),
    removePortal = useMutation(api.portals.remove),
    generateLogoUploadUrl = useMutation(api.portals.generateLogoUploadUrl),
    setFeedbackStatus = useMutation(api.feedback.setStatus),
    removeFeedback = useMutation(api.feedback.removeMany),
    updateProfile = useMutation(api.users.updateProfile),
    deleteAccount = useMutation(api.users.deleteAccount),
    setUserLocale = useMutation(api.users.setLocale),
    setUserState = useMutation(api.admin.setState),
    assignSubscription = useMutation(api.admin.assignSubscription),
    expireSubscription = useMutation(api.admin.expireSubscription),
    saveLegalDocument = useMutation(api.legalDocuments.save),
    initializeCatalog = useMutation(api.admin.initializeCatalog),
    generateProductImageUploadUrl = useMutation(api.admin.generateProductImageUploadUrl),
    saveProduct = useMutation(api.admin.saveProduct),
    removeProduct = useMutation(api.admin.removeProduct),
    savePackage = useMutation(api.admin.savePackage),
    removePackage = useMutation(api.admin.removePackage);
  const { signOut } = useAuthActions();
  const [view, setView] = useState<View>("overview"),
    [selectedPortal, setSelectedPortal] = useState("all"),
    [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [busy, setBusy] = useState(false),
    [localeOverride, setLocaleOverride] = useState<Locale | null>(null);
  const catalogChecked = useRef(false);
  useEffect(() => {
    if (me?.user.role === "admin" && adminCatalog && !catalogChecked.current) {
      catalogChecked.current = true;
      void initializeCatalog({});
    }
  }, [adminCatalog, initializeCatalog, me?.user.role]);
  const portals = data?.portals ?? [],activePortal=selectedPortal === "all" ? portals[0]?._id ?? "all" : selectedPortal,
    filteredFeedback = useMemo(
      () =>
        data?.recent.filter(
          (row) => activePortal === "all" || row.portalId === activePortal,
        ) ?? [],
      [activePortal, data],
    );
  const locale = localeOverride ?? me?.user.locale ?? "ka";
  const d = dashboardCopy[locale];
  async function act(task: () => Promise<unknown>, success: string) {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await task();
      setNotice(success);
      return true;
    } catch (reason) {
      setError(errorMessage(reason, d.error));
      return false;
    } finally {
      setBusy(false);
    }
  }
  async function changeLocale(next: Locale) {
    setLocaleOverride(next);
    setError("");
    try {
      await setUserLocale({ locale: next });
    } catch (reason) {
      setLocaleOverride(null);
      setError(errorMessage(reason, d.error));
    }
  }
  if (data === undefined || me === undefined)
    return (
      <main className="dashboard-loading">
        <span className="spinner" />
        {dashboardCopy.ka.loading}
      </main>
    );
  const trialLimit = me.subscription.trialLimit ?? 10,
    totalUsed = data.portals.reduce((sum, p) => sum + p.submissionCount, 0),
    remaining = Math.max(0, trialLimit - totalUsed);
  const portalScope = data.portalMetrics.find((item) => item.portalId === activePortal),
    scopedData = portalScope
      ? { ...data, metrics: portalScope.metrics, daily: portalScope.daily, ratingDistribution: portalScope.ratingDistribution }
      : data;
  return (
    <main className="dashboard-shell">
      <aside className="sidebar">
        <Link className="brand" href={`/${locale}`}>
          <Image src="/brand/secondary.svg" width={34} height={34} alt="" />
          ReviewPortal
        </Link>
        <nav>
          <Nav
            active={view === "overview"}
            onClick={() => setView("overview")}
            icon={LayoutDashboard}
            label={d.overview}
          />
          <Nav
            active={view === "portals"}
            onClick={() => setView("portals")}
            icon={Building2}
            label={d.portals}
          />
          <Nav active={view === "subscriptions"} onClick={() => setView("subscriptions")} icon={CreditCard} label={tr(locale,"პაკეტები","Subscriptions","Подписки")}/>
          <Nav active={view === "products"} onClick={() => setView("products")} icon={ShoppingBag} label={tr(locale,"პროდუქტები","Products","Товары")}/>
          <Nav active={view === "profile"} onClick={() => setView("profile")} icon={Settings} label={tr(locale,"პროფილი","Profile","Профиль")}/>
          <Nav
            active={view === "support"}
            onClick={() => setView("support")}
            icon={LifeBuoy}
            label={tr(locale, "მხარდაჭერა", "Support", "Поддержка")}
          />
          {me.user.role === "admin" ? (
            <Nav
              active={view === "admin"}
              onClick={() => setView("admin")}
              icon={ShieldCheck}
              label={d.admin}
            />
          ) : null}
        </nav>
        <button className="sidebar-signout" onClick={() => void signOut()}>
          <LogOut size={17} /> {d.signOut}
        </button>
      </aside>
      <section className="dashboard-main">
        <div className="dash-top">
          <div>
            <div className="eyebrow">
              {me.user.role === "admin" ? d.administrator : d.owner}
            </div>
            <h1 className="dash-title">
              {me.user.name
                ? `${d.welcome}, ${me.user.name}`
                : `${d.welcome} — ReviewPortal`}
            </h1>
          </div>
          <div className="dash-top-actions">
            <div className="dashboard-locales" aria-label={d.language}>
              {(["ka", "en", "ru"] as const).map((item) => (
                <button
                  key={item}
                  className={locale === item ? "active" : ""}
                  aria-pressed={locale === item}
                  onClick={() => void changeLocale(item)}
                >
                  {item.toUpperCase()}
                </button>
              ))}
            </div>
            {me.user.role === "admin" ? (
              <div className="trial admin-access">
                <strong>{d.adminAccess}</strong>
              </div>
            ) : me.subscription.status === "expired" ? (
              <div className="trial subscription-expired"><strong>{tr(locale,"წვდომა გასააქტიურებელია","Plan needs reactivation","Требуется повторная активация")}</strong></div>
            ) : me.subscription.status === "trial" ? (
              <div className="trial">
                <strong>{d.trial(remaining, trialLimit)}</strong>
              </div>
            ) : (
              <div className="trial active-plan">
                <strong>{me.subscription.packageName ?? d.active}</strong>
              </div>
            )}
          </div>
        </div>
        {notice ? (
          <p className="dash-notice success" role="status">
            {notice}
          </p>
        ) : null}
        {error ? (
          <p className="dash-notice error" role="alert">
            {error}
          </p>
        ) : null}
        {legalUpdate?<section className="legal-update-notice"><strong>{tr(locale,"იურიდიული დოკუმენტები განახლდა","Legal documents were updated","Юридические документы обновлены")}</strong><span>{new Intl.DateTimeFormat(locale==="ka"?"ka-GE":locale==="ru"?"ru-RU":"en",{dateStyle:"medium"}).format(legalUpdate)}</span><Link href={`/${locale}/terms`}>{tr(locale,"ცვლილებების ნახვა","Review changes","Посмотреть изменения")}</Link></section>:null}
        {me.user.role !== "admin" && me.subscription.status === "expired" ? <section className="subscription-warning" role="alert"><strong>{tr(locale,"თქვენი პაკეტის ვადა დასრულდა.","Your subscription has expired.","Срок вашей подписки истёк.")}</strong><span>{tr(locale,"პანელი და ისტორია ხელმისაწვდომია, მაგრამ პორტალები აღარ მიიღებს ახალ უკუკავშირს ხელახლა გააქტიურებამდე.","Your dashboard and history remain available, but portals cannot accept new feedback until access is reactivated.","Панель и история доступны, но порталы не принимают новые отзывы до повторной активации.")}</span></section>:null}
        {view === "overview" ? (
          <>
            <PortalScope locale={locale} portals={portals} value={activePortal} onChange={setSelectedPortal} />
            <Overview locale={locale} data={scopedData} setView={setView} />
            <DailyChart locale={locale} daily={scopedData.daily} />
            <div className="feedback-workspace" id="feedback-inbox"><Feedback
              locale={locale}
              rows={filteredFeedback}
              busy={busy}
              act={act}
              setFeedbackStatus={setFeedbackStatus}
              removeFeedback={removeFeedback}
            /></div>
          </>
        ) : null}
        {view === "portals" ? (
          <Portals
            d={d}
            locale={locale}
            portals={portals}
            busy={busy}
            act={act}
            createPortal={createPortal}
            updatePortal={updatePortal}
            setPortalStatus={setPortalStatus}
            removePortal={removePortal}
            generateLogoUploadUrl={generateLogoUploadUrl}
            siteUrl={siteUrl}
          />
        ) : null}
        {view === "subscriptions"?<DashboardShop locale={locale} kind="subscriptions"/>:null}
        {view === "products"?<DashboardShop locale={locale} kind="products"/>:null}
        {view === "profile" ? (
          <Profile
            d={d}
            locale={locale}
            user={me.user}
            busy={busy}
            act={act}
            updateProfile={updateProfile}
            deleteAccount={deleteAccount}
            signOut={signOut}
            subscription={me.subscription}
          />
        ) : null}
        {view === "support" ? <Support locale={locale} /> : null}
        {view === "admin" && me.user.role === "admin" ? (
          <Admin
            users={adminUsers ?? []}
            catalog={adminCatalog ?? { products: [], packages: [] }}
            busy={busy}
            act={act}
            setUserState={setUserState}
            assignSubscription={assignSubscription}
            expireSubscription={expireSubscription}
            saveLegalDocument={saveLegalDocument}
            saveProduct={saveProduct}
            generateProductImageUploadUrl={generateProductImageUploadUrl}
            removeProduct={removeProduct}
            savePackage={savePackage}
            removePackage={removePackage}
          />
        ) : null}
      </section>
    </main>
  );
}

function PortalScope({ locale, portals, value, onChange }: { locale: Locale; portals: Portal[]; value: string; onChange: (value: string) => void }) {
  return <section className="portal-scope" aria-label={tr(locale,"არჩეული პორტალი","Selected portal","Выбранный портал")}>
    <div><span>{tr(locale,"ანალიტიკა და უკუკავშირი","Analytics and feedback","Аналитика и отзывы")}</span><strong>{portals.find((portal) => portal._id === value)?.name ?? tr(locale,"აირჩიეთ პორტალი","Choose a portal","Выберите портал")}</strong></div>
    <div className="portal-scope-options">{portals.map((portal) => <button key={portal._id} className={portal._id === value ? "active" : ""} onClick={() => onChange(portal._id)}>{portal.name}</button>)}</div>
  </section>;
}

function Nav({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof LayoutDashboard;
  label: string;
}) {
  return (
    <button className={active ? "active" : ""} onClick={onClick}>
      <Icon size={18} />
      {label}
    </button>
  );
}
function Overview({
  locale,
  data,
  setView,
}: {
  locale: Locale;
  data: DashboardData;
  setView: (view: View) => void;
}) {
  return (
    <>
      <SetupGuide locale={locale} data={data} setView={setView} />
      <div className="metrics dashboard-metrics">
        <Metric
          icon={MessageSquareText}
          label={tr(
            locale,
            "სულ უკუკავშირი",
            "Total feedback",
            "Всего отзывов",
          )}
          value={String(data.metrics.total)}
          detail={tr(
            locale,
            "მიღებული შეფასებები",
            "Submitted ratings",
            "Полученные оценки",
          )}
        />
        <Metric
          icon={Star}
          label={tr(
            locale,
            "საშუალო შეფასება",
            "Average rating",
            "Средняя оценка",
          )}
          value={data.metrics.average.toFixed(1)}
          detail={tr(
            locale,
            "ყველა პორტალზე",
            "Across your portals",
            "По всем порталам",
          )}
        />
        <Metric
          icon={CheckCircle2}
          label={tr(
            locale,
            "კმაყოფილი მომხმარებლები",
            "Happy ratings",
            "Высокие оценки",
          )}
          value={`${data.metrics.happy.toFixed(0)}%`}
          detail={tr(
            locale,
            "ოთხი ან ხუთი ვარსკვლავი",
            "Four or five stars",
            "Четыре или пять звёзд",
          )}
        />
        <Metric
          icon={Users}
          label={tr(
            locale,
            "უნიკალური ვიზიტორები",
            "Unique visitors",
            "Уникальные посетители",
          )}
          value={String(data.metrics.uniqueVisitors)}
          detail={tr(
            locale,
            "მიახლოებითი მოწყობილობები",
            "Approximate devices",
            "Примерное число устройств",
          )}
        />
        <Metric
          icon={MessageSquareText}
          label={tr(locale, "პირადად დარჩენილი პრობლემები", "Private resolutions", "Остались приватными")}
          value={String(data.metrics.privateResolutions)}
          detail={tr(
            locale,
            "1–3★ პასუხი გარე ბმულზე გადასვლის გარეშე",
            "1–3★ feedback without an outbound click",
            "Отзывы 1–3★ без перехода наружу",
          )}
        />
        <Metric
          icon={Route}
          label={tr(locale, "გადასვლები", "Redirects", "Переходы")}
          value={String(data.metrics.redirects)}
          detail={tr(
            locale,
            "დანიშნულების ბმულზე დაწკაპუნებები",
            "Destination link clicks",
            "Переходы по целевой ссылке",
          )}
        />
      </div>
      {data.portals.length === 0 ? (
        <Empty
          title={tr(
            locale,
            "შექმენით პირველი შეფასების პორტალი",
            "Create your first review portal",
            "Создайте первый портал отзывов",
          )}
          body={tr(
            locale,
            "დაამატეთ ბიზნესი და დანიშნულების ბმულები, გამოაქვეყნეთ და ჩამოტვირთეთ QR კოდი.",
            "Add your business and destination links, publish, and download the QR code.",
            "Добавьте компанию и целевые ссылки, опубликуйте портал и скачайте QR-код.",
          )}
          action={tr(
            locale,
            "პორტალის შექმნა",
            "Create portal",
            "Создать портал",
          )}
          onClick={() => setView("portals")}
        />
      ) : (
        <div className="distribution card">
          <h3>
            {tr(
              locale,
              "შეფასებების განაწილება",
              "Rating distribution",
              "Распределение оценок",
            )}
          </h3>
          {data.ratingDistribution
            .slice()
            .reverse()
            .map((item) => (
              <div className="bar-row" key={item.rating}>
                <span>{item.rating} ★</span>
                <div>
                  <i
                    style={{
                      width: `${data.metrics.total ? (item.count / data.metrics.total) * 100 : 0}%`,
                    }}
                  />
                </div>
                <strong>{item.count}</strong>
              </div>
            ))}
        </div>
      )}
    </>
  );
}
function DailyChart({
  locale,
  daily,
}: {
  locale: Locale;
  daily: DashboardData["daily"];
}) {
  const width = 900,
    height = 250,
    pad = 38,
    max = Math.max(1, ...daily.map((day) => day.total)),
    x = (index: number) =>
      pad + (index * (width - pad * 2)) / Math.max(1, daily.length - 1),
    y = (value: number) => height - pad - (value * (height - pad * 2)) / max,
    points = daily.map((day, index) => `${x(index)},${y(day.total)}`).join(" ");
  return (
    <section className="card daily-chart">
      <div className="section-head">
        <div>
          <h2 className="dash-section-title">
            {tr(
              locale,
              "უკუკავშირი დღეების მიხედვით",
              "Feedback by day",
              "Отзывы по дням",
            )}
          </h2>
          <p>
            {tr(
              locale,
              "მიუთითეთ წერტილზე დღის შეფასებების განაწილების სანახავად.",
              "Point to a day to see its rating distribution.",
              "Наведите на точку, чтобы увидеть распределение оценок за день.",
            )}
          </p>
        </div>
        <span>
          {tr(locale, "ბოლო 30 დღე", "Last 30 days", "Последние 30 дней")}
        </span>
      </div>
      <div className="chart-scroll">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={tr(
            locale,
            "დღიური უკუკავშირის გრაფიკი",
            "Daily feedback chart",
            "График отзывов по дням",
          )}
        >
          <line
            x1={pad}
            y1={height - pad}
            x2={width - pad}
            y2={height - pad}
            className="chart-axis"
          />
          <line
            x1={pad}
            y1={pad}
            x2={pad}
            y2={height - pad}
            className="chart-axis"
          />
          {[0, Math.ceil(max / 2), max].map((value) => (
            <g key={value}>
              <line
                x1={pad}
                y1={y(value)}
                x2={width - pad}
                y2={y(value)}
                className="chart-grid"
              />
              <text x={pad - 8} y={y(value) + 4} textAnchor="end">
                {value}
              </text>
            </g>
          ))}
          <polyline points={points} className="chart-line" />
          {daily.map((day, index) => (
            <g key={day.date} className="chart-point">
              <circle cx={x(index)} cy={y(day.total)} r="5">
                <title>{`${new Intl.DateTimeFormat(locale === "ka" ? "ka-GE" : locale === "ru" ? "ru-RU" : "en", { dateStyle: "medium" }).format(day.date)} — ${day.total}\n${day.ratings.map((count, rating) => `${rating + 1}★: ${count}`).join(" · ")}`}</title>
              </circle>
              {index % 5 === 0 || index === daily.length - 1 ? (
                <text x={x(index)} y={height - 12} textAnchor="middle">
                  {new Intl.DateTimeFormat(
                    locale === "ka"
                      ? "ka-GE"
                      : locale === "ru"
                        ? "ru-RU"
                        : "en",
                    { month: "short", day: "numeric" },
                  ).format(day.date)}
                </text>
              ) : null}
            </g>
          ))}
        </svg>
      </div>
    </section>
  );
}

function SetupGuide({
  locale,
  data,
  setView,
}: {
  locale: Locale;
  data: DashboardData;
  setView: (view: View) => void;
}) {
  const hasPortal = data.portals.length > 0,
    hasLinks = data.portals.some((portal) =>
      Boolean(portal.destinationUrl && portal.businessUrl),
    ),
    isLive = data.portals.some((portal) => portal.status === "live"),
    hasVisit = data.metrics.uniqueVisitors > 0,
    hasFeedback = data.metrics.total > 0;
  const steps = [
      {
        title: tr(
          locale,
          "შექმენით პირველი პორტალი",
          "Create your first portal",
          "Создайте первый портал",
        ),
        detail: tr(
          locale,
          "დაამატეთ ბიზნესის სახელი და მომხმარებლის ბმული.",
          "Add the business name and its customer-facing link.",
          "Добавьте название компании и ссылку для клиентов.",
        ),
        done: hasPortal,
        view: "portals" as View,
        action: tr(locale, "შექმნა", "Create portal", "Создать"),
      },
      {
        title: tr(
          locale,
          "დააკავშირეთ Google ბმულები",
          "Connect your Google links",
          "Подключите ссылки Google",
        ),
        detail: tr(
          locale,
          "დაამატეთ შეფასებისა და ბიზნესის პროფილის ცალკე ბმულები.",
          "Add separate review and Business Profile links.",
          "Добавьте отдельные ссылки на отзыв и профиль компании.",
        ),
        done: hasLinks,
        view: "portals" as View,
        action: tr(
          locale,
          "ბმულების გამართვა",
          "Configure links",
          "Настроить ссылки",
        ),
      },
      {
        title: tr(
          locale,
          "გამოაქვეყნეთ პორტალი",
          "Publish the portal",
          "Опубликуйте портал",
        ),
        detail: tr(
          locale,
          "მომხმარებლის გვერდი ხელმისაწვდომი გახადეთ.",
          "Make the customer feedback page available.",
          "Сделайте страницу отзывов доступной клиентам.",
        ),
        done: isLive,
        view: "portals" as View,
        action: tr(locale, "გამოქვეყნება", "Publish", "Опубликовать"),
      },
      {
        title: tr(
          locale,
          "შეამოწმეთ და გააზიარეთ",
          "Test and share",
          "Проверьте и поделитесь",
        ),
        detail: tr(
          locale,
          "გახსენით პორტალი, დააკოპირეთ ბმული ან ჩამოტვირთეთ QR.",
          "Open the portal, then copy its link or download the QR code.",
          "Откройте портал, скопируйте ссылку или скачайте QR-код.",
        ),
        done: hasVisit,
        view: "portals" as View,
        action: tr(
          locale,
          "QR და ბმული",
          "Open QR & Link",
          "Открыть QR и ссылку",
        ),
      },
      {
        title: tr(
          locale,
          "ნახეთ პირველი პასუხი",
          "Review your first response",
          "Просмотрите первый ответ",
        ),
        detail: tr(
          locale,
          "ახალი საჩივრები და შეფასებები პანელზე რეალურ დროში გამოჩნდება.",
          "New complaints and ratings appear on the Dashboard in real time.",
          "Новые жалобы и оценки появятся на панели в реальном времени.",
        ),
        done: hasFeedback,
        view: "overview" as View,
        action: tr(
          locale,
          "პანელის გახსნა",
          "Open Dashboard",
          "Открыть панель",
        ),
      },
    ],
    complete = steps.filter((step) => step.done).length;
  if (complete === steps.length) return null;
  const next = steps.findIndex((step) => !step.done);
  return (
    <section className="setup-guide card" aria-labelledby="setup-title">
      <div className="setup-guide-head">
        <div>
          <span className="eyebrow">
            {tr(locale, "დაწყება", "Getting started", "Начало работы")}
          </span>
          <h2 id="setup-title">
            {tr(
              locale,
              "გამართეთ ReviewPortal ეტაპობრივად",
              "Set up ReviewPortal step by step",
              "Настройте ReviewPortal по шагам",
            )}
          </h2>
          <p>
            {tr(
              locale,
              "გაიარეთ ეტაპები თანმიმდევრულად. პროგრესი ავტომატურად განახლდება.",
              "Complete these steps in order. Progress updates automatically.",
              "Выполните шаги по порядку. Прогресс обновляется автоматически.",
            )}
          </p>
        </div>
        <strong>
          {complete} / {steps.length}
        </strong>
      </div>
      <div
        className="setup-progress"
        role="progressbar"
        aria-label={tr(
          locale,
          "ანგარიშის გამართვის პროგრესი",
          "Account setup progress",
          "Прогресс настройки аккаунта",
        )}
        aria-valuemin={0}
        aria-valuemax={steps.length}
        aria-valuenow={complete}
      >
        <i style={{ width: `${(complete / steps.length) * 100}%` }} />
      </div>
      <ol className="setup-steps">
        {steps.map((step, index) => (
          <li
            key={step.title}
            className={`${step.done ? "done" : ""} ${index === next ? "current" : ""}`}
          >
            <span className="setup-step-number">
              {step.done ? <CheckCircle2 size={20} /> : index + 1}
            </span>
            <div>
              <strong>{step.title}</strong>
              <p>{step.detail}</p>
            </div>
            {!step.done && index === next ? (
              <button
                className="button secondary"
                onClick={() => setView(step.view)}
              >
                {step.action}
              </button>
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  );
}
function Portals({
  d,
  locale,
  portals,
  busy,
  act,
  createPortal,
  updatePortal,
  setPortalStatus,
  removePortal,
  generateLogoUploadUrl,
  siteUrl,
}: {
  d: DashboardCopy;
  locale: Locale;
  portals: Portal[];
  busy: boolean;
  act: Act;
  createPortal: ReactMutation<typeof api.portals.create>;
  updatePortal: ReactMutation<typeof api.portals.update>;
  setPortalStatus: ReactMutation<typeof api.portals.setStatus>;
  removePortal: ReactMutation<typeof api.portals.remove>;
  generateLogoUploadUrl: ReactMutation<
    typeof api.portals.generateLogoUploadUrl
  >;
  siteUrl: string;
}) {
  const [editor, setEditor] = useState<Portal | "new" | null>(null),
    [deleting, setDeleting] = useState<Portal | null>(null);
  return (
    <>
      <div className="section-head compact">
        <div>
          <h2 className="dash-section-title">{d.portalTitle}</h2>
          <p>{d.portalIntro}</p>
        </div>
        <div className="portal-head-actions">
          <strong
            className="portal-limit"
            title={tr(
              locale,
              "გამოყენებული პორტალები",
              "Portals used",
              "Использовано порталов",
            )}
          >
            {portals.length} / 5
          </strong>
          {portals.length < 5 ? (
            <button className="button" onClick={() => setEditor("new")}>
              <Plus size={17} />
              {d.create}
            </button>
          ) : null}
        </div>
      </div>
      <div className="portal-list">
        {portals.map((portal) => (
          <article className="card portal-manage" key={portal._id}>
            <div>
              <span className={`status ${portal.status}`}>
                {d.status[portal.status]}
              </span>
              <h3>{portal.name}</h3>
              <a href={`/${locale}/r/${portal.slug}`} target="_blank">
                /r/{portal.slug} <ExternalLink size={13} />
              </a>
            </div>
            <div className="portal-actions">
              <button
                className="button secondary"
                onClick={() => setEditor(portal)}
              >
                {d.configure}
              </button>
              <button
                className="button"
                disabled={busy}
                onClick={() =>
                  void act(
                    () =>
                      setPortalStatus({
                        portalId: portal._id,
                        status: portal.status === "live" ? "paused" : "live",
                      }),
                    portal.status === "live" ? d.paused : d.published,
                  )
                }
              >
                {portal.status === "live" ? d.pause : d.publish}
              </button>
              <button
                className="icon-button danger-button"
                aria-label={tr(
                  locale,
                  "პორტალის წაშლა",
                  "Delete portal",
                  "Удалить портал",
                )}
                onClick={() => setDeleting(portal)}
              >
                <Trash2 size={17} />
              </button>
            </div>
            <PortalShare portal={portal} locale={locale} siteUrl={siteUrl} />
          </article>
        ))}
      </div>
      {editor ? (
        <PortalEditor
          d={d}
          portal={editor === "new" ? undefined : editor}
          busy={busy}
          locale={locale}
          generateLogoUploadUrl={generateLogoUploadUrl}
          close={() => setEditor(null)}
          save={async (values) => {
            const ok =
              editor === "new"
                ? await act(
                    () =>
                      createPortal({
                        name: values.name,
                        slug: values.slug,
                        destinationUrl: values.destinationUrl,
                        businessUrl: values.businessUrl,
                        logoStorageId: values.logoStorageId,
                      }),
                    d.created,
                  )
                : await act(
                    () =>
                      updatePortal({
                        portalId: editor._id,
                        ...values,
                        slug: values.slug ?? editor.slug,
                      }),
                    d.updated,
                  );
            if (ok) setEditor(null);
          }}
        />
      ) : null}
      {deleting ? (
        <DeletePortalDialog
          locale={locale}
          portal={deleting}
          busy={busy}
          close={() => setDeleting(null)}
          confirm={async (confirmation) => {
            const ok = await act(
              () => removePortal({ portalId: deleting._id, confirmation }),
              tr(
                locale,
                "პორტალი და მისი მონაცემები წაიშალა.",
                "Portal and its data were deleted.",
                "Портал и его данные удалены.",
              ),
            );
            if (ok) setDeleting(null);
          }}
        />
      ) : null}
    </>
  );
}
type PortalValues = {
  name: string;
  slug?: string;
  destinationUrl?: string;
  businessUrl?: string;
  logoStorageId?: Parameters<
    ReactMutation<typeof api.portals.create>
  >[0]["logoStorageId"];
  removeLogo?: boolean;
};
function PortalEditor({
  d,
  portal,
  busy,
  locale,
  generateLogoUploadUrl,
  close,
  save,
}: {
  d: DashboardCopy;
  portal?: Portal;
  busy: boolean;
  locale: Locale;
  generateLogoUploadUrl: ReactMutation<
    typeof api.portals.generateLogoUploadUrl
  >;
  close: () => void;
  save: (values: PortalValues) => Promise<void>;
}) {
  const [name, setName] = useState(portal?.name ?? ""),
    [slug, setSlug] = useState(portal?.slug ?? ""),
    [automatic, setAutomatic] = useState(!portal),
    [logoStorageId, setLogoStorageId] =
      useState<PortalValues["logoStorageId"]>(),
    [removeLogo, setRemoveLogo] = useState(false),
    [uploading, setUploading] = useState(false),
    [uploadError, setUploadError] = useState("");
  function changeName(value: string) {
    setName(value);
    if (automatic) setSlug(slugFromBusinessName(value));
  }
  return (
    <div
      className="dashboard-modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <section
        className="dashboard-modal card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="portal-editor-title"
      >
        <div className="modal-head">
          <div>
            <span className="eyebrow">ReviewPortal</span>
            <h2 id="portal-editor-title">
              {portal ? d.editTitle : d.createTitle}
            </h2>
          </div>
          <button className="icon-button" aria-label={d.cancel} onClick={close}>
            <X size={20} />
          </button>
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const form = new FormData(event.currentTarget);
            void save({
              name,
              slug: slug || undefined,
              destinationUrl: String(form.get("destinationUrl")) || undefined,
              businessUrl: String(form.get("businessUrl")) || undefined,
              logoStorageId,
              removeLogo,
            });
          }}
        >
          <label>
            {d.businessName}
            <input
              autoFocus
              required
              minLength={2}
              value={name}
              onChange={(event) => changeName(event.target.value)}
            />
            <small>
              <HelpCircle size={13} />
              {d.businessHelp}
            </small>
          </label>
          <label>
            {tr(locale, "ბიზნესის ლოგო", "Business logo", "Логотип компании")}
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              disabled={uploading}
              onChange={async (event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                if (
                  !["image/png", "image/jpeg", "image/webp"].includes(
                    file.type,
                  ) ||
                  file.size > 2_000_000
                ) {
                  setUploadError(
                    tr(
                      locale,
                      "აირჩიეთ PNG, JPEG ან WebP ფაილი 2 მბ-მდე.",
                      "Choose a PNG, JPEG, or WebP image up to 2 MB.",
                      "Выберите PNG, JPEG или WebP до 2 МБ.",
                    ),
                  );
                  return;
                }
                setUploading(true);
                setUploadError("");
                try {
                  const uploadUrl = await generateLogoUploadUrl({}),
                    response = await fetch(uploadUrl, {
                      method: "POST",
                      headers: { "Content-Type": file.type },
                      body: file,
                    });
                  if (!response.ok) throw new Error();
                  const result = await response.json();
                  setLogoStorageId(result.storageId);
                  setRemoveLogo(false);
                } catch {
                  setUploadError(
                    tr(
                      locale,
                      "ლოგოს ატვირთვა ვერ მოხერხდა.",
                      "Logo upload failed.",
                      "Не удалось загрузить логотип.",
                    ),
                  );
                } finally {
                  setUploading(false);
                }
              }}
            />
            <small>
              <HelpCircle size={13} />
              {tr(
                locale,
                "PNG, JPEG ან WebP, მაქსიმუმ 2 მბ. თუ არ ატვირთავთ, გამოყენებული იქნება ნაგულისხმევი ნიშანი.",
                "PNG, JPEG, or WebP up to 2 MB. The default mark is used when no logo is uploaded.",
                "PNG, JPEG или WebP до 2 МБ. Без загрузки используется стандартный знак.",
              )}
            </small>
            {portal?.logoUrl && !removeLogo ? (
              <span className="logo-preview">
                <Image src={portal.logoUrl} alt="" width={54} height={54} />
                <button
                  type="button"
                  className="button secondary"
                  onClick={() => setRemoveLogo(true)}
                >
                  {tr(
                    locale,
                    "ნაგულისხმევის გამოყენება",
                    "Use default",
                    "Использовать стандартный",
                  )}
                </button>
              </span>
            ) : null}
            {logoStorageId ? (
              <span className="upload-success">
                ✓{" "}
                {tr(
                  locale,
                  "ლოგო მზადაა შესანახად",
                  "Logo ready to save",
                  "Логотип готов к сохранению",
                )}
              </span>
            ) : null}
            {uploadError ? (
              <span className="auth-error">{uploadError}</span>
            ) : null}
          </label>
          <label>
            {d.slug}
            <div className="slug-input">
              <span>/r/</span>
              <input
                required
                pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                value={slug}
                onChange={(event) => {
                  setAutomatic(false);
                  setSlug(event.target.value.toLowerCase());
                }}
              />
            </div>
            <small>
              <HelpCircle size={13} />
              {d.slugHelp}
            </small>
          </label>
          <label>
            {d.reviewUrl}
            <input
              name="destinationUrl"
              type="url"
              defaultValue={portal?.destinationUrl ?? ""}
              placeholder="https://example.com/review"
            />
            <small>
              <HelpCircle size={13} />
              {d.reviewHelp}
            </small>
          </label>
          <label>
            {d.businessUrl}
            <input
              name="businessUrl"
              type="url"
              defaultValue={portal?.businessUrl ?? ""}
              placeholder="https://example.com/business"
            />
            <small>
              <HelpCircle size={13} />
              {d.businessHelpUrl}
            </small>
          </label>
          <div className="portal-actions modal-actions">
            <button type="button" className="button secondary" onClick={close}>
              {d.cancel}
            </button>
            <button className="button" disabled={busy}>
              {portal ? d.save : d.createSave}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
function PortalShare({
  portal,
  locale,
  siteUrl,
}: {
  portal: Portal;
  locale: Locale;
  siteUrl: string;
}) {
  const [qr, setQr] = useState(""),
    url = `${siteUrl.replace(/\/$/, "")}/${locale}/r/${portal.slug}`;
  useEffect(() => {
    void QRCode.toDataURL(url, {
      width: 220,
      margin: 2,
      color: { dark: "#1f5b43", light: "#ffffff" },
    }).then(setQr);
  }, [url]);
  return (
    <div className="portal-share">
      <div>
        {qr ? (
          <Image src={qr} alt={`QR ${portal.name}`} width={112} height={112} />
        ) : null}
      </div>
      <div>
        <span className="eyebrow">
          <QrCode size={14} />
          {tr(locale, "გაზიარება", "Share portal", "Поделиться")}
        </span>
        <code className="share-link">{url}</code>
        <div className="portal-actions">
          <button
            className="button secondary"
            onClick={() => void navigator.clipboard.writeText(url)}
          >
            <Copy size={15} />
            {tr(locale, "კოპირება", "Copy link", "Копировать")}
          </button>
          {qr ? (
            <a
              className="button secondary"
              download={`${portal.slug}-qr.png`}
              href={qr}
            >
              <Download size={15} />
              QR
            </a>
          ) : null}
          <a className="button secondary" href={url} target="_blank">
            {tr(locale, "ტესტი", "Test", "Проверить")}
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}
function DeletePortalDialog({
  locale,
  portal,
  busy,
  close,
  confirm,
}: {
  locale: Locale;
  portal: Portal;
  busy: boolean;
  close: () => void;
  confirm: (value: string) => Promise<void>;
}) {
  const [value, setValue] = useState("");
  return (
    <div className="dashboard-modal-backdrop">
      <section
        className="dashboard-modal danger-dialog card"
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-head">
          <div>
            <span className="eyebrow">
              {tr(
                locale,
                "შეუქცევადი მოქმედება",
                "Permanent action",
                "Необратимое действие",
              )}
            </span>
            <h2>
              {tr(locale, "პორტალის წაშლა", "Delete portal", "Удалить портал")}
            </h2>
          </div>
          <button className="icon-button" onClick={close}>
            <X size={20} />
          </button>
        </div>
        <p>
          {tr(
            locale,
            `წაიშლება „${portal.name}“, მისი QR ბმული, უკუკავშირი, ვიზიტები და ანალიტიკა.`,
            `“${portal.name}”, its QR link, feedback, visits, and analytics will be permanently deleted.`,
            `«${portal.name}», QR-ссылка, отзывы, посещения и аналитика будут удалены навсегда.`,
          )}
        </p>
        <label>
          {tr(
            locale,
            "დასადასტურებლად აკრიფეთ ბიზნესის სრული სახელი",
            "Type the full business name to confirm",
            "Для подтверждения введите полное название компании",
          )}
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={portal.name}
          />
        </label>
        <div className="portal-actions modal-actions">
          <button className="button secondary" onClick={close}>
            {tr(locale, "გაუქმება", "Cancel", "Отмена")}
          </button>
          <button
            className="button danger"
            disabled={busy || value !== portal.name}
            onClick={() => void confirm(value)}
          >
            <Trash2 size={16} />
            {tr(
              locale,
              "სამუდამოდ წაშლა",
              "Delete permanently",
              "Удалить навсегда",
            )}
          </button>
        </div>
      </section>
    </div>
  );
}
const categoryLabels = {
  ka: {
    quality: "პროდუქტის / საკვების ხარისხი",
    service: "მომსახურება",
    value: "ფასი / ღირებულება",
    wait: "ლოდინის დრო",
    cleanliness: "სისუფთავე",
    atmosphere: "გარემო",
    accuracy: "შეკვეთის სიზუსტე",
    other: "სხვა",
  },
  en: {
    quality: "Product / food quality",
    service: "Service",
    value: "Price / value",
    wait: "Waiting time",
    cleanliness: "Cleanliness",
    atmosphere: "Atmosphere",
    accuracy: "Order accuracy",
    other: "Other",
  },
  ru: {
    quality: "Качество продукта / еды",
    service: "Обслуживание",
    value: "Цена / ценность",
    wait: "Время ожидания",
    cleanliness: "Чистота",
    atmosphere: "Атмосфера",
    accuracy: "Точность заказа",
    other: "Другое",
  },
};
function Feedback({
  locale,
  rows,
  busy,
  act,
  setFeedbackStatus,
  removeFeedback,
}: {
  locale: Locale;
  rows: FeedbackRow[];
  busy: boolean;
  act: Act;
  setFeedbackStatus: ReactMutation<typeof api.feedback.setStatus>;
  removeFeedback: ReactMutation<typeof api.feedback.removeMany>;
}) {
  const [minRating, setMinRating] = useState(1),
    [maxRating, setMaxRating] = useState(5),
    [statusFilter, setStatusFilter] = useState<"all" | "unread" | "unresolved" | "resolved">("all"),
    [categoryFilter, setCategoryFilter] = useState("all"),
    [days, setDays] = useState("all"),
    [selected, setSelected] = useState<FeedbackRow["_id"][]>([]),
    [selecting, setSelecting] = useState(false),
    [deleteRequest, setDeleteRequest] = useState<string | null>(null),
    [opened, setOpened] = useState<FeedbackRow | null>(null),
    [filterNow] = useState(() => Date.now());
  const inboxRef=useRef<HTMLDivElement>(null),inboxSnapped=useRef(false);
  useEffect(()=>{const target=inboxRef.current;if(!target)return;const observer=new IntersectionObserver(entries=>{if(!inboxSnapped.current&&entries[0]?.isIntersecting&&window.scrollY>300){inboxSnapped.current=true;target.scrollIntoView({behavior:"smooth",block:"start"})}},{threshold:.35});observer.observe(target);return()=>observer.disconnect()},[]);
  const filtered = rows.filter(
    (row) =>
      row.rating >= minRating && row.rating <= maxRating &&
      (statusFilter === "all" || statusFilter === "unresolved" && (row.status === "read" || row.status === "unread") || row.status === statusFilter) &&
      (categoryFilter === "all" ||
        row.issueCategories?.includes(
          categoryFilter as NonNullable<FeedbackRow["issueCategories"]>[number],
        )) &&
      (days === "all" ||
        row.submittedAt >= filterNow - Number(days) * 86400000),
  );
  async function open(row: FeedbackRow) {
    setOpened(row);
    if (row.status === "unread")
      await act(
        () => setFeedbackStatus({ feedbackId: row._id, status: "read" }),
        "",
      );
  }
  async function deleteMode(mode: string) {
    if (!mode) return;
    if (mode === "selected" && !selected.length) return;
    const older =
        mode === "month"
          ? 30
          : mode === "six"
            ? 183
            : mode === "year"
              ? 365
              : null,
      ok = await act(
        () =>
          removeFeedback(
            mode === "selected"
              ? { feedbackIds: selected }
              : mode === "all"
                ? { all: true }
                : { olderThan: Date.now() - (older ?? 0) * 86400000 },
          ),
        tr(
          locale,
          "უკუკავშირი წაიშალა.",
          "Feedback deleted.",
          "Отзывы удалены.",
        ),
      );
    if (ok) {
      setSelected([]);
      setOpened(null);
    }
  }
  function exportRows() {
    const header = [
        "Date",
        "Business",
        "Rating",
        "Categories",
        "Comment",
        "Status",
      ],
      escape = (value: unknown) =>
        `"${String(value ?? "").replaceAll('"', '""')}"`,
      lines = [
        header,
        ...filtered.map((row) => [
          new Date(row.submittedAt).toISOString(),
          row.portalName,
          row.rating,
          (row.issueCategories ?? [])
            .map((category) => categoryLabels[locale][category])
            .join("; "),
          row.comment ?? "",
          row.status,
        ]),
      ]
        .map((line) => line.map(escape).join(","))
        .join("\n"),
      url = URL.createObjectURL(
        new Blob(["\uFEFF" + lines], { type: "text/csv;charset=utf-8" }),
      ),
      anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `reviewportal-feedback-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  }
  return (
    <>
      <div className="section-head compact" ref={inboxRef}>
        <div>
          <h2 className="dash-section-title">
            {tr(
              locale,
              "უკუკავშირის შემოსულები",
              "Feedback inbox",
              "Входящие отзывы",
            )}
          </h2>
          <p>
            {tr(
              locale,
              "ნახეთ და მოაგვარეთ მომხმარებლების პირადი კომენტარები.",
              "Review and resolve private customer comments.",
              "Просматривайте и решайте личные обращения клиентов.",
            )}
          </p>
        </div>
      </div>
      <div className="feedback-tabs" role="tablist">
        {(["all","unread","unresolved","resolved"] as const).map((status) => <button role="tab" aria-selected={statusFilter === status} className={statusFilter === status ? "active" : ""} key={status} onClick={() => setStatusFilter(status)}>{tr(locale,status === "all" ? "ყველა" : status === "unread" ? "უნახავი" : status === "unresolved" ? "მოუგვარებელი" : "მოგვარებული",status === "all" ? "All" : status === "unread" ? "Unseen" : status === "unresolved" ? "Unresolved" : "Resolved",status === "all" ? "Все" : status === "unread" ? "Новые" : status === "unresolved" ? "Нерешённые" : "Решённые")}</button>)}
      </div>
      <div className="feedback-toolbar card">
        <div className="rating-range"><span>{tr(locale,"რეიტინგი","Rating","Рейтинг")}: {minRating}–{maxRating} ★</span><div className="rating-range-controls" style={{"--range-start":`${(minRating-1)*25}%`,"--range-end":`${(maxRating-1)*25}%`} as CSSProperties}><input aria-label="Minimum rating" type="range" min="1" max="5" value={minRating} onChange={(e) => setMinRating(Math.min(Number(e.target.value),maxRating))}/><input aria-label="Maximum rating" type="range" min="1" max="5" value={maxRating} onChange={(e) => setMaxRating(Math.max(Number(e.target.value),minRating))}/></div><div className="rating-ticks">{[1,2,3,4,5].map(n=><span key={n}>{n}</span>)}</div></div>
        <details className="filter-menu"><summary>{categoryFilter === "all" ? tr(locale,"ყველა კატეგორია","All categories","Все категории") : categoryLabels[locale][categoryFilter as keyof typeof categoryLabels[typeof locale]]}</summary><div><button className={categoryFilter === "all" ? "active" : ""} onClick={() => setCategoryFilter("all")}>{tr(locale,"ყველა კატეგორია","All categories","Все категории")}</button>{Object.entries(categoryLabels[locale]).map(([value,label])=><button className={categoryFilter === value ? "active" : ""} key={value} onClick={() => setCategoryFilter(value)}>{label}</button>)}</div></details>
        <details className="filter-menu"><summary>{days==="all"?tr(locale,"ყველა თარიღი","Any date","Все даты"):tr(locale,`ბოლო ${days} დღე`,`Last ${days} days`,`Последние ${days} дней`)}</summary><div>{[["all",tr(locale,"ყველა თარიღი","Any date","Все даты")],["7",tr(locale,"ბოლო 7 დღე","Last 7 days","Последние 7 дней")],["30",tr(locale,"ბოლო 30 დღე","Last 30 days","Последние 30 дней")],["90",tr(locale,"ბოლო 90 დღე","Last 90 days","Последние 90 дней")]].map(([value,label])=><button className={days===value?"active":""} key={value} onClick={()=>setDays(value)}>{label}</button>)}</div></details>
        <div className="feedback-actions"><button className={`button secondary ${selecting ? "active" : ""}`} onClick={() => {setSelecting(!selecting);setSelected([])}}>{selecting ? tr(locale,"დასრულება","Done","Готово") : tr(locale,"არჩევა","Select","Выбрать")}</button>{selecting?<><button className="button secondary" onClick={() => setSelected(selected.length === filtered.length ? [] : filtered.map(row=>row._id))}>{selected.length === filtered.length ? tr(locale,"არჩევის მოხსნა","Clear","Снять") : tr(locale,"ყველას არჩევა","Select all","Выбрать все")}</button><button className="button secondary" disabled={!selected.length||busy} onClick={() => void act(()=>Promise.all(selected.map(feedbackId=>setFeedbackStatus({feedbackId,status:"resolved"}))),tr(locale,"მონიშნული მოგვარებულია.","Selected feedback resolved.","Выбранные отзывы решены.")).then(ok=>{if(ok)setSelected([])})}><CheckCircle2 size={16}/>{tr(locale,"მოგვარება","Resolve","Решить")}</button></>:null}<button className="button secondary" onClick={exportRows}><Download size={16}/>{tr(locale,"ექსპორტი","Export","Экспорт")}</button><button className="button secondary danger-button" disabled={!selected.length} onClick={() => setDeleteRequest("selected")}><Trash2 size={16}/>{tr(locale,"წაშლა","Delete","Удалить")} {selected.length ? `(${selected.length})` : ""}</button></div>
      </div>
      {filtered.length ? (
        <div className="feedback-cards">
          {filtered.map((row) => (
            <article
              className={`card feedback-item clickable ${selecting ? "is-selecting" : ""} ${row.status === "unread" ? "is-unread" : ""}`}
              key={row._id}
              onClick={() => selecting ? setSelected(current=>current.includes(row._id)?current.filter(id=>id!==row._id):[...current,row._id]) : void open(row)}
            >
              {selecting ? <label
                className="feedback-check"
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  type="checkbox"
                  checked={selected.includes(row._id)}
                  onChange={(e) =>
                    setSelected((current) =>
                      e.target.checked
                        ? [...current, row._id]
                        : current.filter((id) => id !== row._id),
                    )
                  }
                />
              </label> : null}
              <span
                className="unread-dot"
                aria-label={row.status === "unread" ? "Unread" : undefined}
              />
              <div className="feedback-score">★ {row.rating}</div>
              <div>
                <strong>{row.portalName}</strong>
                {row.issueCategories?.length ? (
                  <div className="feedback-category-tags">
                    {row.issueCategories.map((category) => (
                      <span key={category}>
                        {categoryLabels[locale][category]}
                      </span>
                    ))}
                  </div>
                ) : null}
                <p>
                  {row.comment ||
                    tr(
                      locale,
                      "კომენტარის გარეშე",
                      "No written comment",
                      "Без комментария",
                    )}
                </p>
                <small>
                  {new Intl.DateTimeFormat(
                    locale === "ka"
                      ? "ka-GE"
                      : locale === "ru"
                        ? "ru-RU"
                        : "en",
                    { dateStyle: "medium", timeStyle: "short" },
                  ).format(row.submittedAt)}
                </small>
              </div>
              <span className={`pill ${row.status}`}>{row.status}</span>
            </article>
          ))}
        </div>
      ) : (
        <Empty
          title={tr(
            locale,
            "უკუკავშირი ჯერ არ არის",
            "No feedback yet",
            "Отзывов пока нет",
          )}
          body={tr(
            locale,
            "გამოაქვეყნეთ პორტალი და გააზიარეთ ბმული ან QR კოდი. ახალი პასუხები აქ გამოჩნდება.",
            "Publish a portal and share its link or QR code. New responses will appear here.",
            "Опубликуйте портал и поделитесь ссылкой или QR-кодом. Новые ответы появятся здесь.",
          )}
        />
      )}
      {opened ? (
        <FeedbackDialog
          locale={locale}
          row={opened}
          busy={busy}
          close={() => setOpened(null)}
          setStatus={async (status) => {
            const ok = await act(
              () => setFeedbackStatus({ feedbackId: opened._id, status }),
              tr(
                locale,
                "სტატუსი განახლდა.",
                "Status updated.",
                "Статус обновлён.",
              ),
            );
            if (ok) {
              if (status === "resolved") setOpened(null);
              else setOpened({ ...opened, status });
            }
          }}
          remove={async () => setDeleteRequest("opened")}
        />
      ) : null}
      {deleteRequest ? <div className="dashboard-modal-backdrop"><section className="dashboard-modal danger-dialog card" role="alertdialog" aria-modal="true"><div className="modal-head"><div><span className="eyebrow">{tr(locale,"შეუქცევადი მოქმედება","Permanent action","Необратимое действие")}</span><h2>{tr(locale,"წავშალოთ უკუკავშირი?","Delete feedback?","Удалить отзывы?")}</h2></div><button className="icon-button" onClick={() => setDeleteRequest(null)}><X size={20}/></button></div><p>{tr(locale,"არჩეული ჩანაწერები სამუდამოდ წაიშლება. ამ მოქმედების გაუქმება შეუძლებელია.","The selected records will be permanently deleted. This cannot be undone.","Выбранные записи будут удалены навсегда. Отменить это действие нельзя.")}</p><div className="portal-actions modal-actions"><button className="button secondary" onClick={() => setDeleteRequest(null)}>{tr(locale,"გაუქმება","Cancel","Отмена")}</button><button className="button danger-button" disabled={busy} onClick={async () => {
        if (deleteRequest === "opened" && opened) {
            const ok = await act(
              () => removeFeedback({ feedbackIds: [opened._id] }),
              tr(
                locale,
                "უკუკავშირი წაიშალა.",
                "Feedback deleted.",
                "Отзыв удалён.",
              ),
            );
            if (ok) { setOpened(null); setDeleteRequest(null); }
        } else { await deleteMode(deleteRequest); setDeleteRequest(null); }
      }}><Trash2 size={17}/>{tr(locale,"სამუდამოდ წაშლა","Delete permanently","Удалить навсегда")}</button></div></section></div> : null}
    </>
  );
}
function FeedbackDialog({
  locale,
  row,
  busy,
  close,
  setStatus,
  remove,
}: {
  locale: Locale;
  row: FeedbackRow;
  busy: boolean;
  close: () => void;
  setStatus: (status: "read" | "resolved") => Promise<void>;
  remove: () => Promise<void>;
}) {
  return (
    <div className="dashboard-modal-backdrop">
      <section
        className="dashboard-modal feedback-dialog card"
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-head">
          <div>
            <span className="eyebrow">{row.portalName}</span>
            <h2>★ {row.rating} / 5</h2>
          </div>
          <button className="icon-button" onClick={close}>
            <X size={20} />
          </button>
        </div>
        {row.issueCategories?.length ? (
          <div className="feedback-category-tags">
            {row.issueCategories.map((category) => (
              <span key={category}>{categoryLabels[locale][category]}</span>
            ))}
          </div>
        ) : null}
        <blockquote>
          {row.comment ||
            tr(
              locale,
              "კომენტარის გარეშე",
              "No written comment",
              "Без комментария",
            )}
        </blockquote>
        <p className="muted-copy">
          {new Intl.DateTimeFormat(
            locale === "ka" ? "ka-GE" : locale === "ru" ? "ru-RU" : "en",
            { dateStyle: "full", timeStyle: "short" },
          ).format(row.submittedAt)}
        </p>
        <div className="portal-actions feedback-dialog-actions">
          <button
            className="button secondary"
            disabled={busy}
            onClick={() => void setStatus("resolved")}
          >
            {tr(
              locale,
              "მოგვარებულად მონიშვნა",
              "Mark resolved",
              "Отметить решённым",
            )}
          </button>
          <button
            className="icon-button danger-button"
            disabled={busy}
            onClick={() => void remove()}
            aria-label={tr(locale, "წაშლა", "Delete", "Удалить")}
          >
            <Trash2 size={18} />
          </button>
        </div>
      </section>
    </div>
  );
}
export function QrTools({
  locale,
  portal,
  portals,
  selectedPortal,
  setSelectedPortal,
  siteUrl,
}: {
  locale: Locale;
  portal: Portal | undefined;
  portals: Portal[];
  selectedPortal: string;
  setSelectedPortal: (id: string) => void;
  siteUrl: string;
}) {
  const [qr, setQr] = useState(""),
    url = portal
      ? `${siteUrl.replace(/\/$/, "")}/${locale}/r/${portal.slug}`
      : "";
  useEffect(() => {
    if (url)
      void QRCode.toDataURL(url, {
        width: 360,
        margin: 2,
        color: { dark: "#1f5b43", light: "#ffffff" },
      }).then(setQr);
  }, [url]);
  if (!portal)
    return (
      <Empty
        title={tr(
          locale,
          "გასაზიარებელი პორტალი არ არის",
          "No portal to share",
          "Нет портала для публикации",
        )}
        body={tr(
          locale,
          "ჯერ შექმენით პორტალი, შემდეგ აქ გამოჩნდება მისი ბმული და QR კოდი.",
          "Create a portal first; its stable link and QR code will appear here.",
          "Сначала создайте портал — здесь появятся его ссылка и QR-код.",
        )}
      />
    );
  return (
    <>
      <div className="section-head compact">
        <div>
          <h2 className="dash-section-title">
            {tr(
              locale,
              "QR და შეფასების ბმული",
              "QR & review link",
              "QR и ссылка для отзывов",
            )}
          </h2>
          <p>
            {tr(
              locale,
              "გამოიყენეთ ერთი სტაბილური ბმული ბეჭდვისთვის, NFC-სთვის და ონლაინ გაზიარებისთვის.",
              "Use one stable URL for print, NFC, and digital sharing.",
              "Используйте одну постоянную ссылку для печати, NFC и публикации онлайн.",
            )}
          </p>
        </div>
        <select
          className="select"
          value={selectedPortal === "all" ? portal._id : selectedPortal}
          onChange={(e) => setSelectedPortal(e.target.value)}
        >
          {portals.map((p) => (
            <option value={p._id} key={p._id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
      <div className="qr-layout">
        <div className="card qr-card">
          {qr ? (
            <Image
              src={qr}
              alt={`QR ${portal.name}`}
              width={300}
              height={300}
            />
          ) : null}
        </div>
        <div className="card">
          <h3>{portal.name}</h3>
          <code className="share-link">{url}</code>
          <div className="hero-actions">
            <button
              className="button"
              onClick={() => void navigator.clipboard.writeText(url)}
            >
              <Copy size={16} />
              {tr(locale, "ბმულის კოპირება", "Copy link", "Копировать ссылку")}
            </button>
            {qr ? (
              <a
                className="button secondary"
                download={`${portal.slug}-qr.png`}
                href={qr}
              >
                {tr(
                  locale,
                  "PNG-ის ჩამოტვირთვა",
                  "Download PNG",
                  "Скачать PNG",
                )}
              </a>
            ) : null}
            <a className="button secondary" href={url} target="_blank">
              {tr(locale, "პორტალის ტესტი", "Test portal", "Проверить портал")}{" "}
              <ExternalLink size={16} />
            </a>
          </div>
          <p className="muted-copy">
            {tr(
              locale,
              "NFC-სთვის ჩაწერეთ ზუსტად ზემოთ მოცემული HTTPS ბმული. ვიზიტები და პასუხები ცალ-ცალკე აღირიცხება.",
              "For NFC, program the exact HTTPS link above. Visits and responses are tracked separately.",
              "Для NFC используйте точную HTTPS-ссылку выше. Посещения и ответы учитываются отдельно.",
            )}
          </p>
        </div>
      </div>
    </>
  );
}
function DashboardShop({locale,kind}:{locale:Locale;kind:"subscriptions"|"products"}){return <section className="dashboard-shop"><div className="section-head compact"><div><h2 className="dash-section-title">{kind==="subscriptions"?tr(locale,"პაკეტები და განახლება","Subscriptions and renewal","Подписки и продление"):tr(locale,"ReviewPortal პროდუქტები","ReviewPortal products","Товары ReviewPortal")}</h2><p>{kind==="subscriptions"?tr(locale,"აირჩიეთ სტანდარტული პაკეტი ან მოგვწერეთ ინდივიდუალური პირობებისთვის.","Choose the standard plan or contact us for custom terms.","Выберите стандартный тариф или свяжитесь с нами для индивидуальных условий."):tr(locale,"QR და NFC პროდუქტები თქვენი უკუკავშირის პორტალებისთვის.","QR and NFC products for your feedback portals.","QR- и NFC-товары для ваших порталов.")}</p></div></div>{kind==="subscriptions"?<><PlanCatalog locale={locale}/><p className="shop-payment-note">{tr(locale,"ონლაინ საბანკო მოთხოვნა ჯერ არ არის ჩართული. გასააქტიურებლად დაგვიკავშირდით — თქვენს ანგარიშზე პაკეტს მხოლოდ გადახდის დადასტურების შემდეგ ჩავრთავთ.","Online bank-transfer checkout is not enabled yet. Contact us to activate a plan; access is assigned only after payment is verified.","Онлайн-оплата переводом пока не включена. Свяжитесь с нами; тариф активируется только после проверки оплаты.")}</p></>:<ProductCatalog locale={locale}/>}</section>}
function Profile({
  d,
  locale,
  user,
  busy,
  act,
  updateProfile,
  deleteAccount,
  signOut,
  subscription,
}: {
  d: DashboardCopy;
  locale: Locale;
  user: User;
  busy: boolean;
  act: Act;
  updateProfile: ReactMutation<typeof api.users.updateProfile>;
  deleteAccount: ReactMutation<typeof api.users.deleteAccount>;
  signOut: () => Promise<void>;
  subscription: Subscription;
}) {
  const [showDelete, setShowDelete] = useState(false),[now]=useState(()=>Date.now()),
    [confirmation, setConfirmation] = useState("");
  const start=subscription.startsAt??now,end=subscription.expiresAt,duration=end?Math.max(1,end-start):1,elapsed=end?Math.max(0,Math.min(100,((now-start)/duration)*100)):0,days=end?Math.max(0,Math.ceil((end-now)/86400000)):null;
  return (
    <>
      <div className="section-head compact">
        <div>
          <h2 className="dash-section-title">{d.profileTitle}</h2>
          <p>{d.profileIntro}</p>
        </div>
      </div>
      <section className="card activation-meter"><div><span>{tr(locale,"პაკეტის წვდომა","Subscription access","Доступ по подписке")}</span><strong>{subscription.status==="trial"?tr(locale,"საცდელი რეჟიმი","Trial access","Пробный доступ"):subscription.packageName??tr(locale,"პაკეტი","Plan","Тариф")}</strong></div>{end?<><div className="activation-track"><i style={{width:`${elapsed}%`}}/></div><div className="activation-meta"><span>{new Intl.DateTimeFormat(locale==="ka"?"ka-GE":locale==="ru"?"ru-RU":"en",{dateStyle:"medium"}).format(start)}</span><strong>{days} {tr(locale,"დღე დარჩა","days left","дней осталось")}</strong><span>{new Intl.DateTimeFormat(locale==="ka"?"ka-GE":locale==="ru"?"ru-RU":"en",{dateStyle:"medium"}).format(end)}</span></div></>:<p>{tr(locale,"აქტიური ფასიანი ვადა ჯერ არ არის მინიჭებული.","No paid access period has been assigned yet.","Платный период пока не назначен.")}</p>}<a className="button secondary" target="_blank" rel="noreferrer" href={whatsapp("Hello ReviewPortal, I would like to renew my subscription.")}>{tr(locale,"განახლებისთვის დაგვიკავშირდით","Contact us to renew","Связаться для продления")}</a></section>
      <form
        className="card settings-form"
        onSubmit={(event) => {
          event.preventDefault();
          const form = new FormData(event.currentTarget);
          void act(
            () => updateProfile({ name: String(form.get("name")), locale }),
            d.profileSaved,
          );
        }}
      >
        <label>
          {d.name}
          <input
            name="name"
            defaultValue={user.name ?? ""}
            required
            minLength={2}
          />
        </label>
        <label>
          {d.email}
          <input value={user.email ?? ""} disabled readOnly />
        </label>
        <button className="button" disabled={busy}>
          {d.saveProfile}
        </button>
      </form>
      <section className="card account-danger">
        <div>
          <h3>
            {tr(
              locale,
              "ანგარიშის წაშლა",
              "Delete my account",
              "Удалить аккаунт",
            )}
          </h3>
          <p>
            {tr(
              locale,
              "ეს სამუდამოდ წაშლის თქვენს პორტალებს, ლოგოებს, QR ბმულებს, უკუკავშირს, ვიზიტებს, ანალიტიკას და ავტორიზაციის მონაცემებს. მოქმედების გაუქმება შეუძლებელია.",
              "This permanently deletes your portals, logos, QR links, feedback, visits, analytics, and authentication data. It cannot be undone.",
              "Все порталы, логотипы, QR-ссылки, отзывы, посещения, аналитика и данные входа будут удалены навсегда. Отменить действие нельзя.",
            )}
          </p>
        </div>
        <button className="button danger" onClick={() => setShowDelete(true)}>
          <Trash2 size={16} />
          {tr(
            locale,
            "ჩემი ანგარიშის წაშლა",
            "Delete my account",
            "Удалить аккаунт",
          )}
        </button>
      </section>
      {showDelete ? (
        <div className="dashboard-modal-backdrop">
          <section
            className="dashboard-modal danger-dialog card"
            role="dialog"
            aria-modal="true"
          >
            <div className="modal-head">
              <div>
                <span className="eyebrow">
                  {tr(
                    locale,
                    "საბოლოო დადასტურება",
                    "Final confirmation",
                    "Окончательное подтверждение",
                  )}
                </span>
                <h2>
                  {tr(
                    locale,
                    "ანგარიშისა და ყველა მონაცემის წაშლა",
                    "Delete account and all data",
                    "Удалить аккаунт и все данные",
                  )}
                </h2>
              </div>
              <button
                className="icon-button"
                onClick={() => setShowDelete(false)}
              >
                <X size={20} />
              </button>
            </div>
            <p>
              {tr(
                locale,
                "ჯერ დარწმუნდით, რომ საჭირო უკუკავშირი CSV ფაილად გაიტანეთ. შემდეგ აკრიფეთ ზუსტად:",
                "Export any feedback you need first. Then type exactly:",
                "Сначала экспортируйте нужные отзывы. Затем введите точно:",
              )}
            </p>
            <code>DELETE MY ACCOUNT</code>
            <input
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              autoComplete="off"
            />
            <div className="portal-actions modal-actions">
              <button
                className="button secondary"
                onClick={() => setShowDelete(false)}
              >
                {tr(locale, "გაუქმება", "Cancel", "Отмена")}
              </button>
              <button
                className="button danger"
                disabled={busy || confirmation !== "DELETE MY ACCOUNT"}
                onClick={async () => {
                  const ok = await act(
                    () => deleteAccount({ confirmation }),
                    "",
                  );
                  if (ok) {
                    try {
                      await signOut();
                    } finally {
                  window.location.replace(`/${locale}`);
                    }
                  }
                }}
              >
                <Trash2 size={16} />
                {tr(
                  locale,
                  "ყველაფრის სამუდამოდ წაშლა",
                  "Permanently delete everything",
                  "Удалить всё навсегда",
                )}
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
function Support({ locale }: { locale: Locale }) {
  return (
    <>
      <div className="section-head compact">
        <div>
          <h2 className="dash-section-title">
            {tr(locale, "მხარდაჭერა", "Support", "Поддержка")}
          </h2>
          <p>
            {tr(
              locale,
              "დახმარება ანგარიშთან, პორტალთან, QR/NFC-სთან ან უკუკავშირთან დაკავშირებით.",
              "Help with your account, portals, QR/NFC, or feedback workflow.",
              "Помощь с аккаунтом, порталами, QR/NFC и отзывами.",
            )}
          </p>
        </div>
      </div>
      <section className="card support-card">
        <LifeBuoy size={34} />
        <div>
          <h3>
            {tr(
              locale,
              "დაგვიკავშირდით",
              "Contact ReviewPortal",
              "Связаться с ReviewPortal",
            )}
          </h3>
          <p>
            {tr(
              locale,
              "მხარდაჭერის შეტყობინებაში არ გამოგზავნოთ მომხმარებლის მგრძნობიარე პერსონალური მონაცემები.",
              "Do not send sensitive customer personal data in a support message.",
              "Не отправляйте конфиденциальные данные клиентов в сообщении поддержке.",
            )}
          </p>
          <div className="portal-actions">
            <a
              className="button"
              href="https://wa.me/995577665525?text=Hello%20ReviewPortal%20Support"
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp · +995 577 66 55 25
            </a>
            <a
              className="button secondary"
              href="mailto:reviewportal55@gmail.com?subject=ReviewPortal%20Support"
            >
              reviewportal55@gmail.com
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
function Admin({
  users,
  catalog,
  busy,
  act,
  setUserState,
  assignSubscription,
  expireSubscription,
  saveLegalDocument,
  saveProduct,
  generateProductImageUploadUrl,
  removeProduct,
  savePackage,
  removePackage,
}: {
  users: AdminUsers;
  catalog: AdminCatalog;
  busy: boolean;
  act: Act;
  setUserState: ReactMutation<typeof api.admin.setState>;
  assignSubscription: ReactMutation<typeof api.admin.assignSubscription>;
  expireSubscription: ReactMutation<typeof api.admin.expireSubscription>;
  saveLegalDocument: ReactMutation<typeof api.legalDocuments.save>;
  saveProduct: ReactMutation<typeof api.admin.saveProduct>;
  generateProductImageUploadUrl: ReactMutation<typeof api.admin.generateProductImageUploadUrl>;
  removeProduct: ReactMutation<typeof api.admin.removeProduct>;
  savePackage: ReactMutation<typeof api.admin.savePackage>;
  removePackage: ReactMutation<typeof api.admin.removePackage>;
}) {
  const [productEditor, setProductEditor] = useState<
      AdminCatalog["products"][number] | null | "new"
    >(null),
    [packageEditor, setPackageEditor] = useState<
      AdminCatalog["packages"][number] | null | "new"
    >(null),[subscriptionUser,setSubscriptionUser]=useState<AdminUsers[number]|null>(null),[demoMode,setDemoMode]=useState(false);
  return (
    <>
      <div className="section-head compact">
        <div>
          <h2 className="dash-section-title">Administration</h2>
          <p>Accounts, storefront products and subscription packages.</p>
        </div>
        <button className={`button secondary ${demoMode?"active":""}`} onClick={()=>setDemoMode(!demoMode)}>{demoMode?"Exit demo data":"Preview demo data"}</button>
      </div>
      {demoMode?<DemoAdminData/>:null}
      <AdminHeading
        icon={ShoppingBag}
        title="NFC products & sets"
        action="Add product or set"
        onClick={() => setProductEditor("new")}
      />
      {productEditor ? (
        <ProductEditor
          key={productEditor === "new" ? "new" : productEditor._id}
          item={productEditor === "new" ? undefined : productEditor}
          busy={busy}
          cancel={() => setProductEditor(null)}
          save={(values) =>
            act(() => saveProduct(values), "Product catalog saved.").then(() =>
              setProductEditor(null),
            )
          }
          generateProductImageUploadUrl={generateProductImageUploadUrl}
        />
      ) : null}
      <div className="admin-catalog-list">
        {catalog.products.map((item) => (
          <article className="card admin-catalog-row" key={item._id}>
            <div>
              <span className="status">{item.kind ?? "individual"}</span>
              <h3>{item.name.en}</h3>
              <small>
                ₾{item.priceGel ?? item.priceDisplay}{" "}
                {item.compareAtPriceGel
                  ? `· was ₾${item.compareAtPriceGel}`
                  : ""}{" "}
                {item.kind !== "set" ? `· ${item.stockQuantity} in stock` : ""}
              </small>
            </div>
            <div>
              <button
                className="button secondary"
                onClick={() => setProductEditor(item)}
              >
                Edit
              </button>
              <button
                className="icon-button danger-button"
                aria-label="Delete product"
                disabled={busy}
                onClick={() =>
                  void act(
                    () => removeProduct({ productId: item._id }),
                    "Product removed.",
                  )
                }
              >
                <Trash2 size={17} />
              </button>
            </div>
          </article>
        ))}
      </div>
      <AdminHeading
        icon={PackageOpen}
        title="Subscription packages"
        action="Add package"
        onClick={() => setPackageEditor("new")}
      />
      {packageEditor ? (
        <PackageEditor
          key={packageEditor === "new" ? "new" : packageEditor._id}
          item={packageEditor === "new" ? undefined : packageEditor}
          busy={busy}
          cancel={() => setPackageEditor(null)}
          save={(values) =>
            act(() => savePackage(values), "Subscription package saved.").then(
              () => setPackageEditor(null),
            )
          }
        />
      ) : null}
      <div className="admin-catalog-list">
        {catalog.packages.map((item) => (
          <article className="card admin-catalog-row" key={item._id}>
            <div>
              <span className={`status ${item.visible ? "live" : "paused"}`}>
                {item.visible ? "visible" : "hidden"}
              </span>
              <h3>{item.name.en}</h3>
              <small>
                {item.priceDisplay} · {item.portalLimit} portals
              </small>
            </div>
            <div>
              <button
                className="button secondary"
                onClick={() => setPackageEditor(item)}
              >
                Edit
              </button>
              <button
                className="icon-button danger-button"
                aria-label="Delete package"
                disabled={busy}
                onClick={() =>
                  void act(
                    () => removePackage({ packageId: item._id }),
                    "Package removed.",
                  )
                }
              >
                <Trash2 size={17} />
              </button>
            </div>
          </article>
        ))}
      </div>
      <AdminHeading icon={ShieldCheck} title="User accounts" />
      {demoMode?<DemoUserList/>:<div className="admin-list">
        {users.map((item) => (
          <article className="card admin-user" key={item.user._id}>
            <div>
              <strong>
                {item.user.name || item.user.email || "Unnamed account"}
              </strong>
              <small>
                {item.user.email} · {item.user.role ?? "owner"} ·{" "}
                {item.user.state ?? "active"}
              </small>
              <SubscriptionSummary subscription={item.subscription}/>
            </div>
            <span>
              {item.portalCount} portals · {item.responseCount} responses
            </span>
            <div>
              <button
                className="button secondary"
                disabled={busy}
                title="Suspension blocks the user from signing in. It does not delete their data."
                onClick={() =>
                  void act(
                    () =>
                      setUserState({
                        userId: item.user._id,
                        state:
                          item.user.state === "suspended"
                            ? "active"
                            : "suspended",
                      }),
                    "Account state updated.",
                  )
                }
              >
                {item.user.state === "suspended" ? "Restore account access" : "Suspend account access"}
              </button>
              <button
                className="button"
                disabled={busy}
                onClick={() => setSubscriptionUser(item)}
              >
                Manage subscription
              </button>
            </div>
          </article>
        ))}
      </div>}
      {subscriptionUser?<SubscriptionEditor user={subscriptionUser} packages={catalog.packages} busy={busy} close={()=>setSubscriptionUser(null)} assign={values=>act(()=>assignSubscription(values),"Subscription saved.").then(ok=>{if(ok)setSubscriptionUser(null)})} expire={()=>act(()=>expireSubscription({ownerId:subscriptionUser.user._id}),"Subscription expired.").then(ok=>{if(ok)setSubscriptionUser(null)})}/>:null}
      <AdminHeading icon={ShieldCheck} title="Legal documents" />
      <LegalManager busy={busy} save={values=>act(()=>saveLegalDocument(values),"Legal document published. Users will see an in-app update notice.")}/>
    </>
  );
}

function DemoAdminData(){return <section className="demo-admin-banner"><div><span>Demo mode · browser only</span><strong>No records are written to production</strong></div><div className="demo-admin-stats"><div><strong>100</strong><span>users this month</span></div><div><strong>287</strong><span>portals</span></div><div><strong>4,820</strong><span>responses</span></div><div><strong>8</strong><span>plans ending soon</span></div></div></section>}
function DemoUserList(){const plans=["ReviewPortal","Business custom","Trial"];return <div className="admin-list demo-user-list">{Array.from({length:100},(_,index)=>{const day=1+index%30,status=index%11===0?"Expired":index%7===0?"Ends soon":"Active",plan=plans[index%plans.length];return <article className="card admin-user" key={index}><div><strong>Demo Business {String(index+1).padStart(3,"0")}</strong><small>owner{index+1}@demo.reviewportal.local · owner · active</small><div className={`subscription-summary ${status==="Expired"?"expired-state":status==="Ends soon"?"ending-state":"active-state"}`}><strong>{plan} · {status}</strong><span>Joined Aug {day}, 2026 · visual preview only</span></div></div><span>{1+index%5} portals · {12+(index*17)%140} responses</span><button className="button secondary" disabled>Demo account</button></article>})}</div>}
function LegalManager({busy,save}:{busy:boolean;save:(values:Parameters<ReactMutation<typeof api.legalDocuments.save>>[0])=>Promise<boolean>}){const [documentType,setDocumentType]=useState<"privacy"|"terms"|"acceptable-use">("terms"),[locale,setLocale]=useState<Locale>("ka"),stored=useQuery(api.legalDocuments.document,{documentType,locale}),fallback=legalContent[documentType][locale],doc=stored?{title:stored.title,intro:stored.intro,sections:stored.sections.map(section=>[section.heading,section.body] as [string,string])}:fallback,key=`${documentType}:${locale}:${stored?._id??"default"}`;return <form key={key} className="card legal-manager" onSubmit={event=>{event.preventDefault();const f=new FormData(event.currentTarget),sections=String(f.get("sections")??"").split(/\n---\n/).map(block=>{const [heading,...body]=block.split("\n");return {heading:heading.trim(),body:body.join("\n").trim()}}).filter(section=>section.heading&&section.body);void save({documentType,locale,title:String(f.get("title")),intro:String(f.get("intro")),sections,version:String(f.get("version"))})}}><div className="legal-manager-controls"><label>Document<select value={documentType} onChange={event=>setDocumentType(event.target.value as typeof documentType)}><option value="terms">Terms of Service</option><option value="privacy">Privacy Policy</option><option value="acceptable-use">Acceptable Use Policy</option></select></label><label>Language<select value={locale} onChange={event=>setLocale(event.target.value as Locale)}><option value="ka">Georgian</option><option value="en">English</option><option value="ru">Russian</option></select></label><label>Version<input name="version" required defaultValue={stored?.version??new Date().toISOString().slice(0,10)}/></label></div><label>Page title<input name="title" required defaultValue={doc.title}/></label><label>Introduction<textarea name="intro" required defaultValue={doc.intro}/></label><label>Sections <small>Heading on the first line, body below it. Separate sections with a line containing ---</small><textarea className="legal-sections-editor" name="sections" required defaultValue={doc.sections.map(([heading,body])=>`${heading}\n${body}`).join("\n---\n")}/></label><div className="legal-publish-note"><strong>Publishing updates the public page immediately.</strong><span>An in-app notice can be shown to signed-in users. Automated email is unavailable until a sender provider and verified domain are configured.</span></div><button className="button" disabled={busy}>Publish legal document</button></form>}
function SubscriptionSummary({subscription}:{subscription:AdminUsers[number]["subscription"]}){
  const [now]=useState(()=>Date.now());
  if(!subscription)return <div className="subscription-summary trial-state"><strong>Trial / no paid plan</strong><span>Limited trial access</span></div>;
  const expired=subscription.status==="expired"||(subscription.expiresAt??0)<=now,days=subscription.expiresAt?Math.ceil((subscription.expiresAt-now)/86400000):null;
  return <div className={`subscription-summary ${expired?"expired-state":days!==null&&days<=7?"ending-state":"active-state"}`}><strong>{subscription.packageName??"Subscription"} · {expired?"Expired":"Active"}</strong><span>{subscription.expiresAt?`${expired?"Ended":"Ends"} ${new Intl.DateTimeFormat("en",{dateStyle:"medium"}).format(subscription.expiresAt)}${!expired&&days!==null?` · ${days} days remaining`:""}`:"No end date"}</span>{!expired&&days!==null&&days<=7?<small>Email reminders due at 7, 3, 2 and 1 days. Delivery provider is not configured.</small>:null}</div>;
}
function SubscriptionEditor({user,packages,busy,close,assign,expire}:{user:AdminUsers[number];packages:AdminCatalog["packages"];busy:boolean;close:()=>void;assign:(values:Parameters<ReactMutation<typeof api.admin.assignSubscription>>[0])=>Promise<void>;expire:()=>Promise<void>}){
  const [now]=useState(()=>Date.now()),date=(timestamp:number)=>new Date(timestamp-new Date(timestamp).getTimezoneOffset()*60000).toISOString().slice(0,10),current=user.subscription,[startDate,setStartDate]=useState(()=>date(now)),[endDate,setEndDate]=useState(()=>{const next=new Date(now);next.setMonth(next.getMonth()+1);return date(next.getTime())}),[duration,setDuration]=useState(1),[durationUnit,setDurationUnit]=useState<"days"|"months"|"years">("months");
  function calculateEnd(){const next=new Date(`${startDate}T12:00:00`);if(durationUnit==="days")next.setDate(next.getDate()+duration);if(durationUnit==="months")next.setMonth(next.getMonth()+duration);if(durationUnit==="years")next.setFullYear(next.getFullYear()+duration);setEndDate(date(next.getTime()))}
  return <div className="dashboard-modal-backdrop"><section className="dashboard-modal card" role="dialog" aria-modal="true"><div className="modal-head"><div><span className="eyebrow">Subscription access</span><h2>{user.user.name||user.user.email}</h2></div><button className="icon-button" onClick={close}><X size={20}/></button></div><SubscriptionSummary subscription={current}/><form className="subscription-form" onSubmit={event=>{event.preventDefault();const f=new FormData(event.currentTarget),start=new Date(`${String(f.get("startsAt"))}T00:00:00`).getTime(),end=new Date(`${String(f.get("expiresAt"))}T23:59:59`).getTime();void assign({ownerId:user.user._id,packageId:String(f.get("packageId")) as AdminCatalog["packages"][number]["_id"],startsAt:start,expiresAt:end,adminNotes:String(f.get("notes")??"")||undefined})}}><label>Package<select name="packageId" required defaultValue={current?.packageId??packages[0]?._id}>{packages.map(plan=><option key={plan._id} value={plan._id}>{plan.name.en} · {plan.priceDisplay}</option>)}</select></label><div className="duration-shortcut"><label>Duration<input type="number" min="1" value={duration} onChange={event=>setDuration(Math.max(1,Number(event.target.value)))}/></label><label>Unit<select value={durationUnit} onChange={event=>setDurationUnit(event.target.value as typeof durationUnit)}><option value="days">Days</option><option value="months">Months</option><option value="years">Years</option></select></label><button className="button secondary" type="button" onClick={calculateEnd}>Calculate end date</button></div><div className="subscription-dates"><label>Access starts<input type="date" name="startsAt" required value={startDate} onChange={event=>setStartDate(event.target.value)}/></label><label>Access ends<input type="date" name="expiresAt" required value={endDate} onChange={event=>setEndDate(event.target.value)}/></label></div><label>Internal note<textarea name="notes" defaultValue={current?.adminNotes??""} placeholder="Payment reference, custom terms or reason for extension"/></label><p className="muted-copy">Suspending blocks the entire account from signing in. Ending a subscription is different: the customer keeps dashboard and history access, but public portals stop accepting new feedback until reactivated.</p><div className="portal-actions modal-actions">{current?<button className="button secondary danger-button" type="button" disabled={busy} onClick={()=>void expire()}>End access now</button>:null}<button type="button" className="button secondary" onClick={close}>Cancel</button><button className="button" disabled={busy||!packages.length}>Save subscription</button></div></form></section></div>;
}
function AdminHeading({
  icon: Icon,
  title,
  action,
  onClick,
}: {
  icon: typeof ShoppingBag;
  title: string;
  action?: string;
  onClick?: () => void;
}) {
  return (
    <div className="admin-manager-heading">
      <h3>
        <Icon size={20} />
        {title}
      </h3>
      {action ? (
        <button className="button secondary" onClick={onClick}>
          <Plus size={16} />
          {action}
        </button>
      ) : null}
    </div>
  );
}
function ProductEditor({
  item,
  busy,
  cancel,
  save,
  generateProductImageUploadUrl,
}: {
  item?: AdminCatalog["products"][number];
  busy: boolean;
  cancel: () => void;
  save: (
    values: Parameters<ReactMutation<typeof api.admin.saveProduct>>[0],
  ) => Promise<void>;
  generateProductImageUploadUrl: ReactMutation<typeof api.admin.generateProductImageUploadUrl>;
}) {
  const [imageStorageId,setImageStorageId]=useState<Parameters<ReactMutation<typeof api.admin.saveProduct>>[0]["imageStorageId"]>(),[uploading,setUploading]=useState(false),[uploadError,setUploadError]=useState("");
  return (
    <form
      className="card admin-editor"
      onSubmit={(event) => {
        event.preventDefault();
        const f = new FormData(event.currentTarget),
          compare = Number(f.get("compare"));
        void save({
          productId: item?._id,
          slug: String(f.get("slug")),
          kind: String(f.get("kind")) as "individual" | "set",
          name: {
            ka: String(f.get("nameKa")),
            en: String(f.get("nameEn")),
            ru: String(f.get("nameRu")),
          },
          description: {
            ka: String(f.get("descriptionKa")),
            en: String(f.get("descriptionEn")),
            ru: String(f.get("descriptionRu")),
          },
          priceGel: Number(f.get("price")),
          compareAtPriceGel: compare || undefined,
          stockQuantity: String(f.get("stock") ?? "").trim() === "" ? undefined : Number(f.get("stock")),
          available: f.get("available") === "on",
          imageUrl: item?.imageUrl,
          imageStorageId,
          sortOrder: Number(f.get("sort")),
        });
      }}
    >
      <h3>{item ? "Edit product" : "New product or set"}</h3>
      <div className="admin-form-grid">
        <label>
          Slug
          <input name="slug" required defaultValue={item?.slug ?? ""} />
        </label>
        <label>
          Type
          <select name="kind" defaultValue={item?.kind ?? "individual"}>
            <option value="individual">Individual product</option>
            <option value="set">Set / bundle</option>
          </select>
        </label>
        <label>
          Price (GEL)
          <input
            name="price"
            type="number"
            min="0"
            step="0.01"
            required
            defaultValue={item?.priceGel ?? 0}
          />
        </label>
        <label>
          Crossed price
          <input
            name="compare"
            type="number"
            min="0"
            step="0.01"
            defaultValue={item?.compareAtPriceGel ?? ""}
          />
        </label>
        <label>
          Stock counter (leave blank to hide)
          <input
            name="stock"
            type="number"
            min="0"
            defaultValue={item?.stockQuantity ?? ""}
          />
        </label>
        <label>
          Order
          <input
            name="sort"
            type="number"
            defaultValue={item?.sortOrder ?? 1}
          />
        </label>
        <label className="wide product-image-upload">
          Product image (PNG, JPEG or WebP, maximum 2 MB)
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            required={!item}
            disabled={uploading}
            onChange={async event=>{const file=event.target.files?.[0];if(!file)return;if(!["image/png","image/jpeg","image/webp"].includes(file.type)||file.size>2_000_000){setUploadError("Choose a PNG, JPEG or WebP image up to 2 MB.");return}setUploading(true);setUploadError("");try{const url=await generateProductImageUploadUrl({}),response=await fetch(url,{method:"POST",headers:{"Content-Type":file.type},body:file});if(!response.ok)throw new Error("Upload failed");const result=await response.json() as {storageId:Parameters<ReactMutation<typeof api.admin.saveProduct>>[0]["imageStorageId"]};setImageStorageId(result.storageId)}catch{setUploadError("The image could not be uploaded. Try again.")}finally{setUploading(false)}}}
          />
          <small>{uploading?"Uploading…":imageStorageId?"New image ready to save.":item?"Keep the existing image or choose a replacement.":"Upload an image to continue."}</small>
          {uploadError?<span className="field-error">{uploadError}</span>:null}
        </label>
        {(["Ka", "En", "Ru"] as const).map((code) => (
          <div className="locale-fields" key={code}>
            <label>
              Name {code}
              <input
                name={`name${code}`}
                required
                defaultValue={
                  item?.name[code.toLowerCase() as "ka" | "en" | "ru"] ?? ""
                }
              />
            </label>
            <label>
              Description {code}
              <textarea
                name={`description${code}`}
                required
                defaultValue={
                  item?.description[code.toLowerCase() as "ka" | "en" | "ru"] ??
                  ""
                }
              />
            </label>
          </div>
        ))}
        <label className="check-label wide">
          <input
            name="available"
            type="checkbox"
            defaultChecked={item?.available ?? true}
          />
          Visible in store
        </label>
      </div>
      <div className="portal-actions">
        <button type="button" className="button secondary" onClick={cancel}>
          Cancel
        </button>
        <button className="button" disabled={busy}>
          Save product
        </button>
      </div>
    </form>
  );
}
function PackageEditor({
  item,
  busy,
  cancel,
  save,
}: {
  item?: AdminCatalog["packages"][number];
  busy: boolean;
  cancel: () => void;
  save: (
    values: Parameters<ReactMutation<typeof api.admin.savePackage>>[0],
  ) => Promise<void>;
}) {
  return (
    <form
      className="card admin-editor"
      onSubmit={(event) => {
        event.preventDefault();
        const f = new FormData(event.currentTarget),
          lines = (key: string) =>
            String(f.get(key))
              .split("\n")
              .map((x) => x.trim())
              .filter(Boolean),
          compare = Number(f.get("compare"));
        void save({
          packageId: item?._id,
          slug: String(f.get("slug")),
          name: {
            ka: String(f.get("nameKa")),
            en: String(f.get("nameEn")),
            ru: String(f.get("nameRu")),
          },
          description: {
            ka: String(f.get("descriptionKa")),
            en: String(f.get("descriptionEn")),
            ru: String(f.get("descriptionRu")),
          },
          priceGel: Number(f.get("price")),
          compareAtPriceGel: compare || undefined,
          featuresLocalized: {
            ka: lines("featuresKa"),
            en: lines("featuresEn"),
            ru: lines("featuresRu"),
          },
          portalLimit: Number(f.get("portalLimit")),
          visible: f.get("visible") === "on",
          sortOrder: Number(f.get("sort")),
        });
      }}
    >
      <h3>{item ? "Edit subscription package" : "New subscription package"}</h3>
      <div className="admin-form-grid">
        <label>
          Slug
          <input name="slug" required defaultValue={item?.slug ?? ""} />
        </label>
        <label>
          Monthly price (0 = custom)
          <input
            name="price"
            type="number"
            min="0"
            step="0.01"
            required
            defaultValue={item?.priceGel ?? 0}
          />
        </label>
        <label>
          Crossed price
          <input
            name="compare"
            type="number"
            min="0"
            step="0.01"
            defaultValue={item?.compareAtPriceGel ?? ""}
          />
        </label>
        <label>
          Portal limit
          <input
            name="portalLimit"
            type="number"
            min="1"
            required
            defaultValue={item?.portalLimit ?? 1}
          />
        </label>
        <label>
          Order
          <input
            name="sort"
            type="number"
            defaultValue={item?.sortOrder ?? 1}
          />
        </label>
        {(["Ka", "En", "Ru"] as const).map((code) => {
          const locale = code.toLowerCase() as "ka" | "en" | "ru";
          return (
            <div className="locale-fields" key={code}>
              <label>
                Name {code}
                <input
                  name={`name${code}`}
                  required
                  defaultValue={item?.name[locale] ?? ""}
                />
              </label>
              <label>
                Description {code}
                <textarea
                  name={`description${code}`}
                  required
                  defaultValue={item?.description?.[locale] ?? ""}
                />
              </label>
              <label>
                Features {code} (one per line)
                <textarea
                  name={`features${code}`}
                  required
                  defaultValue={(
                    item?.featuresLocalized?.[locale] ??
                    (locale === "en" ? item?.features : []) ??
                    []
                  ).join("\n")}
                />
              </label>
            </div>
          );
        })}
        <label className="check-label wide">
          <input
            name="visible"
            type="checkbox"
            defaultChecked={item?.visible ?? true}
          />
          Visible on pricing pages
        </label>
      </div>
      <div className="portal-actions">
        <button type="button" className="button secondary" onClick={cancel}>
          Cancel
        </button>
        <button className="button" disabled={busy}>
          Save package
        </button>
      </div>
    </form>
  );
}
function Metric({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: typeof Star;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="metric dashboard-metric">
      <span className="metric-icon"><Icon size={19}/></span>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </div>
  );
}
function Empty({
  title,
  body,
  action,
  onClick,
}: {
  title: string;
  body: string;
  action?: string;
  onClick?: () => void;
}) {
  return (
    <div className="card empty-state">
      <CheckCircle2 size={34} />
      <h3>{title}</h3>
      <p>{body}</p>
      {action ? (
        <button className="button" onClick={onClick}>
          {action}
        </button>
      ) : null}
    </div>
  );
}
