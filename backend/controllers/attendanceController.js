const Attendance = require("../models/Attendance");
const Employee = require("../models/Employee");

// Mark attendance
const markAttendance = async (req, res) => {
  try {
    // Accept either an employee Mongo _id (employeeMongoId) or the company's employeeId
    const { employeeMongoId, employeeId, date, status } = req.body;

    if ((!employeeMongoId && !employeeId) || !date || !status) {
      return res.status(400).json({
        message: "Employee, date and status are required",
      });
    }

    let employee = null;

    if (employeeMongoId) {
      employee = await Employee.findById(employeeMongoId);
    } else if (employeeId) {
      employee = await Employee.findOne({ employeeId: employeeId });
    }

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    const attendance = await Attendance.create({
      employee: employee._id,
      date,
      status,
    });

    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({
      message: "Failed to mark attendance",
      error: error.message,
    });
  }
};

// Get attendance records
const getAttendance = async (req, res) => {
  try {
    const records = await Attendance.find()
      .populate("employee", "name employeeMongoId department")
      .sort({ createdAt: -1 });

    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch attendance",
      error: error.message,
    });
  }
};

// Delete attendance record
const deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;

    const attendance = await Attendance.findByIdAndDelete(id);

    if (!attendance) {
      return res.status(404).json({
        message: "Attendance record not found",
      });
    }

    res.status(200).json({
      message: "Attendance record deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete attendance",
      error: error.message,
    });
  }
};

module.exports = {
  markAttendance,
  getAttendance,
  deleteAttendance,
};
