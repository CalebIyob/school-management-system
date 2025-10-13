import axios from "axios";

// With setupProxy, call relative paths like "/admin/classes"
const api = axios.create({
  baseURL: "",
  headers: { "Content-Type": "application/json", Accept: "application/json" },
});

export default api;
