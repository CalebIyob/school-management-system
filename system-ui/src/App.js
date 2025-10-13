import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import AdminCreateUser from "./pages/AdminCreateUser";
import AdminEditUser from "./pages/AdminEditUser";
import TeacherEnterMark from "./pages/TeacherEnterMark";
import TeacherEditMark from "./pages/TeacherEditMark";
import AdminClassesPage from "./pages/AdminClassesPage";
import AdminTeachersPage from "./pages/AdminTeachersPage";
import AdminStudentsPage from "./pages/AdminStudentsPage";
import AdminCreateStudent from "./pages/AdminCreateStudent";
import { getAuth } from "./utils/auth";

function Require({ role, children }) {
  const auth = getAuth();
  const location = useLocation();
  if (!auth || (role && auth.role !== role)) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }
  return children;
}

function RoutesOnly() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="/admin" element={
        <Require role="ADMIN"><AdminDashboard /></Require>
      } />
      <Route path="/admin/users/new" element={
        <Require role="ADMIN"><AdminCreateUser /></Require>
      } />
      <Route path="/admin/users/:role/:id/edit" element={
        <Require role="ADMIN"><AdminEditUser /></Require>
      } />

      <Route path="/teacher" element={
        <Require role="TEACHER"><TeacherDashboard /></Require>
      } />
      <Route path="/teacher/classes/:classId/students/:studentId/enter-mark" element={
        <Require role="TEACHER"><TeacherEnterMark /></Require>
      } />
      <Route path="/teacher/classes/:classId/students/:studentId/edit-mark" element={
        <Require role="TEACHER"><TeacherEditMark /></Require>
      } />

      <Route path="/student" element={
        <Require role="STUDENT"><StudentDashboard /></Require>
      } />
      <Route path="/admin/classes" element={
        <Require role="ADMIN"><AdminClassesPage /></Require>
      } />
      <Route path="/admin/teachers" element={
        <Require role="ADMIN"><AdminTeachersPage /></Require>
      } />
      <Route path="/admin/students" element={
        <Require role="ADMIN"><AdminStudentsPage /></Require>
      } />

      <Route path="/admin/students/new" element={<AdminCreateStudent />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <RoutesOnly />
    </BrowserRouter>
  );
}
