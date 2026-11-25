"""Standard (Ukrainian) Cyrillic forms for Sofia Sans Condensed.

Sofia Sans Condensed (SIL OFL 1.1, @fontsource-variable/sofia-sans-condensed, see package.json) ships
Bulgarian letterforms as the default Cyrillic and standard forms only under `locl` for RUS, so text with
lang="uk" renders Bulgarian shapes (в, г, д, т…). This script maps those code points to the standard
glyphs that already exist in the font and writes a woff2 to src/assets/fonts/ under a new family name
(OFL: a modified version is renamed). Run once after updating the font package:
    pip install fonttools brotli && python scripts/patch-cyrillic-font.py
"""
from pathlib import Path
from fontTools.ttLib import TTFont

SRC = Path("node_modules/@fontsource-variable/sofia-sans-condensed/files/sofia-sans-condensed-cyrillic-wght-normal.woff2")
OUT = Path("src/assets/fonts/servisant-display-cyrillic.woff2")
FAMILY = "Servisant Display"

font = TTFont(SRC)
gsub = font["GSUB"].table
mapping = {}
for rec in gsub.FeatureList.FeatureRecord:
    if rec.FeatureTag != "locl":
        continue
    for idx in rec.Feature.LookupListIndex:
        for st in gsub.LookupList.Lookup[idx].SubTable:
            mapping.update(getattr(st, "mapping", {}) or {})
for table in font["cmap"].tables:
    if not table.isUnicode():
        continue
    for cp, glyph in list(table.cmap.items()):
        if glyph in mapping:
            table.cmap[cp] = mapping[glyph]
for rec in font["name"].names:
    if rec.nameID in (1, 4, 16):
        rec.string = FAMILY
    elif rec.nameID == 6:
        rec.string = FAMILY.replace(" ", "")
font.flavor = "woff2"
OUT.parent.mkdir(parents=True, exist_ok=True)
font.save(OUT)
print(f"{OUT}: {len(mapping)} glyphs remapped")
