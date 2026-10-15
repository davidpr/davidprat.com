"""LinkedIn-readable versions of 00-cover, 01-reference-architecture, 02-mcp-vs-a2a, 03-ai-gateway."""
from base import *


def box_h(s, w, title, body=None, tsize=26, bsize=21, pad=18):
    """Height that box() (left-aligned) needs for this content."""
    tl = s.wrap(title, w - 2 * pad, tsize)
    h = pad + tsize + (len(tl) - 1) * tsize * 1.25
    if body:
        h += tsize * 0.25 + 4
        for para in body if isinstance(body, list) else [body]:
            bl = s.wrap(para, w - 2 * pad, bsize)
            h += bsize + (len(bl) - 1) * bsize * 1.3 + 4 + bsize * 0.3
    return int(h + pad + 8)


# ---------------------------------------------------------------------------
def cover():
    s = Svg(1080, w=1920)
    s.rect(0, 0, 1920, 1080, NAVY, rx=0)
    s.text(120, 300, "How enterprises are wiring AI in 2026", 76, "#FFFFFF", "700")
    s.text(120, 380, "Models · AI gateways · MCP · A2A · LLMOps · DLOps", 40, "#93C5FD", "500")
    s.text(120, 450, "Reference architectures, sector patterns and the ops behind them", 30, "#CBD5E1")
    layers = [("Channels & identity", "#1E3A8A"), ("Agents & orchestration", "#1D4ED8"),
              ("AI gateway  —  LLM · MCP · A2A traffic", "#2563EB"),
              ("Models  ·  Context (RAG + MCP)  ·  Other agents", "#3B82F6"),
              ("Data platform  ·  LLMOps  ·  DLOps", "#60A5FA")]
    for i, (name, col) in enumerate(layers):
        y = 560 + i * 82
        s.rect(120 + i * 24, y, 1100 - i * 48, 66, col, rx=12)
        s.text(120 + 550, y + 43, name, 28, "#FFFFFF", "600", "middle")
    s.rect(1340, 560, 460, 394, "#0F2D57", "#3B82F6", rx=16, sw=2)
    s.lines(1370, 615, ["Cross-cutting", "", "• Observability (OTel GenAI)", "• Evals & release gates",
                        "• Guardrails & PII", "• Agent identity & security", "• FinOps per team",
                        "• Governance (EU AI Act)"], 27, "#E2E8F0", "500", lh=1.45)
    s.text(1800, 1040, "David Prat Robles", 24, "#93C5FD", "600", "end")
    s.save("00-cover")


# ---------------------------------------------------------------------------
def reference_architecture(H=2650):
    s = Svg(H, "A reference architecture for enterprise AI in 2026",
            "Five layers that repeat across sectors, plus the cross-cutting concerns that decide if it reaches production")
    X0 = 50                      # label band x
    X = X0 + 54                  # content x
    CW = W - 50 - X              # content width
    GAP = 16
    y = s.top

    # Layer 1: channels (2 x 2) + API gateway bar
    y0 = y
    cw = (CW - GAP) / 2
    ch = 104
    for i, (t, b) in enumerate([("Web & mobile apps", "customer-facing UX"),
                                ("Copilots in work tools", "Teams, Slack, IDE, CRM"),
                                ("APIs & events", "partners, Kafka, webhooks"),
                                ("Back-office jobs", "batch, document intake")]):
        r, c = divmod(i, 2)
        s.box(X + c * (cw + GAP), y + r * (ch + GAP), cw, ch, t, b, BLUE_L, center=True, tsize=26, bsize=21)
    y += 2 * ch + 2 * GAP
    s.rect(X, y, CW, 90, "#E0E7FF")
    s.text(X + CW / 2, y + 38, "API gateway + SSO / IAM", 24, NAVY, "700", "middle")
    s.text(X + CW / 2, y + 70, "who is calling, and on whose behalf?", 22, SLATE, "400", "middle")
    y += 90
    s.label_band(X0, y0, y - y0, "CHANNELS", "#1E3A8A")
    y += 30

    # Layer 2: agents
    y0 = y
    body = ["LangGraph · Google ADK · Microsoft Agent Framework · OpenAI Agents SDK · Bedrock AgentCore",
            "Supervisor / router, tools, retries, human-in-the-loop"]
    h = box_h(s, CW, "Agent runtime / orchestration", body)
    s.box(X, y, CW, h, "Agent runtime / orchestration", body, VIOLET_L)
    y += h + GAP
    b1 = ["Checkpoints in Postgres / Redis", "Conversation + long-term memory"]
    b2 = ["Human sign-off on risky actions", "Case / ticket systems"]
    h = max(box_h(s, cw, "State & memory", b1), box_h(s, cw, "Approvals & workflow", b2))
    s.box(X, y, cw, h, "State & memory", b1, VIOLET_L)
    s.box(X + cw + GAP, y, cw, h, "Approvals & workflow", b2, VIOLET_L)
    y += h
    s.label_band(X0, y0, y - y0, "AGENTS", "#1D4ED8")
    y += 30

    # Layer 3: AI gateway
    y0 = y
    gh = 330
    s.rect(X, y, CW, gh, BLUE, rx=14)
    s.text(X + 24, y + 48, "AI gateway", 30, "#FFFFFF", "700")
    s.text(X + 24, y + 84, "one control plane for three kinds of traffic", 23, "#DBEAFE", "500")
    px = X + 24
    for t in ["LLM calls", "MCP tool calls", "A2A agent calls"]:
        px += s.pill(px, y + 108, t, "#FFFFFF", BLUE, 22) + 14
    s.lines(X + 24, y + 196, ["Auth & quotas · routing & fallback · semantic cache",
                               "PII / prompt-injection guardrails · cost per team · audit log"], 22, "#FFFFFF", "400")
    s.text(X + 24, y + 290, "LiteLLM · Azure APIM · Kong · Portkey · AgentCore Gateway", 21, "#DBEAFE", "400")
    y += gh
    s.label_band(X0, y0, y - y0, "GATEWAY", BLUE)
    y += 30

    # Layer 4: capabilities (stacked full-width rows)
    y0 = y
    caps = [("Models", ["Frontier APIs: Azure OpenAI, Bedrock, Vertex AI",
                        "Open-weight & SLMs self-hosted (vLLM on KServe)",
                        "Compressed SLMs at the edge / on device"]),
            ("Context", ["RAG: pgvector, Azure AI Search, OpenSearch",
                         "MCP servers in front of CRM, ERP, documents, data products",
                         "Permissions travel with the user"]),
            ("Other agents", ["Agents from other teams, vendors and SaaS (ServiceNow, Salesforce, SAP...)",
                              "Discovered via A2A Agent Cards"])]
    for i, (t, b) in enumerate(caps):
        h = box_h(s, CW, t, b, tsize=27)
        s.box(X, y, CW, h, t, b, TEAL_L, tsize=27)
        y += h + (GAP if i < 2 else 0)
    s.label_band(X0, y0, y - y0, "CAPABILITIES", "#3B82F6")
    y += 30

    # Layer 5: foundation
    y0 = y
    b1 = ["Lakehouse, ETL with AI steps (extraction, classification), embedding pipelines, data contracts"]
    b2 = ["Prompts & evals as code, tracing, release gates", "Fine-tune · distil · quantise · serve on GPUs"]
    h = max(box_h(s, cw, "Data platform", b1), box_h(s, cw, "LLMOps + DLOps", b2))
    s.box(X, y, cw, h, "Data platform", b1, SOFT)
    s.box(X + cw + GAP, y, cw, h, "LLMOps + DLOps", b2, SOFT)
    y += h
    s.label_band(X0, y0, y - y0, "FOUNDATION", "#60A5FA")
    y += 40

    # Cross-cutting panel (2 columns x 3 rows)
    items = [("Observability", "OpenTelemetry GenAI spans, Langfuse / LangSmith, cost & latency"),
             ("Evaluation", "golden sets, LLM-as-judge, red teaming, online sampling"),
             ("Guardrails", "PII redaction, content safety, prompt-injection checks"),
             ("Identity & security", "agent identities, OAuth 2.1 for MCP, least privilege"),
             ("FinOps", "tokens and GPU hours per team and per use case"),
             ("Governance", "model inventory, risk tiers, EU AI Act evidence")]
    px0 = X0
    pw = W - 50 - X0
    colw = (pw - 3 * 28) / 2
    row_h = []
    for r in range(3):
        n = max(len(s.wrap(items[r * 2 + c][1], colw, 21)) for c in range(2))
        row_h.append(26 + 10 + n * 21 * 1.3 + 26)
    ph = 76 + sum(row_h) + 16
    s.rect(px0, y, pw, ph, AMBER_L, AMBER, rx=16)
    s.text(px0 + 28, y + 50, "Cross-cutting concerns", 30, AMBER, "700")
    yy = y + 76
    for r in range(3):
        for c in range(2):
            t, b = items[r * 2 + c]
            cx = px0 + 28 + c * (colw + 28)
            s.text(cx, yy + 26, t, 26, NAVY, "700")
            s.lines(cx, yy + 26 + 32, s.wrap(b, colw, 21), 21, SLATE)
        yy += row_h[r]
    y += ph
    print("ref-arch content ends at", y, "canvas", H)
    s.save("01-reference-architecture")
    return y


# ---------------------------------------------------------------------------
def protocols(H=1270):
    s = Svg(H, "MCP is vertical, A2A is horizontal",
            "MCP connects an agent to tools and data. A2A connects agents to other agents. You will usually need both.")
    y = s.top
    # Agent Card
    s.box(260, y, 680, 130, "Agent Card", ["/.well-known/agent.json", "who I am, what I can do, how to authenticate"],
          "#FFFFFF", BLUE, center=True, tsize=26, bsize=21)
    y += 130 + 50
    # A2A label
    s.text(600, y + 30, "A2A", 38, BLUE, "800", "middle")
    s.text(600, y + 66, "agent ↔ agent: tasks, streaming, long-running work", 23, BLUE, "500", "middle")
    y += 100
    # Row: peer - your agent - peer
    rh = 190
    s.box(50, y, 290, rh, "Agent from another team", ["different framework, own release cycle"], BLUE_L, BLUE,
          center=True, tsize=26, bsize=21)
    s.box(430, y, 340, rh, "Your agent", ["built with LangGraph, ADK, Semantic Kernel..."], VIOLET_L, VIOLET,
          center=True, tsize=30, bsize=21)
    s.box(860, y, 290, rh, "Vendor / SaaS agent", ["e.g. ITSM, CRM or ERP platform agents"], BLUE_L, BLUE,
          center=True, tsize=26, bsize=21)
    s.arrow(344, y + rh / 2, 426, y + rh / 2, BLUE, 5, both=True)
    s.arrow(774, y + rh / 2, 856, y + rh / 2, BLUE, 5, both=True)
    yb = y + rh
    # MCP tools
    gap_v = 240
    ty = yb + gap_v
    tools = ["CRM", "ERP / SAP", "Document store", "Data warehouse", "Internal REST APIs"]
    tw, tg = 204, 20
    for i, t in enumerate(tools):
        x = 50 + i * (tw + tg)
        s.box(x, ty, tw, 130, t, "MCP server", TEAL_L, TEAL, center=True, tsize=24, bsize=20)
        sx = 470 + i * 65
        s.arrow(sx, yb + 3, x + tw / 2, ty - 3, TEAL, 3.5)
    s.text(1150, yb + 60, "MCP", 38, TEAL, "800", "end")
    s.text(1150, yb + 96, "agent → tools & data", 23, TEAL, "500", "end")
    y = ty + 130 + 40
    # AAIF note
    note = ("Since August 2026 both protocols live under the Linux Foundation's Agentic AI Foundation (AAIF): "
            "a neutral home, which matters for enterprise adoption.")
    nl = s.wrap(note, 1100 - 48, 22)
    nh = 36 + len(nl) * 22 * 1.3 + 14
    s.rect(50, y, 1100, nh, SOFT, rx=12)
    s.lines(600, y + 22 + 28, nl, 22, NAVY, "500", "middle")
    y += nh
    print("protocols content ends at", y, "canvas", H)
    s.save("02-mcp-vs-a2a")
    return y


# ---------------------------------------------------------------------------
def gateway(H=1590):
    s = Svg(H, "The AI gateway: one control plane, three kinds of traffic",
            "The API gateway idea of the last decade, now aware of tokens, tools and agents")
    y = s.top
    # consumers
    cons = [("Business apps", "chat, copilots"), ("Agents", "LangGraph, ADK..."), ("Coding agents", "IDEs, CI pipelines"),
            ("Batch & ETL", "document AI steps")]
    cw, cg = 260, 20
    for i, (t, b) in enumerate(cons):
        x = 50 + i * (cw + cg)
        s.box(x, y, cw, 120, t, b, VIOLET_L, center=True, tsize=26, bsize=21)
        s.arrow(x + cw / 2, y + 122, x + cw / 2, y + 186, VIOLET, 4)
    y += 190
    # gateway
    pol = ["Identity: users, apps and agents", "Quotas, rate limits, budgets per team",
           "Routing, load balancing & failover", "Semantic & prompt caching",
           "Guardrails: PII, safety, prompt injection", "Tool allow-lists for MCP",
           "Policies on agent-to-agent calls", "Audit log & OpenTelemetry export"]
    gh = 140 + len(pol) * 62 + 14
    s.rect(50, y, 1100, gh, BLUE, rx=18)
    s.text(600, y + 56, "AI gateway", 36, "#FFFFFF", "700", "middle")
    s.text(600, y + 96, "LiteLLM · Azure API Management · Kong · Portkey", 22, "#DBEAFE", "400", "middle")
    for i, p in enumerate(pol):
        ry = y + 130 + i * 62
        s.rect(90, ry, 1020, 50, "#1D4ED8", rx=10)
        s.text(116, ry + 33, p, 23, "#FFFFFF", "500")
    gy = y + gh
    y = gy + 80
    # destinations
    dest = [("LLM traffic", ["Azure OpenAI, Bedrock, Vertex", "self-hosted vLLM / SLMs"], TEAL_L, TEAL),
            ("MCP traffic", ["MCP servers wrapping CRM, ERP, data", "REST APIs exposed as tools"], GREEN_L, GREEN),
            ("A2A traffic", ["agents of other teams", "vendor & SaaS agents"], AMBER_L, AMBER)]
    dw, dg = 340, 40
    dh = max(box_h(s, dw, t, b, tsize=27) for t, b, _, _ in dest)
    for i, (t, b, f, c) in enumerate(dest):
        x = 50 + i * (dw + dg)
        s.box(x, y, dw, dh, t, b, f, c, tsize=27)
        s.arrow(x + dw / 2, gy + 2, x + dw / 2, y - 3, c, 4)
    # telemetry
    ty = y + dh + 70
    s.arrow(50 + dw + dg / 2, gy + 2, 50 + dw + dg / 2, ty - 3, SLATE, 3, dash="8 6")
    tl = ["Telemetry → Langfuse / LangSmith / OTel backend", "SIEM  ·  FinOps dashboards"]
    s.rect(50, ty, 1100, 100, SOFT, rx=12)
    s.lines(600, ty + 42, tl, 23, NAVY, "500", "middle")
    y = ty + 100
    print("gateway content ends at", y, "canvas", H)
    s.save("03-ai-gateway")
    return y


def main():
    cover()
    reference_architecture()
    protocols()
    gateway()


if __name__ == "__main__":
    main()
