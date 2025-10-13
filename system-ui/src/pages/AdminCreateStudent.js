import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../styles/dashboard.css";
import { clearAuth } from "../utils/auth";

export default function AdminCreateStudent() {
    // Form fields
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const nav = useNavigate();

    const signOut = () => {
        clearAuth();
        nav("/", { replace: true });
    };

    const submit = async (e) => {
        e.preventDefault();

        const payload = {
            name: name.trim(),
            email: email.trim(),
            password: password.trim(),
        };
        if (!payload.name || !payload.email || !payload.password) {
            alert("Please fill name, email, and a temporary password.");
            return;
        }

        await api.post("/admin/students", payload);
        nav("/admin");
    };

    return (
        <div className="dash-wrap">
            <header className="dash-topbar">
                <div className="dash-title">Create Student</div>
                <button className="btn btn-ghost" onClick={signOut}>Sign out</button>
            </header>

            <main className="dash-container">
                <section className="card" style={{ maxWidth: 700, margin: "0 auto" }}>
                    <h2 style={{ marginBottom: 12 }}>New Student</h2>

                    <form className="grid" style={{ gap: 12 }} onSubmit={submit}>
                        <input
                            className="input"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Full name"
                        />
                        <input
                            className="input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                        />
                        <input
                            type="password"
                            className="input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Temp password"
                        />

                        <div className="row" style={{ justifyContent: "space-between", marginTop: 8 }}>
                            <button type="button" className="btn" onClick={() => nav("/admin")}>
                                Cancel
                            </button>
                            <button className="btn btn-primary" type="submit">
                                Create
                            </button>
                        </div>
                    </form>
                </section>
            </main>
        </div>
    );
}
