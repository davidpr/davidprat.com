export type LinkItem = { label: string; href: string };
export type ExperienceItem = { period: string; org: string; role: string; points: string[] };
export type ArticleItem = { title: string; href: string };
export type StatItem = { value: string; label: string };
export type SiteContent = {
  name: string;
  headline: string;
  location: string;
  availability: string;
  stats: StatItem[];
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
  availability: "Open to Head of Engineering and Director roles",
  stats: [
    { value: "15+", label: "years in engineering" },
    { value: "30+", label: "ML engineers led" },
    { value: "4", label: "teams managed" },
    { value: "50%+", label: "LLM size reduction shipped" },
  ],
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
      period: "2026 — present",
      org: "Finlooker.io",
      role: "Founder",
      points: [
        "Building a macroeconomic-intelligence platform solo: Next.js on Vercel and Render, GitHub Actions CI/CD, Storybook and Chromatic for visual regression, PostHog for product analytics.",
      ],
    },
    {
      period: "2026",
      org: "Multiverse Computing",
      role: "Senior Engineering Manager — AI",
      points: [
        "Managed 4 teams (30+ ML engineers, 4 tech leads) building custom LLMs and SLMs for enterprise clients in healthcare, banking and energy.",
        "Cut model size 50%+ at 2–3% benchmark cost with CompactifAI, saving clients roughly half their inference budget on average.",
        "Co-led the cross-department LLM pipeline from research to production API serving and on-device deployment; open releases on Hugging Face.",
        "Partnered with the CTPO on roadmap and OKRs; owned GPU allocation across teams.",
      ],
    },
    {
      period: "2025 — 2026",
      org: "IAG",
      role: "Senior Tech Lead · Interim Head of Infrastructure",
      points: [
        "Led DevSecOps architecture and ways of working across the MRO department; guided new tech leads and hiring.",
        "Led technical delivery of an aircraft-maintenance AI assistant (RAG, hierarchical agents, serverless ingestion) within a €40M cost-savings programme.",
      ],
    },
    {
      period: "2024 — 2025",
      org: "IAG",
      role: "Tech Lead · Engineering Manager (two squads)",
      points: [
        "Led two development squads, bridging engineering with product and business; interviewed around 70 candidates for the new teams.",
        "Designed cloud architectures and data pipelines with AWS, Azure, Snowflake and ClickHouse for big data, AI and web services; accountable for software quality and security.",
      ],
    },
    {
      period: "2021 — 2024",
      org: "AUDI AG",
      role: "Senior Cloud DevSecOps SRE Consultant",
      points: [
        "Ran big-data platform infrastructure on AWS and Cloudera CDP: production Kubernetes clusters, Terraform and Ansible automation, MLOps support and FinOps cost optimization.",
      ],
    },
    {
      period: "2021 — 2024",
      org: "Datapta",
      role: "Founder & Principal Consultant",
      points: [
        "Delivered cloud and data-platform engagements for AUDI AG, Antimetal and Nebula Strategy; built Finlooker v1 with a rotating team of 40+ interns and junior engineers.",
      ],
    },
    {
      period: "2020 — 2022",
      org: "BNP Paribas Fortis",
      role: "Senior Big Data & DevOps Consultant",
      points: [
        "Managed the software release lifecycle for the bank's data hub: CI/CD with Jenkins, Ansible and Kubernetes across Spark, Flink and Kafka clusters.",
        "Built streaming jobs in Scala with Flink and Kafka feeding internal client clusters and BI tooling in a lambda architecture.",
      ],
    },
    {
      period: "2019 — 2021",
      org: "Simig Solutions",
      role: "Big Data & Cloud Architect Consultant",
      points: [
        "Designed and built AWS big-data systems processing daily electricity consumption for the Spanish grid, plus Cloudera and Airflow ETL platforms for energy clients.",
      ],
    },
    {
      period: "2017 — 2019",
      org: "IMIDomics",
      role: "Big Data Technical Lead · Interim Engineering Manager",
      points: [
        "Accountable for company data governance and IT; led the architecture of a GCP big-data platform for biomedical patient data analysis.",
      ],
    },
    {
      period: "2016 — 2017",
      org: "FILMCLUB",
      role: "CTO — EdTech Startup",
      points: [
        "Technology lead for an educational content platform, from infrastructure to client campaign tooling.",
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
