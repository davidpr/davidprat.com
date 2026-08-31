import type { Metadata } from "next";
import "./globals.css";
import { site } from "@/content/site";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: `${site.name} — ${site.headline}`,
  description: site.about[0],
  openGraph: {
    title: site.name,
    description: site.headline,
    url: "https://davidprat.com",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body className="bg-white text-neutral-900 antialiased dark:bg-neutral-950 dark:text-neutral-100">
        {children}
        <Footer />
      </body>
    </html>
  );
}
