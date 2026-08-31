import Image from "next/image";
import { site } from "@/content/site";
import { LogoMark } from "@/components/Logo";

export function Hero() {
  return (
    <header className="pt-14 pb-12 sm:pt-24 sm:pb-14">
      <div className="flex flex-col-reverse items-start justify-between gap-8 sm:flex-row sm:items-center">
        <div>
          <p className="fade-up flex items-center gap-3">
            <LogoMark className="h-9 w-auto" />
            <span className="eyebrow text-neutral-500 dark:text-neutral-400">davidprat.com</span>
          </p>
          <h1 className="gradient-text fade-up delay-1 mt-4 text-4xl font-bold tracking-tight sm:text-6xl">
            {site.name}
          </h1>
          <p className="fade-up delay-2 mt-4 text-xl text-neutral-700 sm:text-2xl dark:text-neutral-300">
            {site.headline}
          </p>
          <p className="fade-up delay-2 mt-2 text-sm text-neutral-500 dark:text-neutral-400">
            {site.location}
          </p>
        </div>
        <div className="fade-up delay-1 shrink-0 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 p-[3px]">
          <Image
            src="/avatar.jpg"
            alt={`Portrait of ${site.name}`}
            width={160}
            height={160}
            unoptimized
            priority
            className="h-32 w-32 rounded-full object-cover sm:h-40 sm:w-40"
          />
        </div>
      </div>
      <p className="fade-up delay-3 mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm text-emerald-700 dark:text-emerald-300">
        <span aria-hidden="true" className="pulse-dot h-2 w-2 rounded-full bg-emerald-500" />
        {site.availability}
      </p>
      <nav aria-label="Profiles" className="fade-up delay-4 mt-8 flex flex-wrap gap-3">
        {site.heroLinks.map((l, i) => (
          <a
            key={l.href}
            href={l.href}
            className={
              i === 0
                ? "rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-85 dark:bg-white dark:text-neutral-900"
                : "rounded-lg border border-neutral-300 px-5 py-2.5 text-sm font-medium transition-colors hover:border-violet-500/60 dark:border-neutral-700"
            }
          >
            {l.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
