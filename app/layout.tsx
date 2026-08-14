import type { Metadata } from "next";
import "./globals.css";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import { ConvexProvider } from "@/components/convex-provider";

export const metadata: Metadata = {
  title: { default: "ReviewPortal — Customer feedback made simple", template: "%s · ReviewPortal" },
  description: "Private customer feedback, simple analytics, and QR/NFC products for Georgian businesses.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const content=process.env.NEXT_PUBLIC_CONVEX_URL?<ConvexAuthNextjsServerProvider><ConvexProvider>{children}</ConvexProvider></ConvexAuthNextjsServerProvider>:children;
  return <html lang="ka"><body>{content}</body></html>;
}
