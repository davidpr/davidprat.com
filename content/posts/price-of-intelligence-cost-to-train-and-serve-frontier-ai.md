---
title: "The Price of Intelligence: What It Really Costs to Train (and Serve) a Frontier AI Model"
date: "2026-09-02T09:00:00"
excerpt: "Companion piece to my AI Infrastructure guide and 'AI 2026–2030: Bubble or Golden Era'. 💸 Everyone talks about what frontier models can do. Almost nobody talks about what they cost to build. Today: the real numbers —…"
topics: ["AI & LLMs"]
cover: "/posts/linkedin-price-of-intelligence/cover.jpg"
---
*Originally published on [LinkedIn](https://www.linkedin.com/pulse/price-intelligence-what-really-costs-train-serve-ai-david-prat-robles-u8jve/).*

Companion piece to my AI Infrastructure guide and "AI 2026–2030: Bubble or Golden Era".

💸 Everyone talks about what frontier models can do. Almost nobody talks about what they cost to build. Today: the real numbers — the ones that are public, the ones that leaked, and the ones we can only estimate.

---

### 1. Why the numbers are so scarce

Training cost is competitive intelligence. Publishing it reveals your compute efficiency, your architecture choices, and ultimately your margins. That's why only two kinds of players disclose:

- Open-weight labs (Meta, DeepSeek, Moonshot) publish GPU-hours in their technical reports — it's part of their value proposition.
- Everyone else (OpenAI, Google, Anthropic, xAI) says nothing, and we depend on reconstructions from Epoch AI and Stanford's AI Index, built from cloud rental prices, training duration and hardware utilization.

And even when a number exists, it hides more than it shows. Two examples:

The methodology gap. Stanford's AI Index prices GPT-4 at ~$78M and Gemini Ultra at ~$191M using cloud rental pricing. Epoch AI, using amortized hardware costs, gets ~$40M and ~$30M for the same models. Neither is wrong — they measure different things. Sam Altman settled it his own way: asked if GPT-4 cost $100M, he answered "it's more than that."

The invoice split. For Gemini Ultra, up to 49% of the total was R&D staff salaries and equity. AI chips? Only 23%. Server components ~15%, interconnect ~10%, energy a surprising ~3%. The dominant cost of intelligence is still... human intelligence.

![Gemini Ultra Cost Breakdown](/posts/linkedin-price-of-intelligence/figure-01.png)

Gemini Ultra Cost Breakdown

And the biggest secret of all: the final training run is only ~10% of a lab's R&D compute. Epoch AI estimated OpenAI spent ~$5B on R&D compute in 2024 — with only ~$500M going to the final runs of released models. The experiments, ablations, failed runs and synthetic data pipelines you never hear about cost 9x more than the model you use.

---

### 2. The invoice history: 2017 → 2026

Here's every meaningful data point we have (cost · total parameters · hardware):

![*Final run only. Excludes experiments, infrastructure and failed runs.](/posts/linkedin-price-of-intelligence/figure-02.png)

\*Final run only. Excludes experiments, infrastructure and failed runs.

From $900 to half a billion dollars in eight years. Epoch AI measures the trend at 2.4x growth per year — and projects the first $1B+ single runs in 2027.

---

### 3. The anomaly that broke the curve

Look at the table again. Two models cost ~$5M while their neighbors cost ~$500M. That's not noise — it's the most important trend in AI economics.

🐋 DeepSeek V3 (Dec 2024): 671B parameters, trained on 2,048 export-restricted H800s in two months. MoE routing, FP8 precision, Multi-head Latent Attention. Frontier-class results at ~1/30 the budget.

🌙 Kimi K2 Thinking (Nov 2025): Moonshot repeated the trick at 1 TRILLION parameters — reportedly ~$4.6M (CNBC; the CEO later called the figure unofficial, but the order of magnitude fits the pattern).

And here's the twist: DeepSeek and Kimi have MORE total parameters than most Western flagships. Parameters stopped predicting cost. What matters now:

- MoE sparsity — 1T total, but only 32B active per token
- Precision engineering — FP8/INT4-aware training
- Architecture — MLA, multi-token prediction, optimizer innovations (MuonClip)

![Figure 3](/posts/linkedin-price-of-intelligence/figure-03.png)

Two philosophies now live 100x apart on the cost axis while converging on the capability axis. Whether that gap is sustainable is THE question of 2027.

---

### 4. So what did Fable 5 or GPT-5.6 cost? (Educated guessing)

Nobody discloses. But we can triangulate:

- Dario Amodei (Anthropic): current models cost $100M–$1B to train; $10B runs are coming "2025, 2026, maybe 2027".
- Epoch AI: 2026 frontier runs sit at 1e26–1e27 FLOPs. And counterintuitively, GPT-5 used LESS pretraining compute than GPT-4.5 — the spend shifted to post-training RL and experiments.
- Industry estimates: $200–500M per final run for the GPT-5/Gemini 3 class; my triangulation puts Fable 5 / Opus-class at $300M–$1B.
- Parameters: analyst estimates (LifeArchitect) put Opus-class at ~5T MoE; a leak triggered by Musk's "Grok 4.2 is 500B — 5% of our largest model in training" implied the same scale across labs, with 10T-parameter models already in ovens.

Remember the iceberg: multiply any of these by ~10x to get the real annual R&D compute bill behind each flagship.

---

### 5. Training is a sprint. Serving is a marathon.

Here's the part most cost analyses skip: once trained, the model has to RUN — for millions of users, forever.

A frontier model no longer fits in a server. Do the memory math: ~5T parameters at FP8 ≈ several TB of weights, plus a KV cache that explodes with 1M-token contexts. The atomic serving unit stopped being a GPU, then stopped being a server. It's now a rack:

- NVIDIA GB200 NVL72: 72 Blackwell GPUs + 36 Grace CPUs in one liquid-cooled rack, fused by NVLink into what behaves like ONE giant GPU — ~13TB pooled HBM, 130 TB/s internal bandwidth.
- Google Ironwood (TPU v7): superpods of 9,216 chips, 42.5 FP8 exaflops.
- AWS Trainium2 UltraServers: Anthropic's workhorse, claiming 30–40% better price-performance than GPU equivalents.

1 rack ≈ 1 model replica. Your prompt lands on one of thousands of identical racks behind a load balancer, spread across data centers on three continents.

![Figure 4](/posts/linkedin-price-of-intelligence/figure-04.png)

This is why inference-first infrastructure is becoming its own discipline — and why the interesting deals of 2025-26 weren't about models at all. They were about gigawatts:

- Anthropic: 1M+ Trainium2 chips (Project Rainier, spanning three US states) + up to 1M Google TPUs (>1GW in 2026) + a $100B/10-year AWS commitment
- OpenAI: Stargate Abilene — 450K+ GB200s, 1.2GW, part of an 8GW+ pipeline
- xAI: Colossus 2 — 555K GB200/GB300s at 2GW, targeting 1M GPUs

Rule of thumb: a 1GW AI data center ≈ $50B, of which ~$35B is chips.

![Figure 5](/posts/linkedin-price-of-intelligence/figure-05.png)

---

### 6. What 2027 looks like

And where is this heading in 2027? The projections:

- Cost per frontier run: $1–3B (Epoch AI trend: 2.4x/year → $1B+ crossed in 2027)
- Scale: ~10T total parameters (MoE), 1e27–2e28 FLOP per run
- Hardware: 300–600K Blackwell/Rubin-class GPUs occupied 1–3 months per run
- Who can host it: only Colossus 2 (555K GB200/GB300 → 1M GPU target, 2GW), Stargate Abilene (450K+ GB200, 1.2GW), Project Rainier (1M+ Trainium), and Google's Sunfish TPU fleet (3.5GW from 2027)
- Meanwhile the open-weight wave (DeepSeek, Kimi, Qwen) keeps shipping 1–3T models for $5–50M The gap between the two philosophies is now 100x in cost. 2027 decides which one wins."

![Main AI Data Centers in 2026-2027](/posts/linkedin-price-of-intelligence/figure-06.png)

Main AI Data Centers in 2026-2027

The arithmetic of a $1–3B run: 300–600K Blackwell/Rubin-class GPUs, occupied for 1–3 months, at 1e27–2e28 FLOP. Only four or five facilities on Earth will be able to host it.

---

### 7. The takeaway

Three conclusions I keep coming back to:

1. The model race became an infrastructure race. When a training run needs a dedicated gigawatt, the moat isn't the algorithm — it's the substation.
2. Parameters ≠ cost anymore. MoE + precision engineering broke that correlation. Efficiency is the only exponential that favors the small player.
3. The 100x gap must resolve. Either open-weight efficiency drags frontier costs down, or the $1–3B runs buy capabilities that $5M can't reach. 2027 answers this.

The winners will be decided in the data center, not on the leaderboard.

---

Which side of the divergence would you bet on? 👇

Sources: Stanford AI Index 2024/25, Epoch AI, DeepSeek-V3 technical report, Llama 3.1 model card, CNBC, company announcements (Anthropic/AWS/Google/Oracle/xAI). Estimates marked as such — treat bands as bands.

#AI #Infrastructure #LLM #GPU #TPU #DataCenters #AIEconomics #MoE

---

###
