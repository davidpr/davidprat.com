"""15 - Proof-of-concept architecture of the claims assistant (section 6)."""
from base import *

K8S = "#326CE5"


def poc_architecture():
    s = Svg(2600, "The same claims assistant as a proof of concept",
            "Enough to demonstrate both use cases with synthetic data and internal test users. Numbers = the path of a demo")
    y0 = s.top

    # people
    s.box(70, y0, 480, 110, "Test users", ["employees playing customers"], SOFT, SLATE, center=True)
    s.box(640, y0, 480, 110, "Claims handler", ["a colleague, for the demo"], SOFT, SLATE, center=True)

    # container apps frame
    y1 = y0 + 190
    s.rect(40, y1, 1120, 720, "#F8FAFC", K8S, rx=18, sw=3, dash="10 6")
    s.text(595, y1 + 38, "Azure Container Apps", 24, K8S, "700", "middle")
    s.text(595, y1 + 66, "one environment, scales to zero", 20, K8S, "600", "middle")
    s.arrow(310, y0 + 112, 310, y1 + 88, SLATE)
    s.badge(350, y0 + 150, "1", ROSE)
    s.arrow(880, y0 + 112, 880, y1 + 88, SLATE)
    s.badge(920, y0 + 150, "6", ROSE)

    ya = y1 + 90
    s.box(70, ya, 480, 130, "Chat web app", ["chat and photo upload,", "Entra ID sign-in"], BLUE_L, BLUE, center=True)
    s.box(640, ya, 480, 130, "Handler page", ["paused claims:", "approve or reject"], ROSE_L, ROSE, center=True)

    yb = ya + 210
    s.arrow(310, ya + 132, 310, yb - 2, SLATE)
    s.badge(350, ya + 170, "2", ROSE)
    s.arrow(880, ya + 132, 880, yb - 2, SLATE)
    s.text(900, ya + 178, "resume", 20, SLATE, "600")
    s.box(70, yb, 1050, 150, "Claims assistant API", [
        "FastAPI + LangGraph: the same graph as production",
        "(supervisor, intake, coverage, fraud_check, human_review)"], VIOLET_L, VIOLET, center=True)

    yc = yb + 230
    s.arrow(285, yb + 152, 285, yc - 2, SLATE)
    s.badge(325, yb + 190, "4", ROSE)
    s.arrow(905, yb + 152, 905, yc - 2, SLATE, dash="7 5")
    s.text(925, yb + 198, "traces", 20, SLATE, "600")
    s.box(70, yc, 430, 150, "MCP server (mock core)", ["get_policy, create_claim_draft", "over synthetic data"], TEAL_L, TEAL, center=True)
    s.box(690, yc, 430, 150, "Langfuse", ["traces, prompt versions,", "evaluation scores"], AMBER_L, AMBER, center=True)

    # outside the frame
    yd = y1 + 800
    s.arrow(560, yb + 152, 560, yd - 2, SLATE)
    s.badge(560, yc + 40, "3", ROSE)
    s.arrow(640, yb + 152, 640, yd - 2, SLATE)
    s.badge(640, yc + 110, "5", ROSE)
    s.box(40, yd, 540, 170, "AI gateway, light", ["non-production APIM or LiteLLM:", "aliases mini and reasoning,", "token limit, cost metrics"], "#E5E7EB", "#111827", center=True)
    s.box(620, yd, 500, 170, "PostgreSQL, one server", ["checkpoints, claim drafts,", "synthetic policies,", "pgvector for policy wordings"], GREEN_L, GREEN, center=True)

    ye = yd + 250
    s.arrow(310, yd + 172, 310, ye - 2, SLATE)
    s.box(40, ye, 540, 150, "Azure OpenAI, one EU region", ["large, mini and embedding models,", "default content filters"], BLUE_L, BLUE, center=True)
    s.box(620, ye, 500, 150, "Blob Storage", ["photos and documents", "of the test claims"], SOFT, SLATE, center=True)
    # API -> Blob along the right margin
    s.path_arrow([(1122, yb + 75), (1142, yb + 75), (1142, ye + 75), (1124, ye + 75)], SLATE)

    # steps
    yf = ye + 200
    steps = [
        ("1", "A test user signs in with Entra ID and chats; photos go to Blob Storage."),
        ("2", "The same LangGraph graph as production runs in one container."),
        ("3", "Every model call goes through the light gateway, by alias."),
        ("4", "The agents call the same MCP tools, served by a mock of the core."),
        ("5", "Coverage answers come from pgvector; the graph state is checkpointed."),
        ("6", "A high-value claim pauses; a colleague approves it on the handler page."),
    ]
    s.rect(40, yf, 1120, 60 + len(steps) * 50, SOFT, None)
    s.text(70, yf + 42, "The path of a demo", 26, NAVY, "700")
    for i, (n, t) in enumerate(steps):
        yy = yf + 86 + i * 50
        s.badge(88, yy - 7, n, ROSE)
        s.text(122, yy, t, 22, NAVY)

    # kept / left out
    yg = yf + 60 + len(steps) * 50 + 40
    kept = ["Gateway URL with model aliases", "MCP tool contract", "Checkpoints and human approval",
            "Traces and an evaluation set", "Entra ID sign-in, EU region"]
    left = ["Front Door, WAF, second region", "Semantic cache, prompt shields", "Event Grid extraction job",
            "Service Bus and the real core APIs", "AI Search, private endpoints", "Mobile app, push notifications",
            "CI/CD evaluation gate"]
    hh = 80 + max(len(kept), len(left)) * 40
    s.rect(40, yg, 540, hh, GREEN_L, GREEN)
    s.text(66, yg + 44, "Kept from day one", 26, GREEN, "700")
    for i, t in enumerate(kept):
        s.text(66, yg + 90 + i * 40, "✓  " + t, 22, NAVY)
    s.rect(620, yg, 540, hh, "#F3F4F6", "#6B7280", dash="8 6")
    s.text(646, yg + 44, "Left for production", 26, "#374151", "700")
    for i, t in enumerate(left):
        s.text(646, yg + 90 + i * 40, "+  " + t, 22, NAVY)

    old_h = s.h
    s.h = yg + hh + 70
    s.parts[0] = f'<rect x="0" y="0" width="{s.w}" height="{s.h}" fill="{BG}"/>'
    for i, p in enumerate(s.parts):
        if AUTHOR in p:
            s.parts[i] = p.replace(f'y="{old_h - 22}"', f'y="{s.h - 22}"')
    s.save("15-poc-architecture")


def poc_architecture_wide():
    """Compact landscape version for the reading copy (images/wide-v1)."""
    H = 1170
    s = Svg(H, "The same claims assistant as a proof of concept",
            "Enough to demonstrate both use cases with synthetic data and internal test users. Numbers = the path of a demo", w=1800)
    y0 = s.top
    s.box(70, y0, 480, 80, "Test users", ["employees playing customers"], SOFT, SLATE, tsize=24, bsize=20, center=True)
    s.box(640, y0, 480, 80, "Claims handler", ["a colleague, for the demo"], SOFT, SLATE, tsize=24, bsize=20, center=True)

    y1 = y0 + 140
    s.rect(40, y1, 1120, 560, "#F8FAFC", K8S, rx=18, sw=3, dash="10 6")
    s.text(595, y1 + 32, "Azure Container Apps", 24, K8S, "700", "middle")
    s.text(595, y1 + 58, "one environment, scales to zero", 20, K8S, "600", "middle")
    ya = y1 + 70
    s.arrow(310, y0 + 82, 310, ya - 2, SLATE)
    s.badge(350, y0 + 112, "1", ROSE)
    s.arrow(880, y0 + 82, 880, ya - 2, SLATE)
    s.badge(920, y0 + 112, "6", ROSE)
    s.box(70, ya, 480, 100, "Chat web app", ["chat and photo upload, Entra ID sign-in"], BLUE_L, BLUE, tsize=24, bsize=20, center=True)
    s.box(640, ya, 480, 100, "Handler page", ["paused claims: approve or reject"], ROSE_L, ROSE, tsize=24, bsize=20, center=True)

    yb = ya + 160
    s.arrow(310, ya + 102, 310, yb - 2, SLATE)
    s.badge(350, ya + 130, "2", ROSE)
    s.arrow(880, ya + 102, 880, yb - 2, SLATE)
    s.text(900, ya + 138, "resume", 20, SLATE, "600")
    s.box(70, yb, 1050, 110, "Claims assistant API", [
        "FastAPI + LangGraph: the same graph as production"], VIOLET_L, VIOLET, tsize=24, bsize=20, center=True)

    yc = yb + 170
    s.arrow(370, yb + 112, 370, yc - 2, SLATE)
    s.badge(410, yb + 140, "4", ROSE)
    s.arrow(890, yb + 112, 890, yc - 2, SLATE, dash="7 5")
    s.text(910, yb + 148, "traces", 20, SLATE, "600")
    s.box(170, yc, 400, 110, "MCP server (mock core)", ["same tools, synthetic data"], TEAL_L, TEAL, tsize=24, bsize=20, center=True)
    s.box(700, yc, 380, 110, "Langfuse", ["traces, prompts, eval scores"], AMBER_L, AMBER, tsize=24, bsize=20, center=True)

    yd = y1 + 630
    s.arrow(110, yb + 112, 110, yd - 2, SLATE)
    s.badge(110, yc + 55, "3", ROSE)
    s.arrow(640, yb + 112, 640, yd - 2, SLATE)
    s.badge(640, yc + 55, "5", ROSE)
    s.arrow(1105, yb + 112, 1105, yd - 2, SLATE)
    s.box(40, yd, 270, 170, "AI gateway, light", ["APIM non-prod", "or LiteLLM;", "model aliases"], "#E5E7EB", "#111827", tsize=24, bsize=20, center=True)
    s.arrow(312, yd + 85, 348, yd + 85, SLATE)
    s.box(350, yd, 240, 170, "Azure OpenAI", ["one EU region:", "large, mini,", "embeddings"], BLUE_L, BLUE, tsize=24, bsize=20, center=True)
    s.box(620, yd, 270, 170, "PostgreSQL", ["checkpoints, drafts,", "synthetic policies,", "pgvector"], GREEN_L, GREEN, tsize=24, bsize=20, center=True)
    s.box(910, yd, 250, 170, "Blob Storage", ["test photos", "and documents"], SOFT, SLATE, tsize=24, bsize=20, center=True)

    # right column
    X, WW = 1200, 560
    steps = ["Sign in with Entra ID, chat, upload photos", "Same LangGraph graph, in one container",
             "Model calls go through the light gateway", "Same MCP tools, on a mock of the core",
             "pgvector retrieval, checkpointed state", "High-value claim pauses for approval"]
    yy = y0
    s.rect(X, yy, WW, 60 + len(steps) * 40, SOFT, None)
    s.text(X + 24, yy + 38, "The path of a demo", 24, NAVY, "700")
    for i, t in enumerate(steps):
        s.badge(X + 40, yy + 76 + i * 40, str(i + 1), ROSE, r=15)
        s.text(X + 68, yy + 83 + i * 40, t, 20, NAVY)
    yy += 60 + len(steps) * 40 + 20
    kept = ["Gateway URL with model aliases", "MCP tool contract", "Checkpoints and human approval",
            "Traces and an evaluation set", "Entra ID sign-in, EU region"]
    left = ["Front Door, WAF, second region", "Semantic cache, prompt shields", "Event Grid extraction job",
            "Service Bus and the real core APIs", "AI Search, private endpoints", "Mobile app, push notifications",
            "CI/CD evaluation gate"]
    hk = 62 + len(kept) * 34
    s.rect(X, yy, WW, hk, GREEN_L, GREEN)
    s.text(X + 24, yy + 38, "Kept from day one", 24, GREEN, "700")
    for i, t in enumerate(kept):
        s.text(X + 24, yy + 76 + i * 34, "✓  " + t, 20, NAVY)
    yy += hk + 20
    hl = 62 + len(left) * 34
    s.rect(X, yy, WW, hl, "#F3F4F6", "#6B7280", dash="8 6")
    s.text(X + 24, yy + 38, "Left for production", 24, "#374151", "700")
    for i, t in enumerate(left):
        s.text(X + 24, yy + 76 + i * 34, "+  " + t, 20, NAVY)

    end = max(yy + hl, yd + 170) + 60
    s.h = end
    s.parts[0] = f'<rect x="0" y="0" width="{s.w}" height="{s.h}" fill="{BG}"/>'
    for i, p in enumerate(s.parts):
        if AUTHOR in p:
            s.parts[i] = p.replace(f'y="{H - 22}"', f'y="{s.h - 22}"')
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" width="{s.w}" height="{s.h}" '
           f'viewBox="0 0 {s.w} {s.h}">' + "".join(s.parts) + "</svg>")
    wide = os.path.join(HERE, "..", "wide-v1")
    os.makedirs(os.path.join(wide, "svg"), exist_ok=True)
    os.makedirs(os.path.join(wide, "png"), exist_ok=True)
    p_svg = os.path.join(wide, "svg", "15-poc-architecture.svg")
    p_png = os.path.join(wide, "png", "15-poc-architecture.png")
    with open(p_svg, "w") as f:
        f.write(svg)
    subprocess.run(["rsvg-convert", "-w", str(s.w), "-o", p_png, p_svg], check=True)
    print("wrote", p_png)


def main():
    poc_architecture()
    poc_architecture_wide()


if __name__ == "__main__":
    main()
