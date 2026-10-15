"""LinkedIn-readable redraws: 10-stack-substitutions, 11-ai-gateways-compared, 12-ops-tooling-rankings."""
import os
from PIL import ImageFont
from base import *

_FONT_FILE = "/System/Library/Fonts/HelveticaNeue.ttc"
_FONTS = {}



def mark(s, cx, cy, v, r=15):
    """Draw a full / half / empty Harvey ball as shapes, so all three have the same size."""
    if v == "\u25cf":
        s.parts.append(f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{NAVY}"/>')
    elif v == "\u25d0":
        s.parts.append(f'<circle cx="{cx}" cy="{cy}" r="{r - 1.5}" fill="#FFFFFF" stroke="{NAVY}" stroke-width="3"/>')
        s.parts.append(f'<path d="M{cx},{cy - r + 1.5} A{r - 1.5},{r - 1.5} 0 0,0 {cx},{cy + r - 1.5} Z" fill="{NAVY}"/>')
    else:
        s.parts.append(f'<circle cx="{cx}" cy="{cy}" r="{r - 1.5}" fill="#FFFFFF" stroke="#94A3B8" stroke-width="3"/>')

def tw(s, size, weight="400"):
    """Measured text width in px (Helvetica Neue), with a 4% safety margin."""
    idx = {"400": 0, "500": 10}.get(str(weight), 1)
    key = (size, idx)
    if key not in _FONTS:
        _FONTS[key] = ImageFont.truetype(_FONT_FILE, size, index=idx)
    return _FONTS[key].getlength(s) * 1.04


def mwrap(s, width, size, weight="400"):
    out, cur = [], ""
    for word in s.split():
        cand = f"{cur} {word}".strip()
        if cur and tw(cand, size, weight) > width:
            out.append(cur)
            cur = word
        else:
            cur = cand
    if cur:
        out.append(cur)
    for line in out:
        assert tw(line, size, weight) <= width + 1, f"word too long: {line!r} ({width})"
    return out


def hline(s, x1, x2, y, color="#E2E8F0", sw=2):
    s.parts.append(f'<line x1="{x1}" y1="{y}" x2="{x2}" y2="{y}" stroke="{color}" stroke-width="{sw}"/>')


# ---------------------------------------------------------------------------
def stack_substitutions():
    groups = [
        ("Edge & identity", [
            ("Customer identity", "Entra External ID", "Amazon Cognito", "Identity Platform", "Keycloak (on EKS)"),
            ("Edge, CDN & WAF", "Front Door + WAF", "CloudFront + AWS WAF + Shield", "Cloud CDN + Cloud Armor", "Cloudflare (CDN + WAF)"),
        ]),
        ("Gateway", [
            ("Client API gateway", "API Management", "Amazon API Gateway", "Apigee", "Kong Gateway"),
            ("AI gateway (LLM traffic)", "APIM AI gateway policies", "Bedrock AgentCore Gateway (model routing)", "Apigee LLM policies", "LiteLLM / Portkey / Envoy AI Gateway"),
            ("Semantic cache store", "Azure Managed Redis", "ElastiCache (Valkey / Redis)", "Memorystore", "Redis / Valkey"),
            ("MCP & A2A gateway", "APIM MCP + A2A APIs", "Bedrock AgentCore Gateway", "Apigee + MCP servers on Cloud Run", "agentgateway / Kong AI Gateway"),
        ]),
        ("Agents & compute", [
            ("Runtime for agents & MCP servers", "Container Apps", "ECS on Fargate", "Cloud Run", "EKS (Kubernetes) + KEDA"),
            ("Agent orchestration", "=LangGraph", "=LangGraph (or AgentCore Runtime)", "=LangGraph (or Agent Engine)", "=LangGraph"),
            ("Agent state & claim drafts", "=PostgreSQL Flexible Server", "=Aurora PostgreSQL", "=AlloyDB / Cloud SQL Postgres", "=PostgreSQL (RDS or CloudNativePG)"),
        ]),
        ("Models & context", [
            ("Foundation models (API)", "Azure OpenAI (EU Data Zone)", "Amazon Bedrock (EU inference profiles)", "Vertex AI (Gemini, Model Garden)", "Bedrock + other providers, behind the AI gateway"),
            ("Self-hosted model serving", "Foundry managed compute / AKS", "SageMaker AI endpoints", "Vertex AI endpoints / GKE", "vLLM + KServe + llm-d on EKS"),
            ("Retrieval / search", "Azure AI Search", "OpenSearch Service / Bedrock Knowledge Bases", "Vertex AI Search", "OpenSearch / Qdrant / pgvector"),
            ("Documents & damage photos", "Document Intelligence + Content Understanding", "Textract + Bedrock Data Automation", "Document AI + Gemini (vision)", "Docling / Unstructured + vision model on vLLM"),
        ]),
        ("Integration", [
            ("Files & events", "Blob Storage + Event Grid", "S3 + EventBridge", "Cloud Storage + Eventarc", "S3 + Apache Kafka"),
            ("Async messaging to core", "Service Bus", "SQS / SNS", "Pub/Sub", "Apache Kafka (or RabbitMQ)"),
            ("Mobile push", "Notification Hubs", "SNS mobile push", "Firebase Cloud Messaging", "FCM + APNs directly"),
        ]),
        ("Cross-cutting", [
            ("Guardrails & content safety", "AI Content Safety + Prompt Shields", "Bedrock Guardrails", "Model Armor", "NeMo Guardrails / Llama Guard + Presidio"),
            ("Observability", "Application Insights", "CloudWatch + X-Ray (ADOT)", "Cloud Trace + Monitoring", "OpenTelemetry Collector + Grafana stack"),
            ("LLM tracing & evals", "=Langfuse + AI Foundry evals", "=Langfuse + Bedrock evaluations", "=Langfuse + Vertex AI evaluation", "=Langfuse + Ragas / promptfoo"),
            ("Secrets & workload identity", "Managed identities + Key Vault", "IAM roles + Secrets Manager", "Service accounts + Secret Manager", "HashiCorp Vault (or OpenBao)"),
            ("Data governance", "Microsoft Purview", "Amazon DataZone", "Dataplex", "OpenMetadata / DataHub"),
            ("CI/CD with eval gate", "=GitHub Actions", "=GitHub Actions", "=GitHub Actions", "=GitHub Actions + Argo CD"),
        ]),
    ]
    cols = [("Azure", "(worked example)", BLUE_L, BLUE),
            ("AWS", "native", AMBER_L, AMBER),
            ("Google Cloud", "native", GREEN_L, GREEN),
            ("AWS + cloud-", "independent stack", VIOLET_L, VIOLET)]
    X0, X1, gap = 40, W - 40, 10
    cw = (X1 - X0 - 3 * gap) / 4
    csize, clh = 20, 25
    footer = ("The layers never change; only product names do. The cloud-independent column still runs on AWS "
              "(EKS, S3, RDS, GPU nodes), but every AI-specific piece can move to another cloud or on-premises "
              "with the same configuration.")

    def layout(s):
        """Returns list of draw ops and total height used, starting at s.top."""
        y = s.top
        ops = []
        # legend
        ops.append(("legend", y))
        y += 2 * 34 + 20
        ops.append(("colhead", y))
        y += 84
        for gname, items in groups:
            y += 14
            ops.append(("group", y, gname))
            y += 44
            for comp, *vals in items:
                wrapped = [mwrap(v.lstrip("="), cw - 22, csize, "500") for v in vals]
                n = max(len(w) for w in wrapped)
                ch = n * clh + 18
                ops.append(("row", y, comp, vals, wrapped, ch))
                y += 30 + ch + 8
        y += 10
        fl = mwrap(footer, X1 - X0 - 44, 22, "500")
        ops.append(("footer", y, fl))
        y += len(fl) * 30 + 34
        return ops, y

    probe = Svg(1000, "Same architecture, three other stacks",
                "What replaces each component of the Azure worked example on AWS, on Google Cloud, "
                "and on AWS with cloud-independent technology")
    _, used = layout(probe)
    H = int(used + 60)
    s = Svg(H, "Same architecture, three other stacks",
            "What replaces each component of the Azure worked example on AWS, on Google Cloud, "
            "and on AWS with cloud-independent technology")
    ops, _ = layout(s)
    for op in ops:
        kind, y = op[0], op[1]
        if kind == "legend":
            s.rect(X0, y + 4, 34, 24, "#E2E8F0", None, rx=6)
            s.text(X0 + 46, y + 24, "same technology in every stack (portable by design)", 21, SLATE)
            s.rect(X0, y + 38, 34, 24, VIOLET_L, VIOLET, rx=6, sw=2)
            s.text(X0 + 46, y + 58, "open-source or provider-neutral, replaces a managed cloud service", 21, SLATE)
        elif kind == "colhead":
            for i, (a, b, f, c) in enumerate(cols):
                x = X0 + i * (cw + gap)
                s.rect(x, y, cw, 72, f, c, rx=12)
                s.text(x + cw / 2, y + 31, a, 23, c, "700", "middle")
                s.text(x + cw / 2, y + 58, b, 20, c, "600", "middle")
        elif kind == "group":
            gname = op[2]
            s.text(X0 + 2, y + 26, gname.upper(), 24, SLATE, "800")
            gx = X0 + tw(gname.upper(), 24, "800") + 16
            hline(s, gx, X1, y + 18, "#CBD5E1", 2)
        elif kind == "row":
            _, y, comp, vals, wrapped, ch = op
            s.text(X0 + 4, y + 22, comp, 22, NAVY, "700")
            yy = y + 30
            for i, (v, wl) in enumerate(zip(vals, wrapped)):
                x = X0 + i * (cw + gap)
                c = cols[i][3]
                same = v.startswith("=")
                if same:
                    fill, stroke = "#E2E8F0", None
                elif c == VIOLET:
                    fill, stroke = VIOLET_L, VIOLET
                else:
                    fill, stroke = "#FFFFFF", c
                s.rect(x, yy, cw, ch, fill, stroke, rx=10, sw=2)
                ty = yy + (ch - len(wl) * clh) / 2 + 19
                s.lines(x + cw / 2, ty, wl, csize, NAVY, "500", "middle", clh / csize)
        elif kind == "footer":
            fl = op[2]
            s.rect(X0, y, X1 - X0, len(fl) * 30 + 26, SOFT, rx=12)
            s.lines(X0 + 22, y + 34, fl, 22, NAVY, "500", "start", 30 / 22)
    s.save("10-stack-substitutions")
    return H


# ---------------------------------------------------------------------------
def gateway_matrix():
    gws = [("Azure API Management", "managed · Azure", BLUE),
           ("AWS Bedrock AgentCore Gateway", "managed · AWS", AMBER),
           ("Google Apigee", "managed · GCP / hybrid", GREEN),
           ("Kong AI Gateway", "OSS core + enterprise", VIOLET),
           ("LiteLLM", "OSS (MIT) + enterprise", VIOLET),
           ("Portkey", "OSS (MIT) + SaaS", VIOLET),
           ("Envoy AI Gateway (Agent Router)", "OSS (Apache 2.0)", VIOLET),
           ("agentgateway", "OSS · Linux Foundation", VIOLET),
           ("Cloudflare AI Gateway", "SaaS at the edge", ROSE)]
    F, Hh, P = "●", "◐", "○"
    feats = [  # (short header line 1, line 2, full name)
        ("Routing", "fallback", "Multi-provider routing & fallback"),
        ("Token", "budgets", "Token limits, quotas & budgets"),
        ("Semantic", "cache", "Semantic caching"),
        ("Guard-", "rails", "Guardrails, content safety & PII"),
        ("MCP", "tools", "MCP gateway (tools)"),
        ("A2A", "agents", "A2A (agent-to-agent) traffic"),
        ("Cost", "obs.", "Token & cost observability"),
        ("OTel", "export", "OpenTelemetry export"),
        ("Self-", "hosted", "Kubernetes-native / self-hosted"),
    ]
    feat_vals = [
        [F, F, Hh, F, F, F, F, F, F],
        [F, P, F, F, F, F, F, F, Hh],
        [F, P, F, F, F, F, F, P, Hh],
        [F, Hh, F, F, F, F, F, Hh, P],
        [F, F, P, F, F, F, F, F, P],
        [F, F, P, F, F, P, P, F, P],
        [F, F, F, F, F, F, F, F, F],
        [F, Hh, Hh, F, F, Hh, F, F, Hh],
        [Hh, P, Hh, F, F, F, F, F, P],
    ]
    fits = ["Azure shops already using APIM", "agent platforms on AWS", "API programmes on Google Cloud",
            "companies already running Kong", "platform teams: fast multi-provider proxy + budgets",
            "product teams: SaaS + many guardrails", "Kubernetes & self-hosted models (KServe, llm-d)",
            "agent-heavy MCP + A2A on K8s", "light edge cache & analytics"]
    X0, X1 = 40, W - 40
    nx0, nw = X0, 250                 # gateway name column
    fx0 = nx0 + nw + 6
    fcw = (X1 - 4 - fx0) / 9         # feature column width
    for a, b, _ in feats:
        assert tw(a, 20, "700") <= fcw - 2 and tw(b, 20, "700") <= fcw - 2, (a, b, fcw)
    title = "AI gateways compared"
    sub = ("What each gateway mentioned in this article supports out of the box, based on vendor "
           "documentation (October 2026)")

    def build(s):
        y = s.top
        # header row
        s.rect(X0, y, X1 - X0, 78, NAVY, None, rx=12)
        s.text(nx0 + 18, y + 48, "Gateway", 23, "#FFFFFF", "700")
        for j, (a, b, _) in enumerate(feats):
            cx = fx0 + j * fcw + fcw / 2
            s.text(cx, y + 34, a, 20, "#FFFFFF", "700", "middle")
            s.text(cx, y + 60, b, 20, "#FFFFFF", "700", "middle")
        y += 90
        for i, (name, lic, c) in enumerate(gws):
            nl = mwrap(name, nw - 22, 23, "700")
            assert tw(lic, 20) <= nw - 18, lic
            fl = mwrap("Best fit: " + fits[i], X1 - X0 - 36, 21, "400")
            top_h = max(len(nl) * 28 + 32 + 16, 84)
            rh = top_h + len(fl) * 28 + 14
            if i % 2 == 0:
                s.rect(X0, y, X1 - X0, rh, SOFT, rx=10)
            s.rect(X0, y + 10, 6, rh - 20, c, None, rx=3)
            s.lines(nx0 + 16, y + 32, nl, 23, c, "700", "start", 28 / 23)
            s.text(nx0 + 16, y + 32 + len(nl) * 28, lic, 20, SLATE)
            sym_cy = y + top_h / 2 + 2
            for j in range(9):
                v = feat_vals[j][i]
                mark(s, fx0 + j * fcw + fcw / 2, sym_cy, v)
            fy = y + top_h + 18
            s.text(nx0 + 18, fy, "Best fit:", 21, NAVY, "700")
            first = fl[0][len("Best fit: "):]
            s.text(nx0 + 18 + tw("Best fit: ", 21, "700"), fy, first, 21, SLATE, "400")
            s.lines(nx0 + 18, fy + 28, fl[1:], 21, SLATE, "400", "start", 28 / 21)
            y += rh + 4
        y += 20
        # legend
        leg = [(F, NAVY, "native, documented feature"),
               (Hh, "#64748B", "partial, or via a companion service (e.g. Bedrock Guardrails, Cloud analytics)"),
               (P, "#CBD5E1", "not documented in the sources reviewed")]
        key = [f"{a}{'' if a.endswith('-') else ' '}{b} = {full}" for a, b, full in feats]
        note = ("Envoy AI Gateway was renamed Agent Router in 2026 and, like agentgateway, MCP and A2A, now lives "
                "in the Linux Foundation's Agentic AI Foundation. Features move fast: check the docs before deciding.")
        y0 = y
        y += 20
        ops = []
        for sym, col, txt in leg:
            tl = mwrap(txt, X1 - X0 - 100, 21, "500")
            ops.append(("sym", y, sym, col, tl))
            y += len(tl) * 28 + 10
        y += 8
        ops.append(("hdr", y, "Column headers"))
        y += 32
        half = (X1 - X0 - 40) / 2
        for k in range(0, 9, 2):
            ops.append(("key", y, key[k], key[k + 1] if k + 1 < 9 else None))
            y += 30
        y += 8
        nl = mwrap(note, X1 - X0 - 40, 21)
        ops.append(("note", y, nl))
        y += len(nl) * 28 + 6
        s.rect(X0, y0, X1 - X0, y - y0, SOFT, rx=12)
        for op in ops:
            if op[0] == "sym":
                _, yy, sym, col, tl = op
                mark(s, X0 + 44, yy + 14, sym, r=13)
                s.lines(X0 + 80, yy + 22, tl, 21, NAVY, "500", "start", 28 / 21)
            elif op[0] == "hdr":
                s.text(X0 + 20, op[1] + 22, op[2], 21, NAVY, "700")
            elif op[0] == "key":
                _, yy, a, b = op
                for t, xx in ((a, X0 + 20), (b, X0 + 20 + half + 20)):
                    if t:
                        assert tw(t, 20) <= half, t
                        s.text(xx, yy + 22, t, 20, SLATE)
            elif op[0] == "note":
                s.lines(X0 + 20, op[1] + 22, op[2], 21, SLATE, "400", "start", 28 / 21)
        return y

    probe = Svg(1000, title, sub)
    H = int(build(probe) + 60)
    s = Svg(H, title, sub)
    build(s)
    s.save("11-ai-gateways-compared")
    return H


# ---------------------------------------------------------------------------
def ops_rankings():
    price_col = {"Free": GREEN, "Free + freemium": TEAL, "Freemium": BLUE, "Free + paid": VIOLET,
                 "Pay-as-you-go": AMBER, "Paid": ROSE}
    tag_col = {"OSS": (GREEN_L, GREEN), "SaaS": (BLUE_L, BLUE), "Cloud": (AMBER_L, AMBER), "OSS + SaaS": (VIOLET_L, VIOLET)}
    panels = [
        ("MLOps", "classic models: tracking, registry, pipelines, monitoring", BLUE, BLUE_L, [
            ("MLflow", "OSS", "Free", "the default for tracking & registry; managed in Databricks, Azure ML, SageMaker", "~45M PyPI/month (incl. skinny)"),
            ("Databricks (Mosaic AI)", "SaaS", "Pay-as-you-go", "lakehouse shops: data, features, training and serving in one place", ""),
            ("SageMaker AI / Vertex AI / Azure ML", "Cloud", "Pay-as-you-go", "teams standardised on one hyperscaler", ""),
            ("Weights & Biases", "SaaS", "Freemium", "experiment tracking for deep-learning teams; now part of CoreWeave", "14.5M PyPI/month"),
            ("Kubeflow / Airflow / Metaflow", "OSS", "Free", "pipelines on Kubernetes or an existing scheduler", "Airflow 47k stars"),
            ("Evidently / Arize", "OSS + SaaS", "Free + freemium", "drift and performance monitoring in production", ""),
        ]),
        ("LLMOps", "apps on foundation models: tracing, evals, prompts, cost", VIOLET, VIOLET_L, [
            ("LangSmith", "SaaS", "Freemium", "LangChain / LangGraph teams; cloud, hybrid or self-hosted", "77M PyPI/month*"),
            ("Langfuse", "OSS + SaaS", "Free + freemium", "most used open-source option; self-host for EU data; part of ClickHouse", "35.6k stars · 23.6M/month"),
            ("Datadog LLM Observability", "SaaS", "Paid", "companies already running Datadog APM", ""),
            ("Arize AX / Phoenix", "OSS + SaaS", "Free + freemium", "OTel-native tracing and evals; strong where classic ML also lives", "Phoenix 11.8k stars"),
            ("Braintrust", "SaaS", "Freemium", "evals-first product teams", "6.6M PyPI/month"),
            ("MLflow 3 GenAI / Opik / W&B Weave", "OSS + SaaS", "Free + freemium", "extend the MLOps tool you already have", "Opik 22.5k stars"),
            ("promptfoo / DeepEval / Ragas", "OSS", "Free + paid", "eval and red-team tests in CI", "promptfoo 3.5M npm/month"),
        ]),
        ("DLOps", "building and running your own models", TEAL, TEAL_L, [
            ("vLLM", "OSS", "Free", "the default open inference engine", "93.5k stars"),
            ("SGLang", "OSS", "Free", "high-throughput serving, structured & agentic workloads", "37k stars · 3.0M/month"),
            ("NVIDIA TensorRT-LLM + Dynamo", "OSS", "Free", "maximum performance on NVIDIA GPUs", ""),
            ("KServe + llm-d", "OSS", "Free", "Kubernetes control plane & KV-cache-aware routing over vLLM", ""),
            ("Ray / Anyscale", "OSS + SaaS", "Free + paid", "distributed training, tuning and batch inference", "44k stars · 13.7M/month"),
            ("DeepSpeed / Megatron-LM", "OSS", "Free", "large-scale pre-training and full fine-tuning", ""),
            ("Unsloth / LLaMA-Factory / Axolotl", "OSS", "Free + paid", "LoRA / QLoRA fine-tuning on few GPUs", "Unsloth 77.7k stars"),
            ("Kueue / Slurm / Run:ai", "OSS + SaaS", "Free + paid", "GPU scheduling and quotas", ""),
        ]),
        ("AgentOps", "agents in production: multi-step traces, tool calls, agent evals", ROSE, ROSE_L, [
            ("LangSmith", "SaaS", "Freemium", "LangGraph agents: tracing plus agent deployment", ""),
            ("Microsoft Foundry observability", "Cloud", "Pay-as-you-go", "agents on Azure: agent evaluators (tool-call accuracy, task completion), App Insights", ""),
            ("Bedrock AgentCore Observability", "Cloud", "Pay-as-you-go", "agents on AWS: OTel traces and CloudWatch dashboards", ""),
            ("Datadog LLM Observability", "SaaS", "Paid", "one pane for agents, APIs and infrastructure", ""),
            ("Arize AX / Phoenix", "OSS + SaaS", "Free + freemium", "agent-as-a-judge evals; surfaces recurring failures", ""),
            ("Langfuse", "OSS + SaaS", "Free + freemium", "open-source agent tracing you can self-host", ""),
            ("AgentOps (agentops.ai)", "OSS + SaaS", "Freemium", "lightweight SDK for agent sessions; small next to the above", "5.9k stars"),
        ]),
    ]
    title = "Who leads in MLOps, LLMOps, DLOps and AgentOps (October 2026)"
    sub = ("A ranking per discipline, by adoption and enterprise footprint, with the situation where each tool "
           "is the best choice")
    X0, X1 = 40, W - 40
    PS = 20  # pill font size

    def pill_w(t):
        return tw(t, PS, "700") + 24

    def pill(s, x, y, t, fill, color):
        w = pill_w(t)
        s.rect(x, y, w, 32, fill, None, rx=16)
        s.text(x + w / 2, y + 23, t, PS, color, "700", "middle")
        return w

    def build(s):
        y = s.top
        for name, psub, col, colL, rows in panels:
            y0 = y
            # header
            hdr_h = 64
            s.rect(X0, y, X1 - X0, hdr_h, colL, None, rx=14)
            s.text(X0 + 22, y + 43, name, 30, col, "700")
            sx = X0 + 22 + tw(name, 30, "700") + 18
            assert sx + tw(psub, 21, "500") < X1 - 16, psub
            s.text(sx, y + 42, psub, 21, SLATE, "500")
            y += hdr_h + 8
            for r, (tool, tag, cost, best, sig) in enumerate(rows):
                # line 1: rank, tool, pills
                s.badge(X0 + 38, y + 22, str(r + 1), col, r=19)
                s.text(X0 + 70, y + 30, tool, 23, NAVY, "700")
                f, c = tag_col[tag]
                w1 = pill_w(tag)
                px = X1 - 18 - w1
                pill(s, px, y + 5, tag, f, c)
                w2 = pill_w(cost)
                px2 = px - 10 - w2
                pill(s, px2, y + 5, cost, price_col[cost], "#FFFFFF")
                assert X0 + 70 + tw(tool, 23, "700") < px2 - 12, tool
                # line 2: best + signal
                bl = mwrap(best, X1 - 18 - (X0 + 70), 21)
                yy = y + 58
                s.lines(X0 + 70, yy, bl, 21, SLATE, "400", "start", 27 / 21)
                last = bl[-1]
                if sig:
                    lx = X0 + 70 + tw(last + "  ", 21)
                    sw_ = tw("\u00b7  " + sig, 21, "700")
                    l1x = X0 + 70 + tw(tool + "   ", 23, "700")
                    if lx + sw_ <= X1 - 18:
                        s.text(lx, yy + (len(bl) - 1) * 27, "\u00b7  " + sig, 21, col, "700")
                    elif l1x + sw_ <= px2 - 14:
                        s.text(l1x, y + 30, "\u00b7  " + sig, 21, col, "700")
                    else:
                        s.text(X0 + 70, yy + len(bl) * 27, sig, 21, col, "700")
                        bl = bl + [sig]
                rh = 58 + (len(bl) - 1) * 27 + 14
                if r < len(rows) - 1:
                    hline(s, X0 + 20, X1 - 20, y + rh - 2, "#E2E8F0", 2)
                y += rh + 2
            s.parts.append(f'<rect x="{X0}" y="{y0}" width="{X1 - X0}" height="{y - y0 + 4}" rx="14" '
                           f'fill="none" stroke="{col}" stroke-width="2.5"/>')
            y += 20
        # footer
        y0 = y
        y += 16
        notes = [("How to read it: rank = adoption signals (PyPI / npm downloads Sep–Oct 2026, GitHub stars) "
                  "plus enterprise footprint; tied tools share a row.", NAVY, "500"),
                 ("* Downloads are inflated by dependencies: langsmith ships with LangChain. Neptune.ai was "
                  "acquired by OpenAI, so plan migrations off it.", SLATE, "400"),
                 ("There is no single winner: pick the tool that lives where your data, cloud and frameworks "
                  "already are, and keep traces in OpenTelemetry so you can switch.", SLATE, "400")]
        ops = []
        for t, c, wt in notes:
            tl = mwrap(t, X1 - X0 - 44, 21, wt)
            ops.append(("lines", y, tl, c, wt))
            y += len(tl) * 28 + 10
        y += 6
        ops.append(("hdr", y))
        y += 40
        legend = [("Free", "open source, no licence fee"),
                  ("Free + freemium", "free to self-host; hosted cloud with a free tier"),
                  ("Freemium", "free tier, paid plans to scale"),
                  ("Free + paid", "open-source core, paid enterprise or managed edition"),
                  ("Pay-as-you-go", "cloud consumption billing (tokens, traces, compute)"),
                  ("Paid", "usage-based subscription after a free trial")]
        pcol = max(pill_w(k) for k, _ in legend)
        for k, d in legend:
            ops.append(("leg", y, k, d))
            y += 40
        y += 4
        ops.append(("asof", y))
        y += 40
        s.rect(X0, y0, X1 - X0, y - y0, SOFT, rx=12)
        for op in ops:
            if op[0] == "lines":
                _, yy, tl, c, wt = op
                s.lines(X0 + 22, yy + 24, tl, 21, c, wt, "start", 28 / 21)
            elif op[0] == "hdr":
                s.text(X0 + 22, op[1] + 26, "Pricing", 22, NAVY, "700")
            elif op[0] == "leg":
                _, yy, k, d = op
                pill(s, X0 + 22, yy, k, price_col[k], "#FFFFFF")
                s.text(X0 + 22 + pcol + 16, yy + 23, d, 21, SLATE)
            elif op[0] == "asof":
                s.text(X0 + 22, op[1] + 22, "Pricing models as of October 2026; check each vendor for current tiers.",
                       20, SLATE, "400", "start", italic=True)
        return y

    probe = Svg(1000, title, sub)
    H = int(build(probe) + 60)
    s = Svg(H, title, sub)
    build(s)
    s.save("12-ops-tooling-rankings")
    return H


def main():
    os.makedirs(SVG_DIR, exist_ok=True)
    os.makedirs(PNG_DIR, exist_ok=True)
    for f in (stack_substitutions, gateway_matrix, ops_rankings):
        print(f.__name__, "height", f())


if __name__ == "__main__":
    main()
