#!/usr/bin/env python3
"""
Combines PNG slides into PDFs for LinkedIn carousel upload.
Run from repo root:  python3 combine-pdf.py
Requires Pillow:     pip install pillow --break-system-packages
"""

from PIL import Image
import os

ROOT = os.path.dirname(os.path.abspath(__file__))

SETS = {
    'ai-pipeline-carousel.pdf': [
        'ai-pipeline-slide-1.png',
        'ai-pipeline-slide-2.png',
        'ai-pipeline-slide-3.png',
    ],
    'ai-carousel-6slides.pdf': [
        'ai-carousel-slide-1.png',
        'ai-carousel-slide-2.png',
        'ai-carousel-slide-3.png',
        'ai-carousel-slide-4.png',
        'ai-carousel-slide-5.png',
        'ai-carousel-slide-6.png',
    ],
}

for output_name, slides in SETS.items():
    missing = [s for s in slides if not os.path.exists(os.path.join(ROOT, s))]
    if missing:
        print(f'  ⚠  Skipping {output_name} — missing: {", ".join(missing)}')
        print(f'     Run  node generate-slides.js  first.')
        continue

    images = [Image.open(os.path.join(ROOT, s)).convert('RGB') for s in slides]
    out_path = os.path.join(ROOT, output_name)
    images[0].save(out_path, save_all=True, append_images=images[1:])
    print(f'  ✓  {output_name}  ({len(slides)} slides)')

print('\nUpload either PDF to LinkedIn as a Document post.')
