const express = require("express");
const router = express.Router();

const attendanceController = require("../controllers/attendanceController");

// POST - mark attendance
router.post("/", attendanceController.markAttendance);

// GET - fetch attendance
router.get("/", attendanceController.getAttendance);

// DELETE - delete attendance record
router.delete("/:id", attendanceController.deleteAttendance);

module.exports = router;

