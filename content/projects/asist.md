---
title: "ASIST"
embed:
  src: "/projects/asist/evaluation"
  title: "ASIST release evaluation plan"
---
> **Disclaimer.** This page does not make public any confidential information. The material shown is a simplification of the real project, for educational purposes only. All scores, counts and examples are illustrative, not ASIST's real results.

ASIST is an AI assistant for aircraft maintenance engineers at IAG airlines, starting with Aer Lingus. When a fault grounds an aircraft (an AOG, *Aircraft on Ground*), an engineer describes it in plain text. ASIST searches past AOG cases and the fixes engineers recorded, falls back to the Airbus maintenance manuals when the history is thin, and drafts resolution steps with references. It is built as a LangGraph agent on Amazon Aurora PostgreSQL with pgvector.

An assistant like this keeps changing: models are retrained on new data, retrieval is tuned and the agent gains new steps. Every change raises the same question: **is the new version actually better, and is it still safe?**

The plan below answers it. A new version only ships when it beats the previous one on a sealed set of real AOGs, scored node by node, with a statistically significant gain, zero safety-critical errors and confirmation in shadow mode. It covers:

- **The system under test** and the tech stack on AWS, including the ETL that fills the knowledge store.
- **The data:** time-split validation and sealed sets, and how engineers label each test case.
- **Metrics for every layer:** classification, retrieval, generation, safety, latency and cost, with a glossary of each one.
- **Reading a v1 vs v2 comparison:** confidence intervals, McNemar's test, slice checks and ablation.
- **Release gates in CI**, running the evaluation on Langfuse, and confirming in production.
- **Improvement techniques**, and which metric each one should move.
