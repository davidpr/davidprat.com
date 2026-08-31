export type LinkItem = { label: string; href: string };
export type ExperienceItem = { org: string; role: string; points: string[] };
export type ArticleItem = { title: string; href: string };
export type SiteContent = {
  name: string;
  headline: string;
  location: string;
  heroLinks: LinkItem[];
  about: string[];
  experience: ExperienceItem[];
  writing: {
    intro: string;
    articles: ArticleItem[];
    channels: LinkItem[];
  };
  contact: { heading: string; body: string; links: LinkItem[] };
};

// TODO(user): when articles are pinned on LinkedIn Featured, add them to
// writing.articles; add the YouTube channel URL to writing.channels.
export const site: SiteContent = {
  name: "David Prat Robles",
  headline: "Engineering leader — AI Infrastructure & LLM Platforms",
  location: "Barcelona · remote EU",
  heroLinks: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/davidpratrobles/" },
    { label: "Finlooker.io", href: "https://finlooker.io" },
  ],
  about: [
    "Engineering leader with 15+ years building AI-driven products, most recently as Senior Engineering Manager at Multiverse Computing, leading 4 teams (30+ ML engineers and tech leads) delivering custom LLMs and SLMs to enterprise clients in healthcare, banking and energy.",
    "Before that: Interim Head of Infrastructure and Engineering Manager at IAG, senior cloud and SRE consulting for AUDI AG, and founder of Finlooker, a macroeconomic-intelligence platform.",
    "Executive MBA (EAE, 2026). I write about AI infrastructure and LLM internals.",
  ],
  experience: [
    {
      org: "Multiverse Computing",
      role: "Senior Engineering Manager",
      points: [
        "Managed 4 teams (30+ ML engineers, 4 tech leads) building custom LLMs and SLMs for enterprise clients in healthcare, banking and energy.",
        "Cut model size 50%+ at 2–3% benchmark cost with CompactifAI, saving clients roughly half their inference budget on average.",
        "Co-led the cross-department LLM pipeline from research to production API serving and on-device deployment; open releases on Hugging Face.",
        "Partnered with the CTPO on roadmap and OKRs; owned GPU allocation across teams.",
      ],
    },
    {
      org: "IAG",
      role: "Interim Head of Infrastructure · Engineering Manager",
      points: [
        "Led DevSecOps architecture across the MRO department.",
        "Led technical delivery of an aircraft-maintenance AI assistant (RAG, hierarchical agents, serverless ingestion) within a €40M cost-savings programme.",
      ],
    },
    {
      org: "AUDI AG",
      role: "Senior Cloud / DevSecOps / SRE Consultant",
      points: [
        "Senior cloud, DevSecOps and SRE consulting for global automotive platforms.",
      ],
    },
    {
      org: "Finlooker.io",
      role: "Founder",
      points: [
        "Building a macroeconomic-intelligence platform solo: Next.js on Vercel and Render, GitHub Actions CI/CD, Storybook and Chromatic for visual regression, PostHog for product analytics.",
      ],
    },
  ],
  writing: {
    intro: "I write about AI infrastructure and LLM internals.",
    articles: [],
    channels: [
      {
        label: "Articles on LinkedIn",
        href: "https://www.linkedin.com/in/davidpratrobles/recent-activity/articles/",
      },
    ],
  },
  contact: {
    heading: "Contact",
    body: "The fastest way to reach me is a LinkedIn message.",
    links: [
      { label: "Message me on LinkedIn", href: "https://www.linkedin.com/in/davidpratrobles/" },
    ],
  },
};
