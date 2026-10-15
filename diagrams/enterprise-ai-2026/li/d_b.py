"""LinkedIn-readable versions of diagrams 04, 05, 06, 07 (1200 px wide, fonts >= 20 px)."""
import math

from base import *

LH = 1.3


def wrapped_h(s, lines_count, size, lh=LH):
    return lines_count * size * lh


def bullets(s, x, y, items, width, size=22, color=NAVY, gap=6):
    """Draw wrapped bullet items; return y after the last line."""
    for it in items:
        wl = s.wrap(it, width - 26, size)
        s.text(x, y, "•", size, color, "700")
        s.lines(x + 24, y, wl, size, color)
        y += len(wl) * size * LH + gap
    return y


# ---------------------------------------------------------------------------
SECTORS = [
    ("Banking & insurance", BLUE_L, BLUE,
     ["KYC & claims document intake", "advisor / agent copilots", "fraud & AML alert triage"],
     ["EU-region private endpoints", "full audit trail through the gateway", "human sign-off on decisions",
      "model risk management"],
     "document AI pipeline → agent with human approval → core systems via MCP"),
    ("Healthcare & life sciences", TEAL_L, TEAL,
     ["clinical & trial document summaries", "trial operations agents", "RAG over protocols & literature"],
     ["PII / PHI redaction before any model", "validated (GxP-style) releases", "evaluation evidence per version"],
     "de-identification → RAG over a validated corpus → judge + expert review"),
    ("Retail & e-commerce", AMBER_L, AMBER,
     ["conversational shopping & search", "product content at scale", "inventory & demand insights"],
     ["low latency & semantic caching", "cost per conversation", "A/B tests on prompts & models"],
     "semantic cache + router: small model for easy turns, frontier model for hard ones"),
    ("Manufacturing, IoT & industry", GREEN_L, GREEN,
     ["maintenance copilots over manuals", "visual quality inspection", "assistants on devices"],
     ["compressed SLMs at the edge", "hybrid cloud + plant (OT) security", "real-time event streams"],
     "edge SLM on the device + cloud RAG over manuals, synced through events"),
    ("Aviation & transport", VIOLET_L, VIOLET,
     ["technical documentation assistants", "ops data extraction", "disruption management agents"],
     ["RAG over huge technical corpora", "traceable answers with sources", "safety review in the loop"],
     "ETL with AI extraction → RAG + hierarchical agents → traced answers with sources"),
    ("Public sector & utilities", ROSE_L, ROSE,
     ["citizen service assistants", "case & document processing", "asset & grid analytics"],
     ["data sovereignty, open-weight models", "transparency obligations", "accessibility & multilingual"],
     "open-weight models on sovereign cloud → RAG over regulations → clear AI notices"),
]


def sectors():
    X, CW = 50, 1100
    colw = (CW - 40 - 30) / 2       # two inner columns
    BS = 22

    def col_h(probe, items):
        return sum(len(probe.wrap(it, colw - 26, BS)) * BS * LH + 6 for it in items)

    probe = Svg(100)
    card_hs = []
    for name, f, c, uses, arch, pat in SECTORS:
        body = max(col_h(probe, uses), col_h(probe, arch))
        pl = len(probe.wrap(pat, CW - 40 - 40, BS))
        card_hs.append(24 + 34 + 22 + 44 + body + 10 + (20 + 26 + 10 + pl * BS * LH + 16) + 20)
    title = "Same building blocks, different emphasis by sector"
    sub = "Typical use cases and what the architecture has to get right in each industry"
    head = Svg(100, title, sub)
    H = int(head.top + sum(card_hs) + 30 * (len(card_hs) - 1) + 80)
    s = Svg(H, title, sub)
    y = s.top
    for (name, f, c, uses, arch, pat), ch in zip(SECTORS, card_hs):
        s.rect(X, y, CW, ch, f, c, rx=18)
        s.text(X + 24, y + 24 + 30, name, 30, c, "700")
        hy = y + 24 + 34 + 22 + 22
        x1, x2 = X + 24, X + 24 + colw + 30
        s.text(x1, hy, "TYPICAL USE CASES", 20, SLATE, "700")
        s.text(x2, hy, "ARCHITECTURE EMPHASIS", 20, SLATE, "700")
        by = hy + 40
        e1 = bullets(s, x1, by, uses, colw, BS)
        e2 = bullets(s, x2, by, arch, colw, BS)
        py = max(e1, e2) - BS + 10
        pl = s.wrap(pat, CW - 80, BS)
        ph = 20 + 26 + 10 + len(pl) * BS * LH + 16
        s.rect(X + 18, py, CW - 36, ph, "#FFFFFF", rx=12)
        s.text(X + 38, py + 20 + 20, "COMMON PATTERN", 20, c, "700")
        s.lines(X + 38, py + 20 + 26 + 10 + BS, pl, BS, NAVY, "500")
        y += ch + 30
    s.save("04-sector-patterns")


# ---------------------------------------------------------------------------
def green_brown():
    title = "New projects vs. existing systems"
    sub = "Greenfield builds around agents; brownfield wraps what already works and adds AI at the edges"
    panels = [
        ("Greenfield: agent-native", BLUE_L, BLUE,
         ["Start from the user journey and the decisions to automate",
          "Agent runtime with explicit state (graph / workflow)",
          "Every tool exposed through MCP from day one",
          "All model, tool and agent calls through the AI gateway",
          "Evals in CI: no prompt or model change ships without passing",
          "Tracing on from the first prototype (OpenTelemetry GenAI)"]),
        ("Brownfield: AI on the existing estate", AMBER_L, AMBER,
         ["Wrap existing REST / SOAP services as MCP tools (often at the gateway)",
          "Add AI steps inside current ETL & document flows (extract, classify, validate)",
          "Event-driven sidecar: Kafka events trigger agents, results go back as events",
          "Embed copilots in the tools people already use (CRM, ticketing, ERP)",
          "Strangler pattern: replace manual steps one by one, keep the system of record",
          "Reuse existing IAM, logging and data governance — do not build a parallel world"]),
    ]
    X, PW = 50, 1100
    TS = 24
    tw = PW - 60 - 80          # text width inside a row
    probe = Svg(100)
    layouts = []
    for name, f, c, steps in panels:
        rows = []
        for t in steps:
            wl = probe.wrap(t, tw, TS)
            rows.append((wl, max(76, 30 + len(wl) * TS * LH)))
        ph = 30 + 34 + 30 + sum(r[1] for r in rows) + 14 * (len(rows) - 1) + 30
        layouts.append((rows, ph))
    head = Svg(100, title, sub)
    H = int(head.top + sum(l[1] for l in layouts) + 40 + 80)
    s = Svg(H, title, sub)
    y = s.top
    for (name, f, c, steps), (rows, ph) in zip(panels, layouts):
        s.rect(X, y, PW, ph, f, c, rx=18)
        s.text(X + 30, y + 30 + 32, name, 32, c, "700")
        ry = y + 30 + 34 + 30
        for i, (wl, rh) in enumerate(rows):
            s.rect(X + 30, ry, PW - 60, rh, "#FFFFFF", rx=12)
            s.text(X + 66, ry + rh / 2 + 11, str(i + 1), 30, c, "800", "middle")
            ty = ry + rh / 2 - (len(wl) * TS * LH) / 2 + TS
            s.lines(X + 30 + 80, ty, wl, TS, NAVY, "500")
            ry += rh + 14
        y += ph + 40
    s.save("05-greenfield-vs-brownfield")


# ---------------------------------------------------------------------------
def llmops():
    title = "LLMOps: the loop that keeps AI applications honest"
    sub = "Prompts, retrieval, tools and models change every week — the loop is what makes those changes safe"
    stages = [("Design", ["prompts & tools as", "versioned artifacts"], BLUE_L, BLUE),
              ("Build", ["agents, RAG,", "MCP tools"], VIOLET_L, VIOLET),
              ("Evaluate offline", ["golden sets,", "LLM-as-judge,", "red teaming"], TEAL_L, TEAL),
              ("Release gate", ["CI/CD blocks", "regressions"], GREEN_L, GREEN),
              ("Run", ["behind the", "AI gateway", "with guardrails"], BLUE_L, BLUE),
              ("Observe", ["OTel GenAI traces,", "cost, latency"], AMBER_L, AMBER),
              ("Evaluate online", ["sampled judges,", "user feedback,", "drift"], ROSE_L, ROSE)]
    BW, BH = 280, 164
    rx, ry = 410, 560
    head = Svg(100, title, sub)
    cy = head.top + ry + BH / 2 + 10
    H = int(cy + ry * math.sin(math.radians(64.3)) + BH / 2 + 90)
    s = Svg(H, title, sub)
    cx = 600
    n = len(stages)
    ang = [-math.pi / 2 + 2 * math.pi * i / n for i in range(n)]
    pt = lambda t: (cx + rx * math.cos(t), cy + ry * math.sin(t))
    col = "#64748B"
    s.parts.append(f'<defs><marker id="ringL" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" '
                   f'markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="{col}"/></marker></defs>')
    for i in range(n):
        t1, t2 = ang[i], ang[i] + 2 * math.pi / n
        k = 60
        pts = [pt(t1 + (t2 - t1) * j / k) for j in range(k + 1)]
        s.parts.append('<polyline fill="none" stroke="#94A3B8" stroke-width="5" points="' +
                       " ".join(f"{x:.1f},{y:.1f}" for x, y in pts) + '"/>')
        # arrowhead in the middle of the arc part that is visible between the two boxes
        def inside(t):
            x, y = pt(t)
            return any(abs(x - bx) < BW / 2 + 6 and abs(y - by) < BH / 2 + 6
                       for bx, by in (pt(t1), pt(t2)))
        vis = [t1 + (t2 - t1) * j / 400 for j in range(401) if not inside(t1 + (t2 - t1) * j / 400)]
        tm = (vis[0] + vis[-1]) / 2
        x1, y1 = pt(tm - 0.01)
        x2, y2 = pt(tm + 0.01)
        s.parts.append(f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" stroke="{col}" '
                       f'stroke-width="5" marker-end="url(#ringL)"/>')
    for t, (name, body, f, c) in zip(ang, stages):
        x, y = pt(t)
        s.box(x - BW / 2, y - BH / 2, BW, BH, name, body, f, c, center=True, tsize=27, bsize=22)
    s.text(cx, cy - 30, "LLMOps", 60, NAVY, "800", "middle")
    s.lines(cx, cy + 22, ["prompt + version + params", "+ exact model snapshot", "= the unit you test and ship"],
            24, SLATE, "500", "middle", 1.35)
    s.save("06-llmops-loop")


# ---------------------------------------------------------------------------
def dlops():
    title = "DLOps: owning the deep-learning lifecycle"
    sub = ("When you train, adapt, compress or self-host models, you need the ops of a model builder, "
           "not only of an app builder")
    steps = [("Data", "curation, synthetic data, licences, data contracts", SOFT, SLATE),
             ("Train / adapt", "LoRA / QLoRA, full fine-tuning, GPU scheduling (Kubernetes + Kueue, Slurm, Ray)",
              VIOLET_L, VIOLET),
             ("Compress", "distillation, quantisation, pruning — smaller, cheaper, edge-ready", TEAL_L, TEAL),
             ("Benchmark", "task & safety evals vs. the base model, before any client sees it", AMBER_L, AMBER),
             ("Registry", "versioned weights, model cards, lineage (MLflow, Hugging Face)", GREEN_L, GREEN),
             ("Serve", "vLLM runtime · KServe control plane · llm-d cache-aware routing", BLUE_L, BLUE)]
    fam = [("MLOps", "classic ML: features, training, drift on tabular / time series models", SOFT, SLATE),
           ("LLMOps", "applications on foundation models: prompts, RAG, agents, evals, tracing, cost", BLUE_L, BLUE),
           ("DLOps", "building & running the models themselves: GPUs, fine-tuning, compression, serving",
            VIOLET_L, VIOLET),
           ("AgentOps", "agents in production: tool permissions, agent identity, A2A / MCP governance",
            AMBER_L, AMBER)]
    BS = 22
    X0, XR = 130, 1150          # step boxes; left margin keeps the feedback loop
    TW = 250                    # title column
    bw = XR - X0 - TW - 30
    probe = Svg(100)
    step_rows = []
    for t, b, f, c in steps:
        wl = probe.wrap(b, bw, BS)
        step_rows.append((wl, max(96, 36 + len(wl) * BS * LH)))
    mon_body = ("GPU utilisation · tokens/s · time-to-first-token · cost per 1k tokens · "
                "quality drift → feeds the next data cycle")
    mon_l = probe.wrap(mon_body, XR - X0 - 48, BS)
    mon_h = 24 + 28 + 14 + len(mon_l) * BS * LH + 14
    fw = (1100 - 24) / 2
    fam_l = [probe.wrap(b, fw - 36, BS) for _, b, _, _ in fam]
    fam_h = max(18 + 28 * 1.25 + 4 + len(l) * BS * LH for l in fam_l) + 24
    note = ("Most companies need LLMOps from day one; DLOps only when they fine-tune, compress or self-host "
            "— but then it is not optional.")
    note_l = probe.wrap(note, 1100 - 60, 23)
    note_h = 30 + len(note_l) * 23 * LH + 10
    GAP = 40
    head = Svg(100, title, sub)
    total = (sum(r[1] for r in step_rows) + GAP * len(steps) + mon_h + 60 + 50 + 2 * fam_h + 24 + 30 + note_h + 80)
    H = int(head.top + total)
    s = Svg(H, title, sub)
    y = s.top
    centers = []
    for i, ((t, b, f, c), (wl, rh)) in enumerate(zip(steps, step_rows)):
        s.rect(X0, y, XR - X0, rh, f, c, rx=14)
        s.text(X0 + 24, y + rh / 2 + 10, t, 28, c if c != SLATE else NAVY, "700")
        ty = y + rh / 2 - (len(wl) * BS * LH) / 2 + BS
        s.lines(X0 + TW + 30, ty, wl, BS, NAVY)
        centers.append(y + rh / 2)
        s.arrow(X0 + 140, y + rh + 2, X0 + 140, y + rh + GAP - 4, c if i < len(steps) - 1 else ROSE, 4)
        y += rh + GAP
    # monitor box
    my = y
    s.rect(X0, my, XR - X0, mon_h, ROSE_L, ROSE, rx=14)
    s.text(X0 + 24, my + 24 + 26, "Monitor in production", 28, ROSE, "700")
    s.lines(X0 + 24, my + 24 + 28 + 14 + BS, mon_l, BS, NAVY)
    # feedback loop: monitor -> data, along the left margin
    fx = 70
    s.path_arrow([(X0, my + mon_h / 2), (fx, my + mon_h / 2), (fx, centers[0]), (X0 - 4, centers[0])],
                 ROSE, 4, dash="12 8")
    lx, lyc = fx - 0, (centers[0] + my + mon_h / 2) / 2
    s.rect(fx - 18, lyc - 70, 36, 140, BG, None, rx=6)
    s.parts.append(
        f'<text x="{lx}" y="{lyc}" font-family="{FONT}" font-size="22" font-weight="700" fill="{ROSE}" '
        f'text-anchor="middle" dominant-baseline="middle" transform="rotate(-90 {lx} {lyc})">feedback</text>')
    y = my + mon_h + 60
    # ops family
    s.text(50, y + 30, "Where DLOps sits in the ops family", 32, NAVY, "700")
    y += 50
    for i, ((t, b, f, c), bl) in enumerate(zip(fam, fam_l)):
        x = 50 + (i % 2) * (fw + 24)
        yy = y + (i // 2) * (fam_h + 24)
        s.rect(x, yy, fw, fam_h, f, c, rx=14)
        s.text(x + 18, yy + 18 + 28, t, 28, c if c != SLATE else NAVY, "700")
        s.lines(x + 18, yy + 18 + 28 * 1.25 + 4 + BS, bl, BS, SLATE)
    y += 2 * fam_h + 24 + 30
    s.rect(50, y, 1100, note_h, SOFT, rx=12)
    s.lines(600, y + 30 + 10, note_l, 23, NAVY, "500", "middle")
    s.save("07-dlops")


def main():
    sectors()
    green_brown()
    llmops()
    dlops()


if __name__ == "__main__":
    main()
