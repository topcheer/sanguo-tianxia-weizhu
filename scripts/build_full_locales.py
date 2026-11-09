# -*- coding: utf-8 -*-
"""
scripts/build_full_locales.py
Comprehensive translation builder for all game datasets.
"""

import json
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

from translation_data.common import to_trad, PLACES, YEARS, OMENS
from translation_data.chapters_data import CHAPTERS_TRANSLATIONS

print("Common modules loaded successfully.")
