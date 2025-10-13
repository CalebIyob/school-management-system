import React, { useState } from "react";                         // React + state hook
import { Link, useNavigate, useLocation } from "react-router-dom"; // Router helpers
import "../styles/auth.css";                                     // Auth page styles
import api from "../api";                                        // Axios instance
import { setAuth } from "../utils/auth";                         // Persist auth info locally

export default function Login() {                                // Login page component
  const [email, setEmail] = useState("");                        // Controlled email input
  const [password, setPassword] = useState("");   // not used yet (stub) // Password (unused with stub)
  const [loading, setLoading] = useState(false);                 // Submit button loading state
  const [errMsg, setErrMsg] = useState("");                      // Error message banner

  const navigate = useNavigate();                                // Nav helper
  const location = useLocation();                                // Current route state (for redirects)
  const from = location.state?.from?.pathname;                   // Where to return after login (if guarded route)

  const onSubmit = async (e) => {                                // Submit handler
    e.preventDefault();                                          // Don’t reload form
    setErrMsg("");                                               // Clear prior errors
    setLoading(true);                                            // Show loading

    const emailTrim = email.trim().toLowerCase();                // Normalize for matching

    try {
      // Until real auth exists, infer role by checking existing users.    // Stub logic for demo
      const [teachersRes, studentsRes] = await Promise.all([
        api.get("/admin/teachers"),                              // Fetch teachers
        api.get("/admin/students"),                              // Fetch students
      ]);

      const teachers = teachersRes.data || [];                   // Safe arrays
      const students = studentsRes.data || [];

      const teacher = teachers.find(t => (t.email || "").toLowerCase() === emailTrim); // Match teacher by email
      if (teacher) {                                             // If found, set teacher session and go to dashboard
        setAuth({ role: "TEACHER", teacherId: teacher.id });
        navigate(from || "/teacher", { replace: true });
        return;
      }

      const student = students.find(s => (s.email || "").toLowerCase() === emailTrim); // Match student by email
      if (student) {                                             // If found, set student session and go to dashboard
        setAuth({ role: "STUDENT", studentId: student.id });
        navigate(from || "/student", { replace: true });
        return;
      }

      // Fallback: treat as ADMIN (e.g., admin@school.edu, ops@school.edu)   // Default to admin if not matched
      setAuth({ role: "ADMIN" });
      navigate(from || "/admin", { replace: true });
    } catch (err) {                                              // Network/API failure
      console.error(err);
      setErrMsg("Login lookup failed. Please try again.");       // Show error
    } finally {
      setLoading(false);                                         // Stop loading
    }
  };

  return (
    <div className="auth-wrap">                                  {/* Centered page wrapper */}
      <div className="auth-card">                                {/* White card */}
        <h1 className="auth-title">Login</h1>

        <form className="auth-form" onSubmit={onSubmit}>         {/* Controlled form */}
          <label className="auth-label">
            Email:
            <input
              className="auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}          // Update email state
              placeholder="you@example.com"
            />
          </label>

          <label className="auth-label">
            Password:
            <input
              type="password"
              className="auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}       // Update password state (unused)
              placeholder="••••••••"
            />
          </label>

          <button className="auth-btn" type="submit" disabled={loading}> {/* Disable while loading */}
            {loading ? "Logging in..." : "Log In"}               {/* Button label */}
          </button>
        </form>

        {errMsg && (                                             // Error banner (conditional)
          <div style={{ color: "#b91c1c", marginTop: 10, textAlign: "center" }}>
            {errMsg}
          </div>
        )}

        <div className="auth-link-row">                          {/* Link to signup */}
          Don’t have an account? <Link to="/signup">Sign up</Link>
        </div>
      </div>
    </div>
  );
}
