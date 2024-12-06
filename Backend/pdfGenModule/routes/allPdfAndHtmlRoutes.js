const express = require("express");
const router = express.Router();
const pdfEventController = require("../controllers/pdfEventController");
const pdfFinanceController = require("../controllers/pdfFinanceController");
const pdfPlacementController = require("../controllers/pdfPlacementController");
const pdfInfrastructureController = require("../controllers/pdfInfrastructureController");
const pdfClubController = require("../controllers/pdfClubController");
const pdfStudentFacultyController = require("../controllers/StudentAndFacultyAdministrationController"); // Import the new controller
const bcrypt = require("bcrypt");
const db = require("../../db/dbConnection"); // Ensure you have the database connection imported

// Existing routes
router.post("/generate-event-pdf", pdfEventController.generateEventPdf);
router.post("/generate-event-html", pdfEventController.generateEventHtml);

router.post("/generate-placement-pdf", pdfPlacementController.generatePlacementPdf);
router.post("/generate-placement-html", pdfPlacementController.generatePlacementHtml);

router.post("/generate-finance-pdf", pdfFinanceController.generateFinancePdf);
router.post("/generate-finance-html", pdfFinanceController.generateFinanceHtml);

router.post("/generate-infrastructure-pdf", pdfInfrastructureController.generateInfrastructurePdf);
router.post("/generate-infrastructure-html", pdfInfrastructureController.generateInfrastructureHtml);

router.post("/generate-club-pdf", pdfClubController.generateClubPdf);
router.post("/generate-club-html", pdfClubController.generateClubHtml);

// New routes for Student and Faculty Administration
router.post("/generate-student-faculty-pdf", pdfStudentFacultyController.generateStudentFacultyPdf);
router.post("/generate-student-faculty-html", pdfStudentFacultyController.generateStudentFacultyHtml);

// Password-related routes
router.post("/set-report-password", async (req, res) => {
    try {
        const { report_type, year, password, coordinator_id } = req.body;
        
        // Validate input
        if (!report_type || !year || !password || !coordinator_id) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert password into database
        const query = `
            INSERT INTO report_passwords 
            (report_type, year, password, coordinator_id) 
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
            password = ?, 
            coordinator_id = ?
        `;
        
        await db.promise().query(query, [
            report_type, 
            year, 
            hashedPassword, 
            coordinator_id,
            hashedPassword,
            coordinator_id
        ]);

        res.status(200).json({ message: "Password set successfully." });
    } catch (error) {
        console.error("Error setting report password:", error);
        res.status(500).json({ 
            message: "Error setting report password", 
            error: error.message 
        });
    }
});

router.post("/verify-report-password", async (req, res) => {
    try {
        const { report_type, year, password } = req.body;

        // Validate input
        if (!report_type || !year || !password) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Retrieve stored password
        const query = "SELECT password FROM report_passwords WHERE report_type = ? AND year = ?";
        const [rows] = await db.promise().query(query, [report_type, year]);

        // Check if report exists
        if (rows.length === 0) {
            return res.status(404).json({ message: "Report not found." });
        }

        // Compare passwords
        const hashedPassword = rows[0].password;
        const match = await bcrypt.compare(password, hashedPassword);

        if (!match) {
            return res.status(403).json({ message: "Invalid password." });
        }

        // Password verified
        res.status(200).json({ 
            message: "Password verified.",
            access: true 
        });
    } catch (error) {
        console.error("Error verifying report password:", error);
        res.status(500).json({ 
            message: "Error verifying report password", 
            error: error.message 
        });
    }
});

// Optional: Route to check if a report password exists
router.get("/check-report-password", async (req, res) => {
    try {
        const { report_type, year } = req.query;

        // Validate input
        if (!report_type || !year) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Check if password exists
        const query = "SELECT COUNT(*) as count FROM report_passwords WHERE report_type = ? AND year = ?";
        const [rows] = await db.promise().query(query, [report_type, year]);

        res.status(200).json({ 
            passwordExists: rows[0].count > 0 
        });
    } catch (error) {
        console.error("Error checking report password:", error);
        res.status(500).json({ 
            message: "Error checking report password", 
            error: error.message 
        });
    }
});

module.exports = router;