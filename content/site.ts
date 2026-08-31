export type LinkItem = { label: string; href: string };
export type ExperienceItem = { period: string; org: string; role: string; points: string[] };
export type ProjectItem = {
  name: string;
  byline: string;
  period: string;
  description: string;
  stack?: string;
  href?: string;
  linkLabel?: string;
};
export type EducationItem = { period: string; school: string; degree: string };
export type HighlightItem = { title: string; text: string };
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
  aboutHighlights: HighlightItem[];
  aboutClosing: string[];
  experience: ExperienceItem[];
  experienceVisibleCount: number;
  projects: ProjectItem[];
  projectsVisibleCount: number;
  education: EducationItem[];
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
    "Engineering leader with over 15 years of experience leading cross-functional teams to build AI-driven products. My expertise spans product strategy, cloud infrastructure, and execution across fintech, aviation, and large language models — bridging engineering, design and data science to drive outcomes that serve both user needs and business goals.",
  ],
  aboutHighlights: [
    {
      title: "Enterprise AI — Multiverse Computing",
      text: "Led cross-industry AI initiatives solving foundational problems for clients in healthcare, banking and energy, resulting in €20M+ in new revenue — and roughly 50% average budget savings for clients through quantum-inspired LLM pruning and healing techniques.",
    },
    {
      title: "Aviation innovation — IAG",
      text: "Directed the development of technical products that optimized aircraft maintenance workflows, generating over €40M in measurable cost savings.",
    },
    {
      title: "Entrepreneurship — Datapta & Finlooker",
      text: "Founded Datapta, a consulting company delivering cloud and data-platform engagements for AUDI AG, Antimetal and Nebula Strategy, and built Finlooker — a macroeconomic-intelligence platform — with a rotating team of 40+ interns and junior engineers. Relaunched Finlooker.io in 2026 on an AI-native stack.",
    },
    {
      title: "Knowledge sharing",
      text: "I regularly author tutorials on big data, AI and DevSecOps, and break down complex technical concepts on my YouTube channel.",
    },
  ],
  aboutClosing: [
    "Since July 2026 I have been building Finlooker.io independently — while completing my Executive MBA at EAE and exploring my next Head of Engineering or Director role.",
    "Outside of work, I cultivate balance through therapeutic practices and support nonprofits that promote societal wellness and conscious living.",
  ],
  experience: [
    {
      period: "2026",
      org: "Multiverse Computing",
      role: "Senior Engineering Manager — AI",
      points: [
        "Managed 4 teams (30+ ML engineers, 4 tech leads) building custom LLMs and SLMs for enterprise clients in healthcare, banking and energy — around €20M in delivered revenue.",
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
  experienceVisibleCount: 3,
  projects: [
    {
      name: "Finlooker.io",
      byline: "Founder",
      period: "Jun 2026 — present",
      description:
        "A macroeconomic-intelligence platform: a bird's-eye view over financial markets, macroeconomics and liquidity worldwide, built for people who want the signal without the noise.",
      stack:
        "Next.js on Vercel and Render · GitHub Actions CI/CD · Storybook and Chromatic for visual regression · PostHog product analytics · built with Claude Code",
      href: "https://finlooker.io",
      linkLabel: "Visit Finlooker.io",
    },
    {
      name: "GPT-OSS 10B (Blackstar)",
      byline: "Multiverse Computing",
      period: "Apr 2026",
      description:
        "Compressed GPT-OSS 20B to half its size while preserving up to 98% accuracy, halving model utilisation costs; improved Spanish, coding and tool calling, and served the model over API with vLLM.",
      href: "https://huggingface.co/MultiverseComputingCAI",
      linkLabel: "View on Hugging Face",
    },
    {
      name: "Qwen3 0.3B (LittleLamb)",
      byline: "Multiverse Computing",
      period: "Feb — Mar 2026",
      description:
        "Compressed Qwen3 0.6B to half its size at up to 98% accuracy; enhanced Spanish and Android-friendly tool calling, shipped in the CompactifAI mobile app via llama.cpp and released on Hugging Face.",
      href: "https://huggingface.co/MultiverseComputingCAI",
      linkLabel: "View on Hugging Face",
    },
    {
      name: "Whisper Large V3 Turbo Slim",
      byline: "Multiverse Computing",
      period: "Jan — Mar 2026",
      description:
        "Halved the size of Whisper Large V3 Turbo at up to 98% accuracy with better resilience to background noise; served via vLLM API to healthcare-insurance and banking clients.",
      href: "https://huggingface.co/MultiverseComputingCAI",
      linkLabel: "View on Hugging Face",
    },
    {
      name: "ASIST",
      byline: "IAG",
      period: "Sep 2024 — Jan 2026",
      description:
        "Real-time AI assistant for aircraft maintenance operations — LangGraph and pgvector RAG with streaming responses and reasoning visualization — reducing turnaround times and AOG incidents, with £20M+ in annual savings across the group.",
    },
    {
      name: "Engine Optimisation System (EOS)",
      byline: "IAG",
      period: "Sep 2024 — Jan 2026",
      description:
        "Genetic-algorithm system optimizing engine maintenance schedules, delivering €40M in measurable cost savings.",
    },
  ],
  projectsVisibleCount: 3,
  education: [
    {
      period: "2025 — 2026",
      school: "EAE Business School",
      degree: "Executive MBA, Business Administration and Management",
    },
    {
      period: "2014 — 2016",
      school: "La Salle BCN",
      degree: "MSc Project Management (PMI-accredited)",
    },
    {
      period: "2012 — 2014",
      school: "Universitat Politècnica de Catalunya",
      degree: "MSc Innovation and Research — High Performance Computing",
    },
    {
      period: "2007 — 2011",
      school: "Universitat Politècnica de Catalunya",
      degree: "BSc Computer Science — High Performance Architectures",
    },
    {
      period: "2004 — 2007",
      school: "Universitat Politècnica de Catalunya",
      degree: "Associate Degree, Computer Systems — Embedded Systems and Software Engineering",
    },
  ],
  writing: {
    intro: "I write about AI infrastructure and LLM internals.",
    articles: [
      {
        title: "Guide to AI Infrastructure: Understanding LLM GPUs",
        href: "https://www.linkedin.com/pulse/001-guide-ai-infrastructure-understanding-llm-gpu-david-prat-robles-hr5te/",
      },
    ],
    channels: [
      {
        label: "Articles on LinkedIn",
        href: "https://www.linkedin.com/in/davidpratrobles/recent-activity/articles/",
      },
      {
        label: "YouTube — @davidpratr",
        href: "https://www.youtube.com/@davidpratr",
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
