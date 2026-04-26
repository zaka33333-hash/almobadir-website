# Brand fonts — drop files here

The site will look for these files in this folder. Drop in any format you have (`.woff2` preferred for web, but `.woff`, `.otf`, or `.ttf` all work — the CSS will pick whichever exists).

## Required files

### Mostaqbali — display / titles / hero wordmark
- `Mostaqbali-Regular.woff2` *(or .woff / .otf / .ttf)*
- `Mostaqbali-Medium.woff2`
- `Mostaqbali-Bold.woff2`
- `Mostaqbali-Black.woff2`

### Graphik Arabic — body / headings / UI text
- `GraphikArabic-Regular.woff2`
- `GraphikArabic-Medium.woff2`
- `GraphikArabic-Semibold.woff2`
- `GraphikArabic-Bold.woff2`

### Madani Arabic — alt accent (sometimes)
- `MadaniArabic-Regular.woff2`
- `MadaniArabic-Medium.woff2`
- `MadaniArabic-Bold.woff2`

## If you only have OTF/TTF

The site still works — `assets/fonts.css` declares all four formats per weight, browser picks the first that loads. No conversion needed unless you want optimized file sizes.

To convert OTF → WOFF2 for smaller files: drop them at https://cloudconvert.com/otf-to-woff2 (or use `fonttools` CLI: `pyftsubset font.otf --flavor=woff2 --output-file=font.woff2`).

## Naming convention

If your files have different names (e.g., `Mostaqbali_Bold.otf` instead of `Mostaqbali-Bold.woff2`), either:
1. Rename them to match the list above, or
2. Edit the `src:` paths in `assets/fonts.css`.

## Licensing

Mostaqbali, Graphik Arabic, and Madani Arabic are commercial typefaces. Make sure your license covers web use (web-font format) before deploying — desktop-only licenses don't cover serving via `@font-face`.

## Until the files are here

The site falls back to **Reem Kufi + Tajawal + Cairo** (free, loaded from Google Fonts). It looks close but isn't canonical. Drop the brand fonts in to lock the real typography.
