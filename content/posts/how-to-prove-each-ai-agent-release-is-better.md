---
title: "How do you prove that each release of an AI agent is actually better?"
date: "2026-10-27T09:00:00"
excerpt: "A release evaluation plan for a RAG agent that helps engineers fix grounded aircraft: a sealed, time-split golden set, metrics for every node of the agent graph, paired significance tests, zero tolerance for safety-critical errors, release gates on Langfuse and confirmation in shadow mode."
topics: ["AI & LLMs"]
cover: "/posts/linkedin-agent-release-evaluation/cover.jpg"
---
*Originally published on [LinkedIn](https://www.linkedin.com/pulse/how-do-you-prove-each-release-ai-agent-actually-david-prat-robles-nr3me/).*

Shipping the first version of an LLM agent is the easy part. The hard part starts with v2. Models are retrained on new data, retrieval is tuned, prompts change and the graph gains new steps. Each change raises the same two questions: **is the new version actually better, and is it still safe?** "It looked better in the demo" is not an answer, especially when the people using the system are fixing aircraft.

I led the architecture of an AI assistant for aircraft maintenance engineers at a European airline group. In this article I call it **HangarMind**. This is the evaluation plan I would put around a system like it: a sealed, time-split golden set of real cases, metrics for every node of the agent graph, paired significance tests, zero tolerance for safety-critical errors, and confirmation in shadow mode before anything reaches users.

*Disclaimer: this article does not disclose any confidential information. HangarMind is a fictitious name, the architecture is simplified for educational purposes, and all scores, counts and examples are illustrative, not real results.*

---

## The system: what HangarMind does

When a fault grounds an aircraft (an **AOG**, *Aircraft on Ground*), every hour costs the airline money. An engineer describes the fault in plain text, the way it is typed on shift. HangarMind searches past AOG cases and the fixes engineers recorded, falls back to the Airbus maintenance manuals when the history is thin, and drafts resolution steps with references. When it has nothing reliable to say, it abstains and escalates to an engineer.

A few terms used throughout:

- **AOG**: Aircraft on Ground, a fault that leaves the aircraft unable to fly until it is fixed.
- **AMM / TSM**: Airbus's Aircraft Maintenance Manual (approved procedures) and Troubleshooting Manual (fault isolation).
- **ECAM**: the cockpit system that shows fault messages, such as "NWS FAULT" (nose wheel steering).
- **RAG**: retrieval-augmented generation. Find the relevant documents first, then have the LLM answer from them.
- **Trace**: the recorded path of one request through the system, step by step, with timings and costs.
- **v1, v2**: successive versions. v2 is the candidate that must prove it beats v1.

## Tech stack

Everything runs in AWS. The agent is Python with **LangGraph**, the chat interface is Next.js, and both run as containers on ECS. An ETL built on AWS Step Functions and Lambda loads the AOG history and the manuals into **Aurora PostgreSQL with pgvector**, calling an LLM in Amazon Bedrock to extract the problem and the solution from each AOG record. **Langfuse** is self-hosted on the same ECS cluster for tracing and evaluation, and the test sets are versioned in S3.

![Architecture](/posts/linkedin-agent-release-evaluation/01-architecture.png)

The full stack, marking what the core system uses and what the evaluation approach adds:

![Tech stack, part 1](/posts/linkedin-agent-release-evaluation/02a-tech-stack.png)

![Tech stack, part 2](/posts/linkedin-agent-release-evaluation/02b-tech-stack.png)

### The ETL is part of what is tested

![ETL](/posts/linkedin-agent-release-evaluation/03-etl.png)

- **Version the ETL with each release.** A new extraction prompt or Bedrock model changes what the index holds, and so changes the answers.
- **Check the extraction itself.** Each release, an engineer compares the extracted problem and solution with the raw record on a sample of AOGs. One badly extracted solution misleads every query that retrieves that AOG.
- **Respect the cutoff.** When building an index for evaluation, the ETL skips AOGs dated after the cutoff, so test cases never reach the index. In production it keeps loading new AOGs into the live index.
- **Keep the answer key independent.** Annotators write reference steps from the raw AOG record, not from the ETL's extracted solution, or extraction errors are copied into the answer key and become invisible.
- **Know what chunk & embed produces.** Each chunk (one AOG record, or one manual task with its heading) becomes a vector in a pgvector column, with an HNSW index for fast search. Queries must use the same embedding model, so a new embedding model means re-embedding everything into a new index.
- **Choose what to embed for each AOG.** Engineers' queries describe the problem, not the fix. Embedding only the resolution steps compares the query with text that looks quite different. Embed problem and solution together, or only the problem, or one vector for each, and pick by Recall@5 on the validation set, not by intuition.

## Part 1 · The system under test

![Agent graph](/posts/linkedin-agent-release-evaluation/04-agent-graph.png)

Each step in the graph gets its own metric (the amber tags), and the Abstain exit is scored separately with correct abstention and over-refusal. An end-to-end score tells you *that* something changed. Per-node scores tell you *where*.

HangarMind abstains in three cases: the question is out of scope, neither past AOGs nor the manuals hold anything relevant, or the guardrail check fails. "Nothing relevant" needs a relevance threshold, because vector search always returns its nearest results, even irrelevant ones. In Langfuse each run is a trace with one span per node, which is where the per-node metrics are read.

## Part 2 · The procedure, in order

![Procedure](/posts/linkedin-agent-release-evaluation/05-procedure.png)

## Part 3 · Three kinds of data, three jobs

For every version, v1 included, take a snapshot of all the AOG history available and split it by date at a **training cutoff**. Older AOGs build the system. The newest AOGs are labelled by engineers and split again: a **validation set** the team practises on, and a **sealed set** used only to decide whether the version ships.

![Data split](/posts/linkedin-agent-release-evaluation/06-data-split.png)

![Three sets](/posts/linkedin-agent-release-evaluation/07-three-sets.png)

![Terms and rotation](/posts/linkedin-agent-release-evaluation/08-terms-and-rotation.png)

### How ground truth grows from v1 to v2

Each release builds on everything up to its cutoff and holds back the newest slice to test on. While v1 is in service, new ground truth keeps arriving from four sources: **new AOG records** (every resolved AOG still produces a recorded fix), **human in the loop** (an engineer confirms or corrects a low-confidence answer live), **offline review** of logged queries, and **feedback and failures** (thumbs-down, rephrased questions, escalations).

![Ground truth growth](/posts/linkedin-agent-release-evaluation/09-ground-truth-growth.png)

- **Always hold something back.** If every new labelled item goes into building v2, nothing is left to measure it on.
- **A correction is not automatically right.** A busy engineer's quick fix on shift should be checked, at least on a sample, before it counts as ground truth.
- **Watch selection bias.** Queries labelled because the system asked for help over-represent hard cases. They make good training material, but the sealed set should come from a representative sample of AOGs.

### If the sealed set changes, how are v1 and v2 compared fairly?

v1 and v2 are always scored on **exactly the same cases**. v1 is frozen and can be re-run at any time, so at the v2 release both versions answer v2's new sealed set side by side. Frozen means the whole configuration, **including a snapshot of its RAG index**: a live index that keeps ingesting AOGs may already contain v2's sealed cases, which would leak the answers.

![Rotating vs anchor](/posts/linkedin-agent-release-evaluation/10-rotating-vs-anchor.png)

Next to the rotating sealed set, keep a small fixed **anchor set** of critical safety cases and known past failures: it tracks the trend across every release and catches old bugs that come back. Keeping one sealed set forever looks simpler but fails over time: the team slowly tunes to it, the fleet and fault types change, and its AOGs are lost as training data.

## Part 4 · How a test case is built

Annotators are qualified mechanical engineers who write down the correct answer for each case. A case writer first turns each AOG record into the question an engineer would have typed. Two annotators then label it blind, and a senior engineer **adjudicates** every disagreement.

![Annotation workflow](/posts/linkedin-agent-release-evaluation/11-annotation-workflow.png)

**Why two annotators?** Experts disagree more than expected. The agreement rate is measured with **Cohen's kappa (κ)**, which removes the agreement expected by chance. Example: two annotators judge 100 "is this past AOG relevant?" pairs and agree on 85. Chance agreement is about 0.50, so κ = (0.85 − 0.50) / (1 − 0.50) = **0.70**, "substantial". Low κ means the guidelines are unclear, which you want to know before blaming the model.

![Case anatomy](/posts/linkedin-agent-release-evaluation/12-case-anatomy.png)

Write queries the way engineers really type, with abbreviations: clean, tidy questions make scores look better than real use. The **route** (the path through the graph) and the **reference steps** (the procedure) are scored separately, because a case can take the right route and still give the wrong procedure.

![Who fills what](/posts/linkedin-agent-release-evaluation/13-who-fills-what.png)

### Pooling: finding the expected AOGs

No engineer can read thousands of past AOGs for every case. Instead, several retrievers each return their top results, the lists are merged and de-duplicated, and the annotator judges only that pool. Every version being compared contributes equally, and plain keyword search is included so that an AOG no vector retriever finds can still be marked relevant.

![Pooling](/posts/linkedin-agent-release-evaluation/14-pooling.png)

- **Pre-filling with an LLM** saves engineer time, but the draft must not come from the version being tested, or the labels lean towards its answers.
- **It costs real time:** roughly half an hour of engineer time per case. This is the main reason golden sets stay at hundreds of cases rather than thousands.

## Part 5 · Metrics by layer

![Metrics by layer](/posts/linkedin-agent-release-evaluation/15-metrics-by-layer.png)

## Part 6 · The metrics in plain words

All example numbers are illustrative.

### Classification: did the router pick the right AOG category?

- **Confusion matrix**: real category against predicted category. The diagonal is correct; everything off it shows exactly which categories get confused.
- **Accuracy**: the share of correct predictions. It can hide a router that is good only at the most common category.
- **Precision and recall per category**: when it says "landing gear", how often is it right, and of all real landing-gear AOGs, how many did it catch? **F1** combines them; **macro-F1** averages F1 across categories with equal weight, so rare categories count as much as common ones.

![Confusion matrix](/posts/linkedin-agent-release-evaluation/16-confusion-matrix.png)

*Four of the seven categories: LG landing gear, HYD hydraulics, ENG engines, AVI avionics. Landing gear and hydraulics get confused 16 times. That makes sense, because the gear is hydraulically actuated, and it tells you where to add examples or sharpen the category definitions.*

### Retrieval: did pgvector bring back the right AOGs and manual tasks?

- **Recall@5**: of the documents that should be found, what share appear in the top 5. Set k to the number of chunks really sent to the LLM; anything ranked lower is invisible to it. Retrieval is the ceiling for everything after it.
- **MRR** (mean reciprocal rank): rewards putting the first relevant result near the top. First hits at ranks 1, 4 and 2 give (1 + 1/4 + 1/2) ÷ 3 = 0.58.
- **nDCG**: scores the whole ranking, with graded relevance, normalised by the best possible ordering.
- **Fallback precision and recall**: of the cases sent to the manuals, how many needed them, and of those that needed them, how many were sent?

### Generation: is the answer correct, grounded and usable?

- **Faithfulness**: the share of claims in the answer supported by the retrieved documents. Faithful is not the same as correct: a faithful answer built on the wrong AOG is still wrong.
- **Step coverage and order**: how many reference steps appear, and in a safe sequence (inspection before replacement).
- **Citation accuracy**: of the cited references, the share that exist and support the step they are attached to.
- **LLM-as-judge**: a separate LLM grades answers on a rubric, or picks the better of v1 and v2 (pairwise). Judges prefer the first or the longer answer, so pin the judge model, randomise the order and check it against engineers with kappa.

### Safety and behaviour

- **Critical error**: a part number, torque value, limit or manual reference that appears in no approved source, or contradicts the manual. *"Torque the connector to 25 in-lb"* when no retrieved document says so. Counted, not averaged; the target is zero.
- **Correct abstention and over-refusal**: strict guardrails cut critical errors but can raise over-refusal. Track both.
- **Trajectory**: the path through the graph. A case labelled "history" that went to the manuals and looped twice is a trajectory error, even if the final answer was fine.

### Speed and cost

**p50** is the median wait; **p95** is the slow tail, the one query in 20 that engineers remember. The average is pulled up by a few slow queries and describes almost nobody's experience, so release gates use p95. **Cost per query** is the model tokens plus database and reranker calls for one answer: a reranker or a retry loop can improve quality while raising it.

![Latency](/posts/linkedin-agent-release-evaluation/17-latency.png)

### Statistics: is the gain real, or luck?

- **95% confidence interval**: "+0.05 (95% CI +0.02 to +0.08)" means the real gain is very likely between 2 and 8 points. If the interval includes zero, you cannot claim an improvement.
- **Repeated runs**: the same LLM answers the same question differently each time, so run each version 3–5 times.
- **McNemar's test**: compares two versions using only the cases where they disagree. If v2 fixes 30 cases v1 got wrong and breaks 12 that v1 got right, (|30 − 12| − 1)² ÷ (30 + 12) = 6.9, p ≈ 0.009: unlikely to be chance.
- **Paired bootstrap**: for continuous scores like faithfulness. Resample the 350 cases 10,000 times, compute v2 − v1 each time, and take the middle 95%.
- **Holm correction**: check 7 slices at a 5% threshold and there is about a 30% chance one looks significant by luck (1 − 0.95⁷). Holm tightens the threshold.
- **Data leakage**: test cases or their answers ending up in training data, prompts or the RAG index. Prevented by the cutoff, the sealed set and frozen index snapshots.

## Part 7 · Reading a v1 vs v2 comparison

![v1 vs v2](/posts/linkedin-agent-release-evaluation/18-v1-vs-v2.png)

![Slices](/posts/linkedin-agent-release-evaluation/19-slices.png)

Overall v2 is better, but landing gear drops. With 64 cases the drop may not survive the Holm correction, yet in a safety-relevant category someone must explain it before release. Never report a gain without its interval: "+5 points" alone cannot tell you whether it is real; "+5 points (+2 to +8)" can.

## Part 8 · Which change earned the gain

v2 shipped newer data and several improvements at once. Adding them one at a time on the validation set (an **ablation**) attributes the gain and exposes a change that does nothing. The first step runs v1's pipeline on v2's newer data, to separate the gain from more history from the gain from better techniques.

![Ablation](/posts/linkedin-agent-release-evaluation/20-ablation.png)

The fine-tuned LLM does not move retrieval, which is expected: its effect shows up in the generation metrics.

## Part 9 · Release gates in CI

![Release gates](/posts/linkedin-agent-release-evaluation/21-release-gates.png)

A **hard block** cannot be overridden; a **soft gate** can be accepted by a person with a justified trade-off. Version everything that changes a result: prompts, model IDs, the embedding model per index, and the sets themselves.

## Part 10 · Running the evaluation on Langfuse

Langfuse plugs into LangGraph through a callback handler, so every run becomes a trace with one span per node. On top of those traces it holds the datasets, runs the experiments and stores the scores.

![Langfuse flow](/posts/linkedin-agent-release-evaluation/22-langfuse-flow.png)

**Annotators and evaluators are different jobs.** Annotators write the answer key before any testing; evaluators mark the answers against that key every time a test runs. Machines mark everything; engineers check the judge on a sample, plus every critical-error flag and every case where v1 and v2 disagree.

![Who marks what](/posts/linkedin-agent-release-evaluation/23-who-marks-what.png)

![Langfuse mapping, part 1](/posts/linkedin-agent-release-evaluation/24a-langfuse-mapping.png)

![Langfuse mapping, part 2](/posts/linkedin-agent-release-evaluation/24b-langfuse-mapping.png)

A sketch of scoring v1 and v2 on the sealed set with the Langfuse Python SDK (check names against the current docs; `build_graph` and `untraceable_values` stand for the system's own code):

```python
from langfuse import get_client, Evaluation
from langfuse.langchain import CallbackHandler
from hangarmind import build_graph, untraceable_values

langfuse = get_client()   # self-hosted URL and keys from env
sealed = langfuse.get_dataset("hm-sealed-2026-10")

def make_task(version):
    graph = build_graph(version)   # frozen v1 or v2
    def task(*, item, **kwargs):
        state = graph.invoke(item.input, config={"callbacks": [CallbackHandler()]})
        return {"answer": state["answer"], "sources": state["sources"],
                "top5": state["retrieved_aogs"][:5], "route": state["route"]}
    return task

def aog_recall_at_5(*, output, expected_output, **kwargs):
    expected = set(expected_output["expected_aogs"])
    if not expected:   # manual or abstain case
        return []   # no score for this item
    return Evaluation(name="aog_recall@5", value=len(expected & set(output["top5"])) / len(expected))

def critical_errors(*, output, **kwargs):
    bad = untraceable_values(output["answer"], output["sources"])
    return Evaluation(name="critical_errors", value=len(bad), comment=", ".join(bad))

for version in ["v1", "v2"]:
    for run in range(5):
        sealed.run_experiment(name=f"{version}-sealed-run{run}", task=make_task(version),
                              evaluators=[aog_recall_at_5, critical_errors])
```

**Keeping the sealed set sealed:**

- **Separate projects.** Keep the sealed and anchor datasets in a Langfuse project only the CI service account and the engineer reviewers can open.
- **Self-host.** Langfuse is open source and runs in the airline's own AWS account, so AOG records and manual text stay in-house.
- **Name runs by version**, with model, embedding, prompt and index versions in each run's metadata.
- **Same evaluators for both versions**, with the same pinned judge, in the same session.
- **Gates outside the UI.** Langfuse shows the comparison; the release decision comes from a CI step that pulls the scores through the API, so it is repeatable and auditable.

## Part 11 · Confirming in production

![Rollout](/posts/linkedin-agent-release-evaluation/25-rollout.png)

## Part 12 · Improvement techniques and how each is proven

Each technique targets one layer, so you know in advance which metric should move and what could get worse.

**Retrieval**

- **Hybrid search**: Postgres full-text search next to pgvector, fused by rank, because part numbers, fault codes and ECAM messages need exact matches that vectors miss. *Moves* AOG and manual Recall@k. *Watch* duplicate hits.
- **Domain-tuned embeddings**: contrastive training on query-to-correct-AOG pairs mined from logs. *Moves* Recall@k and MRR. *Watch* leakage if sealed AOGs are in the pairs.
- **Cross-encoder reranker**: re-sorts the top 20–50 candidates. *Moves* MRR and nDCG. *Watch* p95 latency and cost.
- **Metadata pre-filtering** by category or aircraft type. *Watch* it inherits every router error.
- **Structure-aware manual chunking** by task and subtask, with the section path prepended. *Moves* manual Recall@k and citation accuracy.
- **Query rewriting**: expand maintenance acronyms, multi-query or HyDE. *Watch* drift from the engineer's intent.

**Generation**

- **Fine-tuning** (SFT or LoRA on good resolutions, DPO from engineers' preferences). *Moves* step coverage, faithfulness and judge preference. *Watch* memorised test AOGs and more confident hallucinations.
- **Guardrails and structured output**: every number and reference in the answer must appear in a retrieved source, or the answer is refused. *Moves* critical errors to zero. *Watch* over-refusal.
- **Prompt optimisation** (e.g. DSPy) against the validation set, never the sealed set.

**Graph and loop**

- **Corrective RAG node**: grade retrieved AOGs and re-query or fall back if weak. *Watch* loops; cap retries.
- **Human-in-the-loop interrupt**: a LangGraph interrupt asks an engineer to confirm low-confidence answers, and corrections become labelled data after the next cutoff.
- **Model routing**: a small model for classification and grading, the large one only for drafting. *Moves* cost and latency.

---

## The one-line version

Score every release node by node against a sealed, time-split set of real cases labelled by domain experts. Ship only with a significant gain, zero safety-critical errors and confirmation in shadow mode.

How do you decide that a new version of your LLM system is ready to ship? I would love to hear what has worked for you.

#LLMOps #AIAgents #RAG #LangGraph #Langfuse #MachineLearning #Evaluation #GenAI
