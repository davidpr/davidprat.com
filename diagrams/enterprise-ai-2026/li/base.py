"""Shared base for the LinkedIn-readable diagrams (1200 px wide, large fonts).

LinkedIn shows article images about 744 px wide, so a 1200 px canvas is scaled by ~0.62:
keep every font >= 20 px (>= 12 px on screen). Output goes to ../png and ../svg.
"""
import os
import subprocess
from xml.sax.saxutils import escape

HERE = os.path.dirname(os.path.abspath(__file__))
SVG_DIR = os.path.join(HERE, "..", "svg")
PNG_DIR = os.path.join(HERE, "..", "png")
os.makedirs(SVG_DIR, exist_ok=True)
os.makedirs(PNG_DIR, exist_ok=True)
W = 1200          # canvas width for every diagram
MIN_FONT = 20     # smallest font size allowed anywhere

# Palette
NAVY = "#0B1F3A"
SLATE = "#475569"
MUTED = "#94A3B8"
BG = "#FFFFFF"
SOFT = "#F1F5F9"
BLUE = "#2563EB"
BLUE_L = "#DBEAFE"
TEAL = "#0F766E"
TEAL_L = "#CCFBF1"
AMBER = "#B45309"
AMBER_L = "#FEF3C7"
VIOLET = "#6D28D9"
VIOLET_L = "#EDE9FE"
ROSE = "#BE123C"
ROSE_L = "#FFE4E6"
GREEN = "#15803D"
GREEN_L = "#DCFCE7"
FONT = "Helvetica Neue, Helvetica, Arial, sans-serif"
AUTHOR = "David Prat Robles  ·  linkedin.com/in/davidpratrobles"


class Svg:
    def __init__(self, h, title=None, subtitle=None, w=W):
        """Canvas of width W. Title 46 px, subtitle 25 px (wrapped). self.top = first free y below the header."""
        self.w, self.h = w, h
        self.parts = []
        self.parts.append(f'<rect x="0" y="0" width="{w}" height="{h}" fill="{BG}"/>')
        y = 40
        if title:
            for line in self.wrap(title, w - 100, 46):
                y += 52
                self.text(50, y, line, 46, NAVY, weight="700")
        if subtitle:
            y += 12
            for line in self.wrap(subtitle, w - 100, 25):
                y += 34
                self.text(50, y, line, 25, SLATE)
        self.top = y + 40
        self.text(w - 30, h - 22, AUTHOR, 20, MUTED, anchor="end")

    # primitives -----------------------------------------------------------
    def rect(self, x, y, w, h, fill=SOFT, stroke=None, rx=14, sw=2, dash=None):
        st = f' stroke="{stroke}" stroke-width="{sw}"' if stroke else ""
        da = f' stroke-dasharray="{dash}"' if dash else ""
        self.parts.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}"{st}{da}/>')

    def text(self, x, y, s, size=22, fill=NAVY, weight="400", anchor="start", italic=False):
        assert size >= MIN_FONT, f"font {size} < {MIN_FONT}: {s!r}"
        style = ' font-style="italic"' if italic else ""
        self.parts.append(
            f'<text x="{x}" y="{y}" font-family="{FONT}" font-size="{size}" font-weight="{weight}" '
            f'fill="{fill}" text-anchor="{anchor}"{style}>{escape(s)}</text>')

    def lines(self, x, y, lines, size=22, fill=NAVY, weight="400", anchor="start", lh=1.3):
        for i, s in enumerate(lines):
            self.text(x, y + i * size * lh, s, size, fill, weight, anchor)

    def wrap(self, s, width, size):
        max_chars = max(6, int(width / (size * 0.56)))
        out, cur = [], ""
        for word in s.split():
            if len(cur) + len(word) + 1 > max_chars and cur:
                out.append(cur)
                cur = word
            else:
                cur = f"{cur} {word}".strip()
        if cur:
            out.append(cur)
        return out

    def box(self, x, y, w, h, title, body=None, fill=SOFT, stroke=None, tcolor=NAVY,
            tsize=26, bsize=21, center=False, bcolor=SLATE):
        self.rect(x, y, w, h, fill, stroke)
        pad = 18
        if center:
            tl = self.wrap(title, w - 2 * pad, tsize)
            bl = []
            if body:
                for para in body if isinstance(body, list) else [body]:
                    bl += self.wrap(para, w - 2 * pad, bsize)
            total = len(tl) * tsize * 1.25 + (len(bl) * bsize * 1.3 + 6 if bl else 0)
            ty = y + (h - total) / 2 + tsize
            self.lines(x + w / 2, ty, tl, tsize, tcolor, "700", "middle", 1.25)
            if bl:
                self.lines(x + w / 2, ty + len(tl) * tsize * 1.25 + 6, bl, bsize, bcolor, "400", "middle")
        else:
            tl = self.wrap(title, w - 2 * pad, tsize)
            self.lines(x + pad, y + pad + tsize, tl, tsize, tcolor, "700", "start", 1.25)
            if body:
                yy = y + pad + tsize + len(tl) * tsize * 1.25 + 4
                for para in body if isinstance(body, list) else [body]:
                    bl = self.wrap(para, w - 2 * pad, bsize)
                    self.lines(x + pad, yy, bl, bsize, bcolor)
                    yy += len(bl) * bsize * 1.3 + 4

    def arrow(self, x1, y1, x2, y2, color=SLATE, sw=4, dash=None, both=False):
        mid = f"m{abs(hash((x1, y1, x2, y2, color))) % 10**8}"
        self.parts.append(
            f'<defs><marker id="{mid}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" '
            f'orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="{color}"/></marker></defs>')
        da = f' stroke-dasharray="{dash}"' if dash else ""
        start = f' marker-start="url(#{mid})"' if both else ""
        self.parts.append(
            f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{color}" stroke-width="{sw}"{da}'
            f' marker-end="url(#{mid})"{start}/>')

    def pill(self, x, y, s, fill=BLUE_L, color=BLUE, size=20):
        w = len(s) * size * 0.56 + 26
        self.rect(x, y, w, size + 16, fill, None, rx=(size + 16) / 2)
        self.text(x + w / 2, y + size + 4, s, size, color, "600", "middle")
        return w

    def label_band(self, x, y, h, s, color):
        self.rect(x, y, 40, h, color, None, rx=10)
        cx, cy = x + 20, y + h / 2
        self.parts.append(
            f'<text x="{cx}" y="{cy}" font-family="{FONT}" font-size="20" font-weight="700" fill="#FFFFFF" '
            f'text-anchor="middle" transform="rotate(-90 {cx} {cy})" dominant-baseline="middle">{escape(s)}</text>')


    def path_arrow(self, pts, color=SLATE, sw=4, dash=None):
        mid = f"p{abs(hash((tuple(pts), color))) % 10**8}"
        self.parts.append(
            f'<defs><marker id="{mid}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" '
            f'orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="{color}"/></marker></defs>')
        da = f' stroke-dasharray="{dash}"' if dash else ""
        d = "M" + " L".join(f"{x},{y}" for x, y in pts)
        self.parts.append(f'<path d="{d}" fill="none" stroke="{color}" stroke-width="{sw}"{da} marker-end="url(#{mid})"/>')

    def badge(self, x, y, label, color=NAVY, r=19):
        self.parts.append(f'<circle cx="{x}" cy="{y}" r="{r}" fill="{color}"/>')
        self.text(x, y + 7, label, 20, "#FFFFFF", "700", "middle")

    def save(self, name):
        svg = (f'<svg xmlns="http://www.w3.org/2000/svg" width="{self.w}" height="{self.h}" '
               f'viewBox="0 0 {self.w} {self.h}">' + "".join(self.parts) + "</svg>")
        p_svg = os.path.join(SVG_DIR, name + ".svg")
        p_png = os.path.join(PNG_DIR, name + ".png")
        with open(p_svg, "w") as f:
            f.write(svg)
        subprocess.run(["rsvg-convert", "-w", str(self.w), "-o", p_png, p_svg], check=True)
        print("wrote", p_png)


