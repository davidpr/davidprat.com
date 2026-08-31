import { site } from "@/content/site";

export function Contact() {
  return (
    <section aria-labelledby="contact-heading" className="py-10">
      <div className="card p-6 text-center sm:p-12">
        <p className="eyebrow text-violet-600 dark:text-violet-400">08</p>
        <h2 id="contact-heading" className="mt-1 text-2xl font-semibold tracking-tight">
          {site.contact.heading}
        </h2>
        <p className="mx-auto mt-4 max-w-md leading-relaxed text-neutral-700 dark:text-neutral-300">
          {site.contact.body}
        </p>
        <p className="mt-6 flex justify-center gap-3">
          {site.contact.links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-lg bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-85 dark:bg-white dark:text-neutral-900"
            >
              {l.label}
            </a>
          ))}
        </p>
      </div>
    </section>
  );
}
