import { LogoMark } from "@/components/Logo";

const items = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Education", href: "#education" },
  { label: "Certifications", href: "#certifications" },
  { label: "Languages", href: "#languages" },
  { label: "Articles", href: "#articles" },
  { label: "Contact", href: "#contact" },
];

export function Nav() {
  return (
    <nav
      aria-label="Sections"
      className="sticky top-0 z-10 border-b border-neutral-200/60 bg-white/75 backdrop-blur-md dark:border-neutral-800/60 dark:bg-neutral-950/75"
    >
      <div className="mx-auto flex max-w-3xl flex-wrap items-center gap-x-5 gap-y-1 px-4 py-2.5 sm:px-6 lg:max-w-4xl">
        <a href="#" aria-label="Back to top" className="flex items-center gap-2">
          <LogoMark className="h-6 w-auto" />
          <span className="text-sm font-bold tracking-wide">DAVID PRAT</span>
        </a>
        <ul className="flex flex-wrap items-center gap-x-5 gap-y-1 sm:ml-auto">
        {items.map((i) => (
          <li key={i.href}>
            <a
              href={i.href}
              className="eyebrow text-neutral-500 transition-colors hover:text-violet-500 dark:text-neutral-400 dark:hover:text-violet-400"
            >
              {i.label}
            </a>
          </li>
        ))}
        </ul>
      </div>
    </nav>
  );
}
