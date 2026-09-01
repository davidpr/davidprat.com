import { site } from "@/content/site";
import {
  TrendingArrowIcon,
  BarChartIcon,
  TeamCirclesIcon,
  MentorPairIcon,
  DocumentIcon,
  PlayButtonIcon,
  CheckmarkIcon,
} from "@/components/StatIcons";

const STAT_ICONS: Record<string, () => React.JSX.Element> = {
  "years in engineering": TrendingArrowIcon,
  "cost savings architected": BarChartIcon,
  "teams led in parallel": TeamCirclesIcon,
  "junior engineers mentored": MentorPairIcon,
  "senior engineers mentored": MentorPairIcon,
  "technical articles published": DocumentIcon,
  "video tutorials produced": PlayButtonIcon,
  "professional certifications": CheckmarkIcon,
};

export function Stats() {
  return (
    <section aria-label="Career highlights" className="fade-up delay-4 pb-10 sm:pb-12">
      <dl className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {site.stats.map((s) => {
          const Icon = STAT_ICONS[s.label];
          return (
            <div key={s.label} className="card relative flex flex-col px-3 py-3.5 text-center">
              {s.href && (
                <a href={s.href} aria-label={`Go to ${s.label} section`} className="absolute inset-0 rounded-2xl" />
              )}
              {Icon && (
                <span className="mx-auto text-violet-500 dark:text-violet-400">
                  <Icon />
                </span>
              )}
              <dt className="order-last mt-0.5 text-xs leading-snug text-neutral-500 dark:text-neutral-400">
                {s.label}
              </dt>
              <dd className="gradient-text text-xl font-bold tracking-tight sm:text-2xl">
                {s.value}
              </dd>
            </div>
          );
        })}
      </dl>
    </section>
  );
}
