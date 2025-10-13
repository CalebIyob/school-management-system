import React, { useState } from "react";                         // React + state
import { Link, useNavigate } from "react-router-dom";            // Router helpers
import "../styles/auth.css";                                     // Auth styles
import api from "../api";                                        // Axios instance

export default function Signup() {                               // Signup page
  const [name, setName] = useState("");                          // Name input
  const [email, setEmail] = useState("");                        // Email input
  const [role, setRole] = useState("ADMIN"); // DEFAULT TO ADMIN
  const [password, setPassword] = useState("");                  // Password input
  const [submitting, setSubmitting] = useState(false);           // Submit spinner
  const [err, setErr] = useState("");                            // Error text

  const navigate = useNavigate();                                // Nav helper

  const onSubmit = async (e) => {                                // Create account handler
    e.preventDefault();
    setErr("");
    if (!name.trim() || !email.trim() || !password) {            // Basic validation
      setErr("Please fill out name, email, and password.");
      return;
    }

    try {
      setSubmitting(true);
      // Backend should accept: { name, email, role, password }
      await api.post("/signup", {
        name: name.trim(),
        email: email.trim(),
        role,                               // will be "ADMIN" by default
        password
      });
      navigate("/", { replace: true });    // After successful sign up, go back to login.
    } catch (e) {                           // API error -> show message
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        "Sign up failed. Please try again.";
      setErr(msg);
    } finally {
      setSubmitting(false);                 // Stop spinner
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <h1 className="auth-title">Sign up</h1>

        <form className="auth-form" onSubmit={onSubmit}>
          <label className="auth-label">
            Full name:
            <input
              className="auth-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
            />
          </label>

          <label className="auth-label">
            Email:
            <input
              className="auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </label>

          <label className="auth-label">
            Role:
            <select
              className="auth-input"
              value={role}
              onChange={(e) => setRole(e.target.value)} // still changeable if you want
            >
              <option value="ADMIN">Admin</option>      {/* Default option */}
              <option value="STUDENT">Student</option>
              <option value="TEACHER">Teacher</option>
            </select>
          </label>

          <label className="auth-label">
            Password:
            <input
              type="password"
              className="auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </label>

          {err && <div style={{ color: "#b91c1c", marginTop: 4 }}>{err}</div>}

          <button className="auth-btn" type="submit" disabled={submitting}>
            {submitting ? "Creating..." : "Create account"}
          </button>
        </form>

        <div className="auth-link-row">
          Already have an account? <Link to="/">Log in</Link>
        </div>
      </div>
    </div>
  );
}
