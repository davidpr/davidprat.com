"""Generate every diagram of the LinkedIn article (LinkedIn-readable version: 1200 px wide, fonts >= 20 px).

Run:  python3 make_diagrams.py
Output: png/*.png and svg/*.svg. Sources live in li/ (base.py + d_a..d_d.py).
The previous 1800 px-wide generator is kept in wide-v1/make_diagrams_wide.py (outputs in wide-v1/).
"""
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "li"))
import d_a, d_b, d_c, d_d, d_e, d_f, d_g, d_h  # noqa: E402

if __name__ == "__main__":
    for m in (d_a, d_b, d_c, d_d, d_e, d_f, d_g, d_h):
        m.main()
