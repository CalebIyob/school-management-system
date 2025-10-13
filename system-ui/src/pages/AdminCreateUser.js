// React + hooks for state/effects
import React, { useEffect, useState } from "react";
// Router navigation
import { useNavigate } from "react-router-dom";
// Axios instance
import api from "../api";
// Styles
import "../styles/dashboard.css";
// Clear client auth/session
import { clearAuth } from "../utils/auth";

export default function AdminCreateUser() {
    // Form fields
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    // Class assignment (required)
    const [classes, setClasses] = useState([]);
    const [classId, setClassId] = useState("");

    const nav = useNavigate();

    // Load classes for the teacher picker
    useEffect(() => {
        api.get("/admin/classes").then(r => setClasses(r.data)).catch(console.error);
    }, []);

    const signOut = () => {
        clearAuth();
        nav("/", { replace: true });
    };

    // Create TEACHER only
    const submit = async (e) => {
        e.preventDefault();

        const payload = {
            name: name.trim(),
            email: email.trim(),
            password: password.trim(),
            classId: classId ? Number(classId) : null,
        };

        if (!payload.name || !payload.email || !payload.password) {
            alert("Please fill name, email, and a temporary password.");
            return;
        }
        if (!payload.classId) {
            alert("Pick a class for the teacher.");
            return;
        }

        await api.post("/admin/teachers", payload);
        nav("/admin");
    };

    return (
        <div className="dash-wrap">
            {/* Top bar */}
            <header className="dash-topbar">
                <div className="dash-title">Create Teacher</div>
                <button className="btn btn-ghost" onClick={signOut}>Sign out</button>
            </header>

            <main className="dash-container">
                {/* Centered card */}
                <section className="card" style={{ maxWidth: 600, margin: "0 auto" }}>
                    <h2 style={{ marginBottom: 12 }}>New Teacher</h2>

                    {/* Controlled form */}
                    <form className="grid" style={{ gap: 12 }} onSubmit={submit}>
                        {/* Only teacher fields now */}
                        <input
                            className="input"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Full name"
                        />
                        <input
                            className="input"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="Email"
                        />
                        <input
                            type="password"
                            className="input"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="Temp password"
                        />

                        {/* Required class assignment */}
                        <select
                            className="input"
                            value={classId}
                            onChange={e => setClassId(e.target.value)}
                        >
                            <option value="">— Select class —</option>
                            {classes.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>

                        {/* Actions: Cancel (left) + Create (right) */}
                        <div className="row" style={{ justifyContent: "space-between", marginTop: 8 }}>
                            <button className="btn" type="button" onClick={() => nav("/admin")}>
                                Cancel
                            </button>
                            <button className="btn btn-primary" type="submit">Create</button>
                        </div>
                    </form>
                </section>
            </main>
        </div>
    );
}
