import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { site } from "@/content/site";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://davidprat.com"),
  title: `${site.name} — ${site.headline}`,
  description: site.about[0],
  alternates: { canonical: "/" },
  keywords: [
    "David Prat",
    "David Prat Robles",
    "Engineering leader",
    "AI infrastructure",
    "LLM platforms",
    "Head of Engineering",
    "Barcelona",
  ],
  openGraph: {
    title: site.name,
    description: site.headline,
    url: "https://davidprat.com",
    siteName: "davidprat.com",
    type: "website",
    images: [{ url: "/avatar.jpg", width: 400, height: 400, alt: site.name }],
  },
  twitter: {
    card: "summary",
    title: site.name,
    description: site.headline,
    images: ["/avatar.jpg"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body className="bg-white text-neutral-900 antialiased dark:bg-neutral-950 dark:text-neutral-100">
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
