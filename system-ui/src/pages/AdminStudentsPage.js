// React + hooks
import React, { useEffect, useMemo, useState } from "react";
// Router helpers
import { Link, useNavigate } from "react-router-dom";
// Axios instance
import api from "../api";
// Styles
import "../styles/dashboard.css";
// Clear client auth/session
import { clearAuth } from "../utils/auth";

export default function AdminStudentsPage() {
    // All students fetched from server
    const [items, setItems] = useState([]);
    // Current page and page size for pagination
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    // Navigate helper
    const nav = useNavigate();

    // Load students on mount
    useEffect(() => {
        api.get("/admin/students")
            .then(r => setItems(r.data || []))
            .catch(console.error);
    }, []);

    // Compute the total pages based on the current list and page size
    const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

    // Clamp page number if data/pageSize change and the page is now too large
    useEffect(() => { if (page > totalPages) setPage(totalPages); }, [totalPages, page]);

    // Slice out the visible rows for the current page
    const view = useMemo(() => {
        const start = (page - 1) * pageSize;
        return items.slice(start, start + pageSize);
    }, [items, page, pageSize]);

    // Log out and return to login
    const signOut = () => { clearAuth(); nav("/", { replace: true }); };

    return (
        <div className="dash-wrap">
            {/* Top bar with back + sign out */}
            <header className="dash-topbar">
                <div className="row" style={{ gap: 8, alignItems: "center" }}>
                    <button className="btn btn-ghost" onClick={() => nav("/admin")}>← Dashboard</button>
                    <div className="dash-title">Students</div>
                </div>
                <button className="btn btn-ghost" onClick={signOut}>Sign out</button>
            </header>

            <main className="dash-container">
                <section className="card">
                    {/* Title and per-page control */}
                    <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
                        <h2 style={{ margin: 0 }}>All Students</h2>
                        <div className="row">
                            <span style={{ alignSelf: "center", marginRight: 6 }}>Per page:</span>
                            <select
                                className="input"
                                value={pageSize}
                                onChange={e => { setPage(1); setPageSize(Number(e.target.value)); }}
                            >
                                {[5, 10, 20, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Paged list of students with quick Edit link */}
                    <ul className="list scrolly" style={{ maxHeight: "calc(100vh - 260px)" }}>
                        {view.map(s => (
                            <li key={s.id}>
                                <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                                    <span><strong>{s.name}</strong> — {s.email}</span>
                                    <Link className="link" to={`/admin/users/student/${s.id}/edit`}>Edit</Link>
                                </div>
                            </li>
                        ))}
                    </ul>

                    {/* Pager buttons */}
                    <div className="pager">
                        <button className="btn" disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Prev</button>
                        <span>Page {page} / {totalPages}</span>
                        <button className="btn" disabled={page >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>Next</button>
                    </div>
                </section>
            </main>
        </div>
    );
}
