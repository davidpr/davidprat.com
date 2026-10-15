"""14b - Self-hosted AI on Kubernetes with A2A: a concierge agent, specialist agents as separate services, kagent."""
from base import *
from d_f import K8S, C, INK, INK2, CORAL, BS, k8s_icon, gpu_icon, pod, ns


def k8s_a2a():
    s = Svg(2800, "Self-hosted AI on Kubernetes, with A2A between agents",
            "The same cluster, but every agent is its own service: a concierge agent delegates to specialists over A2A")
    y0 = s.top
    # ---------- outside the cluster
    s.box(40, y0, 250, 100, "Web & mobile apps", ["customers"], VIOLET_L, VIOLET, tsize=22, bsize=BS)
    s.box(310, y0, 210, 100, "Load balancer", ["cloud LB + WAF"], SOFT, SLATE, tsize=22, bsize=BS)
    s.box(540, y0, 230, 100, "Partner agents", ["A2A · other firms"], VIOLET_L, VIOLET, tsize=22, bsize=BS)
    s.box(800, y0, 360, 100, "Frontier model APIs", ["Azure OpenAI · Bedrock"], TEAL_L, TEAL, tsize=22, bsize=BS)
    s.arrow(292, y0 + 50, 306, y0 + 50, C)

    # ---------- cluster frame
    cy = y0 + 150
    frame = len(s.parts)
    s.rect(24, cy, 1152, 100, "#F8FAFF", K8S, rx=18, sw=2.5)
    k8s_icon(s, 58, cy + 34, 22)
    s.text(90, cy + 42, "Kubernetes cluster", 24, K8S, "700")

    L0, L1 = 40, 760
    G0, G1 = 784, 1160
    py = cy + 66
    cpu = len(s.parts)
    s.rect(L0, py, L1 - L0, 100, "#FFFFFF", SLATE, rx=14, sw=1.5)
    s.text(L0 + 18, py + 32, "CPU node pool", 22, SLATE, "700")
    X0, X1 = L0 + 14, L1 - 14

    # R1 gateway
    r1 = py + 50
    ns(s, X0, r1, X1 - X0, 112, "gateway", BLUE, "#F5F8FF")
    pod(s, X0 + 16, r1 + 50, "controller", BLUE)
    pod(s, 250, r1 + 50, "ingress proxy ×2", BLUE)
    s.arrow(430, y0 + 102, 430, r1 + 46, C); s.badge(406, cy + 34, "1", C)

    # R2 agents (full width)
    r2 = r1 + 150
    h2 = 290
    ns(s, X0, r2, X1 - X0, h2, "agents", VIOLET, "#FAF7FF")
    pod(s, X0 + 16, r2 + 46, "concierge agent ×N", VIOLET, w=300)
    s.text(X0 + 334, r2 + 62, "LangGraph supervisor: the only", BS, NAVY)
    s.text(X0 + 334, r2 + 86, "agent that faces users", BS, NAVY)
    s.text(X0 + 16, r2 + 128, "specialist agents: one Deployment and Agent Card each", BS, SLATE)
    for i, t in enumerate(["intake ×2", "coverage ×2", "fraud ×2"]):
        pod(s, X0 + 16 + i * 224, r2 + 142, t, VIOLET, w=212)
    pod(s, X0 + 16, r2 + 200, "kagent controller", SLATE, w=260)
    s.text(X0 + 292, r2 + 216, "Agent resources, one A2A", BS, SLATE)
    s.text(X0 + 292, r2 + 240, "endpoint per agent, UI", BS, SLATE)
    s.text(X0 + 16, r2 + 274, "no GPU · each agent scales and ships on its own", BS, SLATE)
    s.arrow(300, r1 + 92, 300, r2 + 42, C); s.badge(324, r1 + 128, "2", C)

    # band between agents and ai-gateway: arrows on the left, data namespace on the right
    band = 160
    r3 = r2 + h2 + band
    by = r2 + h2
    ns(s, 490, by + 12, X1 - 490, band - 24, "data", CORAL, "#FFF3F0")
    pod(s, 506, by + 56, "PostgreSQL ×3", CORAL, w=224)
    s.text(506, by + 124, "Redis · state per agent", BS, SLATE)
    for x, lab, word, up in [(84, "3", "models", False), (220, "6", "A2A", False), (318, "7", "", True), (400, "8", "tools", False)]:
        if up:
            s.arrow(x, r3 - 2, x, by + 4, C)
        else:
            s.arrow(x, by + 2, x, r3 - 4, C)
        s.badge(x - 24, by + 70, lab, C)
        if word:
            s.text(x + 10, by + 76, word, BS, C, "700")

    # R3 ai-gateway
    ns(s, X0, r3, X1 - X0, 190, "ai-gateway", INK, "#F3F4F6")
    s.parts[-1] = s.parts[-1].replace(f'x="{X0 + 16}"', f'x="{X1 - 16}"').replace('text-anchor="start"', 'text-anchor="end"')
    pod(s, X0 + 16, r3 + 48, "AI gateway proxy ×3", INK, w=X1 - X0 - 32)
    s.rect(X0 + 16, r3 + 108, 170, 44, INK, None, rx=22)
    s.text(X0 + 16 + 85, r3 + 138, "Option A", 22, "#FFFFFF", "700", "middle")
    for i, line in enumerate(["in-cluster, e.g. agentgateway:", "one entry point for models,", "MCP tools and A2A agents"]):
        s.text(350, r3 + 116 + i * 26, line, BS, INK, "600")
    # gateway -> outside: frontier models (5) and partner agents (9), up the gap between the node pools
    s.path_arrow([(X1 - 16, r3 + 60), (790, r3 + 60), (790, y0 + 30), (796, y0 + 30)], C)
    s.path_arrow([(790, y0 + 76), (774, y0 + 76)], C)
    s.badge(790, r2 + 60, "5", C)
    s.badge(748, y0 + 124, "9", C)

    # R4 mcp | serving
    r4 = r3 + 236
    h4 = 272
    ns(s, X0, r4, 340, h4, "mcp", AMBER, "#FFFBF0")
    for i, t in enumerate(["policy-mcp ×2", "claims-mcp ×2", "payments-mcp ×2"]):
        pod(s, X0 + 16, r4 + 46 + i * 48, t, AMBER, w=308)
    pod(s, X0 + 16, r4 + 190, "kmcp controller", SLATE, w=308)
    s.text(X0 + 16, r4 + 256, "→ core systems (outside)", BS, SLATE)
    ns(s, X0 + 356, r4, X1 - X0 - 356, h4, "serving", AMBER, "#FFFBF0")
    pod(s, X0 + 372, r4 + 46, "llm-d scheduler", AMBER, w=320)
    pod(s, X0 + 372, r4 + 96, "KServe controller", VIOLET, w=320)
    s.text(X0 + 372, r4 + 170, "Endpoint Picker (EPP),", BS, SLATE)
    s.text(X0 + 372, r4 + 196, "LLMInferenceService", BS, SLATE)
    s.arrow(330, r3 + 90, 330, r4 + 42, C); s.badge(306, r3 + 212, "8", C)
    s.arrow(680, r3 + 92, 680, r4 + 42, SLATE, sw=3, dash="6 4", both=True)
    s.text(668, r3 + 214, "which pod?", BS, SLATE, "700", "end")

    # R5 observability
    r5 = r4 + h4 + 20
    ns(s, X0, r5, X1 - X0, 170, "observability", ROSE, "#FFF7F8")
    pod(s, X0 + 16, r5 + 46, "OTel Collector (DaemonSet)", ROSE)
    pod(s, X0 + 16, r5 + 96, "Prometheus", ROSE)
    pod(s, X0 + 220, r5 + 96, "Grafana", ROSE)
    pod(s, X0 + 392, r5 + 96, "Langfuse", ROSE)
    s.text(X0 + 16, r5 + 160, "traces, metrics, prompt versions, eval scores", BS, SLATE)

    # R6 platform
    r6 = r5 + 190
    ns(s, X0, r6, X1 - X0, 170, "platform", SLATE, "#F7F8FA")
    xx = X0 + 16
    for t in ["KEDA", "Kueue", "cert-manager"]:
        xx += pod(s, xx, r6 + 46, t, SLATE) + 12
    xx = X0 + 16
    for t in ["External Secrets", "Argo CD"]:
        xx += pod(s, xx, r6 + 96, t, SLATE) + 12
    s.text(X0 + 16, r6 + 160, "autoscaling · GPU quotas · TLS · secrets · GitOps", BS, SLATE)
    cpu_end = r6 + 186
    s.parts[cpu] = s.parts[cpu].replace('height="100"', f'height="{cpu_end - py}"')

    # ---------- GPU node pool
    gy = r3 + 236
    s.rect(G0, gy, G1 - G0, cpu_end - gy, "#FFFFFF", GREEN, rx=14, sw=1.8)
    gpu_icon(s, G0 + 30, gy + 26)
    s.text(G0 + 58, gy + 34, "GPU node pool", 22, GREEN, "700")
    ns(s, G0 + 14, gy + 52, G1 - G0 - 28, cpu_end - gy - 66, "inference", GREEN, "#F3FBF5")
    gx = G0 + 30
    pod(s, gx, gy + 100, "vLLM prefill ×2", GREEN, w=316, gpu=True)
    pod(s, gx, gy + 196, "vLLM decode ×4", GREEN, w=316, gpu=True)
    s.arrow(gx + 158, gy + 142, gx + 158, gy + 192, GREEN)
    s.text(gx + 176, gy + 174, "KV cache", BS, GREEN, "600")
    for i, t in enumerate(["batching, PagedAttention,", "KV cache offload to", "CPU / SSD"]):
        s.text(gx, gy + 280 + i * 26, t, BS, SLATE)
    pod(s, gx, gy + 380, "model cache (PVC)", GREEN, w=316)
    s.text(gx, gy + 448, "weights from S3 / Blob", BS, SLATE)
    pod(s, gx, gy + 480, "GPU Operator", GREEN, w=316)
    s.text(gx, gy + 548, "DaemonSet: drivers,", BS, SLATE)
    s.text(gx, gy + 574, "device plugin", BS, SLATE)
    s.path_arrow([(X1 - 16, r3 + 82), (806, r3 + 82), (806, gy + 120), (gx - 2, gy + 120)], C)
    s.badge(806, r4 - 40, "4", C)

    # ---------- control plane strip
    cp = cpu_end + 16
    s.rect(40, cp, 1120, 50, "#E8EEFC", None, rx=10)
    s.text(58, cp + 33, "Control plane (managed by EKS / AKS / GKE): API server · etcd · scheduler", BS, K8S, "600")
    cl_end = cp + 66
    top_r, bot_r = 770, 1176
    notch = gy - 18
    d = (f"M{24 + 18},{cy} L{top_r},{cy} L{top_r},{notch} L{bot_r},{notch} L{bot_r},{cl_end - 18} "
         f"Q{bot_r},{cl_end} {bot_r - 18},{cl_end} L{24 + 18},{cl_end} Q24,{cl_end} 24,{cl_end - 18} "
         f"L24,{cy + 18} Q24,{cy} {24 + 18},{cy} Z")
    s.parts[frame] = f'<path d="{d}" fill="#F8FAFF" stroke="{K8S}" stroke-width="2.5"/>'

    # Option B: managed AI gateway outside the cluster
    mx, mw, my = 820, 340, cy + 4
    mh = notch - 76 - my
    s.rect(mx, my, mw, mh, "#F3F4F6", INK, rx=14, sw=2.5, dash="9 6")
    s.rect(mx + 18, my + 14, 170, 44, INK, None, rx=22)
    s.text(mx + 18 + 85, my + 44, "Option B", 22, "#FFFFFF", "700", "middle")
    s.text(mx + 18, my + 86, "managed, outside the", BS, INK, "700")
    s.text(mx + 18, my + 110, "cluster", BS, INK, "700")
    yy = my + 156
    for t_, b_ in [("Azure", "API Management"), ("AWS", "AgentCore Gateway or API Gateway"),
                   ("Google Cloud", "Apigee")]:
        s.text(mx + 18, yy, t_, BS, NAVY, "700")
        bl = s.wrap(b_, mw - 36, BS)
        s.lines(mx + 18, yy + 26, bl, BS, SLATE)
        yy += 26 + len(bl) * 26 + 16
    for i, line in enumerate(["Agents call it directly:", "just another URL, as", "with option A.", "",
                              "A2A: API Management", "imports each agent from", "its Agent Card and", "republishes it with its", "own security.", "",
                              "Self-hosted models: back", "into the cluster through", "an internal load balancer."]):
        s.text(mx + 18, yy + 10 + i * 26, line, BS, SLATE)
    s.arrow(mx + 200, my - 2, mx + 200, y0 + 104, INK2, dash="7 5")
    s.arrow(1060, my + mh + 2, 1060, gy + 96, INK2, dash="7 5")
    s.text(1046, notch - 26, "internal LB", BS, INK2, "600", "end")

    # ---------- steps
    sy = cl_end + 50
    steps = ["The app reaches the cluster through the load balancer and the ingress proxy.",
             "The ingress routes the call to the concierge agent.",
             "The concierge asks the AI gateway for a model; every agent does the same.",
             "mini is self-hosted: the gateway asks llm-d which pod, then calls that vLLM pod.",
             "reasoning is a frontier model: the AI gateway calls the external API.",
             "The concierge delegates over A2A; the AI gateway checks identity and limits.",
             "The gateway forwards the task to the specialist's A2A endpoint, served by kagent.",
             "The specialist calls its tools through the AI gateway: MCP pods, then the core.",
             "Agents of other companies are reached the same way: A2A through the gateway.",
             "Each agent keeps its own state in PostgreSQL; the OTel Collector traces every hop."]
    for i, t in enumerate(steps):
        s.badge(54, sy + i * 34 - 6, str(i + 1), C, r=15)
        s.text(82, sy + i * 34, t, BS, NAVY)
    s.text(40, sy + len(steps) * 34 + 14, "Without kagent the picture is the same: each agent serves its own A2A endpoint.", BS, INK, "600")
    s.text(40, sy + len(steps) * 34 + 46, "Steps 6-7 are a choice: agents of one team can also call each other directly, pod to pod.", BS, INK, "600")
    s.text(40, sy + len(steps) * 34 + 72, "Keep the gateway at the border, between teams and with other companies.", BS, INK, "600")
    s.h = sy + len(steps) * 34 + 142
    s.parts[0] = f'<rect x="0" y="0" width="{s.w}" height="{s.h}" fill="{BG}"/>'
    for i, p in enumerate(s.parts):
        if AUTHOR in p:
            s.parts[i] = p.replace(f'y="{2800 - 22}"', f'y="{s.h - 22}"')
    s.save("14b-k8s-a2a-agents")


def main():
    k8s_a2a()


if __name__ == "__main__":
    main()
