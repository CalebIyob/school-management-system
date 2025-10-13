import React, { useEffect, useState } from "react";           // React + hooks
import { useNavigate, useParams } from "react-router-dom";    // Read params + nav
import api from "../api";                                     // Axios instance
import { getAuth } from "../utils/auth";                      // Read session
import "../styles/dashboard.css";                             // Styles

export default function TeacherEnterMark() {
  const { classId, studentId } = useParams();                // Read :classId and :studentId from route
  const { teacherId } = getAuth() || {};                     // Current teacher id
  const [mark, setMark] = useState("");                      // Controlled field for new mark
  const [className, setClassName] = useState("");            // Resolved class name for header
  const [studentName, setStudentName] = useState("");        // Resolved student name for header
  const nav = useNavigate();                                 // Navigate helper

  // Fetch names to display in the header (class + student)
  useEffect(() => {
    // Class name via teacher record
    api.get("/admin/teachers").then(r => {
      const me = (r.data || []).find(t => t.id === teacherId); // find current teacher
      if (me?.classroom) {
        setClassName(me.classroom.name || `Class #${me.classroom.id}`); // set class name
      }
    }).catch(console.error);

    // Student name via students list
    api.get("/admin/students").then(r => {
      const s = (r.data || []).find(x => String(x.id) === String(studentId)); // find student
      if (s) setStudentName(s.name || `Student #${s.id}`); // set student name
    }).catch(console.error);
  }, [teacherId, studentId]);

  // Save (create/update) a mark and go back
  const save = async (e) => {
    e.preventDefault();                                      // stop form submit reload
    await api.put(
      `/teachers/${teacherId}/classes/${classId}/students/${studentId}/mark`, // endpoint
      { mark }                                               // payload body
    );
    nav("/teacher");                                         // back to teacher dashboard
  };

  return (
    <div className="dash-wrap">{/* Shell/Background */}
      <header className="dash-topbar">
        <div className="row" style={{ gap: 8, alignItems: "center" }}>
          <button className="btn btn-ghost" onClick={() => nav("/teacher")}>
            ← Dashboard
          </button>
          <div className="dash-title">Teacher — Enter Mark</div>
        </div>
      </header>

      <main className="dash-container">
        <section className="card" style={{ maxWidth: 700, margin: "0 auto" }}>
          <h2 style={{ marginBottom: 12 }}>Enter Mark</h2>
          {/* Context: show resolved names */}
          <div style={{ color: "#6b7280", marginBottom: 8 }}>
            {className || `Class #${classId}`} — {studentName || `Student #${studentId}`}
          </div>

          {/* Form for entering the mark */}
          <form className="grid" style={{ gap: 12 }} onSubmit={save}>
            <input
              className="input"
              value={mark}
              onChange={(e) => setMark(e.target.value)}
              placeholder="e.g. A+ / 95"
            />

            {/* Action row: Cancel/Save */}
            <div className="row" style={{ justifyContent: "space-between", marginTop: 8 }}>
              <button type="button" className="btn" onClick={() => nav("/teacher")}>
                Cancel
              </button>
              <button className="btn btn-primary" type="submit">
                Save
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
