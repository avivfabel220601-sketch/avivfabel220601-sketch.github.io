# Security

## XSS Prevention

- Never set `innerHTML` with user-supplied content — use `textContent` or `innerText`
- If HTML rendering is required, sanitize with a trusted library (e.g. DOMPurify)
- Never use `eval()`, `new Function()`, or `setTimeout(string)` with dynamic content
- Treat all data from `URL params`, `localStorage`, `postMessage`, and external APIs as untrusted

## Injection

- Never interpolate user input directly into SQL, shell commands, or URLs without encoding
- Use `encodeURIComponent` when inserting user values into URLs
- Validate and sanitize at the system boundary (user input, external APIs) — not deep in business logic

## Sensitive Data

- Never log passwords, tokens, or PII — not even in dev/debug code
- Never hardcode API keys, secrets, or credentials in source files
- Store secrets in environment variables, never in the repo
- Avoid storing sensitive data in `localStorage` — it's accessible to any JS on the page

## Network

- Always use HTTPS — never send sensitive data over HTTP
- Set `Content-Security-Policy` headers to restrict script sources
- Use `SameSite=Strict` or `SameSite=Lax` on cookies to prevent CSRF
- Validate all data received from external APIs — don't trust shape or type

## Code Review Checklist

- `[critical]` — XSS, injection, exposed secrets, broken auth
- `[major]` — missing input validation, insecure storage, unencrypted sensitive data
- `[minor]` — overly permissive CORS, missing HTTPS enforcement
- `[nit]` — unused permissions, verbose error messages leaking internals
