"""14 - Self-hosted models on Kubernetes: the cluster in detail (node pools, namespaces, pods) and a request's path."""
import math
from base import *

K8S = "#326CE5"
C = ROSE          # request flow colour
INK = "#111827"   # AI gateway (option A and B): black range
INK2 = "#4B5563"
CORAL = "#E8604C"  # namespace: data
BS = 20


def k8s_icon(s, x, y, r=18):
    """Kubernetes-style helm wheel on a blue heptagon, centred at (x, y)."""
    pts = " ".join(f"{x + r * math.sin(2 * math.pi * i / 7):.1f},{y - r * math.cos(2 * math.pi * i / 7):.1f}" for i in range(7))
    s.parts.append(f'<polygon points="{pts}" fill="{K8S}"/>')
    s.parts.append(f'<circle cx="{x}" cy="{y}" r="{r * 0.5:.1f}" fill="none" stroke="#FFFFFF" stroke-width="{r * 0.13:.1f}"/>')
    for i in range(7):
        a = 2 * math.pi * i / 7
        s.parts.append(f'<line x1="{x}" y1="{y}" x2="{x + r * 0.72 * math.sin(a):.1f}" y2="{y - r * 0.72 * math.cos(a):.1f}" '
                       f'stroke="#FFFFFF" stroke-width="{r * 0.11:.1f}" stroke-linecap="round"/>')
    s.parts.append(f'<circle cx="{x}" cy="{y}" r="{r * 0.16:.1f}" fill="#FFFFFF"/>')


def pod_icon(s, x, y, col, r=10):
    """Small isometric cube = a pod, centred at (x, y)."""
    top = f"{x},{y - r} {x + r * 0.87:.1f},{y - r / 2} {x},{y} {x - r * 0.87:.1f},{y - r / 2}"
    left = f"{x - r * 0.87:.1f},{y - r / 2} {x},{y} {x},{y + r} {x - r * 0.87:.1f},{y + r / 2}"
    right = f"{x + r * 0.87:.1f},{y - r / 2} {x},{y} {x},{y + r} {x + r * 0.87:.1f},{y + r / 2}"
    s.parts.append(f'<polygon points="{top}" fill="{col}" opacity="0.55"/>')
    s.parts.append(f'<polygon points="{left}" fill="{col}" opacity="0.85"/>')
    s.parts.append(f'<polygon points="{right}" fill="{col}"/>')


def gpu_icon(s, x, y, col=GREEN):
    s.rect(x - 16, y - 11, 32, 22, "#FFFFFF", col, rx=3, sw=2)
    for i in range(4):
        px = x - 11 + i * 7.3
        s.parts.append(f'<line x1="{px:.1f}" y1="{y - 15}" x2="{px:.1f}" y2="{y - 11}" stroke="{col}" stroke-width="2"/>')
        s.parts.append(f'<line x1="{px:.1f}" y1="{y + 11}" x2="{px:.1f}" y2="{y + 15}" stroke="{col}" stroke-width="2"/>')
    s.rect(x - 6, y - 5, 12, 10, col, None, rx=1)


def pod(s, x, y, text, col, w=None, gpu=False):
    """A pod chip: cube icon + label. Returns its width."""
    w = w or int(len(text) * BS * 0.56 + 58 + (34 if gpu else 0))
    s.rect(x, y, w, 40, "#FFFFFF", col, rx=10, sw=1.8)
    pod_icon(s, x + 22, y + 20, col)
    s.text(x + 40, y + 27, text, BS, NAVY, "600")
    if gpu:
        gpu_icon(s, x + w - 26, y + 20, col)
    return w


def ns(s, x, y, w, h, name, col, fill="#FFFFFF"):
    s.rect(x, y, w, h, fill, col, rx=12, sw=2, dash="7 4")
    s.text(x + 16, y + 30, f"namespace: {name}", BS, col, "700")


def k8s_detail():
    s = Svg(2600, "Self-hosted AI on Kubernetes, in detail",
            "Node pools, namespaces and pods of one cluster, and the path of a request")
    y0 = s.top
    # ---------- outside the cluster
    s.box(40, y0, 260, 100, "Web & mobile apps", ["customers"], VIOLET_L, VIOLET, tsize=22, bsize=BS)
    s.box(330, y0, 240, 100, "Load balancer", ["cloud LB + WAF"], SOFT, SLATE, tsize=22, bsize=BS)
    s.box(800, y0, 360, 100, "Frontier model APIs", ["Azure OpenAI · Bedrock"], TEAL_L, TEAL, tsize=22, bsize=BS)
    s.arrow(302, y0 + 50, 326, y0 + 50, C)

    # ---------- cluster frame
    cy = y0 + 150
    frame = len(s.parts)
    s.rect(24, cy, 1152, 100, "#F8FAFF", K8S, rx=18, sw=2.5)
    k8s_icon(s, 58, cy + 34, 22)
    s.text(90, cy + 42, "Kubernetes cluster", 24, K8S, "700")

    L0, L1 = 40, 760          # CPU column
    G0, G1 = 784, 1160        # GPU column
    # ---------- CPU node pool
    py = cy + 66
    cpu = len(s.parts)
    s.rect(L0, py, L1 - L0, 100, "#FFFFFF", SLATE, rx=14, sw=1.5)
    s.text(L0 + 18, py + 32, "CPU node pool", 22, SLATE, "700")
    X0, X1 = L0 + 14, L1 - 14

    # R1 gateway
    r1 = py + 50
    ns(s, X0, r1, X1 - X0, 112, "gateway", BLUE, "#F5F8FF")
    pod(s, X0 + 16, r1 + 50, "controller", BLUE)
    ing_w = pod(s, 380, r1 + 50, "ingress proxy ×2", BLUE)
    s.arrow(450, y0 + 102, 450, r1 + 46, C); s.badge(426, cy + 34, "1", C)

    # R2 agents | data
    r2 = r1 + 150
    h2 = 230
    ns(s, X0, r2, 420, h2, "agents", VIOLET, "#FAF7FF")
    pod(s, X0 + 16, r2 + 46, "LangGraph ×N", VIOLET, w=388)
    s.text(X0 + 52, r2 + 116, "supervisor · intake", BS, NAVY)
    s.text(X0 + 52, r2 + 142, "coverage · fraud_check", BS, NAVY)
    s.text(X0 + 16, r2 + 182, "no GPU · KEDA/HPA autoscaling", BS, SLATE)
    s.text(X0 + 16, r2 + 212, "option: managed by kagent", BS, VIOLET, "600", italic=True)
    s.arrow(400, r1 + 92, 400, r2 + 42, C); s.badge(424, r1 + 128, "2", C)
    ns(s, X0 + 436, r2, X1 - X0 - 436, h2, "data", CORAL, "#FFF3F0")
    pod(s, X0 + 452, r2 + 46, "PostgreSQL ×3", CORAL, w=236)
    pod(s, X0 + 452, r2 + 96, "Redis", CORAL, w=236)
    s.text(X0 + 452, r2 + 160, "checkpoints,", BS, SLATE)
    s.text(X0 + 452, r2 + 184, "claim drafts", BS, SLATE)
    s.arrow(X0 + 406, r2 + 66, X0 + 450, r2 + 66, SLATE, sw=3, dash="6 4")

    # R3 ai-gateway
    r3 = r2 + h2 + 46
    ns(s, X0, r3, X1 - X0, 190, "ai-gateway", INK, "#F3F4F6")
    s.parts[-1] = s.parts[-1].replace(f'x="{X0 + 16}"', f'x="{X1 - 16}"').replace('text-anchor="start"', 'text-anchor="end"')
    pod(s, X0 + 16, r3 + 48, "AI gateway proxy ×3", INK, w=X1 - X0 - 32)
    s.rect(X0 + 16, r3 + 108, 170, 44, INK, None, rx=22)
    s.text(X0 + 16 + 85, r3 + 138, "Option A", 22, "#FFFFFF", "700", "middle")
    for i, line in enumerate(["in a pod, in-cluster:", "Kong, Envoy AI Gateway,", "agentgateway or LiteLLM"]):
        s.text(370, r3 + 116 + i * 26, line, BS, INK, "600")
    s.text(X0 + 16, r3 + 112, "", BS, SLATE) if False else None
    for x, lab, word in [(100, "3", "mini"), (240, "5", "reasoning"), (420, "7", "tools")]:
        s.arrow(x, r2 + h2 + 2, x, r3 + 44, C); s.badge(x - 24, r2 + h2 + 24, lab, C)
        s.text(x + 10, r2 + h2 + 30, word, BS, C, "700")
    # 6: AI gateway -> frontier, up the gap between the node pools
    s.path_arrow([(X1 - 16, r3 + 60), (790, r3 + 60), (790, y0 + 50), (796, y0 + 50)], C)
    s.badge(790, r2 + 60, "6", C)

    # R4 mcp | inference-control
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
    s.arrow(330, r3 + 90, 330, r4 + 42, C); s.badge(306, r3 + 212, "7", C)
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

    # ---------- GPU node pool (right column)
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
    # EPP -> prefill pod
    s.path_arrow([(X1 - 16, r3 + 82), (806, r3 + 82), (806, gy + 120), (gx - 2, gy + 120)], C)
    s.badge(806, r4 - 40, "4", C)

    # ---------- control plane strip at the bottom of the cluster
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
    for i, line in enumerate(["LangGraph calls it", "directly: just another", "URL, as with option A.",
                              "Frontier models: straight", "to the provider.",
                              "Self-hosted models: back", "into the cluster through", "an internal load balancer."]):
        s.text(mx + 18, yy + 10 + i * 26, line, BS, SLATE)
    # B -> frontier (dashed) and B -> self-hosted models via internal LB (dashed)
    s.arrow(mx + 200, my - 2, mx + 200, y0 + 104, INK2, dash="7 5")
    s.arrow(1060, my + mh + 2, 1060, gy + 96, INK2, dash="7 5")
    s.text(1046, notch - 26, "internal LB", BS, INK2, "600", "end")
    # ---------- steps
    sy = cl_end + 50
    steps = ["The app reaches the cluster through the load balancer and the ingress proxy.",
             "The ingress routes the call to a LangGraph pod; state goes to PostgreSQL.",
             "The supervisor asks the AI gateway for the alias mini.",
             "mini is self-hosted: the gateway asks llm-d which pod, then calls that vLLM pod.",
             "A worker agent asks the AI gateway for the alias reasoning.",
             "reasoning is a frontier model: the AI gateway calls the external API.",
             "Tool calls go through the AI gateway to the MCP pods, then to the core.",
             "The reply streams back to the app; the OTel Collector traces every hop."]
    for i, t in enumerate(steps):
        s.badge(54, sy + i * 34 - 6, str(i + 1), C, r=15)
        s.text(82, sy + i * 34, t, BS, NAVY)
    s.text(40, sy + len(steps) * 34 + 14, "Option B: LangGraph calls the managed gateway the same way; only self-hosted calls re-enter.", BS, INK, "600")
    s.h = sy + len(steps) * 34 + 84
    s.parts[0] = f'<rect x="0" y="0" width="{s.w}" height="{s.h}" fill="{BG}"/>'
    for i, p in enumerate(s.parts):
        if AUTHOR in p:
            s.parts[i] = p.replace(f'y="{2600 - 22}"', f'y="{s.h - 22}"')
    s.save("14-k8s-self-hosted-inference")


def main():
    k8s_detail()


if __name__ == "__main__":
    main()
