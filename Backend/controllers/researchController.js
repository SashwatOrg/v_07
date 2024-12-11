const mysql = require("mysql2/promise");
const db = require("../db/dbConnection");
const XLSX = require("xlsx");
const addResearchData = async (req, res) => {
  const {
    title,
    researchDesc,
    researchFund,
    fundedBy,
    status,
    publicationDate,
    publisher,
    researchPaperLink,
    people,
  } = req.body;


  try {
    const [result] = await db.query(
      `INSERT INTO researchwork
      (title, description, fund, funded_by, status, publication_date, publisher, link)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        researchDesc,
        researchFund,
        fundedBy,
        status,
        publicationDate,
        publisher,
        researchPaperLink,
      ]
    );


    const researchId = result.insertId;


    const userIdPromises = people.map(async (email) => {
      const [userResult] = await db.query(
        "SELECT user_id FROM user WHERE email_id = ?",
        [email]
      );
      return userResult.length > 0 ? userResult[0].user_id : null;
    });


    const userIds = (await Promise.all(userIdPromises)).filter(
      (id) => id !== null
    );


    if (userIds.length > 0) {
      const values = userIds
        .map((userId) => `(${researchId}, ${userId})`)
        .join(",");
      await db.query(
        `INSERT INTO researcher (research_id, user_id) VALUES ${values}`
      );
    }


    res
      .status(201)
      .json({ message: "Research data added successfully", researchId });
  } catch (error) {
    console.error("Error inserting data:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


const query = (sql, params) => {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (error, results) => {
      if (error) {
        return reject(error);
      }
      resolve(results);
    });
  });
};


const excelDateToJSDate = (serial) => {
  const utcDays = Math.floor(serial - 25569);
  const utcValue = utcDays * 86400 + 25569 * 86400 + 3600 * 24; // Adjust for timezone
  return new Date(utcValue * 1000);
};


const addBulkResearchData = async (req, res) => {
  const file = req.file; // Get the uploaded file


  if (!file) {
    return res.status(400).json({ message: "No file uploaded." });
  }


  try {
    // Read the Excel file
    const workbook = XLSX.read(file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const researchData = XLSX.utils.sheet_to_json(worksheet);


    const insertPromises = researchData.map(async (data) => {
      const {
        title,
        researchDesc,
        researchFund,
        fundedBy,
        status,
        publicationDate,
        publisher,
        researchPaperLink,
        people,
      } = data;


      // Convert publicationDate from Excel serial to JS Date
      let formattedPublicationDate = null;
      if (typeof publicationDate === "number") {
        const jsDate = excelDateToJSDate(publicationDate);
        formattedPublicationDate = jsDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD
      } else {
        formattedPublicationDate = publicationDate; // If it's already a string or invalid, keep it as is
      }


      // Ensure people is an array
      let peopleArray = [];
      if (typeof people === "string") {
        peopleArray = people.split(",").map((email) => email.trim()); // Split by comma and trim whitespace
      } else if (Array.isArray(people)) {
        peopleArray = people; // If it's already an array, use it directly
      }


      // Insert research data
      const result = await query(
        `INSERT INTO researchwork
        (title, description, fund, funded_by, status, publication_date, publisher, link)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          title,
          researchDesc,
          researchFund,
          fundedBy,
          status,
          formattedPublicationDate, // Use the formatted date here
          publisher,
          researchPaperLink,
        ]
      );


      const researchId = result.insertId;


      // Get user IDs for the people associated with the research
      const userIdPromises = peopleArray.map(async (email) => {
        const userResult = await query(
          "SELECT user_id FROM user WHERE email_id = ?",
          [email]
        );
        return userResult[0] ? userResult[0].user_id : null;
      });


      const userIds = (await Promise.all(userIdPromises)).filter(
        (id) => id !== null
      );


      // Insert user IDs into the researcher table
      if (userIds.length > 0) {
        const values = userIds
          .map((userId) => `(${researchId}, ${userId})`)
          .join(",");
        await query(
          `INSERT INTO researcher (research_id, user_id) VALUES ${values}`
        );
      }
    });


    await Promise.all(insertPromises);


    res.status(201).json({ message: "Bulk research data added successfully" });
  } catch (error) {
    console.error("Error inserting bulk data:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = { addResearchData, addBulkResearchData };






