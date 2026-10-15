"""LinkedIn-readable versions of the worked-example diagrams (08a, 08b, 09).

Run from this folder:  python3 d_c.py
"""
from xml.sax.saxutils import escape

from base import *

GREY_FILL, GREY_STROKE, GREY_T, GREY_B = "#FFFFFF", "#E2E8F0", "#B6C2D1", "#CBD5E1"


def nbadge(s, x, y, label, color):
    """Round badge for one number, rounded pill for combined numbers such as '7 · 12'."""
    if len(label) <= 2:
        s.badge(x, y, label, color)
        return
    w = len(label) * 20 * 0.55 + 22
    s.rect(x - w / 2, y - 19, w, 38, color, None, rx=19)
    s.text(x, y + 7, label, 20, "#FFFFFF", "700", "middle")


def path(s, pts, color, sw=3.5, dash=None, both=False):
    """Orthogonal arrow; optional arrowhead at the start too."""
    s.path_arrow(pts, color, sw, dash)
    if both:
        (x1, y1), (x2, y2) = pts[1], pts[0]
        s.path_arrow([(x1, y1), (x2, y2)], color, sw, dash)


# ---------------------------------------------------------------------------
# 08a / 08b: architecture with the numbered path of one use case
# ---------------------------------------------------------------------------
STEPS_1 = [
    "App sends the description + Entra token; the Front Door WAF filters it.",
    "Client API gateway validates the JWT and applies the customer's rate limit.",
    "APIM forwards to the claims assistant API; the LangGraph supervisor starts.",
    "In parallel, the app uploads photos and documents to Blob via SAS URL.",
    "Event Grid triggers the AI extraction job.",
    "Document Intelligence reads estimate and police report; Content Understanding, the photos.",
    "The supervisor asks the AI gateway to classify the intent: 'report a claim'.",
    "AI gateway enforces the token limit; mini model, EU-region failover if needed.",
    "The intake agent calls tools via the MCP gateway, with the customer's OAuth token.",
    "Policy and Claims MCP servers run get_policy and create_claim_draft on core APIs.",
    "The coverage agent retrieves this customer's collision clauses from AI Search.",
    "The agent asks the AI gateway for the reply; content safety and prompt shields check.",
    "The large model drafts the reply with citations; tokens and cost recorded.",
    "Fraud agent flags high value: review task on Service Bus, graph pauses (checkpoint).",
    "Service Bus writes the claim draft to the core claims system.",
    "The app streams the reply: claim registered, handler reviewing, with reference.",
    "Hours later, a claims handler approves the claim in the workbench.",
    "The decision is sent to Notification Hubs.",
    "The customer receives the decision as a push notification.",
]
STEPS_2 = [
    "Website sends the question + Entra token; the Front Door WAF filters it.",
    "Client API gateway validates the JWT and applies the customer's rate limit.",
    "APIM forwards to the claims assistant API; the LangGraph supervisor starts.",
    "The supervisor asks the AI gateway to classify the intent: 'coverage question'.",
    "AI gateway enforces the token limit; mini model, EU-region failover if needed.",
    "The coverage agent runs a hybrid search, filtered to this customer's policy.",
    "The agent asks the AI gateway for the answer, passing the retrieved clauses.",
    "Semantic cache in Azure Managed Redis: a miss, the question is personalised.",
    "The large model answers with clause citations; content safety checks, tokens metered.",
    "The website streams the answer with clause references and a hand-off to a person.",
]


def claims_use_case(case):
    claim = case == 1
    C = ROSE if claim else GREEN
    if claim:
        title = "Use case 1: a customer reports a car accident from the mobile app"
        active = {"mobile", "entra", "fd", "client", "mcpgw", "aigw", "api", "mcp", "job", "intake", "coverage",
                  "fraud", "blob", "docint", "cu", "aoai", "search", "pg", "nh", "sb", "core", "wb"}
        steps = STEPS_1
    else:
        title = "Use case 2: a customer asks on the website whether a loss is covered"
        active = {"web", "entra", "fd", "client", "aigw", "api", "coverage", "aoai", "redis", "search", "pg"}
        steps = STEPS_2
    sub = "AI claims assistant for an insurer on Azure · numbered path of the request · grey = not used"

    # vertical layout ----------------------------------------------------------
    probe = Svg(100, title, sub)
    T = probe.top
    yA = T                      # clients + Front Door
    yA2 = yA + 160              # Entra (and the return-path corridor)
    yR = yA2 + 45               # y of the horizontal return segments (16 / 10)
    y3 = yA2 + 160              # API Management container
    sub3 = y3 + 92              # top of APIM sub-boxes
    h3 = 200                    # height of APIM sub-boxes
    y4 = sub3 + h3 + 20 + 70    # Container Apps container
    h4 = 300                    # height of the claims assistant API box
    y5 = y4 + 20 + h4 + 20 + 80  # data row
    h5 = 160
    y6 = y5 + h5 + 70           # integration row
    h6 = 190
    y7 = y6 + h6 + 80           # documents & photos row
    h7 = 236
    y8 = y7 + h7 + 50           # cross-cutting strip
    h8 = 250
    y9 = y8 + h8 + 30           # steps panel
    step_lh = 38
    h9 = 95 + len(steps) * step_lh + 20
    if not claim:
        h9 += 155
    H = y9 + h9 + 70
    s = Svg(H, title, sub)

    def comp(key, x, y, w, h, t, body=None, fill=SOFT, stroke=SLATE, tsize=26, **kw):
        if key in active:
            s.box(x, y, w, h, t, body, fill, stroke, tsize=tsize, bsize=21, **kw)
        else:
            s.box(x, y, w, h, t, body, GREY_FILL, GREY_STROKE, tcolor=GREY_T, bcolor=GREY_B, tsize=tsize,
                  bsize=21, **kw)

    # row A: clients + edge -------------------------------------------------------
    comp("mobile", 80, yA, 220, 130, "Mobile app", ["iOS / Android · photos"], VIOLET_L, VIOLET)
    comp("fd", 400, yA, 360, 130, "Azure Front Door + WAF", ["global entry · TLS · WAF · DDoS"], SOFT, SLATE)
    comp("web", 860, yA, 280, 130, "Web app", ["React SPA"], VIOLET_L, VIOLET)
    comp("entra", 80, yA2, 250, 140, "Microsoft Entra External ID", ["sign-in · MFA · OIDC"], SOFT, SLATE, tsize=24)

    # API Management -------------------------------------------------------------
    s.rect(80, y3, 1060, h3 + 112, BLUE, rx=16)
    s.text(700, y3 + 42, "Azure API Management", 28, "#FFFFFF", "700")
    s.text(700, y3 + 74, "one gateway: app, AI and MCP traffic", 21, "#DBEAFE")
    comp("mcpgw", 100, sub3, 300, h3, "MCP gateway", ["core APIs as MCP tools", "OAuth"], "#FFFFFF", BLUE)
    comp("client", 420, sub3, 260, h3, "Client API gateway", ["validate-jwt", "rate limit per customer"],
         "#FFFFFF", BLUE)
    comp("aigw", 700, sub3, 420, h3, "AI gateway policies", ["token limits & metrics", "semantic cache (generic FAQs)",
         "failover across 2 EU regions", "content safety, prompt shields"], "#FFFFFF", BLUE)

    # Container Apps -------------------------------------------------------------
    s.rect(80, y4, 780, h4 + 40, VIOLET_L, VIOLET, rx=16)
    comp("mcp", 100, y4 + 20, 300, 160, "MCP servers", ["Policy · Claims · Payments", "wrap the core APIs"],
         "#FFFFFF", VIOLET)
    s.lines(118, y4 + 225, ["Azure Container Apps"], 24, VIOLET, "700")
    s.lines(118, y4 + 258, ["private VNet,", "scale to zero (KEDA)"], 21, SLATE)
    comp("api", 420, y4 + 20, 420, h4, "Claims assistant API", ["Python · LangGraph supervisor"], "#FFFFFF", VIOLET)
    for i, (k, t) in enumerate([("intake", "Intake agent"), ("coverage", "Coverage agent"),
                                ("fraud", "Fraud-signals agent")]):
        yy = y4 + 20 + 116 + i * 58
        on = k in active
        s.rect(440, yy, 380, 48, VIOLET_L if on else GREY_FILL, VIOLET if on else GREY_STROKE, rx=10)
        s.text(630, yy + 32, t, 22, VIOLET if on else GREY_T, "700", "middle")
    comp("aoai", 880, y4 + 20, 260, 250, "Azure OpenAI (AI Foundry)",
         ["EU Data Zone, 2 regions", "large + mini models, embeddings"], TEAL_L, TEAL)

    # data row -------------------------------------------------------------------
    comp("pg", 100, y5, 300, h5, "PostgreSQL Flexible Server", ["checkpoints, claim drafts"], TEAL_L, TEAL)
    comp("search", 420, y5, 300, h5, "Azure AI Search", ["hybrid search, filtered per customer"], TEAL_L, TEAL)
    comp("redis", 880, y5, 260, h5, "Azure Managed Redis", ["semantic cache store"], TEAL_L, TEAL)

    # integration row ------------------------------------------------------------
    bw, gx = 222, (1060 - 4 * 222) / 3
    xs6 = [80 + i * (bw + gx) for i in range(4)]
    comp("nh", xs6[0], y6, bw, h6, "Notification Hubs", ["push to the phone"], AMBER_L, AMBER, tsize=24)
    comp("wb", xs6[1], y6, bw, h6, "Claims handler workbench", ["human approval"], AMBER_L, AMBER, tsize=24)
    comp("sb", xs6[2], y6, bw, h6, "Azure Service Bus", ["async writes, review tasks"], AMBER_L, AMBER, tsize=24)
    comp("core", xs6[3], y6, bw, h6, "Core insurance systems", ["system of record"], AMBER_L, AMBER, tsize=24)

    # documents & photos row -----------------------------------------------------
    s.text(80, y7 - 22, "Documents & photos, in parallel (steps 4-6)", 24, SLATE if claim else GREY_T, "700")
    comp("blob", 80, y7, 240, h7, "Blob Storage + Event Grid", ["upload via short-lived SAS URL", "event triggers the job"],
         TEAL_L, TEAL, tsize=24)
    comp("job", 410, y7, 240, h7, "AI extraction job", ["Container Apps job, event-driven"], VIOLET_L, VIOLET,
         tsize=24)
    hh = (h7 - 12) / 2
    comp("docint", 720, y7, 420, hh, "Azure Document Intelligence", ["estimates & police reports"], TEAL_L, TEAL,
         tsize=24)
    comp("cu", 720, y7 + hh + 12, 420, hh, "Azure Content Understanding", ["damage photos (LLM-powered)"], TEAL_L, TEAL,
         tsize=24)

    # numbered path --------------------------------------------------------------
    gmid = (sub3 + h3 + y4 + 20) / 2          # middle of the APIM -> Container Apps gap
    dmid = (y4 + 20 + h4 + y5) / 2            # middle of the Container Apps -> data gap
    api_top, api_bot = y4 + 20, y4 + 20 + h4
    s_mid = (y6 + h6 / 2)
    if claim:
        # 1 mobile -> Front Door
        s.arrow(300, yA + 60, 398, yA + 60, C, 3.5); nbadge(s, 335, yA + 60, "1", C)
        # 2 Front Door -> client gateway
        s.arrow(560, yA + 130, 560, sub3 - 2, C, 3.5); nbadge(s, 560, yA2 + 105, "2", C)
        # 3 client gateway -> API
        s.arrow(560, sub3 + h3, 560, api_top - 2, C, 3.5); nbadge(s, 560, gmid, "3", C)
        # 4 mobile -> Blob (left rail, dashed)
        path(s, [(80, yA + 32), (26, yA + 32), (26, y7 + 125), (78, y7 + 125)], C, 3.5, dash="9 6")
        nbadge(s, 26, y7 - 60, "4", C)
        # 5 Blob/Event Grid -> extraction job
        s.arrow(320, y7 + 125, 408, y7 + 125, C, 3.5); nbadge(s, 352, y7 + 125, "5", C)
        # 6 extraction job -> Document Intelligence + Content Understanding
        path(s, [(650, y7 + 125), (685, y7 + 125), (685, y7 + hh / 2), (718, y7 + hh / 2)], C, 3.5)
        path(s, [(685, y7 + 125), (685, y7 + hh + 12 + hh / 2), (718, y7 + hh + 12 + hh / 2)], C, 3.5)
        nbadge(s, 685, y7 + 125, "6", C)
        # 7 + 12 API -> AI gateway ; 8 + 13 AI gateway -> Azure OpenAI
        s.arrow(780, api_top, 780, sub3 + h3 + 2, C, 3.5); nbadge(s, 780, gmid, "7 · 12", C)
        s.arrow(1000, sub3 + h3, 1000, y4 + 18, C, 3.5); nbadge(s, 1000, gmid, "8 · 13", C)
        # 9 API -> MCP gateway ; 10 MCP gateway -> MCP servers
        path(s, [(440, api_top), (440, gmid), (370, gmid), (370, sub3 + h3 + 2)], C, 3.5)
        nbadge(s, 408, gmid, "9", C)
        s.arrow(200, sub3 + h3, 200, y4 + 18, C, 3.5); nbadge(s, 200, gmid, "10", C)
        # 11 API -> AI Search
        s.arrow(600, api_bot, 600, y5 - 2, C, 3.5); nbadge(s, 600, dmid, "11", C)
        # checkpoint API -> PostgreSQL
        path(s, [(450, api_bot), (450, dmid), (250, dmid), (250, y5 - 2)], SLATE, 3, dash="7 5")
        s.text(262, dmid - 12, "checkpoint", 20, SLATE, "600")
        # 14 API (fraud agent via Claims MCP) -> Service Bus
        s.arrow(800, api_bot, 800, y6 - 2, C, 3.5); nbadge(s, 800, y5 + h5 / 2, "14", C)
        # 15 Service Bus -> core ; 17 Service Bus -> workbench ; 18 workbench -> Notification Hubs
        s.arrow(xs6[2] + bw, s_mid, xs6[3] - 2, s_mid, C, 3.5); nbadge(s, xs6[2] + bw + 22, s_mid - 34, "15", C)
        s.arrow(xs6[2], s_mid, xs6[1] + bw + 2, s_mid, C, 3.5); nbadge(s, xs6[2] - 22, s_mid - 34, "17", C)
        s.arrow(xs6[1], s_mid, xs6[0] + bw + 2, s_mid, C, 3.5); nbadge(s, xs6[1] - 22, s_mid - 34, "18", C)
        # 16 streamed reply: client gateway -> mobile (dashed)
        path(s, [(440, sub3), (440, yR), (350, yR), (350, yA + 105), (302, yA + 105)], C, 3.5, dash="9 6")
        nbadge(s, 395, yR, "16", C)
        # 19 Notification Hubs -> mobile (left rail, inner lane)
        path(s, [(80, s_mid), (54, s_mid), (54, yA + 95), (78, yA + 95)], C, 3.5)
        nbadge(s, 54, (y5 + y6) / 2 - 10, "19", C)
    else:
        # 1 web -> Front Door
        s.arrow(860, yA + 60, 762, yA + 60, C, 3.5); nbadge(s, 825, yA + 60, "1", C)
        s.arrow(560, yA + 130, 560, sub3 - 2, C, 3.5); nbadge(s, 560, yA2 + 105, "2", C)
        s.arrow(560, sub3 + h3, 560, api_top - 2, C, 3.5); nbadge(s, 560, gmid, "3", C)
        s.arrow(780, api_top, 780, sub3 + h3 + 2, C, 3.5); nbadge(s, 780, gmid, "4 · 7", C)
        s.arrow(1000, sub3 + h3, 1000, y4 + 18, C, 3.5); nbadge(s, 1000, gmid, "5 · 9", C)
        s.arrow(600, api_bot, 600, y5 - 2, C, 3.5); nbadge(s, 600, dmid, "6", C)
        # 8 AI gateway <-> Managed Redis (right rail)
        ry = sub3 + 150
        path(s, [(1120, ry), (1172, ry), (1172, y5 + h5 / 2), (1142, y5 + h5 / 2)], C, 3.5, both=True)
        nbadge(s, 1172, (y4 + y5) / 2 + 60, "8", C)
        path(s, [(450, api_bot), (450, dmid), (250, dmid), (250, y5 - 2)], SLATE, 3, dash="7 5")
        s.text(262, dmid - 12, "state", 20, SLATE, "600")
        # 10 answer streamed back to the website (dashed)
        path(s, [(660, sub3), (660, yR), (1000, yR), (1000, yA + 132)], C, 3.5, dash="9 6")
        nbadge(s, 830, yR, "10", C)

    # cross-cutting strip --------------------------------------------------------
    s.rect(40, y8, 1120, h8, ROSE_L, ROSE, rx=16)
    s.text(70, y8 + 44, "Cross-cutting (both journeys)", 26, ROSE, "700")
    items = ["Application Insights", "Langfuse (self-hosted)", "Managed identities + Key Vault",
             "Private endpoints", "Microsoft Purview", "AI Foundry evaluations", "GitHub Actions eval gate"]
    px, py = 70, y8 + 66
    for it in items:
        w = len(it) * 21 * 0.56 + 26
        if px + w > 1130:
            px, py = 70, py + 50
        s.pill(px, py, it, "#FFFFFF", ROSE, 21)
        px += w + 12
    s.text(70, y8 + h8 - 22, "EU regions only · OpenTelemetry spans on every hop", 21, SLATE, "500")

    # steps panel ----------------------------------------------------------------
    s.rect(40, y9, 1120, h9, SOFT, rx=16)
    s.text(70, y9 + 50, "The journey, step by step", 30, NAVY, "700")
    yy = y9 + 105
    for i, st in enumerate(steps):
        s.badge(90, yy - 7, str(i + 1), C)
        s.text(124, yy, st, 22, NAVY)
        yy += step_lh
    if not claim:
        cy = yy + 5
        s.rect(60, cy, 1080, 130, "#FFFFFF", GREEN, rx=14, sw=2, dash="7 5")
        s.text(84, cy + 40, "What if the question were generic?", 24, GREEN, "700")
        s.lines(84, cy + 76, ["“How do I report a claim?” is answered from the Redis cache at step 8:",
                              "no model call. Personalised questions always miss the cache."], 22, NAVY)
    s.save("08a-use-case-1-report-a-claim" if claim else "08b-use-case-2-coverage-question")
    return H


# ---------------------------------------------------------------------------
# 09: sequence diagram, one block per use case with only the lanes it uses
# ---------------------------------------------------------------------------
def _seq_block(s, y, heading, color, lanes, msgs, note=None):
    n = len(lanes)
    x0, x1 = 110, 1090
    step = (x1 - x0) / (n - 1)
    xs = [x0 + i * step for i in range(n)]
    s.text(40, y, heading, 28, color, "700")
    y += 26
    hb = 104
    rows = len(msgs)
    note_h = 110 if note else 0
    end = y + hb + 30 + note_h + rows * 82 + 10
    for (lines, fill), x in zip(lanes, xs):
        s.rect(x - step / 2 + 3, y, step - 6, hb, fill, None, rx=10)
        ty = y + hb / 2 - (len(lines) - 1) * 13 + 7
        s.lines(x, ty, lines, 20, NAVY, "700", "middle", 1.3)
        s.parts.append(f'<line x1="{x}" y1="{y + hb + 2}" x2="{x}" y2="{end}" stroke="#CBD5E1" '
                       f'stroke-width="2" stroke-dasharray="6 6"/>')
    y += hb + 30
    if note:
        s.rect(40, y, 1120, 96, "#FFFFFF", color, rx=10, sw=2, dash="6 5")
        s.lines(60, y + 36, note, 21, color, "600")
        y += note_h
    for a, b, tag, label, ret in msgs:
        y += 82
        xa, xb = xs[a], xs[b]
        d = 1 if xb > xa else -1
        s.arrow(xa + d * 4, y, xb - d * 6, y, color, 3.5, dash="9 6" if ret else None)
        lw = len(label) * 21 * 0.53
        cx = (xa + xb) / 2
        cx = min(max(cx, 40 + lw / 2 + 8), 1160 - lw / 2 - 8)
        s.rect(cx - lw / 2 - 8, y - 52, lw + 16, 30, "#FFFFFF", None, rx=4)
        s.text(cx, y - 30, label, 21, NAVY, "500", "middle")
        nbadge(s, xa + d * 28, y, tag, color)
    return end


def interaction_flow():
    lanes1 = [(["Mobile", "app"], VIOLET_L), (["Front Door", "+ WAF"], SOFT), (["API", "Management"], BLUE_L),
              (["Claims", "assistant", "(LangGraph)"], VIOLET_L), (["Azure", "OpenAI"], TEAL_L),
              (["AI", "Search"], TEAL_L), (["MCP", "servers", "→ core"], AMBER_L),
              (["Service", "Bus →", "handler"], AMBER_L)]
    msgs1 = [(0, 1, "1", "POST /claims/assist + Entra token", False),
             (1, 2, "2", "WAF passed → route", False),
             (2, 3, "3", "validate-jwt · rate limit per customer", False),
             (3, 2, "7", "classify intent (mini model)", False),
             (2, 4, "8", "token limit · EU-region failover", False),
             (3, 6, "9", "get_policy · create_claim_draft via MCP gateway (10)", False),
             (3, 5, "11", "coverage clauses for ‘collision’", False),
             (3, 2, "12", "generate the reply with citations", False),
             (2, 4, "13", "content safety on input & output", False),
             (3, 7, "14", "high value → review task (via Claims MCP)", False),
             (7, 6, "15", "claim draft → core claims system", False),
             (3, 0, "16", "streamed reply: claim registered, under review", True),
             (7, 0, "19", "handler decision (17) → Notification Hubs (18) → push", True)]
    note1 = ["Steps 4-6 run in parallel: photos and documents go to Blob Storage (SAS URL), Event Grid",
             "triggers the extraction job: Document Intelligence (documents), Content Understanding (photos)."]
    lanes2 = [(["Web", "app"], VIOLET_L), (["Front Door", "+ WAF"], SOFT), (["API", "Management"], BLUE_L),
              (["Claims", "assistant", "(LangGraph)"], VIOLET_L), (["Azure", "OpenAI"], TEAL_L),
              (["AI", "Search"], TEAL_L), (["Managed", "Redis", "(cache)"], TEAL_L)]
    msgs2 = [(0, 1, "1", "question + Entra token", False),
             (1, 2, "2", "WAF passed → route", False),
             (2, 3, "3", "validate-jwt · rate limit", False),
             (3, 2, "4", "classify intent (mini model)", False),
             (2, 4, "5", "token limit · EU-region failover", False),
             (3, 5, "6", "policy wording, filtered to this customer", False),
             (3, 2, "7", "answer with clause citations", False),
             (2, 6, "8", "semantic cache lookup: miss (personalised)", False),
             (2, 4, "9", "token limit · content safety", False),
             (3, 0, "10", "answer + clause references + ‘talk to a person’", True)]
    title = "How one interaction travels through the architecture"
    sub = "The two use cases as sequences; each step has the same number as in its architecture diagram"
    probe = Svg(100, title, sub)
    # measure: block height = 26 + 104 + 30 + note + rows * 82 + 10
    h1 = 26 + 104 + 30 + 110 + len(msgs1) * 82 + 10
    h2 = 26 + 104 + 30 + len(msgs2) * 82 + 10
    H = probe.top + 30 + h1 + 90 + h2 + 60 + 150 + 70
    s = Svg(H, title, sub)
    y = s.top + 30
    end1 = _seq_block(s, y, "Use case 1 (mobile): “I had a car accident”, with photos", ROSE, lanes1, msgs1,
                      note1)
    y = end1 + 90
    s.parts.append(f'<line x1="40" y1="{end1 + 35}" x2="1160" y2="{end1 + 35}" stroke="#E2E8F0" stroke-width="3"/>')
    end2 = _seq_block(s, y, "Use case 2 (web): “Is water damage from my neighbour covered?”", GREEN, lanes2,
                      msgs2)
    ty = end2 + 50
    s.rect(40, ty, 1120, 140, ROSE_L, ROSE, rx=14)
    s.text(70, ty + 50, "Telemetry: every hop emits OpenTelemetry spans", 26, ROSE, "700")
    s.text(70, ty + 95, "latency · tokens · cost · prompt version · eval score  →  App Insights, Langfuse", 22, NAVY)
    s.save("09-interaction-sequence")
    return H


def main():
    for f, name in [(lambda: claims_use_case(1), "08a"), (lambda: claims_use_case(2), "08b"),
                    (interaction_flow, "09")]:
        print(name, "height", f())


if __name__ == "__main__":
    main()
