# Frontend

## Stack

- Default: Vanilla HTML/CSS/JS — no framework unless explicitly requested
- No build tools unless the project already uses them
- Prefer native browser APIs over polyfills when browser support allows

## HTML

- Use semantic elements: `<nav>`, `<main>`, `<section>`, `<article>`, `<header>`, `<footer>`
- Labels on every input — either `<label for>` or `aria-label`
- Buttons for actions, links for navigation — never swap them
- Void elements don't need a closing slash: `<img>` not `<img />`

## CSS

- Flexbox for one-direction flow and natural wrapping
- Grid for two-dimensional layouts or explicit row/column placement
- For most UI components: flexbox. For page-level layout: grid
- Prefer `gap` over margins between flex/grid children
- Use CSS custom properties (`--var`) for repeated values like colors and spacing
- Avoid `!important` — fix specificity instead
- Mobile-first: write base styles for small screens, add breakpoints upward

## JavaScript

- Attach event listeners after DOM is ready — use `DOMContentLoaded` or place scripts before `</body>`
- Use `querySelector` / `querySelectorAll` — verify the selector matches before debugging logic
- Prefer `const` by default, `let` when reassignment is needed, never `var`
- Use `===` not `==`
- Destructure objects and arrays when it improves readability
- Avoid `async/await` inside `forEach` — use `for...of` or `Promise.all`

## Performance

- Minimize DOM reads/writes inside loops
- Batch DOM mutations — read all, then write all (avoid layout thrash)
- Debounce scroll and resize handlers
- Lazy-load images below the fold with `loading="lazy"`
- Avoid blocking the main thread — defer heavy work with `requestIdleCallback` or Web Workers

## Browser Quirks

- Events not firing? Check `z-index` / `pointer-events: none` on overlapping elements
- `position: fixed` not working inside a transformed parent — stacking context issue
- `overflow: hidden` clips `position: fixed` children — use `overflow: clip` or restructure
- Flexbox gap not working in old Safari — check browser target or use margins as fallback

## Accessibility

- Keyboard navigation must work: tab order, focus styles, Enter/Space on buttons
- Color contrast ratio: at least 4.5:1 for normal text, 3:1 for large text
- Don't remove focus outlines without replacing them
- Use ARIA only when native semantics aren't enough — prefer native HTML first
- Test with a screen reader at least once per major UI change
