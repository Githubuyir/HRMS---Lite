const Employee = require("../models/Employee");

// @desc    Add new employee
// @route   POST /api/employees
// @access  Public
const addEmployee = async (req, res) => {
  try {
    const { name, email, employeeId, department } = req.body;

    // Basic validation
    if (!name || !email || !employeeId || !department) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Check for duplicate employee ID or email
    const existingEmployee = await Employee.findOne({
      $or: [{ email }, { employeeId }],
    });

    if (existingEmployee) {
      return res.status(409).json({
        message: "Employee with same email or ID already exists",
      });
    }

    const employee = await Employee.create({
      name,
      email,
      employeeId,
      department,
    });

    res.status(201).json(employee);
  } catch (error) {
    res.status(500).json({
      message: "Failed to add employee",
      error: error.message,
    });
  }
};

// @desc    Get all employees
// @route   GET /api/employees
// @access  Public
const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch employees",
      error: error.message,
    });
  }
};

module.exports = {
  addEmployee,
  getEmployees,
};
