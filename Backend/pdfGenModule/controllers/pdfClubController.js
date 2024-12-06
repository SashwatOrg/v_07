const puppeteer = require('puppeteer');
const clubQueries = require('../queries/ClubQueries');
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

const generateClubPdf = async (req, res) => {
  try {
    const { options, year, user } = req.body;
    console.log('Generating Club PDF', { year, options, user });

    // Fetch club data based on selected options
    const clubData = await clubQueries.getClubData(options, year);
    
    if (clubData.length === 0) {
      return res.status(404).json({
        message: 'No club data found for the specified year and options.',
      });
    }

    // Fetch institute and additional details
    const instituteNameResult = await clubQueries.getInstituteName(user.institute_id);
    const instituteName = instituteNameResult[0]?.institute_name || 'Institute Name';

    // Additional data fetching based on options
    const additionalData = {};

    // Fetch club faculties if option 5 is selected
    if (options.includes('5')) {
      additionalData.facultyData = await clubQueries.getClubFaculties(user.institute_id, year);
    }

    // Fetch club event summaries if option 6 is selected
    if (options.includes('6')) {
      additionalData.clubEventSummaries = await Promise.all(
        clubData.map(async (club) => {
          try {
            const summary = await clubQueries.getClubEventSummary(club.club_id, year);
            return {
              clubName: club.club_name,
              summary: summary[0] || {
                total_events: 0,
                total_budget: 0,
                avg_budget: 0,
                event_types: 'No Events',
                first_event: null,
                last_event: null
              }
            };
          } catch (error) {
            console.error(`Error fetching summary for ${club.club_name}:`, error);
            return {
              clubName: club.club_name,
              summary: {
                total_events: 0,
                total_budget: 0,
                avg_budget: 0,
                event_types: 'No Events',
                first_event: null,
                last_event: null
              }
            };
          }
        })
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const pdfFileName = `club_report_${year}_${timestamp}.pdf`;
    const pdfFilePath = path.join(pdfDirectory, pdfFileName);

    // Launch browser and create PDF
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
      const page = await browser.newPage();

      // Define the inline CSS
      const inlineCSS = `
        <style>
          :root {
            --primary-color: #2c3e50;
            --secondary-color: #3498db;
            --text-color: #333;
            --background-color: #f4f6f7;
          }

          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: var(--text-color);
            background-color: var(--background-color);
          }

          .report-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background-color: white;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
          }

          .report-header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 2px solid var(--primary-color);
          }

          .report-header h1 {
            color: var(--primary-color);
            margin-bottom: 10px;
          }

          .report-metadata {
            display: flex;
            justify-content: space-between;
            margin: 15px 0;
            font-size: 0.9em;
            color: #666;
          }

          .section-header {
            background-color: var(--primary-color);
            color: white;
            padding: 12px;
            margin-top: 20px;
            text-align: center;
            font-weight: bold;
          }

          .club-summary-stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-bottom: 20px;
          }

          .stat-box {
            background-color: #f1f1f1;
            padding: 15px;
            text-align: center;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
          }

          .club-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }

          .club-table th {
            background-color: var(--primary-color);
            color: white;
            padding: 12px;
            text-align: left;
          }

          .club-table td {
            padding: 10px;
            border: 1px solid #ddd;
          }

          .club-table tr:nth-child(even) {
            background-color: #f2f2f2;
          }

          .no-data {
            text-align: center;
            color: #777;
            padding: 20px;
            background-color: #f9f9f9;
          }

          .report-footer {
            text-align: center;
            padding: 15px;
            background-color: var(--primary-color);
            color: white;
            font-size: 0.9em;
            margin-top: 20px;
          }
        </style>
      `;

      // Render HTML content with inline CSS
      const htmlContent = await ejs.renderFile(
        path.join(__dirname, '..', 'views', 'ClubReportView.ejs'),
        {
          clubData,
          year,
          user,
          instituteName,
          additionalData,
          options,
          inlineCSS // Pass the inline CSS to the template
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
    console.error('Error generating Club PDF:', error);
    res.status(500).json({ 
      message: 'Error generating Club PDF',
      error: error.toString(),
      stack: error.stack
    });
  }
};

const generateClubHtml = async (req, res) => {
  try {
    const { options, year, user } = req.body;
    console.log('Generating Club HTML', { year, options, user });

    // Fetch club data based on selected options
    const clubData = await clubQueries.getClubData(options, year);
    
    if (clubData.length === 0) {
      return res.status(404).json({
        message: 'No club data found for the specified year and options.',
      });
    }

    // Fetch institute and additional details
    const instituteNameResult = await clubQueries.getInstituteName(user.institute_id);
    const instituteName = instituteNameResult[0]?.institute_name || 'Institute Name';

    // Additional data fetching based on options
    const additionalData = {};

    // Fetch club faculties if option 5 is selected
    if (options.includes('5')) {
      additionalData.facultyData = await clubQueries.getClubFaculties(user.institute_id, year);
    }

    // Fetch club event summaries if option 6 is selected
    if (options.includes('6')) {
      additionalData.clubEventSummaries = await Promise.all(
        clubData.map(async (club) => {
          try {
            const summary = await clubQueries.getClubEventSummary(club.club_id, year);
            return {
              clubName: club.club_name,
              summary: summary[0] || {
                total_events: 0,
                total_budget: 0,
                avg_budget: 0,
                event_types: 'No Events',
                first_event: null,
                last_event: null
              }
            };
          } catch (error) {
            console.error(`Error fetching summary for ${club.club_name}:`, error);
            return {
              clubName: club.club_name,
              summary: {
                total_events: 0,
                total_budget: 0,
                avg_budget: 0,
                event_types: 'No Events',
                first_event: null,
                last_event: null
              }
            };
          }
        })
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const htmlFileName = `club_report_${year}_${timestamp}.html`;
    const htmlFilePath = path.join(htmlDirectory, htmlFileName);

    // Render HTML content
    const htmlContent = await ejs.renderFile(
      path.join(__dirname, '..', 'views', 'ClubReportView.ejs'),
      {
        clubData,
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
    console.error('Error generating Club HTML:', error);
    res.status(500).json({ 
      message: 'Error generating Club HTML report',
      error: error.toString(),
       stack: error.stack
    });
  }
};

module.exports = { 
  generateClubPdf, 
  generateClubHtml 
};