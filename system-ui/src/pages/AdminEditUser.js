// React + hooks (effect/memo/state)
import React, { useEffect, useMemo, useState } from "react";
// Router hooks for reading :params and navigating
import { useNavigate, useParams } from "react-router-dom";
// Axios instance
import api from "../api";
// Styles
import "../styles/dashboard.css";
// Clear auth helper
import { clearAuth } from "../utils/auth";

export default function AdminEditUser() {
    // Grab /:role/:id from the URL
    const { role, id } = useParams(); // "student" | "teacher"
    // Convenience boolean for role checks
    const isTeacher = role === "teacher";
    // Navigate helper
    const nav = useNavigate();

    // Common form fields for both roles
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    // Teacher-only fields: class assignment + all class options
    const [classId, setClassId] = useState("");
    const [classes, setClasses] = useState([]);

    // Student-only: list of enrollments + "add class" picker
    const [enrollments, setEnrollments] = useState([]); // [{ id:{studentId,classId}, mark }]
    const [addClassId, setAddClassId] = useState("");

    // On mount and whenever role/id changes, load needed data
    useEffect(() => {
        // Always load classes (used by teacher dropdown and by enrollment name mapping)
        api.get("/admin/classes").then(r => setClasses(r.data || [])).catch(console.error);

        if (isTeacher) {
            // Load teacher basic info from the admin list and find the one with this id
            api.get("/admin/teachers")
                .then(r => {
                    const t = (r.data || []).find(x => String(x.id) === id);
                    if (t) {
                        setName(t.name);
                        setEmail(t.email);
                        setClassId(t.classroom?.id ?? "");
                    }
                })
                .catch(console.error);
        } else {
            // Load student basic info from the admin list
            api.get("/admin/students")
                .then(r => {
                    const s = (r.data || []).find(x => String(x.id) === id);
                    if (s) {
                        setName(s.name);
                        setEmail(s.email);
                    }
                })
                .catch(console.error);
            // And their enrollments + marks for the table below
            api.get(`/students/${id}/marks`)
                .then(r => setEnrollments(r.data || []))
                .catch(console.error);
        }
    }, [id, isTeacher]);

    // Sign out then go to login
    const signOut = () => {
        clearAuth();
        nav("/", { replace: true });
    };

    // Save handler updates either teacher or student using admin endpoints
    const save = async (e) => {
        e.preventDefault();
        if (isTeacher) {
            await api.put(`/admin/teachers/${id}`, {
                name, email, classId: classId ? Number(classId) : null,
            });
        } else {
            await api.put(`/admin/students/${id}`, { name, email });
        }
        nav("/admin");
    };

    // ----- Enrollment helpers (student only) -----

    // Set of classIds the student is already enrolled in (for filtering the "add" dropdown)
    const enrolledIds = useMemo(
        () => new Set(enrollments.map(e => e.id.classId)),
        [enrollments]
    );

    // Classes that are NOT yet enrolled (the ones we can add)
    const addableClasses = useMemo(
        () => classes.filter(c => !enrolledIds.has(c.id)),
        [classes, enrolledIds]
    );

    // Map classId -> className so we can render names in the enrollments table
    const classNameById = useMemo(() => {
        const m = {};
        (classes || []).forEach(c => (m[c.id] = c.name));
        return m;
    }, [classes]);

    // Add enrollment via admin API then optimistically update local state
    const addEnrollment = async () => {
        if (!addClassId) return;
        const payload = { studentId: Number(id), classId: Number(addClassId) };
        await api.post("/admin/enrollments", payload);
        setEnrollments(prev => [
            ...prev,
            { id: { studentId: Number(id), classId: Number(addClassId) }, mark: null },
        ]);
        setAddClassId("");
    };

    // Remove enrollment via admin API and update UI
    const removeEnrollment = async (cid) => {
        await api.delete(`/admin/enrollments/${id}/${cid}`);
        setEnrollments(prev => prev.filter(e => e.id.classId !== cid));
    };

    // Page title differs by role
    const title = isTeacher ? "Edit Teacher" : "Edit Student";

    return (
        <div className="dash-wrap">
            {/* Top bar with back + sign out */}
            <header className="dash-topbar">
                <div className="row" style={{ gap: 8, alignItems: "center" }}>
                    {/* Back to dashboard */}
                    <button className="btn btn-ghost" onClick={() => nav("/admin")}>← Dashboard</button>
                    <div className="dash-title">Admin — {title}</div>
                </div>
                <button className="btn btn-ghost" onClick={signOut}>Sign out</button>
            </header>

            <main className="dash-container">
                {/* Main details form */}
                <section className="card" style={{ maxWidth: 700, margin: "0 auto" }}>
                    <h2 style={{ marginBottom: 12 }}>{title}</h2>

                    <form className="grid" style={{ gap: 12 }} onSubmit={save}>
                        {/* Name/email inputs */}
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

                        {/* Teacher-only: choose assigned class */}
                        {isTeacher && (
                            <select
                                className="input"
                                value={classId}
                                onChange={(e) => setClassId(e.target.value)}
                            >
                                <option value="">— Select class —</option>
                                {classes.map((c) => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        )}

                        {/* Footer actions: Cancel (back) + Save */}
                        <div className="row" style={{ justifyContent: "space-between", marginTop: 8 }}>
                            <button className="btn" type="button" onClick={() => nav("/admin")}>
                                Cancel
                            </button>
                            <button className="btn btn-primary" type="submit">
                                Save
                            </button>
                        </div>
                    </form>
                </section>

                {/* Student-only enrollments section */}
                {!isTeacher && (
                    <section className="card" style={{ maxWidth: 700, margin: "16px auto 0" }}>
                        <h2 style={{ marginBottom: 12 }}>Enrollments</h2>

                        {/* Add enrollment row */}
                        <div className="row mbot">
                            <select
                                className="input"
                                value={addClassId}
                                onChange={(e) => setAddClassId(e.target.value)}
                            >
                                <option value="">— Add to class —</option>
                                {addableClasses.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                            <button className="btn btn-primary" onClick={addEnrollment} disabled={!addClassId}>
                                + Enroll
                            </button>
                        </div>

                        {/* Existing enrollments table */}
                        <table style={{ width: "100%", borderCollapse: "collapse" }} border="1" cellPadding="6">
                            <thead>
                                <tr>
                                    <th align="left">Class</th>
                                    <th align="left">Current mark</th>
                                    <th align="left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {enrollments.length === 0 && (
                                    <tr><td colSpan={3} style={{ color: "#6b7280" }}>No enrollments</td></tr>
                                )}
                                {enrollments.map(e => {
                                    const cid = e.id.classId;
                                    return (
                                        <tr key={`${e.id.studentId}-${cid}`}>
                                            <td>{classNameById[cid] || `Class #${cid}`}</td>
                                            <td>{e.mark ?? "(none)"}</td>
                                            <td>
                                                <button className="btn" onClick={() => removeEnrollment(cid)}>
                                                    Remove
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </section>
                )}
            </main>
        </div>
    );
}
