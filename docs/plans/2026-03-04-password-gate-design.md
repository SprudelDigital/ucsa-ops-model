# Password Gate Design

**Date:** 2026-03-04
**Status:** Approved

## Problem

The UCSA ops model app is publicly accessible. Access should be restricted to authorised stakeholders via a password prompt.

## Approach: Client-side password gate with localStorage persistence (Option A)

### Architecture

- A `PasswordGate` component wraps the entire app in `main.jsx`
- On mount, it checks `localStorage` for an `authenticated` flag
- If flag is absent or false, renders a password prompt instead of the app
- On correct password entry, sets the flag in `localStorage` and renders the app
- On incorrect entry, shows an error message

### Components

- `src/PasswordGate.jsx` — new component, self-contained
- `src/main.jsx` — wrap `<App />` with `<PasswordGate>`

### Data Flow

1. User opens app → `PasswordGate` checks `localStorage.getItem('ucsa_auth')`
2. If `'true'` → render `<App />`
3. If not → render password form
4. User submits password → compare to hardcoded value
5. Match → set `localStorage.setItem('ucsa_auth', 'true')`, render `<App />`
6. No match → display error, clear input

### Caveats

- Password is visible in the compiled JS bundle (client-side only, no backend)
- Suitable as a stakeholder deterrent, not enterprise security
- localStorage persists until user clears browser data
