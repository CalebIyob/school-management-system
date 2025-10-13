import React, { useEffect, useMemo, useState } from "react";     // React + hooks
import { useNavigate } from "react-router-dom";                  // Programmatic navigation
import api from "../api";                                        // Axios instance
import { getAuth, clearAuth } from "../utils/auth";              // Read/clear local session
import "../styles/dashboard.css";                                // Shared styles

export default function StudentDashboard() {
    const { studentId } = getAuth() || {};                       // Current student id (if logged in)
    const [studentName, setStudentName] = useState("");          // Display name for header
    const [marks, setMarks] = useState([]);                      // Enrollment/marks list
    const [classById, setClassById] = useState({});              // Map of classId -> className

    // Pagination state
    const [page, setPage] = useState(1);                         // Current page
    const [pageSize, setPageSize] = useState(10);                // Rows per page

    const navigate = useNavigate();                              // Router navigate helper

    // Load marks + classes + own student record for name
    useEffect(() => {
        if (!studentId) return;                                  // Skip if no session

        Promise.all([
            api.get(`/students/${studentId}/marks`),             // Enrollment + marks
            api.get("/admin/classes"),                           // Class names
            api.get("/admin/students"),                          // Students list (to find my name)
        ])
            .then(([marksRes, classesRes, studentsRes]) => {
                setMarks(marksRes.data || []);                   // Save marks
                const map = {};                                  // Build id->name
                (classesRes.data || []).forEach((c) => (map[c.id] = c.name));
                setClassById(map);                               // Save mapping

                const me =
                    (studentsRes.data || []).find(               // Find my student record
                        (s) => String(s.id) === String(studentId)
                    ) || null;
                if (me) setStudentName(me.name || `Student #${studentId}`); // Header name
            })
            .catch(console.error);                               // Log failures
    }, [studentId]);

    // Total pages based on data length and page size (at least 1)
    const totalPages = Math.max(1, Math.ceil(marks.length / pageSize));

    // Clamp page if data shrinks (e.g., page beyond last)
    useEffect(() => {
        if (page > totalPages) setPage(totalPages);
    }, [totalPages, page]);

    // Slice current page of marks
    const pageMarks = useMemo(() => {
        const start = (page - 1) * pageSize;                     // start index
        return marks.slice(start, start + pageSize);             // page slice
    }, [marks, page, pageSize]);

    // Clear session and go to login
    const signOut = () => {
        clearAuth();
        navigate("/", { replace: true });
    };

    // Guard when session is missing
    if (!studentId)
        return <div style={{ padding: 20 }}>No studentId in session. Log in again.</div>;

    return (
        <div className="dash-wrap">{/* Shell/Background */}
            <header className="dash-topbar">
                <div className="dash-title">Student Dashboard</div>
                <button className="btn btn-ghost" onClick={signOut}>
                    Sign out
                </button>
            </header>

            <main className="dash-container">
                {/* Big name at the top */}
                <h1 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 12px 2px" }}>
                    {studentName || "\u00A0"}
                </h1>

                <div className="card" style={{ overflowX: "auto" }}>
                    {/* Header row with per-page selector */}
                    <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
                        <h2 style={{ margin: 0 }}>Grades</h2>
                        {/* Per-page selector */}
                        <div className="row">
                            <span style={{ alignSelf: "center", marginRight: 6 }}>Per page:</span>
                            <select
                                className="input"
                                value={pageSize}
                                onChange={(e) => {
                                    setPage(1);                         // jump to page 1 on size change
                                    setPageSize(Number(e.target.value)); // update size
                                }}
                            >
                                {[5, 10, 20, 50, 100].map((n) => (     // options for page size
                                    <option key={n} value={n}>
                                        {n}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Scrollable table container */}
                    <div
                        className="scrolly"
                        style={{ maxHeight: "calc(100vh - 300px)", overflow: "auto" }}
                    >
                        <table style={{ width: "100%", borderCollapse: "collapse" }} border="1" cellPadding="6">
                            <thead>
                                <tr>
                                    <th align="left">Class</th>
                                    <th align="left">Mark</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pageMarks.map((e) => {              // render rows for current page
                                    const cid = e.id.classId;         // enrollment's class id
                                    const cname = classById[cid] || `Class #${cid}`; // resolve name
                                    return (
                                        <tr key={`${e.id.studentId}-${cid}`}>
                                            <td>{cname}</td>
                                            <td>{e.mark ?? "(none)"}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Pager controls */}
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
