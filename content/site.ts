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
  image?: string;
  imageAlt?: string;
  page?: string;
};
export type EducationItem = { period: string; school: string; degree: string };
export type HighlightItem = { title: string; text: string };
export type StatItem = { value: string; label: string };
export type LanguageItem = { name: string; level: string; credential?: string };
export type CertificationItem = {
  name: string;
  issuer: string;
  badge: string;
};
export type ExternalArticle = {
  title: string;
  date: string;
  href: string;
  source: string;
  topics?: string[];
};
export type SiteContent = {
  name: string;
  headline: string;
  location: string;
  availability: string;
  topSkills: string[];
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
  certifications: CertificationItem[];
  certificationsVisibleCount: number;
  languages: LanguageItem[];
  writing: {
    intro: string;
    channels: LinkItem[];
  };
  externalArticles: ExternalArticle[];
  contact: { heading: string; body: string; links: LinkItem[] };
};

// TODO(user): when articles are pinned on LinkedIn Featured, add them to
// writing.articles; add the YouTube channel URL to writing.channels.
export const site: SiteContent = {
  name: "David Prat Robles",
  headline: "Engineering leader — AI Infrastructure & LLM Platforms",
  location: "Barcelona · remote EU",
  availability: "Open to senior engineering leadership roles",
  topSkills: [
    "Technology Management",
    "Cross-functional Team Leadership",
    "Artificial Intelligence (AI)",
    "Big Data",
    "DevSecOps",
    "Team Building & Hiring",
    "AWS Architecture",
    "K8s",
    "Observability",
  ],
  heroLinks: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/davidpratrobles/" },
    { label: "Finlooker.io", href: "https://finlooker.io" },
    { label: "GitHub", href: "https://github.com/davidpr" },
  ],
  stats: [
    { value: "15+", label: "years in engineering" },
    { value: "€40M+", label: "cost savings architected" },
    { value: "4", label: "teams led in parallel" },
    { value: "40+", label: "junior engineers mentored" },
    { value: "30+", label: "senior engineers mentored" },
    { value: "20", label: "technical articles published" },
    { value: "6", label: "video tutorials produced" },
    { value: "17", label: "professional certifications" },
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
    "Since July 2026 I have been building Finlooker.io independently — while completing my Executive MBA at EAE and exploring my next senior engineering leadership role.",
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
    {
      name: "Finlooker.com (v1)",
      byline: "Datapta",
      period: "Dec 2021 — Sep 2024",
      description:
        "Architect and team lead for the first version of Finlooker — an online platform giving a bird's-eye view over financial markets, macroeconomics and liquidity — delivered as web and mobile apps on hybrid infrastructure with an ArgoCD-based DevSecOps pipeline.",
    },
    {
      name: "Fincoach",
      byline: "Personal project",
      period: "Jan 2024",
      description:
        "RAG-based financial Q&A agent answering tail-risk questions from ingested books — a LlamaIndex PoC exposed through a FastAPI server, running a small local LLM (~1.5 GB) with answers remarkably coherent for its size.",
      href: "https://github.com/davidpr/fincoach-chatbot-server",
      linkLabel: "View on GitHub",
    },
    {
      name: "Universal Data Catalog in AWS",
      page: "/projects/assefy-data-catalog",
      byline: "Assefy · Zürich",
      period: "Dec 2022",
      description:
        "Design and implementation of a data-catalog PoC built on Amundsen, Apache Atlas and Apache Ranger, ingesting metadata from relational databases, data warehouses, files and media such as video, audio and images.",
      image: "/projects/data-catalog-assefy.png",
      imageAlt: "Architecture diagram of the Amundsen-based data catalog on AWS",
    },
    {
      name: "Electricity Consumption Analytics",
      page: "/projects/aseme",
      byline: "ASEME · Barcelona",
      period: "2020 — 2021",
      description:
        "Big-data system on AWS processing daily electricity consumption for Red Eléctrica de España — AWS Glue, EMR, Lambda, PySpark, Redshift and Spectrum — running on-demand transient clusters that cut costs by up to 80%.",
      image: "/projects/aseme-aws-architecture.jpg",
      imageAlt: "AWS architecture diagram of the electricity consumption analytics pipeline",
    },
    {
      name: "Estabanell Energia — Electric Consumption Measurements Automation",
      page: "/projects/estabanell-energia",
      byline: "Simig Solutions · Barcelona",
      period: "2019 — 2020",
      description:
        "Automation of daily electric-consumption measurement processing for the utility Estabanell Energia — a Cloudera CDH ETL platform with Hive, Impala, Kudu and Spark, migrating analytical workloads from SQL Server to the Hadoop ecosystem.",
    },
    {
      name: "Genomics Data Catalog for Diseases",
      page: "/projects/imidomics",
      byline: "IMIDomics · Barcelona / California",
      period: "2017 — 2019",
      description:
        "Online platform for clinical and molecular data retrieval and analysis in a biomedicine company, giving clients a tool to explore available cohort data in the cloud.",
      image: "/projects/imidomics-dashboard.png",
      imageAlt: "React dashboard of the genomics data platform",
    },
    {
      name: "International Project Management Environments",
      page: "/projects/international-project-management",
      byline: "La Salle BCN",
      period: "Jun 2016",
      description:
        "Master's thesis providing project managers with tools for cross-cultural teams and international stakeholders — seeing the big picture of multiculturalism and bridging distant issues such as globalization.",
    },
    {
      name: "Runtime-Guided Hardware Prefetcher Reconfiguration on the IBM POWER7",
      page: "/projects/power7-reconfiguration",
      byline: "UPC · Barcelona Supercomputing Center",
      period: "2015",
      description:
        "Adaptive, application-dependent runtime-guided reconfiguration of the IBM POWER7 hardware prefetcher, published at the ADAPT'15 workshop with BSC co-authors.",
      href: "https://arxiv.org/abs/1501.02282",
      linkLabel: "Paper on arXiv",
    },
    {
      name: "Automatic Venipuncture Using a Peripheral Venous Catheter",
      byline: "Engineering project",
      period: "2014 — 2015",
      description:
        "Engineering project developing a system for automatic venipuncture with a peripheral venous catheter.",
    },
    {
      name: "Parallel Programming Models on the Nvidia Tegra 2 SoC",
      byline: "Universitat Politècnica de Catalunya",
      period: "2011 — 2012",
      description:
        "Degree thesis building the first cluster in the world to use Nvidia Tegra 2 boards for scientific computing, exploiting the power-efficient ARM architecture and analysing the integration of parallel programming models.",
      href: "https://hdl.handle.net/2099.1/11490",
      linkLabel: "Thesis on UPCommons",
    },
    {
      name: "Microcontroller System for Data Acquisition with USB",
      byline: "Universitat Politècnica de Catalunya",
      period: "2008 — 2009",
      description:
        "Design and build of a microcontroller-based data-acquisition system with USB connectivity.",
      href: "https://hdl.handle.net/2099.1/5830",
      linkLabel: "Thesis on UPCommons",
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
  certifications: [
    {
      name: "CKA: Certified Kubernetes Administrator",
      issuer: "The Linux Foundation / CNCF",
      badge: "/badges/cka.png",
    },
    {
      name: "CKAD: Certified Kubernetes Application Developer",
      issuer: "The Linux Foundation / CNCF",
      badge: "/badges/ckad.png",
    },
    {
      name: "CKS: Certified Kubernetes Security Specialist",
      issuer: "The Linux Foundation / CNCF",
      badge: "/badges/cks.png",
    },
    {
      name: "AWS Certified DevOps Engineer — Professional",
      issuer: "Amazon Web Services",
      badge: "/badges/aws-devops-professional.png",
    },
    {
      name: "AWS Certified Solutions Architect — Associate",
      issuer: "Amazon Web Services",
      badge: "/badges/aws-solutions-architect-associate.png",
    },
    {
      name: "AWS Certified Security — Specialty",
      issuer: "Amazon Web Services",
      badge: "/badges/aws-security-specialty.jpg",
    },
    {
      name: "AWS Certified SysOps Administrator — Associate",
      issuer: "Amazon Web Services",
      badge: "/badges/aws-sysops-associate.png",
    },
    {
      name: "HashiCorp Certified: Terraform Associate",
      issuer: "HashiCorp",
      badge: "/badges/terraform-associate.png",
    },
    {
      name: "PCA: Prometheus Certified Associate",
      issuer: "The Linux Foundation / CNCF",
      badge: "/badges/pca.png",
    },
    {
      name: "LPIC-1: Linux Administrator",
      issuer: "Linux Professional Institute",
      badge: "/badges/lpic1.png",
    },
    {
      name: "AWS Databricks Platform Architect",
      issuer: "Databricks",
      badge: "/badges/databricks-aws-platform-architect.png",
    },
    {
      name: "Generative AI Fundamentals",
      issuer: "Databricks",
      badge: "/badges/databricks-genai-fundamentals.png",
    },
    {
      name: "Certified SAFe® 6 Product Owner/Product Manager",
      issuer: "Scaled Agile, Inc.",
      badge: "/badges/safe6-popm.png",
    },
    {
      name: "Certified SAFe® 6 Scrum Master",
      issuer: "Scaled Agile, Inc.",
      badge: "/badges/safe6-scrum-master.png",
    },
    {
      name: "Certified SAFe® 6 Agilist — Leading SAFe®",
      issuer: "Scaled Agile, Inc.",
      badge: "/badges/safe6-agilist.png",
    },
    {
      name: "Microsoft Certified: Azure Data Fundamentals",
      issuer: "Microsoft",
      badge: "/badges/azure-data-fundamentals.png",
    },
    {
      name: "Microsoft Certified: Azure AI Fundamentals",
      issuer: "Microsoft",
      badge: "/badges/azure-ai-fundamentals.png",
    },
  ],
  certificationsVisibleCount: 6,
  languages: [
    { name: "Spanish", level: "Native" },
    { name: "Catalan", level: "Native" },
    {
      name: "English",
      level: "C2",
      credential: "Cambridge English: Proficiency (CPE) · Cambridge ESOL · 2014",
    },
    {
      name: "German",
      level: "B2",
      credential: "Goethe-Zertifikat B2 · Goethe-Institut Barcelona · 2019",
    },
    {
      name: "French",
      level: "B2",
      credential: "DELF B2 — Diplôme d'Études en Langue Française · Institut français · 2020",
    },
  ],
  writing: {
    intro: "I write about AI infrastructure and LLM internals.",
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
  externalArticles: [
    {
      title: "The 0.01% Guide to AI Infrastructure: Understanding LLM Internals and GPU Execution",
      date: "2026-05-06",
      href: "https://www.linkedin.com/pulse/001-guide-ai-infrastructure-understanding-llm-gpu-david-prat-robles-hr5te/",
      source: "LinkedIn",
      topics: ["AI & LLMs"],
    },
    {
      title: "AI 2026-2030: Bubble or Golden Era?",
      date: "2026-04-04",
      href: "https://www.linkedin.com/pulse/ai-2026-2030-bubble-golden-era-david-prat-robles-wonre/",
      source: "LinkedIn",
      topics: ["AI & LLMs"],
    },
  ],
  contact: {
    heading: "Contact",
    body: "The fastest way to reach me is a LinkedIn message.",
    links: [
      { label: "Message me on LinkedIn", href: "https://www.linkedin.com/in/davidpratrobles/" },
    ],
  },
};
