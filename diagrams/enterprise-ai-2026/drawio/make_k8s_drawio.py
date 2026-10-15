"""Generate the draw.io versions of diagrams 14 and 14b (self-hosted AI on Kubernetes).

`python3 make_k8s_drawio.py` writes k8s-self-hosted-inference.drawio (one LangGraph service);
`python3 make_k8s_drawio.py a2a` writes k8s-a2a-agents.drawio (one service per agent, A2A).
Files are written next to this script. Positions are absolute
in this script and converted to container-relative coordinates on output.
"""
import base64
import sys
from html import escape
from pathlib import Path

ICONS = Path(__file__).with_name("icons")
A2A = len(sys.argv) > 1 and sys.argv[1] == "a2a"
BLUE_A2A = "#1f6fd1"

OY = 300  # vertical offset: title + internet row above the VNet
OX = 60  # horizontal offset: room for the VNet border
cells = []
abs_pos = {}  # id -> (x, y) absolute, for containers
size = {}  # id -> (w, h)
parent_of = {}

ORANGE = "fillColor=#ffe6cc;strokeColor=#d79b00;"
PURPLE = "fillColor=#e1d5e7;strokeColor=#9673a6;"
BLUE = "fillColor=#dae8fc;strokeColor=#6c8ebf;"
GREEN = "fillColor=#d5e8d4;strokeColor=#82b366;"
GREY = "fillColor=#f5f5f5;strokeColor=#666666;fontColor=#333333;"
YELLOW = "fillColor=#fff2cc;strokeColor=#d6b656;"
WHITE = "fillColor=#ffffff;strokeColor=#666666;"
BOX = "rounded=1;whiteSpace=wrap;html=1;arcSize=8;fontSize=13;"
NOTE = "text;html=1;whiteSpace=wrap;align=left;verticalAlign=top;fontSize=12;fontColor=#555555;"


def lbl(title, *lines):
    s = f"<b>{escape(title)}</b>"
    for line in lines:
        s += f"<br><font style='font-size:11px'>{escape(line)}</font>"
    return s


def add(cid, value, style, x, y, w, h, parent="1", container=False):
    y += OY
    x += OX
    px, py = abs_pos.get(parent, (0, 0))
    abs_pos[cid] = (x, y)
    size[cid] = (w, h)
    parent_of[cid] = parent
    cells.append(
        f'<mxCell id="{cid}" value="{escape(value, quote=True)}" style="{style}" vertex="1" '
        f'parent="{parent}"><mxGeometry x="{x - px}" y="{y - py}" width="{w}" height="{h}" as="geometry"/></mxCell>'
    )


def lane(cid, title, x, y, w, h, style, parent="1"):
    add(cid, title, "swimlane;startSize=26;html=1;rounded=1;arcSize=2;fontSize=14;" + style, x, y, w, h, parent)


def ns(cid, title, x, y, w, h, parent):
    add(cid, title, "swimlane;startSize=24;html=1;rounded=1;arcSize=3;dashed=1;fontStyle=1;fontSize=12;"
        "fillColor=#ffffff;swimlaneFillColor=#ffffff;strokeColor=#7a7a7a;", x, y, w, h, parent)


def edge(eid, src, tgt, label="", style="", points=(), color="#333333"):
    pts = ""
    if points:
        pts = "<Array as=\"points\">" + "".join(
            f'<mxPoint x="{px + OX}" y="{py + OY}"/>' for px, py in points) + "</Array>"
    cells.append(
        f'<mxCell id="{eid}" value="{escape(label, quote=True)}" style="edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;'
        f'endArrow=block;endFill=1;strokeWidth=2;fontSize=12;fontStyle=1;labelBackgroundColor=#ffffff;'
        f'strokeColor={color};fontColor={color};{style}" edge="1" source="{src}" target="{tgt}" parent="1">'
        f'<mxGeometry relative="1" as="geometry">{pts}</mxGeometry></mxCell>'
    )


# Title
cells.append(
    '<mxCell id="title" value="&lt;b&gt;' + ("Self-hosted AI on Kubernetes, with A2A between agents" if A2A else "Self-hosted AI on Kubernetes, in detail") + '&lt;/b&gt;&lt;br&gt;'
    '&lt;font style=&quot;font-size:14px&quot;&gt;' + ("The same cluster, but every agent is its own service: a concierge agent delegates to specialists over A2A"
    if A2A else "Network, node pools, namespaces and pods of one cluster, and the numbered path of a request") +
    ' · David Prat Robles · linkedin.com/in/davidpratrobles&lt;/font&gt;" '
    'style="text;html=1;align=left;verticalAlign=top;fontSize=24;whiteSpace=wrap;" vertex="1" parent="1">'
    '<mxGeometry x="40" y="10" width="1900" height="70" as="geometry"/></mxCell>'
)

# Internet, outside the VNet
add("inet", "<b>Internet</b>", NOTE + "fontSize=14;fontColor=#333333;", -40, -225, 200, 24)
add("apps", lbl("Web & mobile apps", "customers"), BOX + GREY, 60, -195, 200, 60)
add("dns", lbl("Public DNS", "Azure DNS · Route 53 · Cloud DNS"), BOX + GREY, 330, -195, 230, 60)
if A2A:
    add("partner", lbl("Partner agents", "A2A · other companies"), BOX + GREY, 640, -195, 260, 60)
add("frontier", lbl("Frontier model APIs", "Azure OpenAI · Bedrock · Vertex AI"), BOX + GREY, 1240, -195, 330, 60)

# VNet / VPC and its subnets
lane("vnet", "VNet / VPC 10.0.0.0/16 · private, one per region · Azure VNet · AWS VPC · Google VPC",
     -40, -115, 1720, 1600, "fillColor=#fbfbfb;strokeColor=#2d7d46;fontColor=#2d7d46;dashed=0;")
SUBNET = "fillColor=#ffffff;strokeColor=#2d7d46;fontColor=#2d7d46;dashed=1;"
lane("sn_edge", "edge subnet 10.0.0.0/24 (public)", -20, -80, 660, 165, SUBNET, "vnet")
add("waf", lbl("WAF + L7 load balancer", "App Gateway · ALB · Cloud LB + Cloud Armor", "TLS, DDoS, OWASP rules"),
    BOX + GREY, 0, -45, 300, 75, "sn_edge")
add("lb", lbl("Ingress load balancer", "public IP only here; targets the", "ingress proxies (Gateway API)"),
    BOX + GREY, 330, -45, 290, 75, "sn_edge")
lane("sn_egress", "egress subnet 10.0.1.0/24", 660, -80, 400, 165, SUBNET, "vnet")
add("fw", lbl("Egress firewall", "FQDN allow-list"), BOX + GREY, 680, -45, 175, 70, "sn_egress")
add("nat", lbl("NAT gateway", "fixed outbound IPs"), BOX + GREY, 870, -45, 175, 70, "sn_egress")
add("eg_note", "Everything without a private endpoint leaves here: SaaS APIs, image pulls.", NOTE, 680, 32, 370, 40, "sn_egress")
lane("sn_pe", "private-endpoint subnet 10.0.2.0/24", 1080, -80, 580, 165, SUBNET, "vnet")
add("pe_ai", lbl("Private endpoint: models", "Private Link · PrivateLink · PSC"), BOX + GREY, 1100, -45, 265, 70, "sn_pe")
add("pe_st", lbl("Private endpoint: storage", "Blob / S3 / GCS, model weights"), BOX + GREY, 1380, -45, 265, 70, "sn_pe")
add("pe_note", "Private DNS zones resolve the provider names to these private IPs.", NOTE, 1100, 32, 545, 40, "sn_pe")

# Cluster and node pools
lane("cluster", "Kubernetes cluster · private API endpoint · Pod CIDR 10.244.0.0/16 (overlay) · Service CIDR 10.96.0.0/16",
     40, 120, 1360, 1330, "fillColor=#f8f9fb;strokeColor=#326ce5;fontColor=#326ce5;", "vnet")
lane("cpu", "CPU node pool · node subnet 10.0.16.0/20", 60, 160, 900, 1200, BLUE, "cluster")
lane("gpu", "GPU node pool · node subnet 10.0.32.0/20", 980, 160, 400, 1200, GREEN, "cluster")
add("cp", lbl("Control plane, managed by EKS / AKS / GKE", "API server (private endpoint) · etcd · scheduler"),
    BOX + "fillColor=#eeeeee;strokeColor=#999999;", 60, 1375, 1320, 55, "cluster")

# Row 1: gateway, agents, data
ns("ns_gw", "namespace: gateway", 80, 200, 280, 300, "cpu")
add("ing_ctl", lbl("Ingress controller", "Envoy / Kong"), BOX + WHITE, 100, 240, 240, 50, "ns_gw")
add("ingress", lbl("Ingress proxy ×2", "faces users: TLS, routes to agents"), BOX + WHITE, 100, 320, 240, 60, "ns_gw")
add("ing_note", "Can be the same Envoy or Kong install as the AI gateway, with different routes and a different role.",
    NOTE, 100, 395, 240, 90, "ns_gw")

ns("ns_ag", "namespace: agents", 380, 200, 280, 300, "cpu")
if A2A:
    add("lg", lbl("Concierge agent ×N", "LangGraph supervisor: the only", "agent that faces users"),
        BOX + YELLOW, 400, 235, 240, 70, "ns_ag")
    add("spg", "specialist agents · one Deployment + Agent Card each",
        "swimlane;startSize=20;html=1;rounded=1;arcSize=6;dashed=1;fontSize=10;fontStyle=1;fillColor=#fffbe6;"
        "swimlaneFillColor=#fffbe6;strokeColor=#d6b656;", 400, 315, 240, 80, "ns_ag")
    add("sp1", lbl("intake ×2"), BOX + YELLOW + "fontSize=11;", 405, 342, 74, 44, "spg")
    add("sp2", lbl("coverage ×2"), BOX + YELLOW + "fontSize=11;", 483, 342, 74, 44, "spg")
    add("sp3", lbl("fraud ×2"), BOX + YELLOW + "fontSize=11;", 561, 342, 74, 44, "spg")
    add("kagent", lbl("kagent controller", "Agent resources, one A2A", "endpoint per agent, UI"),
        BOX + WHITE, 400, 410, 240, 70, "ns_ag")
else:
    add("lg", lbl("LangGraph ×N", "supervisor · intake", "coverage · fraud_check", "same graph in every pod"),
        BOX + YELLOW, 400, 240, 240, 100, "ns_ag")
    add("lg_note", "No GPU: calls models over the network. Scales with KEDA / HPA.", NOTE, 400, 350, 240, 50, "ns_ag")
    add("kagent", lbl("option: kagent", "Agent resources, A2A endpoints"), BOX + WHITE + "dashed=1;", 400, 410, 240, 60, "ns_ag")

ns("ns_data", "namespace: data", 680, 200, 260, 300, "cpu")
add("pg", lbl("PostgreSQL ×3", "checkpoints, claim drafts"), "shape=cylinder3;whiteSpace=wrap;html=1;boundedLbl=1;size=12;fontSize=13;" + WHITE,
    700, 240, 105, 110, "ns_data")
add("redis", lbl("Redis", "cache, sessions"), "shape=cylinder3;whiteSpace=wrap;html=1;boundedLbl=1;size=12;fontSize=13;" + WHITE,
    820, 240, 105, 110, "ns_data")
add("data_note", "Each agent keeps its own state: checkpoints and A2A tasks." if A2A else "Conversation state lives here, so any LangGraph replica can pick up a thread.", NOTE, 700, 365, 225, 70, "ns_data")

# Row 2: ai-gateway, mcp, serving
ns("ns_aig", "namespace: ai-gateway", 80, 530, 280, 330, "cpu")
add("aigw", lbl("AI gateway proxy ×3", "identity · token limits · routing", "models · MCP tools · A2A agents")
    if A2A else lbl("AI gateway proxy ×3", "identity · token limits · routing", "by alias: mini · reasoning · failover"),
    BOX + ORANGE + "strokeWidth=2;", 100, 570, 240, 90, "ns_aig")
add("optA", lbl("Option A: in the cluster", "e.g. agentgateway: one entry point", "for models, MCP tools and A2A")
    if A2A else lbl("Option A: in the cluster", "Kong, Envoy AI Gateway,", "agentgateway or LiteLLM"),
    BOX + ORANGE + "dashed=1;", 100, 680, 240, 75, "ns_aig")
add("aig_note", "Single entry point to models and tools.", NOTE, 100, 770, 240, 40, "ns_aig")

ns("ns_mcp", "namespace: mcp", 380, 530, 280, 330, "cpu")
add("mcp1", lbl("policy-mcp ×2"), BOX + WHITE, 400, 570, 240, 45, "ns_mcp")
add("mcp2", lbl("claims-mcp ×2"), BOX + WHITE, 400, 625, 240, 45, "ns_mcp")
add("mcp3", lbl("payments-mcp ×2"), BOX + WHITE, 400, 680, 240, 45, "ns_mcp")
add("kmcp", lbl("kmcp controller", "MCPServer resources"), BOX + WHITE + "dashed=1;", 400, 745, 240, 55, "ns_mcp")

ns("ns_srv", "namespace: serving", 680, 530, 260, 330, "cpu")
add("llmd", lbl("llm-d scheduler", "Endpoint Picker (EPP)", "prefix / KV-cache hits, queue, load"),
    BOX + PURPLE + "strokeWidth=2;", 700, 570, 220, 85, "ns_srv")
add("pool", lbl("InferencePool", "Gateway API Inference Ext."), BOX + PURPLE, 700, 670, 220, 55, "ns_srv")
add("kserve", lbl("KServe controller", "LLMInferenceService: version,", "GPU spec, canary, scaling"),
    BOX + PURPLE, 700, 740, 220, 85, "ns_srv")

# Row 3: observability, platform
ns("ns_obs", "namespace: observability", 80, 900, 420, 260, "cpu")
add("otel", lbl("OTel Collector", "DaemonSet, every node"), BOX + WHITE, 100, 940, 185, 55, "ns_obs")
add("prom", lbl("Prometheus"), BOX + WHITE, 300, 940, 185, 55, "ns_obs")
add("graf", lbl("Grafana"), BOX + WHITE, 100, 1010, 185, 55, "ns_obs")
add("lf", lbl("Langfuse"), BOX + WHITE, 300, 1010, 185, 55, "ns_obs")
add("obs_note", "Traces, metrics, prompt versions and eval scores for every hop.", NOTE, 100, 1080, 385, 50, "ns_obs")

ns("ns_plat", "namespace: platform", 520, 900, 420, 260, "cpu")
add("keda", lbl("KEDA", "autoscaling"), BOX + WHITE, 540, 940, 185, 50, "ns_plat")
add("kueue", lbl("Kueue", "GPU quotas"), BOX + WHITE, 740, 940, 185, 50, "ns_plat")
add("certm", lbl("cert-manager", "TLS"), BOX + WHITE, 540, 1000, 185, 50, "ns_plat")
add("eso", lbl("External Secrets", "vault → secrets"), BOX + WHITE, 740, 1000, 185, 50, "ns_plat")
add("argo", lbl("Argo CD", "GitOps for everything above"), BOX + WHITE, 540, 1060, 385, 50, "ns_plat")

# GPU pool
ns("ns_inf", "namespace: inference", 1000, 200, 360, 700, "gpu")
add("prefill", lbl("vLLM prefill ×2", "reads the prompt"), BOX + GREEN + "strokeWidth=2;", 1020, 245, 320, 70, "ns_inf")
add("decode", lbl("vLLM decode ×4", "generates the tokens"), BOX + GREEN + "strokeWidth=2;", 1020, 405, 320, 70, "ns_inf")
add("vllm_note", "Continuous batching, PagedAttention, prefix caching, parallelism across GPUs; KV cache offload to CPU / SSD.",
    NOTE, 1020, 490, 320, 60, "ns_inf")
add("pvc", lbl("Model cache (PVC)", "weights from S3 / Blob"),
    "shape=cylinder3;whiteSpace=wrap;html=1;boundedLbl=1;size=12;fontSize=13;" + WHITE, 1100, 580, 160, 100, "ns_inf")
add("inf_note", "Mini model: e.g. a small open-weights model served by KServe with an OpenAI-compatible endpoint.",
    NOTE, 1020, 700, 320, 60, "ns_inf")

ns("ns_gpuop", "namespace: gpu-operator", 1000, 930, 360, 230, "gpu")
add("gpuop", lbl("NVIDIA GPU Operator", "DaemonSet: drivers, device plugin,", "DCGM exporter"),
    BOX + WHITE, 1020, 975, 320, 85, "ns_gpuop")

# Row 4: cluster networking
ns("ns_kube", "namespace: kube-system", 80, 1180, 420, 165, "cpu")
add("coredns", lbl("CoreDNS", "service discovery"), BOX + WHITE, 100, 1220, 185, 50, "ns_kube")
add("cilium", lbl("Cilium (CNI)", "DaemonSet, eBPF"), BOX + WHITE, 300, 1220, 185, 50, "ns_kube")
add("extdns", lbl("ExternalDNS", "writes the DNS records"), BOX + WHITE, 100, 1280, 185, 50, "ns_kube")
add("gwapi", lbl("Gateway API", "Gateway · HTTPRoute"), BOX + WHITE, 300, 1280, 185, 50, "ns_kube")

ns("ns_mesh", "namespace: istio-system (optional mesh)", 520, 1180, 420, 165, "cpu")
add("ztunnel", lbl("ztunnel DaemonSet", "mTLS between all pods"), BOX + WHITE, 540, 1220, 185, 50, "ns_mesh")
add("waypoint", lbl("waypoint proxies", "L7 policy per namespace"), BOX + WHITE, 740, 1220, 185, 50, "ns_mesh")
add("netpol", lbl("NetworkPolicies: default deny", "agents → ai-gateway only; ai-gateway → mcp, serving, inference, egress"),
    BOX + YELLOW, 540, 1280, 385, 50, "ns_mesh")

add("gpu_net", lbl("GPU node networking", "no public IPs · taint nvidia.com/gpu", "only the gateway and llm-d reach vLLM",
                   "optional RDMA / InfiniBand between", "GPU nodes for multi-node models"),
    BOX + WHITE + "dashed=1;", 1000, 1180, 360, 160, "gpu")

# Inside the VNet, right of the cluster
add("ilb", lbl("Internal load balancer", "+ small inference gateway", "(option B only)"), BOX + GREY + "dashed=1;",
    1420, 400, 240, 80, "vnet")
add("hgw", lbl("Hybrid gateway", "ExpressRoute · Direct Connect", "Cloud Interconnect (or VPN)"), BOX + GREY,
    1420, 920, 240, 80, "vnet")

# Outside the VNet, right
lane("optB", "Option B: managed gateway, outside the cluster", 1720, 520, 400, 380, ORANGE + "dashed=1;")
add("apim", lbl("Azure API Management", "can be VNet-injected"), BOX + WHITE, 1740, 565, 360, 50, "optB")
add("agc", lbl("AWS AgentCore Gateway or API Gateway"), BOX + WHITE, 1740, 625, 360, 50, "optB")
add("apigee", lbl("Google Cloud Apigee"), BOX + WHITE, 1740, 685, 360, 50, "optB")
add("optB_note", "Agents call it like the in-cluster one (just another URL). Frontier calls go straight to the provider; "
    "only self-hosted calls come back into the cluster through the internal load balancer."
    + (" For A2A, API Management imports each agent from its Agent Card and republishes it with its own security." if A2A else ""), NOTE, 1740, 750, 360, 120, "optB")
add("core", lbl("Core systems (on-premises)", "policy admin · claims · payments"), BOX + GREY, 1720, 930, 300, 60)

# Icons: logos downloaded into icons/ (CNCF artwork, Simple Icons, project repos, AWS and Azure icon sets)
# are embedded as data URIs; Kubernetes resource icons use draw.io's built-in Kubernetes stencils.
K8S = "shape=mxgraph.kubernetes.icon;fillColor=#326CE5;strokeColor=#ffffff;aspect=fixed;html=1;"
_n = [0]


def _img_style(name):
    data = (ICONS / name).read_bytes()
    mime = "image/svg+xml" if name.endswith(".svg") else "image/png"
    return f"shape=image;aspect=fixed;imageAspect=0;html=1;image=data:{mime},{base64.b64encode(data).decode()};"


def _put(style, ax, ay, sz, parent):
    _n[0] += 1
    cid = f"ic{_n[0]}"
    px, py = abs_pos.get(parent, (0, 0))
    cells.append(f'<mxCell id="{cid}" value="" style="{style}" vertex="1" parent="{parent}">'
                 f'<mxGeometry x="{ax - px}" y="{ay - py}" width="{sz}" height="{sz}" as="geometry"/></mxCell>')


def _style_of(name):
    return K8S + f"prIcon={name[4:]};" if name.startswith("k8s:") else _img_style(name)


def _pad(cid, key, val):
    for i, c in enumerate(cells):
        if c.startswith(f'<mxCell id="{cid}" '):
            cells[i] = c.replace(' style="', f' style="{key}={val};', 1)
            return


def icons_left(cid, names, sz=30):
    """Icons stacked left of a box's label."""
    x, y = abs_pos[cid]
    w, h = size[cid]
    n = len(names)
    gap = 4
    total = n * sz + (n - 1) * gap
    for i, name in enumerate(names):
        _put(_style_of(name), x + 8 + i * (sz + gap), y + (h - sz) / 2, sz, parent_of[cid])
    _pad(cid, "spacingLeft", total + 6)


def icon_top(cid, name, sz=26):
    """Icon centred near the top of a box (used for cylinders)."""
    x, y = abs_pos[cid]
    w, h = size[cid]
    _put(_style_of(name), x + (w - sz) / 2, y + 16, sz, parent_of[cid])
    _pad(cid, "spacingTop", sz + 8)


def icon_header(cid, name, sz=18, dx=6):
    """Small icon in the title bar of a container."""
    x, y = abs_pos[cid]
    _put(_style_of(name), x + dx, y + 3, sz, parent_of[cid])


icon_header("cluster", "kubernetes.svg", 20)
icon_header("cpu", "k8s:node", 20)
icon_header("gpu", "k8s:node", 20)
icon_header("gpu", "nvidia.svg", 20, 30)
for nsid in ["ns_gw", "ns_ag", "ns_data", "ns_aig", "ns_mcp", "ns_srv", "ns_obs", "ns_plat", "ns_inf", "ns_gpuop", "ns_kube", "ns_mesh"]:
    icon_header(nsid, "k8s:ns", 16)

icon_header("vnet", "azure_Virtual_Networks.svg", 20)
icons_left("dns", ["azure_DNS_Zones.svg"], 28)
icons_left("waf", ["azure_Application_Gateways.svg"], 30)
icons_left("fw", ["azure_Firewalls.svg"], 28)
icons_left("nat", ["azure_NAT.svg"], 28)
icons_left("pe_ai", ["azure_Private_Endpoint.svg"], 28)
icons_left("pe_st", ["azure_Private_Endpoint.svg", "azure_Storage_Accounts.svg"], 26)
icons_left("hgw", ["azure_ExpressRoute_Circuits.svg"], 30)
icons_left("coredns", ["coredns.svg"], 28)
icons_left("cilium", ["cilium.svg"], 28)
icons_left("extdns", ["k8s:ep"], 28)
icons_left("gwapi", ["k8s:ing"], 28)
icons_left("ztunnel", ["istio.svg"], 26)
icons_left("waypoint", ["istio.svg"], 26)
icons_left("netpol", ["k8s:netpol"], 30)
icons_left("apps", ["k8s:user"])
icons_left("lb", ["azure_Load_Balancers.svg"])
icons_left("frontier", ["azure_Azure_OpenAI.svg", "aws_Bedrock.png", "googlecloud.svg"], 24)
icons_left("ing_ctl", ["envoy.svg", "kong.svg"], 24)
icons_left("ingress", ["k8s:ing"])
icons_left("lg", ["langchain.svg", "k8s:deploy"], 28)
icons_left("kagent", ["kagent.svg"])
if A2A:
    icons_left("partner", ["k8s:user"])
icon_top("pg", "postgresql.svg")
icon_top("redis", "redis.svg")
icons_left("aigw", ["envoy.svg", "kong.svg"], 26)
icons_left("mcp1", ["k8s:pod"], 24)
icons_left("mcp2", ["k8s:pod"], 24)
icons_left("mcp3", ["k8s:pod"], 24)
icons_left("kmcp", ["kagent.svg"], 26)
icons_left("llmd", ["llm-d.svg"], 32)
icons_left("pool", ["k8s:svc"], 26)
icons_left("kserve", ["kserve.png"], 32)
icons_left("otel", ["opentelemetry.svg"], 28)
icons_left("prom", ["prometheus.svg"], 28)
icons_left("graf", ["grafana.svg"], 28)
icons_left("lf", ["langfuse.svg"], 28)
icons_left("keda", ["keda.svg"], 28)
icons_left("kueue", ["kueue.svg"], 28)
icons_left("certm", ["cert-manager.svg"], 28)
icons_left("eso", ["external-secrets.png"], 28)
icons_left("argo", ["argo.svg"], 28)
icons_left("prefill", ["vllm.png", "k8s:pod"], 32)
icons_left("decode", ["vllm.png", "k8s:pod"], 32)
icon_top("pvc", "k8s:pvc")
icons_left("gpuop", ["nvidia.svg", "k8s:ds"], 30)
icons_left("apim", ["azure_API_Management_Services.svg"], 30)
icons_left("agc", ["aws_BedrockAgentCore.png", "amazonapigateway.svg"], 28)
icons_left("apigee", ["googlecloud.svg"], 28)
icons_left("ilb", ["k8s:svc"])
icons_left("cp", ["k8s:control_plane", "k8s:api", "k8s:etcd", "k8s:sched"], 30)

# Path of the request
n = (lambda a, b: b if A2A else a)  # label for the single-graph diagram, or for the A2A one
edge("e1", "apps", "waf", "1")
edge("e1a", "waf", "lb", "1")
edge("e1b", "lb", "ingress", "1", points=[(475, 100), (70, 100), (70, 350)])
if A2A:
    edge("e2", "ingress", "lg", "2", style="entryX=0;entryY=0.3;entryDx=0;entryDy=0;", points=[(364, 350), (364, 256)])
else:
    edge("e2", "ingress", "lg", "2")
edge("e2b", "lg", "pg", n("state", "10 state"))
if A2A:
    edge("e3", "lg", "aigw", "3 models · 6 A2A", style="exitX=0;exitY=0.75;exitDx=0;exitDy=0;",
         points=[(374, 287), (374, 503), (220, 503)])
else:
    edge("e3", "lg", "aigw", "3 mini · 5 reasoning", style="exitX=0;exitY=0.5;exitDx=0;exitDy=0;",
         points=[(370, 290), (370, 503), (220, 503)])
edge("e4a", "aigw", "llmd", "4 which pod?", style="dashed=1;", points=[(370, 615), (370, 527), (810, 527)], color="#9673a6")
edge("e4b", "aigw", "prefill", "4 mini", style="exitX=0;exitY=0.8;exitDx=0;exitDy=0;", points=[(70, 642), (70, 880), (970, 880), (970, 280)], color="#82b366")
edge("e4c", "prefill", "decode", "KV cache", color="#82b366")
edge("e6", "aigw", "pe_ai", n("6 reasoning", "5 reasoning"), points=[(90, 615), (90, 110), (1232, 110)], color="#d79b00")
edge("e6b", "pe_ai", "frontier", n("6 private link", "5 private link"), color="#d79b00")
edge("e7", "aigw", "mcp2", n("7 tools", "8 tools"), points=[(360, 640), (360, 647)])
edge("e7b", "mcp3", "hgw", n("7 → core", "8 → core"), points=[(660, 702), (660, 890), (1410, 890), (1410, 960)])
edge("e7c", "hgw", "core", n("7 private circuit", "8 private circuit"))
edge("ew", "pe_st", "pvc", "weights", style="dashed=1;", points=[(1645, 60), (1645, 115), (1410, 115), (1410, 630)], color="#666666")
edge("eB1", "lg", "optB", "option B", style="dashed=1;", points=[(650, 255 if A2A else 260), (650, 104), (1920, 104)], color="#d79b00")
edge("eB2", "optB", "frontier", "", style="dashed=1;", points=[(2060, -165)], color="#d79b00")
edge("eB3", "ilb", "decode", "self-hosted", style="dashed=1;", color="#d79b00")
edge("eB4", "optB", "ilb", "", style="dashed=1;", points=[(1540, 560)], color="#d79b00")
if A2A:
    edge("eA7", "aigw", "kagent", "7 A2A task", style="exitX=0.83;exitY=0;exitDx=0;exitDy=0;entryX=1;entryY=0.5;entryDx=0;entryDy=0;",
         points=[(300, 515), (652, 515), (652, 445)], color=BLUE_A2A)
    edge("eA7b", "kagent", "spg", "7", style="exitX=0.5;exitY=0;exitDx=0;exitDy=0;entryX=0.5;entryY=1;entryDx=0;entryDy=0;", color=BLUE_A2A)
    edge("eA9", "aigw", "fw", "9 A2A to partners", style="dashed=1;exitX=0;exitY=0.3;exitDx=0;exitDy=0;",
         points=[(94, 597), (94, 92), (767, 92)], color=BLUE_A2A)
    edge("eA9b", "fw", "partner", "9", style="dashed=1;", color=BLUE_A2A)

# Legend
steps_single = [
    "1 The app reaches the cluster through the load balancer and the ingress proxy.",
    "2 The ingress routes the call to a LangGraph pod; state goes to PostgreSQL.",
    "3 The supervisor asks the AI gateway for the alias mini.",
    "4 mini is self-hosted: the gateway asks llm-d which pod, then calls that vLLM pod.",
    "5 A worker agent asks the AI gateway for the alias reasoning.",
    "6 reasoning is a frontier model: the AI gateway calls the external API.",
    "7 Tool calls go through the AI gateway to the MCP pods, then to the core systems.",
    "8 The reply streams back to the app; the OTel Collector traces every hop.",
]
steps_a2a = [
    "1 The app reaches the cluster through the WAF, the load balancer and the ingress proxy.",
    "2 The ingress routes the call to the concierge agent.",
    "3 The concierge asks the AI gateway for a model; every agent does the same.",
    "4 mini is self-hosted: the gateway asks llm-d which pod, then calls that vLLM pod.",
    "5 reasoning is a frontier model: the AI gateway calls the external API through the private endpoint.",
    "6 The concierge delegates over A2A; the AI gateway checks identity and limits.",
    "7 The gateway forwards the task to the specialist's A2A endpoint, served by kagent.",
    "8 The specialist calls its tools through the AI gateway: MCP pods, then the core systems.",
    "9 Agents of other companies are reached the same way: A2A through the gateway, out through the egress firewall.",
    "10 Each agent keeps its own state in PostgreSQL; the OTel Collector traces every hop.",
]
steps = steps_a2a if A2A else steps_single
net = [
    "Only the WAF and ingress load balancer have public IPs; nodes, pods and the Kubernetes API are private.",
    "Models and storage are reached through private endpoints (Private Link / PrivateLink / PSC); everything else leaves through the egress firewall and NAT.",
    "Core systems are reached over ExpressRoute / Direct Connect / Cloud Interconnect. Inside the cluster: Cilium, default-deny NetworkPolicies and optional mTLS (Istio ambient).",
]
legend = "<b>Path of a request</b><br>" + "<br>".join(
    f"<b>{escape(s.split(' ', 1)[0])}</b> {escape(s.split(' ', 1)[1])}" for s in steps)
legend += "<br><br><b>Networking</b><br>" + "<br>".join(escape(n) for n in net)
if A2A:
    legend += ("<br><br><i>Without kagent the picture is the same: each agent serves its own A2A endpoint. "
               "Steps 6-7 are a choice: agents of one team can also call each other directly, pod to pod. "
               "Keep the gateway at the border, between teams and with other companies. Blue: A2A.</i>")
legend += "<br><i>Dashed orange, a managed gateway outside the cluster. Only self-hosted calls re-enter.</i>"
add("legend", legend, "rounded=1;arcSize=4;whiteSpace=wrap;html=1;align=left;verticalAlign=top;spacing=12;fontSize=13;" + WHITE,
    -40, 1500, 1090, 370 if A2A else 330)

# Cloud mapping legend (bottom right): the networking pieces named in the diagram, per provider
rows = [
    ("Virtual network", "Azure VNet", "Amazon VPC", "Google Cloud VPC"),
    ("Managed Kubernetes", "AKS", "EKS", "GKE"),
    ("WAF + L7 load balancer", "Application Gateway + WAF", "ALB + AWS WAF", "Cloud Load Balancing + Cloud Armor"),
    ("Ingress / internal LB", "Azure Load Balancer", "NLB (Load Balancer Controller)", "Internal Application LB"),
    ("Egress firewall", "Azure Firewall", "AWS Network Firewall", "Cloud NGFW"),
    ("NAT gateway", "Azure NAT Gateway", "NAT Gateway", "Cloud NAT"),
    ("Private endpoint: models", "Private Link → Azure OpenAI", "PrivateLink → Bedrock", "Private Service Connect → Vertex AI"),
    ("Private endpoint: storage", "Private Endpoint → Blob", "VPC endpoint → S3", "Private Google Access → GCS"),
    ("Public DNS", "Azure DNS", "Route 53", "Cloud DNS"),
    ("Private DNS", "Private DNS zones", "Route 53 private hosted zones", "Cloud DNS private zones"),
    ("Hybrid connectivity", "ExpressRoute / VPN Gateway", "Direct Connect / Site-to-Site VPN", "Cloud Interconnect / Cloud VPN"),
    ("Managed AI gateway (option B)", "API Management", "AgentCore Gateway / API Gateway", "Apigee"),
]
th = "padding:3px 8px;color:#ffffff;text-align:left;"
td = "padding:2px 8px;border-top:1px solid #dddddd;text-align:left;"
tbl = ("<b>Networking services by cloud</b><table style='border-collapse:collapse;margin-top:6px;width:100%;font-size:12px'>"
       f"<tr><th style='{th}background:#555555'>In the diagram</th><th style='{th}background:#0078D4'>Azure</th>"
       f"<th style='{th}background:#FF9900'>AWS</th><th style='{th}background:#4285F4'>Google Cloud</th></tr>")
for r in rows:
    tbl += "<tr>" + "".join(f"<td style='{td}{'font-weight:bold;' if i == 0 else ''}'>{escape(c)}</td>"
                            for i, c in enumerate(r)) + "</tr>"
tbl += "</table>"
add("clouds", tbl, "rounded=1;whiteSpace=wrap;html=1;align=left;verticalAlign=top;spacing=12;fontSize=13;arcSize=4;" + WHITE,
    1070, 1500, 1050, 370 if A2A else 330)

xml = ('<mxfile host="drawio"><diagram id="k8s" name="' + ("Self-hosted AI on Kubernetes with A2A" if A2A else "Self-hosted AI on Kubernetes") + '">'
       '<mxGraphModel dx="1900" dy="1700" grid="1" gridSize="10" page="0" adaptiveColors="none"><root>'
       '<mxCell id="0"/><mxCell id="1" parent="0"/>' + "".join(cells) +
       '</root></mxGraphModel></diagram></mxfile>')
out = Path(__file__).with_name("k8s-a2a-agents.drawio" if A2A else "k8s-self-hosted-inference.drawio")
out.write_text(xml, encoding="utf-8")
print(out, len(cells), "cells")
