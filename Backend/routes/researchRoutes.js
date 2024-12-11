const express = require("express");
const db = require("../db/dbConnection");
const router = express.Router();
const {
  addResearchData,
  addBulkResearchData,
} = require("../controllers/researchController");
const XLSX = require("xlsx");
const multer = require("multer");
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });
router.post("/create-research", addResearchData);
router.post(
  "/bulk-upload-research",
  upload.single("file"),
  addBulkResearchData
);
router.get("/bulk-download-template", (req, res) => {
  // Create a new workbook and a worksheet
  const workbook = XLSX.utils.book_new();
  const worksheetData = [
    [
      "title",
      "researchDesc",
      "researchFund",
      "fundedBy",
      "status",
      "publicationDate",
      "publisher",
      "researchPaperLink",
      "people",
    ],
    [
      "Sample Title 1",
      "Sample Desc 1",
      "10000",
      "XYZ Corp",
      "In Progress",
      "",
      "",
      "",
      "email1@example.com, email2@example.com",
    ],
    [
      "Sample Title 2",
      "Sample Desc 2",
      "20000",
      "ABC Inc",
      "Published",
      "2023-01-01",
      "Sample Publisher",
      "https://example.com/sample-paper",
      "email3@example.com",
    ],
  ];
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  XLSX.utils.book_append_sheet(workbook, worksheet, "Research Template");


  // Write the workbook to a buffer
  const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });


  // Set the response headers
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=research_template.xlsx"
  );
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );


  // Send the buffer as the response
  res.send(buffer);
});


router.get("/download-research-data");
module.exports = router;






