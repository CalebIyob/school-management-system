import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { getAuth, clearAuth } from "../utils/auth";
import "../styles/dashboard.css";

export default function TeacherDashboard() {
    const a = getAuth();
    const teacherId = a?.teacherId;

    const [students, setStudents] = useState([]);
    const [classId, setClassId] = useState("");
    const [className, setClassName] = useState("");
    const [marksByStudent, setMarksByStudent] = useState({});
    const [loadingMarks, setLoadingMarks] = useState(false);

    // NEW: paging state
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const navigate = useNavigate();

    useEffect(() => {
        if (!teacherId) return;
        api
            .get(`/teachers/${teacherId}/students`)
            .then((r) => setStudents(r.data))
            .catch(console.error);

        api
            .get("/admin/teachers")
            .then((r) => {
                const me = (r.data || []).find((x) => x.id === teacherId);
                if (me?.classroom?.id) {
                    setClassId(me.classroom.id);
                    setClassName(me.classroom.name || `Class #${me.classroom.id}`);
                }
            })
            .catch(console.error);
    }, [teacherId]);

    useEffect(() => {
        if (!classId || students.length === 0) return;
        let cancelled = false;
        (async () => {
            setLoadingMarks(true);
            try {
                const entries = await Promise.all(
                    students.map(async (s) => {
                        try {
                            const { data } = await api.get(`/students/${s.id}/marks`);
                            const enr = (data || []).find(
                                (e) => String(e.id.classId) === String(classId)
                            );
                            return [s.id, enr?.mark ?? null];
                        } catch {
                            return [s.id, null];
                        }
                    })
                );
                if (!cancelled) setMarksByStudent(Object.fromEntries(entries));
            } finally {
                if (!cancelled) setLoadingMarks(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [classId, students]);

    // ---- Pagination helpers ----
    const totalPages = Math.max(1, Math.ceil(students.length / pageSize));
    useEffect(() => {
        if (page > totalPages) setPage(totalPages);
    }, [totalPages, page]);

    const pageStudents = useMemo(() => {
        const start = (page - 1) * pageSize;
        return students.slice(start, start + pageSize);
    }, [students, page, pageSize]);

    const signOut = () => {
        clearAuth();
        navigate("/", { replace: true });
    };

    if (!teacherId)
        return <div style={{ padding: 20 }}>No teacherId in session. Log in again.</div>;

    return (
        <div className="dash-wrap">
            <header className="dash-topbar">
                <div className="dash-title">Teacher Dashboard</div>
                <button className="btn btn-ghost" onClick={signOut}>
                    Sign out
                </button>
            </header>

            <main className="dash-container">
                <div className="card" style={{ overflowX: "auto" }}>
                    <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                            <h2 style={{ marginBottom: 4 }}>My Students</h2>
                            <p style={{ marginTop: 0 }}>Class: {className || "(loading…)"}</p>
                        </div>

                        {/* Per-page selector */}
                        <div className="row">
                            <span style={{ alignSelf: "center", marginRight: 6 }}>Per page:</span>
                            <select
                                className="input"
                                value={pageSize}
                                onChange={(e) => {
                                    setPage(1);
                                    setPageSize(Number(e.target.value));
                                }}
                            >
                                {[5, 10, 20, 50, 100].map((n) => (
                                    <option key={n} value={n}>
                                        {n}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {loadingMarks && (
                        <div style={{ color: "#6b7280", marginBottom: 8 }}>Loading marks…</div>
                    )}

                    {/* Scrollable area */}
                    <div
                        className="scrolly"
                        style={{ maxHeight: "calc(100vh - 300px)", overflow: "auto" }}
                    >
                        <table style={{ width: "100%", borderCollapse: "collapse" }} border="1" cellPadding="6">
                            <thead>
                                <tr>
                                    <th align="left">Student</th>
                                    <th align="left">Email</th>
                                    <th align="left">Mark</th>
                                    <th align="left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pageStudents.map((s) => {
                                    const mark = marksByStudent[s.id];
                                    return (
                                        <tr key={s.id}>
                                            <td>{s.name}</td>
                                            <td>{s.email}</td>
                                            <td>{mark ?? "(none)"}</td>
                                            <td>
                                                {classId && (
                                                    <>
                                                        <Link
                                                            to={`/teacher/classes/${classId}/students/${s.id}/enter-mark`}
                                                        >
                                                            Enter mark
                                                        </Link>{" "}
                                                        |{" "}
                                                        <Link
                                                            to={`/teacher/classes/${classId}/students/${s.id}/edit-mark`}
                                                        >
                                                            Edit mark
                                                        </Link>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Pager */}
                    <div className="pager">
                        <button
                            className="btn"
                            disabled={page <= 1}
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                        >
                            Prev
                        </button>
                        <span>
                            Page {page} / {totalPages}
                        </span>
                        <button
                            className="btn"
                            disabled={page >= totalPages}
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
