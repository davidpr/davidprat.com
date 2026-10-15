"""14 - Self-hosted models on Kubernetes, with the LangGraph agent service in the same cluster.

Compact: fonts 20-24 px. Flow: app -> ingress -> LangGraph pods -> AI gateway -> (llm-d -> vLLM) | external frontier API | MCP pods.
"""
from base import *

TS, BS, LH = 24, 20, 28
C = ROSE   # flow colour


def k8s_inference():
    s = Svg(1800, "Self-hosted models on Kubernetes",
            "Agents, AI gateway, llm-d, vLLM and KServe in one cluster")
    y0 = s.top

    def chip(x, y, w, t, fill="#FFFFFF", col=VIOLET):
        s.rect(x, y, w, 36, fill, col, rx=10, sw=1.5)
        s.text(x + w / 2, y + 25, t, BS, col, "700", "middle")

    # --- outside the cluster: apps, ingress, external models
    s.box(40, y0, 280, 100, "Web & mobile apps", ["customers, employees"], VIOLET_L, VIOLET, tsize=22, bsize=BS)
    s.box(390, y0, 360, 100, "Ingress / API gateway", ["auth, rate limit per user"], SOFT, SLATE, tsize=22, bsize=BS)
    s.box(820, y0, 330, 116, "Frontier model APIs", ["Azure OpenAI, Bedrock,", "Vertex AI"], TEAL_L, TEAL, tsize=22, bsize=BS)
    s.arrow(322, y0 + 50, 386, y0 + 50, C); s.badge(354, y0 + 24, "1", C)

    # --- cluster
    cy = y0 + 140
    CLUSTER_RECT = len(s.parts); s.rect(30, cy, 1110, 1150, "#FBFCFE", NAVY, rx=18, sw=2, dash="10 6")
    s.text(1120, cy + 36, "Kubernetes cluster", 22, NAVY, "700", "end")

    # agent service (CPU nodes)
    ay = cy + 60
    s.rect(60, ay, 600, 230, VIOLET_L, VIOLET, rx=14)
    s.text(80, ay + 36, "LangGraph agent service", TS, VIOLET, "700")
    s.text(80, ay + 64, "Deployment on CPU nodes · N replicas, autoscaled", BS, SLATE)
    for i, (t, w) in enumerate([("supervisor", 150), ("intake", 110), ("coverage", 130), ("fraud_check", 150)]):
        chip(80 + sum([150, 110, 130, 150][:i]) + i * 12, ay + 86, w, t)
    s.text(80, ay + 156, "same graph in every pod; conversation state in", BS, NAVY)
    s.text(80, ay + 184, "PostgreSQL (checkpoints), so any replica can resume", BS, NAVY)
    s.text(80, ay + 212, "no GPU needed: models are called over the network", BS, SLATE)
    s.arrow(480, y0 + 102, 480, ay - 4, C); s.badge(456, y0 + 150, "2", C)
    s.arrow(640, ay - 2, 640, y0 + 104, C, dash="7 5"); s.badge(664, y0 + 150, "8", C)

    # MCP server pods
    s.box(700, ay, 410, 230, "MCP server pods", ["Policy · Claims · Payments", "thin wrappers over the core APIs", "→ core systems (outside the cluster)"],
          AMBER_L, AMBER, tsize=TS, bsize=BS)

    # AI gateway
    gy = ay + 300
    s.rect(60, gy, 1050, 170, BLUE, None, rx=14)
    s.text(80, gy + 36, "AI gateway (Envoy AI Gateway / Agent Router · agentgateway · Kong)", 22, "#FFFFFF", "700")
    for i, t in enumerate(["LLM calls: route by model alias, token limits, budgets",
                           "fail over between self-hosted and external models",
                           "MCP calls: tool allow-lists, the user's OAuth token",
                           "guardrails, token & cost metrics, OpenTelemetry"]):
        s.text(84, gy + 74 + i * LH, "•  " + t, BS, "#FFFFFF")
    # agent -> gateway arrows (3 mini, 5 reasoning, 7 tools)
    for x, lab, word in [(150, "3", "mini"), (330, "5", "reasoning"), (520, "7", "tools")]:
        s.arrow(x, ay + 232, x, gy - 4, C); s.badge(x - 24, ay + 266, lab, C)
        s.text(x + 12, ay + 272, word, BS, C, "700")
    # gateway -> MCP pods (7)
    s.arrow(900, gy - 2, 900, ay + 234, C); s.badge(876, ay + 266, "7", C)
    # gateway -> external frontier (6): out of the right side, up the margin
    s.path_arrow([(1110, gy + 60), (1172, gy + 60), (1172, y0 + 50), (1154, y0 + 50)], C)
    s.badge(1172, gy - 120, "6", C)

    # llm-d scheduler
    ly = gy + 220
    s.rect(60, ly, 600, 160, AMBER_L, AMBER, rx=14)
    s.text(80, ly + 36, "llm-d scheduler (Endpoint Picker)", TS, AMBER, "700")
    s.text(80, ly + 64, "Gateway API Inference Extension · InferencePool", BS, SLATE)
    s.text(84, ly + 100, "•  picks the vLLM pod: KV-cache hits, queue, load", BS, NAVY)
    s.text(84, ly + 128, "•  sends prompts to prefill, tokens to decode", BS, NAVY)
    s.arrow(150, gy + 172, 150, ly - 4, C); s.badge(126, gy + 196, "4", C)

    # vLLM pods (GPU nodes)
    vy = ly + 200
    s.rect(60, vy, 600, 230, GREEN_L, GREEN, rx=14)
    s.text(80, vy + 36, "vLLM pods on GPU nodes", TS, GREEN, "700")
    s.text(80, vy + 64, "self-hosted models, e.g. the small classifier", BS, SLATE)
    s.box(80, vy + 84, 255, 80, "Prefill pods", ["read the prompt"], "#FFFFFF", GREEN, tsize=22, bsize=BS, center=True)
    s.box(385, vy + 84, 255, 80, "Decode pods", ["generate tokens"], "#FFFFFF", GREEN, tsize=22, bsize=BS, center=True)
    s.arrow(337, vy + 124, 381, vy + 124, GREEN)
    s.text(84, vy + 196, "•  batching, PagedAttention, KV cache offload", BS, NAVY)
    s.arrow(360, ly + 162, 360, vy - 4, C)

    # KServe (control plane, right)
    ky = ly
    kh = vy + 230 - ky
    s.rect(700, ky, 410, kh, VIOLET_L, VIOLET, rx=14, dash="9 6")
    s.text(720, ky + 38, "KServe control plane", TS, VIOLET, "700")
    s.text(720, ky + 66, "LLMInferenceService", BS, SLATE, "600")
    for i, t in enumerate(["deploys model, version, GPU spec",
                           "OpenAI-compatible endpoint",
                           "autoscaling (e.g. KEDA)",
                           "revisions and canaries",
                           "wires InferencePool + scheduler"]):
        s.text(724, ky + 110 + i * 40, "•  " + t, BS, NAVY)
    s.arrow(698, ly + 80, 664, ly + 80, VIOLET, dash="6 4")
    s.arrow(698, vy + 124, 664, vy + 124, VIOLET, dash="6 4")
    cend = vy + 230 + 70
    s.text(54, cend - 24, "GPU quotas with Kueue · Prometheus metrics · OpenTelemetry traces", BS, SLATE)
    s.parts[CLUSTER_RECT] = s.parts[CLUSTER_RECT].replace('height="1150"', f'height="{cend - cy}"')

    # --- steps
    sy = cend + 44
    steps = ["The app calls the agent API through the ingress / client API gateway.",
             "A LangGraph pod runs the supervisor; state lives in PostgreSQL.",
             "The supervisor asks the AI gateway for the alias mini.",
             "mini is self-hosted: llm-d picks a vLLM pod on the GPU nodes.",
             "A worker agent asks for the alias reasoning.",
             "reasoning is a frontier model: the gateway calls the external API.",
             "Tool calls go through the gateway to the MCP server pods.",
             "The reply streams back to the app."]
    for i, t in enumerate(steps):
        s.badge(56, sy + i * 34 - 6, str(i + 1), C, r=15)
        s.text(84, sy + i * 34, t, BS, NAVY)
    s.h = sy + len(steps) * 34 + 50
    s.parts[0] = f'<rect x="0" y="0" width="{s.w}" height="{s.h}" fill="{BG}"/>'
    for i, p in enumerate(s.parts):
        if AUTHOR in p:
            s.parts[i] = p.replace(f'y="{1800 - 22}"', f'y="{s.h - 22}"')
    s.save("14-k8s-self-hosted-inference")


def main():
    k8s_inference()


if __name__ == "__main__":
    main()
