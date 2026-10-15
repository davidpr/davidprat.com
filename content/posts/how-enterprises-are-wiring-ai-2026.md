---
title: "How enterprises are wiring AI in 2026: models, AI gateways, MCP, A2A, LLMOps and DLOps"
date: "2026-10-13T09:00:00"
excerpt: "The reference architecture that keeps repeating across sectors, the protocols and gateways that glue it together, a worked example for an insurer on Azure, and LLMOps and DLOps. Full article on LinkedIn, with the diagrams in full size here."
topics: ["AI & LLMs"]
cover: "/posts/linkedin-enterprise-ai-wiring-2026/cover.jpg"
---
Two years ago most AI conversations started with *"which model should we use?"*. Today the model is the easy part. Projects stall on the **plumbing**: who is allowed to call what, how tools and data are exposed, how agents talk to each other, how a prompt change is tested before it reaches a customer, and who pays for the GPUs.

The article is the map I wish I had at the start: the reference architecture that keeps repeating across sectors, the protocols and AI gateways that glue it together, how the emphasis changes by industry, a complete worked example for an insurer on Azure, and the two "Ops" disciplines that decide whether any of it survives production: **LLMOps** and **DLOps**.

**[Read the full article on LinkedIn →](https://www.linkedin.com/pulse/how-enterprises-wiring-ai-2026-models-gateways-mcp-a2a-prat-robles-vk2ye/)**

## Self-hosted AI on Kubernetes, in detail

LinkedIn shows images at a small size, so this is the full version of the Kubernetes diagram from section 3 of the article. Click the image to open it at full resolution, or open it in the draw.io viewer to zoom and pan.

[![Self-hosted AI on Kubernetes, in detail: network, node pools, namespaces and pods of one cluster, and the path of a request](/posts/linkedin-enterprise-ai-wiring-2026/k8s-self-hosted-ai-preview.jpg)](/posts/linkedin-enterprise-ai-wiring-2026/k8s-self-hosted-ai.png)

- [Open in the draw.io viewer (zoom and pan)](https://viewer.diagrams.net/?lightbox=1&nav=1&title=k8s-self-hosted-ai.drawio#Uhttps%3A%2F%2Fdavidprat.com%2Fposts%2Flinkedin-enterprise-ai-wiring-2026%2Fk8s-self-hosted-ai.drawio)
- [Full-resolution PNG (4400 px)](/posts/linkedin-enterprise-ai-wiring-2026/k8s-self-hosted-ai.png)
- [Download the editable draw.io file](/posts/linkedin-enterprise-ai-wiring-2026/k8s-self-hosted-ai.drawio)

What the diagram shows:

- **The path of a request**, numbered 1 to 8: from the app through the WAF and the ingress to a LangGraph agent, then through the AI gateway either to a small self-hosted model (llm-d picks the vLLM pod) or to a frontier model API, and to the MCP servers that reach the core systems.
- **The cluster**: a CPU node pool for agents, gateways, MCP servers, state, observability and platform tooling, and a GPU node pool where vLLM runs split into prefill and decode pods, managed by KServe.
- **Two places for the AI gateway**: inside the cluster (Kong, Envoy AI Gateway, agentgateway or LiteLLM) or as the cloud's managed gateway (Azure API Management, AWS AgentCore Gateway, Google Apigee).
- **The network**: a private VNet / VPC with public edge, egress and private-endpoint subnets; private links to the model APIs and to the storage that holds the weights; hybrid connectivity to on-premises systems; and inside the cluster Cilium, default-deny NetworkPolicies and optional mTLS.
- **A legend per cloud** with the Azure, AWS and Google Cloud name of every networking service in the diagram.

## The same cluster, with A2A between agents

The second Kubernetes diagram of section 3: every agent becomes its own service. A concierge agent is the only one that faces users and delegates to specialist agents (intake, coverage, fraud) over A2A, each with its own Deployment, Agent Card and release cycle.

[![Self-hosted AI on Kubernetes, with A2A between agents: a concierge agent delegates to specialists over A2A through the AI gateway](/posts/linkedin-enterprise-ai-wiring-2026/k8s-a2a-agents-preview.jpg)](/posts/linkedin-enterprise-ai-wiring-2026/k8s-a2a-agents.png)

- [Open in the draw.io viewer (zoom and pan)](https://viewer.diagrams.net/?lightbox=1&nav=1&title=k8s-a2a-agents.drawio#Uhttps%3A%2F%2Fdavidprat.com%2Fposts%2Flinkedin-enterprise-ai-wiring-2026%2Fk8s-a2a-agents.drawio)
- [Full-resolution PNG (4400 px)](/posts/linkedin-enterprise-ai-wiring-2026/k8s-a2a-agents.png)
- [Download the editable draw.io file](/posts/linkedin-enterprise-ai-wiring-2026/k8s-a2a-agents.drawio)

What changes compared with the first diagram:

- **Delegation goes through the AI gateway**, like every other call that leaves an agent, so identity, limits and traces are applied in one place (steps 6 and 7, in blue). kagent manages the agents and serves one A2A endpoint per agent; without it, each agent serves its own.
- **Partner agents of other companies** are reached the same way: A2A through the gateway, out through the egress firewall (step 9).
- **Each agent keeps its own state** in PostgreSQL: checkpoints and A2A tasks (step 10).
- **Routing through the gateway is a choice**, not a rule of the protocol: agents of one team can also call each other directly, pod to pod, with mTLS and network policies. Keep the gateway at the border, between teams and with other companies.
- Everything below the gateway (MCP servers, llm-d, KServe, vLLM) and the whole network layer stay the same.
