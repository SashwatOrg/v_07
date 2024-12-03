const db = require('../db/dbConnection');


// Controller function to create a program
const createEvent = (req, res) => {
  const { institute_id } = req.params;
  const { eventName, eventDesc, eventType, host, eventDate } = req.body;


  if (!eventName || !eventDesc || !eventType || !host || !eventDate) {
    return res
      .status(400)
      .send("All fields eventName, eventDesc, eventType, host, eventDate are required.");
  }


  const queryFindUser = `SELECT dept_id FROM department WHERE dept_name = ? and institute_id = ?`;


  db.query(queryFindUser, [host, institute_id], (err, userResults) => {
    if (err) {
      console.error("Error finding user:", err);
      return res.status(500).send("Error retrieving user information.");
    }


    if (userResults.length === 0) {
      return res.status(404).send("User not found.");
    }


    const deptId = userResults[0].dept_id;
    // console.log('deptId found',deptId);


    if (!deptId) {
      return res.status(404).send("User is not associated with any department.");
    }


    // Step 2: Insert the program into the `Program` table
    const queryInsertProgram = `
      INSERT INTO Events (event_name, event_description, event_type, event_date, dept_id)
      VALUES (?, ?, ?, ?, ?)`;


    db.query(
      queryInsertProgram,
      [eventName, eventDesc, eventType, eventDate, deptId],
      (err, result) => {
        if (err) {
          console.error("Error inserting event:", err);
          return res.status(500).send("Error saving program.");
        }


        res.status(201).send({
          message: "Event created successfully.",
          programId: result.insertId,
        });
      }
    );
  });
};


module.exports = { createEvent };




