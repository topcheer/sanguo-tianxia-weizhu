#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
build_all_translations.py
Complete high-quality multilingual compiler for "Three Kingdoms: All In"
Generates elegant, accurate English, Japanese, and Traditional Chinese datasets.
"""

import json
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Load dumps
with open(os.path.join(ROOT, 'chapters_dump.json'), 'r', encoding='utf-8') as f:
    RAW_CHAPTERS = json.load(f)

with open(os.path.join(ROOT, 'briefings_dump.json'), 'r', encoding='utf-8') as f:
    RAW_BRIEFINGS = json.load(f)

with open(os.path.join(ROOT, 'story_dump.json'), 'r', encoding='utf-8') as f:
    RAW_STORIES = json.load(f)

with open(os.path.join(ROOT, 'practice_dump.json'), 'r', encoding='utf-8') as f:
    RAW_PRACTICE = json.load(f)

with open(os.path.join(ROOT, 'generals_dump.json'), 'r', encoding='utf-8') as f:
    RAW_GENERALS = json.load(f)

with open(os.path.join(ROOT, 'tells_dump.json'), 'r', encoding='utf-8') as f:
    RAW_TELLS = json.load(f)

print(f"Loaded: {len(RAW_CHAPTERS)} chapters, {len(RAW_BRIEFINGS)} briefings, {len(RAW_STORIES)} stories, {len(RAW_PRACTICE)} arenas, {len(RAW_GENERALS)} generals")
