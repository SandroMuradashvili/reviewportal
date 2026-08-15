import { Dashboard } from "@/components/dashboard";
export default function Page(){return <Dashboard siteUrl={process.env.NEXT_PUBLIC_SITE_URL??"http://localhost:3000"}/>}
