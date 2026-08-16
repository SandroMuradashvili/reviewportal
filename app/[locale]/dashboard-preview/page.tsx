import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PublicDashboardPreview } from "@/components/dashboard";
import { getLocale } from "@/lib/i18n";

export const metadata = {
  title: "Dashboard preview | ReviewPortal",
  robots: { index: false, follow: true },
};

export default async function DashboardPreviewPage({params}:{params:Promise<{locale:string}>}) {
  const locale=getLocale((await params).locale);
  return <><Link className="preview-back button secondary" href={`/${locale}`}><ArrowLeft size={16}/>{locale==="ka"?"მთავარ გვერდზე":locale==="ru"?"На главную":"Back to website"}</Link><PublicDashboardPreview locale={locale}/></>;
}
