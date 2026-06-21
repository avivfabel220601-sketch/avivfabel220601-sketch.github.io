# Code Style

## Core Rules

- Simplicity over cleverness — readable and obvious beats "smart"
- No premature abstractions — don't add them before they're needed
- No features beyond what was asked
- Don't design for hypothetical future requirements
- Three similar lines is better than a premature abstraction

## Naming

- Variables, functions, and files should be named for what they represent, not how they're implemented
- Avoid vague names: `data`, `info`, `temp`, `stuff` — be specific
- Boolean names should read as a question: `isLoading`, `hasError`, `canSubmit`
- Event handlers: `handleClick`, `onSubmit` — not `click1`, `doThing`

## Comments

- Only comment the *why*, never the *what*
- If the code reads clearly, skip the comment entirely
- Never write multi-line comment blocks explaining what a function does
- Acceptable: hidden constraint, subtle invariant, workaround for a specific bug

## Dependencies

- Don't suggest adding packages for things achievable in vanilla JS/CSS
- Don't invent library APIs or function signatures you're not confident exist
- If a dependency is justified, explain *why* the native alternative falls short

## Anti-patterns to Avoid

- Over-engineering simple problems
- Adding error handling for scenarios that can't happen
- Using feature flags when you can just change the code
- Backwards-compatibility shims for code with no other consumers
- Explaining what the code does in comments instead of writing clear code
