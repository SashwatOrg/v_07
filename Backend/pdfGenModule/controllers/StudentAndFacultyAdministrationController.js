const puppeteer = require('puppeteer');
const studentFacultyQueries = require('../queries/StudentAndFacultyAdministrationQueries');
const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

const pdfDirectory = path.join(__dirname, '..', '..', 'public', 'pdfs');
const htmlDirectory = path.join(__dirname, '..', '..', 'public', 'html_reports');

// Ensure directories exist
[pdfDirectory, htmlDirectory].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const generateStudentFacultyPdf = async (req, res) => {
  try {
    const { options, year, user } = req.body;
    console.log('Generating Student and Faculty PDF', { year, options, user });

    // Fetch student and faculty data based on selected options
    const studentFacultyData = await studentFacultyQueries.getStudentAndFacultyData(options, year);
    
    if (studentFacultyData.length === 0) {
      return res.status(404).json({
        message: 'No student and faculty data found for the specified year and options.',
      });
    }

    // Fetch institute details
    const instituteNameResult = await studentFacultyQueries.getInstituteName(user.institute_id);
    const instituteName = instituteNameResult[0]?.institute_name || 'Institute Name';

    // Additional data fetching based on options
    const additionalData = {};

    // Fetch achievement types if option 3 is selected
    if (options.includes('3')) {
      additionalData.achievementTypes = await studentFacultyQueries.getAchievementTypes(year);
    }

    // Fetch research funding analysis if option 4 is selected
    if (options.includes('4')) {
      additionalData.researchFundingAnalysis = await studentFacultyQueries.getResearchFundingAnalysis(year);
    }

    // Generate unique filename
    const timestamp = Date.now();
    const pdfFileName = `student_faculty_report_${year}_${timestamp}.pdf`;
    const pdfFilePath = path.join(pdfDirectory, pdfFileName);

    // Launch browser and create PDF
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
      const page = await browser.newPage();

      // Render HTML content
      const htmlContent = await ejs.renderFile(
        path.join(__dirname, '..', 'views', 'StudentAndFacultyAdministrationReportView.ejs'),
        {
          studentFacultyData,
          year,
          user,
          instituteName,
          additionalData,
          options
        }
      );

      // Set content and generate PDF
      await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
      await page.pdf({ 
        path: pdfFilePath, 
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20mm',
          bottom: '20mm',
          left: '20mm',
          right: '20mm'
        }
      });
    } finally {
      await browser.close();
    }

    return res.status(200).json({ 
      message: 'PDF generated successfully', 
      filePath: pdfFileName 
    });

  } catch (error) {
    console.error('Error generating Student and Faculty PDF:', error);
    res.status(500).json({ 
      message: 'Error generating Student and Faculty PDF',
      error: error.toString(),
      stack: error.stack
    });
  }
};

const generateStudentFacultyHtml = async (req, res) => {
  try {
    const { options, year, user } = req.body;
    console.log('Generating Student and Faculty HTML', { year, options, user });

    // Fetch student and faculty data based on selected options
    const studentFacultyData = await studentFacultyQueries.getStudentAndFacultyData(options, year);
    
    if (studentFacultyData.length === 0) {
      return res.status(404).json({
        message: 'No student and faculty data found for the specified year and options.',
      });
    }

    // Fetch institute details
    const instituteNameResult = await studentFacultyQueries.getInstituteName(user.institute_id);
    const instituteName = instituteNameResult[0]?.institute_name || 'Institute Name';

    // Additional data fetching based on options
    const additionalData = {};

    // Fetch achievement types if option 3 is selected
    if (options.includes('3')) {
      additionalData.achievementTypes = await studentFacultyQueries.getAchievementTypes(year);
    }

    // Fetch research funding analysis if option 4 is selected
    if (options.includes('4')) {
      additionalData.researchFundingAnalysis = await studentFacultyQueries.getResearchFundingAnalysis(year);
    }

    // Generate unique filename
    const timestamp = Date.now();
    const htmlFileName = `student_faculty_report_${year}_${timestamp}.html`;
    const htmlFilePath = path.join(htmlDirectory, htmlFileName);

    // Render HTML content
    const htmlContent = await ejs.renderFile(
      path.join(__dirname, '..', 'views', 'StudentAndFacultyAdministrationReportView.ejs'),
      {
        studentFacultyData,
        year,
        user,
        instituteName,
        additionalData,
        options
      }
    );

    // Write HTML file
    fs.writeFileSync(htmlFilePath, htmlContent, 'utf-8');

    return res.status(200).json({
      message: 'HTML generated successfully',
      filePath: `/html_reports/${htmlFileName}`,
    });

  } catch (error) {
    console.error('Error generating Student and Faculty HTML:', error);
    res.status(500).json({ 
      message: 'Error generating Student and Faculty HTML report',
      error: error.toString(),
      stack: error.stack
    });
  }
};

module.exports = { 
  generateStudentFacultyPdf, 
  generateStudentFacultyHtml 
};