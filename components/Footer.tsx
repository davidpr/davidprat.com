import { site } from "@/content/site";

// Evaluated once at build time — the static export bakes in the deploy date.
const buildDate = new Date().toLocaleDateString("en-GB", {
  month: "long",
  year: "numeric",
});
const buildYear = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="mt-4 border-t border-neutral-200 py-8 dark:border-neutral-800">
      <div className="mx-auto max-w-3xl px-4 text-center text-xs leading-relaxed text-neutral-500 sm:px-6 lg:max-w-4xl dark:text-neutral-400">
        <p>Designed and made by {site.name}</p>
        <p className="mt-1">
          © 2018–{buildYear} {site.name}. All rights reserved. · Last updated: {buildDate}
        </p>
      </div>
    </footer>
  );
}
