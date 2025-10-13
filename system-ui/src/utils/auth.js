export function setAuth(data) {
  localStorage.setItem("auth", JSON.stringify(data));
}
export function getAuth() {
  const raw = localStorage.getItem("auth");
  return raw ? JSON.parse(raw) : null;
}
export function clearAuth() {
  localStorage.removeItem("auth");
}
export function requireRole(role) {
  const a = getAuth();
  return a && a.role === role;
}
