const db = require('../db/dbConnection');
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Set up multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../studentDocs'); // Adjust the path as needed
    // Create the directory if it doesn't exist
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    // Use the original file name
    cb(null, file.originalname);
  }
});

// Initialize multer with the storage configuration
const upload = multer({ storage: storage }).single("file"); // Expecting a file field named 'file'

// Controller function to create an achievement
const createAchievement = (req, res) => {
  const { username } = req.params;
  const { title, description, date, assoWith, issuer, score, appNo, type } = req.body;
  console.log (title, description, date, assoWith, issuer, score, appNo, type );

  var iss = null, sc = null, apn = null, assw;

  if (type === "Honor and Award") {
    iss = issuer;
  } else if (type === "Test Score") {
    sc = score;
  } else if (type === "Patent") {
    apn = appNo;
  }

  if (!assoWith) assw = null;

  if (!title || !description || !date || !type) {
    return res.status(400).send("All fields title, description, date, type are required.");
  }

  const queryFindUser  = `SELECT user_id FROM user WHERE username = ?`;

  db.query(queryFindUser , [username], (err, userResults) => {
    if (err) {
      console.error("Error finding user:", err);
      return res.status(500).send("Error retrieving user information.");
    }

    if (userResults.length === 0) {
      return res.status(404).send("User  not found.");
    }

    const userId = userResults[0].user_id;
    console.log('userId found', userId);

    if (!userId) {
      return res.status(404).send("User  is not associated with any department.");
    }

    // Handle file upload
    upload(req, res, (uploadErr) => {
      if (uploadErr) {
        console.error("Error uploading file:", uploadErr);
        return res.status(500).send("Error uploading file.");
      }

      // Get the document path if a file was uploaded
      const documentPath = req.file ? `studentDocs/${req.file.originalname}` : null;

      const queryInsertAchievement = `
        INSERT INTO Achievements (user_id, ach_title, ach_type, ach_asso_with, ach_desc, ach_date, issuer, score, app_no, document)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      db.query(
        queryInsertAchievement,
        [userId, title, type, assw, description, date, issuer, score, appNo, documentPath],
        (err, result) => {
          if (err) {
            console.error("Error inserting achievement:", err);
            return res.status(500).send("Error saving achievement.");
          }

          res.status(201).send({
            message: "Achievement created successfully.",
            achievementId: result.insertId,
          });
        }
      );
    });
  });
};

module.exports = { createAchievement };

// const db = require('../db/dbConnection');


// // Controller function to create a program
// const createAchievement = (req, res) => {
//   const { username } = req.params;
//   const { title, description, date, assoWith, issuer, score, appNo, type } = req.body;


//   var iss = null, sc = null, apn = null, assw;
 
//   if(type === "Honor and Award"){
//     iss = issuer;
//   } else if(type === "Test Score"){
//     sc = score;
//   } else if(type === "Patent"){
//     apn = appNo;
//   }


//   if(!assoWith)
//     assw = null;


//   if (!title || !description || !date || !type) {
//     return res
//       .status(400)
//       .send("All fields title, description, date, type are required.");
//   }


//   const queryFindUser = `SELECT user_id FROM user WHERE username = ?`;


//   db.query(queryFindUser, [username], (err, userResults) => {
//     if (err) {
//       console.error("Error finding user:", err);
//       return res.status(500).send("Error retrieving user information.");
//     }


//     if (userResults.length === 0) {
//       return res.status(404).send("User not found.");
//     }


//     const userId = userResults[0].user_id;
//     console.log('userId found',userId);


//     if (!userId) {
//       return res.status(404).send("User is not associated with any department.");
//     }


//     const queryInsertClub = `
//       INSERT INTO Achievements (user_id, ach_title, ach_type, ach_asso_with, ach_desc, ach_date, issuer, score ,app_no)
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;


//     db.query(
//       queryInsertClub,
//       [userId, title, type, assw, description, date, issuer, score, appNo],
//       (err, result) => {
//         if (err) {
//           console.error("Error inserting achievement:", err);
//           return res.status(500).send("Error saving achievement.");
//         }


//         res.status(201).send({
//           message: "Achievement created successfully.",
//           programId: result.insertId,
//         });
//       }
//     );
//   });
// };


// module.exports = { createAchievement };
