"""Resize and save the admission poster used by the splash overlay."""

import os
import sys

from PIL import Image

MAX_W, MAX_H = 1000, 1500


def main(src, dst):
    if not os.path.exists(src):
        sys.exit(f"Source not found: {src}")

    os.makedirs(os.path.dirname(dst), exist_ok=True)
    im = Image.open(src)
    if im.mode != "RGB":
        im = im.convert("RGB")

    im.thumbnail((MAX_W, MAX_H), Image.LANCZOS)
    im.save(dst, "JPEG", quality=88, optimize=True, progressive=True)

    kb = os.path.getsize(dst) // 1024
    print(f"Poster saved -> {dst}")
    print(f"  size   : {im.size[0]}x{im.size[1]}")
    print(f"  weight : {kb} KB")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit("usage: set_poster.py <source> <destination>")
    main(sys.argv[1], sys.argv[2])