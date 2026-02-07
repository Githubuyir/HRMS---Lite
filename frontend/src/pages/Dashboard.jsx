import { useEffect, useState } from "react";
import { getEmployees, getAttendance } from "../services/api";
import "./Dashboard.css";

function Dashboard() {
  const [employeeCount, setEmployeeCount] = useState(0);
  const [attendanceCount, setAttendanceCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const employeesResponse = await getEmployees();
        setEmployeeCount(employeesResponse.data.length);

        try {
          const attendanceResponse = await getAttendance();
          setAttendanceCount(attendanceResponse.data.length);
        } catch (error) {
          // Attendance endpoint might not have data yet
          setAttendanceCount(0);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Overview of your HR management system</p>
      </div>

      {loading ? (
        <p>Loading dashboard...</p>
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-content">
                <h3>Total Employees</h3>
                <p className="stat-value">{employeeCount}</p>
              </div>
              <div className="stat-icon">👥</div>
            </div>
            <div className="stat-card">
              <div className="stat-content">
                <h3>Attendance Records</h3>
                <p className="stat-value">{attendanceCount}</p>
              </div>
              <div className="stat-icon">📋</div>
            </div>
          </div>

          {employeeCount === 0 && attendanceCount === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">👥</div>
              <h3>No data yet</h3>
              <p>Add employees and mark attendance to see your dashboard stats.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Dashboard;
