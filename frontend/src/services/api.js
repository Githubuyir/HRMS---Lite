import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// ================= EMPLOYEES =================
export const getEmployees = () => API.get("/employees");

export const addEmployee = (data) => API.post("/employees", data);

export const deleteEmployee = (id) => API.delete(`/employees/${id}`);

// ================= ATTENDANCE =================
export const createAttendance = (data) => API.post("/attendance", data);

export const getAttendance = () => API.get("/attendance");

export const deleteAttendance = (id) => API.delete(`/attendance/${id}`);

export default API;
