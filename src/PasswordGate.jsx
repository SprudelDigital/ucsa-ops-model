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
      background: "#080E1A",
      fontFamily: "'Inter', sans-serif",
    }}>
      <div style={{
        background: "#0D1526",
        border: "1px solid #1A2540",
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
            aria-label="Access password"
            autoFocus
            style={{
              width: "100%",
              padding: "12px 16px",
              background: "#080E1A",
              border: `1px solid ${error ? "#ef4444" : "#1A2540"}`,
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
              background: "#C4D32F",
              border: "none",
              borderRadius: "8px",
              color: "#080E1A",
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
