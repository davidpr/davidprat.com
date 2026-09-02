export type LinkItem = { label: string; href: string };
export type ExperienceItem = {
  period: string;
  org: string;
  role: string;
  points: string[];
  logo?: string;
};
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
export type StatItem = { value: string; label: string; href?: string };
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
  cover?: string;
};
export type VideoItem = { title: string; youtubeId: string; duration: string };
export type SiteContent = {
  name: string;
  headline: string;
  location: string;
  availability: string;
  resumeUrl: string;
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
  videos: VideoItem[];
  videosVisibleCount: number;
  youtubeChannel: LinkItem;
  contact: { heading: string; body: string; links: LinkItem[] };
};

// TODO(user): when articles are pinned on LinkedIn Featured, add them to
// writing.articles; add the YouTube channel URL to writing.channels.
export const site: SiteContent = {
  name: "David Prat Robles",
  headline: "Engineering leader — AI Infrastructure & LLM Platforms",
  location: "Barcelona · remote EU",
  availability: "Open to senior engineering leadership roles",
  resumeUrl: "/david-prat-robles-resume.pdf",
  topSkills: [
    "Technology Management",
    "Cross-functional Team Leadership",
    "Artificial Intelligence (AI)",
    "Big Data",
    "DevSecOps",
    "Team Building & Hiring",
    "Cloud Architecture",
    "K8s",
    "Observability",
  ],
  heroLinks: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/davidpratrobles/" },
    { label: "Finlooker.io", href: "https://finlooker.io" },
    { label: "GitHub", href: "https://github.com/davidpr" },
  ],
  stats: [
    { value: "15+", label: "years in engineering", href: "#experience" },
    { value: "€40M+", label: "cost savings architected" },
    { value: "4", label: "teams led in parallel" },
    { value: "40+", label: "junior engineers mentored" },
    { value: "30+", label: "senior engineers mentored" },
    { value: "20", label: "technical articles published", href: "#articles" },
    { value: "9", label: "video tutorials produced", href: "#videos" },
    { value: "17", label: "professional certifications", href: "#certifications" },
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
      logo: "/experience/multiverse-computing/logo.svg",
      role: "Senior Engineering Manager — AI",
      points: [
        "Managed 4 teams (30+ ML engineers, 4 tech leads) building custom LLMs and SLMs for enterprise clients — around €20M in delivered revenue, plus open releases to the Hugging Face community.",
        "Cut model size 50%+ at 2–3% benchmark cost with CompactifAI, saving clients roughly half their inference budget on average; extended model capabilities with tool calling, coding and multilingual support.",
        "Coached tech leads and ran knowledge-transfer sessions for new team members, building a collaborative, high-performing culture across the teams.",
        "Co-led the cross-department LLM pipeline from research to production API serving and on-device deployment.",
        "Partnered with the CTPO on roadmap and OKRs, drove standardisation of data and metadata across departments, and owned GPU allocation across teams.",
      ],
    },
    {
      period: "2025 — 2026",
      org: "IAG",
      logo: "/experience/iag/logo.svg",
      role: "Senior Tech Lead · Interim Head of Infrastructure",
      points: [
        "Led DevSecOps architecture and ways of working across the MRO department, including rolling out AI-assisted code generation and review; guided new tech leads and hiring.",
        "Led technical delivery of an aircraft-maintenance AI assistant (RAG, hierarchical agents, serverless ingestion) within a €40M cost-savings programme, with DevSecOps and IaC on GitHub Actions and Terraform.",
        "Partnered with senior leadership on long-term product backlog planning.",
      ],
    },
    {
      period: "2024 — 2025",
      org: "IAG",
      logo: "/experience/iag/logo.svg",
      role: "Tech Lead · Engineering Manager (two squads)",
      points: [
        "Led two development squads — task definition, monthly backlog planning and technical/architectural debt management — bridging engineering with product and business; interviewed around 70 candidates for the new teams.",
        "Owned software quality and security for Python projects with SonarCloud and Snyk, and ran knowledge-transfer sessions across teams.",
        "Designed cloud architectures and data pipelines with AWS, Azure, Snowflake, ClickHouse and Power BI for big data, AI and web-service projects; applied DevSecOps and IaC with GitHub Actions and Terraform.",
        "Built Streamlit and FastAPI web apps for HPC workloads (linear optimization, metaheuristics) and AI, and selected the initial technology stack for an aircraft AI assistant using RAG and hierarchical agents.",
      ],
    },
    {
      period: "2021 — 2024",
      org: "AUDI AG",
      logo: "/experience/audi-ag/logo.svg",
      role: "Senior Cloud DevSecOps SRE Consultant",
      points: [
        "Rolled out AWS and Cloudera CDP big-data infrastructure — service and policy automation with Terraform, Ansible and Jenkins, plus periodic Kubernetes and CDP upgrades.",
        "Ran production CDP Kubernetes clusters on AWS EKS with Grafana and Yunikorn; migrated tables from Apache Hive to Apache Iceberg.",
        "Provided MLOps/DataOps support across Cloudera CDF, CML, CDE and CDW, including data contracts for NiFi flows.",
        "Built Jenkins pipelines for automated alerting and server software updates, and configured centralized logging across AWS and on-prem servers with Splunk.",
        "Applied FinOps optimization — including instance right-sizing — to cut infrastructure cost and improve resource efficiency.",
      ],
    },
    {
      period: "2021 — 2024",
      org: "Datapta",
      logo: "/experience/datapta/logo.png",
      role: "Founder & Principal Consultant",
      points: [
        "Delivered cloud and data-platform consulting through Datapta — including a 2.3-year AUDI AG engagement — and built Finlooker v1, a macro-intelligence platform (web, iOS/Android, hybrid infra on ArgoCD) with a rotating team of 40+ interns and junior engineers from IESE, ESADE and other technical universities.",
        "Set strategic and business planning for the company across B2B and B2C domains.",
        "Built hybrid infrastructure (fan-less on-prem servers + AWS) with a DevSecOps pipeline on ArgoCD.",
      ],
    },
    {
      period: "2022",
      org: "Nebula Strategy",
      logo: "/experience/nebula-strategy/logo.png",
      role: "Lead Solutions Architect Consultant — Assefy",
      points: [
        "Mentored the startup and selected the technology stack for a new B2B data-catalog product spanning relational databases, data warehouses and unstructured media.",
        "Designed the architecture and built a proof of concept on Amundsen, swapping its default Neo4J backend for Apache Atlas, deployed with Docker Compose.",
      ],
    },
    {
      period: "2022",
      org: "Antimetal",
      logo: "/experience/antimetal/logo.png",
      role: "Backend Cloud Consultant",
      points: [
        "Built a Flask and MongoDB proof-of-concept backend for automatic AWS resource allocation based on user quotas.",
      ],
    },
    {
      period: "2020 — 2022",
      org: "BNP Paribas Fortis",
      logo: "/experience/bnp-paribas-fortis/logo.png",
      role: "Senior Big Data & DevOps Consultant",
      points: [
        "Managed the software release lifecycle for the bank's data hub — CI/CD with Jenkins, Ansible, Kubernetes, Artifactory and GitLab, plus runbook creation and release testing against the Swagger API.",
        "Supervised ETL and resolved incidents across Spark, Flink, Kafka and HDP/CDP clusters, with workflows orchestrated in Autosys.",
        "Configured and administered the on-prem HDP/CDP platform (Hive, Tez, HDFS) and monitored Kafka/Flink clusters with Splunk.",
        "Built streaming jobs in Scala with Flink and Kafka, feeding internal client clusters (Kafka, IBM MQ, Cassandra DB) and BI tooling in a lambda architecture.",
      ],
    },
    {
      period: "2019 — 2021",
      org: "Simig Solutions",
      logo: "/experience/simig-solutions/logo.png",
      role: "Big Data & Cloud Architect Consultant",
      points: [
        "Designed and built an AWS big-data system processing daily electricity consumption for Red Eléctrica de España, using Glue, EMR, Lambda, PySpark, Zeppelin, Redshift Spectrum, SFTP and S3.",
        "Built data models and ETL for an electricity marketer's forecasting and analytics on Cloudera CDH (on AWS) with Apache Airflow.",
        "Led ETL migration from SQL Server to an on-prem Hadoop environment (Cloudera CDH, Hive, Impala, Kudu, Spark Core and Spark SQL), including client training.",
      ],
    },
    {
      period: "2017 — 2019",
      org: "IMIDomics",
      logo: "/experience/imidomics/logo.png",
      role: "Big Data Technical Lead · Interim Engineering Manager",
      points: [
        "Owned data governance for clinical databases (MySQL, SQLAlchemy, PDI Kettle) and terabyte-scale raw data files, plus IT vendor selection and relationship management.",
        "Led the architecture of a GCP big-data platform (OrientDB, GraphQL, Node.js, React, BigQuery, R, Cloud SQL, Kubernetes, Helm, Docker) for biomedical patient-data retrieval and analysis.",
        "Ran IT procurement and administration — desktop and server hardware, Active Directory, ELK and LAMP stacks, Jenkins — and budget control across GCP and Azure.",
      ],
    },
    {
      period: "2016 — 2017",
      org: "FILMCLUB",
      logo: "/experience/filmclub/logo.png",
      role: "CTO — EdTech Startup",
      points: [
        "Acted as CTO for the educational content platform, owning infrastructure and IT while advising on HR and business-model strategy.",
        "Defined the funding-research and client-dealing process for the startup.",
        "Ran client marketing campaigns with Mailchimp, Bitly and Google Analytics.",
      ],
    },
    {
      period: "2014 — 2016",
      org: "Hewlett-Packard",
      logo: "/experience/hewlett-packard/logo.png",
      role: "Firmware Engineer",
      points: [
        "Negotiated feature scope and integration for new printer functionality across customer experience, front-end, SWQA and mechanical/electrical engineering teams.",
        "Designed and implemented C++ firmware for Latex-technology printers with resistive printheads.",
        "Identified and drove improvements for the Latex 300 series printer line.",
      ],
    },
    {
      period: "2014",
      org: "Barcelona Supercomputing Center",
      logo: "/experience/bsc/logo.png",
      role: "HPC Research Engineer — Master's Thesis",
      points: [
        "Designed and evaluated performance experiments in Python/Matplotlib for next-generation HPC processors, reporting results to IBM's Thomas J. Watson Research Center.",
        "Published a first paper in the ROMOL group on adaptive hardware-prefetcher reconfiguration for the IBM POWER7.",
        "Built real-time C++ mechanisms to speed up IBM POWER7 microprocessor performance.",
      ],
    },
    {
      period: "2012 — 2014",
      org: "Telefónica I+D",
      logo: "/experience/telefonica-id/logo.png",
      role: "Distributed Systems Research Engineer — Internship",
      points: [
        "Proposed new computer architectures for streaming mobile-computing data using a mesh processor topology, as part of a European research project.",
        "Built an Android app visualizing crowd-sourced WiFi signal quality on a digital map.",
        "Parallelized machine-learning algorithm kernels and built a Java Storm, MongoDB and AWS EC2 pipeline to ingest massive mobile telemetry data.",
      ],
    },
    {
      period: "2011 — 2012",
      org: "Universitat Politècnica de Catalunya",
      logo: "/experience/upc/logo.png",
      role: "HPC Systems Engineer & Lab IT Lead",
      points: [
        "Ran IT for a 12-person research lab and HPC support for a computational-mechanics group.",
        "Cut 3D mesh generation time from hours to seconds using the PETSc library.",
        "Built a Perl-based image-segmentation pipeline for a life-sciences computing project, and extended the group's toolset with external HPC libraries.",
      ],
    },
    {
      period: "2010 — 2011",
      org: "Universitat Politècnica de Catalunya",
      logo: "/experience/upc/logo.png",
      role: "IT Operations Engineer & Departmental Helpdesk — Grant-Funded",
      points: [
        "Provided IT helpdesk support for the applied mathematics department's staff.",
        "Deployed the department's IT renewal plan — workstations, laptops and network configuration.",
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
    ],
  },
  externalArticles: [
    {
      title: "The 0.01% Guide to AI Infrastructure: Understanding LLM Internals and GPU Execution",
      date: "2026-05-06",
      href: "https://www.linkedin.com/pulse/001-guide-ai-infrastructure-understanding-llm-gpu-david-prat-robles-hr5te/",
      source: "LinkedIn",
      topics: ["AI & LLMs"],
      cover: "/posts/linkedin-ai-infrastructure-guide/cover.jpg",
    },
    {
      title: "AI 2026-2030: Bubble or Golden Era?",
      date: "2026-04-04",
      href: "https://www.linkedin.com/pulse/ai-2026-2030-bubble-golden-era-david-prat-robles-wonre/",
      source: "LinkedIn",
      topics: ["AI & LLMs"],
      cover: "/posts/linkedin-ai-bubble-golden-era/cover.jpg",
    },
  ],
  videos: [
    { title: "How to pass the CKS exam", youtubeId: "2CnZarRBBBE", duration: "14:03" },
    { title: "How to pass the CKAD exam", youtubeId: "Dv-PdB-v5ls", duration: "15:08" },
    { title: "How to pass the CKA exam", youtubeId: "TUzi5dNO6wU", duration: "11:49" },
    { title: "Grafana operator explained and installation", youtubeId: "Vo4nylLCFnQ", duration: "21:14" },
    { title: "Kustomize explained and tutorial", youtubeId: "P13TzWOXvLQ", duration: "8:26" },
    { title: "Learn Skaffold and how is it used in GitOps", youtubeId: "xf-Ph1SW4j8", duration: "15:39" },
    { title: "Jenkins webhook with Gitlab and Docker", youtubeId: "peo-Cc6qPOM", duration: "11:30" },
    { title: "Install ArgoCD in 3 minutes and learn GitOps", youtubeId: "gTLHH05Y4NU", duration: "20:22" },
    { title: "k3s backups and snapshots", youtubeId: "wrLJ0U_ey4g", duration: "9:00" },
  ],
  videosVisibleCount: 6,
  youtubeChannel: { label: "YouTube — @davidpratr", href: "https://www.youtube.com/@davidpratr" },
  contact: {
    heading: "Contact",
    body: "The fastest way to reach me is a LinkedIn message.",
    links: [
      { label: "Message me on LinkedIn", href: "https://www.linkedin.com/in/davidpratrobles/" },
    ],
  },
};
