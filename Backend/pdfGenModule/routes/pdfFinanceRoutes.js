// routes/pdfRoutes.js
const express = require("express");
const router = express.Router();
const pdfController = require("../controllers/pdfFinanceController");

router.post("/generate-finance-pdf", pdfController.generateFinancePdf);
router.post("/generate-finance-html", pdfController.generateFinanceHtml);

module.exports = router;