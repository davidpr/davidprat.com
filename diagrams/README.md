# Diagram sources

Sources of the diagrams published in the articles of this site.

## enterprise-ai-2026

Diagrams of [How enterprises are wiring AI in 2026](https://davidprat.com/posts/how-enterprises-are-wiring-ai-2026).

- `make_diagrams.py` + `li/`: the LinkedIn versions of all 18 diagrams. Each one is written as SVG from Python,
  1200 px wide with fonts of at least 20 px so it stays readable at the ~744 px LinkedIn shows; Pillow measures
  the text and `rsvg-convert` renders the PNGs.
  Run `python3 make_diagrams.py` (needs `rsvg-convert` and Pillow). Output: `svg/` (kept in git) and `png/`.
- `drawio/make_k8s_drawio.py`: the full-size draw.io versions of the two Kubernetes diagrams, with the network
  layer, the logos in `drawio/icons/` and a table of networking services per cloud.
  Run `python3 make_k8s_drawio.py` (single LangGraph service) or `python3 make_k8s_drawio.py a2a` (one service
  per agent, A2A). Export a PNG with the draw.io desktop CLI:
  `/Applications/draw.io.app/Contents/MacOS/draw.io -x -f png -e -s 2 -b 20 -o k8s-a2a-agents.drawio.png k8s-a2a-agents.drawio`.

The published copies live in `public/posts/linkedin-enterprise-ai-wiring-2026/`.
Logos in `drawio/icons/` belong to their projects (CNCF artwork, Simple Icons, AWS, Azure and project repositories).
