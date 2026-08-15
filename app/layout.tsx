import type { Metadata } from "next";
import "./globals.css";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import { ConvexProvider } from "@/components/convex-provider";
import { LegalConsent } from "@/components/legal-consent";

export const metadata: Metadata = {
  title: { default: "ReviewPortal — Customer feedback made simple", template: "%s · ReviewPortal" },
  description: "Collect private feedback, improve customer service, strengthen your reputation, and make honest Google reviews easier with QR and NFC.",
  icons: { icon: "/brand/secondary.svg", shortcut: "/brand/secondary.svg", apple: "/brand/secondary.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const content=process.env.NEXT_PUBLIC_CONVEX_URL?<ConvexAuthNextjsServerProvider><ConvexProvider>{children}</ConvexProvider></ConvexAuthNextjsServerProvider>:children;
  return <html lang="ka"><body>{content}<LegalConsent/></body></html>;
}
