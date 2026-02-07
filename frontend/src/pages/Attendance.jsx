import { useEffect, useState } from "react";
import {
  getEmployees,
  createAttendance,
  getAttendance,
  deleteAttendance,
} from "../services/api";
import "./Attendance.css";
import { useToast } from "../components/Toast";
import ConfirmModal from "../components/ConfirmModal";

const Attendance = () => {
  const [employees, setEmployees] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [employeeId, setEmployeeId] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [empIdentifier, setEmpIdentifier] = useState(""); // optional company employeeId
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadEmployees();
    loadAttendance();
  }, []);

  const toast = useToast();

  const loadEmployees = async () => {
    try {
      const res = await getEmployees();
      setEmployees(res.data);
    } catch (err) {
      console.error("Failed to load employees", err);
    }
  };

  const loadAttendance = async () => {
    try {
      const res = await getAttendance();
      setAttendanceRecords(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load attendance", err);
      setAttendanceRecords([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Determine which employee id to send: prefer selected employeeId (mongo _id).
    let employeeMongoIdToSend = employeeId;

    // If no selected mongo id but user provided an empIdentifier, try to match locally
    if (!employeeMongoIdToSend && empIdentifier) {
      const emp = employees.find((x) => x.employeeId === empIdentifier);
      if (emp) employeeMongoIdToSend = emp._id;
    }

    if (!employeeMongoIdToSend || !date || !status) {
      toast.error("Employee (by name or ID), date and status are required");
      return;
    }

    setLoading(true);
    try {
      // send employeeMongoId as employeeMongoId or, in case someone sends employeeId, backend handles both
      await createAttendance({
        employeeMongoId: employeeMongoIdToSend,
        date,
        status,
      });

      toast.success("Attendance saved successfully");
      setEmployeeId("");
      setEmployeeName("");
      setEmpIdentifier("");
      setDate("");
      setStatus("");
      await loadAttendance();
    } catch (err) {
      console.error(err);
      // show backend message when possible
      const msg = err?.response?.data?.message || "Failed to save attendance";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const getEmployeeName = (empId) => {
    const emp = employees.find((e) => e._id === empId);
    return emp ? emp.name : "Unknown";
  };

  const handleDeleteAttendance = async (id) => {
    try {
      await deleteAttendance(id);
      await loadAttendance();
      toast.success("Attendance record deleted");
    } catch (error) {
      toast.error("Failed to delete attendance record");
    } finally {
      setConfirmOpen(false);
      setConfirmTargetId(null);
    }
  };

  const [filterEmployee, setFilterEmployee] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTargetId, setConfirmTargetId] = useState(null);

  const filteredRecords = attendanceRecords.filter((record) => {
    const dateMatch = !filterDate || record.date === filterDate;
    const statusMatch = !filterStatus || record.status === filterStatus;
    const employeeMatch = !filterEmployee || (record.employee && record.employee._id === filterEmployee);
    return dateMatch && statusMatch && employeeMatch;
  });

  // can save if there's a selected employee (mongo id) OR an empIdentifier that matches an employee
  const empMatchByIdentifier = empIdentifier ? employees.find((x) => x.employeeId === empIdentifier) : null;
  const canSave = (employeeId || (empIdentifier && empMatchByIdentifier)) && date && status;

  return (
    <div className="attendance">
      <div className="page-header">
        <h1 className="page-title">Attendance</h1>
        <p className="page-subtitle">Mark and track employee attendance</p>
      </div>

      <div className="attendance-form-card">
        <h2>Record Attendance</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label required">Employee</label>
              {/* Searchable input with datalist for quick search by name */}
              <input
                className="form-input"
                list="employees-list"
                placeholder="Type name or select"
                value={employeeName}
                onChange={(e) => {
                  const v = e.target.value;
                  setEmployeeName(v);
                  // if exact match to a name, set employeeId (mongo _id)
                  const matched = employees.find((emp) => emp.name === v);
                  if (matched) setEmployeeId(matched._id);
                  else setEmployeeId("");
                }}
              />
              <datalist id="employees-list">
                {employees.map((emp) => (
                  <option key={emp._id} value={emp.name} />
                ))}
              </datalist>
              <small style={{display: 'block', marginTop: 8, color: '#6b7280'}}>
                Or enter Employee ID below if you don't have the name
              </small>
            </div>

            <div className="form-group">
              <label className="form-label required">Date</label>
              <input
                className="form-input"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label required">Status</label>
              <select
                className="form-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">Select status</option>
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Employee ID (optional)</label>
              <input
                className="form-input"
                type="text"
                placeholder="e.g. EMP-001"
                value={empIdentifier}
                onChange={(e) => setEmpIdentifier(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || !canSave}
          >
            {loading ? "Saving..." : "Save Attendance"}
          </button>
        </form>
      </div>

      {attendanceRecords.length > 0 && (
        <>
          <div className="filter-section">
            <h3>Filter Records</h3>
            <div className="filter-row">
              <div className="form-group">
                <label className="form-label">Filter by Employee</label>
                <select
                  className="form-select"
                  value={filterEmployee}
                  onChange={(e) => setFilterEmployee(e.target.value)}
                >
                  <option value="">All employees</option>
                  {employees.map((emp) => (
                    <option key={emp._id} value={emp._id}>
                      {emp.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Filter by Date</label>
                <input
                  className="form-input"
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Filter by Status</label>
                <select
                  className="form-select"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="">All</option>
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                </select>
              </div>
            </div>
          </div>

          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record) => (
                  <tr key={record._id}>
                    <td>{record.employee ? record.employee.name : "Unknown"}</td>
                    <td>{new Date(record.date).toLocaleDateString()}</td>
                    <td>
                      <span
                        className={`status-badge status-${record.status.toLowerCase()}`}
                      >
                        {record.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-danger"
                        onClick={() => {
                          setConfirmTargetId(record._id);
                          setConfirmOpen(true);
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      <ConfirmModal
        open={confirmOpen}
        title="Delete attendance"
        message="Are you sure you want to delete this attendance record?"
        onConfirm={() => handleDeleteAttendance(confirmTargetId)}
        onCancel={() => { setConfirmOpen(false); setConfirmTargetId(null); }}
      />
    </div>
  );
};

export default Attendance;

