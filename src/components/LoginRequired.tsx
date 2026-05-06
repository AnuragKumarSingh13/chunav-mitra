import { Link } from "react-router-dom";

export function LoginRequired() {
  return (
    <div style={{
      textAlign: "center",
      padding: "2rem",
      backgroundColor: "var(--muted-bg)",
      border: "1px solid var(--muted)",
      borderRadius: "12px",
      margin: "1rem 0"
    }}>
      <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔒</div>
      <h3 style={{ margin: "0 0 1rem 0", fontSize: "1.3rem", color: "var(--accent)" }}>
        Pehle login karein · पहले लॉगिन करें
      </h3>
      <p style={{ margin: "0 0 1.5rem 0", color: "var(--muted)" }}>
        Is feature ka istemal karne ke liye aapko login karna padega
      </p>
      <Link to="/login" className="btn btn-primary" style={{ display: "inline-block" }}>
        Login Karein · लॉगिन करें
      </Link>
    </div>
  );
}
