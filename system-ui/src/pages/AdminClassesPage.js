// Import React plus hooks we need: state, effect, memoization
import React, { useEffect, useMemo, useState } from "react";
// Router helper to programmatically navigate
import { useNavigate } from "react-router-dom";
// Pre-configured Axios instance for API calls
import api from "../api";
// Shared dashboard styles
import "../styles/dashboard.css";
// Helper to clear client-side auth/session
import { clearAuth } from "../utils/auth";

export default function AdminClassesPage() {
    // All classes fetched from the server
    const [items, setItems] = useState([]);
    // Current page number (1-based)
    const [page, setPage] = useState(1);
    // How many rows to show per page
    const [pageSize, setPageSize] = useState(10);
    // Router navigate function
    const nav = useNavigate();

    // On mount, fetch all classes
    useEffect(() => {
        api.get("/admin/classes")              // GET /admin/classes
            .then(r => setItems(r.data || []))  // store result (fallback to [])
            .catch(console.error);              // log errors but don't crash UI
    }, []);                                    // run once

    // Compute total number of pages based on items + pageSize
    const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

    // If pageSize or items changed and current page is now out of range, clamp it
    useEffect(() => {
        if (page > totalPages) setPage(totalPages);
    }, [totalPages, page]);

    // Derive the current slice ("view") to show for the current page
    const view = useMemo(() => {
        const start = (page - 1) * pageSize;       // index of first item on the page
        return items.slice(start, start + pageSize); // take pageSize items
    }, [items, page, pageSize]);

    // Log out: clear auth and return to Login
    const signOut = () => { clearAuth(); nav("/", { replace: true }); };

    return (
        <div className="dash-wrap">
            {/* Top bar with Back to dashboard + Sign out */}
            <header className="dash-topbar">
                <div className="row" style={{ gap: 8, alignItems: "center" }}>
                    {/* Back button goes to main admin dashboard */}
                    <button className="btn btn-ghost" onClick={() => nav("/admin")}>← Dashboard</button>
                    <div className="dash-title">Classes</div>
                </div>
                <button className="btn btn-ghost" onClick={signOut}>Sign out</button>
            </header>

            <main className="dash-container">
                <section className="card">
                    {/* Title + page size selector */}
                    <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
                        <h2 style={{ margin: 0 }}>All Classes</h2>
                        <div className="row">
                            <span style={{ alignSelf: "center", marginRight: 6 }}>Per page:</span>
                            {/* Changing page size resets to page 1 to avoid out-of-range page */}
                            <select
                                className="input"
                                value={pageSize}
                                onChange={e => { setPage(1); setPageSize(Number(e.target.value)); }}
                            >
                                {[5, 10, 20, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* List of classes for current page; scrolly keeps header visible */}
                    <ul className="list scrolly" style={{ maxHeight: "calc(100vh - 260px)" }}>
                        {view.map(c => <li key={c.id}>{c.name}</li>)}
                    </ul>

                    {/* Simple pager controls */}
                    <div className="pager">
                        <button
                            className="btn"
                            disabled={page <= 1}
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                        >
                            Prev
                        </button>
                        <span>Page {page} / {totalPages}</span>
                        <button
                            className="btn"
                            disabled={page >= totalPages}
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        >
                            Next
                        </button>
                    </div>
                </section>
            </main>
        </div>
    );
}
