# Workflows

## Debugging

1. Restate observed behavior vs. expected behavior
2. Identify the smallest reproducible case
3. Check assumptions — types, timing, scope, browser quirks
4. Propose fix with explanation of root cause
5. Suggest a test to confirm the fix

**Example output:**
```
Most likely causes:
1. Event listener attached before DOM is ready — wrap in `DOMContentLoaded`
2. Selector mismatch — check `document.querySelector('#id')` returns the element
3. Button covered by another element (check z-index / pointer-events)
```

---

## Code Review

1. Scan for correctness bugs first
2. Check for security issues (XSS, injection, exposed data)
3. Evaluate readability and naming
4. Suggest simplifications — not rewrites
5. Deliver as a numbered list, severity-tagged

**Severity tags:** `[critical]` / `[minor]` / `[nit]`

**Example output:**
```
[critical] Line 12: innerHTML with user input — XSS risk. Use textContent instead.
[minor] Line 7: variable `data` is too vague — rename to `userProfile`.
[nit] Line 3: unused import.
```

---

## New Feature Implementation

1. Clarify the goal in one sentence
2. Outline the approach before writing code
3. Write the implementation
4. Call out edge cases and limitations
5. Suggest a quick manual test

---

## Research / Technical Decision

1. State the tradeoffs, not just the answer
2. Give a recommendation with reasoning
3. Flag what would change the recommendation
4. Keep it under 200 words unless depth is requested

**Example output:**
```
Flexbox — items flow in one direction and wrap naturally.
Grid — placing items in two dimensions or need explicit row/column control.

For most UI components: flexbox. For page-level layout: grid.
```

---

## Long Conversations

If a conversation exceeds ~20 exchanges, proactively summarize the key decisions made and ask if the context is still aligned.
