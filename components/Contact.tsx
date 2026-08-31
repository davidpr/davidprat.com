import { site } from "@/content/site";

export function Contact() {
  return (
    <section aria-labelledby="contact-heading" className="py-8">
      <h2 id="contact-heading" className="text-xl font-semibold">
        {site.contact.heading}
      </h2>
      <p className="mt-3 leading-relaxed text-neutral-700 dark:text-neutral-300">
        {site.contact.body}
      </p>
      <p className="mt-3 flex gap-4">
        {site.contact.links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className="text-sm underline underline-offset-4 hover:no-underline"
          >
            {l.label}
          </a>
        ))}
      </p>
    </section>
  );
}
