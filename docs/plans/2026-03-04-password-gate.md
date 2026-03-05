# Password Gate Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a client-side password prompt that gates access to the UCSA ops model app, with localStorage persistence so users aren't re-prompted on the same device.

**Architecture:** A `PasswordGate` component wraps `<App />` in `main.jsx`. On mount it reads `localStorage` for an auth flag; if absent it renders a password form instead of the app. On correct entry it sets the flag and unmounts the gate. No backend — this is a stakeholder deterrent, not enterprise security.

**Tech Stack:** React 19, Vite 7, plain CSS-in-JS (inline styles, matching the existing app's style approach — no Tailwind or CSS modules present)

---

### Task 1: Create `PasswordGate` component

**Files:**
- Create: `src/PasswordGate.jsx`

**Step 1: Create the file with this exact content**

```jsx
import { useState } from "react";

const STORAGE_KEY = "ucsa_auth";
const CORRECT_PASSWORD = "EnergyWealth2030";

export default function PasswordGate({ children }) {
  const [authenticated, setAuthenticated] = useState(
    () => localStorage.getItem(STORAGE_KEY) === "true"
  );
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);

  if (authenticated) return children;

  function handleSubmit(e) {
    e.preventDefault();
    if (input === CORRECT_PASSWORD) {
      localStorage.setItem(STORAGE_KEY, "true");
      setAuthenticated(true);
    } else {
      setError(true);
      setInput("");
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#0a0a0a",
      fontFamily: "'Inter', sans-serif",
    }}>
      <div style={{
        background: "#111",
        border: "1px solid #222",
        borderRadius: "16px",
        padding: "48px",
        width: "100%",
        maxWidth: "400px",
        textAlign: "center",
      }}>
        <div style={{ fontSize: "32px", marginBottom: "8px" }}>◈</div>
        <h1 style={{
          color: "#fff",
          fontSize: "20px",
          fontWeight: 600,
          marginBottom: "8px",
        }}>
          UCSA Operations Model
        </h1>
        <p style={{ color: "#666", fontSize: "14px", marginBottom: "32px" }}>
          Enter the access password to continue
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(false); }}
            placeholder="Password"
            autoFocus
            style={{
              width: "100%",
              padding: "12px 16px",
              background: "#0a0a0a",
              border: `1px solid ${error ? "#ef4444" : "#333"}`,
              borderRadius: "8px",
              color: "#fff",
              fontSize: "15px",
              outline: "none",
              boxSizing: "border-box",
              marginBottom: "8px",
            }}
          />
          {error && (
            <p style={{ color: "#ef4444", fontSize: "13px", marginBottom: "12px" }}>
              Incorrect password. Please try again.
            </p>
          )}
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              background: "#34D399",
              border: "none",
              borderRadius: "8px",
              color: "#0a0a0a",
              fontWeight: 600,
              fontSize: "15px",
              cursor: "pointer",
              marginTop: "8px",
            }}
          >
            Enter
          </button>
        </form>
      </div>
    </div>
  );
}
```

**Step 2: Verify the file exists**

```bash
ls src/PasswordGate.jsx
```
Expected: file listed

---

### Task 2: Wrap `<App />` with `<PasswordGate>` in `main.jsx`

**Files:**
- Modify: `src/main.jsx`

**Step 1: Replace the content of `src/main.jsx`**

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import PasswordGate from './PasswordGate.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PasswordGate>
      <App />
    </PasswordGate>
  </React.StrictMode>,
)
```

**Step 2: Run the dev server and manually verify**

```bash
npm run dev
```

Open browser → should see dark password screen
Enter wrong password → should see red error
Enter `EnergyWealth2030` → should see the app
Refresh page → should go straight to app (localStorage persists)
Open DevTools → Application → Local Storage → clear `ucsa_auth` → refresh → should see password screen again

---

### Task 3: Commit and push

```bash
git add src/PasswordGate.jsx src/main.jsx docs/plans/2026-03-04-password-gate.md docs/plans/2026-03-04-password-gate-design.md
git commit -m "feat: add client-side password gate with localStorage persistence"
git push
```

Expected: push succeeds, changes visible on GitHub
