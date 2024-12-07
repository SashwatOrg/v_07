const puppeteer = require("puppeteer");
const acadQueries = require("../queries/AcadDepartmentQueries");
const fs = require("fs");
const path = require("path");
const ejs = require("ejs");

const pdfDirectory = path.join(__dirname, "..", "..", "public", "pdfs");

// Ensure the PDF directory exists
if (!fs.existsSync(pdfDirectory)) {
  fs.mkdirSync(pdfDirectory, { recursive: true }); // Create the directory if it doesn't exist
}

const generateAcademicPdf = async (req, res) => {
  try {
    const { year, user } = req.body; // Get user details from request

    // Fetch data for the academic report
    const studentData = await acadQueries.getStudentData(year);
    const facultyData = await acadQueries.getFacultyData(year);
    const programData = await acadQueries.getProgramData(year);
    const resultData = await acadQueries.getResultData(year);

    const pdfFileName = `academic_report_${year}.pdf`; // Example file name
    const pdfFilePath = path.join(pdfDirectory, pdfFileName); // Use the absolute path

    // Use Puppeteer to generate PDF
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Check if data is not empty before generating the PDF
    if (
      studentData.length === 0 &&
      facultyData.length === 0 &&
      programData.length === 0 &&
      resultData.length === 0
    ) {
      return res.status(404).json({
        message: "No academic data found for the specified year.",
      });
    }

    // Fetch institute name based on institute_id
    const instituteId = user.institute_id; // Get institute_id from user
    const instituteData = await acadQueries.getInstituteName(instituteId);
    const instituteName = instituteData[0]?.institute_name || "Institute Name"; // Default name if not found

    // Prepare the HTML content for the PDF
    const htmlContent = `
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; }
                    h1 { text-align: center; }
                    table { width: 100%; border-collapse: collapse; }
                    th, td { border: 1px solid #ddd; padding: 8px; }
                    th { background-color: #f2f2f2; }
                </style>
            </head>
            <body>
                <h1>Academic Report for Year: ${year}</h1>
                <h2>Prepared by: ${user.first_name} ${user.last_name}</h2>
                <h3>Institute: ${instituteName}</h3>
                <h4>Student Data</h4>
                <table>
                    <thead>
                        <tr>
                            <th>Student ID</th>
                            <th>User ID</th>
                            <th>Program ID</th>
                            <th>Current Semester</th>
                            <th>Registration Number</th>
                            <th>Year</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${studentData
                          .map(
                            (student) => `
                            <tr>
                                <td>${student.student_id}</td>
                                <td>${student.user_id}</td>
                                <td>${student.program_id}</td>
                                <td>${student.current_semester}</td>
                                <td>${student.stud_reg || "N/A"}</td>
                                <td>${student.year || "N/A"}</td>
                            </tr>
                        `
                          )
                          .join("")}
                    </tbody>
                </table>

                <h4>Faculty Data</h4>
                <table>
                    <thead>
                        <tr>
                            <th>Faculty ID</th>
                            <th>User ID</th>
                            <th>Registration Number</th>
                            <th>Department ID</th>
                            <th>Year</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${facultyData
                          .map(
                            (faculty) => `
                            <tr>
                                <td>${faculty.faculty_id}</td>
                                <td>${faculty.user_id}</td>
                                <td>${faculty.reg_no || "N/A"}</td>
                                <td>${faculty.dept_id}</td>
                                <td>${faculty.year || "N/A"}</td>
                            </tr>
                        `
                          )
                          .join("")}
                    </tbody>
                </table>

                <h4>Program Data</h4>
                <table>
                    <thead>
                        <tr>
                            <th>Program ID</th>
                            <th>Program Name</th>
                            <th>Department ID</th>
                            <th>Duration</th>
                            <th>Intake</th>
                            <th>Semester Count</th>
                            <th>Year</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${programData
                          .map(
                            (program) => `
                            <tr>
                                <td>${program.prog_id}</td>
                                <td>${program.prog_name}</td>
                                <td>${program.dept_id}</td>
                                <td>${program.duration}</td>
                                <td>${program.intake || "N/A"}</td>
                                <td>${program.semester_count}</td>
                                <td>${program.year || "N/A"}</td>
                            </tr>
                        `
                          )
                          .join("")}
                    </tbody>
                </table>

                <h4>Result Data</h4>
                <table>
                    <thead>
                        <tr>
                            <th>Result ID</th>
                            <th>Enrollment ID</th>
                            <th>Grade</th>
                            <th>Status</th>
                            <th>Year</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${resultData
                          .map(
                            (result) => `
                            <tr>
                                <td>${result.result_id}</td>
                                <td>${result.enrollment_id}</td>
                                <td>${result.grade || "N/A"}</td>
                                <td>${result.res_status || "N/A"}</td>
                                <td>${result.year || "N/A"}</td>
                            </tr>
                        `
                          )
                          .join("")}
                    </tbody>
                </table>
            </body>
            </html>
        `;

    await page.setContent(htmlContent, { waitUntil: "domcontentloaded" });
    await page.pdf({ path: pdfFilePath, format: "A4" });

    await browser.close();

    // Check if the file exists after generation
    if (!fs.existsSync(pdfFilePath)) {
      return res
        .status(404)
        .json({ message: "PDF not found after generation" });
    }

    return res
      .status(200)
      .json({ message: "PDF generated successfully", filePath: pdfFileName });
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ message: "Error generating PDF" });
  }
};

const generateAcademicHtml = async (req, res) => {
  try {
    const { year, user } = req.body; // Get user details from request

    // Fetch data for the academic report
    const studentData = await acadQueries.getStudentData(year);
    const facultyData = await acadQueries.getFacultyData(year);
    const programData = await acadQueries.getProgramData(year);
    const resultData = await acadQueries.getResultData(year);

    const htmlFileName = `academic_report_${year}.html`; // Dynamic file name based on the year
    const htmlFilePath = path.join(
      __dirname,
      "..",
      "..",
      "public",
      "html_reports",
      htmlFileName
    );

    // Ensure the folder exists to store HTML files, if not, create it
    const htmlDirectory = path.dirname(htmlFilePath);
    if (!fs.existsSync(htmlDirectory)) {
      fs.mkdirSync(htmlDirectory, { recursive: true });
    }

    // Render HTML content using EJS
    const htmlContent = await ejs.renderFile(
      path.join(__dirname, "..", "views", "AcadDepartmentReportView.ejs"),
      {
        studentData,
        facultyData,
        programData,
        resultData,
        year,
        user,
        instituteName:
          (
            await acadQueries.getInstituteName(user.institute_id)
          )[0]?.institute_name || "Institute Name",
      }
    );

    // Write the generated HTML content to a file
    fs.writeFileSync(htmlFilePath, htmlContent, "utf-8");

    // Return the path for downloading the file
    return res.status(200).json({
      message: "HTML generated successfully",
      filePath: `/html_reports/${htmlFileName}`, // Path relative to the public folder
    });
  } catch (error) {
    console.error("Error generating HTML:", error);
    res.status(500).json({ message: "Error generating HTML report" });
  }
};

// Correctly export both functions
module.exports = { generateAcademicPdf, generateAcademicHtml };
