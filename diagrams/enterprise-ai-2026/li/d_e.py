"""13 - The LangGraph graph of the claims assistant (flat supervisor), with the steps of the worked example."""
from base import *


def langgraph_graph():
    s = Svg(1900, "The LangGraph graph behind the claims assistant",
            "One supervisor, specialised workers, a deterministic fraud check and a human-approval pause. Numbers = steps of use case 1 (section 6)")
    y0 = s.top
    cx = 600

    def node(x, y, w, h, title, body, fill, stroke):
        s.box(x, y, w, h, title, body, fill, stroke, tsize=26, bsize=21, center=True)

    # START
    s.rect(cx - 70, y0, 140, 50, NAVY, None, rx=25)
    s.text(cx, y0 + 33, "START", 22, "#FFFFFF", "700", "middle")
    s.arrow(cx, y0 + 52, cx, y0 + 98, SLATE)
    # supervisor
    y1 = y0 + 100
    node(cx - 260, y1, 520, 130, "supervisor", ["classifies the intent (small model)", "hands over with Command(goto=...)"], BLUE_L, BLUE)
    s.badge(cx + 290, y1 + 30, "7", ROSE)
    # three branches
    y2 = y1 + 250
    s.path_arrow([(cx - 120, y1 + 132), (cx - 120, y1 + 180), (250, y1 + 180), (250, y2 - 2)], SLATE)
    s.arrow(cx, y1 + 132, cx, y2 - 2, SLATE)
    s.path_arrow([(cx + 120, y1 + 132), (cx + 120, y1 + 180), (950, y1 + 180), (950, y2 - 2)], SLATE)
    s.text(250 + 12, y1 + 220, "report_claim", 20, SLATE, "600")
    s.text(cx + 12, y1 + 220, "coverage_question", 20, SLATE, "600")
    s.text(950 + 12, y1 + 220, "other", 20, SLATE, "600")
    node(60, y2, 380, 170, "intake agent", ["create_agent + MCP tools", "get_policy · create_claim_draft"], VIOLET_L, VIOLET)
    s.badge(420, y2 + 20, "9", ROSE); s.badge(420, y2 + 62, "10", ROSE); s.badge(420, y2 + 104, "12", ROSE); s.badge(420, y2 + 146, "13", ROSE)
    node(470, y2, 260, 170, "coverage agent", ["create_agent +", "search_policy_wording"], VIOLET_L, VIOLET)
    s.badge(712, y2 + 20, "11", ROSE)
    node(790, y2, 340, 170, "handoff to a human", ["anything the assistant", "should not answer"], SOFT, SLATE)
    # coverage -> END on the right side
    y3 = y2 + 290
    s.arrow(250, y2 + 172, 250, y3 - 2, SLATE)
    node(60, y3, 380, 150, "fraud_check", ["plain Python: rules + score", "it flags, it never decides"], AMBER_L, AMBER)
    s.badge(420, y3 + 20, "14", ROSE)
    # low risk -> END
    y4 = y3 + 270
    s.arrow(250, y3 + 152, 250, y4 - 2, ROSE, dash="7 5")
    s.text(265, y3 + 200, "high value or fraud signal:", 20, ROSE, "700")
    s.text(265, y3 + 226, "review task on Service Bus", 20, ROSE, "600")
    node(60, y4, 380, 170, "human_review", ["interrupt(): graph pauses", "state saved in PostgreSQL"], ROSE_L, ROSE)
    s.badge(420, y4 + 20, "17", ROSE)
    y5 = y4 + 270
    s.arrow(250, y4 + 172, 250, y5 - 2, SLATE)
    s.text(265, y4 + 210, "Command(resume=decision)", 20, SLATE, "600")
    s.text(265, y4 + 236, "from the handler workbench", 20, SLATE, "600")
    node(60, y5, 380, 120, "notify", ["decision → Notification Hubs"], GREEN_L, GREEN)
    s.badge(420, y5 + 20, "18", ROSE)
    # END node
    yend = y5 + 200
    s.rect(cx - 70, yend, 140, 50, NAVY, None, rx=25)
    s.text(cx, yend + 33, "END", 22, "#FFFFFF", "700", "middle")
    s.path_arrow([(250, y5 + 122), (250, yend + 25), (cx - 72, yend + 25)], SLATE)
    s.path_arrow([(600, y2 + 172), (600, yend - 2)], SLATE)
    s.path_arrow([(960, y2 + 172), (960, yend + 25), (cx + 72, yend + 25)], SLATE)
    # low-risk path from fraud_check to END
    s.path_arrow([(442, y3 + 75), (552, y3 + 75), (552, yend + 10), (cx - 72, yend + 10)], SLATE, dash="7 5")
    s.text(456, y3 + 60, "low risk", 20, SLATE, "600")
    # gateway note
    yn = yend + 100
    s.rect(50, yn, 1100, 160, BLUE, None, rx=16)
    s.text(80, yn + 48, "Every arrow out of the graph goes through the AI gateway", 26, "#FFFFFF", "700")
    s.text(80, yn + 88, "LLM calls (supervisor, agents) → APIM AI gateway: token limits, failover, caching", 22, "#DBEAFE")
    s.text(80, yn + 124, "Tool calls (MCP) → APIM MCP gateway with the customer's OAuth token", 22, "#DBEAFE")
    s.h = yn + 230
    s.parts[0] = f'<rect x="0" y="0" width="{s.w}" height="{s.h}" fill="{BG}"/>'
    # move author footer
    for i, p in enumerate(s.parts):
        if AUTHOR in p:
            s.parts[i] = p.replace(f'y="{1900 - 22}"', f'y="{s.h - 22}"')
    s.save("13-langgraph-graph")


def main():
    langgraph_graph()


if __name__ == "__main__":
    main()
