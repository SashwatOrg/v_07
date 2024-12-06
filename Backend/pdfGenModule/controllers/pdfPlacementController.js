const puppeteer = require('puppeteer');
const userQueries = require('../queries/PlacementQueries');
const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

const pdfDirectory = path.join(__dirname, '..', '..', 'public', 'pdfs');

// Ensure the PDF directory exists
if (!fs.existsSync(pdfDirectory)) {
  fs.mkdirSync(pdfDirectory, { recursive: true }); // Create the directory if it doesn't exist
}

const generatePlacementPdf = async (req, res) => {
  try {
    const { options, year, user } = req.body; // Get user details from request
    // console.log('hey i am inside generatePdf');
    // console.log('Request body:', req.body);

    // Generate placement data based on options and year
    const placementData = await userQueries.getPlacementData(options, year);
    // console.log('Placement data retrieved:', placementData);

    const pdfFileName = `placement_report_${year}.pdf`; // Example file name
    const pdfFilePath = path.join(pdfDirectory, pdfFileName); // Use the absolute path

    // Use Puppeteer to generate PDF
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Check if placement data is not empty before generating the PDF
    if (placementData.length === 0) {
      return res.status(404).json({
        message: 'No placement data found for the specified year and options.',
      });
    }

    // Fetch institute name based on institute_id
    const instituteId = user.institute_id; // Get institute_id from user
    const instituteData = await userQueries.getInstituteName(instituteId); // You need to implement this function
    // console.log('the insitue data is ', instituteData);
    const instituteName = instituteData[0]?.institute_name || 'Institute Name'; // Default name if not found

    // Prepare the HTML content for the PDF
    const htmlContent = `
      <html>
      <head>
        <style>
          @page {
            margin: 50px;
            border: 1px solid #000; /* Border around each page */
          }
          body {
            font-family: Arial, sans-serif;
          }
          .footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 10px;
          }
          .page-number {
            position: fixed;
            bottom: 10px;
            right: 20px;
            font-size: 10px;
            color: #555;
          }
        </style>
      </head>
   <body>
  <!-- Timestamp at top-right corner -->
  <div style="position: fixed; top: 20px; right: 20px; font-size: 12px; color: #555;">
    Generated on: ${new Date().toLocaleString()}
  </div>

  <!-- Introductory content -->
  <div style="page-break-after: always; display: flex; flex-direction: column; justify-content: center; align-items: center; height: 90vh; text-align: center; font-family: Arial, sans-serif; line-height: 1.8;">
    <h1 style="margin: 0; font-size: 36px; font-weight: bold;">Placement Report for Year: ${year}</h1>
    <div style 
    <div style="margin-top: 20px; font-size: 18px;">
      <p style="margin: 5px 0;">Prepared by: ${user.first_name} ${user.last_name}</p>
      <p style="margin: 5px 0;">Department: Placement Department</p>
      <p style="margin: 5px 0;">Email: ${user.email}</p>
    </div>
  </div>

  <!-- Placement data table -->
  <table>
    <thead>
      <tr>
        <th>Student Name</th>
        <th>Company</th>
        <th>Position</th>
        <th>Salary</th>
      </tr>
    </thead>
    <tbody>
      ${placementData.map(data => `
        <tr>
          <td>${data.student_name}</td>
          <td>${data.company_name}</td>
          <td>${data.position}</td>
          <td>${data.salary}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <!-- Footer with Institute Name -->
  <div class="footer" style="position: fixed; bottom: 30px; left: 0; right: 0; text-align: center; font-size: 16px; font-weight: bold;">
    ${instituteName}
  </div>

  <!-- Page Number -->
  <div class="page-number">
    <script type="text/php">
      if ( isset($pdf) ) {
        $pdf->page_script('page {PAGE_NUM} of {PAGE_COUNT}');
      }
    </script>
  </div>
</body>
      </html>
    `;

    await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' });
    await page.pdf({ path: pdfFilePath, format: 'A4' });

    await browser.close();

    // Check if the file exists after generation
    if (!fs.existsSync(pdfFilePath)) {
      return res
        .status(404)
        .json({ message: 'PDF not found after generation' });
    }

    // Send the PDF file path or success message to the frontend
    return res
      .status(200)
      .json({ message: 'PDF generated successfully', filePath: pdfFileName });
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ message: 'Error generating PDF' });
  }
};

const generatePlacementHtml = async (req, res) => {
  try {
    // console.log('Inside generateHtml');
    const { options, year, user } = req.body; // Get user details from request
    // console.log('Request body:', req.body);

    // Fetch placement data based on selected options and year
    const placementData = await userQueries.getPlacementData(options, year);
    // console.log('Placement data retrieved:', placementData);

    // Fetch institute name based on institute_id
    const instituteId = user.institute_id; // Get institute_id from user
    const instituteData = await userQueries.getInstituteName(instituteId); // You need to implement this function
    // console.log('Institute data retrieved:', instituteData);
    const instituteName = instituteData[0]?.institute_name || 'Institute Name'; // Default name if not found

    const htmlFileName = `placement_report_${year}.html`; // Dynamic file name based on the year
    const htmlFilePath = path.join(
      __dirname,
      '..',
      '..',
      'public',
      'html_reports',
      htmlFileName
    );

    // Ensure the folder exists to store HTML files, if not, create it
    const htmlDirectory = path.dirname(htmlFilePath);
    if (!fs.existsSync(htmlDirectory)) {
      fs.mkdirSync(htmlDirectory, { recursive: true });
      // console.log('Directory created:', htmlDirectory); // Log for confirmation
    }

    // Render HTML content using EJS
    const htmlContent = await ejs.renderFile(
      path.join(__dirname, '..', 'views', 'PlacementReportView.ejs'),
      {
        placementData,
        year,
        user, // Pass user details for use in EJS
        instituteName, // Pass institute name
      }
    );

    // Write the generated HTML content to a file
    fs.writeFileSync(htmlFilePath, htmlContent, 'utf-8');
    // console.log('HTML file generated successfully:', htmlFilePath);

    // Return the path for downloading the file
    return res.status(200).json({
      message: 'HTML generated successfully',
      filePath: `/html_reports/${htmlFileName}`, // Path relative to the public folder
    });
  } catch (error) {
    
    console.error('Error generating HTML:', error);
    res.status(500).json({ message: 'Error generating HTML report' });
  }
};

// Correctly export both functions
module.exports = { generatePlacementPdf, generatePlacementHtml };