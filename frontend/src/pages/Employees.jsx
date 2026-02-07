import { useState, useEffect } from "react";
import { getEmployees, addEmployee, deleteEmployee } from "../services/api";
import { useToast } from "../components/Toast";
import ConfirmModal from "../components/ConfirmModal";
import "./Employees.css";

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: "",
    fullName: "",
    email: "",
    department: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTargetId, setConfirmTargetId] = useState(null);

  useEffect(() => {
    loadEmployees();
  }, []);

  const toast = useToast();

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const response = await getEmployees();
      setEmployees(response.data);
    } catch (error) {
      console.error("Error loading employees:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.employeeId.trim()) errors.employeeId = "Employee ID is required";
    if (!formData.fullName.trim()) errors.fullName = "Full name is required";
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }
    if (!formData.department.trim()) errors.department = "Department is required";
    return errors;
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      await addEmployee({
        name: formData.fullName,
        email: formData.email,
        employeeId: formData.employeeId,
        department: formData.department,
      });

      await loadEmployees();
      setShowAddModal(false);
      setFormData({ employeeId: "", fullName: "", email: "", department: "" });
      setFormErrors({});
      toast.success("Employee added");
    } catch (error) {
      toast.error(error.message || "Failed to add employee");
    } finally {
      setSubmitting(false);
    }
  };

  // 🗑 DELETE EMPLOYEE
  const handleDeleteEmployee = async (id) => {
    try {
      await deleteEmployee(id);
      await loadEmployees();
      toast.success("Employee deleted");
    } catch (error) {
      toast.error("Failed to delete employee");
    } finally {
      setConfirmOpen(false);
      setConfirmTargetId(null);
    }
  };

  return (
    <div className="employees">
      <div className="employees-header">
        <div className="page-header">
          <h1 className="page-title">Employees</h1>
          <p className="page-subtitle">Manage your organization's employees</p>
        </div>

        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          + Add Employee
        </button>
      </div>

      {loading ? (
        <div className="loading-spinner">Loading employees...</div>
      ) : employees.length === 0 ? (
        <div className="empty-state-centered">
          <div className="empty-state-icon">👥</div>
          <h3>No employees found</h3>
          <p>Get started by adding your first employee.</p>
          <button
            className="btn btn-primary"
            onClick={() => setShowAddModal(true)}
            style={{ marginTop: "20px" }}
          >
            + Add Employee
          </button>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee._id}>
                  <td>{employee.employeeId}</td>
                  <td>{employee.name}</td>
                  <td>{employee.email}</td>
                  <td>{employee.department}</td>
                  <td>
                    <button
                      className="btn btn-danger"
                        onClick={() => { setConfirmTargetId(employee._id); setConfirmOpen(true); }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        open={confirmOpen}
        title="Delete employee"
        message="Are you sure you want to delete this employee?"
        onConfirm={() => handleDeleteEmployee(confirmTargetId)}
        onCancel={() => { setConfirmOpen(false); setConfirmTargetId(null); }}
      />

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => !submitting && setShowAddModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Add Employee</h2>
              <button
                className="modal-close"
                onClick={() => setShowAddModal(false)}
                disabled={submitting}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddEmployee}>
              <div className="modal-body">
                  {["employeeId", "fullName", "email"].map((field) => (
                  <div className="form-group" key={field}>
                    <label className="form-label required">
                      {field.replace(/([A-Z])/g, " $1")}
                    </label>
                    <input
                      type="text"
                      name={field}
                      className={`form-input ${formErrors[field] ? "error" : ""}`}
                      value={formData[field]}
                      onChange={handleInputChange}
                      disabled={submitting}
                    />
                    {formErrors[field] && (
                      <div className="form-error">{formErrors[field]}</div>
                    )}
                  </div>
                ))}
                <div className="form-group">
                  <label className="form-label required">Department</label>
                  <select
                    name="department"
                    className={`form-select ${formErrors.department ? "error" : ""}`}
                    value={formData.department}
                    onChange={handleInputChange}
                    disabled={submitting}
                  >
                    <option value="">Select department</option>
                    <option value="IT">IT</option>
                    <option value="HR">HR</option>
                    <option value="Sales">Sales</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Operations">Operations</option>
                    <option value="Admin">Admin</option>
                  </select>
                  {formErrors.department && (
                    <div className="form-error">{formErrors.department}</div>
                  )}
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAddModal(false)}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? "Adding..." : "Add Employee"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Employees;
