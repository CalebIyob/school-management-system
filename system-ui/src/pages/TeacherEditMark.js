import React, { useEffect, useState } from "react";           // React + hooks
import { useNavigate, useParams } from "react-router-dom";    // Read route params + nav
import api from "../api";                                     // Axios instance
import { getAuth } from "../utils/auth";                      // Read session
import "../styles/dashboard.css";                             // Styles

export default function TeacherEditMark() {
  const { classId, studentId } = useParams();                // Grab :classId and :studentId from URL
  const { teacherId } = getAuth() || {};                     // Current teacher id from session
  const [mark, setMark] = useState("");                      // Controlled input for mark
  const [className, setClassName] = useState("");            // Pretty class name to show
  const [studentName, setStudentName] = useState("");        // Pretty student name to show
  const nav = useNavigate();                                 // Navigate helper

  // Load the existing mark for this (student,class) enrollment
  useEffect(() => {
    api
      .get(`/students/${studentId}/marks`)                   // fetch all enrollments for student
      .then((r) => {
        const enr = (r.data || []).find(                     // find the one for this class
          (e) => String(e.id.classId) === String(classId)
        );
        if (enr?.mark) setMark(enr.mark);                    // prefill the input if a mark exists
      })
      .catch(console.error);                                 // log errors
  }, [classId, studentId]);

  // Fetch human-readable names for the header (class + student)
  useEffect(() => {
    // Class name via the teacher record (which contains classroom embedding)
    api.get("/admin/teachers").then(r => {
      const me = (r.data || []).find(t => t.id === teacherId); // find current teacher
      if (me?.classroom) {
        setClassName(me.classroom.name || `Class #${me.classroom.id}`); // set nice name
      }
    }).catch(console.error);

    // Student name from the students list
    api.get("/admin/students").then(r => {
      const s = (r.data || []).find(x => String(x.id) === String(studentId)); // find student
      if (s) setStudentName(s.name || `Student #${s.id}`);  // set nice name
    }).catch(console.error);
  }, [teacherId, studentId]);

  // Submit updated mark to backend and return to dashboard
  const save = async (e) => {
    e.preventDefault();                                      // stop page reload
    await api.put(
      `/teachers/${teacherId}/classes/${classId}/students/${studentId}/mark`, // endpoint
      { mark }                                               // body payload
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
          <div className="dash-title">Teacher — Edit Mark</div>
        </div>
      </header>

      <main className="dash-container">
        <section className="card" style={{ maxWidth: 700, margin: "0 auto" }}>
          <h2 style={{ marginBottom: 12 }}>Edit Mark</h2>
          {/* Context: show resolved names */}
          <div style={{ color: "#6b7280", marginBottom: 8 }}>
            {className || `Class #${classId}`} — {studentName || `Student #${studentId}`}
          </div>

          {/* Form for editing the mark */}
          <form className="grid" style={{ gap: 12 }} onSubmit={save}>
            <input
              className="input"
              value={mark}
              onChange={(e) => setMark(e.target.value)}
              placeholder="e.g. A / 90"
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
