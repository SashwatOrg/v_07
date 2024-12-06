const puppeteer = require('puppeteer');
const eventQueries = require('../queries/EventQueries');
const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

const pdfDirectory = path.join(__dirname, '..', '..', 'public', 'pdfs');

if (!fs.existsSync(pdfDirectory)) {
  fs.mkdirSync(pdfDirectory, { recursive: true });
}

const generateEventPdf = async (req, res) => {
  try {
    const { options, year, user } = req.body;

    // Validate input
    if (!options || !year || !user) {
      return res.status(400).json({ 
        message: 'Missing required parameters',
        details: {
          options: !!options,
          year: !!year,
          user: !!user
        }
      });
    }

    // Fetch event data with enhanced query
    let eventData = [];
    try {
      eventData = await eventQueries.getEventData(options, year);
    } catch (dataError) {
      console.error('Error fetching event data:', dataError);
      return res.status(500).json({ 
        message: 'Failed to retrieve event data',
        error: dataError.message 
      });
    }

    if (eventData.length === 0) {
      return res.status(404).json({
        message: 'No event data found for the specified year and options.',
      });
    }

    // Fetch institute name
    let instituteName = 'Institute Name';
    try {
      const instituteId = user.institute_id;
      const instituteData = await eventQueries.getInstituteName(instituteId);
      instituteName = instituteData[0]?.institute_name || instituteName;
    } catch (instituteError) {
      console.warn('Error fetching institute name:', instituteError);
    }

    const pdfFileName = `event_report_${year}_${Date.now()}.pdf`;
    const pdfFilePath = path.join(pdfDirectory, pdfFileName);

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Enhanced HTML rendering
    const htmlContent = await ejs.renderFile(
      path.join(__dirname, '..', 'views', 'EventReportView.ejs'),
      {
        eventData,
        year,
        user,
        instituteName,
        // Add additional context if needed
        totalEvents: eventData.length,
        eventTypes: [...new Set(eventData.map(event => event.event_type))]
      }
    );

    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    await page.pdf({ 
      path: pdfFilePath, 
      format: 'A4', 
      printBackground: true,
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm'
      }
    });

    await browser.close();

    return res
      .status(200)
      .json({ 
        message: 'PDF generated successfully', 
        filePath: pdfFileName,
        totalEvents: eventData.length
      });
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ 
      message: 'Error generating PDF',
      error: error.message 
    });
  }
};
const generateEventHtml = async (req, res) => {
    try {
      const { options, year, user } = req.body;
  
      // Validate input
      if (!options || !year || !user) {
        return res.status(400).json({ 
          message: 'Missing required parameters',
          details: {
            options: !!options,
            year: !!year,
            user: !!user
          }
        });
      }
  
      // Fetch event data
      let eventData = [];
      try {
        eventData = await eventQueries.getEventData(options, year);
      } catch (dataError) {
        console.error('Error fetching event data:', dataError);
        return res.status(500).json({ 
          message: 'Failed to retrieve event data',
          error: dataError.message 
        });
      }
  
      // Fetch institute name
      let instituteName = 'Institute Name';
      try {
        const instituteId = user.institute_id;
        const instituteData = await eventQueries.getInstituteName(instituteId);
        instituteName = instituteData[0]?.institute_name || instituteName;
      } catch (instituteError) {
        console.warn('Error fetching institute name:', instituteError);
      }
  
      // Prepare file path
      const htmlFileName = `event_report_${year}_${Date.now()}.html`;
      const htmlFilePath = path.join(
        __dirname,
        '..',
        '..',
        'public',
        'html_reports',
        htmlFileName
      );
  
      // Ensure directory exists
      try {
        const htmlDirectory = path.dirname(htmlFilePath);
        if (!fs.existsSync(htmlDirectory)) {
          fs.mkdirSync(htmlDirectory, { recursive: true });
        }
      } catch (dirError) {
        console.error('Error creating directory:', dirError);
        return res.status(500).json({ 
          message: 'Failed to create report directory',
          error: dirError.message 
        });
      }
  
      // Render HTML content
      let htmlContent;
      try {
        htmlContent = await ejs.renderFile(
          path.join(__dirname, '..', 'views', 'EventReportView.ejs'),
          {
            eventData,
            year,
            user,
            instituteName,
          }
        );
      } catch (renderError) {
        console.error('Error rendering HTML template:', renderError);
        return res.status(500).json({ 
          message: 'Failed to generate HTML report',
          error: renderError.message 
        });
      }
  
      // Write HTML file
      try {
        fs.writeFileSync(htmlFilePath, htmlContent, 'utf-8');
      } catch (writeError) {
        console.error('Error writing HTML file:', writeError);
        return res.status(500).json({ 
          message: 'Failed to save HTML report',
          error: writeError.message 
        });
      }
  
      return res.status(200).json({
        message: 'HTML generated successfully',
        filePath: `/html_reports/${htmlFileName}`,
        eventCount: eventData.length
      });
    } catch (error) {
      console.error('Unexpected error in generateEventHtml:', error);
      res.status(500).json({ 
        message: 'Unexpected error generating HTML report',
        error: error.message 
      });
    }
  };

module.exports = { generateEventPdf, generateEventHtml };