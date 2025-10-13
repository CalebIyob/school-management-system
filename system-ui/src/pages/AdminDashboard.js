// React core + hooks
import React, { useEffect, useMemo, useState } from "react";
// Router helpers
import { Link, useNavigate } from "react-router-dom";
// Axios instance
import api from "../api";
// Shared styles
import "../styles/dashboard.css";
// Auth utils
import { clearAuth } from "../utils/auth";

// Tab identifiers used to switch the right-hand pane
const TABS = { CLASSES: "CLASSES", TEACHERS: "TEACHERS", STUDENTS: "STUDENTS" };
// Allowed page sizes for the per-page dropdowns
const PAGE_SIZES = [5, 10, 20, 50, 100];

export default function AdminDashboard() {
    // Which tab is active initially (Classes)
    const [tab, setTab] = useState(TABS.CLASSES);

    // Data arrays fetched from the backend
    const [classes, setClasses] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [students, setStudents] = useState([]);
    // Controlled input for "add class"
    const [newClass, setNewClass] = useState("");

    // Per-tab pagination state: page number + page size
    const [cPage, setCPage] = useState(1);
    const [cSize, setCSize] = useState(10);

    const [tPage, setTPage] = useState(1);
    const [tSize, setTSize] = useState(10);

    const [sPage, setSPage] = useState(1);
    const [sSize, setSSize] = useState(10);

    // Router navigation helper
    const navigate = useNavigate();

    // Load all three lists once on mount
    useEffect(() => {
        api.get("/admin/classes").then(r => setClasses(r.data)).catch(console.error);
        api.get("/admin/teachers").then(r => setTeachers(r.data)).catch(console.error);
        api.get("/admin/students").then(r => setStudents(r.data)).catch(console.error);
    }, []);

    // Create a class from the input then append it locally
    const addClass = async () => {
        const name = newClass.trim();          // normalize input
        if (!name) return;                     // ignore empty
        const { data } = await api.post("/admin/classes", { name }); // POST to API
        setClasses(prev => [...prev, data]);   // update list optimistically
        setNewClass("");                       // clear input
    };

    // Delete a teacher by id; on success, remove from local state
    const removeTeacher = async (id) => {
        if (!window.confirm("Delete this teacher?")) return;  // confirm intent
        try {
            await api.delete(`/admin/teachers/${id}`);        // call API
            setTeachers(prev => prev.filter(t => t.id !== id)); // update UI
        } catch (e) { console.error(e); alert("Could not delete teacher."); } // handle failures
    };

    // Delete a student by id; on success, remove from local state
    const removeStudent = async (id) => {
        if (!window.confirm("Delete this student?")) return;  // confirm intent
        try {
            await api.delete(`/admin/students/${id}`);        // call API
            setStudents(prev => prev.filter(s => s.id !== id)); // update UI
        } catch (e) { console.error(e); alert("Could not delete student."); } // handle failures
    };

    // Compute total pages for each tab (at least 1 page)
    const cTotal = Math.max(1, Math.ceil(classes.length / cSize));
    const tTotal = Math.max(1, Math.ceil(teachers.length / tSize));
    const sTotal = Math.max(1, Math.ceil(students.length / sSize));

    // Clamp current page if the total pages shrink (e.g., after deleting items)
    useEffect(() => { if (cPage > cTotal) setCPage(cTotal); }, [cTotal, cPage]);
    useEffect(() => { if (tPage > tTotal) setTPage(tTotal); }, [tTotal, tPage]);
    useEffect(() => { if (sPage > sTotal) setSPage(sTotal); }, [sTotal, sPage]);

    // Slice the visible window for Classes
    const cView = useMemo(() => {
        const start = (cPage - 1) * cSize;                // start index
        return classes.slice(start, start + cSize);       // page slice
    }, [classes, cPage, cSize]);

    // Slice the visible window for Teachers
    const tView = useMemo(() => {
        const start = (tPage - 1) * tSize;                // start index
        return teachers.slice(start, start + tSize);      // page slice
    }, [teachers, tPage, tSize]);

    // Slice the visible window for Students
    const sView = useMemo(() => {
        const start = (sPage - 1) * sSize;                // start index
        return students.slice(start, start + sSize);      // page slice
    }, [students, sPage, sSize]);

    // Log out and go to login screen
    const signOut = () => { clearAuth(); navigate("/", { replace: true }); };

    return (
        <div className="dash-wrap">{/* App shell wrapper (background + layout) */}
            {/* Top bar */}
            <header className="dash-topbar">
                <div className="dash-title">Admin Dashboard</div>{/* Title text */}
                <button className="btn btn-ghost" onClick={signOut}>Sign out</button>{/* Logout */}
            </header>

            <main className="dash-container">{/* Main content area */}
                <div className="dash-two">{/* Two-column layout: sidebar + main */}
                    {/* Sidebar */}
                    <aside className="dash-side card">
                        <h3 className="side-title">Browse</h3>
                        <button
                            className={`side-item ${tab === TABS.CLASSES ? "active" : ""}`}
                            onClick={() => setTab(TABS.CLASSES)}
                        >
                            <span>Classes</span>
                        </button>
                        <button
                            className={`side-item ${tab === TABS.TEACHERS ? "active" : ""}`}
                            onClick={() => setTab(TABS.TEACHERS)}
                        >
                            <span>Teachers</span>
                        </button>
                        <button
                            className={`side-item ${tab === TABS.STUDENTS ? "active" : ""}`}
                            onClick={() => setTab(TABS.STUDENTS)}
                        >
                            <span>Students</span>
                        </button>
                    </aside>

                    {/* Right panel */}
                    <section className="dash-main card">
                        {/* CLASSES TAB */}
                        {tab === TABS.CLASSES && (
                            <>
                                {/* Header row: title + per-page selector */}
                                <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
                                    <h2 style={{ margin: 0 }}>Classes</h2>
                                    {/* Per-page control */}
                                    <div className="row">
                                        <span style={{ alignSelf: "center", marginRight: 6 }}>Per page:</span>
                                        <select
                                            className="input"
                                            value={cSize}
                                            onChange={(e) => { setCPage(1); setCSize(Number(e.target.value)); }}
                                        >
                                            {PAGE_SIZES.map(n => <option key={n} value={n}>{n}</option>)}
                                        </select>
                                    </div>
                                </div>

                                {/* Add-class input + button */}
                                <div className="row mbot">
                                    <input
                                        className="input"
                                        value={newClass}
                                        onChange={e => setNewClass(e.target.value)}
                                        placeholder="New class name"
                                    />
                                    <button className="btn btn-primary" onClick={addClass}>Add Class</button>
                                </div>

                                {/* Scrollable class list */}
                                <ul className="list scrolly" style={{ maxHeight: "calc(100vh - 260px)" }}>
                                    {cView.map(c => <li key={c.id}>{c.name}</li>)}
                                </ul>

                                {/* Pager for classes */}
                                <div className="pager">
                                    <button className="btn" disabled={cPage <= 1} onClick={() => setCPage(p => Math.max(1, p - 1))}>Prev</button>
                                    <span>Page {cPage} / {cTotal}</span>
                                    <button className="btn" disabled={cPage >= cTotal} onClick={() => setCPage(p => Math.min(cTotal, p + 1))}>Next</button>
                                </div>
                            </>
                        )}

                        {/* TEACHERS TAB */}
                        {tab === TABS.TEACHERS && (
                            <>
                                {/* Header row: title, per-page control, and quick link */}
                                <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
                                    <h2 style={{ margin: 0 }}>Teachers</h2>
                                    <div className="row" style={{ gap: 12 }}>
                                        {/* Per-page control */}
                                        <div className="row">
                                            <span style={{ alignSelf: "center", marginRight: 6 }}>Per page:</span>
                                            <select
                                                className="input"
                                                value={tSize}
                                                onChange={(e) => { setTPage(1); setTSize(Number(e.target.value)); }}
                                            >
                                                {PAGE_SIZES.map(n => <option key={n} value={n}>{n}</option>)}
                                            </select>
                                        </div>
                                        <Link className="link" to="/admin/users/new">+ Create Teacher</Link>
                                    </div>
                                </div>

                                {/* Scroll area with table of teachers */}
                                <div className="scrolly" style={{ maxHeight: "calc(100vh - 260px)" }}>
                                    <table className="data-table">
                                        <thead>
                                            <tr>
                                                <th align="left">Name</th>
                                                <th align="left">Email</th>
                                                <th align="left">Class</th>
                                                <th align="right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {tView.map(t => (
                                                <tr key={t.id}>
                                                    <td><strong>{t.name}</strong></td>
                                                    <td>{t.email}</td>
                                                    <td>{t.classroom?.name || (t.classroom?.id ? `Class #${t.classroom.id}` : "—")}</td>
                                                    {/* Actions: Edit + Delete (styled link-like) */}
                                                    <td align="right" className="actions">
                                                        <Link className="link" to={`/admin/users/teacher/${t.id}/edit`}>Edit</Link>
                                                        <button className="link danger" onClick={() => removeTeacher(t.id)}>Delete</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pager for teachers */}
                                <div className="pager">
                                    <button className="btn" disabled={tPage <= 1} onClick={() => setTPage(p => Math.max(1, p - 1))}>Prev</button>
                                    <span>Page {tPage} / {tTotal}</span>
                                    <button className="btn" disabled={tPage >= tTotal} onClick={() => setTPage(p => Math.min(tTotal, p + 1))}>Next</button>
                                </div>
                            </>
                        )}

                        {/* STUDENTS TAB */}
                        {tab === TABS.STUDENTS && (
                            <>
                                <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
                                    <h2 style={{ margin: 0 }}>Students</h2>

                                    {/* Per-page + Create Student (same style as Create Teacher) */}
                                    <div className="row" style={{ gap: 12 }}>
                                        <div className="row">
                                            <span style={{ alignSelf: "center", marginRight: 6 }}>Per page:</span>
                                            <select
                                                className="input"
                                                value={sSize}
                                                onChange={(e) => { setSPage(1); setSSize(Number(e.target.value)); }}
                                            >
                                                {PAGE_SIZES.map(n => <option key={n} value={n}>{n}</option>)}
                                            </select>
                                        </div>

                                        {/* New button */}
                                        <Link className="link" to="/admin/students/new">+ Create Student</Link>
                                    </div>
                                </div>

                                <div className="scrolly" style={{ maxHeight: "calc(100vh - 260px)" }}>
                                    <table className="data-table">
                                        <thead>
                                            <tr>
                                                <th align="left">Name</th>
                                                <th align="left">Email</th>
                                                <th align="right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {sView.map(s => (
                                                <tr key={s.id}>
                                                    <td><strong>{s.name}</strong></td>
                                                    <td>{s.email}</td>
                                                    <td align="right" className="actions">
                                                        <Link className="link" to={`/admin/users/student/${s.id}/edit`}>Edit</Link>
                                                        <button className="link danger" onClick={() => removeStudent(s.id)}>Delete</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="pager">
                                    <button className="btn" disabled={sPage <= 1} onClick={() => setSPage(p => Math.max(1, p - 1))}>Prev</button>
                                    <span>Page {sPage} / {sTotal}</span>
                                    <button className="btn" disabled={sPage >= sTotal} onClick={() => setSPage(p => Math.min(sTotal, p + 1))}>Next</button>
                                </div>
                            </>
                        )}

                    </section>
                </div>
            </main>
        </div>
    );
}
