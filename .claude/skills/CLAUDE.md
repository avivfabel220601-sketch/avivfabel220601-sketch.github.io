# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project

**Designly** — a curated web design gallery and inspiration site. Single static file, no build step, no dependencies.

Open `index.html` directly in a browser to preview. No server required.

---

## Architecture

Everything lives in one file: [index.html](index.html)

- **CSS** — inline `<style>` block (~500 lines). All styles in one place; no external stylesheet.
- **HTML** — semantic sections: `nav`, `hero`, `stats-bar`, `info-strip`, `gallery-wrap`, `newsletter`, `footer`.
- **JS** — inline `<script>` at the bottom (~130 lines). No modules, no bundler.

### CSS Tokens

Neutral color scale via CSS custom properties:
```
--n50 through --n900   (light → dark neutrals)
--ease                 cubic-bezier(.4,0,.2,1)
--font-sans / --font-mono
```

### Card Data Model

Each gallery card is a `.card` div with `data-*` attributes used by the filter engine:
```html
<div class="card" data-tags="dark saas startup" data-name="Linear" data-desc="Issue tracking for modern teams">
```
- `data-tags` — space-separated list of filter keys (`dark`, `light`, `gradient`, `saas`, `startup`, `developer`, `productivity`, `animation`)
- `data-name` — display name, searched by the search input
- `data-desc` — short description, also searched

### Filter & Search System

State lives in two module-level variables:
```js
let activeFilter = 'all';   // set by .filt buttons and info-strip tags
let searchQuery  = '';       // set by #search input
```
Both feed into `applyFilters()` which shows/hides cards by adding/removing `.hidden`, and updates `#count`.

Info-strip tags (`[data-filter]`) scroll to the gallery then set `activeFilter` with a 400ms delay to let the scroll settle before re-rendering.

### Scroll Reveal

`IntersectionObserver` watches all `.card` elements. On intersection, it adds `.visible` which triggers the `fadeUp` keyframe. Delay is staggered by column position (`idx % 4 * 60ms`). Cards are unobserved after reveal.

### Responsive Grid

| Breakpoint | Columns |
|------------|---------|
| > 900px    | 4       |
| ≤ 900px    | 3       |
| ≤ 660px    | 2       |
| ≤ 380px    | 1       |

Mobile nav hides `.nav-links` and `.nav-actions` at ≤ 660px and shows the hamburger button + `.nav-drawer` instead.

---

## Adding Cards

Copy an existing `.card` block inside `#grid`, update `data-tags`, `data-name`, `data-desc`, and the `.card-inner` content (inline gradient background + SVG/text). The scroll-reveal observer picks up new cards automatically via the existing `querySelectorAll('.card')` call.

To add a new filter category: add a `.filt` button in `#filters` with the new `data-filter` value, and use that same value in cards' `data-tags`.
