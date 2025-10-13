import React, { useEffect, useMemo, useState } from "react"; // React and hooks for state, effects, and memoized values
import { Link, useNavigate } from "react-router-dom";         // Router: link component and programmatic navigation
import api from "../api";                                     // Preconfigured Axios instance
import "../styles/dashboard.css";                             // Shared dashboard styles
import { clearAuth } from "../utils/auth";                    // Helper to clear local auth/session

export default function AdminTeachersPage() {                 // Page component for paginated teacher list
    const [items, setItems] = useState([]);                   // All teachers fetched from API
    const [page, setPage] = useState(1);                      // Current page (1-based)
    const [pageSize, setPageSize] = useState(10);             // Rows per page
    const nav = useNavigate();                                // Navigation helper

    useEffect(() => {                                         // On mount, fetch teachers
        api.get("/admin/teachers")
            .then(r => setItems(r.data || []))                 // Store returned list (fallback to [])
            .catch(console.error);                             // Log any failures
    }, []);                                                   // Run once

    const totalPages = Math.max(1, Math.ceil(items.length / pageSize)); // Derived total page count (≥1)
    useEffect(() => { if (page > totalPages) setPage(totalPages); }, [totalPages, page]); // Clamp page if data/pageSize changes

    const view = useMemo(() => {                              // Slice visible items for current page
        const start = (page - 1) * pageSize;                  // Start index for page
        return items.slice(start, start + pageSize);          // Return page slice
    }, [items, page, pageSize]);

    const signOut = () => { clearAuth(); nav("/", { replace: true }); }; // Clear auth and go back to login

    return (
        <div className="dash-wrap">                           {/* Outermost layout wrapper */}
            <header className="dash-topbar">                 {/* Fixed top bar */}
                <div className="row" style={{ gap: 8, alignItems: "center" }}>
                    <button className="btn btn-ghost" onClick={() => nav("/admin")}>← Dashboard</button> {/* Back to dashboard */}
                    <div className="dash-title">Teachers</div>                                              {/* Title */}
                </div>
                <button className="btn btn-ghost" onClick={signOut}>Sign out</button>                       {/* Logout */}
            </header>

            <main className="dash-container">                 {/* Padded content area */}
                <section className="card">                    {/* Card with shadow */}
                    <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
                        <h2 style={{ margin: 0 }}>All Teachers</h2>             {/* Section heading */}
                        <div className="row">                                   {/* Page-size control */}
                            <span style={{ alignSelf: "center", marginRight: 6 }}>Per page:</span>
                            <select
                                className="input"
                                value={pageSize}
                                onChange={e => { setPage(1); setPageSize(Number(e.target.value)); }} // Change size & reset to page 1
                            >
                                {[5, 10, 20, 50, 100].map(n => <option key={n} value={n}>{n}</option>)} 
                                {/* Options*/}
                            </select>
                        </div>
                    </div>

                    <ul className="list scrolly" style={{ maxHeight: "calc(100vh - 260px)" }}> {/* Scrollable list area */}
                        {view.map(t => (                                             
                            <li key={t.id}>
                                <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                                    <span>
                                         {/*Render one <li> per teacher on current page*/}
                                        <strong>{t.name}</strong> — {t.email}        {/* Show name and email */}
                                        {t.classroom && <> — <em>{t.classroom.name || `class #${t.classroom.id}`}</em></>} {/* Class name/id if present */}
                                    </span>
                                    <Link className="link" to={`/admin/users/teacher/${t.id}/edit`}>Edit</Link>   {/* Go to edit page */}
                                </div>
                            </li>
                        ))}
                    </ul>

                    <div className="pager">                                          {/* Pagination controls */}
                        <button
                            className="btn"
                            disabled={page <= 1}
                            onClick={() => setPage(p => Math.max(1, p - 1))}         // Prev page
                        >
                            Prev
                        </button>
                        <span>Page {page} / {totalPages}</span>                       {/* Current page indicator */}
                        <button
                            className="btn"
                            disabled={page >= totalPages}
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))} // Next page
                        >
                            Next
                        </button>
                    </div>
                </section>
            </main>
        </div>
    );
}
